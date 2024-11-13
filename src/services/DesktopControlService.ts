import { ipcRenderer, shell } from 'electron';

export interface ToolResult {
  output?: string;
  error?: string;
  base64_image?: string;
  filePath?: string;
}

export class DesktopControlService {
  async getScreenSize(): Promise<{ width: number; height: number }> {
    return await ipcRenderer.invoke('computer:getScreenSize');
  }

  async handleComputerUseRequest(name: string, input: any): Promise<ToolResult> {
    console.log('Desktop control request:', name, input);
    
    try {
      const result = await ipcRenderer.invoke('computer:action', 'screenshot', null);
      console.log('Screenshot result:', result);
      
      return {
        ...result,
        error: result.error ? `Warning: ${result.error}` : undefined
      };
      
    } catch (error) {
      console.error('Screenshot error:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown screenshot error'
      };
    }
  }
}

export default new DesktopControlService(); 