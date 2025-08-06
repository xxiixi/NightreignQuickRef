import React, { useState } from 'react';
import { Typography, Space, Button, Tooltip, Dropdown, Popover } from 'antd';
import { MoonOutlined, SunOutlined, TranslationOutlined, SmileOutlined, ReadOutlined } from '@ant-design/icons';
import logoImage from '../assets/logo-circle.png';

const { Title, Text } = Typography;

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onTabChange: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onToggleLanguage,
  onTabChange
}) => {
  const [logoDropdownVisible, setLogoDropdownVisible] = useState(false);

  // 功能导航菜单项
  const logoMenuItems = [
    {
      key: '词条详细数据',
      label: '词条详细数据',
      children: '包括局外词条(xxxx)、局内词条、护符词条等。'
    },
    {
      key: '传说武器详情',
      label: '传说武器详情',
      children: '查看不同角色使用传说武器的强度面板，以及各武器的庇佑效果。'
    },
    {
      key: '角色数据',
      label: '角色数据',
      children: '查看角色相关数据，包括角色属性、无敌帧长度对比、隐士出招表。'
    },
    {
      key: '功能4',
      label: '其他功能',
      children: '更多功能模块，持续开发中...'
    }
  ];

  const handleLogoClick = () => {
    setLogoDropdownVisible(!logoDropdownVisible);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    // 切换到对应的功能页面
    onTabChange(key);
    setLogoDropdownVisible(false);
  };

  const menu = {
    items: logoMenuItems.map(item => ({
      key: item.key,
      label: (
        <div style={{ padding: '12px 0' }}>
          <div style={{ 
            fontWeight: 'bold', 
            marginBottom: '6px',
            fontSize: '14px',
            color: '#1890ff'
          }}>
            {item.label}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#666',
            lineHeight: '1.4'
          }}>
            {item.children}
          </div>
        </div>
      )
    })),
    onClick: handleMenuClick
  };

  return (
    <>
      {/* 固定在左上角的logo按钮 */}
      <div className="fixed-logo">
        <Tooltip title="功能导航" placement="right">
          <Dropdown 
            menu={menu} 
            open={logoDropdownVisible}
            onOpenChange={setLogoDropdownVisible}
            placement="bottomLeft"
            trigger={['click']}
            overlayClassName="logo-dropdown"
          >
            <div 
              className="logo-container"
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={logoImage} 
                alt="Nightreign Logo" 
              />
            </div>
          </Dropdown>
        </Tooltip>
      </div>

      <div className="top-bar">
        <div className="top-bar-content">
          <div className="top-bar-right">
            <Space size="middle">
              <Tooltip title={isDarkMode ? "切换到亮色模式" : "切换到暗色模式"} placement="bottom">
                <Button
                  type="text"
                  icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                  onClick={onToggleTheme}
                  className="theme-toggle-btn"
                />
              </Tooltip>
              <Tooltip title="查看访问量" placement="bottom" className="theme-toggle-btn">
                <Popover
                  content={
                    <div style={{ padding: '8px' }}>
                      <span id="busuanzi_container_site_pv">
                        本站总访问量<span id="busuanzi_value_site_pv"></span>次
                      </span>
                      <br />
                      <span id="busuanzi_container_site_uv">
                        本站总访客数<span id="busuanzi_value_site_uv"></span>人
                      </span>
                      <div style={{ marginTop: '4px', fontSize: '12px', color: '#999' }}>
                        不蒜子版本: 2.3
                      </div>
                    </div>
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    type="text"
                    icon={<SmileOutlined />}
                    className="visits-counter-btn"
                  />
                </Popover>
              </Tooltip>
              <Tooltip title="查看数据来源" placement="bottom" className="theme-toggle-btn">
                <Popover
                  content={
                    <div style={{ padding: '8px' }}>
                        <a 
                          href="https://github.com/xxiixi/NightreignQuickRef/tree/main/reference/raw_data" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="footer-link"
                        >
                          reference/raw_data
                        </a>
                    </div>
                  }
                  placement="bottom"
                  trigger="click"
                >
                  <Button
                    type="text"
                    icon={<ReadOutlined />}
                    className="visits-counter-btn"
                  />
                </Popover>
              </Tooltip>
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
            黑夜君临内容速查工具，可快速检索条目信息，后续会添加更多内容
          </Text>
        </Space>
      </div>
    </>
  );
};

export default Header; 