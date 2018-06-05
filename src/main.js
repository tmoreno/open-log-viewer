const Tail = require("./tail");

let tail = new Tail("./log-generator/error.log", 1000);

tail.on('line', (line) => {
	console.log(line);
});

tail.start();