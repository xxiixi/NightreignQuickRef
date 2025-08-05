import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { geekblue } from '@ant-design/colors';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import EntryDetailView from './components/EntryDetailView';
import OtherFunctionView from './components/OtherFunctionView';
import LegendaryWeaponView from './components/LegendaryWeaponView';
import { initializeTheme, setupThemeListener } from './utils/themeUtils';

function App() {
  const [activeTab, setActiveTab] = useState('词条详细数据');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);

  // 主题切换函数
  const handleToggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    // 更新body属性
    if (newTheme) {
      document.body.setAttribute('tomato-theme', 'dark');
    } else {
      document.body.removeAttribute('tomato-theme');
    }
    
    // 保存到localStorage
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // 语言切换函数
  const handleToggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  // 初始化主题
  useEffect(() => {
    initializeTheme(setIsDarkMode);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const cleanup = setupThemeListener(setIsDarkMode);
    return cleanup;
  }, []);

  // 渲染内容
  const renderContent = () => {
    switch (activeTab) {
      case '词条详细数据':
        return <EntryDetailView />;
      case '传说武器详情':
        return <LegendaryWeaponView />;
      case '功能3':
        return <OtherFunctionView functionName="功能3" />;
      case '功能4':
        return <OtherFunctionView functionName="功能4" />;
      default:
        return <EntryDetailView />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : undefined,
        token: {
          colorPrimary: isDarkMode ? geekblue[4] : geekblue[6],
          colorPrimaryHover: isDarkMode ? geekblue[3] : geekblue[5],
          colorPrimaryActive: isDarkMode ? geekblue[5] : geekblue[7],
        },
      }}
    >
      <div className="app-container">
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onToggleLanguage={handleToggleLanguage}
        />

        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="content-wrapper">
          <div className="tabs-container">
            {renderContent()}
          </div>
        </div>

        <Footer />
      </div>
    </ConfigProvider>
  );
}

export default App;
