const { app, BrowserWindow, ipcMain } = require('electron');
const { getLevelParams } = require('./scripts/levels');

const WINDOW_WIDTH = 660;
const WINDOW_HEIGHT = 732;

let mainWindow;
let level;

// ROUTING

app.on('ready', initApp);
app.on('window-all-closed', quitApp);
app.on('activate', activateApp);

ipcMain.on('select-level-request', selectLevel)
ipcMain.on('level-parameter-request', sendLevelInfo);
ipcMain.on('mission-start-request', beginMission);

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

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function quitApp() {

  if (process.platform !== 'darwin') {
    app.quit();
  }
}

function activateApp() {

  if (mainWindow === null) {
    initApp();
  }
}

function selectLevel(event, req) {
  level = req.level;
  event.reply('select-level-response', { status: 200 });
}

function sendLevelInfo(event, req) {
  event.reply('level-parameter-response', getLevelParams(level));
}

function beginMission(event, req) {
  event.reply('mission-start-response', { bomb: getLevelParams(level), code: "1234" });
}
