const Tail = require("./tail");

document.getElementById("file-chooser").onchange = function() {
	const selectedFilePath = this.files[0].path;

	cleanLogLines();

	let tail = new Tail(selectedFilePath, 1000);
	
	tail.on('line', (line) => {
		let p = document.createElement("p");
		let pContent = document.createTextNode(line); 
		p.appendChild(pContent);
	
		document.getElementById("log-lines").appendChild(p);
	});
	
	tail.start();
};

function cleanLogLines() {
	let logLines = document.getElementById("log-lines");

	while(logLines.firstChild) {
		logLines.removeChild(logLines.firstChild);
	}
}