const fs = window.node.fs;
const path = window.node.path;

const Tab = require("../tab");
const FileSettings = require("../fileSettings");

module.exports = class OpenFileCommand {
    constructor(file, tabs, userPreferences) {
        this.file = file;
        this.tabs = tabs;
        this.userPreferences = userPreferences;
    }

    execute() {
        if (fs.existsSync(this.file)) {
            const filePath = path.resolve(this.file);
            const parsedFile = path.parse(filePath);
            
            const fileSettings = new FileSettings();
            const tab = new Tab(parsedFile.base, filePath, fileSettings);

            this.tabs.push(tab);

            this.userPreferences.addFile(parsedFile.base, filePath, fileSettings);
        }
        else {
            console.log("NO");
        }
    }
}