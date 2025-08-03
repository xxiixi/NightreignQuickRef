import { useState, useEffect } from 'react';
import { Table, Typography, Space, Tag, Button, ConfigProvider, theme, Input } from 'antd';
import type { TableColumnsType } from 'antd';
import { geekblue } from '@ant-design/colors';
import { BulbOutlined, BulbFilled, GlobalOutlined, SearchOutlined } from '@ant-design/icons';
import outsiderEntries from './data/zh-CN/outsider_entries_zh-CN.json';
import talismanEntries from './data/zh-CN/talisman_entries_zh-CN.json';
import inGameEntries from './data/zh-CN/in-game_entries_zh-CN.json';
import otherEntries from './data/zh-CN/other_entries_zh-CN.json';
import './App.css';

const { Title, Text } = Typography;
const { Search } = Input;

// 定义数据接口
interface EntryData {
  entry_id: string;
  entry_name: string;
  entry_type?: string | null;
  explanation: string | null;
  superposability?: string | null
  talisman?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('局外词条');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 搜索过滤函数
  const filterData = (data: EntryData[], searchValue: string) => {
    if (!searchValue.trim()) return data;
    
    const searchLower = searchValue.toLowerCase();
    return data.filter(item => 
      item.entry_name?.toLowerCase().includes(searchLower) ||
      item.explanation?.toLowerCase().includes(searchLower) ||
      item.entry_type?.toLowerCase().includes(searchLower) ||
      item.superposability?.toLowerCase().includes(searchLower) ||
      item.talisman?.toLowerCase().includes(searchLower) ||
      item.entry_id?.toLowerCase().includes(searchLower)
    );
  };

  // 获取当前过滤后的数据
  const getCurrentData = () => {
    let data: EntryData[] = [];
    switch (activeTab) {
      case '局外词条':
        data = outsiderEntries as EntryData[];
        break;
      case '护符词条':
        data = talismanEntries as EntryData[];
        break;
      case '局内词条':
        data = inGameEntries as EntryData[];
        break;
      case '其他词条':
        data = otherEntries as EntryData[];
        break;
      default:
        data = outsiderEntries as EntryData[];
    }
    return filterData(data, searchKeyword);
  };

  // 主题切换函数
  const toggleTheme = () => {
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

  // 初始化主题
  useEffect(() => {
    // 从localStorage读取主题设置
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let shouldUseDark = false;
    if (savedTheme) {
      shouldUseDark = savedTheme === 'dark';
    } else {
      shouldUseDark = prefersDark;
    }
    
    setIsDarkMode(shouldUseDark);
    
    if (shouldUseDark) {
      document.body.setAttribute('tomato-theme', 'dark');
    } else {
      document.body.removeAttribute('tomato-theme');
    }
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) { // 只有用户没有手动设置主题时才跟随系统
        const newTheme = e.matches;
        setIsDarkMode(newTheme);
        
        if (newTheme) {
          document.body.setAttribute('tomato-theme', 'dark');
        } else {
          document.body.removeAttribute('tomato-theme');
        }
      }
    };

    darkThemeMq.addEventListener('change', handleThemeChange);
    
    return () => {
      darkThemeMq.removeEventListener('change', handleThemeChange);
    };
  }, []);

  // 局外词条表格列定义
  const outsiderColumns: TableColumnsType<EntryData> = [
    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: 150,
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: 300,
      render: (text) => text || '-',
    },
    {
      title: '词条类型',
      dataIndex: 'entry_type',
      key: 'entry_type',
      width: 50,
      render: (text) => text || '-',
    },
    {
      title: '可叠加性',
      dataIndex: 'superposability',
      key: 'superposability',
      width: 55,
      render: (text) => text || '-',
    },
    {
      title: '词条ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: 50,
    },
  ];

  // 护符词条表格列定义
  const talismanColumns: TableColumnsType<EntryData> = [
    {
      title: '护符',
      dataIndex: 'talisman',
      key: 'talisman',
      width: 100,
      render: (text) => text || '-',
    },
    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: 150,
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: 300,
      render: (text) => text || '-',
    },
    {
      title: '词条ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: 50,
    },
  ];

  // 局内词条表格列定义
  const inGameColumns: TableColumnsType<EntryData> = [

    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: 150,
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: 400,
      render: (text) => text || '-',
    },
    {
      title: '词条ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: 50,
    },
  ];

  // 其他词条表格列定义
  const otherColumns: TableColumnsType<EntryData> = [
    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: 150,
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: 400,
      render: (text) => text || '-',
    },
    {
      title: '词条类型',
      dataIndex: 'entry_type',
      key: 'entry_type',
      width: 50,
      render: (text) => text || '-',
    },
    {
      title: '词条ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: 50,
    },
  ];

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
        <div className="top-bar">
          <div className="top-bar-content">
            <div className="top-bar-left">
              {/* 左侧可以放置其他内容 */}
            </div>
            <div className="top-bar-right">
              <Space size="middle">
                <Button
                  type="text"
                  icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                />
                <Button
                  type="text"
                  icon={<GlobalOutlined />}
                  onClick={() => setIsEnglish(!isEnglish)}
                  className="language-toggle-btn"
                />
              </Space>
            </div>
          </div>
        </div>

        <div className="header">
          <Title level={1} className="main-title">
            nightreign reference notebook
          </Title>
          <Space direction="vertical" size="small" className="subtitle">
            <Text type="secondary" className="footer-text">
              based on version 1.0.0 | created by xxiixi
            </Text>
          </Space>
        </div>

        {/* 自定义按钮组 */}
        <div className="custom-buttons-container">
          <Button
            type={activeTab === '局外词条' ? 'primary' : 'default'}
            size="large"
            onClick={() => setActiveTab('局外词条')}
            className="custom-tab-button"
          >
            局外词条
          </Button>
          <Button
            type={activeTab === '护符词条' ? 'primary' : 'default'}
            size="large"
            onClick={() => setActiveTab('护符词条')}
            className="custom-tab-button"
          >
            护符词条
          </Button>
          <Button
            type={activeTab === '局内词条' ? 'primary' : 'default'}
            size="large"
            onClick={() => setActiveTab('局内词条')}
            className="custom-tab-button"
          >
            局内词条
          </Button>
          <Button
            type={activeTab === '其他词条' ? 'primary' : 'default'}
            size="large"
            onClick={() => setActiveTab('其他词条')}
            className="custom-tab-button"
          >
            其他词条
          </Button>
        </div>

        <div className="content-wrapper">
          <div className="tabs-container">
            {/* 搜索框 */}
            <div className="search-container">
              <Search 
                placeholder={`搜索${activeTab}...`}
                onSearch={(value) => setSearchKeyword(value)}
                className="custom-search-input"
                allowClear
              />
            </div>
            
            <Table
              columns={activeTab === '局外词条' ? outsiderColumns : activeTab === '护符词条' ? talismanColumns : activeTab === '局内词条' ? inGameColumns : otherColumns}
              dataSource={getCurrentData()}
              rowKey="entry_id"
              pagination={{ 
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
              }}
              scroll={{ x: activeTab === '局外词条' ? 900 : activeTab === '护符词条' ? 800 : activeTab === '局内词条' ? 700 : 650 }}
              size="middle"
            />
          </div>
        </div>
        <div className="footer">
            <Space direction="vertical" size="small" align="center">
              <Text type="secondary" className="footer-text">
                Check out the project or report an issue on{' '}
                <a 
                  href="https://github.com/xxiixi/NightreignQuickRef" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Github
                </a>
              </Text>
            </Space>
          </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
