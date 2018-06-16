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
        let pre = document.createElement("pre");
        pre.innerHTML = line;
        
        let p = document.createElement("p");
        p.appendChild(pre);
        
        this.applyClassColor(p);
	
		this.logLines.appendChild(p);
    }

    scrollDown() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    applyClassColor(line) {
        if (line.textContent.includes("FATAL")) {
            line.classList.add("fatal");
        }
        else if (line.textContent.includes("ERROR")) {
            line.classList.add("error");
        }
        else if (line.textContent.includes("WARNING")) {
            line.classList.add("warning");
        }
        else if (line.textContent.includes("DEBUG")) {
            line.classList.add("debug");
        }
    }
}
