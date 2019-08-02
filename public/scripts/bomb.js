
// TODO: Rename to level
// TODO: Implement console where you can type commands to assist in diffusing
// TODO: Display make/model in the HUD.  This will allow user to know basic console commmands

const { ipcRenderer } = require('electron');
const { formatTime } = require('./scripts/helpers');

let keypadButtons = document.getElementsByClassName('keypad--button');
let timer = document.getElementById('timer');
let attempts = document.getElementById('attempts');

let bomb, diffuseCode, detonationTime, interval;
let userCode, timeRemaining, attemptsRemaining;
let running;

ipcRenderer.send('mission-start-request', {});

ipcRenderer.on('mission-start-response', beginMission);

// add button listeners
for (let btn of keypadButtons) {
  btn.onclick = () => handleInput(btn.value);
  btn.onmousedown = () => btn.classList.add('button--pressed');
  btn.onmouseup = () => btn.classList.remove('button--pressed');
}

// add key listeners
document.onkeypress = (keyEvent) => handleInput(keyEvent.key);
document.onkeydown = (keyEvent) => {
  for (let btn of keypadButtons) {
    if (btn.value === keyEvent.key) {
      btn.classList.add('button--pressed');
      break;
    }
  }
};
document.onkeyup = (keyEvent) => {
  for (let btn of keypadButtons) {
    if (btn.value === keyEvent.key) {
      btn.classList.remove('button--pressed');
      break;
    }
  }
};


function beginMission(event, res) {
  running = true;
  bomb = res.bomb;
  diffuseCode = res.code;

  userCode = "";

  detonationTime = Date.now() + bomb.time;
  updateTimer();

  // start timer
  interval = setInterval(updateTimer, 13);

  attemptsRemaining = bomb.attempts;
  updateAttempts();
}

function updateTimer() {
  let remaining = detonationTime - Date.now();

  if (remaining > 0) {
    timer.innerText = formatTime(remaining);
  } else {
    timer.innerText = formatTime(0);
    lose();
  }
}

function updateAttempts() {
  attempts.innerText = attemptsRemaining;
}

function handleInput(digit) {
  if (!running)
    return;

  userCode += digit;

  if (userCode.length >= 4) {

    --attemptsRemaining;

    if (attemptsRemaining <= 3) {
      attempts.classList.add('danger');
    }

    updateAttempts();

    handleGuess();

    userCode = "";
  }
}

function handleGuess() {
  if (userCode === diffuseCode) {
    win();
  } else if (attemptsRemaining <= 0) {
    lose();
  } else {
    console.log(`${userCode} incorrect`);
  }
}

function win() {
  running = false;
  clearInterval(interval);

  console.log('You diffused the bomb!');

  // redirect?
}

function lose() {
  running = false;
  clearInterval(interval);

  console.log('Bomb exploded!  Game over!');
  // redirect?
}
