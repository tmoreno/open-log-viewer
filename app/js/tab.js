module.exports = class Tab {
    constructor() {
        this.fileName = "Nuevo archivo";
        this.filePath = "";
        this.removed = false;
    }

    setFileName(fileName) {
        this.fileName = fileName;
    }

    setFilePath(filePath) {
        this.filePath = filePath;
    }
}