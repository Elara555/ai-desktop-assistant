const { ipcMain } = require('electron');
const desktopControl = require('../services/DesktopControlMain');

function setupDesktopIPC() {
  // 处理屏幕尺寸请求
  ipcMain.handle('computer:getScreenSize', async () => {
    return await desktopControl.getScreenSize();
  });

  // 处理计算机控制动作
  ipcMain.handle('computer:action', async (_, action, params) => {
    return await desktopControl.handleComputerAction(action, params);
  });
}

module.exports = { setupDesktopIPC }; 