#!/usr/bin/env node
const path = require("path");

const {
    parseArgs
} = require("util");


const {
    glob
} = require("glob");


const {
    ERROR_CODE_SUCCESS,
    ERROR_CODE_GENERIC
} = require("../src/error-codes");

const {
    resolvePathsSync
} = require("../src/util");

const {
    exportgen
} = require("../src");
const { readFile } = require("fs/promises");

async function readConfigFromPackageJSON () {
    const packageJSONPath = path.join(process.cwd(), "package.json");

    const packageJSON = JSON.parse(await readFile(packageJSONPath, "utf-8"));

    const config = packageJSON.exportgen;

    return config;
}

async function main (
    args
) {
    const directories = args.positionals;

    const modulePath = process.cwd();

    // TODO: Add support for Inclusion Mode.
    // Define a list of excluded directories.
    // const excludedDirectories = directories
    //     .slice(0)
    //     .map(
    //         x => path.resolve(x)
    //     );

    let excludedDirectories = [ ...directories ];

    const config = await readConfigFromPackageJSON();

    if (config && config.exclude && config.exclude.length >= 1) {
        excludedDirectories.push(...config.exclude);
    }

    excludedDirectories = resolvePathsSync(...excludedDirectories);

    const verbose = false;

    // resolvePathsSync(
    //     ...excludedDirectories
    // );

    await exportgen(
        {
            modulePath,
            excludedDirectories,
            verbose
        }
    );


    return ERROR_CODE_SUCCESS;
}


function start (
    args
) {
    (
        async () => {
            process.exit(
                await main(args)
            );
        }
    )();
}


// Get the command line arguments.
const args = parseArgs(
    {
        allowNegative: true,
        allowPositionals: true,
        strict: true
    }
);

// Call the main function.
start(args);
