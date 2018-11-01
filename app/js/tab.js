function generateId() {
    if (typeof generateId.counter == 'undefined') {
        generateId.counter = 0;
    }

    return generateId.counter++;
}

module.exports = class Tab {
    constructor() {
        this.id = generateId();
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