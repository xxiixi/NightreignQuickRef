import React from 'react';
import { Typography, Space } from 'antd';
import { HeartOutlined, MailOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Footer: React.FC = () => {
  return (
    <div className="footer" style={{ 
      padding: '16px 0',
      textAlign: 'center',
      background: 'var(--footer-bg)',
      marginTop: '40px'
    }}>
      <Space direction="vertical" size="small" align="center">
        <Text type="secondary" className="footer-text" style={{ fontSize: '14px', color: 'var(--color-text-2)' }}>
          <HeartOutlined style={{ marginRight: '4px', color: '#ff4d4f' }} />
          Created by{' '}
          <a 
            href="https://github.com/xxiixi" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: 'var(--link-color)', 
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--link-hover-color)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--link-color)';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Cecilia
          </a>
          {' '}｜{' '}
          <MailOutlined style={{ marginRight: '4px', color: 'var(--color-text-2)' }} />
          Contact me at{' '}
          <a 
            href="mailto:scyxw5@gmail.com" 
            style={{ 
              color: 'var(--link-color)', 
              textDecoration: 'none',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--link-hover-color)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--link-color)';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            scyxw5@gmail.com
          </a>
        </Text>
        <Text type="secondary" className="footer-text" style={{ fontSize: '12px', color: 'var(--color-text-2)' }}>
          © {new Date().getFullYear()} NightreignQuickRef · All Rights Reserved · Last updated: August 4, 2025
        </Text>
      </Space>
    </div>
  );
};

export default Footer; 