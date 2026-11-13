import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Typography, Table, Alert, Tabs, Divider, Switch, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { Radar, Column } from '@ant-design/plots';
import { ThunderboltTwoTone, QuestionCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { throttle } from 'lodash';
import { getCurrentTheme } from '../utils/themeUtils';
import '../styles/characterDataView.css';
import DataManager from '../utils/dataManager';
import DataSourceTooltip from '../components/DataSourceTooltip';

const { Title, Text } = Typography;

// 数据接口
interface DataState {
  characterStatesData: CharacterData[];
  loading: boolean;
}

// 导入 MagicMove 接口
import type { MagicMove } from '../utils/dataManager';

// 角色详细数据行类型
interface CharacterDetailRow {
  character: string;
  [key: string]: string | number;
}

// JSON 标签页类型
interface JsonTab {
  name: string;
  columns: ColumnsType<CharacterDetailRow>;
  data: CharacterDetailRow[];
}

// 角色等级数据类型
interface CharacterLevelData {
  level: number; // 等级
  HP: number;
  FP: number;
  ST: number;
  [key: string]: string | number;
}

// 「强化闪避」加成（60fps）：默认 +6 帧，女爵·闪身 +2 帧
const ENHANCED_DODGE_BONUS = 6;
const ENHANCED_DODGE_BONUS_OVERRIDES: { [name: string]: number } = {
  '女爵（闪身）': 2,
};

// 闪避无敌帧对比组件
const DodgeFramesComparison = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getCurrentTheme());
  const [chartKey, setChartKey] = useState(0);
  const [frameData, setFrameData] = useState<Array<{ name: string; type: string; value: number }>>([]);
  // 是否叠加「强化闪避」：无敌帧 +6（女爵·闪身 +2），动作总帧长不变
  const [enhancedDodge, setEnhancedDodge] = useState(false);

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
      // 拖拽结束后延迟刷新，确保容器尺寸已稳定
      setTimeout(throttledChartRefresh, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('dragend', handleDragEnd);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('dragend', handleDragEnd);
    };
  }, []); // 空依赖数组，只在组件挂载时设置监听器

  // 确保组件挂载后图表能正确渲染
  useEffect(() => {
    // 强制重新渲染图表
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 加载无敌帧数据
  useEffect(() => {
    const loadFrameData = async () => {
      try {
        const dataManager = DataManager.getInstance();
        await dataManager.waitForData();
        setFrameData(dataManager.getInvincibleFrames());
      } catch (error) {
        console.error('Failed to load frame data:', error);
      }
    };

    loadFrameData();
  }, []);

  // 「强化闪避」：把 6 帧非无敌帧转为无敌帧（女爵·闪身只转 2 帧），总帧长不变
  const displayFrameData = useMemo(() => {
    if (!enhancedDodge) {
      return frameData;
    }
    return frameData.map((item) => {
      const bonus = ENHANCED_DODGE_BONUS_OVERRIDES[item.name] ?? ENHANCED_DODGE_BONUS;
      if (item.type === '无敌帧') {
        return { ...item, value: item.value + bonus };
      }
      if (item.type === '非无敌帧') {
        return { ...item, value: Math.max(0, item.value - bonus) };
      }
      return item;
    });
  }, [frameData, enhancedDodge]);

  // 值为 0 的段不参与绘制，避免出现 0 标签
  const chartFrameData = useMemo(
    () => displayFrameData.filter((item) => item.value > 0),
    [displayFrameData],
  );

  // 计算每个角色的总帧数用于顶部注释
  const totalFrames: { [key: string]: number } = {};
  displayFrameData.forEach((item: { name: string; type: string; value: number }) => {
    if (!totalFrames[item.name]) {
      totalFrames[item.name] = 0;
    }
    totalFrames[item.name] += item.value;
  });

  // 创建注释数组
  const annotations = Object.entries(totalFrames).map(([name, total]) => ({
    type: 'text',
    data: [name, total],
    style: {
      text: `${total}`,
      textBaseline: 'bottom',
      position: 'top',
      textAlign: 'center',
      fontSize: 14,
      fill: currentTheme === 'dark' ? 'rgba(232, 232, 232, 0.85)' : 'rgb(0, 158, 231)',
    },
    tooltip: false,
  }));

  const config = {
    data: chartFrameData,
    xField: 'name',
    yField: 'value',
    stack: true,
    colorField: 'type',
    theme: currentTheme,
    height: 400,
    autoFit: true,
    label: {
      text: 'value',
      textBaseline: 'middle',
      position: 'inside',
    },
    tooltip: false,
    scale: {
      y: {
        domainMax: 60,
      },
    },
    axis: {
      x: {
        label: {
          autoRotate: false,
          autoHide: false,
          autoEllipsis: false,
          style: {
            fill: currentTheme === 'dark' ? '#ffffff' : '#000000',
            fontSize: 12,
          },
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
        labelFormatter: (value: string) => {
          // 将括号内容换行显示
          return value.replace(/（([^）]+)）/g, '\n（$1）');
        },
      },
      y: {
        label: {
          style: {
            fill: currentTheme === 'dark' ? '#ffffff' : '#000000',
            fontSize: 12,
          },
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
        labelFormatter: (value: number) => `${value}帧`,
      },
    },
    style: {
      radius: 10,
      fillOpacity: 0.8,
    },
    annotations,
  };

  return (
    <div className="content-wrapper card-item">
      <div
        className="card-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <Title level={5} className="character-card-title" style={{ margin: 0 }}>
          翻滚/闪避 帧数对比
        </Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>强化闪避</Text>
          <Switch
            size="small"
            checked={enhancedDodge}
            onChange={setEnhancedDodge}
            checkedChildren="开"
            unCheckedChildren="关"
          />
          <Tooltip title="开启后按「强化闪避」加成显示：无敌帧 +6 帧（女爵·闪身 +2 帧），动作总帧长不变。熔炉羽护符、风结晶露滴同理。">
            <QuestionCircleOutlined style={{ color: 'var(--color-text-3)', cursor: 'help' }} />
          </Tooltip>
        </div>
      </div>
      <div className="card-body">
        <div style={{ marginBottom: '10px', color: 'var(--theme-text-secondary)', fontSize: '14px' }}>
          提示：图中为60帧情况下的数据（1帧即1/60秒）
        </div>
        {enhancedDodge && (
          <div style={{ marginBottom: '10px', color: 'var(--color-primary-500)', fontSize: '14px' }}>
            已开启「强化闪避」：无敌帧 +6（女爵·闪身 +2），非无敌帧相应减少，总帧长不变
          </div>
        )}
        <div
          className="dodge-frames-chart-container"
          style={{
            height: 400,
            width: '100%',
            padding: '20px 0',
            minHeight: '400px',
            position: 'relative'
          }}
        >
          <Column key={`dodge-frames-${chartKey}-${enhancedDodge ? 'enhanced' : 'base'}`} {...config} />
        </div>

        {/* 提示信息 */}
        <Alert
          message="机制说明"
          description={
            <div className="dodge-frames-tips">
              <div className="tip-item">
                1. 黑夜君临中没有负重影响人物翻滚 / 闪避的机制，角色直接决定回避性能，人物体型 / 身高与回避性能无关。
              </div>

              <div className="tip-item">
                2. 蓝色部分表示 "无敌帧"，绿色部分表示非无敌帧。从0帧开始，非无敌帧结束后即可自由移动。（无敌帧 + 非无敌帧 = 翻滚/闪避动画总帧长）
              </div>

              <div className="tip-item">
                3. 如果角色在动作的无敌帧结束前执行了其他动作（如进行轻攻击），那无敌帧会在执行其他动作的瞬间中断，同时这也会减少整个闪避动作的位移距离。
              </div>

              <div className="tip-item">
                4. 各数值对应的秒数计算：帧数数值× (1/60秒); 举例: 追踪者翻滚总时长为40帧，在60帧情况下，对应的时长为 40×(1/60)s = 2/3s ≈ 0.67s
              </div>

              <div className="tip-item">
                5. 熔炉羽护符、风结晶露滴或局内强化闪避额外获得的无敌帧为6帧，女爵（闪身）为2帧
              </div>
            </div>
          }
          type="info"
          showIcon={false}
          style={{ marginTop: '20px' }}
        />
      </div>
    </div>
  );
};

// 角色属性接口定义
interface CharacterState {
  [key: string]: string;
}

// 角色数据接口定义
interface CharacterData {
  [characterName: string]: CharacterState;
}

// G2 默认分类色板（与 light/dark 主题的 category10 一致）
const RADAR_COLORS = [
  '#1783FF', '#00C9C9', '#F0884D', '#D580FF', '#7863FF',
  '#60C42D', '#BD8F24', '#FF80CA', '#2491B3', '#17C76F',
];

// 雷达图自定义图例：固定单行，超出时用左右箭头滚动（类似 ECharts legend type=scroll）
const RadarLegend: React.FC<{
  names: string[];
  getColor: (name: string) => string;
}> = ({ names, getColor }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    const resizeObserver = new ResizeObserver(updateArrows);
    resizeObserver.observe(el);
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows, names]);

  const scroll = (direction: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.6, 120), behavior: 'smooth' });
  };

  return (
    <div className="radar-legend">
      <button
        type="button"
        className="radar-legend-arrow"
        aria-label="向左滚动图例"
        style={{ visibility: canScrollLeft ? 'visible' : 'hidden' }}
        onClick={() => scroll(-1)}
      >
        <LeftOutlined />
      </button>
      <div
        className={`radar-legend-scroll${!canScrollLeft && !canScrollRight ? ' is-centered' : ''}`}
        ref={scrollRef}
      >
        {names.map((name) => (
          <span className="radar-legend-item" key={name}>
            <span className="radar-legend-dot" style={{ backgroundColor: getColor(name) }} />
            <span>{name}</span>
          </span>
        ))}
      </div>
      <button
        type="button"
        className="radar-legend-arrow"
        aria-label="向右滚动图例"
        style={{ visibility: canScrollRight ? 'visible' : 'hidden' }}
        onClick={() => scroll(1)}
      >
        <RightOutlined />
      </button>
    </div>
  );
};

const CharacterDataView: React.FC = () => {
  // 数据状态
  const [data, setData] = useState<DataState>({
    characterStatesData: [],
    loading: true
  });

  // 隐士出招表数据
  const [magicMoves, setMagicMoves] = useState<MagicMove[]>([]);

  // JSON（职业数据）标签页状态
  const [jsonTabs, setJsonTabs] = useState<JsonTab[]>([]);
  const [hpData, setHpData] = useState<CharacterDetailRow[]>([]);
  const [fpData, setFpData] = useState<CharacterDetailRow[]>([]);
  const [stData, setStData] = useState<CharacterDetailRow[]>([]);

  // 顶部与底部表格页脚
  const topTablesFooter = () => (
    <div className="footer-text">血量、专注、耐力具体数值/局内等级成长</div>
  );
  const bottomTablesFooter = () => (
    <div className="footer-text">局内等级/艾尔登法环本体等级</div>
  );
  const characterAttributesFooter = () => (
    <div className="footer-text" >
      提示：可勾选多个角色进行对比
    </div>
  );

  // 从DataManager获取数据并加载JSON数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const dataManager = DataManager.getInstance();
        await dataManager.waitForData();

        setData({
          characterStatesData: dataManager.getCharacterStates(),
          loading: false
        });

        // 加载隐士出招表数据
        setMagicMoves(dataManager.getMagicMoveList());

        // 使用预加载的角色详细数据
        const characterDetailData = dataManager.getCharacterDetailData();
        const tabs: JsonTab[] = [];
        const hpRows: CharacterDetailRow[] = [];
        const fpRows: CharacterDetailRow[] = [];
        const stRows: CharacterDetailRow[] = [];

        // 统一获取属性列（排除 HP/FP/ST/等级）
        const firstCharacterWithData = Object.values(characterDetailData).find((arr): arr is CharacterLevelData[] => Array.isArray(arr) && arr.length > 0);
        const attributeKeys = firstCharacterWithData
          ? Object.keys(firstCharacterWithData[0]).filter(key => !['HP', 'FP', 'ST', '等级', 'level'].includes(key))
          : [];

        // 构建等级视图：每个等级一个 Tab，行=角色，列=各属性
        for (let lv = 1; lv <= 15; lv++) {
          const levelColumns: ColumnsType<CharacterDetailRow> = [
            {
              title: `角色（${lv}级）`,
              dataIndex: 'character',
              key: 'character',
              width: 100,
              fixed: 'left',
              align: 'center' as const,
              render: (text: string) => (
                <span style={{
                  fontWeight: 'bold',
                  color: 'var(--color-text-1)',
                  fontSize: '13px'
                }}>
                  {text}
                </span>
              )
            },
            ...attributeKeys.map(attrKey => ({
              title: attrKey === '增加点数'
                ? <span>{`Lv${lv - 1} → Lv${lv}`} 增加点数</span>
                : ['生命力', '集中力', '耐力', '力气', '敏捷', '智力', '信仰', '感应'].includes(attrKey)
                  ? <span style={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>{attrKey}</span>
                  : attrKey,
              dataIndex: attrKey,
              key: attrKey,
              width: attrKey === '增加点数' ? 140 : 60,
              align: 'center' as const,
              render: (value: string | number | undefined) => (
                <span style={{
                  fontWeight: '500',
                  color: value ? 'var(--color-text-1)' : 'var(--color-text-3)',
                  fontSize: '13px'
                }}>
                  {value || '-'}
                </span>
              )
            }))
          ];

          const rowsAtLevel: CharacterDetailRow[] = [];
          Object.entries(characterDetailData).forEach(([characterName, characterLevels]) => {
            if (Array.isArray(characterLevels) && characterLevels.length > 0) {
              const levelData = (characterLevels as CharacterLevelData[]).find((item: CharacterLevelData) => (item['等级'] ?? item.level) === lv);
              const row: CharacterDetailRow = { character: characterName };
              attributeKeys.forEach(attrKey => {
                row[attrKey] = levelData ? levelData[attrKey] : '';
              });
              rowsAtLevel.push(row);
            }
          });

          tabs.push({
            name: `🔸 Lv${lv}`,
            columns: levelColumns,
            data: rowsAtLevel
          });
        }

        // 提取 HP/FP/ST 数据：按等级聚合到 Lv1..Lv15
        Object.entries(characterDetailData).forEach(([characterName, characterData]) => {
          if (characterData && Array.isArray(characterData) && characterData.length > 0) {
            const buildRow = (statKey: string): CharacterDetailRow => {
              const row: CharacterDetailRow = { character: characterName };
              for (let lv = 1; lv <= 15; lv++) {
                const levelData = (characterData as CharacterLevelData[]).find((item: CharacterLevelData) => (item['等级'] ?? item.level) === lv);
                row[`Lv${lv}`] = levelData ? levelData[statKey] : '';
              }
              return row;
            };

            const hpRow = buildRow('HP');
            const fpRow = buildRow('FP');
            const stRow = buildRow('ST');

            hpRows.push(hpRow);
            fpRows.push(fpRow);
            stRows.push(stRow);
          }
        });

        setJsonTabs(tabs);
        setHpData(hpRows);
        setFpData(fpRows);
        setStData(stRows);
      } catch (error) {
        console.error('Failed to load character data:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    loadData();
  }, []);

  const characterData: CharacterData = useMemo(() => data.characterStatesData[0] || {}, [data.characterStatesData]);
  const getAttributeNames = () => {
    const firstCharacter = Object.values(characterData)[0];
    return firstCharacter ? Object.keys(firstCharacter) : [];
  };
  const characterNames = Object.keys(characterData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(['追踪者', '女爵', '送葬者']);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getCurrentTheme());
  const [chartKey, setChartKey] = useState(0);

  // 角色颜色按 characterNames 固定映射，图例与雷达图共用，避免选中顺序变化导致换色
  const getRadarColor = (name: string) => {
    const index = characterNames.indexOf(name);
    return RADAR_COLORS[(index >= 0 ? index : 0) % RADAR_COLORS.length];
  };

  useEffect(() => {
    const checkTheme = () => {
      const newTheme = getCurrentTheme();
      if (newTheme !== currentTheme) {
        setCurrentTheme(newTheme);
        setChartKey(prev => prev + 1);
      }
    };

    checkTheme();

    const handleStorageChange = () => {
      setTimeout(checkTheme, 50);
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
      checkTheme();
    };

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
    }, 300); // 300ms节流延迟

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

  useEffect(() => {
    const adjustRadarHeight = () => {
      const tableContainer = document.querySelector('.character-attributes-table')?.closest('div');
      const radarContainer = document.getElementById('radar-chart-container');

      if (tableContainer && radarContainer) {
        const tableHeight = tableContainer.getBoundingClientRect().height;
        const targetHeight = Math.max(tableHeight, 350);
        radarContainer.style.height = `${targetHeight}px`;
      }
    };

    const throttledAdjustHeight = throttle(adjustRadarHeight, 200);
    adjustRadarHeight();

    const timer = setTimeout(throttledAdjustHeight, 100);

    window.addEventListener('resize', throttledAdjustHeight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', throttledAdjustHeight);
    };
  }, [selectedRowKeys]);

  // 表格列定义
  const columns: ColumnsType<{ key: string; character: string;[key: string]: string }> = [
    {
      title: '角色',
      dataIndex: 'character',
      key: 'character',
      width: 60,
      fixed: 'left',
      align: 'center' as const,
      render: (text: string) => (
        <Text style={{ color: 'var(--color-text-1)' }}>
          {text}
        </Text>
      ),
    },
    // 动态生成属性列（排除"擅长武器"）
    ...getAttributeNames()
      .filter(attribute => attribute !== '擅长武器')
      .map(attribute => ({
        title: attribute,
        dataIndex: attribute,
        key: attribute,
        width: 46,
        align: 'center' as const,
        render: (value: string) => {
          // 根据等级获取对应的样式类
          const getValueClass = (value: string) => {
            switch (value) {
              case 'S': return 'character-attribute-value s-rank';
              case 'A': return 'character-attribute-value a-rank';
              case 'B': return 'character-attribute-value b-rank';
              case 'C': return 'character-attribute-value c-rank';
              case 'D': return 'character-attribute-value d-rank';
              default: return 'character-attribute-value default';
            }
          };

          return (
            <Text className={getValueClass(value)} strong>
              {value}
            </Text>
          );
        },
      })),
  ];

  // 生成表格数据
  const generateTableData = () => {
    const attributeNames = getAttributeNames();
    const tableAttributes = attributeNames.filter(attribute => attribute !== '擅长武器');

    return characterNames.map(characterName => {
      const rowData: { key: string; character: string;[key: string]: string } = {
        key: characterName,
        character: characterName,
      };

      tableAttributes.forEach(attribute => {
        rowData[attribute] = characterData[characterName]?.[attribute] || '-';
      });

      return rowData;
    });
  };

  // 将字母等级转换为数值（用于雷达图）
  const gradeToPosition = (grade: string) => {
    const levelMap: { [key: string]: number } = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'D': 1 };
    return levelMap[grade] || 0;
  };

  // 处理雷达图数据（使用useMemo避免不必要的重计算）
  const radarData = useMemo(() => {
    const result: Array<{ item: string; type: string; score: number; level: string; value: string }> = [];
    const firstCharacter = Object.values(characterData)[0];
    const attributes = firstCharacter ? Object.keys(firstCharacter) : [];

    // 过滤掉"擅长武器"属性，只保留需要在雷达图上展示的属性
    const radarAttributes = attributes.filter(attr =>
      attr !== '擅长武器' &&
      ['生命', '专注', '耐力', '力量', '灵巧', '智力', '信仰', '感应'].includes(attr)
    );

    // 只显示选中的角色
    const charactersToShow = selectedRowKeys.map(key => key.toString());

    // 为每个角色的每个属性创建雷达图数据点
    charactersToShow.forEach(character => {
      if (characterData[character]) {
        radarAttributes.forEach(attr => {
          const level = characterData[character][attr];
          result.push({
            item: attr,
            type: character,
            score: gradeToPosition(level), // 使用数值绘制图形
            level: level, // 保存等级标签用于显示
            value: level // 备用字段名
          });
        });
      }
    });

    return result;
  }, [characterData, selectedRowKeys]);

  // 获取雷达图属性列表（用于空状态显示）
  const radarAttributes = useMemo(() => {
    const attributes = getAttributeNames();
    return attributes.filter(attr =>
      attr !== '擅长武器' &&
      ['生命', '专注', '耐力', '力量', '灵巧', '智力', '信仰', '感应'].includes(attr)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterData]);

  // 隐士出招表列定义
  const magicMoveColumns = [
    { title: '属性痕', dataIndex: '属性痕', key: 'attributeMark', width: '12%', align: 'center' as const },
    { title: '属性图标', dataIndex: '属性图标', key: 'attributeIcon', width: '12%', align: 'center' as const },
    { title: '混合魔法', dataIndex: '混合魔法', key: 'mixedMagic', width: '12%', align: 'center' as const },
    { title: '总伤害', dataIndex: '总伤害', key: 'totalDamage', width: '9%', align: 'center' as const },
    { title: '持续时间', dataIndex: '持续时间', key: 'duration', width: '9%', align: 'center' as const },
    {
      title: '混合魔法效果',
      dataIndex: '混合魔法效果',
      key: 'mixedMagicEffect',
      ellipsis: false,
      align: 'left' as const,
      render: (text: string) => (
        <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', textAlign: 'left', lineHeight: '1.5', padding: '4px 0' }}>
          {text}
        </div>
      ),
    },
  ];

  // 行选择配置
  const rowSelection: TableProps<{ key: string; character: string;[key: string]: string }>['rowSelection'] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      // 至少保留一名角色，避免雷达图变成空图（不弹提示）
      if (newSelectedRowKeys.length === 0) {
        const fallback = selectedRowKeys[0] ?? characterNames[0];
        if (fallback) {
          setSelectedRowKeys([fallback]);
        }
        return;
      }
      // 最多选择全部角色（原先固定为 8，DLC 新增学者/送葬者后会导致全选失效）
      if (newSelectedRowKeys.length <= characterNames.length) {
        setSelectedRowKeys(newSelectedRowKeys);
      }
    },
    getCheckboxProps: (record: { key: string; character: string;[key: string]: string }) => ({
      name: record.character,
      // 只剩一名角色时锁住它，不能再取消
      disabled: selectedRowKeys.length === 1 && selectedRowKeys.includes(record.key),
    }),
  };

  return (
    <div className="character-data-container">
      <div className="content-wrapper card-item" id="character-attributes">
        <div className="card-header">
          <Title level={5} className="character-card-title">
            基础属性
          </Title>
        </div>
        <div className="card-body">
          <div className="attributes-and-radar" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {/* 角色属性表格 */}
            <div className="character-attributes-table-container">
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={generateTableData()}
                rowKey="key"
                pagination={false}
                size="small"
                bordered
                scroll={{ x: 'max-content' }}
                className="character-attributes-table"
                // style={{ height: '350px' }}
                style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                footer={characterAttributesFooter}
              />
            </div>

            {/* 雷达图容器 - 动态高度响应拖拽和窗口变化 */}
            <div
              className="radar-chart-container"
              id="radar-chart-container"
            >
              {selectedRowKeys.length > 0 ? (
                <>
                  <div className="radar-chart-inner">
                    <RadarLegend
                      names={selectedRowKeys.map(key => key.toString())}
                      getColor={getRadarColor}
                    />
                    <Radar
                      key={`radar-main-${chartKey}-${selectedRowKeys.join('-')}`}
                      data={radarData}
                      xField="item"       // 用于X轴（雷达图的各个顶点）的字段
                      yField="score"      // 用于Y轴（数值）的字段
                      colorField="type"   // 用于区分不同角色的字段
                      legend={false}      // 使用自定义单行图例
                      height={380}        // 雷达图高度
                      autoFit={true}      // 自适应容器大小
                      animate={false}     // 关闭更新动画，避免切换角色超过 8 个时残留外圈
                      theme={currentTheme}        // 根据当前主题动态设置
    
                      // 坐标轴配置
                      axis={{
                        x: {
                          grid: true,
                          gridLineWidth: 1,
                          tick: false,
                          gridLineDash: [0, 0],
                        },
                        y: {
                          zIndex: 1,
                          title: false,
                          gridLineWidth: 1,
                          gridLineDash: [0, 0],
                          gridAreaFill: (_: unknown, index: number) => {
                            return index % 2 === 1 ? 'rgba(0, 0, 0, 0.04)' : '';
                          },
                          labelFormatter: (value: number) => {
                            const levelMap: Record<number, string> = { 1: 'D', 2: 'C', 3: 'B', 4: 'A', 5: 'S' };
                            return levelMap[value] || '';
                          },
    
                        },
                      }}
    
                      // 数据点配置
                      point={{
                        size: 4,
                      }}
    
                      // 刻度配置 - 恢复辅助线
                      scale={{
                        x: { padding: 50, align: 0 },
                        y: {
                          tickCount: 5,
                          domainMin: 0,
                          domainMax: 5
                        },
                        color: {
                          domain: characterNames,
                          range: RADAR_COLORS,
                        },
                      }}
    
                      // 线条样式
                      style={{
                        lineWidth: 2,
                      }}
    
                      // 提示框配置
                      tooltip={{
                        items: [
                          {
                            channel: 'y',
                            valueFormatter: (value: number) => {
                              const levelMap: Record<number, string> = { 1: 'D', 2: 'C', 3: 'B', 4: 'A', 5: 'S' };
                              return levelMap[value] || value.toString();
                            }
                          }
                        ]
                      }}
    
                      // 填充区域样式
                      area={{
                        style: {
                          fillOpacity: 0.1,      // 填充透明度
                        },
                      }}
    
                      // 线样式
                      line={{
                        style: {
                          lineWidth: 2,
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                // 空状态显示
                <div
                  className="radar-wrapper"
                  style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Radar
                    key={`radar-empty-${chartKey}`}
                    data={radarAttributes.map(attr => ({
                      item: attr,
                      type: '',
                      score: 0
                    }))}
                    xField="item"
                    yField="score"
                    colorField="type"
                    height={350}
                    theme={currentTheme}        // 根据当前主题动态设置
                    axis={{
                      x: {
                        grid: true,
                        gridLineWidth: 1,
                        tick: false,
                        gridLineDash: [0, 0],
                      },
                      y: {
                        zIndex: 1,
                        title: false,
                        gridLineWidth: 1,
                        gridLineDash: [0, 0],
                        tick: {
                          formatter: (value: number) => {
                            const levelMap: { [key: number]: string } = { 1: 'D', 2: 'C', 3: 'B', 4: 'A', 5: 'S' };
                            return levelMap[value] || '';
                          }
                        },
                      },
                    }}
                    scale={{
                      x: { padding: 0.5, align: 0 },
                      y: {
                        tickCount: 5,
                        domainMin: 0,
                        domainMax: 5
                      }
                    }}
                    // 隐藏图例和数据点
                    legend={false}
                    point={{ size: 0 }}
                    line={{ style: { lineWidth: 0 } }}
                    area={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 角色详细数据 */}
      <div className="content-wrapper card-item" id="character-detail-data">
        <div className="card-header">
          <Title level={5} className="character-card-title">
            角色详细数据
          </Title>
        </div>
        <div className="card-body">
          <Title level={5} style={{ margin: '12px 0 8px', color: 'var(--color-text-1)' }}>
            同等级角色属性对比
          </Title>
          {/* 角色详细数据标签页 */}
          <Tabs
            type="card"
            items={jsonTabs.map((tab) => ({
              key: tab.name,
              label: tab.name,
              children: (
                <Table
                  dataSource={tab.data}
                  columns={tab.columns}
                  rowKey="character"
                  pagination={false}
                  size="small"
                  bordered
                  scroll={{ x: 'max-content' }}
                  style={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                  footer={bottomTablesFooter}
                />
              ),
            }))}
          />
          <Divider />
          {jsonTabs.length > 0 && (
            <>
              <Title level={5} style={{ marginBottom: 8, color: 'var(--color-text-1)' }}>
                血量、专注、耐力具体数值
              </Title>
              {/* HP/FP/ST 数据表格（通过 Tabs 切换） */}
              <Tabs
                type="card"
                items={[
                  {
                    key: 'hp',
                    label: '❤️ 血量值成长',
                    children: (
                      <Table
                        dataSource={hpData}
                        rowKey="character"
                        rowClassName={(_record, index) =>
                          index !== undefined && index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
                        }
                        columns={[
                          {
                            title: '等级',
                            dataIndex: 'character',
                            key: 'character',
                            width: 100,
                            fixed: 'left',
                            align: 'center' as const,
                            render: (text: string) => (
                              <span style={{
                                fontWeight: 'bold',
                                color: 'var(--color-text-1)',
                                fontSize: '13px'
                              }}>
                                {text}
                              </span>
                            )
                          },
                          ...Array.from({ length: 15 }, (_, i) => ({
                            title: <span style={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>{`Lv${i + 1}`}</span>,
                            dataIndex: `Lv${i + 1}`,
                            key: `Lv${i + 1}`,
                            width: 60,
                            align: 'center' as const,
                            render: (value: string | number | undefined) => (
                              <span style={{
                                fontWeight: '500',
                                color: value ? 'var(--color-text-1)' : 'var(--color-text-3)',
                                fontSize: '13px'
                              }}>
                                {value || '-'}
                              </span>
                            )
                          }))
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                        scroll={{ x: 'max-content' }}
                        style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                        footer={topTablesFooter}
                      />
                    )
                  },
                  {
                    key: 'fp',
                    label: '💙 专注值成长',
                    children: (
                      <Table
                        dataSource={fpData}
                        rowKey="character"
                        rowClassName={(_record, index) =>
                          index !== undefined && index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
                        }
                        columns={[
                          {
                            title: '等级',
                            dataIndex: 'character',
                            key: 'character',
                            width: 100,
                            fixed: 'left',
                            align: 'center' as const,
                            render: (text: string) => (
                              <span style={{
                                fontWeight: 'bold',
                                color: 'var(--color-text-1)',
                                fontSize: '13px'
                              }}>
                                {text}
                              </span>
                            )
                          },
                          ...Array.from({ length: 15 }, (_, i) => ({
                            title: <span style={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>{`Lv${i + 1}`}</span>,
                            dataIndex: `Lv${i + 1}`,
                            key: `Lv${i + 1}`,
                            width: 60,
                            align: 'center' as const,
                            render: (value: string | number | undefined) => (
                              <span style={{
                                fontWeight: '500',
                                color: value ? 'var(--color-text-1)' : 'var(--color-text-3)',
                                fontSize: '13px'
                              }}>
                                {value || '-'}
                              </span>
                            )
                          }))
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                        scroll={{ x: 'max-content' }}
                        style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                        footer={topTablesFooter}
                      />
                    )
                  },
                  {
                    key: 'st',
                    label: '💚 耐力值成长',
                    children: (
                      <Table
                        dataSource={stData}
                        rowKey="character"
                        rowClassName={(_record, index) =>
                          index !== undefined && index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
                        }
                        columns={[
                          {
                            title: '等级',
                            dataIndex: 'character',
                            key: 'character',
                            width: 100,
                            fixed: 'left',
                            align: 'center' as const,
                            render: (text: string) => (
                              <span style={{
                                fontWeight: 'bold',
                                color: 'var(--color-text-1)',
                                fontSize: '13px'
                              }}>
                                {text}
                              </span>
                            )
                          },
                          ...Array.from({ length: 15 }, (_, i) => ({
                            title: <span style={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>{`Lv${i + 1}`}</span>,
                            dataIndex: `Lv${i + 1}`,
                            key: `Lv${i + 1}`,
                            width: 60,
                            align: 'center' as const,
                            render: (value: string | number | undefined) => (
                              <span style={{
                                fontWeight: '500',
                                color: value ? 'var(--color-text-1)' : 'var(--color-text-3)',
                                fontSize: '13px'
                              }}>
                                {value || '-'}
                              </span>
                            )
                          }))
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                        scroll={{ x: 'max-content' }}
                        style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                        footer={topTablesFooter}
                      />
                    )
                  }
                ]}
                style={{ marginBottom: 30 }}
              />
            </>
          )}
        </div>
      </div>


      {/* 闪避无敌帧对比 */}
      <div id="dodge-frames">
        <DodgeFramesComparison />
      </div>

      {/* 隐士出招表 */}
      <div className="content-wrapper card-item" id="hermit-magic-list">
        <div className="card-header">
          <Title level={5} className="character-card-title">
            <ThunderboltTwoTone />
            隐士出招表
            <DataSourceTooltip
              links={[
                {
                  text: "1. 混合魔法太复杂？没关系我来讲清楚！",
                  url: "https://api.xiaoheihe.cn/v3/bbs/app/api/web/share?link_id=758970790a0a"
                },
                {
                  text: "2. 黑夜君临 v1.01数据汇总-技艺、绝招数据",
                  url: "https://tieba.baidu.com/p/9906444262?pid=152430482433&cid=#152430482433"
                }
              ]}
            />
          </Title>
        </div>
        <div className="card-body">
          <Table
            dataSource={magicMoves}
            columns={magicMoveColumns}
            pagination={false}
            size="small"
            bordered
            rowKey={(record) => (record as MagicMove).attributeMark || (record as MagicMove)['属性痕'] || ''}
            scroll={{ x: '100%' }}
            style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
            footer={() => (
              <div className="footer-text">备注：总伤害为角色 15 级时测试数据</div>
            )}
          />
        </div>
      </div>


      {/* ----------------- */}
    </div>
  );
};

export default CharacterDataView;
