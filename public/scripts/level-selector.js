const { ipcRenderer } = require('electron');

let slider = document.getElementById('level--slider');
let submitButton = document.getElementById('level--submit--button');

submitButton.onclick = () => ipcRenderer.send('set-level-request', { level: slider.value });

ipcRenderer.on('set-level-response', (event, res) => {
    document.location = "briefing.html";
});
