import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { StoredMessage } from '../services/MessageStorage';
import '../styles/ChatMessage.css';

interface ChatMessageProps {
  message: StoredMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getImageSrc = (path: string) => {
    const normalizedPath = path.replace(/\\/g, '/');
    return `file:///${normalizedPath}`;
  };

  return (
    <div className={`message-wrapper ${message.type}`}>
      <div className={`message ${message.type}-message`}>
        <div className="message-content">
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
        {message.toolResponse && (
          <div className="tool-response">
            {message.toolResponse.output.type === 'image' && (
              <>
                <div className="image-container">
                  <img 
                    src={getImageSrc(message.toolResponse.output.content)}
                    alt="Screenshot"
                    className={`tool-image ${isImageEnlarged ? 'enlarged' : ''}`}
                    onClick={() => setIsImageEnlarged(!isImageEnlarged)}
                  />
                  <span className="tool-name">{message.toolResponse.toolName}</span>
                </div>
                {isImageEnlarged && (
                  <div 
                    className="image-overlay"
                    onClick={() => setIsImageEnlarged(false)}
                  >
                    <img 
                      src={getImageSrc(message.toolResponse.output.content)}
                      alt="Screenshot"
                      className="enlarged-image"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}; 