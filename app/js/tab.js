function generateId() {
    if (typeof generateId.counter == 'undefined') {
        generateId.counter = 0;
    }

    return generateId.counter++;
}

module.exports = class Tab {
    constructor(fileName, filePath, fileSettings) {
        this.id = generateId();
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileSettings = fileSettings;
    }

    setFileName(fileName) {
        this.fileName = fileName;
    }

    setFilePath(filePath) {
        this.filePath = filePath;
    }

    setFileSettings(fileSettings) {
        this.fileSettings = fileSettings;
    }
}