import { useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { geekblue } from '@ant-design/colors';
// import zhCN from 'antd/locale/zh_CN';
// import enUS from 'antd/locale/en_US';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import FunctionMenu from './components/FunctionMenu';
import LoadingSpinner from './components/LoadingSpinner';
import EntryDetailView from './pages/EntryDetailView';
import GameMechanicsView from './pages/GameMechanicsView';
import LegendaryWeaponView from './pages/LegendaryWeaponView';
import CharacterDataView from './pages/CharacterDataView';
import BossDataView from './pages/BossDataView';
import { initializeTheme, setupThemeListener } from './utils/themeUtils';
import DataManager from './utils/dataManager';
import { getDefaultPage } from './config/navigationConfig';

function App() {
  const [activeTab, setActiveTab] = useState(getDefaultPage());
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const [isEnglish, setIsEnglish] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // 子Tab和Step状态管理
  const [activeSubTab, setActiveSubTab] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);

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
  // const handleToggleLanguage = () => {
  //   setIsEnglish(!isEnglish);
  // };

  // 子Tab切换处理
  const handleSubTabChange = (tabKey: string) => {
    setActiveSubTab(tabKey);
  };

  // Step切换处理
  const handleStepChange = (stepIndex: number) => {
    setActiveStep(stepIndex);
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

  // 主Tab切换时重置子Tab和Step状态
  useEffect(() => {
    setActiveSubTab('');
    setActiveStep(0);
  }, [activeTab]);

  // 子Tab为一次性指令：生效后立即清空，避免持续控制子组件，阻止手动切换
  useEffect(() => {
    if (activeSubTab) {
      const timer = setTimeout(() => setActiveSubTab(''), 0);
      return () => clearTimeout(timer);
    }
  }, [activeSubTab]);

  // 渲染内容
  const renderContent = () => {
    switch (activeTab) {
      case '词条详细数据':
        return <EntryDetailView activeSubTab={activeSubTab} />;
      case '传说武器详情':
        return <LegendaryWeaponView activeStep={activeStep} />;
      case '角色数据':
        return <CharacterDataView />;
      case '游戏机制':
        return <GameMechanicsView functionName="游戏机制" />;
      case '夜王Boss数据':
        return <BossDataView activeSubTab={activeSubTab} />;
      default:
        return <EntryDetailView activeSubTab={activeSubTab} />;
    }
  };

  // 统一的主题配置
  const themeConfig = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: isDarkMode ? geekblue[4] : geekblue[6],
      colorPrimaryHover: isDarkMode ? geekblue[3] : geekblue[5],
      colorPrimaryActive: isDarkMode ? geekblue[5] : geekblue[7],
    },
  };

  return (
    <ConfigProvider 
      theme={themeConfig}
      // locale={isEnglish ? enUS : zhCN}
    >
      {!isDataLoaded ? (
        <LoadingSpinner message="正在加载数据，请稍候..." />
      ) : (
        <div className="app-container">
          <FunctionMenu 
            onTabChange={setActiveTab} 
            onSubTabChange={handleSubTabChange}
            onStepChange={handleStepChange}
          />
          
          <Header
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
            // onToggleLanguage={handleToggleLanguage}
          />

          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {renderContent()}

          <Footer />
        </div>
      )}
    </ConfigProvider>
  );
}

export default App;
