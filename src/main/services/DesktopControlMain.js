const { screen } = require('@nut-tree/nut-js');
const path = require('path');
const fs = require('fs').promises;
const { app } = require('electron');

class DesktopControlMain {
  async takeScreenshot() {
    try {
      console.log('Taking screenshot in main process...');
      
      // 使用 app.getPath 获取用户数据目录
      const userDataPath = app.getPath('userData');
      const screenshotDir = path.join(userDataPath, 'screenshots');
      
      // 确保目录存在
      await fs.mkdir(screenshotDir, { recursive: true });
      
      const fileName = `screenshot-${Date.now()}.png`;
      const filePath = path.join(screenshotDir, fileName);
      
      console.log('Saving screenshot to:', filePath);
      
      // 修改这里：直接传递文件路径给 capture 方法
      await screen.capture(filePath);
      
      // 验证文件是否已创建
      const fileExists = await fs.access(filePath)
        .then(() => true)
        .catch(() => false);
        
      if (!fileExists) {
        throw new Error('Screenshot file was not created');
      }
      
      console.log('Screenshot saved successfully to:', filePath);
      
      return { 
        output: 'Screenshot saved successfully',
        filePath: filePath
      };
    } catch (error) {
      console.error('Screenshot error:', error);
      return { error: error.message };
    }
  }

  async handleComputerAction(action, params) {
    console.log('Main process received action:', action, params);
    
    try {
      switch (action) {
        case 'screenshot':
          return await this.takeScreenshot();
        default:
          throw new Error(`Unsupported action: ${action}`);
      }
    } catch (error) {
      console.error('Error in handleComputerAction:', error);
      return { error: error.message };
    }
  }
}

module.exports = new DesktopControlMain();