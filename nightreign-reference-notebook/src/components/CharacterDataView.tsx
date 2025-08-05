import React, { useState, useMemo } from 'react';
import { Typography, Table, Empty } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { Radar } from '@ant-design/plots';
import characterStatesData from '../data/zh-CN/character_states.json';
import '../styles/characterDataView.css';

const { Title, Text } = Typography;

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
            提示：可勾选其他角色进行对比
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
            
            {/* 雷达图容器 - 固定高度防止下移 */}
            <div style={{ flex: '1', minWidth: '400px', height: '500px' }}>
              {selectedRowKeys.length > 0 ? (
                <Radar
                  data={radarData}
                  xField="item"       // 用于X轴（雷达图的各个顶点）的字段
                  yField="score"      // 用于Y轴（数值）的字段
                  colorField="type"   // 用于区分不同角色的字段
                  height={450}        // 雷达图高度，与容器高度匹配
                  
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
                      // 核心：将数值刻度转换为等级符号
                      tick: {
                        formatter: (value: number) => {
                          // 直接映射数值到等级（1→D，2→C，...，5→S）
                          const levelMap: Record<number, string> = { 1: 'D', 2: 'C', 3: 'B', 4: 'A', 5: 'S' };
                          return levelMap[value] || ''; // 只显示有效等级，过滤0
                        }
                      },
                    },
                  }}
                  
                  // 数据点配置
                  point={{
                    size: 4,
                  }}
                  
                  // 刻度配置
                  scale={{ 
                    x: { padding: 0.5, align: 0 }, 
                    y: { 
                      tickCount: 5,          // Y轴刻度数量（对应5个等级）
                      domainMin: 0,          // 最小值
                      domainMax: 5           // 最大值（对应S等级）
                    }
                  }}
                  
                  // 线条样式
                  style={{
                    lineWidth: 2,
                  }}
                  
                  // 图例配置
                  legend={{
                    position: 'bottom',     // 图例在底部
                    layout: 'horizontal',   // 水平布局
                    itemSpacing: 16,        // 图例项间距
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
                // 空状态显示：显示带有提示信息的空雷达图框架
                <div style={{ height: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  {/* 绘制一个空的雷达图框架 */}
                  <Radar
                    data={radarAttributes.map(attr => ({
                      item: attr,
                      type: '',
                      score: 0
                    }))}
                    xField="item"
                    yField="score"
                    colorField="type"
                    height={350}
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

      {/* 其他未开发功能卡片 */}
      <div className="content-wrapper card-item">
        <div className="card-header">
          <Title level={5} className="character-card-title">
            闪避无敌帧对比
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