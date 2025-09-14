import React, { useState, useEffect, useMemo } from 'react';
import { Table, Input, Select, message, Tabs, Tag, Spin, Button } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import type { EntryData } from '../types';
import { typeColorMap } from '../types';
import DataManager from '../utils/dataManager';
import type { EnhancementCategory, ItemEffect } from '../utils/dataManager';
import { Line } from '@ant-design/plots';
import { getCurrentTheme } from '../utils/themeUtils';
import { throttle, debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';

// 自定义搜索组件接口
interface CustomSearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  allowClear?: boolean;
}

// 自定义搜索组件
const CustomSearch: React.FC<CustomSearchProps> = ({
  placeholder,
  value,
  onChange,
  onSearch,
  className = '',
  allowClear = true
}) => {
  const [inputValue, setInputValue] = useState(value);

  // 防抖处理搜索
  const debouncedSearch = useMemo(
    () => debounce((searchValue: string) => {
      onChange(searchValue);
      onSearch?.(searchValue);
    }, 300),
    [onChange, onSearch]
  );

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSearch(newValue);
  };

  // 处理回车搜索
  const handlePressEnter = () => {
    onChange(inputValue);
    onSearch?.(inputValue);
  };

  // 处理清除
  const handleClear = () => {
    setInputValue('');
    onChange('');
    onSearch?.('');
  };

  // 同步外部value变化
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={`custom-search-wrapper ${className}`}>
      <Input
        placeholder={placeholder}
        prefix={<SearchOutlined />}
        value={inputValue}
        onChange={handleInputChange}
        onPressEnter={handlePressEnter}
        allowClear={allowClear}
        onClear={handleClear}
        style={{ width: 200 }}
      />
    </div>
  );
};

// 自定义分页组件接口
interface CustomPaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}

// 自定义分页组件
const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  loading = false
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (loading || totalItems === 0) {
    return null;
  }

  return (
    <div className="custom-pagination-row" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '15px',
      padding: '0 16px'
    }}>
      {/* 左侧：每页显示选择器 */}
      <div className="page-size-controls" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          color: 'var(--theme-text-secondary)',
          fontSize: '14px'
        }}>
          每页显示
        </span>
        <Select
          value={pageSize.toString()}
          onChange={(value) => {
            onPageSizeChange(Number(value));
            onPageChange(1);
          }}
          options={[
            { value: '15', label: '15 条' },
            { value: '20', label: '20 条' },
            { value: '30', label: '30 条' },
            { value: '50', label: '50 条' },
            { value: '80', label: '80 条' },
            { value: '100', label: '100 条' },
          ]}
          size="small"
          style={{ width: '100px' }}
        />
        <span style={{
          color: 'var(--theme-text-secondary)',
          fontSize: '14px'
        }}>
          共 {totalItems} 条记录
        </span>
      </div>

      {/* 右侧：分页按钮 */}
      <div className="page-nav-controls" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          size="middle"
        >
          下一页
        </Button>
      </div>
    </div>
  );
};

// 扩展的强化类别接口，用于表格显示
interface EnhancedEnhancementCategory extends EnhancementCategory {
  skillType?: string;
  skills?: string[];
}

type OnChange = NonNullable<TableProps<EntryData>['onChange']>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

// 数据接口
interface DataState {
  outsiderEntries: EntryData[];
  talismanEntries: EntryData[];
  inGameEntries: EntryData[];
  enhancementCategories: EnhancementCategory[];
  inGameSpecialBuff: EntryData[];
  itemEffects: ItemEffect[];
  deepNightEntries: EntryData[];
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

// 深夜模式词条类型选项
const deepNightTypeOptions = [
  { value: '攻击力', label: '攻击力' },
  { value: '减伤率', label: '减伤率' },
  { value: '对异常状态的抵抗力', label: '对异常状态的抵抗力' },
  { value: '恢复', label: '恢复' },
  { value: '技艺/绝招', label: '技艺/绝招' },
  { value: '能力值', label: '能力值' },
  { value: '行动', label: '行动' },
  { value: '仅限特定角色', label: '仅限特定角色' },
  { value: '出击时的道具(结晶露滴)', label: '出击时的道具(结晶露滴)' },
  { value: '出击时的道具', label: '出击时的道具' },
  { value: '仅限特定武器', label: '仅限特定武器' },
  { value: '减益(减伤率)', label: '减益(减伤率)' },
  { value: '减益(能力值)', label: '减益(能力值)' },
  { value: '减益(行动)', label: '减益(行动)' },
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

// 道具效果分类选项
const itemEffectTypeOptions = [
  { text: '圣杯瓶', value: '圣杯瓶' },
  { text: '采集', value: '采集' },
  { text: '道具', value: '道具' },
  { text: '苔药', value: '苔药' },
  { text: '露滴', value: '露滴' },
  { text: '壶', value: '壶' },
  { text: '飞刀', value: '飞刀' },
  { text: '石', value: '石' },
  { text: '香', value: '香' },
  { text: '油脂', value: '油脂' },
];



// 添加局内词条类型选项
const inGameTypeOptions = [
  { value: '能力', label: '能力' },
  { value: '攻击力', label: '攻击力' },
  { value: '强化', label: '强化' },
  { value: '恢复', label: '恢复' },
  { value: '减伤率', label: '减伤率' },
  { value: '技艺/绝招', label: '技艺/绝招' },
  { value: '额外效果', label: '额外效果' },
  { value: '武器属性', label: '武器属性' },
  { value: '附加异常状态', label: '附加异常状态' },
  { value: '对异常状态的抵抗力', label: '对异常状态的抵抗力' },
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
    case '不同级别可叠加':
      return 'purple';
    case '同种不甘不可叠加':
      return 'magenta';
    default:
      return 'blue';
  }
};

interface EntryDetailViewProps {
  activeSubTab?: string;
}

const EntryDetailView: React.FC<EntryDetailViewProps> = ({ activeSubTab }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedInGameTypes, setSelectedInGameTypes] = useState<string[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [selectedItemEffectTypes, setSelectedItemEffectTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [activeEntryTab, setActiveEntryTab] = useState(activeSubTab || '局外词条');
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const [isLinearMode, setIsLinearMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getCurrentTheme());
  const [chartKey, setChartKey] = useState(0);
  const [data, setData] = useState<DataState>({
    outsiderEntries: [],
    talismanEntries: [],
    inGameEntries: [],
    enhancementCategories: [],
    inGameSpecialBuff: [],
    itemEffects: [],
    deepNightEntries: [],
    loading: true
  });

  // 羊头诅咒事件数据
  const curseData = [
    { rune: '0', damageIncrease: 0 },
    { rune: '1000', damageIncrease: 0.4 },
    { rune: '2000', damageIncrease: 0.8 },
    { rune: '5000', damageIncrease: 2 },
    { rune: '10000', damageIncrease: 4 },
    { rune: '20000', damageIncrease: 8 },
    { rune: '30000', damageIncrease: 12 },
    { rune: '50000', damageIncrease: 20 },
    { rune: '60000', damageIncrease: 22 },
    { rune: '80000', damageIncrease: 26 },
    { rune: '100000', damageIncrease: 30 },
    { rune: '150000', damageIncrease: 33.75 },
    { rune: '200000', damageIncrease: 37.5 },
    { rune: '300000', damageIncrease: 45 },
    { rune: '500000', damageIncrease: 60 },
    { rune: '700000', damageIncrease: 75 },
    { rune: '900000', damageIncrease: 90 },
    { rune: '1000000', damageIncrease: 91.2 },
    { rune: '1100000', damageIncrease: 92.42 },
    { rune: '1500000', damageIncrease: 97.26 },
  ];

  // 折线图配置
  const lineConfig = {
    data: isLinearMode ? curseData.map(item => ({ ...item, rune: parseInt(item.rune) })) : curseData,
    xField: 'rune',
    yField: 'damageIncrease',
    theme: currentTheme,
    height: 400,
    autoFit: true,
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    axis: {
      x: {
        label: {
          autoRotate: true,
          autoHide: true,
          autoEllipsis: true,
          style: {
            fill: currentTheme === 'dark' ? '#ffffff' : '#000000',
            fontSize: 12,
          },
          formatter: isLinearMode ? (value: string) => {
            const num = parseInt(value);
            if (num >= 1000000) {
              return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
              return (num / 1000).toFixed(0) + 'K';
            }
            return value;
          } : undefined,
        },
        line: {
          style: {
            stroke: currentTheme === 'dark' ? '#ffffff' : '#000000',
            lineWidth: 1,
          },
        },
        tickLine: {
          style: {
            stroke: currentTheme === 'dark' ? '#ffffff' : '#000000',
            lineWidth: 1,
          },
        },
      },
      y: {
        label: {
          style: {
            fill: currentTheme === 'dark' ? '#ffffff' : '#000000',
            fontSize: 12,
          },
          formatter: (value: string) => `${value}%`,
        },
        line: {
          style: {
            stroke: currentTheme === 'dark' ? '#ffffff' : '#000000',
            lineWidth: 1,
          },
        },
        tickLine: {
          style: {
            stroke: currentTheme === 'dark' ? '#ffffff' : '#000000',
            lineWidth: 1,
          },
        },
      },
    },
    tooltip: {
      title: (datum: { rune: string | number; damageIncrease: number }) => {
        const runeValue = typeof datum.rune === 'number' ? datum.rune.toString() : datum.rune;
        return `卢恩:${runeValue} | 增伤:${datum.damageIncrease.toFixed(2)}%`;
      },
    },
    smooth: true,
    color: '#5B8FF9',
    lineStyle: {
      lineWidth: 3,
    },
  };

  // 监听主题变化
  useEffect(() => {
    const checkTheme = () => {
      const newTheme = getCurrentTheme();
      if (newTheme !== currentTheme) {
        setCurrentTheme(newTheme);
        setChartKey(prev => prev + 1);
      }
    };

    // 初始检查
    checkTheme();

    // 监听 localStorage 变化
    const handleStorageChange = () => {
      // 延迟一点时间确保 localStorage 已更新
      setTimeout(checkTheme, 50);
    };

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      checkTheme();
    };

    // 监听自定义主题变化事件
    const handleThemeChange = () => {
      setTimeout(checkTheme, 50);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChange', handleThemeChange);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [currentTheme]);

  // 处理窗口大小变化和拖拽导致的图表刷新问题
  useEffect(() => {
    // 节流后的图表刷新函数
    const throttledChartRefresh = throttle(() => {
      // 强制重新渲染图表
      setChartKey(prev => prev + 1);
    }, 300); // 300ms节流延迟

    // 监听窗口大小变化
    const handleResize = () => {
      throttledChartRefresh();
    };

    // 监听拖拽相关事件
    const handleDragEnd = () => {
      setTimeout(throttledChartRefresh, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('dragend', handleDragEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('dragend', handleDragEnd);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 监听标签页切换，确保图表正确渲染
  useEffect(() => {
    if (activeEntryTab === '特殊事件及地形效果') {
      const timer = setTimeout(() => {
        setChartKey(prev => prev + 1);
        window.dispatchEvent(new Event('resize'));
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [activeEntryTab]);

  // 监听外部Tab切换
  useEffect(() => {
    if (activeSubTab && activeSubTab !== activeEntryTab) {
      setActiveEntryTab(activeSubTab);
    }
  }, [activeSubTab, activeEntryTab]);

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
          enhancementCategories: dataManager.getEnhancementCategories(),
          inGameSpecialBuff: dataManager.getInGameSpecialBuff(),
          itemEffects: dataManager.getItemEffects(),
          deepNightEntries: dataManager.getDeepNightEntries(),
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

  // 监听筛选状态变化，用于调试
  useEffect(() => {
    console.log('FilteredInfo changed:', filteredInfo);
  }, [filteredInfo]);

  // 清除所有筛选和排序
  const clearAll = () => {
    setSearchKeyword('');
    setSelectedTypes([]);
    setSelectedInGameTypes([]);
    setSelectedCharacter('');
    setSelectedItemEffectTypes([]);
    setFilteredInfo({});
    setSortedInfo({});
    setCurrentPage(1);
    setPageSize(20);
    message.success('已清除所有筛选和排序');
  };

  // 表格变化处理函数
  const handleTableChange: OnChange = (_pagination, filters, sorter) => {
    console.log('Table change - filters:', filters, 'sorter:', sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  // 强化类别表格变化处理函数
  const handleEnhancementTableChange: TableProps<EnhancementCategory>['onChange'] = (_pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  // 道具效果表格变化处理函数
  const handleItemEffectTableChange: TableProps<ItemEffect>['onChange'] = (_pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };

  // 搜索过滤函数
  const filterData = (data: EntryData[], searchValue: string, types?: string[], character?: string, inGameTypes?: string[], superposabilityFilters?: string[]) => {
    let filtered = data;

    // 类型筛选
    if (types && types.length > 0) {
      filtered = filtered.filter(item => types.includes(item.entry_type || ''));
    }

    // 局内词条类型筛选
    if (inGameTypes && inGameTypes.length > 0) {
      filtered = filtered.filter(item => inGameTypes.includes(item.entry_type || ''));
    }

    // 角色筛选
    if (character && character.trim()) {
      filtered = filtered.filter(item =>
        item.entry_name?.includes(character) ||
        item.explanation?.includes(character)
      );
    }

    // 叠加性筛选
    if (superposabilityFilters && superposabilityFilters.length > 0) {
      console.log('Applying superposability filter:', superposabilityFilters);
      const beforeCount = filtered.length;
      filtered = filtered.filter(item => {
        const itemSuperposability = item.superposability || '';
        const isIncluded = superposabilityFilters.includes(itemSuperposability);
        if (!isIncluded) {
          console.log(`Filtered out item "${item.entry_name}" with superposability "${itemSuperposability}"`);
        }
        return isIncluded;
      });
      console.log(`Superposability filter: ${beforeCount} -> ${filtered.length} items`);
    }

    // 关键词搜索
    if (!searchValue.trim()) return filtered;

    const searchTerms = searchValue.toLowerCase().split(/\s+/).filter(term => term.length > 0);

    return filtered.filter(item => {
      // 搜索字段
      const searchableFields = [
        item.entry_name || '',
        item.explanation || '',
        item.entry_type || '',
        item.superposability || '',
        item.talisman || '',
        item.entry_id || ''
      ].map(field => field.toLowerCase());

      // 检查所有搜索词是否都在至少一个字段中出现
      return searchTerms.every(term =>
        searchableFields.some(field => field.includes(term))
      );
    });
  };

  // 道具效果搜索过滤函数
  const filterItemEffectData = (data: ItemEffect[], searchValue: string, types?: string[]) => {
    let filtered = data;

    // 分类筛选
    if (types && types.length > 0) {
      filtered = filtered.filter(item => types.includes(item.type));
    }

    // 关键词搜索
    if (!searchValue.trim()) return filtered;

    const searchTerms = searchValue.toLowerCase().split(/\s+/).filter(term => term.length > 0);

    return filtered.filter(item => {
      const searchableFields = [
        item.name || '',
        item.effect || '',
        item.type || '',
        item.singleGridQty?.toString() || ''
      ].map(field => field.toLowerCase());

      return searchTerms.every(term =>
        searchableFields.some(field => field.includes(term))
      );
    });
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
      width: '8%',
      align: 'center',
      onCell: () => ({
        style: { fontSize: '11px', color: 'var(--theme-text-secondary)' }
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
      width: '12%',
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
    },
  ];

  // 护符词条表格列定义
  const talismanColumns: TableColumnsType<EntryData> = [
    {
      title: 'ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: '8%',
      align: 'center',
      onCell: () => ({
        style: { fontSize: '11px', color: 'var(--theme-text-secondary)' }
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
      width: '8%',
      align: 'center',
      onCell: () => ({
        style: { fontSize: '11px', color: 'var(--theme-text-secondary)' }
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
      width: '45%',
      render: (text) => {
        if (!text) return '-';

        return (
          <div style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: '1.6',
            fontSize: '13px'
          }}>
            {text}
          </div>
        );
      },
      onCell: () => ({
        style: {
          padding: '12px 8px'
        }
      }),
    },
    {
      title: '词条类型',
      dataIndex: 'entry_type',
      key: 'entry_type',
      align: 'center',
      width: '12%',
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
        { text: '不同级别可叠加', value: '不同级别可叠加' },
        { text: '同种不甘不可叠加', value: '同种不甘不可叠加' },
      ],
      filteredValue: filteredInfo.superposability || null,
    },
  ];

  // 深夜模式词条表格列定义（复用局外词条的列定义）
  const deepNightColumns: TableColumnsType<EntryData> = [
    {
      title: 'ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: '8%',
      align: 'center',
      onCell: () => ({
        style: { fontSize: '11px', color: 'var(--theme-text-secondary)' }
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
      width: '35%',
      render: (text) => text || '-',
    },
    {
      title: '词条类型',
      dataIndex: 'entry_type',
      key: 'entry_type',
      align: 'center',
      width: '12%',
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
    },
  ];

  // 特殊事件及地形效果表格列定义
  const specialBuffColumns: TableColumnsType<EntryData> = [
    {
      title: 'ID',
      dataIndex: 'entry_id',
      key: 'entry_id',
      width: '8%',
      align: 'center',
      onCell: () => ({
        style: { fontSize: '11px', color: 'var(--theme-text-secondary)' }
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
      title: '类型',
      dataIndex: 'entry_type',
      key: 'entry_type',
      align: 'center',
      width: '15%',
      render: (text) => text ? (
        <Tag color={getTypeColor(text)}>{text}</Tag>
      ) : '-',
      sorter: (a, b) => {
        const typeA = a.entry_type || '';
        const typeB = b.entry_type || '';
        return typeA.localeCompare(typeB, 'zh-CN');
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'entry_type' ? sortedInfo.order : null,
    },
    {
      title: '效果名称',
      dataIndex: 'entry_name',
      key: 'entry_name',
      width: '20%',
    },
    {
      title: '效果描述',
      dataIndex: 'explanation',
      key: 'explanation',
      width: '55%',
      render: (text) => text || '-',
    },
  ];

  // 道具效果表格列定义
  const itemEffectColumns: TableColumnsType<ItemEffect> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      align: 'center',
      sorter: (a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB, 'zh-CN');
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
    },
    {
      title: '分类',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      align: 'center',
      render: (text) => text ? (
        <Tag color={getTypeColor(text)}>{text}</Tag>
      ) : '-',
      sorter: (a, b) => {
        const typeA = a.type || '';
        const typeB = b.type || '';
        return typeA.localeCompare(typeB, 'zh-CN');
      },
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortedInfo.columnKey === 'type' ? sortedInfo.order : null,
    },
    {
      title: '单格数量',
      dataIndex: 'singleGridQty',
      key: 'singleGridQty',
      width: '8%',
      align: 'center',
      render: (text) => text || '-',
    },
    {
      title: '效果',
      dataIndex: 'effect',
      key: 'effect',
      width: '70%',
      render: (text) => text || '-',
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
              case '绝招':
                return 'magenta';
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
    if (tabKey === '强化类别词条适用范围') {
      return renderEnhancementTable();
    }

    if (tabKey === '道具效果') {
      return renderItemEffectTable();
    }

    let tableData: EntryData[] = [];
    let columns: TableColumnsType<EntryData>;

    switch (tabKey) {
      case '局外词条':
        tableData = data.outsiderEntries;
        columns = outsiderColumns;
        tableData = filterData(tableData, searchKeyword, selectedTypes, selectedCharacter, undefined, filteredInfo.superposability as string[]);
        break;
      case '深夜模式词条':
        tableData = data.deepNightEntries;
        columns = deepNightColumns;
        tableData = filterData(tableData, searchKeyword, selectedTypes, selectedCharacter, undefined, filteredInfo.superposability as string[]);
        break;
      case '护符词条':
        tableData = data.talismanEntries;
        columns = talismanColumns;
        tableData = filterData(tableData, searchKeyword);
        break;
      case '局内词条':
        tableData = data.inGameEntries;
        columns = inGameColumns;
        tableData = filterData(tableData, searchKeyword, selectedInGameTypes, undefined, undefined, filteredInfo.superposability as string[]);
        break;
      case '特殊事件及地形效果':
        tableData = data.inGameSpecialBuff;
        columns = specialBuffColumns;
        tableData = filterData(tableData, searchKeyword);
        break;
      default:
        tableData = data.outsiderEntries;
        columns = outsiderColumns;
        tableData = filterData(tableData, searchKeyword, selectedTypes, selectedCharacter, undefined, filteredInfo.superposability as string[]);
    }

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
          bordered
          loading={data.loading}
        />

        {/* 自定义分页导航 */}
        {!data.loading && tableData.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={tableData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            loading={data.loading}
          />
        )}

        {/* 特殊事件及地形效果 tab 的折线图 */}
        {tabKey === '特殊事件及地形效果' && !data.loading && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: 'var(--theme-bg-primary)',
            borderRadius: '8px',
            border: '1px solid var(--theme-border)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h3 style={{
                color: 'var(--theme-text-primary)',
                fontSize: '16px',
                fontWeight: 'bold',
                margin: 0
              }}>
                🪬 恶魔的添翼:卢恩-增伤关系图
              </h3>
              <Button.Group size="small">
                <Button
                  type={isLinearMode ? 'default' : 'primary'}
                  onClick={() => setIsLinearMode(false)}
                >
                  非线性模式
                </Button>
                <Button
                  type={isLinearMode ? 'primary' : 'default'}
                  onClick={() => setIsLinearMode(true)}
                >
                  线性模式
                </Button>
              </Button.Group>
            </div>
            <div
              id="line-chart-container"
              style={{ height: '400px' }}
            >
              <Line key={`line-chart-${chartKey}-${activeEntryTab}`} {...lineConfig} />
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染强化类别表格
  const renderEnhancementTable = () => {
    const transformedData = transformEnhancementData(data.enhancementCategories);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = transformedData.slice(startIndex, endIndex);

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
        {!data.loading && transformedData.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={transformedData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            loading={data.loading}
          />
        )}
      </div>
    );
  };

  // 渲染道具效果表格
  const renderItemEffectTable = () => {
    let tableData = data.itemEffects;

    // 为道具效果添加搜索过滤
    if (searchKeyword.trim()) {
      tableData = filterItemEffectData(tableData, searchKeyword, selectedItemEffectTypes);
    }

    // 为道具效果添加分类筛选
    if (selectedItemEffectTypes.length > 0) {
      tableData = filterItemEffectData(tableData, '', selectedItemEffectTypes); // 使用空字符串作为搜索关键词，只进行分类筛选
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = tableData.slice(startIndex, endIndex);

    // 道具效果表格 footer
    const itemEffectFooter = () => (
      <div className="footer-text">
        表内所有攻击力、异常值全部为固定值，不随等级成长，不吃任何补正。
      </div>
    );

    return (
      <div>
        <Table<ItemEffect>
          columns={itemEffectColumns}
          dataSource={paginatedData}
          rowKey="name"
          onChange={handleItemEffectTableChange}
          pagination={false}
          size="small"
          bordered
          loading={data.loading}
          footer={itemEffectFooter}
        />

        {/* 自定义分页导航 */}
        {!data.loading && tableData.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={tableData.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            loading={data.loading}
          />
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

    if (tabKey === '强化类别词条适用范围' || tabKey === '特殊事件及地形效果') {
      return null;
    }

    if (tabKey === '道具效果') {
      return (
        <div className="filter-search-row">
          <div className="filter-search-content">
            {/* 左侧：搜索、多选、清除 */}
            <div className="filter-controls">
              <CustomSearch
                placeholder={`搜索 ${tabKey} 关键字`}
                value={searchKeyword}
                onChange={setSearchKeyword}
                onSearch={(value) => {
                  setSearchKeyword(value);
                  setCurrentPage(1);
                }}
                className="custom-search-input"
                allowClear
              />
              <Select
                className="item-effect-type-select"
                mode="multiple"
                allowClear
                tagRender={tagRender}
                placeholder="按分类筛选"
                value={selectedItemEffectTypes}
                onChange={(values) => {
                  setSelectedItemEffectTypes(values);
                  setCurrentPage(1);
                }}
                options={itemEffectTypeOptions}
                maxTagPlaceholder={omittedValues => `+${omittedValues.length}...`}
                style={{ minWidth: '180px', maxWidth: '300px' }}
              />
              <Button onClick={clearAll} type="default" size="middle">
                清除所有
              </Button>
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
              <CustomSearch
                placeholder={`搜索 ${tabKey} 关键字`}
                value={searchKeyword}
                onChange={setSearchKeyword}
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
                value={selectedTypes}
                onChange={(values) => {
                  setSelectedTypes(values);
                  setCurrentPage(1);
                }}
                options={outsiderTypeOptions}
                maxTagPlaceholder={omittedValues => `+${omittedValues.length}...`}
                style={{ minWidth: '180px', maxWidth: '300px' }}
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


          </div>
        </div>
      );
    } else if (tabKey === '深夜模式词条') {
      return (
        <div className="filter-search-row">
          <div className="filter-search-content">
            {/* 左侧：搜索、多选、单选、清除 */}
            <div className="filter-controls">
              <CustomSearch
                placeholder={`搜索 ${tabKey} 关键字`}
                value={searchKeyword}
                onChange={setSearchKeyword}
                onSearch={(value) => {
                  setSearchKeyword(value);
                  setCurrentPage(1);
                }}
                className="custom-search-input"
                allowClear
              />
              <Select
                className="deep-night-type-select"
                mode="multiple"
                allowClear
                tagRender={tagRender}
                placeholder="按词条类型筛选"
                value={selectedTypes}
                onChange={(values) => {
                  setSelectedTypes(values);
                  setCurrentPage(1);
                }}
                options={deepNightTypeOptions}
                maxTagPlaceholder={omittedValues => `+${omittedValues.length}...`}
                style={{ minWidth: '180px', maxWidth: '300px' }}
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
          </div>
        </div>
      );
    } else {
      return (
        <div className="search-container">
          <div className="filter-search-content">
            {/* 左侧：搜索、清除 */}
            <div className="filter-controls">
              <CustomSearch
                placeholder={`搜索 ${tabKey} 关键字`}
                value={searchKeyword}
                onChange={setSearchKeyword}
                onSearch={(value) => {
                  setSearchKeyword(value);
                  setCurrentPage(1);
                }}
                className="custom-search-input"
                allowClear
              />
              {tabKey === '局内词条' && (
                <Select
                  className="in-game-type-select"
                  mode="multiple"
                  allowClear
                  tagRender={tagRender}
                  placeholder="按词条类型筛选"
                  value={selectedInGameTypes}
                  onChange={(values) => {
                    setSelectedInGameTypes(values);
                    setCurrentPage(1);
                  }}
                  options={inGameTypeOptions}
                  maxTagPlaceholder={omittedValues => `+${omittedValues.length}...`}
                  style={{ minWidth: '180px', maxWidth: '300px' }}
                />
              )}
              <Button onClick={clearAll} type="default" size="middle">
                清除所有
              </Button>
            </div>


          </div>
        </div>
      );
    }
  };

  return (
    <div className="content-wrapper">
      <Tabs
        type="card"
        style={{
          marginTop: '20px',
        }}
        activeKey={activeEntryTab}
        onChange={(key) => {
          setActiveEntryTab(key);
          setCurrentPage(1);
          // 清空搜索相关状态
          setSearchKeyword('');
          setSelectedTypes([]);
          setSelectedInGameTypes([]);
          setSelectedCharacter('');
          setSelectedItemEffectTypes([]);
          setFilteredInfo({});
          setSortedInfo({});
        }}
        items={[
          {
            key: '局外词条',
            label: '🌕 局外词条',
            children: (
              <div id="outsider-entries">
                {renderSearchAndFilter('局外词条')}
                {renderTableContent('局外词条')}
              </div>
            ),
          },
          {
            key: '局内词条',
            label: '🌖 局内词条',
            children: (
              <div id="in-game-entries">
                {renderSearchAndFilter('局内词条')}
                {renderTableContent('局内词条')}
              </div>
            ),
          },
          {
            key: '护符词条',
            label: '🌗 护符词条',
            children: (
              <div id="talisman-entries">
                {renderSearchAndFilter('护符词条')}
                {renderTableContent('护符词条')}
              </div>
            ),
          },
          {
            key: '强化类别词条适用范围',
            label: '🌘 强化类别词条适用范围',
            children: (
              <div id="enhancement-categories">
                {renderSearchAndFilter('强化类别词条适用范围')}
                {renderTableContent('强化类别词条适用范围')}
              </div>
            ),
          },
          {
            key: '特殊事件及地形效果',
            label: '🌑 特殊事件及地形效果',
            children: (
              <div id="special-events">
                {renderSearchAndFilter('特殊事件及地形效果')}
                {renderTableContent('特殊事件及地形效果')}
              </div>
            ),
          },
          {
            key: '道具效果',
            label: '🌒 道具/采集效果',
            children: (
              <div id="item-effects">
                {renderSearchAndFilter('道具效果')}
                {renderTableContent('道具效果')}
              </div>
            ),
          },
          {
            key: '深夜模式词条',
            label: '🌌 深夜模式-局外词条',
            children: (
              <div id="deep-night-entries">
                {renderSearchAndFilter('深夜模式词条')}
                {renderTableContent('深夜模式词条')}
              </div>
            ),
          },
        ]}
        className="custom-tabs"
      />
    </div>
  );
};

export default EntryDetailView; 