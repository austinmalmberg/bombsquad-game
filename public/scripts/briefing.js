const { ipcRenderer } = require('electron');
const { formatTime } = require('./scripts/helpers');

ipcRenderer.send('level-parameter-request', {});

let startBtn = document.getElementById('btn-start');
startBtn.onclick = beginMission;

function beginMission() {
  document.location = "bomb.html";
}

// ROUTING

ipcRenderer.on('level-parameter-response', displayLevelParams);


// ROUTING FUNCTIONS

function displayLevelParams(event, res) {

  if (res.briefing) {
    document.getElementById('briefing').innerText = res.briefing;
  } else {
    document.getElementById('initial-time').innerText = formatTime(res.time);
    document.getElementById('initial-attempts').innerText = res.attempts;
  }
}
