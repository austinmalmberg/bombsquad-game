const { app, BrowserWindow, ipcMain } = require('electron');
const Session = require('./scripts/session');

const WINDOW_WIDTH = 660;
const WINDOW_HEIGHT = 732;

let mainWindow;
let session;

// ROUTING

app.on('ready', initApp);
app.on('window-all-closed', quitApp);
app.on('activate', activateApp);

// index.js
ipcMain.on('new-session-request', createSession);

// level-selector.js
ipcMain.on('set-level-request', setLevel)

// briefing.js
ipcMain.on('level-info-request', sendLevelInfo);

// bomb.js
ipcMain.on('mission-start-request', beginMission);
ipcMain.on('attempt-request', handleAttempt);

// ROUTING FUNCTIONS

function initApp() {

  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.webContents.openDevTools();

  mainWindow.loadFile('public/index.html');

  mainWindow.on('closed', () => mainWindow = null);
}

function quitApp() {

  session = null;

  if (process.platform !== 'darwin') {
    app.quit();
  }
}

function activateApp() {

  if (mainWindow === null) {
    initApp();
  }
}

function createSession(event, req) {
  session = new Session();

  event.reply('new-session-response', { status: 200 });
}

function setLevel(event, req) {
  session.currLevel = req.level;

  event.reply('set-level-response', { status: 200 });
}

function sendLevelInfo(event, req) {

  event.reply('level-info-response', {
    status: 200,
    level: session.getLevelInfo()
  });
}

function beginMission(event, req) {
  session.beginLevel();

  let levelInfo = session.getLevelInfo();

  // send bomb detonation when timer is up
  setTimeout(detonateBomb, levelInfo.bomb.detonationTime - Date.now());

  event.reply('mission-start-response', {
    status: 200,
    level: levelInfo
  });
}

function handleAttempt(event, req) {

  session.handleAttempt({
    time: Date.now(),
    code: req.code
  });

  event.reply('attempt-response', {
    status: 200,
    level: session.getLevelInfo()
  });
}

function detonateBomb() {

  session.handleAttempt({
    time: Date.now(),
    code: '____'
  });

  event.reply('attempt-response', {
    status: 200,
    level: session.getLevelInfo()
  });
}
