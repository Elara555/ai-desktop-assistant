import React, { useState, useEffect } from 'react';
import { ChatInput } from './components/ChatInput';
import { sendMessage } from './services/api';
import { MessageStorage, StoredMessage } from './services/MessageStorage';
import { ChatMessage } from './components/ChatMessage';
import { DateDivider } from './components/DateDivider';
import './styles/App.css';
import { DesktopControlClient } from './services/DesktopControlClient';

const App: React.FC = () => {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageStorage = new MessageStorage();

  // 加载历史消息
  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await messageStorage.getRecentMessages(7); // 加载最近7天的消息
      setMessages(storedMessages);
    };
    loadMessages();
  }, []);

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    // 保存用户消息
    const userMessage = await messageStorage.saveMessage({
      type: 'user',
      content
    });
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);
    try {
      const response = await sendMessage(content);
      
      // 保存助手消息
      const assistantMessage = await messageStorage.saveMessage({
        type: 'assistant',
        content: response
      });
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

  const testDesktopControl = async () => {
    try {
      console.log('开始 IPC 测试...');
      
      // 获取屏幕尺寸
      const screenSize = await DesktopControlClient.getScreenSize();
      console.log('屏幕尺寸:', screenSize);
      
      // 等待 2 秒
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 移动鼠标到屏幕中心
      const centerX = screenSize.width / 2;
      const centerY = screenSize.height / 2;
      await DesktopControlClient.moveMouse(centerX, centerY);
      
      console.log('测试完成！');
    } catch (error) {
      console.error('测试失败:', error);
    }
  };

  const drawHeart = async () => {
    try {
      console.log('开始画爱心...');
      
      // 获取屏幕尺寸
      const screenSize = await DesktopControlClient.getScreenSize();
      console.log('屏幕尺寸:', screenSize);
      
      const centerX = screenSize.width / 2;
      const centerY = screenSize.height / 2;
      const size = 50;
      
      // 生成爱心形状的点
      for (let t = 0; t <= Math.PI * 2; t += 0.1) {
        const x = centerX + size * 16 * Math.pow(Math.sin(t), 3);
        const y = centerY - size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        await DesktopControlClient.moveMouse(Math.round(x), Math.round(y));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      console.log('爱心画完啦！');
    } catch (error) {
      console.error('画爱心失败:', error);
    }
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
      <button onClick={testDesktopControl}>测试桌面控制</button>
      <button 
        onClick={drawHeart}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: '#ff69b4',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        画个爱心 ❤️
      </button>
    </div>
  );
};

export default App;