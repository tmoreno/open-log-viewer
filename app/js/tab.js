module.exports = class Tab {
    constructor() {
        this.title = "Nuevo archivo";
        this.fileViewer = null;
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