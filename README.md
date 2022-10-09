<h1 align="center">
    <img src="./docs/img/logo.png" alt="Open Log Viewer" width="200">
    <br>
    Open Log Viewer
</h1>

<h4 align="center">
    A multi-platform log viewer built with <a href="http://electron.atom.io" target="_blank">Electron</a> and styled with Material Design.
</h4>

<p align="center">
    <a href="#key-features">Key Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#download">Download</a> •
    <a href="#release-notes">Release Notes</a> •
    <a href="#credits">Credits</a> •
    <a href="#license">License</a>
</p>

![screenshot](./docs/img/screenshot.png)

## Key Features

* Multiple opened files in tabs.
* Tail file changes.
* Filter log levels.
* Colored log entries.
* Customize log levels pattern.
* Customize log levels color.
* Cross platform
  - Windows, macOS and Linux ready.

## Installation

```bash
# Clone this repository
$ git clone https://github.com/tmoreno/open-log-viewer

# Go into the repository
$ cd open-log-viewer

# Install dependencies
$ npm install

# Build app
$ npm run build

# Run the app
$ npm run start
```

## Download

Open Log Viewer is available for Linux, Mac and Windows

macOS | Windows | Linux
-----------------| ---| ---|
<a href='https://github.com/tmoreno/open-log-viewer/releases/download/1.6.0/open-log-viewer_1.6.0.dmg'>Download</a> | <a href='https://github.com/tmoreno/open-log-viewer/releases/download/1.6.0/open-log-viewer_1.6.0.exe'>Download</a> | <a href='https://github.com/tmoreno/open-log-viewer/releases/download/1.6.0/open-log-viewer_1.6.0.deb'>Debian-based</a> |
| | | <a href='https://github.com/tmoreno/open-log-viewer/releases/download/1.6.0/open-log-viewer_1.6.0.rpm'>RedHat-based</a> |

## Release Notes

### Version 1.6.0

#### Improvements
- Added portugues Brasil translation. Thanks [Heliomar P. Marques](https://github.com/heliomarpm)

#### Bugs Fixed
- Enabled italian translation

### Version 1.5.1

#### Bugs Fixed
- Now macOS users can copy/paste using shortcuts

### Version 1.5.0

#### Improvements
- Automatic scrolling to the last log entry while new entries are append.
- Added -f/--file arguments to open a log file from the terminal.

### Version 1.4.2

#### Bugs Fixed
- New lines are append to the end of editor instead of cursor position.

### Version 1.4.1

#### Bugs Fixed
- When a line starts with more than 4 spaces the line is whited.

### Version 1.4.0

#### Improvements
- Update to Electron 8 and the rest of dependencies.

### Version 1.3.0

#### Improvements
- Now you can use valid Java Script regular expressions when you specify a pattern for a log severity.

#### Bugs Fixed
- A button to close the about dialog should appear for linux and mac.

### Version 1.2.1

#### Improvements
- Added italian translation. Thanks [Alessio Cuccovillo](https://github.com/acuccovi)

### Version 1.2.0

#### Improvements
- Added font size setting.
- Restart app when change a log pattern.  

#### Bugs Fixed
- Reset settings when click on cancel button.

### Version 1.1.2

#### Bugs Fixed
- When there are more than one file opened then files with no line matches has the previous severity color.

### Version 1.1.1

#### Bugs Fixed
- If the first line does not match any log severity pattern, then the viewer was empty.

### Version 1.1.0

#### Improvements
- Enabled search feature. Press Ctrl+F or Command+F to find words or text in the log file.
- Show line numbers.  

#### Drawbacks
- Color and patterns settings are global instead of by file.
- Changes on patterns are applied after restarting the application.
- Color and pattern settings are not migrated to this version, so you will lost them.

## Credits

This software uses the following open source packages:

- [Electron](http://electron.atom.io/)
- [Node.js](https://nodejs.org/)
- [Vue](https://vuejs.org/)
- [Vuetify](https://vuetifyjs.com/)
- [Ace](https://ace.c9.io/)

## License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details

---
> Tomás Moreno Bernal &nbsp;&middot;&nbsp;
> GitHub [@tmoreno](https://github.com/tmoreno) &nbsp;&middot;&nbsp;
> Twitter [@tmorenobernal](https://twitter.com/tmorenobernal)
