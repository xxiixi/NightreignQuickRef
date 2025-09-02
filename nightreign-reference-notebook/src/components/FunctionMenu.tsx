import React, { useState } from 'react';
import { Tooltip, Menu } from 'antd';
import logoImage from '../assets/logo-circle.png';
import { getMainNavigationOrder } from '../config/navigationConfig';

interface FunctionMenuProps {
  onTabChange: (tab: string) => void;
  onSubTabChange?: (tabKey: string) => void; // 子Tab切换回调
  onStepChange?: (stepIndex: number) => void; // Step切换回调
}

const FunctionMenu: React.FC<FunctionMenuProps> = ({ onTabChange, onSubTabChange, onStepChange }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // 功能导航菜单项 - 使用Menu组件的数据结构
  const menuItems = [
    {
      key: '游戏机制',
      label: '⚙️ 游戏机制',
      children: [
        { key: '游戏时间机制', label: '⏰ 游戏时间机制', anchorId: 'game-time-mechanism' },
        { key: '升级所需卢恩', label: '💰 升级所需卢恩统计', anchorId: 'runes-required' },
        { key: '游戏时间机制: 监牢/夜雨', label: '🌧️ 游戏时间机制: 监牢/夜雨', anchorId: 'prison-rain-mechanism' },
        { key: '血量恢复计算器', label: '❤️ 血量恢复计算器', anchorId: 'recovery-calculator' },
        { key: '隐士出招表', label: '🔮 隐士混合魔法出招表', anchorId: 'hermit-magic-list' }
      ]
    },
    {
      key: '角色数据',
      label: '👤 角色数据',
      children: [
        { key: '角色属性数据', label: '📊 角色基础属性对比', anchorId: 'character-attributes' },
        { key: '角色详细数据', label: '📈 角色等级成长数据', anchorId: 'character-detail-data' },
        { key: '无敌帧长度对比', label: '⚡ 翻滚/闪避无敌帧对比', anchorId: 'dodge-frames' }
      ]
    },
    {
      key: '词条详细数据',
      label: '📋 词条详细数据',
      children: [
        { key: '局外词条', label: '🌕 局外词条', anchorId: 'outsider-entries', tabKey: '局外词条' },
        { key: '局内词条', label: '🌖 局内词条', anchorId: 'in-game-entries', tabKey: '局内词条' },
        { key: '护符词条', label: '🌗 护符词条', anchorId: 'talisman-entries', tabKey: '护符词条' },
        { key: '强化类别词条适用范围', label: '🌘 强化类别词条适用范围', anchorId: 'enhancement-categories', tabKey: '强化类别词条适用范围' },
        { key: '特殊事件及地形效果', label: '🌑 特殊事件及地形效果', anchorId: 'special-events', tabKey: '特殊事件及地形效果' },
        { key: '道具/采集效果', label: '🌒 道具/采集效果', anchorId: 'item-effects', tabKey: '道具效果' }
      ]
    },
    {
      key: '夜王Boss数据',
      label: '👑 夜王Boss数据',
      children: [
        { key: '夜王基础数据', label: '🌙 夜王基础数据', anchorId: 'night-king-basic', tabKey: 'boss-data' },
        { key: '野生Boss数据', label: '☠️ 野生Boss数据', anchorId: 'wild-boss-data', tabKey: 'wild-boss-data' },
        { key: '圆桌厅堂人物数据', label: '🏛️ 圆桌厅堂人物数据', anchorId: 'roundtable-characters', tabKey: 'character-data' },
        { key: '永夜山羊召唤罪人详情', label: '🐐 永夜山羊召唤罪人详情', anchorId: 'sinner-details', tabKey: 'sinner-data' }
      ]
    },
    {
      key: '传说武器详情',
      label: '⚔️ 传说武器详情',
      children: [
        { key: '传说武器强度面板', label: '🛡️ 不同角色使用传说武器的强度面板', anchorId: 'weapon-strength-panel', stepIndex: 0 },
        { key: '武器庇佑效果', label: '🗡️ 传说武器的庇佑效果', anchorId: 'weapon-blessing-effects', stepIndex: 1 }
      ]
    },
  ];



  // 根据配置文件中的顺序重新排列菜单项
  const getOrderedMenuItems = () => {
    const order = getMainNavigationOrder();
    return order.map(key => {
      const item = menuItems.find(item => item.key === key);
      return item!;
    });
  };

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
        // 先切换到父菜单页面
        onTabChange(subMenuItem.parentKey);
        setMenuVisible(false);

        // 延迟执行锚点跳转，确保页面已经渲染
        setTimeout(() => {
          // 处理Tab页面的切换
          if ('tabKey' in subMenuItem && subMenuItem.tabKey && onSubTabChange) {
            onSubTabChange(subMenuItem.tabKey);
          }

          // 处理Step页面的切换
          if ('stepIndex' in subMenuItem && typeof subMenuItem.stepIndex === 'number' && onStepChange) {
            onStepChange(subMenuItem.stepIndex);
          }

          // 执行锚点跳转
          if (subMenuItem.anchorId) {
            const element = document.getElementById(subMenuItem.anchorId);
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
        }, 200);
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
            width: 'clamp(30px, 5vw, 50px)',
            height: 'clamp(30px, 5vw, 50px)',
            borderRadius: '50%',
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
            top: 'clamp(60px, 8vh, 80px)',
            left: 'clamp(60px, 3vw, 80px)',
            zIndex: 1040,
            backgroundColor: 'var(--content-bg)',
            borderRadius: 'clamp(6px, 1vw, 12px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            minWidth: 'clamp(200px, 25vw, 280px)',
            maxWidth: 'clamp(250px, 30vw, 350px)',
            maxHeight: 'calc(100vh - clamp(120px, 15vh, 180px))',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <Menu
            mode="inline"
            items={getOrderedMenuItems()}
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