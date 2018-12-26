module.exports = class FileSettings {
    constructor() {
        this.debug = {
            textColor: "#155724", 
            backgroundColor: "#d4edda",
            pattern: "[DEBUG]"
        };

        this.info = {
            textColor: "#000000", 
            backgroundColor: "#ffffff",
            pattern: "[INFO]"
        };

        this.warning = {
            textColor: "#856404", 
            backgroundColor: "#ffc107",
            pattern: "[WARN]"
        };

        this.error = {
            textColor: "#721c24", 
            backgroundColor: "#ff5252",
            pattern: "[ERROR]"
        };

        this.fatal = {
            textColor: "#721c24", 
            backgroundColor: "#ff5252",
            pattern: "[FATAL]"
        };
    }
}