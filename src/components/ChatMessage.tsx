import React from 'react';
import { StoredMessage } from '../services/MessageStorage';
import '../styles/ChatMessage.css';

interface ChatMessageProps {
  message: StoredMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className={`message-wrapper ${message.type}`}>
      <div className={`message ${message.type}-message`}>
        <div className="message-content">{message.content}</div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}; 