const Tail = require("./tail");

let tail = new Tail("../log-generator/error.log", 1000);

tail.on('line', (line) => {
	let p = document.createElement("p");
	let pContent = document.createTextNode(line); 
	p.appendChild(pContent);

	document.getElementById("log-lines").appendChild(p);
});

tail.start();
