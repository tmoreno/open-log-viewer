const { Menu } = require('electron');
const { dialog } = require('electron');
const electron = require('electron');
const app = electron.app;

const template = [
    {
        label: 'File',
        submenu: [
            {
                role: 'quit'
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Source code',
                click () { 
                    electron.shell.openExternal('https://github.com/tmoreno/open-log-viewer');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'About',
                click () { 
                    dialog.showMessageBox({
                        type: "info",
                        title: "About",
                        buttons: ["OK"],
                        message: "Open Log Viewer 1.4.0",
                        detail: "Developed by Tomás Moreno Bernal\nLicensed under the GNU General Public License v3.0"
                    });
                }
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)