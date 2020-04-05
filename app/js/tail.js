const fs = window.node.fs;
const readline = window.node.readline;
const EventEmitter = window.node.events;

module.exports = class Tail extends EventEmitter {
    constructor(file, timeoutInMillis) {
        super();

        this.file = file;
        this.timeoutInMillis = timeoutInMillis;
        this.startPosition = 0;
    }

    start() {
        return new Promise((resolve, reject) => {
            try {
                let lines = [];
                let stats = fs.statSync(this.file);
                let fileSizeInBytes = stats.size;
        
                readline.createInterface({
                    input: fs.createReadStream(this.file, {start: this.startPosition})
                })
                .on('close', () => {
                    this.startPosition = fileSizeInBytes;
        
                    this.emit('readLines', lines);
        
                    this.timerId = setTimeout(() => this.start().catch(error => reject(error)), this.timeoutInMillis);
                })
                .on('line', line => {
                    lines.push(line);
                });
            }
            catch(error) {
                reject(error);
            }
        });
    }

    stop() {
        clearTimeout(this.timerId);
    }
}