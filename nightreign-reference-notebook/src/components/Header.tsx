import React from 'react';
import { Typography, Space, Button, Tooltip } from 'antd';
import { MoonOutlined, SunOutlined, TranslationOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onToggleLanguage
}) => {
  return (
    <>
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-left">
            {/* 左侧可以放置其他内容 */}
          </div>
          <div className="top-bar-right">
            <Space size="middle">
              <Button
                type="text"
                icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                onClick={onToggleTheme}
                className="theme-toggle-btn"
              />
              <Tooltip title="切换语言功能尚未开发" placement="bottom">
                <Button
                  type="text"
                  icon={<TranslationOutlined />}
                  onClick={onToggleLanguage}
                  className="language-toggle-btn"
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      </div>

      <div className="header">
        <Title level={1} className="main-title">
          Nightreign Reference Notebook
        </Title>
        <Space direction="vertical" size="small" className="subtitle">
          <Text type="secondary" className="subtitle-text">
            黑夜君临内容速查工具，按游戏内结构分类整理，可快速检索条目信息，后续会添加更多内容。
          </Text>
        </Space>
      </div>
    </>
  );
};

export default Header; 