import { 
  APIResponse, 
  SendMessageResponse,
  ComputerToolInput,
  ToolResult,
  TextContent
} from './types';
import desktopControl from './DesktopControlService';
import { MessageStorage } from './MessageStorage';

const API_KEY = process.env.ANTHROPIC_API_KEY;

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
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    // 处理文本响应
    let responseText = '';
    const textMessage = data.content.find((item): item is TextContent => item.type === 'text');
    if (textMessage) {
      responseText = textMessage.text;
    }

    // 处理所有工具调用
    const toolResults: ToolResult[] = [];
    for (const block of data.content) {
      if (block.type === 'tool_use') {
        const toolInput: ComputerToolInput = {
          action: block.input.action,
          coordinate: block.input.coordinate,
          text: block.input.text
        };
        
        const result = await desktopControl.handleComputerUseRequest(
          block.name,
          toolInput
        );
        toolResults.push(result);
      }
    }

    // 统一返回格式，无论是否有工具调用
    return {
      response: responseText,
      toolResults: toolResults.length > 0 ? toolResults : undefined
    };

  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 