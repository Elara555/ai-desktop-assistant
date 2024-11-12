const { ipcRenderer } = window.require('electron');

export class DesktopControlClient {
  static async moveMouse(x: number, y: number) {
    return await ipcRenderer.invoke('desktop:moveMouse', x, y);
  }

  static async mouseClick(button = 'left') {
    return await ipcRenderer.invoke('desktop:mouseClick', button);
  }

  static async getScreenSize() {
    return await ipcRenderer.invoke('desktop:getScreenSize');
  }
} 