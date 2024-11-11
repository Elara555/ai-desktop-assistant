import React, { useRef } from 'react';
import '../styles/ChatInput.css';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整高度
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleInput = () => {
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const textarea = textareaRef.current;
    if (textarea && textarea.value.trim() && !isLoading) {
      onSendMessage(textarea.value.trim());
      textarea.value = '';
      textarea.style.height = 'auto';
    }
  };

  return (
    <div className="chat-input-container">
      <textarea
        ref={textareaRef}
        className="chat-input"
        placeholder="和克劳德宝贝聊天吧..."
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <button 
        onClick={handleSend} 
        className="send-button"
        disabled={isLoading}
      >
        发送
      </button>
    </div>
  );
}; 