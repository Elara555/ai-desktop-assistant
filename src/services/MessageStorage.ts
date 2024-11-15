import { Message } from './api';
import { ToolOutput } from './types';

const STORAGE_KEY = 'chat_messages';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface StoredMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: number;
  toolResponse?: {
    toolName: string;
    output: ToolOutput;
  };
}

export class MessageStorage {
  private messages: StoredMessage[] = [];

  constructor() {
    // 从 localStorage 加载消息
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.messages = JSON.parse(stored);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages));
  }

  async getRecentMessages(days: number): Promise<StoredMessage[]> {
    const cutoff = Date.now() - (days * MS_PER_DAY);
    return this.messages.filter(msg => msg.timestamp >= cutoff);
  }

  async saveMessage(message: Partial<StoredMessage>): Promise<StoredMessage> {
    const newMessage: StoredMessage = {
      id: crypto.randomUUID(),
      type: message.type || 'user',
      content: message.content || '',
      timestamp: Date.now(),
      toolResponse: message.toolResponse
    };

    this.messages.push(newMessage);
    this.saveToStorage();  // 保存到 localStorage
    return newMessage;
  }

  getMessages(): StoredMessage[] {
    return this.messages;
  }

  clear(): void {
    this.messages = [];
    localStorage.removeItem(STORAGE_KEY);  // 清除 localStorage
  }
} 