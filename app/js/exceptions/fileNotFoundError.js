module.exports = class FileNotFoundError extends Error {
    constructor(file) {
        super("File not found: " + file);
    }
}