import React, { useState, useEffect } from 'react';
import { ChatInput } from './components/ChatInput';
import { sendMessage } from './services/api';
import { MessageStorage, StoredMessage } from './services/MessageStorage';
import { ChatMessage } from './components/ChatMessage';
import { DateDivider } from './components/DateDivider';
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

    // 测试用户消息格式
    const userMessage = await messageStorage.saveMessage({
      type: 'user',
      content
    });
    console.log('用户消息格式:', userMessage);
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);
    try {
      // 测试助手消息格式
      const assistantMessage = await messageStorage.saveMessage({
        type: 'assistant',
        content: '测试回复',
        toolResponse: {
          toolName: 'screenshot',
          output: {
            type: 'image',
            content: `C:\\Users\\sense\\Desktop\\ai-desktop-assistant\\screenshot-1731577972056.png`
          }
        }
      });
      console.log('助手消息格式:', assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
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