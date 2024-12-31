const resolveExportName = require("./util/resolve-export-name");


class CJSIndexFile {
    /**
     * @type {string}
     */
    #directory = process.cwd();

    /**
     * @type {string[]}
     */
    #files = [];

    /**
     * @type {string}
     */
    #fileExtension = ".js";

    /**
     * @type {string}
     */
    #tab = "";

    /**
     * @type {number}
     */
    #tabSize = 0;


    get directory () {
        return this.#directory;
    }

    get files () {
        return this.#files;
    }

    get fileExtension () {
        return this.#fileExtension;
    }

    get tabSize () {
        return this.#tabSize;
    }

    set tabSize (
        value
    ) {
        if (
            typeof value !== "number"
        ) {
            throw new TypeError("`tabSize` must be of type \"number\".");
        }

        this.#tabSize = value;

        this.#tab = this.#getTab();
    }

    get tab () {
        return this.#tab;
    }


    constructor (
        options = {}
    ) {
        // Define the options.
        options ??= {};

        const directory = this.#directory = options.directory ??= this.#directory;
        const files = this.#files = options.files ??= this.#files;
        const fileExtension = this.#fileExtension = options.fileExtension ??= this.#fileExtension;
        const tabSize = this.tabSize = options.tabSize ??= 4;
    }


    toString () {
        let sourceCode = "module.exports = {\n";

        const exportLineEnding = "\n";
        const exportLineEndingWithComma = "," + exportLineEnding;

        for (
            let fileName of this.files
        ) {
            const exportName = resolveExportName(
                fileName.substring(
                    0,
                    fileName.length - this.fileExtension.length
                )
            );

            sourceCode
                +=  this.tab
                +   `${exportName}: require("./${fileName}")`
                +   exportLineEndingWithComma;
        }

        sourceCode = sourceCode.substring(
            0,
            sourceCode.length - exportLineEndingWithComma.length
        ) + exportLineEnding;

        sourceCode += "};"

        return sourceCode;
    }


    #getTab () {
        let tab = "";

        for (
            let i = 0;
            i < this.tabSize;
            i++
        ) {
            tab += " ";
        }

        return tab;
    }
}


module.exports = CJSIndexFile;
