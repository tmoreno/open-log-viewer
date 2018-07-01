const fs = __non_webpack_require__("fs");
const readline = __non_webpack_require__("readline");
const EventEmitter = __non_webpack_require__("events");

module.exports = class Tail extends EventEmitter {
    constructor(file, timeoutInMillis) {
        super();

        this.file = file;
        this.timeoutInMillis = timeoutInMillis;
        this.startPosition = 0;
    }

    start() {
        let lines = [];
        let stats = fs.statSync(this.file);
        let fileSizeInBytes = stats.size;

        let lineReader = readline.createInterface({
            input: fs.createReadStream(this.file, {start: this.startPosition})
        });
        
        lineReader.on('close', () => {
            this.startPosition = fileSizeInBytes;

            this.emit('readLines', lines);

            this.timerId = setTimeout(() => {
                this.start()
            }, this.timeoutInMillis);
        });

        lineReader.on('line', line => {
            lines.push(line);
        });
    }

    stop() {
        clearTimeout(this.timerId);
    }
}