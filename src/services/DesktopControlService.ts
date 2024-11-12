import { mouse, keyboard, Point, screen, Key } from '@nut-tree/nut-js';

export class DesktopControlService {
  // 鼠标控制
  public async moveMouse(x: number, y: number) {
    await mouse.move([new Point(x, y)]);
  }

  public async mouseClick(button: 'left' | 'right' = 'left') {
    if (button === 'left') {
      await mouse.leftClick();
    } else {
      await mouse.rightClick();
    }
  }

  public async mouseDrag(x: number, y: number) {
    await mouse.drag([new Point(x, y)]);
  }

  // 键盘控制
  public async typeString(text: string) {
    await keyboard.type(text);
  }

  public async keyPress(key: Key) {
    await keyboard.pressKey(key);
  }

  // 获取屏幕信息
  public async getScreenSize() {
    const width = await screen.width();
    const height = await screen.height();
    return { width, height };
  }
}