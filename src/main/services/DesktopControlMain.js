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
      
      console.log('Attempting to save screenshot to:', filePath);
      
      // 截图
      await screen.capture(filePath);
      
      // 先检查根目录
      const rootFilePath = path.join(process.cwd(), fileName);
      console.log('Checking root directory for:', rootFilePath);
      
      let actualFilePath = filePath;
      
      // 如果文件在根目录，则移动到目标目录
      const rootFileExists = await fs.access(rootFilePath)
        .then(() => true)
        .catch(() => false);
        
      if (rootFileExists) {
        console.log('Found screenshot in root directory, moving to:', filePath);
        await fs.rename(rootFilePath, filePath);
        actualFilePath = filePath;
      }
      
      console.log('Screenshot saved successfully to:', actualFilePath);
      
      return { 
        output: 'Screenshot saved successfully',
        filePath: actualFilePath
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