import React, { useState, useMemo, useEffect } from 'react';
import { Typography, Table, Alert, Tabs, Divider } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { Radar, Column } from '@ant-design/plots';
import { throttle } from 'lodash';
import { getCurrentTheme } from '../utils/themeUtils';
import '../styles/characterDataView.css';
import DataManager from '../utils/dataManager';

const { Title, Text } = Typography;

// 数据接口
interface DataState {
  characterStatesData: CharacterData[];
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
    loading: true
  });

  // JSON（职业数据）标签页状态
  const [jsonTabs, setJsonTabs] = useState<Array<{ name: string; columns: ColumnsType<any>; data: any[] }>>([]);
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

        // 使用预加载的角色详细数据
        const characterDetailData = dataManager.getCharacterDetailData();
        const tabs: Array<{ name: string; columns: ColumnsType<any>; data: any[] }> = [];
        const hpRows: Array<{ character: string; [key: string]: string | number }> = [];
        const fpRows: Array<{ character: string; [key: string]: string | number }> = [];
        const stRows: Array<{ character: string; [key: string]: string | number }> = [];

        // 处理每个角色的详细数据
        Object.entries(characterDetailData).forEach(([characterName, characterData]) => {
          if (characterData && characterData.length > 0) {
            // 获取列名（排除HP、FP、ST和等级）
            const columnKeys = Object.keys(characterData[0]).filter(key => 
              !['HP', 'FP', 'ST', '等级'].includes(key)
            );

            // 调换行列：将属性作为行，等级作为列
            const transposedData = columnKeys.map((attrKey) => {
              const row: any = { attribute: attrKey };
              // 为每个等级创建列
              for (let lv = 1; lv <= 15; lv++) {
                const levelData = characterData.find((item: any) => item.等级 === lv);
                row[`Lv${lv}`] = levelData ? levelData[attrKey] : '';
              }
              return row;
            });

            // 创建新的列定义
            const transposedColumns: ColumnsType<any> = [
              {
                title: '等级',
                dataIndex: 'attribute',
                key: 'attribute',
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
                ),
                onCell: (record) => {
                  const isSpecialAttr = ['总点数', '增加点数'].includes(record.attribute);
                  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' || 
                                   document.body.getAttribute('tomato-theme') === 'dark';
                  return {
                    style: {
                      backgroundColor: isSpecialAttr 
                        ? (isDarkMode ? 'var(--color-neutral-900)' : 'var(--geekblue-1)')
                        : 'var(--content-bg)',
                    }
                  };
                }
              },
              ...Array.from({ length: 15 }, (_, i) => ({
                title: <span style={{ fontWeight: 'bold', color: 'var(--color-primary-500)' }}>{`Lv${i + 1}`}</span>,
                dataIndex: `Lv${i + 1}`,
                key: `Lv${i + 1}`,
                width: 60,
                align: 'center' as const,
                render: (value: any, record: any) => {
                  const isSpecialAttr = ['总点数', '增加点数'].includes(record.attribute);
                  return (
                    <span style={{ 
                      fontWeight: isSpecialAttr ? 'bold' : 'normal',
                      color: value ? 'var(--color-text-1)' : 'var(--color-text-3)',
                      fontSize: '13px'
                    }}>
                      {value || '-'}
                    </span>
                  );
                },
                onCell: (record: { attribute: string }) => {
                  const isSpecialAttr = ['总点数', '增加点数'].includes(record.attribute);
                  const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark' || 
                                   document.body.getAttribute('tomato-theme') === 'dark';
                  return {
                    style: {
                      backgroundColor: isSpecialAttr 
                        ? (isDarkMode ? 'var(--color-neutral-900)' : 'var(--geekblue-1)')
                        : 'transparent',
                    }
                  };
                }
              }))
            ];

            tabs.push({ 
              name: characterName, 
              columns: transposedColumns, 
              data: transposedData 
            });

            // 提取 HP/FP/ST 数据：按等级聚合到 Lv1..Lv15
            const buildRow = (statKey: string) => {
              const row: any = { character: characterName };
              for (let lv = 1; lv <= 15; lv++) {
                const levelData = characterData.find((item: any) => item.等级 === lv);
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



  // 直接使用加载的角色数据
  const characterData: CharacterData = data.characterStatesData[0] || {};

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
        // 设置雷达图容器高度与表格一致，但最小保持350px
        const targetHeight = Math.max(tableHeight, 350);
        radarContainer.style.height = `${targetHeight}px`;
      }
    };

    // 节流后的高度调整函数
    const throttledAdjustHeight = throttle(adjustRadarHeight, 200);

    // 初始调整
    adjustRadarHeight();
    
    // 监听表格数据变化（通过selectedRowKeys变化触发）
    const timer = setTimeout(throttledAdjustHeight, 100);
    
    // 监听窗口大小变化
    window.addEventListener('resize', throttledAdjustHeight);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', throttledAdjustHeight);
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
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {/* 角色属性表格 */}
            <div className="character-attributes-table-container">
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={generateTableData()}
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
                <Radar
                  key={`radar-main-${chartKey}`}
                  data={radarData}
                  xField="item"       // 用于X轴（雷达图的各个顶点）的字段
                  yField="score"      // 用于Y轴（数值）的字段
                  colorField="type"   // 用于区分不同角色的字段
                  height={380}        // 雷达图高度
                  autoFit={true}      // 自适应容器大小
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

      {/* 角色详细数据 */}
      <div className="content-wrapper card-item">
         <div className="card-header">
           <Title level={5} className="character-card-title">
             角色详细数据
           </Title>
         </div>
         <div className="card-body">
           {jsonTabs.length > 0 && (
              <>
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
                             render: (value: any) => (
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
                             render: (value: any) => (
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
                             render: (value: any) => (
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
               <Divider />
               
                {/* 角色详细数据标签页 */}
               <Tabs
                 type="card"
                 items={jsonTabs.map((tab: any) => ({
                   key: tab.name,
                   label: tab.name,
                   children: (
                     <Table
                       dataSource={tab.data}
                       columns={tab.columns}
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
             </>
           )}
         </div>
       </div>


      {/* 闪避无敌帧对比 */}
      <DodgeFramesComparison />


      
      {/* ----------------- */}
    </div>
  );
};

export default CharacterDataView;
