
// TODO: Implement console where you can type commands to assist in diffusing
// TODO: Display make/model in the HUD.  This will allow user to know basic console commmands

const { ipcRenderer } = require('electron');
const { formatTime } = require('./scripts/helpers');

// bomb.html elements
const keypadButtons = document.getElementsByClassName('keypad--button');
const timer = document.getElementById('timer');
const attempts = document.getElementById('attempts');

let bomb, interval;
let userCode = [];
const FLASH_DURATION = 1000;
let hintTimers = [];

let keyMap = new Map();
for (let btn of keypadButtons) {
  keyMap.set(btn.value, btn);
}

ipcRenderer.send('mission-start-request', {});

// ROUTING

ipcRenderer.on('mission-start-response', beginMission);
ipcRenderer.on('attempt-response', updateBomb);
ipcRenderer.on('bomb-detonation', updateBomb);

// add button listeners
for (let btn of keypadButtons) {
  btn.onclick = () => handleInput(btn);
  btn.onmousedown = () => btn.classList.add('button--pressed');
  btn.onmouseup = () => btn.classList.remove('button--pressed');
}

// add key listeners
document.onkeydown = (keyEvent) => {
  if (!keyMap.has(keyEvent.key))
    return;

  keyMap.get(keyEvent.key).classList.add('button--pressed');
};
document.onkeyup = (keyEvent) => {
  if (!keyMap.has(keyEvent.key))
    return;

  let btn = keyMap.get(keyEvent.key);
  btn.classList.remove('button--pressed');

  if (!userCode.includes(btn))
    handleInput(btn);
};

// ROUTING FUNCTIONS

function beginMission(event, res) {
  bomb = res.level.bomb;

  if (bomb.state != 'running')
    return;

  updateTimer();
  interval = setInterval(updateTimer, 13);

  attempts.innerText = bomb.attemptsRemaining;
}

function updateBomb(event, res) {
  bomb = res.level.bomb;

  if (bomb.hints)
    flashHints(bomb.hints);

  attempts.innerText = bomb.attemptsRemaining;

  if (bomb.attemptsRemaining <= 3)
    attempts.classList.add('danger');

  // need to remove .danger class on +attempts implementation

  switch (bomb.state) {
    case 'diffused':
      win();
      break;

    case 'exploded':
      lose();
      break;

    default:
      console.log('Incorrect code');
      break;
  }
}

function updateTimer() {
  let remaining = bomb.detonationTime - Date.now();

  if (remaining > 0) {
    timer.innerText = formatTime(remaining);
  } else {
    timer.innerText = formatTime(0);
    ipcRenderer.send('bomb-detonation-request', {});
  }
}

function handleInput(btn) {
  if (bomb.state != 'running')
    return;

  btn.disabled = true;
  userCode.push(btn);

  if (userCode.length >= 4) {

    ipcRenderer.send('attempt-request', {
      code: userCode.map(b => b.value).join(''),
      time: Date.now()
    });

    for (let b of userCode) {
      b.disabled = false;
    }

    userCode = [];
  }
}

// LOCAL FUNCTIONS

function flashHints([ inPosition, inCode ]) {

  // timed animation
  // green numbers are in the correct position
  // blue numbers are in the code, but not in the correct position

  for (let i of inPosition) {
    let btn = keyMap.get(i);
    btn.classList.add('in--position');
    hintTimers.push(
      setTimeout(() => btn.classList.remove('in--position'), FLASH_DURATION)
    );
  }

  for (let i of inCode) {
    let btn = keyMap.get(i);
    btn.classList.add('in--code');
    hintTimers.push(
      setTimeout(() => btn.classList.remove('in--code'), FLASH_DURATION)
    );
  }
}

function clearHintTimers() {
  for (let timer of hintTimers) {
    clearTimeout(timer);
  }

  hintTimers = [];
}

function win() {
  clearInterval(interval);

  console.log('You diffused the bomb!');

  // redirect?
}

function lose() {
  clearInterval(interval);

  console.log('Bomb exploded!  Game over!');
  // redirect?
}
