const { mouse, keyboard, Point, screen } = require('@nut-tree/nut-js');

class DesktopControlService {
  // 鼠标控制
  async moveMouse(x, y) {
    await mouse.move([new Point(x, y)]);
  }

  async mouseClick(button = 'left') {
    if (button === 'left') {
      await mouse.leftClick();
    } else {
      await mouse.rightClick();
    }
  }

  async mouseDrag(x, y) {
    await mouse.drag([new Point(x, y)]);
  }

  // 键盘控制
  async typeString(text) {
    await keyboard.type(text);
  }

  async keyPress(key) {
    await keyboard.pressKey(key);
  }

  // 获取屏幕信息
  async getScreenSize() {
    const width = await screen.width();
    const height = await screen.height();
    return { width, height };
  }
}

module.exports = DesktopControlService;