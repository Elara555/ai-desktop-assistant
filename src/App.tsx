import React, { useState, useEffect } from 'react';
import { ChatInput } from './components/ChatInput';
import { sendMessage } from './services/api';
import { MessageStorage, StoredMessage } from './services/MessageStorage';
import { ChatMessage } from './components/ChatMessage';
import { DateDivider } from './components/DateDivider';
import { ToolOutput } from './services/types';
import './styles/App.css';
import path from 'path';

const App: React.FC = () => {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageStorage = new MessageStorage();

  // 加载历史消息
  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await messageStorage.getRecentMessages(7);
      setMessages(storedMessages);
    };
    loadMessages();
  }, []);

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    try {
      // 保存用户消息
      const userMessage = await messageStorage.saveMessage({
        type: 'user',
        content
      });
      setMessages(prev => [...prev, userMessage]);

      setIsLoading(true);

      // 调用 API 获取 AI 回应和工具响应
      const { response, toolResults } = await sendMessage(content);
      
      // 构造工具响应数组
      const toolResponses = toolResults?.map(result => ({
        toolName: 'Computer Control',
        output: result.toolOutput as ToolOutput
      }));

      const assistantMessage = await messageStorage.saveMessage({
        type: 'assistant',
        content: response,
        toolResponses
      });
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // 可以添加错误提示
      const errorMessage = await messageStorage.saveMessage({
        type: 'assistant',
        content: '抱歉，发生了一些错误 😢'
      });
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessages = () => {
    let currentDate = '';
    return messages.map((msg, index) => {
      const messageDate = new Date(msg.timestamp).toDateString();
      const showDateDivider = messageDate !== currentDate;
      
      if (showDateDivider) {
        currentDate = messageDate;
        return (
          <React.Fragment key={msg.id}>
            <DateDivider timestamp={msg.timestamp} />
            <ChatMessage message={msg} />
          </React.Fragment>
        );
      }
      
      return <ChatMessage key={msg.id} message={msg} />;
    });
  };

  return (
    <div className="app-container">
      <div className="messages-container">
        {renderMessages()}
        {isLoading && (
          <div className="loading-message">
            正在思考...
          </div>
        )}
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;