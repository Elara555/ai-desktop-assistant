const API_KEY = process.env.ANTHROPIC_API_KEY;

import desktopControl from './DesktopControlService';
import { MessageStorage } from './MessageStorage';
import { ComputerAction, ComputerToolInput, ToolResult, ToolOutput } from './types';

// API 响应的类型定义
interface TextContent {
  type: 'text';
  text: string;
}

interface ToolUseContent {
  type: 'tool_use';
  id: string;
  name: string;
  input: {
    action: ComputerAction;  // 使用标准的 ComputerAction 类型
    coordinate?: [number, number];
    text?: string;
  };
}

type MessageContent = TextContent | ToolUseContent;

interface APIResponse {
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

// 消息接口（用于前端展示）
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolResponse?: {
    toolName: string;
    output: ToolOutput;  // 使用我们的 ToolOutput 类型
  };
}

// API 返回结果接口
interface SendMessageResponse {
  response: string;
  toolResult?: ToolResult;  // 使用我们的 ToolResult 类型
}

export const sendMessage = async (message: string): Promise<SendMessageResponse> => {
  if (!API_KEY) {
    throw new Error('API key is not configured');
  }
  
  try {
    // 获取历史消息
    const messageStorage = new MessageStorage();
    const recentMessages = await messageStorage.getRecentMessages(7); // 获取最近7天的消息
    
    // 转换格式
    const messageHistory = recentMessages.map(msg => ({
      role: msg.type,
      content: msg.content
    }));
    
    // 添加当前消息
    messageHistory.push({ role: 'user', content: message });
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'computer-use-2024-10-22'
      },
      body: JSON.stringify({
        messages: messageHistory,  // 传递完整的对话历史
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        tools: [{
          type: "computer_20241022",
          name: "computer",
          display_width_px: 1024,
          display_height_px: 768,
          display_number: 1
        }],
        system: "你是一个可爱的AI助手，名叫克劳德..."
      })
    });

    const data: APIResponse = await response.json();
    
    // 调试输出
    console.log('\n=== API Response Details ===');
    console.log(JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // 处理文本响应
    let responseText = '';
    const textMessage = data.content.find((item): item is TextContent => item.type === 'text');
    if (textMessage) {
      responseText = textMessage.text;
    }

    // 处理工具调用
    const toolMessage = data.content.find((item): item is ToolUseContent => item.type === 'tool_use');
    if (toolMessage) {
      console.log('处理工具调用:', toolMessage);
      
      // 构造标准的工具输入
      const toolInput: ComputerToolInput = {
        action: toolMessage.input.action,
        coordinate: toolMessage.input.coordinate,
        text: toolMessage.input.text
      };
      
      const toolResult = await desktopControl.handleComputerUseRequest(
        toolMessage.name,
        toolInput
      );
      
      console.log('工具执行结果:', toolResult);

      return {
        response: responseText,
        toolResult
      };
    }

    // 普通文本消息
    return {
      response: responseText
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 