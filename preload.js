window.electron = {
    app: require("electron").remote.app
};

window.node = {
    fs: require("fs"),
    events: require("events"),
    readline: require("readline")
};

window.dependecies = {
    electronStore: require("electron-store")
};
