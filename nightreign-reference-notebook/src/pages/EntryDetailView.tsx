import React, { useState, useEffect } from 'react';
import { Table, Input, Select, message, Tabs, Tag, Spin, Button} from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import type { EntryData } from '../types';
import { typeColorMap } from '../types';
import DataManager from '../utils/dataManager';
import type { EnhancementCategory } from '../utils/dataManager';

// 扩展的强化类别接口，用于表格显示
interface EnhancedEnhancementCategory extends EnhancementCategory {
  skillType?: string;
  skills?: string[];
}

type OnChange = NonNullable<TableProps<EntryData>['onChange']>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const { Search } = Input;

// 数据接口
interface DataState {
  outsiderEntries: EntryData[];
  talismanEntries: EntryData[];
  inGameEntries: EntryData[];
  otherEntries: EntryData[];
  enhancementCategories: EnhancementCategory[];
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

const characterOptions = [
  { value: '追踪者', label: '追踪者' },
  { value: '守护者', label: '守护者' },
  { value: '女爵', label: '女爵' },
  { value: '执行者', label: '执行者' },
  { value: '铁之眼', label: '铁之眼' },
  { value: '复仇者', label: '复仇者' },
  { value: '隐士', label: '隐士' },
  { value: '无赖', label: '无赖' },
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

const getSuperposabilityColor = (superposability: string | null | undefined): string => {
  if (!superposability) return 'default';
  
  switch (superposability) {
    case '可叠加':
      return 'green';
    case '不可叠加':
      return 'red';
    case '未知':
      return 'orange';
    default:
      return 'default';
  }
};

const EntryDetailView: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedOtherTypes, setSelectedOtherTypes] = useState<string[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [activeEntryTab, setActiveEntryTab] = useState('局外词条');
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [data, setData] = useState<DataState>({
    outsiderEntries: [],
    talismanEntries: [],
    inGameEntries: [],
    otherEntries: [],
    enhancementCategories: [],
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
          enhancementCategories: dataManager.getEnhancementCategories(),
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

  // 清除所有筛选和排序
  const clearAll = () => {
    setSearchKeyword('');
    setSelectedTypes([]);
    setSelectedOtherTypes([]);
    setSelectedCharacter('');
    setFilteredInfo({});
    setSortedInfo({});
    setCurrentPage(1);
    setPageSize(20); 
    message.success('已清除所有筛选和排序');
  };

  // 表格变化处理函数
  const handleTableChange: OnChange = (_pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  // 强化类别表格变化处理函数
  const handleEnhancementTableChange: TableProps<EnhancementCategory>['onChange'] = (_pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  // 搜索过滤函数
  const filterData = (data: EntryData[], searchValue: string, types?: string[], character?: string) => {
    let filtered = data;
    if (types && types.length > 0) {
      filtered = filtered.filter(item => types.includes(item.entry_type || ''));
    }
    if (character && character.trim()) {
      filtered = filtered.filter(item => 
        item.entry_name?.includes(character) || 
        item.explanation?.includes(character)
      );
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



  // 强化类别转换后数据的搜索过滤函数
  const filterTransformedEnhancementData = (data: EnhancedEnhancementCategory[], searchValue: string) => {
    if (!searchValue.trim()) return data;
    
    const searchLower = searchValue.toLowerCase();
    return data.filter(item => 
      item.category.toLowerCase().includes(searchLower) ||
      (item.skillType && item.skillType.toLowerCase().includes(searchLower)) ||
      (item.skills && item.skills.some(skill => 
        skill.toLowerCase().includes(searchLower)
      )) ||
      (item.notes && item.notes.some(note => 
        note.toLowerCase().includes(searchLower)
      ))
    );
  };

  // 将强化类别数据转换为支持rowSpan的格式
  const transformEnhancementData = (data: EnhancementCategory[]): EnhancedEnhancementCategory[] => {
    const transformedData: EnhancedEnhancementCategory[] = [];
    
    data.forEach(item => {
      Object.entries(item.applicable_scope).forEach(([skillType, skills]) => {
        transformedData.push({
          ...item,
          skillType,
          skills,
        });
      });
    });
    
    return transformedData;
  };

  // 局外词条表格列定义
  const outsiderColumns: TableColumnsType<EntryData> = [
    {
      title: 'ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: '10%',
      align: 'center',
      onCell: () => ({
        style: {fontSize: '12px', color: 'var(--theme-text-secondary)' }
      }),
      sorter: (a, b) => {
        const idA = a.entry_id || '';
        const idB = b.entry_id || '';
        return idA.localeCompare(idB);
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'entry_id' ? sortedInfo.order : null,
    },
    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: '30%',
      sorter: (a, b) => {
        const nameA = a.entry_name || '';
        const nameB = b.entry_name || '';
        return nameA.localeCompare(nameB, 'zh-CN');
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'entry_name' ? sortedInfo.order : null,
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: '40%',
      render: (text) => text || '-',
    },
    {
      title: '词条类型',
      dataIndex: 'entry_type',
      key: 'entry_type',
      align: 'center',
      width: '15%',
      render: (text) => text ? (
        <Tag color={getTypeColor(text)}>{text}</Tag>
      ) : '-',
    },
    {
      title: '叠加性',
      dataIndex: 'superposability',
      key: 'superposability',
      width: '12%',
      align: 'center',
      render: (text) => text ? (
        <Tag color={getSuperposabilityColor(text)}>{text}</Tag>
      ) : '-',
      filters: [
        { text: '可叠加', value: '可叠加' },
        { text: '不可叠加', value: '不可叠加' },
        { text: '未知', value: '未知' },
      ],
      filteredValue: filteredInfo.superposability || null,
      onFilter: (value, record) => record.superposability === value,
    },
  ];

  // 护符词条表格列定义
  const talismanColumns: TableColumnsType<EntryData> = [
    {
      title: 'ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: '10%',
      align: 'center',
      onCell: () => ({
        style: {fontSize: '12px', color: 'var(--theme-text-secondary)' }
      }),
      sorter: (a, b) => {
        const idA = a.entry_id || '';
        const idB = b.entry_id || '';
        return idA.localeCompare(idB);
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'entry_id' ? sortedInfo.order : null,
    },
    {
      title: '护符',
      dataIndex: 'talisman',
      key: 'talisman',
      width: '15%',
      render: (text) => text || '-',
    },
    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: '30%',
      sorter: (a, b) => {
        const nameA = a.entry_name || '';
        const nameB = b.entry_name || '';
        return nameA.localeCompare(nameB, 'zh-CN');
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'entry_name' ? sortedInfo.order : null,
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: '45%',
      render: (text) => text || '-',
    },
  ];

  // 局内词条表格列定义
  const inGameColumns: TableColumnsType<EntryData> = [
    {
      title: 'ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: '10%',
      align: 'center',
      onCell: () => ({
        style: {fontSize: '12px', color: 'var(--theme-text-secondary)' }
      }),
      sorter: (a, b) => {
        const idA = a.entry_id || '';
        const idB = b.entry_id || '';
        return idA.localeCompare(idB);
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'entry_id' ? sortedInfo.order : null,
    },
    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: '35%',
      sorter: (a, b) => {
        const nameA = a.entry_name || '';
        const nameB = b.entry_name || '';
        return nameA.localeCompare(nameB, 'zh-CN');
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'entry_name' ? sortedInfo.order : null,
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: '55%',
      render: (text) => text || '-',
    },
  ];

  // 其他词条表格列定义
  const otherColumns: TableColumnsType<EntryData> = [
    {
      title: 'ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: '10%',
      align: 'center',
      onCell: () => ({
        style: {fontSize: '12px', color: 'var(--theme-text-secondary)' }
      }),
      sorter: (a, b) => {
        const idA = a.entry_id || '';
        const idB = b.entry_id || '';
        return idA.localeCompare(idB);
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'entry_id' ? sortedInfo.order : null,
    },
    {
      title: '词条名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: '20%',
      sorter: (a, b) => {
        const nameA = a.entry_name || '';
        const nameB = b.entry_name || '';
        return nameA.localeCompare(nameB, 'zh-CN');
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'entry_name' ? sortedInfo.order : null,
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: '55%',
      render: (text) => text || '-',
    },
    {
      title: '词条类型',
      dataIndex: 'entry_type',
      key: 'entry_type',
      width: '15%',
      render: (text) => text ? (
        <Tag color={getTypeColor(text)}>{text}</Tag>
      ) : '-',
    },
  ];

  // 创建强化类别表格列定义
  const createEnhancementColumns = (paginatedData: EnhancedEnhancementCategory[]): TableColumnsType<EnhancedEnhancementCategory> => {
    // 计算rowSpan信息
    const rowSpanInfo = new Map<string, { firstIndex: number; count: number }>();
    
    paginatedData.forEach((item, index) => {
      if (!rowSpanInfo.has(item.category)) {
        const categoryRows = paginatedData.filter(row => row.category === item.category);
        rowSpanInfo.set(item.category, {
          firstIndex: index,
          count: categoryRows.length
        });
      }
    });

    return [
      {
        title: '强化类别',
        dataIndex: 'category',
        key: 'category',
        width: '15%',
        align: 'center',
        sorter: (a: EnhancedEnhancementCategory, b: EnhancedEnhancementCategory) => a.category.localeCompare(b.category, 'zh-CN'),
        sortDirections: ['ascend', 'descend'] as const,
        sortOrder: sortedInfo.columnKey === 'category' ? sortedInfo.order : null,
        onCell: (record: EnhancedEnhancementCategory, index?: number) => {
          const info = rowSpanInfo.get(record.category);
          if (info && index === info.firstIndex) {
            return { rowSpan: info.count };
          }
          return { rowSpan: 0 };
        },
      },
      {
        title: '技能类型',
        dataIndex: 'skillType',
        key: 'skillType',
        width: '10%',
        align: 'center',
        render: (_: unknown, record: EnhancedEnhancementCategory) => {
          if (!record.skillType) return '';
          
          const getSkillTypeColor = (skillType: string): string => {
            switch (skillType) {
              case '祷告':
                return 'cyan';
              case '战灰':
                return 'green';
              case '武器':
                return 'red';
              case '魔法':
                return 'purple';
              case '技艺':
                return 'blue';
              case '道具':
                return 'orange';
              default:
                return 'default';
            }
          };
          
          return (
            <Tag color={getSkillTypeColor(record.skillType)}>
              {record.skillType}
            </Tag>
          );
        },
      },
      {
        title: '技能列表',
        dataIndex: 'skills',
        key: 'skills',
        width: '45%',
        render: (_: unknown, record: EnhancedEnhancementCategory) => {
          return record.skills ? record.skills.join('、') : '';
        },
      },
      {
        title: '备注',
        dataIndex: 'notes',
        key: 'notes',
        width: '25%',
        render: (notes: string[]) => {
          return notes && notes.length > 0 ? notes.join('; ') : '-';
        },
        onCell: (record: EnhancedEnhancementCategory, index?: number) => {
          const info = rowSpanInfo.get(record.category);
          if (info && index === info.firstIndex) {
            return { rowSpan: info.count };
          }
          return { rowSpan: 0 };
        },
      },
    ];
  };

  // 渲染表格内容
  const renderTableContent = (tabKey: string) => {
    if (tabKey === '强化类别') {
      return renderEnhancementTable();
    }

    let tableData: EntryData[] = [];
    let columns: TableColumnsType<EntryData>;
    
    switch (tabKey) {
      case '局外词条':
        tableData = data.outsiderEntries;
        columns = outsiderColumns;
        tableData = filterData(tableData, searchKeyword, selectedTypes, selectedCharacter);
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
        tableData = filterData(tableData, searchKeyword, selectedTypes, selectedCharacter);
    }

    // 计算总页数
    const totalPages = Math.ceil(tableData.length / pageSize);
    
    // 分页处理
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = tableData.slice(startIndex, endIndex);
    
    // 表格样式
    return (
      <div>
        <Table
          columns={columns}
          dataSource={paginatedData}
          rowKey="entry_id"
          onChange={handleTableChange}
          pagination={false}
          size="small"
          loading={data.loading}
        />
        
        {/* 自定义分页导航 */}
        {!data.loading && tableData.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            marginTop: '15px',
            gap: '10px'
          }}>
            {/* 上一页/下一页按钮 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px'
            }}>
              <Button 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
                size="middle"
              >
                上一页
              </Button>
              
              <span style={{ 
                margin: '0 15px',
                color: 'var(--theme-text-secondary)',
                fontSize: '14px'
              }}>
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              
              <Button 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                size="middle"
              >
                下一页
              </Button>
            </div>
            
            
          </div>
        )}
      </div>
    );
  };

  // 渲染强化类别表格
  const renderEnhancementTable = () => {
    const transformedData = transformEnhancementData(data.enhancementCategories);
    const filteredData = filterTransformedEnhancementData(transformedData, searchKeyword);
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredData.slice(startIndex, endIndex);



    return (
      <div>
        <Table<EnhancedEnhancementCategory>
          columns={createEnhancementColumns(paginatedData)}
          dataSource={paginatedData}
          rowKey={(record) => `${record.category}-${record.skillType}`}
          onChange={handleEnhancementTableChange}
          pagination={false}
          size="small"
          bordered
          loading={data.loading}
        />
        
        {/* 自定义分页导航 */}
        {!data.loading && filteredData.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            marginTop: '15px',
            gap: '10px'
          }}>
            {/* 上一页/下一页按钮 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px'
            }}>
              <Button 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
                size="middle"
              >
                上一页
              </Button>
              
              <span style={{ 
                margin: '0 15px',
                color: 'var(--theme-text-secondary)',
                fontSize: '14px'
              }}>
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              
              <Button 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                size="middle"
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </div>
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

    if (tabKey === '强化类别') {
      return (
        <div className="search-container">
          <div className="filter-search-content">
            {/* 左侧：搜索、清除 */}
            <div className="filter-controls">
              <Search 
                placeholder={`搜索 ${tabKey} 关键字`}
                onSearch={(value) => {
                  setSearchKeyword(value);
                  setCurrentPage(1);
                }}
                className="custom-search-input"
                allowClear
              />
              <Button onClick={clearAll} type="default" size="middle">
                清除所有
              </Button>
            </div>
            
            {/* 右侧：页面大小选择、总条数 */}
            <div className="pagination-controls">
              <span className="pagination-label">
                每页显示
              </span>
              <Select
                value={pageSize.toString()}
                onChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
                options={[
                  { value: '15', label: '15 条' },
                  { value: '20', label: '20 条' },
                  { value: '30', label: '30 条' },
                  { value: '50', label: '50 条' },
                  { value: '80', label: '80 条' },
                  { value: '100', label: '100 条' },
                ]}
                className="page-size-select"
                size="small"
              />
              <span className="total-count">
                共 {transformEnhancementData(data.enhancementCategories).length} 条记录
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (tabKey === '局外词条') {
      return (
        <div className="filter-search-row">
          <div className="filter-search-content">
            {/* 左侧：搜索、多选、单选、清除 */}
            <div className="filter-controls">
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
              <Select
                className="character-select"
                allowClear
                placeholder="按角色筛选"
                value={selectedCharacter || undefined}
                onChange={(value) => {
                  setSelectedCharacter(value);
                  setCurrentPage(1);
                }}
                options={characterOptions}
                notFoundContent="暂无角色"
                showSearch={false}
              />
              <Button onClick={clearAll} type="default" size="middle">
                清除所有
              </Button>
            </div>
            
            {/* 右侧：页面大小选择、总条数 */}
            <div className="pagination-controls">
              <span className="pagination-label">
                每页显示
              </span>
              <Select
                value={pageSize.toString()}
                onChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
                options={[
                 { value: '15', label: '15 条' },
                 { value: '20', label: '20 条' },
                 { value: '30', label: '30 条' },
                 { value: '50', label: '50 条' },
                 { value: '80', label: '80 条' },
                 { value: '100', label: '100 条' },
                ]}
                className="page-size-select"
                size="small"
              />
              <span className="total-count">
                共 {data.outsiderEntries.length} 条记录
              </span>
            </div>
          </div>
        </div>
      );
    } else if (tabKey === '其他词条') {
      return (
        <div className="filter-search-row">
          <div className="filter-search-content">
            {/* 左侧：搜索、多选、清除 */}
            <div className="filter-controls">
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
              <Button onClick={clearAll} type="default" size="middle">
                清除所有
              </Button>
            </div>
            
            {/* 右侧：页面大小选择、总条数 */}
            <div className="pagination-controls">
              <span className="pagination-label">
                每页显示
              </span>
              <Select
                value={pageSize.toString()}
                onChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
                options={[
                 { value: '15', label: '15 条' },
                 { value: '20', label: '20 条' },
                 { value: '30', label: '30 条' },
                 { value: '50', label: '50 条' },
                 { value: '80', label: '80 条' },
                 { value: '100', label: '100 条' },
                ]}
                className="page-size-select"
                size="small"
              />
              <span className="total-count">
                共 {data.otherEntries.length} 条记录
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="search-container">
          <div className="filter-search-content">
            {/* 左侧：搜索、清除 */}
            <div className="filter-controls">
              <Search 
                placeholder={`搜索 ${tabKey} 关键字`}
                onSearch={(value) => {
                  setSearchKeyword(value);
                  setCurrentPage(1);
                }}
                className="custom-search-input"
                allowClear
              />
              <Button onClick={clearAll} type="default" size="middle">
                清除所有
              </Button>
            </div>
            
            {/* 右侧：页面大小选择、总条数 */}
            <div className="pagination-controls">
              <span className="pagination-label">
                每页显示
              </span>
              <Select
                value={pageSize.toString()}
                onChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
                options={[
                  { value: '15', label: '15 条' },
                  { value: '20', label: '20 条' },
                  { value: '30', label: '30 条' },
                  { value: '50', label: '50 条' },
                  { value: '80', label: '80 条' },
                  { value: '100', label: '100 条' },
                ]}
                className="page-size-select"
                size="small"
              />
              <span className="total-count">
                共 {tabKey === '护符词条' ? data.talismanEntries.length : data.inGameEntries.length} 条记录
              </span>
            </div>
          </div>
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
            {
              key: '强化类别',
              label: '强化类别',
              children: (
                <div>
                  {renderSearchAndFilter('强化类别')}
                  {renderTableContent('强化类别')}
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