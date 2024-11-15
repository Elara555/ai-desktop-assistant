import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { StoredMessage } from '../services/MessageStorage';
import { ScreenshotOutput, MouseOutput } from '../services/types';
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

  const renderToolResponse = () => {
    if (!message.toolResponse) return null;

    const { output } = message.toolResponse;

    switch (output.type) {
      case 'screenshot':
        if (typeof output.content === 'string') {
          return (
            <div className="image-container">
              <img 
                src={getImageSrc(output.content)}
                alt="Screenshot"
                className={`tool-image ${isImageEnlarged ? 'enlarged' : ''}`}
                onClick={() => setIsImageEnlarged(!isImageEnlarged)}
              />
              <span className="tool-name">{message.toolResponse.toolName}</span>
              {isImageEnlarged && (
                <div 
                  className="image-overlay"
                  onClick={() => setIsImageEnlarged(false)}
                >
                  <img 
                    src={getImageSrc(output.content)}
                    alt="Screenshot"
                    className="enlarged-image"
                  />
                </div>
              )}
            </div>
          );
        }
        return null;
      
      case 'mouse':
        if (typeof output.content === 'object' && output.content !== null) {
          const mouseOutput = output.content as MouseOutput;
          return (
            <div className="mouse-operation-info">
              <div className="operation-type">
                {mouseOutput.action}
              </div>
              <div className="positions">
                <span>从: ({mouseOutput.positions.from.x}, {mouseOutput.positions.from.y})</span>
                <span>到: ({mouseOutput.positions.to.x}, {mouseOutput.positions.to.y})</span>
              </div>
              {mouseOutput.screenshotPath && (
                <img 
                  src={getImageSrc(mouseOutput.screenshotPath)}
                  alt="Operation Screenshot"
                  className="operation-screenshot"
                />
              )}
            </div>
          );
        }
        return null;
      
      default:
        return null;
    }
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
            {renderToolResponse()}
          </div>
        )}
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}; 