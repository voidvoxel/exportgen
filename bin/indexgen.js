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
    indexgen
} = require("../src");


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

    const excludedDirectories = resolvePathsSync(
        directories
    );

    const verbose = false;

    // resolvePathsSync(
    //     ...excludedDirectories
    // );

    await indexgen(
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