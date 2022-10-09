const { dialog, shell, Menu } = require('electron');

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
        label: 'Edit',
        submenu: [
            { 
                label: 'Undo', 
                accelerator: 'CmdOrCtrl+Z', 
                role: 'undo'
            },
            { 
                label: 'Redo', 
                accelerator: 'CmdOrCtrl+Y', 
                role: 'redo'
            },
            { 
                type: "separator" 
            },
            { 
                label: 'Cut', 
                accelerator: 'CmdOrCtrl+X', 
                role: 'cut'
            },
            { 
                label: 'Copy', 
                accelerator: 'CmdOrCtrl+C', 
                role: 'copy'
            },
            { 
                label: 'Paste', 
                accelerator: 'CmdOrCtrl+V', 
                role: 'paste'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectAll'
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Source code',
                click: () => { 
                    shell.openExternal('https://github.com/tmoreno/open-log-viewer');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'About',
                click: () => { 
                    dialog.showMessageBox({
                        type: "info",
                        title: "About",
                        buttons: ["OK"],
                        message: "Open Log Viewer 1.6.0",
                        detail: "Developed by Tomás Moreno Bernal\nLicensed under the GNU General Public License v3.0"
                    });
                }
            }
        ]
    }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));