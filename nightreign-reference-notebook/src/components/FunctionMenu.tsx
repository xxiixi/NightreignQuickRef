import React, { useState } from 'react';
import { Tooltip, Dropdown } from 'antd';
import logoImage from '../assets/logo-circle.png';

interface FunctionMenuProps {
  onTabChange: (tab: string) => void;
}

const FunctionMenu: React.FC<FunctionMenuProps> = ({ onTabChange }) => {
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
  );
};

export default FunctionMenu; 