import { ipcRenderer } from 'electron';
import {
  ComputerAction,
  ComputerToolInput,
  ToolResult,
  ToolOutput,
  Position
} from './types';

export class DesktopControlService {
  private readonly SCREENSHOT_DELAY = 2000; // 2秒，对标官方的 _screenshot_delay
  
  async getScreenSize(): Promise<{ width: number; height: number }> {
    return await ipcRenderer.invoke('computer:getScreenSize');
  }

  async handleComputerUseRequest(name: string, input: ComputerToolInput): Promise<ToolResult> {
    console.log('🚀 开始处理桌面控制请求:', { name, input });
    
    try {
      const { action, coordinate, text } = input;
      let result;
      let toolOutput: ToolOutput;

      // 对标 computer.py 的操作处理逻辑
      if (action === 'mouse_move' || action === 'left_click_drag') {
        // 检查必需的坐标参数
        if (!coordinate) {
          throw new Error(`coordinate is required for ${action}`);
        }
        if (text) {
          throw new Error(`text is not accepted for ${action}`);
        }

        // 执行鼠标操作
        result = await ipcRenderer.invoke('computer:action', action, {
          x: coordinate[0],
          y: coordinate[1]
        });

        toolOutput = {
          type: 'mouse',
          content: {
            type: 'mouse',
            action,
            positions: {
              from: result.from,
              to: result.to
            },
            timestamp: Date.now()
          }
        };

        return {
          output: `Mouse ${action} to (${coordinate[0]}, ${coordinate[1]})`,
          toolOutput,
          success: true
        };
      }

      if (action === 'key' || action === 'type') {
        // 检查必需的文本参数
        if (!text) {
          throw new Error(`text is required for ${action}`);
        }
        if (coordinate) {
          throw new Error(`coordinate is not accepted for ${action}`);
        }

        result = await ipcRenderer.invoke('computer:action', action, { text });
        
        toolOutput = {
          type: 'keyboard',
          content: {
            type: 'keyboard',
            action,
            content: text,
            timestamp: Date.now()
          }
        };

        return {
          output: `Keyboard ${action}: ${text}`,
          toolOutput,
          success: true
        };
      }

      if (['left_click', 'right_click', 'middle_click', 'double_click', 'screenshot', 'cursor_position'].includes(action)) {
        // 这些操作不需要额外参数
        if (text) {
          throw new Error(`text is not accepted for ${action}`);
        }
        if (coordinate) {
          throw new Error(`coordinate is not accepted for ${action}`);
        }

        result = await ipcRenderer.invoke('computer:action', action, null);

        if (action === 'screenshot') {
          toolOutput = {
            type: 'screenshot',
            content: result.filePath
          };

          return {
            output: 'Screenshot taken successfully',
            toolOutput,
            success: true
          };
        }

        if (action === 'cursor_position') {
          toolOutput = {
            type: 'mouse',
            content: {
              type: 'mouse',
              action,
              positions: {
                from: result.position,
                to: result.position
              },
              timestamp: Date.now()
            }
          };

          return {
            output: `Current cursor position: (${result.position.x}, ${result.position.y})`,
            toolOutput,
            success: true
          };
        }

        // 其他鼠标点击操作
        toolOutput = {
          type: 'mouse',
          content: {
            type: 'mouse',
            action,
            positions: {
              from: result.position,
              to: result.position
            },
            timestamp: Date.now()
          }
        };

        return {
          output: `Mouse ${action} at (${result.position.x}, ${result.position.y})`,
          toolOutput,
          success: true
        };
      }

      throw new Error(`Unsupported action: ${action}`);
    } catch (error) {
      console.error('❌ 操作错误:', error);
      return { 
        error: error instanceof Error ? error.message : '未知错误',
        success: false
      };
    }
  }
}

export default new DesktopControlService(); 