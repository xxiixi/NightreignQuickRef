import React from 'react';
import '../styles/loading-moon.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = '正在加载数据，请稍候...' 
}) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loader"></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 