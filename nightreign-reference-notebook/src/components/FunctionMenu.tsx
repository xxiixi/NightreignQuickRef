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
      key: '角色数据',
      label: '角色数据',
      children: '查看角色相关数据，包括角色属性、无敌帧长度对比、隐士出招表。'
    },
    {
      key: '游戏机制',
      label: '游戏机制',
      children: '包括游戏内缩圈时间、升级所需卢恩、血量恢复计算器。'
    },
    {
      key: '传说武器详情',
      label: '传说武器详情',
      children: '查看不同角色使用传说武器的强度面板，以及各武器的庇佑效果。'
    },
    {
      key: '词条详细数据',
      label: '词条详细数据',
      children: '包括局外词条(按照遗物仪式分类)、局内词条（武器词条、掉落物词条）、护符词条等。'
    },
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
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            marginBottom: '6px',
            fontSize: '14px',
            color: 'var(--color-primary-500)'
          }}>
            {item.label}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--color-text-2)',
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