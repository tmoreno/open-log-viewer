function generateId() {
    if (typeof generateId.counter == 'undefined') {
        generateId.counter = 0;
    }

    return generateId.counter++;
}

module.exports = class Tab {
    constructor(fileName, filePath) {
        this.id = generateId();
        this.fileName = fileName;
        this.filePath = filePath;
    }

    setFileName(fileName) {
        this.fileName = fileName;
    }

    setFilePath(filePath) {
        this.filePath = filePath;
    }
}