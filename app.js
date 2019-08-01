const { app, BrowserWindow, ipcMain } = require('electron');

const WINDOW_WIDTH = 660;
const WINDOW_HEIGHT = 732;

let mainWindow;

function initApp() {

  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // mainWindow.webContents.openDevTools();

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

ipcMain.on('start-mission-request', )

app.on('ready', initApp);
app.on('window-all-closed', quitApp);
app.on('activate', activateApp);
