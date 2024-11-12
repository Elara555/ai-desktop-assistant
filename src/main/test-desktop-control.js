const DesktopControlService = require('./services/DesktopControlService');
const { Point } = require('@nut-tree/nut-js');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function drawHeart(control, centerX, centerY) {
  const size = 50;
  const points = [];
  
  // 生成爱心形状的点
  for (let t = 0; t <= Math.PI * 2; t += 0.1) {
    const x = centerX + size * 16 * Math.pow(Math.sin(t), 3);
    const y = centerY - size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    points.push(new Point(Math.round(x), Math.round(y)));
  }
  
  // 画出爱心
  for (const point of points) {
    await control.moveMouse(point.x, point.y);
    await sleep(50);
  }
}

async function testDesktopControl() {
  const control = new DesktopControlService();
  
  try {
    const screenSize = await control.getScreenSize();
    console.log('Screen size:', screenSize);
    
    await sleep(2000);
    
    // 在屏幕中心画一个爱心
    await drawHeart(control, screenSize.width/2, screenSize.height/2);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDesktopControl();