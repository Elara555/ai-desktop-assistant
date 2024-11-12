import { DesktopControlService } from './DesktopControlService';
import { Key, Point } from '@nut-tree/nut-js';  // 添加 Point 导入

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function drawHeart(control: DesktopControlService, centerX: number, centerY: number) {
  const size = 50;
  const points = [];
  
  // 生成爱心形状的点
  for (let t = 0; t <= Math.PI * 2; t += 0.1) {
    const x = centerX + size * 16 * Math.pow(Math.sin(t), 3);
    const y = centerY - size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    points.push(new Point(Math.round(x), Math.round(y)));  // 添加 Math.round 确保坐标是整数
  }
  
  // 画出爱心
  for (const point of points) {
    await control.moveMouse(point.x, point.y);
    await sleep(50);  // 慢一点，这样能看清形状
  }
}

async function testDesktopControl() {
  const control = new DesktopControlService();
  
  try {
    const screenSize = await control.getScreenSize();
    console.log('Screen size:', screenSize);
    
    await sleep(2000);  // 等待2秒开始
    
    // 在屏幕中心画一个爱心
    await drawHeart(control, screenSize.width/2, screenSize.height/2);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDesktopControl();