const { ipcRenderer } = require('electron');

let level = 1;

ipcRenderer.send('select-level-request', { level: level });

ipcRenderer.on('select-level-response', (event, res) => {
  document.location = "briefing.html";
});
