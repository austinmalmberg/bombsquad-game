const { ipcRenderer } = require('electron');

ipcRenderer.send('new-session-request', {});

ipcRenderer.on('new-session-response', () => document.location = "level-selector.html");

// TODO: Start new session
// TODO: Retrieve user information from database (userinfo, completed levels, current level)
