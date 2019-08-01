const { ipcRenderer } = require('electron');

let startBtn = document.getElementById('btn-start');
startBtn.onclick = beginMission;

function beginMission() {
  ipcRenderer.send('start-mission-request', {});
}

ipcRenderer.send('bomb-parameters-request', {});


ipcRenderer.on('bomb-parameters-response', (e, res) => {
  document.getElementById('initial-time').innerText = res.time;
  document.getElementById('initial-attempts').innerText = res.attempts;
});

ipcRenderer.on('start-mission-response', (e, res) => {
  console.log(`start-mission-response received.`);
});
