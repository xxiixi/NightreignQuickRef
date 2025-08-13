import React from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = React.memo(({ activeTab, onTabChange }) => {
  return (
    <div className="custom-buttons-container">
      <div className={`custom-tab-button ${activeTab === '游戏机制' ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); onTabChange('游戏机制'); }}>
          游戏机制
        </a>
      </div>
      <div className={`custom-tab-button ${activeTab === '夜王Boss数据' ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); onTabChange('夜王Boss数据'); }}>
          夜王Boss数据
        </a>
      </div>
      <div className={`custom-tab-button ${activeTab === '角色数据' ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); onTabChange('角色数据'); }}>
          角色数据
        </a>
      </div>
      <div className={`custom-tab-button ${activeTab === '传说武器详情' ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); onTabChange('传说武器详情'); }}>
          传说武器详情
        </a>
      </div>
      <div className={`custom-tab-button ${activeTab === '词条详细数据' ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); onTabChange('词条详细数据'); }}>
          词条详细数据
        </a>
      </div>
    </div>
  );
});

export default Navigation; 