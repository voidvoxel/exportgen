const path = require("path");


/**
 *
 * @param  {...any} filePaths
 * An array of paths to resolve.
 * @returns
 */
function resolvePathsSync (
    ...filePaths
) {
    // If no paths were provided, return `null`.
    if (filePaths.length === 0)
        return [];

    // If 1 path was provided, return a `string`.
    if (filePaths.length === 1) {
        const filePath = filePaths[0];

        if (typeof filePath === "string")
            return [ path.resolve(filePaths[0]) ];
        else if (typeof filePath === "object")
            filePaths = Object.values(filePaths[0]);
    }

    // If either an array, an object, or multiple paths were provided, return a `string[]`.
    for (
        let i = 0;
        i < filePaths.length;
        i++
    ) {
        // If the file path is a `string`:
        if (typeof filePaths[i] === "string")
            filePaths[i] = path.resolve(filePaths[i]);
        // If the file path is not a `string`:
        else {
            // If the file path is not an `object`, convert it into a string.
            if (typeof filePaths[i] !== "object")
                filePaths[i] = filePaths[i].toString();

            filePaths[i] = resolvePathsSync(filePaths[i]);
        }
    }

    return filePaths;
}


module.exports = {
    resolvePathsSync
};
