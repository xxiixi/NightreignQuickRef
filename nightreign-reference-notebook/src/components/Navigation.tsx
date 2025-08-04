import React from 'react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="custom-buttons-container">
      <div className={`custom-tab-button ${activeTab === '词条详细数据' ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); onTabChange('词条详细数据'); }}>
          词条详细数据
        </a>
      </div>
      <div className={`custom-tab-button ${activeTab === '功能2' ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); onTabChange('功能2'); }}>
          功能2
        </a>
      </div>
      <div className={`custom-tab-button ${activeTab === '功能3' ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); onTabChange('功能3'); }}>
          功能3
        </a>
      </div>
      <div className={`custom-tab-button ${activeTab === '功能4' ? 'active' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); onTabChange('功能4'); }}>
          功能4
        </a>
      </div>
    </div>
  );
};

export default Navigation; 