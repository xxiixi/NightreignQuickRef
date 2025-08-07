import React from 'react';
import '../styles/loading-moon.css';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading' 
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