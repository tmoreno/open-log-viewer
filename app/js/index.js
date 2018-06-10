const FileViewer = require("./file-viewer");
const Tail = require("./tail");

let fileViewer = new FileViewer();

document.getElementById("file-chooser").onchange = function() {
	if (this.files.length > 0) {
		const selectedFilePath = this.files[0].path;
	
		fileViewer.clean();
	
		let tail = new Tail(selectedFilePath, 1000);
		
		tail.on('line', (line) => {
			fileViewer.appendLine(line);
		});
		
		tail.start();
	}
};
