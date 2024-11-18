// 1. API 相关类型定义
export interface TextContent {
  type: 'text';
  text: string;
}

export interface ToolUseContent {
  type: 'tool_use';
  id: string;
  name: string;
  input: {
    action: ComputerAction;
    coordinate?: [number, number];
    text?: string;
  };
}

export type MessageContent = TextContent | ToolUseContent;

export interface APIResponse {
  content: MessageContent[];
  id: string;
  model: string;
  role: string;
  stop_reason: string | null;
  stop_sequence: string | null;
  type: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolResponse?: {
    toolName: string;
    output: ToolOutput;
  };
}

export interface SendMessageResponse {
  response: string;
  toolResults?: ToolResult[];
}

// 2. 计算机操作相关类型（原有的保持不变）
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
  success: boolean;
  output?: string;
  error?: string;
  toolOutput?: ToolOutput;
}

export interface ComputerOperation {
  action: 'screenshot' | 'move_mouse' | 'click' | 'type';
  coordinate?: [number, number];
  text?: string;
} 