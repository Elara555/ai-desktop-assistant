import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { StoredMessage } from '../services/MessageStorage';
import { ComputerAction, ScreenshotOutput, MouseOutput } from '../services/types';
import '../styles/ChatMessage.css';

interface ChatMessageProps {
  message: StoredMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [enlargedImageIndex, setEnlargedImageIndex] = useState<number | null>(null);

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

  const getOperationIcon = (action: ComputerAction): string => {
    const icons: Record<ComputerAction, string> = {
      'mouse_move': '↗️',
      'left_click': '🖱️',
      'right_click': '👆',
      'double_click': '👆👆',
      'middle_click': '🖱️',
      'left_click_drag': '✋',
      'cursor_position': '📍',
      'key': '⌨️',
      'type': '⌨️',
      'screenshot': '📸'
    };
    return icons[action] || '🖱️';
  };

  const renderToolResponses = () => {
    if (!message.toolResponses?.length) return null;

    return message.toolResponses.map((toolResponse, index) => {
      const { output } = toolResponse;

      switch (output.type) {
        case 'screenshot':
          if (typeof output.content === 'string') {
            return (
              <div key={`screenshot-${index}`} className="image-container">
                <img 
                  src={getImageSrc(output.content)}
                  alt="Screenshot"
                  className={`tool-image ${enlargedImageIndex === index ? 'enlarged' : ''}`}
                  onClick={() => setEnlargedImageIndex(index)}
                />
                <span className="tool-name">{toolResponse.toolName}</span>
                {enlargedImageIndex === index && (
                  <div 
                    className="image-overlay"
                    onClick={() => setEnlargedImageIndex(null)}
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
          const mouseOutput = output.content as MouseOutput;
          if (!mouseOutput?.positions) return null;
          
          const { from, to } = mouseOutput.positions;
          if (!from || !to) return null;

          return (
            <div key={`mouse-${index}`} className="mouse-operation-info">
              <div className="operation-details">
                {getOperationIcon(mouseOutput.action)}
                <span className="operation-type">
                  {mouseOutput.action === 'mouse_move' ? '鼠标移动' :
                   mouseOutput.action === 'cursor_position' ? '鼠标位置' :
                   mouseOutput.action === 'left_click_drag' ? '拖拽' :
                   '鼠标点击'}
                </span>
                <span className="coordinates">
                  {mouseOutput.action === 'mouse_move' || mouseOutput.action === 'left_click_drag' ? 
                    `从: (${from.x}, ${from.y}) → 到: (${to.x}, ${to.y})` :
                    `当前位置: (${from.x}, ${from.y})`
                  }
                </span>
                <span className="timestamp">
                  {formatTime(mouseOutput.timestamp)}
                </span>
              </div>
            </div>
          );
        
        default:
          return null;
      }
    });
  };

  return (
    <div className={`message-wrapper ${message.type}`}>
      <div className={`message ${message.type}-message`}>
        <div className="message-content">
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
        {message.toolResponses && message.toolResponses.length > 0 && (
          <div className="tool-responses">
            {renderToolResponses()}
          </div>
        )}
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}; 