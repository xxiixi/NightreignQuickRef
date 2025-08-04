import React from 'react';
import { Typography, Space } from 'antd';
import { HeartOutlined, GithubOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <Space direction="vertical" size="middle" align="center">
        <Text type="secondary" className="footer-text">
          <HeartOutlined style={{ marginRight: '4px' }} />
          Created by{' '}
          <a 
            href="https://github.com/xxiixi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="author-link"
          >
            Cecilia
          </a>
         
          ｜
          <GithubOutlined style={{ marginRight: '4px' }} />
          Report an issue on{' '}
          <a 
            href="https://github.com/xxiixi/NightreignQuickRef" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            NightreignQuickRef
          </a>
        </Text>
        <Text type="secondary" className="footer-text">
        Last updated at August 4, 2025｜© 2025 NightreignQuickRef · All Rights Reserved
        </Text>
      </Space>
    </div>
  );
};

export default Footer; 