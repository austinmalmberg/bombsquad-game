const { ipcRenderer } = require('electron');
const { formatTime } = require('./scripts/helpers');

let startBtn = document.getElementById('btn-start');
startBtn.onclick = () => document.location = "bomb.html";   // begin mission

ipcRenderer.send('level-info-request', {});

// ROUTING

ipcRenderer.on('level-info-response', displayLevelParams);


// ROUTING FUNCTIONS

function displayLevelParams(event, res) {

  let briefingOutput = document.getElementById('briefing');

  if (res.level && res.level.briefing) {
    briefingOutput.innerText = res.level.briefing;
  } else {
    briefingOutput.innerText = "Briefing unavailable.";

    // disable mission start button
    document.getElementById('btn-start').disabled = true;
  }
}
