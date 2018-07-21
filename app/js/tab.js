module.exports = class Tab {
    constructor() {
        this.fileName = "Nuevo archivo";
        this.filePath = "";
    }

    setFileName(fileName) {
        this.fileName = fileName;
    }

    setFilePath(filePath) {
        this.filePath = filePath;
    }
}