function replaceHyphenSequences (
    exportName
) {
    return exportName
        .replaceAll("-a", "A")
        .replaceAll("-b", "B")
        .replaceAll("-c", "C")
        .replaceAll("-d", "D")
        .replaceAll("-e", "E")
        .replaceAll("-f", "F")
        .replaceAll("-g", "G")
        .replaceAll("-h", "H")
        .replaceAll("-i", "I")
        .replaceAll("-j", "J")
        .replaceAll("-k", "K")
        .replaceAll("-l", "L")
        .replaceAll("-m", "M")
        .replaceAll("-n", "N")
        .replaceAll("-o", "O")
        .replaceAll("-p", "P")
        .replaceAll("-q", "Q")
        .replaceAll("-r", "R")
        .replaceAll("-s", "S")
        .replaceAll("-t", "T")
        .replaceAll("-u", "U")
        .replaceAll("-v", "V")
        .replaceAll("-w", "W")
        .replaceAll("-x", "X")
        .replaceAll("-y", "Y")
        .replaceAll("-z", "Z")
        .replaceAll("-", "");
}


function resolveExportName (
    exportName
) {
    // If the export name doesn't contain a hyphen ("-"):
    if (
        !exportName.includes("-")
    ) {
        // Return the export name.
        return exportName;
    }

    // Replace any hyphen sequences within the export name.
    exportName = replaceHyphenSequences(
        exportName
    );

    // Return the export name.
    return exportName;
}


module.exports = resolveExportName;
