module.exports = class Tab {
    constructor() {
        this.fileName = "Nuevo archivo";
        this.filePath = "";
        this.fileViewer = null;
    }

    setFileName(fileName) {
        this.fileName = fileName;
    }

    setFilePath(filePath) {
        this.filePath = filePath;
    }

    setFileViewer(fileViewer) {
        this.fileViewer = fileViewer;
    }

    clean() {
        this.fileViewer.clean();
    }

    appendLine(line) {
        this.fileViewer.appendLine(line);
    }

}