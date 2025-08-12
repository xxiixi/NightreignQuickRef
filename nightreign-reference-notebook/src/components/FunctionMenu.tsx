import React, { useState } from 'react';
import { Tooltip, Menu } from 'antd';
import logoImage from '../assets/logo-circle.png';

interface FunctionMenuProps {
  onTabChange: (tab: string) => void;
}

const FunctionMenu: React.FC<FunctionMenuProps> = ({ onTabChange }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>(['角色数据', '游戏机制', '传说武器详情', '词条详细数据', '夜王Boss数据']);

  // 功能导航菜单项 - 使用Menu组件的数据结构
  const menuItems = [
    {
      key: '角色数据',
      label: '角色数据',
      children: [
        { key: '角色属性数据', label: '角色基础属性对比' },
        { key: '角色详细数据', label: '角色等级成长数据' },
        { key: '无敌帧长度对比', label: '翻滚/闪避无敌帧对比' }
      ]
    },
    {
      key: '游戏机制',
      label: '游戏机制',
      children: [
        { key: '游戏时间机制', label: '游戏时间机制与缩圈' },
        { key: '升级所需卢恩', label: '升级所需卢恩统计' },
        { key: '血量恢复计算器', label: '血量恢复计算器' },
        { key: '隐士出招表', label: '隐士混合魔法出招表' }
      ]
    },
    {
      key: '传说武器详情',
      label: '传说武器详情',
      children: [
        { key: '传说武器强度面板', label: '不同角色使用传说武器的强度面板' },
        { key: '武器庇佑效果', label: '各武器的庇佑效果' }
      ]
    },
    {
      key: '词条详细数据',
      label: '词条详细数据',
      children: [
        { key: '局外词条', label: '局外词条 (按照遗物仪式分类)' },
        { key: '护符词条', label: '护符词条' },
        { key: '局内词条', label: '局内词条（武器词条、掉落物词条）' },
        { key: '其他词条', label: '其他词条' }
      ]
    },
    {
      key: '夜王Boss数据',
      label: '夜王Boss数据',
      children: [
        { key: '夜王Boss详情', label: '夜王Boss详情页面' }
      ]
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    // 检查是否是主菜单项
    const mainMenuItem = menuItems.find(item => item.key === key);
    if (mainMenuItem) {
      // 切换到对应的功能页面
      onTabChange(key);
      setMenuVisible(false);
    } else {
      // 检查是否是子菜单项
      const subMenuItem = menuItems.flatMap(item => 
        item.children.map(subItem => ({ ...subItem, parentKey: item.key }))
      ).find(subItem => subItem.key === key);
      
      if (subMenuItem) {
        // 导航到父菜单，后续可以实现子菜单项的精确导航
        console.log('子菜单项点击:', subMenuItem);
        onTabChange(subMenuItem.parentKey);
        setMenuVisible(false);
      }
    }
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <div className="fixed-logo">
      <Tooltip title="功能导航" placement="right">
        <img 
          src={logoImage} 
          alt="Nightreign Logo" 
          onClick={() => setMenuVisible(!menuVisible)}
          style={{
            cursor: 'pointer',
            width: '50px',
            height: '50px',
            borderRadius: '25px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
        />
      </Tooltip>
      
      {/* 功能导航菜单 */}
      {menuVisible && (
        <div 
          className="function-menu-overlay"
          style={{
            position: 'fixed',
            top: '70px',
            left: '20px',
            zIndex: 1040,
            backgroundColor: 'var(--content-bg)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            minWidth: '280px',
            maxWidth: '320px'
          }}
        >
          <Menu
            mode="inline"
            items={menuItems}
            onClick={handleMenuClick}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            style={{
              border: 'none',
              backgroundColor: 'transparent'
            }}
            className="function-menu"
          />
        </div>
      )}
      
      {/* 点击外部关闭菜单 */}
      {menuVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1030
          }}
          onClick={() => setMenuVisible(false)}
        />
      )}
    </div>
  );
};

export default FunctionMenu; 