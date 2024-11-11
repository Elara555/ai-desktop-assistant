import React, { useState } from 'react';
import { ChatInput } from './components/ChatInput';
import { sendMessage } from './services/api';
import './styles/App.css';

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (isLoading) return;

    setMessages(prev => [...prev, {
      type: 'user',
      content: message
    }]);

    setIsLoading(true);
    try {
      const response = await sendMessage(message);
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: response
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}-message`}>
            {msg.content}
          </div>
        ))}
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