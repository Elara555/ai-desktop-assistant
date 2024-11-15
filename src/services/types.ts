// 1. 对标官方的操作类型和输入输出
export type ComputerAction = 
  | 'key'
  | 'type'
  | 'mouse_move'
  | 'left_click'
  | 'left_click_drag'
  | 'right_click'
  | 'middle_click'
  | 'double_click'
  | 'screenshot'
  | 'cursor_position';

// 官方工具输入参数
export interface ComputerToolInput {
  action: ComputerAction;
  text?: string;
  coordinate?: [number, number];
}

// 官方工具结果
export interface ComputerToolResult {
  output?: string;
  error?: string;
  base64_image?: string;
}

// 2. 我们自己的展示类型定义
export type ToolOutputType = 'screenshot' | 'mouse' | 'keyboard' | 'text' | 'audio' | null;

// 基础位置接口
export interface Position {
  x: number;
  y: number;
}

// 展示用的输出接口
export interface ScreenshotOutput {
  type: 'screenshot';
  filePath: string;
}

export interface MouseOutput {
  type: 'mouse';
  action: ComputerAction;
  positions: {
    from: Position;
    to: Position;
  };
  timestamp: number;
}

export interface KeyboardOutput {
  type: 'keyboard';
  action: ComputerAction;
  content: string;
  timestamp: number;
}

// 统一的工具输出接口（用于前端展示）
export interface ToolOutput {
  type: ToolOutputType;
  content: string | ScreenshotOutput | MouseOutput | KeyboardOutput;
}

// 最终的工具结果（包含官方结果和展示结果）
export interface ToolResult {
  output?: string;
  error?: string;
  toolOutput?: ToolOutput;
} 