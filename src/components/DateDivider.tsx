import React from 'react';
import '../styles/DateDivider.css';

interface DateDividerProps {
  timestamp: number;
}

export const DateDivider: React.FC<DateDividerProps> = ({ timestamp }) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="date-divider">
      <span className="date-text">{formatDate(timestamp)}</span>
    </div>
  );
}; 