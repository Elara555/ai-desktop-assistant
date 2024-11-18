import DesktopControlService from './DesktopControlService';
import { ToolResult } from './types';

// Mock ipcRenderer
const mockIpcRenderer = {
  invoke: async (channel: string, ...args: any[]) => {
    console.log('Mock IPC called:', channel, args);
    
    switch(channel) {
      case 'computer:action':
        const [action] = args;
        if (action === 'screenshot') {
          return {
            output: 'Screenshot saved successfully',
            filePath: 'C:\\fake\\path\\screenshot.png',
            base64_image: 'fake_base64_data_for_testing'
          };
        }
        
        if (action === 'mouse_move') {
          return {
            from: { x: 0, y: 0 },
            to: { x: args[1].x, y: args[1].y }
          };
        }
        break;
    }
  }
};

// 直接给实例注入 mock
(DesktopControlService as any).ipcRenderer = mockIpcRenderer;

async function testDesktopControl() {
  try {
    console.log('🧪 开始测试桌面控制...');

    // 测试截图并验证 base64 数据
    console.log('📸 测试截图功能...');
    const screenshotResult = await DesktopControlService.handleComputerUseRequest('computer', {
      action: 'screenshot'
    });
    
    // 添加调试信息
    console.log('截图结果:', JSON.stringify(screenshotResult, null, 2));
    
    // 验证截图结果
    console.log('检查截图结果格式...');
    validateScreenshotResult(screenshotResult);

    // 测试鼠标移动
    console.log('🖱️ 测试鼠标移动...');
    const moveResult = await DesktopControlService.handleComputerUseRequest('computer', {
      action: 'mouse_move',
      coordinate: [100, 100]
    });
    console.log('移动结果:', moveResult);
    validateMouseMoveResult(moveResult);

    console.log('✅ 测试完成!');
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 添加结果验证函数
function validateScreenshotResult(result: ToolResult) {
  console.log('验证截图结果...');
  console.log('实际返回结果:', JSON.stringify(result, null, 2));
  
  // 检查基本属性
  if (!result.success) {
    throw new Error('截图失败');
  }
  
  // 检查 toolOutput
  if (!result.toolOutput || result.toolOutput.type !== 'screenshot') {
    throw new Error('截图输出格式错误');
  }
  
  
  console.log('✅ 截图结果验证通过');
}

// 添加鼠标移动的验证函数
function validateMouseMoveResult(result: ToolResult) {
  console.log('验证鼠标移动结果...');
  console.log('实际返回结果:', JSON.stringify(result, null, 2));
  
  if (!result.success) {
    throw new Error('鼠标移动失败: ' + result.error);
  }
  
  if (!result.toolOutput || result.toolOutput.type !== 'mouse') {
    throw new Error('鼠标输出格式错误');
  }
  
  const content = result.toolOutput.content;
  if (typeof content === 'string') {
    throw new Error('鼠标内容格式错误');
  }
  
  // 类型收窄：确保 content 是 MouseOutput 类型
  if ('type' in content && content.type === 'mouse') {
    if (!content.positions || !content.positions.from || !content.positions.to) {
      throw new Error('缺少鼠标位置信息');
    }
  } else {
    throw new Error('鼠标内容格式错误：不是 MouseOutput 类型');
  }
  
  console.log('✅ 鼠标移动验证通过');
}

testDesktopControl(); 