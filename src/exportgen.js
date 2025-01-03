const path = require("path");

const {
    glob
} = require("glob");
const { readdir, writeFile } = require("fs/promises");
const CJSIndexFile = require("./CJSIndexFile");

// Define glob patterns.
const globPatterns = {};

// JavaScript source code files
globPatterns.CJS_FILES = "**/*.cjs";
globPatterns.JS_FILES = "**/*.js";
globPatterns.MJS_FILES = "**/*.mjs";

function isWithinExcludedDirectory (
    filePath = null,
    excludedDirectories = []
) {
    filePath ??= process.cwd();

    for (
        const excludedDirectory of excludedDirectories
    ) {
        if (
            filePath.startsWith(
                excludedDirectories
            )
        ) {
            return true;
        }
    }

    return false;
}

async function getFilesWithExtension (
    options = {}
) {
    options ??= {};

    const rootDirectory = options.rootDirectory ??= process.cwd();
    const fileExtension = options.fileExtension ??= "";
    const excludedDirectories = options.excludedDirectories ??= [];

    const globPattern = path.join(
        rootDirectory,
        "**",
        "*" + fileExtension
    );

    // Define a list of every JavaScript file.
    const filePaths = await glob(
        globPattern,
        {
            ignore: "node_modules/**"
        }
    );

    // Filter the list to exclude any files located within excluded directories.
    const filteredFilePaths = [];

    for (
        const filePath of filePaths
    ) {
        let isExcluded = isWithinExcludedDirectory(
            filePath,
            excludedDirectories
        );

        if (!isExcluded)
            filteredFilePaths.push(filePath);
    }

    return filteredFilePaths;
}

async function getDirectories (
    ...filePaths
) {
    const directoryTable = {};

    for (
        const filePath of filePaths
    ) {
        const directory = path.dirname(filePath);

        directoryTable[directory] = true;
    }

    const directories = Object.keys(directoryTable);

    return directories;
}

async function createIndexFile (
    options = {}
) {
    // Define the options.
    options ??= {};

    const directory = options.directory ??= process.cwd();
    const files = options.files ??= [];
    const fileExtension = options.fileExtension ??= ".js";

    // Create the index file.
    const sourceCode = new CJSIndexFile(
        options
    ).toString();

    // Define the path to the index file.
    const indexFilePath = path.join(
        directory,
        "index" + fileExtension
    );

    // Write the index source code to the index file.
    await writeFile(
        indexFilePath,
        (sourceCode + "\n"),
        "utf-8"
    );

    return indexFilePath;
}

async function exportgen (
    options = {}
) {
    // Define the options.
    options ??= {};

    const modulePath = options.modulePath ??= process.cwd();
    const excludedDirectories = options.excludedDirectories ??= [];
    const fileExtension = options.fileExtension ??= ".js";
    const verbose = options.verbose ??= false;

    const jsFiles = await getFilesWithExtension(
        {
            rootDirectory: modulePath,
            excludedDirectories,
            fileExtension
        }
    );

    const jsDirectories = await getDirectories(...jsFiles);

    for (
        let directory of jsDirectories
    ) {
        if (directory === modulePath)
            continue;

        const files = [];

        // Filter out any file paths that don't end with the file extension.
        (
            await readdir(directory)
        ).map(
            filePath => {
                if (
                    filePath.endsWith(
                        fileExtension
                    )
                ) {
                    files.push(filePath);
                }
            }
        );

        const indexFileName = "index" + fileExtension;

        if (
            files.includes(
                indexFileName
            )
        ) {
            if (verbose) {
                const relativeIndexFilePath = path.relative(
                    modulePath,
                    path.join(
                        directory,
                        indexFileName
                    )
                );

                const relativeDirectory = path.dirname(
                    relativeIndexFilePath
                );

                console.log(
                    `Skipping existing index file in \`${relativeDirectory}\``
                );
            }

            continue;
        }

        await createIndexFile(
            {
                directory,
                files,
                fileExtension
            }
        );
    }
}

module.exports = exportgen;
