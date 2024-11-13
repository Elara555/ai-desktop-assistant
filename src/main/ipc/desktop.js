const { ipcMain } = require('electron');
const DesktopControlMain = require('../services/DesktopControlMain');

const desktopService = new DesktopControlMain();

function setupDesktopControlIPC() {
  ipcMain.handle('desktop:moveMouse', async (_, x, y) => {
    return await desktopService.moveMouse(x, y);
  });

  ipcMain.handle('desktop:mouseClick', async (_, button = 'left') => {
    return await desktopService.mouseClick(button);
  });

  ipcMain.handle('desktop:typeString', async (_, text) => {
    return await desktopService.typeString(text);
  });

  ipcMain.handle('desktop:getScreenSize', async () => {
    return await desktopService.getScreenSize();
  });
}

module.exports = { setupDesktopControlIPC }; 