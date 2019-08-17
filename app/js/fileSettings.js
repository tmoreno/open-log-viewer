module.exports = class FileSettings {
    constructor() {
        this.debug = {
            textColor: "#155724", 
            backgroundColor: "rgba(212, 237, 218, 0.9)",
            pattern: ".*\\[DEBUG\\].*",
            show: true
        };

        this.info = {
            textColor: "#000000", 
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            pattern: ".*\\[INFO\\].*",
            show: true
        };

        this.warning = {
            textColor: "#856404", 
            backgroundColor: "rgba(255, 193, 7, 0.9)",
            pattern: ".*\\[WARN\\].*",
            show: true
        };

        this.error = {
            textColor: "#721c24", 
            backgroundColor: "rgba(255, 82, 82, 0.9)",
            pattern: ".*\\[ERROR\\].*",
            show: true
        };

        this.fatal = {
            textColor: "#721c24", 
            backgroundColor: "rgba(255, 82, 82, 0.9)",
            pattern: ".*\\[FATAL\\].*",
            show: true
        };
    }

    static createFromSettings(settings) {
        return Object.assign(new FileSettings(), settings);
    }

    defaultLogLevel() {
        return this.info;
    }

    getSeveritySettings(line) {
        if (line.includes(this.fatal.pattern)) {
            return this.fatal;
        }
        else if (line.includes(this.error.pattern)) {
            return this.error;
        }
        else if (line.includes(this.warning.pattern)) {
            return this.warning;
        }
        else if (line.includes(this.info.pattern)) {
            return this.info;
        }
        else if (line.includes(this.debug.pattern)) {
            return this.debug;
        }
        else {
            return null;
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

    getLogLevelsToShow() {
        return Object.keys(this).filter(severity => this[severity].show);
    }

    setLogLevelsToShow(logLevelsToShow) {
        for (let severity in this) {
            this[severity].show = false;
        }

        logLevelsToShow.forEach(severity => this[severity.toLowerCase()].show = true);
    }
}