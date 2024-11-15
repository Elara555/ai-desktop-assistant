// 基础工具输出类型
export type ToolOutputType = 'screenshot' | 'mouse' | 'text' | 'audio' | null;

// 鼠标操作类型
export type MouseActionType = 
  | 'mouse_move'
  | 'left_click'
  | 'right_click'
  | 'middle_click'
  | 'double_click'
  | 'left_click_drag';

// 截图输出
export interface ScreenshotOutput {
  type: 'screenshot';
  filePath: string;
}

// 鼠标操作输出
export interface MouseOutput {
  type: 'mouse';
  action: MouseActionType;
  positions: {
    from: { x: number; y: number };
    to: { x: number; y: number };
  };
  timestamp: number;
  screenshotPath?: string;
}

// 统一的工具输出接口
export interface ToolOutput {
  type: ToolOutputType;
  content: string | ScreenshotOutput | MouseOutput;
}

// 工具结果接口
export interface ToolResult {
  output?: string;
  error?: string;
  toolOutput?: ToolOutput;
} 