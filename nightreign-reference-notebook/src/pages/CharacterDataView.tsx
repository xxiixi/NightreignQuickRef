import React, { useState, useMemo, useEffect } from 'react';
import { Typography, Table, Alert, Tabs } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { Radar, Column } from '@ant-design/plots';
import { throttle } from 'lodash';
import { getCurrentTheme } from '../utils/themeUtils';
import '../styles/characterDataView.css';
import DataManager from '../utils/dataManager';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

// 魔法招式接口
interface MagicMove {
  属性痕: string;
  属性图标: string;
  混合魔法: string;
  总伤害: string;
  持续时间: string;
  混合魔法效果: string;
}

// 数据接口
interface DataState {
  characterStatesData: CharacterData[];
  magicMoveData: MagicMove[];
  loading: boolean;
}

// 闪避无敌帧对比组件
const DodgeFramesComparison = () => {
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getCurrentTheme());
    const [chartKey, setChartKey] = useState(0);
    const [frameData, setFrameData] = useState<Array<{name: string; type: string; value: number}>>([]);
    
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

    // 计算每个角色的总帧数用于顶部注释
    const totalFrames: { [key: string]: number } = {};
    frameData.forEach((item: {name: string; type: string; value: number}) => {
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
      data: frameData,
      xField: 'name',
      yField: 'value',
      stack: true,
      colorField: 'type',
      theme: currentTheme,
      height: 400,
      autoFit: true,
      label: {
        text: 'value',
        textBaseline: 'bottom',
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
        <div className="card-header">
          <Title level={5} className="character-card-title">
           翻滚/闪避 帧数对比
          </Title>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: '10px', color: 'var(--theme-text-secondary)', fontSize: '14px' }}>
            提示：图中为60帧情况下的数据（1帧即1/60秒）
          </div>
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
            <Column key={`dodge-frames-${chartKey}`} {...config} />
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

const CharacterDataView: React.FC = () => {
  // 数据状态
  const [data, setData] = useState<DataState>({
    characterStatesData: [],
    magicMoveData: [],
    loading: true
  });

  // Excel（职业数据）标签页状态
  const [excelTabs, setExcelTabs] = useState<Array<{ name: string; columns: ColumnsType<any>; data: any[] }>>([]);
  const [excelLoading, setExcelLoading] = useState<boolean>(true);
  const [excelError, setExcelError] = useState<string | null>(null);
  const [hpData, setHpData] = useState<Array<{ character: string; [key: string]: string | number }>>([]);
  const [fpData, setFpData] = useState<Array<{ character: string; [key: string]: string | number }>>([]);
  const [stData, setStData] = useState<Array<{ character: string; [key: string]: string | number }>>([]);

  // 顶部与底部表格页脚
  const topTablesFooter = () => (
    <div className="footer-text">血量、专注、耐力具体数值/局内等级成长</div>
  );
  const bottomTablesFooter = () => (
    <div className="footer-text">局内等级/艾尔登法环本体等级</div>
  );

  // 从DataManager获取数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const dataManager = DataManager.getInstance();
        await dataManager.waitForData();

        setData({
          characterStatesData: dataManager.getCharacterStates(),
          magicMoveData: dataManager.getMagicMoveList(),
          loading: false
        });
      } catch (error) {
        console.error('Failed to load character data:', error);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    loadData();
  }, []);

  // 加载 Excel（所有角色）到 Tabs
  useEffect(() => {
    const loadExcel = async () => {
      try {
        // 所有角色文件列表
        const characterFiles = [
          '追踪者.xlsx',
          '女爵.xlsx',
          '隐士.xlsx',
          '铁之眼.xlsx',
          '无赖.xlsx',
          '执行者.xlsx', 
          '守护者.xlsx',
          '复仇者.xlsx',
        ];
        const tabs: Array<{ name: string; columns: ColumnsType<any>; data: any[] }> = [];
        const hpRows: Array<{ character: string; [key: string]: string | number }> = [];
        const fpRows: Array<{ character: string; [key: string]: string | number }> = [];
        const stRows: Array<{ character: string; [key: string]: string | number }> = [];

        for (const fileName of characterFiles) {
          try {
            const excelUrl = new URL(`../data/character-info/${fileName}`, import.meta.url).href;
            const response = await fetch(excelUrl);
            if (!response.ok) {
              console.warn(`无法加载 ${fileName}: ${response.status}`);
              continue;
            }
            
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            // 获取第一个工作表
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonRows: Array<Record<string, any>> = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                                      if (jsonRows.length > 0) {
               const columnKeys = Object.keys(jsonRows[0]);
               // 移除后三列
               const filteredColumnKeys = columnKeys.slice(0, -3);
               const columns: ColumnsType<any> = filteredColumnKeys.map((key) => ({
                 title: key,
                 dataIndex: key,
                 key,
                 align: 'center',
                 width: key.length > 4 ? 120 : 80,
                  ellipsis: { showTitle: false },
               }));

               const data = jsonRows.map((row, index) => {
                 // 只保留前几列的数据，移除后三列
                 const filteredRow: any = { key: `${fileName.replace('.xlsx', '')}-${index}` };
                 filteredColumnKeys.forEach(key => {
                   filteredRow[key] = row[key];
                 });
                 return filteredRow;
               });

               tabs.push({ 
                 name: fileName.replace('.xlsx', ''), 
                 columns, 
                 data 
               });

               // 提取 HP/FP/ST 数据：按等级聚合到 Lv1..Lv15（FP/ST 与 HP 完全相同的获取方式）
               const characterName = fileName.replace('.xlsx', '');
               const hpKey = columnKeys.find(k => k.trim().toLowerCase() === 'hp');
               const fpKey = columnKeys.find(k => k.trim().toLowerCase() === 'fp');
               const stKey = columnKeys.find(k => k.trim().toLowerCase() === 'st');
               const levelKey = columnKeys.find(k => {
                 const key = String(k).trim().toLowerCase();
                 return key === '等级' || key === 'lv' || key === 'level';
               });

               const buildRow = (statKey?: string) => {
                 if (!statKey) return null;
                 const row: any = { character: characterName };
                 for (let lv = 1; lv <= 15; lv++) row[`Lv${lv}`] = '';
                 jsonRows.forEach((r, idx) => {
                   let levelNum = 0;
                   if (levelKey) {
                     const raw = r[levelKey];
                     levelNum = parseInt(String(raw).replace(/[^0-9]/g, ''), 10);
                   } else {
                     // 没有等级列则按行序推断等级（从 1 开始）
                     levelNum = idx + 1;
                   }
                   if (Number.isFinite(levelNum) && levelNum >= 1 && levelNum <= 15) {
                     row[`Lv${levelNum}`] = r[statKey];
                   }
                 });
                 return row;
               };

               const hpRow = buildRow(hpKey);
               const fpRow = buildRow(fpKey);
               const stRow = buildRow(stKey);
               if (hpRow) hpRows.push(hpRow);
               if (fpRow) fpRows.push(fpRow);
               if (stRow) stRows.push(stRow);
             }
          } catch (fileError) {
            console.warn(`加载 ${fileName} 失败:`, fileError);
          }
        }

        setExcelTabs(tabs);
        setHpData(hpRows);
        setFpData(fpRows);
        setStData(stRows);
      } catch (err) {
        console.error('加载 Excel 失败:', err);
        setExcelError('Excel 加载失败，请稍后重试');
      } finally {
        setExcelLoading(false);
      }
    };

    loadExcel();
  }, []);

  // 直接使用加载的角色数据
  const characterData: CharacterData = data.characterStatesData[0] || {};

  // 隐士出招表数据
  const magicMoves: MagicMove[] = data.magicMoveData || [];

  // 隐士出招表列配置
  const magicMoveColumns: ColumnsType<MagicMove> = [
    {
      title: '属性痕',
      dataIndex: '属性痕',
      key: '属性痕',
      width: '12%',
      align: 'center',
    },
    {
      title: '属性图标',
      dataIndex: '属性图标',
      key: '属性图标',
      width: '12%',
      align: 'center',
    },
    {
      title: '混合魔法',
      dataIndex: '混合魔法',
      key: '混合魔法',
      width: '12%',
      align: 'center',
    },
    {
      title: '总伤害',
      dataIndex: '总伤害',
      key: '总伤害',
      width: '9%',
      align: 'center',
    },
    {
      title: '持续时间',
      dataIndex: '持续时间',
      key: '持续时间',
      width: '9%',
      align: 'center',
    },
    {
      title: '混合魔法效果',
      dataIndex: '混合魔法效果',
      key: '混合魔法效果',
      ellipsis: false,
      align: 'left',
      render: (text: string) => (
        <div style={{ 
          wordBreak: 'break-word', 
          whiteSpace: 'pre-wrap',
          textAlign: 'left',
          lineHeight: '1.5',
          padding: '4px 0'
        }}>
          {text}
        </div>
      ),
    },
  ];

  // 获取所有属性名称
  const getAttributeNames = () => {
    const firstCharacter = Object.values(characterData)[0];
    return firstCharacter ? Object.keys(firstCharacter) : [];
  };

  // 获取所有角色名称
  const characterNames = Object.keys(characterData);

  // 选中的角色状态 - 默认选中追踪者和女爵
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(['追踪者', '女爵']);
  
  // 当前主题状态
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getCurrentTheme());
  
  // 强制重新渲染的key
  const [chartKey, setChartKey] = useState(0);

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

  // 动态调整雷达图高度以匹配表格高度
  useEffect(() => {
    const adjustRadarHeight = () => {
      const tableContainer = document.querySelector('.character-attributes-table')?.closest('div');
      const radarContainer = document.getElementById('radar-chart-container');
      
      if (tableContainer && radarContainer) {
        const tableHeight = tableContainer.getBoundingClientRect().height;
        // 设置雷达图容器高度与表格一致，但最小保持400px
        const targetHeight = Math.max(tableHeight, 400);
        radarContainer.style.height = `${targetHeight}px`;
      }
    };

    // 节流后的高度调整函数
    const throttledAdjustHeight = throttle(adjustRadarHeight, 200);

    // 初始调整
    adjustRadarHeight();
    
    // 监听表格数据变化（通过selectedRowKeys变化触发）
    const timer = setTimeout(throttledAdjustHeight, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [selectedRowKeys]);

  // 表格列定义
  const columns: ColumnsType<{ key: string; character: string; [key: string]: string }> = [
    {
      title: '角色',
      dataIndex: 'character',
      key: 'character',
      width: 60,
      fixed: 'left',
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
      const rowData: { key: string; character: string; [key: string]: string } = {
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
    const attributes = getAttributeNames();
    
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
  }, []);

  // 行选择配置
  const rowSelection: TableProps<{ key: string; character: string; [key: string]: string }>['rowSelection'] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      // 限制最多选择8个角色
      if (newSelectedRowKeys.length <= 8) {
        setSelectedRowKeys(newSelectedRowKeys);
      }
    },
    getCheckboxProps: (record: { key: string; character: string; [key: string]: string }) => ({
      name: record.character,
    }),
  };

  return (
    <div className="character-data-container">
      <div className="content-wrapper card-item">
        <div className="card-header">
          <Title level={5} className="character-card-title">
            基础属性
          </Title>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: '10px', color: 'var(--theme-text-secondary)', fontSize: '14px' }}>
            提示：可勾选多个角色进行对比
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            {/* 角色属性表格 */}
            <div style={{ flex: '1', minWidth: '0' }}>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={generateTableData()}
                pagination={false}
                size="middle"
                scroll={{ x: 'max-content' }}
                className="character-attributes-table"
              />
            </div>
            
            {/* 雷达图容器 - 动态高度响应拖拽和窗口变化 */}
            <div 
              className="radar-chart-container"
              style={{ flex: '1', minWidth: '400px', minHeight: '400px' }}
              id="radar-chart-container"
            >
              {selectedRowKeys.length > 0 ? (
                <Radar
                  key={`radar-main-${chartKey}`}
                  data={radarData}
                  xField="item"       // 用于X轴（雷达图的各个顶点）的字段
                  yField="score"      // 用于Y轴（数值）的字段
                  colorField="type"   // 用于区分不同角色的字段
                  height={400}        // 雷达图高度，稍小于容器高度
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
                    }
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

      {/* 闪避无敌帧对比 */}
      <DodgeFramesComparison />

      <div className="content-wrapper card-item">
        <div className="card-header">
          <Title level={5} className="character-card-title">
            隐士出招表
          </Title>
        </div>
        <div className="card-body">
          <div style={{ marginBottom: '10px', color: 'var(--theme-text-secondary)', fontSize: '14px' }}>
            提示：总伤害为角色15级时数据
          </div>
          <Table
            dataSource={magicMoves}
            columns={magicMoveColumns}
            pagination={false}
            size="small"
            bordered
            rowKey={(record) => record.属性痕}
            scroll={{ x: '100%' }}
            style={{ 
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap'
            }}
          />
        </div>
      </div>

             {/* 角色详细数据（来自 Excel） */}
       <div className="content-wrapper card-item">
         <div className="card-header">
           <Title level={5} className="character-card-title">
             角色详细数据
           </Title>
         </div>
         <div className="card-body">
           {excelError ? (
             <Alert type="error" message={excelError} />
           ) : excelTabs.length === 0 ? (
             <Alert type="info" message="正在加载角色数据..." />
           ) : (
              <>
                {/* HP/FP/ST 数据表格（通过 Tabs 切换） */}
               <Tabs
                 items={[
                   {
                     key: 'hp',
                     label: '1-15级血量成长',
                     children: (
                       <Table
                         dataSource={hpData}
                         columns={[
                           { title: '角色', dataIndex: 'character', key: 'character', width: 100, fixed: 'left', align: 'center' as const },
                           ...Array.from({ length: 15 }, (_, i) => ({ title: `Lv${i + 1}`, dataIndex: `Lv${i + 1}`, key: `Lv${i + 1}`, width: 60, align: 'center' as const }))
                         ]}
                         pagination={false}
                         size="small"
                         bordered
                         loading={excelLoading}
                         scroll={{ x: 'max-content' }}
                         style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                          footer={topTablesFooter}
                       />
                     )
                   },
                   {
                     key: 'fp',
                     label: '1-15级专注值成长',
                     children: (
                       <Table
                         dataSource={fpData}
                         columns={[
                           { title: '角色', dataIndex: 'character', key: 'character', width: 100, fixed: 'left', align: 'center' as const },
                           ...Array.from({ length: 15 }, (_, i) => ({ title: `Lv${i + 1}`, dataIndex: `Lv${i + 1}`, key: `Lv${i + 1}`, width: 60, align: 'center' as const }))
                         ]}
                         pagination={false}
                         size="small"
                         bordered
                         loading={excelLoading}
                         scroll={{ x: 'max-content' }}
                         style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                          footer={topTablesFooter}
                       />
                     )
                   },
                   {
                     key: 'st',
                     label: '1-15级耐力值成长',
                     children: (
                       <Table
                         dataSource={stData}
                         columns={[
                           { title: '角色', dataIndex: 'character', key: 'character', width: 100, fixed: 'left', align: 'center' as const },
                           ...Array.from({ length: 15 }, (_, i) => ({ title: `Lv${i + 1}`, dataIndex: `Lv${i + 1}`, key: `Lv${i + 1}`, width: 60, align: 'center' as const }))
                         ]}
                         pagination={false}
                         size="small"
                         bordered
                         loading={excelLoading}
                         scroll={{ x: 'max-content' }}
                         style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                          footer={topTablesFooter}
                       />
                     )
                   }
                 ]}
                 style={{ marginBottom: 20 }}
               />
               
                {/* 角色详细数据标签页 */}
               <Tabs
                 items={excelTabs.map((tab) => ({
                   key: tab.name,
                   label: tab.name,
                   children: (
                     <Table
                       dataSource={tab.data}
                       columns={tab.columns}
                       pagination={false}
                       size="small"
                       bordered
                       loading={excelLoading}
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
             </>
           )}
         </div>
       </div>
      



    </div>
  );
};

export default CharacterDataView;
