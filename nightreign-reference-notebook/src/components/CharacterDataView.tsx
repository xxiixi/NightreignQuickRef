import React, { useState, useMemo, useEffect } from 'react';
import { Typography, Table, Empty } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { Radar, Bar } from '@ant-design/plots';
import characterStatesData from '../data/zh-CN/character_states.json';
import { getCurrentTheme } from '../utils/themeUtils';
import '../styles/characterDataView.css';

const { Title, Text } = Typography;

// 闪避无敌帧对比组件
const DodgeFramesComparison = () => {
    // 获取当前主题
    const currentTheme = getCurrentTheme();
    
    // 确保组件挂载后图表能正确渲染
    useEffect(() => {
      // 强制重新渲染图表
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
      
      return () => clearTimeout(timer);
    }, []);
    
    // 整理数据格式（符合Ant Design图表要求）
    const frameData = [
      { name: "追踪者（翻滚）", value: 13 },
      { name: "铁之眼（翻滚）", value: 13 },
      { name: "复仇者（翻滚）", value: 13 },
      { name: "执行者（翻滚）", value: 13 },
      { name: "守护者（闪避）", value: 10 },
      { name: "无赖（翻滚）", value: 12 },
      { name: "隐士（闪避）", value: 15 },
      { name: "女爵（闪避）", value: 10 },
      { name: "女爵（双重踏步）", value: 11 },
      { name: "女爵（后空翻）", value: 11 },
      { name: "女爵（闪身）", value: 6 }
    ];
  
    return (
      <div className="content-wrapper card-item">
        <div className="card-header">
          <Title level={5} className="character-card-title">
            闪避无敌帧对比
          </Title>
        </div>
        <div className="card-body">
          <div style={{ 
            height: 400, 
            width: '100%',
            padding: '20px 0',
            minHeight: '400px',
            position: 'relative'
          }}>
            <Bar 
              data={frameData}
              xField="name"
              yField="value"
              theme={currentTheme}
              height={400}
              autoFit={true}
            />
          </div>
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
  // 直接使用导入的角色数据
  const characterData: CharacterData = characterStatesData[0] || {};

  // 获取所有属性名称
  const getAttributeNames = () => {
    const firstCharacter = Object.values(characterData)[0];
    return firstCharacter ? Object.keys(firstCharacter) : [];
  };

  // 获取所有角色名称
  const characterNames = Object.keys(characterData);

  // 选中的角色状态 - 默认选中追踪者和女爵
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(['追踪者', '守护者', '女爵']);
  
  // 当前主题状态
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(getCurrentTheme());
  
  // 强制重新渲染的key
  const [chartKey, setChartKey] = useState(0);
  
  // 动画状态
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 节流函数 - 用于防止频繁的图表刷新
  const throttle = (func: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let lastExecTime = 0;
    return (...args: any[]) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(null, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(null, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  };
  
  // 监听主题变化
  useEffect(() => {
    const checkTheme = () => {
      const newTheme = getCurrentTheme();
      if (newTheme !== currentTheme) {
        // 开始过渡动画
        setIsTransitioning(true);
        
        // 延迟更新主题，让动画有时间执行
        setTimeout(() => {
          setCurrentTheme(newTheme);
          setChartKey(prev => prev + 1);
          
          // 动画结束后恢复状态
          setTimeout(() => {
            setIsTransitioning(false);
          }, 300);
        }, 150);
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
      
      // 触发窗口resize事件，让图表重新计算尺寸
      window.dispatchEvent(new Event('resize'));
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
    
    // 监听窗口大小变化
    window.addEventListener('resize', throttledAdjustHeight);
    
    // 监听表格数据变化（通过selectedRowKeys变化触发）
    const timer = setTimeout(throttledAdjustHeight, 100);
    
    return () => {
      window.removeEventListener('resize', throttledAdjustHeight);
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
            <Text className={getValueClass(value)}>
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
    const result: Array<{ item: string; type: string; score: number }> = [];
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
          result.push({
            item: attr,
            type: character,
            score: gradeToPosition(characterData[character][attr])
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
          <div style={{ marginBottom: '10px', color: 'var(--color-text-2)', fontSize: '14px' }}>
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
              className={`radar-chart-container ${isTransitioning ? 'theme-transitioning' : ''}`}
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
                    },
                  }}
                  
                  // 数据点配置
                  point={{
                    size: 4,
                  }}
                  // 刻度配置
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
                  
                  // 图例配置
                  // legend={{
                  //   position: 'bottom',     // 图例在底部
                  //   layout: 'horizontal',   // 水平布局
                  //   itemSpacing: 16,        // 图例项间距
                  // }}
                  
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
                    className={`radar-wrapper ${isTransitioning ? 'theme-transitioning' : ''}`}
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
                  {/* 空状态提示文字 */}
                  <Empty 
                    description={
                      <Text>请从左侧表格中选择角色进行对比</Text>
                    } 
                    style={{ marginTop: -50 }}
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
          <div className="character-development-placeholder">
            <Text type="secondary" className="character-development-text">
              此功能正在开发中...
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDataView;