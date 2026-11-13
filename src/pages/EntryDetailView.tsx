import React, { useState, useEffect, useMemo } from 'react';
import { Table, Input, Select, message, Tabs, Tag, Spin, Button, Checkbox, Space } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import type { EntryData } from '../types';
import { typeColorMap } from '../types';
import DataManager from '../utils/dataManager';
import type { EnhancementCategory, ItemEffect } from '../utils/dataManager';
import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import CustomPagination from '../components/CustomPagination';

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
  inGamePotentialEntries: EntryData[];
  enhancementCategories: EnhancementCategory[];
  itemEffects: ItemEffect[];
  deepNightEntries: EntryData[];
  inGameDeepNightEntries: EntryData[];
  loading: boolean;
}

const outsiderTypeOptions = [
  { value: '能力值', label: '能力值' },
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
  { value: '出击时的武器（魔法）', label: '出击时的武器（魔法）' },
  { value: '出击时的武器（祷告）', label: '出击时的武器（祷告）' },
  { value: '出击时的武器（附加）', label: '出击时的武器（附加）' },
  { value: '出击时的道具', label: '出击时的道具' },
  { value: '场地环境', label: '场地环境' },
  { value: '专属遗物', label: '专属遗物' },
  { value: '武器固有', label: '武器固有' }
];

// 深夜模式局外词条类型选项
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
  { value: '学者', label: '学者' },
  { value: '送葬者', label: '送葬者' }
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
  { value: '能力值', label: '能力值' },
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

// 「潜在能力」是局内武器固有的一类词条（43 条），单独放在
// src/data/zh-CN/in-game_potential_entries_zh-CN.json，页签「局内-潜在能力」

// 局内-潜在能力词条类型选项（这 43 条里实际出现的类型）
const potentialAbilityTypeOptions = [
  { value: '能力值', label: '能力值' },
  { value: '攻击力', label: '攻击力' },
  { value: '强化', label: '强化' },
  { value: '恢复', label: '恢复' },
  { value: '减伤率', label: '减伤率' },
  { value: '技艺/绝招', label: '技艺/绝招' },
  { value: '额外效果', label: '额外效果' },
  { value: '附加异常状态', label: '附加异常状态' },
  { value: '对异常状态的抵抗力', label: '对异常状态的抵抗力' },
];

// 未实装标签：数据里 tags 含此值即视为「未实装」词条
const NOT_IMPLEMENTED_TAG = '未实装';
// 未实装标签配色（antd 预设色；放在「词条类型」列，需与普通类型标签明显区分）
const NOT_IMPLEMENTED_COLOR = 'orange';

// 深夜模式局内词条类型选项
const inGameDeepNightTypeOptions = [
  { value: '能力值', label: '能力值' },
  { value: '攻击力', label: '攻击力' },
  { value: '减伤率', label: '减伤率' },
  { value: '恢复', label: '恢复' },
  { value: '减益(能力值)', label: '减益(能力值)' },
  { value: '减益(减伤率)', label: '减益(减伤率)' },
  { value: '减益(恢复)', label: '减益(恢复)' },
  { value: '减益(行动)', label: '减益(行动)' },
  { value: '特殊效果', label: '特殊效果' },
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
  // 是否展示未实装词条（默认不展示）
  const [showNotImplemented, setShowNotImplemented] = useState(false);
  const [data, setData] = useState<DataState>({
    outsiderEntries: [],
    talismanEntries: [],
    inGameEntries: [],
    inGamePotentialEntries: [],
    enhancementCategories: [],
    itemEffects: [],
    deepNightEntries: [],
    inGameDeepNightEntries: [],
    loading: true
  });



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
          inGamePotentialEntries: dataManager.getInGamePotentialEntries(),
          enhancementCategories: dataManager.getEnhancementCategories(),
          itemEffects: dataManager.getItemEffects(),
          deepNightEntries: dataManager.getDeepNightEntries(),
          inGameDeepNightEntries: dataManager.getInGameDeepNightEntries(),
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
    // console.log('FilteredInfo changed:', filteredInfo);
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
    // console.log('Table change - filters:', filters, 'sorter:', sorter);
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

    // 类型筛选（「未实装」是标签而不是 entry_type，需要单独匹配）
    const matchesType = (item: EntryData, list: string[]) =>
      list.includes(item.entry_type || '') ||
      (list.includes(NOT_IMPLEMENTED_TAG) && (item.tags || []).includes(NOT_IMPLEMENTED_TAG));

    if (types && types.length > 0) {
      filtered = filtered.filter(item => matchesType(item, types));
    }

    // 局内词条类型筛选
    if (inGameTypes && inGameTypes.length > 0) {
      filtered = filtered.filter(item => matchesType(item, inGameTypes));
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
      // console.log('Applying superposability filter:', superposabilityFilters);
      // const beforeCount = filtered.length;
      filtered = filtered.filter(item => {
        const itemSuperposability = item.superposability || '';
        const isIncluded = superposabilityFilters.includes(itemSuperposability);
        if (!isIncluded) {
          // console.log(`Filtered out item "${item.entry_name}" with superposability "${itemSuperposability}"`);
        }
        return isIncluded;
      });
      // console.log(`Superposability filter: ${beforeCount} -> ${filtered.length} items`);
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
      ].map(field => String(field).toLowerCase());

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
      ].map(field => String(field).toLowerCase());

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

  // 词条名称 + 标签：「未实装」归到「词条类型」列，这里只渲染「XX专属遗物」等标签
  const renderEntryName = (name: string | null | undefined, record: EntryData) => {
    const tags = (record.tags || []).filter(tag => tag !== NOT_IMPLEMENTED_TAG);
    // 少数词条名里带 \n（如 7030500「【追踪者】发动绝招后，\n能提升…」），要 pre-wrap 才会换行
    const label = <span style={{ whiteSpace: 'pre-wrap' }}>{name || '-'}</span>;
    if (tags.length === 0) return label;
    return (
      <Space size={4} wrap>
        {label}
        {tags.map(tag => (
          <Tag
            key={tag}
            color="gold"
            style={{ marginInlineEnd: 0, fontSize: '11px', lineHeight: '18px' }}
          >
            {tag}
          </Tag>
        ))}
      </Space>
    );
  };

  // 词条类型列：未实装词条只显示「未实装」标签，不再显示词条类型
  const renderEntryType = (type: string | null | undefined, record: EntryData) => {
    if ((record.tags || []).includes(NOT_IMPLEMENTED_TAG)) {
      return <Tag color={NOT_IMPLEMENTED_COLOR}>{NOT_IMPLEMENTED_TAG}</Tag>;
    }
    return type ? <Tag color={getTypeColor(type)}>{type}</Tag> : '-';
  };

  // 「未实装」条目默认隐藏，勾选「显示未实装」后才在类型筛选里提供该选项
  const withNotImplemented = (opts: { value: string; label: string }[]) =>
    showNotImplemented
      ? [...opts, { value: NOT_IMPLEMENTED_TAG, label: NOT_IMPLEMENTED_TAG }]
      : opts;

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
      render: (text: string, record: EntryData) => renderEntryName(text, record),
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: '40%',
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
      render: (text: string, record: EntryData) => renderEntryType(text, record),
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
      render: (text: string, record: EntryData) => renderEntryName(text, record),
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
      render: (text: string, record: EntryData) => renderEntryName(text, record),
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
      render: (text: string, record: EntryData) => renderEntryType(text, record),
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

  // 深夜模式局外词条表格列定义（复用局外词条的列定义）
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
      render: (text: string, record: EntryData) => renderEntryName(text, record),
    },
    {
      title: '解释',
      dataIndex: 'explanation',
      key: 'explanation',
      width: '35%',
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
      render: (text: string, record: EntryData) => renderEntryType(text, record),
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
        // 默认隐藏未实装词条，勾选「显示未实装」后才展示
        if (!showNotImplemented) {
          tableData = tableData.filter(item => !(item.tags || []).includes(NOT_IMPLEMENTED_TAG));
        }
        break;
      case '深夜模式局外词条':
        tableData = data.deepNightEntries;
        columns = deepNightColumns;
        tableData = filterData(tableData, searchKeyword, selectedTypes, selectedCharacter, undefined, filteredInfo.superposability as string[]);
        // 默认隐藏未实装词条，勾选「显示未实装」后才展示
        if (!showNotImplemented) {
          tableData = tableData.filter(item => !(item.tags || []).includes(NOT_IMPLEMENTED_TAG));
        }
        break;
      case '深夜模式局内词条':
        tableData = data.inGameDeepNightEntries;
        columns = inGameColumns; // 复用局内词条的列定义
        tableData = filterData(tableData, searchKeyword, selectedInGameTypes, undefined, undefined, filteredInfo.superposability as string[]);
        // 默认隐藏未实装词条，勾选「显示未实装」后才展示
        if (!showNotImplemented) {
          tableData = tableData.filter(item => !(item.tags || []).includes(NOT_IMPLEMENTED_TAG));
        }
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
        // 默认隐藏未实装词条，勾选「显示未实装」后才展示
        if (!showNotImplemented) {
          tableData = tableData.filter(item => !(item.tags || []).includes(NOT_IMPLEMENTED_TAG));
        }
        break;
      case '潜在能力':
        // 这 43 条都是已实装词条，没有「显示未实装」开关，也不需要隐藏逻辑
        tableData = data.inGamePotentialEntries;
        columns = inGameColumns;
        tableData = filterData(tableData, searchKeyword, selectedInGameTypes, undefined, undefined, filteredInfo.superposability as string[]);
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
    // 「局内词条」和「潜在能力」共用同一套筛选控件，只有类型选项不同
    const isInGameEntriesTab = tabKey === '局内词条' || tabKey === '潜在能力';

    if (data.loading) {
      return (
        <div className="loading-container">
          <Spin spinning={true} />
        </div>
      );
    }

    if (tabKey === '强化类别词条适用范围') {
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
                options={withNotImplemented(outsiderTypeOptions)}
                maxTagPlaceholder={omittedValues => `+${omittedValues.length}...`}
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
              <Checkbox
                checked={showNotImplemented}
                onChange={(e) => {
                  setShowNotImplemented(e.target.checked);
                  setCurrentPage(1);
                }}
              >
                显示未实装
              </Checkbox>
              <Button onClick={clearAll} type="default" size="middle">
                清除所有
              </Button>
            </div>


          </div>
        </div>
      );
    } else if (tabKey === '深夜模式局外词条') {
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
                options={withNotImplemented(deepNightTypeOptions)}
                maxTagPlaceholder={omittedValues => `+${omittedValues.length}...`}
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
              <Checkbox
                checked={showNotImplemented}
                onChange={(e) => {
                  setShowNotImplemented(e.target.checked);
                  setCurrentPage(1);
                }}
              >
                显示未实装
              </Checkbox>
              <Button onClick={clearAll} type="default" size="middle">
                清除所有
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (tabKey === '深夜模式局内词条') {
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
                className="deep-night-in-game-type-select"
                mode="multiple"
                allowClear
                tagRender={tagRender}
                placeholder="按词条类型筛选"
                value={selectedInGameTypes}
                onChange={(values) => {
                  setSelectedInGameTypes(values);
                  setCurrentPage(1);
                }}
                options={withNotImplemented(inGameDeepNightTypeOptions)}
                maxTagPlaceholder={omittedValues => `+${omittedValues.length}...`}
              />
              <Checkbox
                checked={showNotImplemented}
                onChange={(e) => {
                  setShowNotImplemented(e.target.checked);
                  setCurrentPage(1);
                }}
              >
                显示未实装
              </Checkbox>
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
              {isInGameEntriesTab && (
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
                  options={tabKey === '潜在能力' ? potentialAbilityTypeOptions : withNotImplemented(inGameTypeOptions)}
                  maxTagPlaceholder={omittedValues => `+${omittedValues.length}...`}
                />
              )}
              {/* 「潜在能力」这 43 条都是已实装词条，不提供「显示未实装」开关 */}
              {tabKey === '局内词条' && (
                <Checkbox
                  checked={showNotImplemented}
                  onChange={(e) => {
                    setShowNotImplemented(e.target.checked);
                    setCurrentPage(1);
                  }}
                >
                  显示未实装
                </Checkbox>
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
            key: '潜在能力',
            label: '🌖 局内-潜在能力',
            children: (
              <div id="in-game-potential-entries">
                {renderSearchAndFilter('潜在能力')}
                {renderTableContent('潜在能力')}
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
            key: '深夜模式局外词条',
            label: '🌌 深夜模式-局外词条',
            children: (
              <div id="deep-night-entries">
                {renderSearchAndFilter('深夜模式局外词条')}
                {renderTableContent('深夜模式局外词条')}
              </div>
            ),
          },
          {
            key: '深夜模式局内词条',
            label: '🌌 深夜模式-局内词条',
            children: (
              <div id="deep-night-in-game-entries">
                {renderSearchAndFilter('深夜模式局内词条')}
                {renderTableContent('深夜模式局内词条')}
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