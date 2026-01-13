import React from 'react';
import { mainNavigationItems } from '../config/navigationConfig';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = React.memo(({ activeTab, onTabChange }) => {
  return (
    <div className="custom-buttons-container">
      {mainNavigationItems.map((item) => (
        <div key={item.key} className={`custom-tab-button ${activeTab === item.key ? 'active' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); onTabChange(item.key); }}>
            {item.label}
          </a>
        </div>
      ))}
    </div>
  );
});

export default Navigation; 