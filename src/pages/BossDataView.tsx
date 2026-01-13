import React, { useState, useEffect } from 'react';
import { Table, Card, Image, Tabs, Select, Input, Button, Tag, Radio, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { BossData, WildBossData, CharacterData, EntryData } from '../types';
import { typeColorMap } from '../types';
import bossData from '../data/zh-CN/night_king_data.json';
import sinnerList from '../data/zh-CN/sinner_list.json';
import wildBossData from '../data/zh-CN/wild_boss_data.json';
import characterData from '../data/character-info/character_data.json';
import DataManager from '../utils/dataManager';
import { Line } from '@ant-design/plots';
import { getCurrentTheme } from '../utils/themeUtils';
import { throttle } from 'lodash';
import '../styles/bossDataView.css';

// 导入boss图片
import nightOfTheBeast from '../assets/BossRelics/night-of-the-beast.avif';
import darkNightOfTheBaron from '../assets/BossRelics/dark-night-of-the-baron.avif';
import nightOfTheWise from '../assets/BossRelics/night-of-the-wise.avif';
import nightOfTheChampion from '../assets/BossRelics/night-of-the-champion.avif';
import nightOfTheDemon from '../assets/BossRelics/night-of-the-demon.avif';
import nightOfTheFathom from '../assets/BossRelics/night-of-the-fathom.avif';
import nightOfTheMiasma from '../assets/BossRelics/night-of-the-miasma.avif';
import nightOfTheLord from '../assets/BossRelics/night-of-the-lord.avif';

// 导入Negations图片
import standardDamage from '../assets/Negations/standard-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import slashDamage from '../assets/Negations/slash-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import strikeDamage from '../assets/Negations/strike-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import pierceDamage from '../assets/Negations/pierce-damage-damage-type-elden-ring-nightreign-wiki-guide.png';
import magicDamage from '../assets/Negations/magic-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';
import fireDamage from '../assets/Negations/fire-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';
import lightningDamage from '../assets/Negations/lightning-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';
import holyDamage from '../assets/Negations/holy-upgrade-affinity-elden-ring-nightreign-wiki-guide.png';

// 导入Resistances图片
import poisonResistance from '../assets/Resistances/poison-status-effect-elden-ring-nightreign-wiki-guide-100px.png';
import scarletRotResistance from '../assets/Resistances/scarlet-rot-status-effect-elden-ring-nightreing-wiki-guide-100px.png';
import bleedResistance from '../assets/Resistances/hemorrhage-status-effect-elden-ring-nightreign-wiki-guide-100px.png';
import frostResistance from '../assets/Resistances/frostbite-status-effect-elden-ring-nightreign-wiki-guide-100px.png';
import sleepResistance from '../assets/Resistances/sleep-status-effect-elden-ring-nightreign-wiki-guide-100px.png';
import madnessResistance from '../assets/Resistances/madness-status-effect-elden-ring-nightreign-wiki-guide-100px.png';
import deathBlightResistance from '../assets/Resistances/blight_status_effect_elden_ring_wiki_guide_100px.png';

interface BossDataViewProps {
  activeSubTab?: string;
}

const BossDataView: React.FC<BossDataViewProps> = ({ activeSubTab }) => {
  const [filteredData] = useState<BossData[]>(bossData);
  const [wildBossSearchKeyword, setWildBossSearchKeyword] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [characterSearchKeyword, setCharacterSearchKeyword] = useState('');
  const [selectedCharacterLocations, setSelectedCharacterLocations] = useState<string[]>([]);
  const [playerCount, setPlayerCount] = useState<number>(1); // 添加人数选择状态
  const [activeBossTab, setActiveBossTab] = useState<string>(activeSubTab || 'boss-data');

  // 特殊事件相关状态
  const [specialEventData, setSpecialEventData] = useState<EntryData[]>([]);
  const [isLinearMode, setIsLinearMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getCurrentTheme());
  const [chartKey, setChartKey] = useState(0);
  const [loading, setLoading] = useState(true);

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

  // 位置颜色映射
  const locationColorMap: Record<string, string> = {
    '要塞': 'cyan',
    '监牢': 'volcano',
    '教堂': 'orange',
    '遗迹': 'magenta',
    '营地': 'green',
    '矿洞': 'magenta',
    '主城': 'gold',
    '主城地下': 'gold',
    '主城楼顶': 'gold',
    '野外蓝名': 'blue',
    '野外红名': 'red',
    '火山口': 'purple',
    '山顶': 'purple',
    '隐城': 'purple',
    '腐败森林': 'purple',
    '第一夜': 'geekblue',
    '第二夜': 'cyan',
    '突发事件': 'yellow',
    // 圆桌厅堂人物位置颜色
    '训练场': 'green',
    '可选角色': 'blue',
    '执行者绝招': 'magenta',
    '复仇者家人': 'cyan',
  };

  // 获取位置颜色
  const getLocationColor = (location: string | null | undefined): string => {
    if (!location) return 'default';
    return locationColorMap[location] || 'default';
  };

  // 获取类型颜色
  const getTypeColor = (type: string | null | undefined): string => {
    if (!type) return 'default';
    return typeColorMap[type] || 'default';
  };

  // 标签渲染函数
  const locationTagRender = (props: { label: React.ReactNode; value: string; closable?: boolean; onClose?: () => void }) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const color = getLocationColor(value);

    return (
      <Tag
        color={color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 2 }}
      >
        {label}
      </Tag>
    );
  };

  // 获取所有唯一的位置选项
  const getLocationOptions = () => {
    const locations = new Set<string>();
    wildBossData.forEach(boss => {
      if (boss.location) {
        // 处理多个位置用、分隔的情况
        const locationList = boss.location.split('、');
        locationList.forEach(loc => {
          locations.add(loc.trim());
        });
      }
    });

    return Array.from(locations).sort().map(location => ({
      value: location,
      label: location
    }));
  };

  // 过滤野生Boss数据
  const getFilteredWildBossData = () => {
    let filtered = wildBossData;

    // 按位置筛选
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(boss => {
        if (!boss.location) return false;
        const bossLocations = boss.location.split('、').map(loc => loc.trim());
        return selectedLocations.some(selectedLoc => bossLocations.includes(selectedLoc));
      });
    }

    // 按搜索关键词筛选（仅搜索Boss名称）
    if (wildBossSearchKeyword.trim()) {
      const searchLower = wildBossSearchKeyword.toLowerCase();
      filtered = filtered.filter(boss =>
        boss.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  // 清除野生Boss筛选
  const clearWildBossFilters = () => {
    setWildBossSearchKeyword('');
    setSelectedLocations([]);
  };

  // 获取所有唯一的圆桌厅堂人物位置选项
  const getCharacterLocationOptions = () => {
    const locations = new Set<string>();
    characterData.forEach(character => {
      if (character.location) {
        locations.add(character.location.trim());
      }
    });

    return Array.from(locations).sort().map(location => ({
      value: location,
      label: location
    }));
  };

  // 过滤圆桌厅堂人物数据
  const getFilteredCharacterData = () => {
    let filtered = characterData;

    // 按位置筛选
    if (selectedCharacterLocations.length > 0) {
      filtered = filtered.filter(character => {
        if (!character.location) return false;
        return selectedCharacterLocations.includes(character.location.trim());
      });
    }

    // 按搜索关键词筛选（仅搜索人物名称）
    if (characterSearchKeyword.trim()) {
      const searchLower = characterSearchKeyword.toLowerCase();
      filtered = filtered.filter(character =>
        character.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  // 清除圆桌厅堂人物筛选
  const clearCharacterFilters = () => {
    setCharacterSearchKeyword('');
    setSelectedCharacterLocations([]);
  };

  // 根据抗性数值返回CSS类名
  const getResistanceClass = (value: number | string): string => {
    if (value === '-' || value === null || value === undefined) {
      return '';
    }

    const numValue = typeof value === 'string' ? parseInt(value) : value;

    if (numValue <= 154) {
      return 'resistance-low'; // 低抗性 - 绿色
    } else if (numValue <= 252) {
      return 'resistance-medium'; // 中等抗性 - 橙色
    } else if (numValue <= 542) {
      return 'resistance-high'; // 高抗性 - 红色
    } else {
      return '';
    }
  };

  // 根据吸收数值返回CSS类名
  const getAbsorptionClass = (value: number): string => {
    if (value === null || value === undefined) {
      return '';
    }

    if (value > 1) {
      return 'absorption-1';
    }
    else if (value < 1) {
      // 对小于1的值进行进一步分类
      if (value <= 0.3) {
        return 'absorption-4';
      } else if (value <= 0.7) {
        return 'absorption-3';
      } else {
        return 'absorption-2';
      }
    } else {
      return '';
    }
  };

  // 计算韧性函数
  const calculatePoise = (basePoise: number): number => {
    const poiseMultipliers = {
      1: 1,      // 单人
      2: 1.82,   // 双人
      3: 3.33    // 三人
    };
    return Math.round(basePoise * poiseMultipliers[playerCount as keyof typeof poiseMultipliers]);
  };

  // 计算抗性函数
  const calculateResistance = (baseResistance: number | string): number | string => {
    if (typeof baseResistance === 'string') {
      return baseResistance; // 如果是"免疫"，直接返回
    }

    const resistanceMultipliers = {
      1: 1,      // 单人
      2: 2.67,   // 双人
      3: 4       // 三人
    };
    return Math.round(baseResistance * resistanceMultipliers[playerCount as keyof typeof resistanceMultipliers]);
  };

  // Boss名称到图片的映射
  const bossImageMap: { [key: string]: string } = {
    '"黑夜野兽"格拉狄乌斯': nightOfTheBeast,
    '"黑夜之爵"艾德雷': darkNightOfTheBaron,
    '"黑夜之智"格诺斯塔': nightOfTheWise,
    '"坚盾"弗堤士': nightOfTheWise,
    '"超越之光"亚尼姆斯': nightOfTheWise,
    '"深海黑夜"玛丽斯': nightOfTheFathom,
    '"黑夜雾霾"卡莉果': nightOfTheMiasma,
    '"黑夜王"布德奇冥': nightOfTheLord,
    '"黑夜之魔"利普拉': nightOfTheDemon,
    '"黑夜光骑士"弗格尔': nightOfTheChampion,
    '黑夜轮廓': nightOfTheLord,
  };



  const defaultFooter = () => (
    <div className="footer-text">
      <div>◦ 普通夜王血量 = 基础血量 × 玩家人数</div>
      <div>◦ 永夜王血量为倍率加成：永夜王血量 = 基础血量 × 永夜王血量加成倍率 × 玩家人数</div>
      <div>◦ 永夜王血量为独立数值：永夜王血量 = 永夜王血量 × 玩家人数</div>
    </div>
  );

  const resistanceFooter = () => (
    <div className="footer-text">
      <div>◦ 韧性倍率：单人100%，双人182%，三人333%｜ 普通韧性 = 基础韧性 × 韧性倍率 ｜ 永夜王韧性 = 永夜王韧性 × 韧性倍率</div>
      <div>◦ 抗性(异常耐受上限)倍率：单人100%，双人267%，三人400%｜ 抗性 = 基础抗性 × 抗性倍率</div>
    </div>
  );

  // 左侧表格列定义：血量 + 吸收
  const leftColumns: ColumnsType<BossData> = [
    {
      title: '图片',
      key: 'image',
      width: 42,
      align: 'center',
      render: (_, record) => {
        const imageSrc = bossImageMap[record.name];
        return imageSrc ? (
          <Image
            src={imageSrc}
            alt={record.name}
            width={40}
            height={40}
            className="boss-image"
            preview={false}
          />
        ) : null;
      },
      onCell: (record) => {
        // 找到相同图片的下一个boss的索引
        const currentIndex = filteredData.findIndex(item => item.name === record.name);
        const currentImage = bossImageMap[record.name];

        if (!currentImage) return {};

        // 计算相同图片的行数
        let rowSpan = 1;
        for (let i = currentIndex + 1; i < filteredData.length; i++) {
          if (bossImageMap[filteredData[i].name] === currentImage) {
            rowSpan++;
          } else {
            break;
          }
        }

        // 如果是相同图片组的第一行，设置rowSpan
        if (currentIndex === 0 || bossImageMap[filteredData[currentIndex - 1].name] !== currentImage) {
          return { rowSpan };
        }

        // 否则隐藏单元格
        return { rowSpan: 0 };
      },
    },
    {
      title: 'Boss名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      align: 'center',
      fixed: 'left',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: `Boss血量(${playerCount}人)`,
      children: [
        {
          title: '基础血量',
          dataIndex: 'baseHealth',
          key: 'baseHealth',
          width: 80,
          align: 'center',
          render: (value) => {
            if (typeof value === 'number') {
              return (
                <span className="health-base">
                  {Math.round(value * 3.54 * playerCount).toLocaleString()}
                </span>
              );
            }
            return (
              <span className="health-base">
                {value}
              </span>
            );
          },
        },
        {
          title: '永夜王血量',
          dataIndex: 'nightreignHealthMultiplier',
          key: 'nightreignHealthMultiplier',
          width: 100,
          align: 'center',
          render: (value, record) => {
            if (typeof value === 'number' && typeof record.nightreignHealth === 'number') {
              const nightreignBaseHealth = Math.round(record.nightreignHealth * 3.54 * playerCount);
              const nightreignHealth = Math.round(nightreignBaseHealth * value);
              return (
                <span className="health-nightreign">
                  {nightreignHealth.toLocaleString()}{value !== 1 ? `(×${value})` : ''}
                </span>
              );
            }
            return (
              <span className="health-nightreign">
                {value}
              </span>
            );
          },
        },
      ],
    },
    {
      title: '攻击类别',
      children: [
        {
          title: (
            <div className="damage-type-container">
              <Image src={standardDamage} alt="普通" width={18} height={18} preview={false} />
              <span>普通</span>
            </div>
          ),
          dataIndex: 'normalAbsorption',
          key: 'normalAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={strikeDamage} alt="打击" width={18} height={18} preview={false} />
              <span>打击</span>
            </div>
          ),
          dataIndex: 'strikeAbsorption',
          key: 'strikeAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={slashDamage} alt="斩击" width={18} height={18} preview={false} />
              <span>斩击</span>
            </div>
          ),
          dataIndex: 'slashAbsorption',
          key: 'slashAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={pierceDamage} alt="突刺" width={18} height={18} preview={false} />
              <span>突刺</span>
            </div>
          ),
          dataIndex: 'pierceAbsorption',
          key: 'pierceAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '属性类别',
      children: [
        {
          title: (
            <div className="damage-type-container">
              <Image src={magicDamage} alt="魔力" width={18} height={18} preview={false} />
              <span>魔力</span>
            </div>
          ),
          dataIndex: 'magicAbsorption',
          key: 'magicAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={fireDamage} alt="火焰" width={18} height={18} preview={false} />
              <span>火焰</span>
            </div>
          ),
          dataIndex: 'fireAbsorption',
          key: 'fireAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={lightningDamage} alt="雷电" width={18} height={18} preview={false} />
              <span>雷电</span>
            </div>
          ),
          dataIndex: 'lightningAbsorption',
          key: 'lightningAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={holyDamage} alt="神圣" width={18} height={18} preview={false} />
              <span>神圣</span>
            </div>
          ),
          dataIndex: 'holyAbsorption',
          key: 'holyAbsorption',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
      ],
    },
  ];

  // 右侧表格列定义： + 韧性
  const rightColumns: ColumnsType<BossData> = [
    {
      title: '',
      key: 'image',
      width: 42,
      align: 'center',
      render: (_, record) => {
        const imageSrc = bossImageMap[record.name];
        return imageSrc ? (
          <Image
            src={imageSrc}
            alt={record.name}
            width={40}
            height={40}
            className="boss-image"
            preview={false}
          />
        ) : null;
      },
      onCell: (record) => {
        // 找到相同图片的下一个boss的索引
        const currentIndex = filteredData.findIndex(item => item.name === record.name);
        const currentImage = bossImageMap[record.name];

        if (!currentImage) return {};

        // 计算相同图片的行数
        let rowSpan = 1;
        for (let i = currentIndex + 1; i < filteredData.length; i++) {
          if (bossImageMap[filteredData[i].name] === currentImage) {
            rowSpan++;
          } else {
            break;
          }
        }

        // 如果是相同图片组的第一行，设置rowSpan
        if (currentIndex === 0 || bossImageMap[filteredData[currentIndex - 1].name] !== currentImage) {
          return { rowSpan };
        }

        // 否则隐藏单元格
        return { rowSpan: 0 };
      },
    },
    {
      title: 'Boss名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      align: 'center',
      ellipsis: true,
      fixed: 'left',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: `韧性(${playerCount}人)`,
      children: [
        {
          title: '基础韧性',
          dataIndex: 'basePoise',
          key: 'basePoise',
          width: 70,
          align: 'center',
          render: (value) => (
            <span className="health-base">
              {calculatePoise(value)}
            </span>
          ),
        },
        {
          title: '永夜王韧性',
          dataIndex: 'nightreignPoise',
          key: 'nightreignPoise',
          width: 80,
          align: 'center',
          render: (value) => {
            if (typeof value === 'number') {
              return (
                <span className="health-nightreign">
                  {calculatePoise(value)}
                </span>
              );
            }
            return (
              <span className="health-nightreign">
                {value}
              </span>
            );
          },
        },
      ],
    },
    {
      title: `抗性 (${playerCount}人)`,
      children: [
        {
          title: (
            <div className="resistance-type-container">
              <Image src={poisonResistance} alt="中毒" width={18} height={18} preview={false} />
              <span>中毒</span>
            </div>
          ),
          dataIndex: 'poisonResistance',
          key: 'poisonResistance',
          width: 60,
          align: 'center',
          render: (value) => {
            const calculatedValue = calculateResistance(value);
            const originalClass = getResistanceClass(value); // 基于原始数值确定颜色
            return (
              <span className={`resistance-value ${originalClass}`}>
                {calculatedValue}
              </span>
            );
          },
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={scarletRotResistance} alt="腐败" width={18} height={18} preview={false} />
              <span>腐败</span>
            </div>
          ),
          dataIndex: 'scarletRotResistance',
          key: 'scarletRotResistance',
          width: 60,
          align: 'center',
          render: (value) => {
            const calculatedValue = calculateResistance(value);
            const originalClass = getResistanceClass(value); // 基于原始数值确定颜色
            return (
              <span className={`resistance-value ${originalClass}`}>
                {calculatedValue}
              </span>
            );
          },
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={bleedResistance} alt="出血" width={18} height={18} preview={false} />
              <span>出血</span>
            </div>
          ),
          dataIndex: 'bleedResistance',
          key: 'bleedResistance',
          width: 60,
          align: 'center',
          render: (value) => {
            const calculatedValue = calculateResistance(value);
            const originalClass = getResistanceClass(value); // 基于原始数值确定颜色
            return (
              <span className={`resistance-value ${originalClass}`}>
                {calculatedValue}
              </span>
            );
          },
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={frostResistance} alt="冻伤" width={18} height={18} preview={false} />
              <span>冻伤</span>
            </div>
          ),
          dataIndex: 'frostResistance',
          key: 'frostResistance',
          width: 60,
          align: 'center',
          render: (value) => {
            const calculatedValue = calculateResistance(value);
            const originalClass = getResistanceClass(value); // 基于原始数值确定颜色
            return (
              <span className={`resistance-value ${originalClass}`}>
                {calculatedValue}
              </span>
            );
          },
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={sleepResistance} alt="睡眠" width={18} height={18} preview={false} />
              <span>睡眠</span>
            </div>
          ),
          dataIndex: 'sleepResistance',
          key: 'sleepResistance',
          width: 60,
          align: 'center',
          render: (value) => {
            const calculatedValue = calculateResistance(value);
            const originalClass = getResistanceClass(value); // 基于原始数值确定颜色
            return (
              <span className={`resistance-value ${originalClass}`}>
                {calculatedValue}
              </span>
            );
          },
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={madnessResistance} alt="发狂" width={18} height={18} preview={false} />
              <span>发狂</span>
            </div>
          ),
          dataIndex: 'madnessResistance',
          key: 'madnessResistance',
          width: 60,
          align: 'center',
          render: (value) => {
            const calculatedValue = calculateResistance(value);
            const originalClass = getResistanceClass(value); // 基于原始数值确定颜色
            return (
              <span className={`resistance-value ${originalClass}`}>
                {calculatedValue}
              </span>
            );
          },
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={deathBlightResistance} alt="咒死" width={18} height={18} preview={false} />
              <span>咒死</span>
            </div>
          ),
          dataIndex: 'deathBlightResistance',
          key: 'deathBlightResistance',
          width: 60,
          align: 'center',
          render: (value) => {
            const calculatedValue = calculateResistance(value);
            const originalClass = getResistanceClass(value); // 基于原始数值确定颜色
            return (
              <span className={`resistance-value ${originalClass}`}>
                {calculatedValue}
              </span>
            );
          },
        },
      ],
    },
  ];

  // 定义罪人数据类型
  interface SinnerData {
    key: string;
    characterName: string;
    buildIndex: number;
    leftHand: string;
    rightHand: string;
    consumable: string;
  }

  // 处理罪人数据，转换为表格格式
  const processSinnerData = (): SinnerData[] => {
    const sinnerTableData: SinnerData[] = [];

    Object.entries(sinnerList).forEach(([characterName, builds]) => {
      builds.forEach((build: { 左手: string | string[]; 右手: string | string[]; 消耗品: string }, index: number) => {
        sinnerTableData.push({
          key: `${characterName}-${index}`,
          characterName,
          buildIndex: index + 1,
          leftHand: Array.isArray(build.左手) ? build.左手.join(' + ') : build.左手,
          rightHand: Array.isArray(build.右手) ? build.右手.join(' + ') : build.右手,
          consumable: build.消耗品
        });
      });
    });

    return sinnerTableData;
  };

  // 罪人装备配置表格列定义
  const sinnerColumns: ColumnsType<SinnerData> = [
    {
      title: '角色名称',
      dataIndex: 'characterName',
      key: 'characterName',
      width: 100,
      align: 'center',
      fixed: 'left',
      render: (text) => <strong>{text}</strong>,
      onCell: (record) => {
        const currentIndex = processSinnerData().findIndex(item =>
          item.characterName === record.characterName && item.buildIndex === record.buildIndex
        );

        // 计算相同角色的行数
        let rowSpan = 1;
        const allData = processSinnerData();
        for (let i = currentIndex + 1; i < allData.length; i++) {
          if (allData[i].characterName === record.characterName) {
            rowSpan++;
          } else {
            break;
          }
        }

        // 如果是相同角色的第一行，设置rowSpan
        if (currentIndex === 0 || allData[currentIndex - 1]?.characterName !== record.characterName) {
          return { rowSpan };
        }

        // 否则隐藏单元格
        return { rowSpan: 0 };
      },
    },
    {
      title: '配置',
      dataIndex: 'buildIndex',
      key: 'buildIndex',
      width: 60,
      align: 'center',
      render: (text) => `配置${text}`,
    },
    {
      title: '左手装备',
      dataIndex: 'leftHand',
      key: 'leftHand',
      width: 200,
      align: 'center',
    },
    {
      title: '右手装备',
      dataIndex: 'rightHand',
      key: 'rightHand',
      width: 200,
      align: 'center',
    },
    {
      title: '消耗品',
      dataIndex: 'consumable',
      key: 'consumable',
      width: 120,
      align: 'center',
    },
  ];

  const sinnerFooter = () => (
    <div className="footer-text">
      *双人1.1倍血量/三人1.2倍血量 *每个NPC基础数据均为满级 *每个NPC自带仇恨-6的BUFF
    </div>
  );

  // 野生Boss数据表格列定义
  const wildBossColumns: ColumnsType<WildBossData> = [
    {
      title: 'Boss名称',
      dataIndex: 'name',
      key: 'name',
      width: 130,
      align: 'center',
      fixed: 'left',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 90,
      align: 'center',
      render: (text) => (
        <span className="location-tag">
          {text ? text.split('、').map((loc: string) => (
            <Tag
              key={loc}
              color={getLocationColor(loc)}
            // style={{ marginInlineEnd: 1}}
            >
              {loc}
            </Tag>
          )) : null}
        </span>
      ),
    },
    {
      title: '攻击类别',
      children: [
        {
          title: (
            <div className="damage-type-container">
              <Image src={standardDamage} alt="普通" width={18} height={18} preview={false} />
              <span>普通</span>
            </div>
          ),
          dataIndex: 'normal',
          key: 'normal',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={strikeDamage} alt="打击" width={18} height={18} preview={false} />
              <span>打击</span>
            </div>
          ),
          dataIndex: 'strike',
          key: 'strike',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={slashDamage} alt="斩击" width={18} height={18} preview={false} />
              <span>斩击</span>
            </div>
          ),
          dataIndex: 'slash',
          key: 'slash',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={pierceDamage} alt="突刺" width={18} height={18} preview={false} />
              <span>突刺</span>
            </div>
          ),
          dataIndex: 'pierce',
          key: 'pierce',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '属性类别',
      width: 240,
      children: [
        {
          title: (
            <div className="damage-type-container">
              <Image src={magicDamage} alt="魔力" width={18} height={18} preview={false} />
              <span>魔力</span>
            </div>
          ),
          dataIndex: 'magic',
          key: 'magic',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={fireDamage} alt="火焰" width={18} height={18} preview={false} />
              <span>火焰</span>
            </div>
          ),
          dataIndex: 'fire',
          key: 'fire',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={lightningDamage} alt="雷电" width={18} height={18} preview={false} />
              <span>雷电</span>
            </div>
          ),
          dataIndex: 'lightning',
          key: 'lightning',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={holyDamage} alt="神圣" width={18} height={18} preview={false} />
              <span>神圣</span>
            </div>
          ),
          dataIndex: 'holy',
          key: 'holy',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '抗性',
      children: [
        {
          title: (
            <div className="resistance-type-container">
              <Image src={bleedResistance} alt="出血" width={18} height={18} preview={false} />
              <span>出血</span>
            </div>
          ),
          dataIndex: 'bleed',
          key: 'bleed',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={poisonResistance} alt="中毒" width={18} height={18} preview={false} />
              <span>中毒</span>
            </div>
          ),
          dataIndex: 'poison',
          key: 'poison',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={scarletRotResistance} alt="腐败" width={18} height={18} preview={false} />
              <span>腐败</span>
            </div>
          ),
          dataIndex: 'scarletRot',
          key: 'scarletRot',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={frostResistance} alt="冻伤" width={18} height={18} preview={false} />
              <span>冻伤</span>
            </div>
          ),
          dataIndex: 'frost',
          key: 'frost',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '韧性',
      dataIndex: 'basePoise',
      key: 'basePoise',
      width: 60,
      align: 'center',
    },
  ];

  const wildBossFooter = () => (
    <div className="footer-text">
      野生Boss数据：包含各种敌人和Boss的吸收值和抗性（异常耐受上限）数据
    </div>
  );

  // 圆桌厅堂人物数据表格列定义
  const characterColumns: ColumnsType<CharacterData> = [
    {
      title: '人物名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      align: 'center',
      fixed: 'left',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 90,
      align: 'center',
      render: (text) => (
        <span className="location-tag">
          {text ? (
            <Tag
              color={getLocationColor(text)}
              style={{ marginInlineEnd: 2 }}
            >
              {text}
            </Tag>
          ) : null}
        </span>
      ),
    },
    {
      title: '攻击类别',
      children: [
        {
          title: (
            <div className="damage-type-container">
              <Image src={standardDamage} alt="普通" width={18} height={18} preview={false} />
              <span>普通</span>
            </div>
          ),
          dataIndex: 'normal',
          key: 'normal',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={strikeDamage} alt="打击" width={18} height={18} preview={false} />
              <span>打击</span>
            </div>
          ),
          dataIndex: 'strike',
          key: 'strike',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={slashDamage} alt="斩击" width={18} height={18} preview={false} />
              <span>斩击</span>
            </div>
          ),
          dataIndex: 'slash',
          key: 'slash',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={pierceDamage} alt="突刺" width={18} height={18} preview={false} />
              <span>突刺</span>
            </div>
          ),
          dataIndex: 'pierce',
          key: 'pierce',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '属性类别',
      width: 240,
      children: [
        {
          title: (
            <div className="damage-type-container">
              <Image src={magicDamage} alt="魔力" width={18} height={18} preview={false} />
              <span>魔力</span>
            </div>
          ),
          dataIndex: 'magic',
          key: 'magic',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={fireDamage} alt="火焰" width={18} height={18} preview={false} />
              <span>火焰</span>
            </div>
          ),
          dataIndex: 'fire',
          key: 'fire',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={lightningDamage} alt="雷电" width={18} height={18} preview={false} />
              <span>雷电</span>
            </div>
          ),
          dataIndex: 'lightning',
          key: 'lightning',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="damage-type-container">
              <Image src={holyDamage} alt="神圣" width={18} height={18} preview={false} />
              <span>神圣</span>
            </div>
          ),
          dataIndex: 'holy',
          key: 'holy',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getAbsorptionClass(value)}`}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '抗性',
      children: [
        {
          title: (
            <div className="resistance-type-container">
              <Image src={bleedResistance} alt="出血" width={18} height={18} preview={false} />
              <span>出血</span>
            </div>
          ),
          dataIndex: 'bleed',
          key: 'bleed',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={poisonResistance} alt="中毒" width={18} height={18} preview={false} />
              <span>中毒</span>
            </div>
          ),
          dataIndex: 'poison',
          key: 'poison',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={scarletRotResistance} alt="腐败" width={18} height={18} preview={false} />
              <span>腐败</span>
            </div>
          ),
          dataIndex: 'scarletRot',
          key: 'scarletRot',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
        },
        {
          title: (
            <div className="resistance-type-container">
              <Image src={frostResistance} alt="冻伤" width={18} height={18} preview={false} />
              <span>冻伤</span>
            </div>
          ),
          dataIndex: 'frost',
          key: 'frost',
          width: 60,
          align: 'center',
          render: (value) => (
            <span className={`resistance-value ${getResistanceClass(value)}`}>
              {value}
            </span>
          ),
        },
      ],
    },
    {
      title: '韧性',
      dataIndex: 'basePoise',
      key: 'basePoise',
      width: 60,
      align: 'center',
    },
  ];

  const characterFooter = () => (
    <div className="footer-text">
      圆桌厅堂人物数据：包含各种NPC和角色的吸收值和抗性（异常耐受上限）数据
    </div>
  );

  // 利普拉的交易选项
  interface LipulaTrade {
    key: string;
    desire: string;
    effect: string;
    stats?: LipulaStats;
  }

  interface LipulaStats {
    level: number; // 等级
    hp: number; // 血
    fp: number; // 蓝
    stamina: number; // 绿
    str: number; // 力
    dex: number; // 敏
    intl: number; // 智
    fth: number; // 信
    arc: number; // 感
  }

  const lipulaTradesData: LipulaTrade[] = [
    { key: '1', desire: '我想要力气变的更大', effect: '改变角色属性加点', stats: { level: 15, hp: 47, fp: 6, stamina: 23, str: 73, dex: 9, intl: 3, fth: 3, arc: 3 } },
    { key: '2', desire: '我想要灵巧变的更高', effect: '改变角色属性加点', stats: { level: 15, hp: 43, fp: 10, stamina: 23, str: 9, dex: 72, intl: 3, fth: 3, arc: 3 } },
    { key: '3', desire: '我想要智力变的更高', effect: '改变角色属性加点', stats: { level: 15, hp: 33, fp: 28, stamina: 17, str: 9, dex: 9, intl: 55, fth: 24, arc: 3 } },
    { key: '4', desire: '我想要信仰变的更高', effect: '改变角色属性加点', stats: { level: 15, hp: 33, fp: 28, stamina: 17, str: 9, dex: 9, intl: 24, fth: 55, arc: 3 } },
    { key: '5', desire: '我想要感应变的更高', effect: '改变角色属性加点', stats: { level: 15, hp: 41, fp: 26, stamina: 26, str: 39, dex: 39, intl: 30, fth: 30, arc: 35 } },
    { key: '6', desire: '我想要能抵抗异常状态', effect: '提升全异常抗性，减少10%精力上限' },
    { key: '7', desire: '我想要死亡远离我', effect: '第一次收到致命攻击时免死并回满血，但是血量上限永久减少20%' },
    { key: '8', desire: '我想要厉害的武器', effect: '在维克的战矛、颠火圣印记、指纹石盾、黑刀、米凯拉骑士剑、黄金树弓中抽取一把武器' },
    { key: '9', desire: '我想要大幅度地升级', effect: '升三级，但是此后每次喝药将会降低一级' },
    { key: '10', desire: '我想要圣杯瓶', effect: '圣杯瓶使用次数增加一次，但是减少血量上限' },
    { key: '11', desire: '我想要体验大器晚成', effect: '立即减少血量、专注值、精力上限30%，如果在boss战开始后两分钟不倒地，血量、专注值、精力恢复正常并增加上限20%' },
    { key: '12', desire: '我想要全力战斗', effect: '利普拉开始战斗后立即进入金身强化状态，场上的玩家和boss都获得持续一分钟的buff' },
    { key: '13', desire: '我想要恶魔的力量', effect: '获得一个会随机攻击敌人的恶魔眼球，但是眼球每次攻击敌人会为角色累计发狂值' },
  ];

  const lipulaColumns: ColumnsType<LipulaTrade> = [
    {
      title: '利普拉的交易',
      dataIndex: 'desire',
      key: 'desire',
      width: 220,
      align: 'center',
      render: (text) => <strong>{text}</strong>,
      fixed: 'left',
    },
    {
      title: '效果',
      dataIndex: 'effect',
      key: 'effect',
      align: 'left',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          {record.stats && (
            <div style={{ marginTop: 4 }}>
              角色15级时加点示例：血量 {record.stats.hp}｜专注  {record.stats.fp}｜耐力 {record.stats.stamina}｜力气 {record.stats.str}｜敏捷 {record.stats.dex}｜智力 {record.stats.intl}｜信仰 {record.stats.fth}｜感应 {record.stats.arc}
            </div>
          )}
        </div>
      ),
    },
  ];

  // 特殊事件及地形效果表格列定义
  const specialEventColumns: ColumnsType<EntryData> = [
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

  // 加载特殊事件数据
  useEffect(() => {
    const loadSpecialEventData = async () => {
      try {
        const dataManager = DataManager.getInstance();
        await dataManager.waitForData();
        setSpecialEventData(dataManager.getInGameSpecialBuff());
        setLoading(false);
      } catch (error) {
        console.error('Failed to load special event data:', error);
        message.error('特殊事件数据加载失败');
        setLoading(false);
      }
    };

    loadSpecialEventData();
  }, []);

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
    const throttledChartRefresh = throttle(() => {
      setChartKey(prev => prev + 1);
    }, 300);

    const handleResize = () => {
      throttledChartRefresh();
    };

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

  // 监听标签页切换，确保图表正确渲染
  useEffect(() => {
    if (activeBossTab === 'special-events') {
      const timer = setTimeout(() => {
        setChartKey(prev => prev + 1);
        window.dispatchEvent(new Event('resize'));
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [activeBossTab]);

  // 监听外部Tab切换
  useEffect(() => {
    if (activeSubTab && activeSubTab !== activeBossTab) {
      setActiveBossTab(activeSubTab);
    }
  }, [activeSubTab, activeBossTab]);

  return (
    <div className="boss-data-view-container">
      <Card className="boss-card">
        <Tabs
          style={{ marginTop: '5px' }}
          type="card"
          activeKey={activeBossTab}
          onChange={setActiveBossTab}
          items={[
            {
              key: 'boss-data',
              label: '🌙 夜王基础数据',
              children: (
                <div id="night-king-basic">
                  <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Radio.Group
                      value={playerCount}
                      onChange={(e) => setPlayerCount(e.target.value)}
                      size="middle"
                    >
                      <Radio.Button value={1}>单人模式</Radio.Button>
                      <Radio.Button value={2}>双人模式</Radio.Button>
                      <Radio.Button value={3}>三人模式</Radio.Button>
                    </Radio.Group>
                  </div>
                  <Table
                    columns={leftColumns}
                    dataSource={filteredData}
                    rowKey="id"
                    scroll={{ x: 800 }}
                    pagination={false}
                    size="small"
                    bordered
                    footer={defaultFooter}
                    style={{ marginBottom: '24px' }}
                  />
                  <Table
                    columns={rightColumns}
                    dataSource={filteredData}
                    rowKey="id"
                    scroll={{ x: 600 }}
                    pagination={false}
                    size="small"
                    bordered
                    footer={resistanceFooter}
                  />
                </div>
              ),
            },
            {
              key: 'wild-boss-data',
              label: '☠️ 野生Boss数据',
              children: (
                <div className="wild-boss-filter-container" id="wild-boss-data">
                  <div className="filter-inputs">
                    <Input
                      placeholder="搜索Boss名称"
                      prefix={<SearchOutlined />}
                      style={{ width: 200 }}
                      value={wildBossSearchKeyword}
                      onChange={(e) => setWildBossSearchKeyword(e.target.value)}
                    />
                    <Select
                      mode="multiple"
                      placeholder="选择位置"
                      options={getLocationOptions()}
                      value={selectedLocations}
                      onChange={setSelectedLocations}
                      tagRender={locationTagRender}
                      style={{ minWidth: 200, maxWidth: 400 }}
                    />
                    <Button onClick={clearWildBossFilters}>清除筛选</Button>
                  </div>
                  <Table
                    columns={wildBossColumns}
                    dataSource={getFilteredWildBossData()}
                    rowKey="name"
                    pagination={false}
                    size="small"
                    bordered
                    footer={wildBossFooter}
                    sticky={{ offsetHeader: 0 }}
                    scroll={{ x: 1000, y: 700 }}
                  />
                </div>
              ),
            },
            {
              key: 'character-data',
              label: '🏛️ 圆桌厅堂人物数据',
              children: (
                <div className="wild-boss-filter-container" id="roundtable-characters">
                  <div className="filter-inputs">
                    <Input
                      placeholder="搜索人物名称"
                      prefix={<SearchOutlined />}
                      style={{ width: 200 }}
                      value={characterSearchKeyword}
                      onChange={(e) => setCharacterSearchKeyword(e.target.value)}
                    />
                    <Select
                      mode="multiple"
                      placeholder="选择位置"
                      options={getCharacterLocationOptions()}
                      value={selectedCharacterLocations}
                      onChange={setSelectedCharacterLocations}
                      tagRender={locationTagRender}
                      style={{ minWidth: 200, maxWidth: 400 }}
                    />
                    <Button onClick={clearCharacterFilters}>清除筛选</Button>
                  </div>
                  <Table
                    columns={characterColumns}
                    dataSource={getFilteredCharacterData()}
                    rowKey="name"
                    pagination={false}
                    size="small"
                    bordered
                    footer={characterFooter}
                    sticky={{ offsetHeader: 0 }}
                    scroll={{ x: 1000, y: 700 }}
                  />
                </div>
              ),
            },
            {
              key: 'sinner-data',
              label: '🐐 永夜山羊召唤罪人详情',
              children: (
                <div id="sinner-details">
                  <Table
                    columns={sinnerColumns}
                    dataSource={processSinnerData()}
                    rowKey="key"
                    scroll={{ x: 700 }}
                    pagination={false}
                    size="small"
                    bordered
                    footer={sinnerFooter}
                  />
                </div>
              ),
            },
            {
              key: 'lipula-trades',
              label: '⚖️ 利普拉的交易(Boss战)',
              children: (
                <div id="lipula-trades">
                  <Table
                    columns={lipulaColumns}
                    dataSource={lipulaTradesData}
                    rowKey="key"
                    pagination={false}
                    size="small"
                    bordered
                  />
                </div>
              ),
            },
            {
              key: 'special-events',
              label: '🌋 特殊事件及地形效果',
              children: (
                <div id="special-events">
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                      <Spin spinning={true} />
                    </div>
                  ) : (
                    <>
                      <Table
                        columns={specialEventColumns}
                        dataSource={specialEventData}
                        rowKey="entry_id"
                        pagination={false}
                        size="small"
                        bordered
                        style={{ marginBottom: '30px' }}
                      />
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
                          <Line key={`line-chart-${chartKey}-${activeBossTab}`} {...lineConfig} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default BossDataView;
