import { DesktopControlClient } from './DesktopControlClient';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testIPCControl() {
  try {
    console.log('开始 IPC 测试...');
    
    // 获取屏幕尺寸
    const screenSize = await DesktopControlClient.getScreenSize();
    console.log('屏幕尺寸:', screenSize);
    
    // 等待 2 秒
    await sleep(2000);
    
    // 移动鼠标到屏幕中心
    const centerX = screenSize.width / 2;
    const centerY = screenSize.height / 2;
    await DesktopControlClient.moveMouse(centerX, centerY);
    
    console.log('测试完成！');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testIPCControl(); 