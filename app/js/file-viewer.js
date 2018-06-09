module.exports = class FileViewer {
    constructor() {
        this.logLines = document.getElementById("log-lines");
    }

    clean() {
        while(this.logLines.firstChild) {
            this.logLines.removeChild(this.logLines.firstChild);
        }
    }

    appendLine(line) {
        let p = document.createElement("p");
		let pContent = document.createTextNode(line); 
		p.appendChild(pContent);
	
		this.logLines.appendChild(p);
    }
}
