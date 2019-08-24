module.exports = class GlobalSettings {
    constructor(settings) {
        this.debug = {
            textColor: "#155724", 
            backgroundColor: "rgba(212, 237, 218, 0.9)",
            pattern: "[DEBUG]"
        };

        this.info = {
            textColor: "#000000", 
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            pattern: "[INFO]"
        };

        this.warning = {
            textColor: "#856404", 
            backgroundColor: "rgba(255, 193, 7, 0.9)",
            pattern: "[WARN]"
        };

        this.error = {
            textColor: "#721c24", 
            backgroundColor: "rgba(255, 82, 82, 0.9)",
            pattern: "[ERROR]"
        };

        this.fatal = {
            textColor: "#721c24", 
            backgroundColor: "rgba(255, 82, 82, 0.9)",
            pattern: "[FATAL]"
        };

        if (settings) {
            Object.assign(this, settings);
        }
    }

    changeTextColor(severity, textColor) {
        this[severity.toLowerCase()].textColor = textColor;
    }

    changeBackgroundColor(severity, backgroundColor) {
        this[severity.toLowerCase()].backgroundColor = backgroundColor;
    }

    changePattern(severity, pattern) {
        this[severity.toLowerCase()].pattern = pattern;
    }
}