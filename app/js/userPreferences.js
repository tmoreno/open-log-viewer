const Store = __non_webpack_require__('electron-store');

let instance = null;

module.exports = class UserPreferences {
    constructor() {
        if (!instance) {
            instance = this;
        }

        this.store = new Store();

        return instance;
    }

    addFile(fileName, filePath) {
        let files = this.getFiles();

        files.push({name: fileName, path: filePath});

        this.store.set("files", files);
    }

    removeFile(fileToRemove) {
        let files = this.getFiles();

        files = files.filter(file => {
            return file.path !== fileToRemove;
        });

        this.store.set("files", files);
    }

    getFiles() {
        return this.store.get("files", []);
    }

    saveDebugSeveritySettings(textColor, backgroundColor) {
        this.saveSeveritySettings("debug", textColor, backgroundColor);
    }
    
    saveInfoSeveritySettings(textColor, backgroundColor) {
        this.saveSeveritySettings("info", textColor, backgroundColor);
    }

    saveWarningSeveritySettings(textColor, backgroundColor) {
        this.saveSeveritySettings("warning", textColor, backgroundColor);
    }

    saveErrorSeveritySettings(textColor, backgroundColor) {
        this.saveSeveritySettings("error", textColor, backgroundColor);
    }

    saveFatalSeveritySettings(textColor, backgroundColor) {
        this.saveSeveritySettings("fatal", textColor, backgroundColor);
    }

    saveSeveritySettings(severity, textColor, backgroundColor) {
        this.store.set("settings." + severity, {textColor: textColor, backgroundColor: backgroundColor});
    }

    getDebugSeveritySettings() {
        return this.store.get("settings.debug", {textColor: "#155724", backgroundColor: "#d4edda"});
    }
    
    getInfoSeveritySettings() {
        return this.store.get("settings.info", {textColor: "#000000", backgroundColor: "#ffffff"});
    }

    getWarningSeveritySettings() {
        return this.store.get("settings.warning", {textColor: "#856404", backgroundColor: "#ffc107"});
    }

    getErrorSeveritySettings() {
        return this.store.get("settings.error", {textColor: "#721c24", backgroundColor: "#ff5252"});
    }

    getFatalSeveritySettings() {
        return this.store.get("settings.fatal", {textColor: "#721c24", backgroundColor: "#ff5252"});
    }
}