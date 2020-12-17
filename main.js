const {app, BrowserWindow} = require('electron');
const { program } = require('commander');
const path = require('path');

if (process.env.NODE_ENV === "development") {
	require('electron-reload')(__dirname);
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
	createCli();

	mainWindow = new BrowserWindow({
		width: 1024, 
		height: 768,
		webPreferences: {
			preload: path.join(__dirname, "preload.js")
		}
	});

	mainWindow.loadFile("./app/index.html");

	if (process.env.NODE_ENV === "development") {
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	require('./mainMenu');
}

app.on('ready', createWindow);

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

function createCli() {
	program
		.version(require('./package').version, '-v, --version')
		.description('A multi-platform log viewer built with Electron and styled with Material Design')
		.option('-f, --file <file-path>', 'file to open')
		.parse();
}
