import React, { useState, useEffect } from 'react';
import { Table, Input, Select, message, Tabs, Tag, Spin } from 'antd';
import type { TableColumnsType } from 'antd';
import type { EntryData } from '../types';
import { typeColorMap } from '../types';
import DataManager from '../utils/dataManager';

const { Search } = Input;

// 数据接口
interface DataState {
  outsiderEntries: EntryData[];
  talismanEntries: EntryData[];
  inGameEntries: EntryData[];
  otherEntries: EntryData[];
  loading: boolean;
}

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
  { value: '仅限特定武器', label: '仅限特定武器' },
  { value: '出击时的武器（战技）', label: '出击时的武器（战技）' },
  { value: '出击时的武器（附加）', label: '出击时的武器（附加）' },
  { value: '出击时的道具', label: '出击时的道具' },
  { value: '场地环境', label: '场地环境' },
];

const otherTypeOptions = [
  { value: '庇佑', label: '庇佑' },
  { value: '不甘', label: '不甘' },
];

const tagRender = (props: { label: React.ReactNode; value: string; closable?: boolean; onClose?: () => void }) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
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

const getTypeColor = (type: string | null | undefined): string => {
  if (!type) return 'default';
  return typeColorMap[type] || 'default';
};

const EntryDetailView: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedOtherTypes, setSelectedOtherTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeEntryTab, setActiveEntryTab] = useState('局外词条');
  const [data, setData] = useState<DataState>({
    outsiderEntries: [],
    talismanEntries: [],
    inGameEntries: [],
    otherEntries: [],
    loading: true
  });

  // 从DataManager获取数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const dataManager = DataManager.getInstance();
        await dataManager.waitForData();

        setData({
          outsiderEntries: dataManager.getOutsiderEntries(),
          talismanEntries: dataManager.getTalismanEntries(),
          inGameEntries: dataManager.getInGameEntries(),
          otherEntries: dataManager.getOtherEntries(),
          loading: false
        });
      } catch (error) {
        console.error('Failed to load data:', error);
        message.error('数据加载失败');
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    loadData();
  }, []);

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
      filters: [
        { text: '可叠加', value: '可叠加' },
        { text: '不可叠加', value: '不可叠加' },
        { text: '未知', value: '未知' },
      ],
      onFilter: (value, record) => record.superposability === value,
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
    let tableData: EntryData[] = [];
    let columns: TableColumnsType<EntryData>;
    
    switch (tabKey) {
      case '局外词条':
        tableData = data.outsiderEntries;
        columns = outsiderColumns;
        tableData = filterData(tableData, searchKeyword, selectedTypes);
        break;
      case '护符词条':
        tableData = data.talismanEntries;
        columns = talismanColumns;
        tableData = filterData(tableData, searchKeyword);
        break;
      case '局内词条':
        tableData = data.inGameEntries;
        columns = inGameColumns;
        tableData = filterData(tableData, searchKeyword);
        break;
      case '其他词条':
        tableData = data.otherEntries;
        columns = otherColumns;
        tableData = filterData(tableData, searchKeyword, selectedOtherTypes);
        break;
      default:
        tableData = data.outsiderEntries;
        columns = outsiderColumns;
        tableData = filterData(tableData, searchKeyword, selectedTypes);
    }

    // 表格样式
    return (
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="entry_id"
        pagination={{ 
          current: currentPage,
          pageSize: 15,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: (page) => setCurrentPage(page),
          style: { marginTop: '25px' }
        }}
        scroll={{ x: tabKey === '局外词条' ? 900 : tabKey === '护符词条' ? 800 : activeEntryTab === '局内词条' ? 700 : 650 }}
        size="middle"
        loading={data.loading}
      />
    );
  };

  // 渲染搜索和筛选器的函数
  const renderSearchAndFilter = (tabKey: string) => {
    if (data.loading) {
      return (
        <div className="loading-container">
          <Spin spinning={true} />
        </div>
      );
    }

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

  return (
    <div className="content-wrapper">
      <div className="tabs-container">
        <Tabs
          activeKey={activeEntryTab}
          onChange={(key) => {
            setActiveEntryTab(key);
            setCurrentPage(1);
          }}
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
      </div>
    </div>
  );
};

export default EntryDetailView; 