import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { geekblue } from '@ant-design/colors';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import FunctionMenu from './components/FunctionMenu';
import LoadingSpinner from './components/LoadingSpinner';
import EntryDetailView from './pages/EntryDetailView';
import OtherFunctionView from './pages/OtherFunctionView';
import LegendaryWeaponView from './pages/LegendaryWeaponView';
import CharacterDataView from './pages/CharacterDataView';
import { initializeTheme, setupThemeListener } from './utils/themeUtils';
import DataManager from './utils/dataManager';

function App() {
  const [activeTab, setActiveTab] = useState('角色数据');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // 触发自定义主题变化事件
    window.dispatchEvent(new Event('themeChange'));
  };

  // 语言切换
  const handleToggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  // 预加载所有数据
  useEffect(() => {
    const dataManager = DataManager.getInstance();
    dataManager.preloadAllData().then(() => {
      setIsDataLoaded(true);
    }).catch((error) => {
      console.error('数据预加载失败:', error);
    });
  }, []);

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
      case '角色数据':
        return <CharacterDataView />;
      case '功能4':
        return <OtherFunctionView functionName="功能4" />;
      default:
        return <EntryDetailView />;
    }
  };

  // 如果数据还未加载完成，显示加载动画
  if (!isDataLoaded) {
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
        <LoadingSpinner message="正在加载游戏数据，请稍候..." />
      </ConfigProvider>
    );
  }

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
        <FunctionMenu onTabChange={setActiveTab} />
        
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onToggleLanguage={handleToggleLanguage}
        />

        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === '角色数据' ? (
          renderContent()
        ) : (
          <div className="content-wrapper">
            <div className="tabs-container">
              {renderContent()}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </ConfigProvider>
  );
}

export default App;
