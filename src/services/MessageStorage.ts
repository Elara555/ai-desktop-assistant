export interface ToolOutput {
  type: 'text' | 'image' | 'audio' | null;
  content: string;
}

export interface StoredMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolResponse?: {
    toolName: string;
    output: ToolOutput;
  }
}

export class MessageStorage {
  private readonly STORAGE_KEY = 'chat_messages';
  
  // 保存新消息
  async saveMessage(message: {
    type: 'user' | 'assistant';
    content: string;
    toolResponse?: {
      toolName: string;
      output: ToolOutput;
    }
  }): Promise<StoredMessage> {
    const storedMessage: StoredMessage = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...message
    };

    const messages = await this.getAllMessages();
    messages.push(storedMessage);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
    
    console.log('保存的消息格式:', storedMessage);
    return storedMessage;
  }

  // 获取所有消息
  async getAllMessages(): Promise<StoredMessage[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // 获取最近N天的消息
  async getRecentMessages(days: number): Promise<StoredMessage[]> {
    const messages = await this.getAllMessages();
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return messages.filter(msg => msg.timestamp >= cutoff);
  }

  // 清除所有消息
  async clearMessages(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }
} 