import { useState, useEffect } from 'react';
import { Table, Typography, Space, Tag, Button, ConfigProvider, theme, Input, Select, message, Tabs } from 'antd';
import type { TableColumnsType } from 'antd';
import { geekblue } from '@ant-design/colors';
import { MoonOutlined, SunOutlined, TranslationOutlined, HeartOutlined, GithubOutlined } from '@ant-design/icons';
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

// 词条类型颜色映射
const typeColorMap: Record<string, string> = {
  '能力': 'blue',
  '攻击力': 'red',
  '技艺/绝招': 'orange',
  '魔法/祷告': 'purple',
  '减伤率': 'green',
  '对异常状态的抵抗力': 'cyan',
  '恢复': 'lime',
  '行动': 'geekblue',
  '队伍成员': 'magenta',
  '仅限特定角色': 'gold',
  '仅限特定武器': 'volcano',
  '出击时的武器（战技）': 'geekblue',
  '出击时的武器（附加）': 'blue',
  '出击时的道具': 'orange',
  '场地环境': 'green',
  '庇佑': 'purple',
  '不甘': 'volcano',
};

const outsiderTypeOptions = [
  { value: '能力', label: '能力' },
  { value: '攻击力', label: '攻击力' },
  { value: '技艺/绝招', label: '技艺/绝招' },
  { value: '魔法/祷告', label: '魔法/祷告' },
  { value: '减伤率', label: '减伤率' },
  { value: '对异常状态的抵抗力', label: '对异常状态的抵抗力' },
  { value: '恢复', label: '恢复' },
  { value: '行动', label: '行动' },
  { value: '队伍成员', label: '队伍成员' },
  { value: '仅限特定角色', label: '仅限特定角色' },
  { value: '仅限特定武器', label: '仅限特定武器' }, // 数据中暂无，可后续补充
  { value: '出击时的武器（战技）', label: '出击时的武器（战技）' }, // 数据中暂无
  { value: '出击时的武器（附加）', label: '出击时的武器（附加）' }, // 数据中暂无
  { value: '出击时的道具', label: '出击时的道具' }, // 数据中暂无
  { value: '场地环境', label: '场地环境' }, // 数据中暂无
];

const otherTypeOptions = [
  { value: '庇佑', label: '庇佑' },
  { value: '不甘', label: '不甘' },
];

const tagRender = (props: any) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  // 根据类型获取颜色
  const color = typeColorMap[value] || 'default';
  
  return (
    <Tag
      color={color}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

// 获取词条类型颜色的函数
const getTypeColor = (type: string | null | undefined): string => {
  if (!type) return 'default';
  return typeColorMap[type] || 'default';
};

function App() {
  const [activeTab, setActiveTab] = useState('词条详细数据');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedOtherTypes, setSelectedOtherTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeEntryTab, setActiveEntryTab] = useState('局外词条');

  // 搜索过滤函数
  const filterData = (data: EntryData[], searchValue: string, types?: string[]) => {
    let filtered = data;
    if (types && types.length > 0) {
      filtered = filtered.filter(item => types.includes(item.entry_type || ''));
    }
    if (!searchValue.trim()) return filtered;
    
    const searchLower = searchValue.toLowerCase();
    return filtered.filter(item => 
      item.entry_name?.toLowerCase().includes(searchLower) ||
      item.explanation?.toLowerCase().includes(searchLower) ||
      item.entry_type?.toLowerCase().includes(searchLower) ||
      item.superposability?.toLowerCase().includes(searchLower) ||
      item.talisman?.toLowerCase().includes(searchLower) ||
      item.entry_id?.toLowerCase().includes(searchLower)
    );
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
      width: 170,
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: 270,
      render: (text) => text || '-',
    },
    {
      title: '词条类型',
      dataIndex: 'entry_type',
      key: 'entry_type',
      align: 'center',
      width: 80,
      render: (text) => text ? (
        <Tag color={getTypeColor(text)}>{text}</Tag>
      ) : '-',
    },
    {
      title: '叠加性',
      dataIndex: 'superposability',
      key: 'superposability',
      width: 55,
      align: 'center',
      render: (text) => text || '-',
    },
    {
      title: '词条ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: 50,
      align: 'center',
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
      render: (text) => text ? (
        <Tag color={getTypeColor(text)}>{text}</Tag>
      ) : '-',
    },
    {
      title: '词条ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: 50,
    },
  ];

  // 渲染表格内容
  const renderTableContent = (tabKey: string) => {
    let data: EntryData[] = [];
    let columns: TableColumnsType<EntryData>;
    
    switch (tabKey) {
      case '局外词条':
        data = outsiderEntries as EntryData[];
        columns = outsiderColumns;
        data = filterData(data, searchKeyword, selectedTypes);
        break;
      case '护符词条':
        data = talismanEntries as EntryData[];
        columns = talismanColumns;
        data = filterData(data, searchKeyword);
        break;
      case '局内词条':
        data = inGameEntries as EntryData[];
        columns = inGameColumns;
        data = filterData(data, searchKeyword);
        break;
      case '其他词条':
        data = otherEntries as EntryData[];
        columns = otherColumns;
        data = filterData(data, searchKeyword, selectedOtherTypes);
        break;
      default:
        data = outsiderEntries as EntryData[];
        columns = outsiderColumns;
        data = filterData(data, searchKeyword, selectedTypes);
    }

    return (
      <Table
        columns={columns}
        dataSource={data}
        rowKey="entry_id"
        pagination={{ 
          current: currentPage,
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: (page) => setCurrentPage(page)
        }}
        scroll={{ x: tabKey === '局外词条' ? 900 : tabKey === '护符词条' ? 800 : activeTab === '局内词条' ? 700 : 650 }}
        size="middle"
      />
    );
  };

  // 渲染搜索和筛选器的函数
  const renderSearchAndFilter = (tabKey: string) => {
    if (tabKey === '局外词条') {
      return (
        <div className="filter-search-row">
          <Search 
            placeholder={`搜索 ${tabKey} 关键字`}
            onSearch={(value) => {
              setSearchKeyword(value);
              setCurrentPage(1);
            }}
            className="custom-search-input"
            allowClear
          />
          <Select
            className="outsider-type-select"
            mode="multiple"
            allowClear
            tagRender={tagRender}
            placeholder="按词条类型筛选（最多3项）"
            value={selectedTypes}
            onChange={(values) => {
              if (values && values.length > 3) {
                message.warning('最多只能选择3个词条类型');
                return;
              }
              setSelectedTypes(values);
              setCurrentPage(1);
            }}
            options={outsiderTypeOptions}
            maxTagPlaceholder={omittedValues => `+${omittedValues.length}...`}
            maxTagCount={3}
            maxCount={3}
          />
        </div>
      );
    } else if (tabKey === '其他词条') {
      return (
        <div className="filter-search-row">
          <Search 
            placeholder={`搜索 ${tabKey} 关键字`}
            onSearch={(value) => {
              setSearchKeyword(value);
              setCurrentPage(1);
            }}
            className="custom-search-input"
            allowClear
          />
          <Select
            className="outsider-type-select"
            mode="multiple"
            allowClear
            tagRender={tagRender}
            placeholder="按词条类型筛选"
            value={selectedOtherTypes}
            onChange={(values) => {
              setSelectedOtherTypes(values);
              setCurrentPage(1);
            }}
            options={otherTypeOptions}
            maxTagPlaceholder={omittedValues => `+${omittedValues.length}...`}
          />
        </div>
      );
    } else {
      return (
        <div className="search-container">
          <Search 
            placeholder={`搜索 ${tabKey} 关键字`}
            onSearch={(value) => {
              setSearchKeyword(value);
              setCurrentPage(1);
            }}
            className="custom-search-input"
            allowClear
          />
        </div>
      );
    }
  };

  // 渲染词条详细数据内容
  const renderEntryDetailContent = () => {
    return (
      <Tabs
        activeKey={activeEntryTab}
        onChange={(key) => setActiveEntryTab(key)}
        items={[
          {
            key: '局外词条',
            label: '局外词条',
            children: (
              <div>
                {renderSearchAndFilter('局外词条')}
                {renderTableContent('局外词条')}
              </div>
            ),
          },
          {
            key: '护符词条',
            label: '护符词条',
            children: (
              <div>
                {renderSearchAndFilter('护符词条')}
                {renderTableContent('护符词条')}
              </div>
            ),
          },
          {
            key: '局内词条',
            label: '局内词条',
            children: (
              <div>
                {renderSearchAndFilter('局内词条')}
                {renderTableContent('局内词条')}
              </div>
            ),
          },
          {
            key: '其他词条',
            label: '其他词条',
            children: (
              <div>
                {renderSearchAndFilter('其他词条')}
                {renderTableContent('其他词条')}
              </div>
            ),
          },
        ]}
        className="custom-tabs"
      />
    );
  };

  // 渲染其他功能内容
  const renderOtherFunctionContent = (functionName: string) => {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Title level={3}>{functionName}</Title>
        <Text type="secondary">此功能正在开发中...</Text>
      </div>
    );
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
        <div className="top-bar">
          <div className="top-bar-content">
            <div className="top-bar-left">
              {/* 左侧可以放置其他内容 */}
            </div>
            <div className="top-bar-right">
              <Space size="middle">
                <Button
                  type="text"
                  icon={isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                />
                <Button
                  type="text"
                  icon={<TranslationOutlined />}
                  onClick={() => setIsEnglish(!isEnglish)}
                  className="language-toggle-btn"
                />
              </Space>
            </div>
          </div>
        </div>

        <div className="header">
          <Title level={1} className="main-title">
            Nightreign Reference Notebook
          </Title>
          <Space direction="vertical" size="small" className="subtitle">
            <Text type="secondary" className="subtitle-text">
              黑夜君临内容速查工具，按游戏内结构分类整理，可快速检索条目信息，后续会添加更多内容。
            </Text>
          </Space>
        </div>

        {/* 自定义按钮组 */}
        <div className="custom-buttons-container">
          <div className={`custom-tab-button ${activeTab === '词条详细数据' ? 'active' : ''}`}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('词条详细数据'); }}>
              词条详细数据
            </a>
          </div>
          <div className={`custom-tab-button ${activeTab === '功能2' ? 'active' : ''}`}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('功能2'); }}>
              功能2
            </a>
          </div>
          <div className={`custom-tab-button ${activeTab === '功能3' ? 'active' : ''}`}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('功能3'); }}>
              功能3
            </a>
          </div>
          <div className={`custom-tab-button ${activeTab === '功能4' ? 'active' : ''}`}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('功能4'); }}>
              功能4
            </a>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="tabs-container">
            {/* 根据当前选中的功能渲染不同内容 */}
            {activeTab === '词条详细数据' && renderEntryDetailContent()}
            {activeTab === '功能2' && renderOtherFunctionContent('功能2')}
            {activeTab === '功能3' && renderOtherFunctionContent('功能3')}
            {activeTab === '功能4' && renderOtherFunctionContent('功能4')}
          </div>
        </div>
        <div className="footer">
          <Space direction="vertical" size="middle" align="center">
            <Text type="secondary" className="footer-text">
              <HeartOutlined style={{ marginRight: '4px' }} />
              Created by{' '}
              <a 
                href="https://github.com/xxiixi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="author-link"
              >
                Cecilia
              </a>
             
              ｜
              <GithubOutlined style={{ marginRight: '4px' }} />
              Report an issue on{' '}
              <a 
                href="https://github.com/xxiixi/NightreignQuickRef" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                NightreignQuickRef
              </a>
            </Text>
            <Text type="secondary" className="footer-text">
              © 2025 NightreignQuickRef · All Rights Reserved
            </Text>
            <Text type="secondary" className="footer-text">
              Last updated: August 4, 2025 | Based on Elden Ring: Nightreign version 1.01.3
            </Text>
          </Space>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
