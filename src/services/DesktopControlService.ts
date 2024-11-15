import { ipcRenderer, shell } from 'electron';
import { ToolOutput, ToolResult, MouseActionType } from './types';

export class DesktopControlService {
  async getScreenSize(): Promise<{ width: number; height: number }> {
    return await ipcRenderer.invoke('computer:getScreenSize');
  }

  async handleComputerUseRequest(name: string, input: any): Promise<ToolResult> {
    console.log('🚀 开始处理桌面控制请求:', { name, input });
    
    try {
      const result = await ipcRenderer.invoke('computer:action', 'screenshot', null);
      console.log('📸 截图结果:', result);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // 构造工具输出格式
      const toolOutput: ToolOutput = {
        type: 'screenshot',
        content: result.filePath  // 使用实际的文件路径
      };

      return {
        output: result.output || 'Screenshot taken successfully',
        toolOutput
      };
      
    } catch (error) {
      console.error('❌ 截图错误:', error);
      return { 
        error: error instanceof Error ? error.message : '未知截图错误'
      };
    }
  }
}

export default new DesktopControlService(); 