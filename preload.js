window.electron = {
    app: require("electron").remote.app,
    remote: require("electron").remote
};

window.node = {
    fs: require("fs"),
    events: require("events"),
    readline: require("readline"),
    path: require("path")
};

window.dependecies = {
    electronStore: require("electron-store")
};
