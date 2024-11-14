const API_KEY = process.env.ANTHROPIC_API_KEY;

import desktopControl from './DesktopControlService';

// 添加类型定义
interface TextContent {
  type: 'text';
  text: string;
}

interface ToolUseContent {
  type: 'tool_use';
  id: string;
  name: string;
  input: {
    action?: string;
    coordinate?: [number, number];
    text?: string;
    [key: string]: any;
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

export interface ToolOutput {
  type: 'text' | 'image' | 'audio' | null;
  content: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;      // 基础文本内容
  timestamp: number;
  toolResponse?: {      // 新增工具响应字段
    toolName: string;
    output: ToolOutput;
  }
}

export const sendMessage = async (message: string) => {
  console.log('Sending message to API:', message);

  if (!API_KEY) {
    throw new Error('API key is not configured');
  }
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'computer-use-2024-10-22'
      },
      body: JSON.stringify({
        messages: [{ 
          role: 'user', 
          content: message 
        }],
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        tools: [
          {
            type: "computer_20241022",
            name: "computer",
            display_width_px: 1024,
            display_height_px: 768,
            display_number: 1
          }
        ],
        system: "你是一个可爱的AI助手，名叫克劳德..."
      })
    });

    const data: APIResponse = await response.json();
    
    // 添加详细的终端输出
    console.log('\n=== API Response Details ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('\n=== Tool Message Details ===');
    const toolMessage = data.content.find((item): item is ToolUseContent => item.type === 'tool_use');
    if (toolMessage) {
      console.log(JSON.stringify(toolMessage, null, 2));
    }
    console.log('========================\n');

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // 先获取文本消息
    let responseText = '';
    const textMessage = data.content.find((item): item is TextContent => item.type === 'text');
    if (textMessage) {
      responseText = textMessage.text + '\n\n';
    }

    // 检查是否有工具调用
    if (toolMessage) {
      console.log('Taking screenshot...');
      
      const toolResult = await desktopControl.handleComputerUseRequest(
        toolMessage.name,
        { action: 'screenshot' }
      );
      
      console.log('Screenshot result:', toolResult);

      // 如果有截图，构建 markdown 图片语法
      if (toolResult.base64_image) {
        const imageMarkdown = `${responseText}

![screenshot](data:image/png;base64,${toolResult.base64_image})`;
        console.log('Returning image markdown');
        return imageMarkdown;
      }
    }

    return responseText;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 