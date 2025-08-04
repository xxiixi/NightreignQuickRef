import React from 'react';
import { Table, Carousel, Steps } from 'antd';
import type { TableColumnsType } from 'antd';
import weaponCharacterData from '../data/zh-CN/weapon_character.json';
import weaponEffectData from '../data/zh-CN/weapon_effect.json';
import './LegendaryWeaponView.css'; // 导入样式表

// 传说武器数据结构
interface WeaponCharacter {
  [weaponName: string]: {
    [characterName: string]: number;
  };
}

// 武器特效数据结构
interface WeaponEffect {
  [weaponName: string]: {
    类型: string;
    特效: string;
    描述: string;
    削韧: string;
  };
}

// 角色列表
const characterNames = ['追踪者', '守护者', '铁之眼', '女爵', '无赖', '复仇者', '隐士', '执行者'];

// 转换数据格式
const transformData = (rawData: WeaponCharacter[]) => {
  const weapons = rawData[0]; // 获取第一个对象
  return Object.entries(weapons).map(([weaponName, characterData], index) => ({
    weapon_id: `LW${String(index + 1).padStart(3, '0')}`,
    weapon_name: weaponName,
    ...characterData
  }));
};

// 转换武器特效数据格式
const transformEffectData = (rawData: WeaponEffect[]) => {
  const weapons = rawData[0]; // 获取第一个对象
  return Object.entries(weapons).map(([weaponName, effectData], index) => ({
    weapon_id: `LW${String(index + 1).padStart(3, '0')}`,
    weapon_name: weaponName,
    ...effectData
  }));
};

// 根据行内数值范围获取对应的背景颜色
const getBackgroundColor = (value: number, rowValues: number[]): string => {
  const max = Math.max(...rowValues);
  const min = Math.min(...rowValues);
  const range = max - min;
  
  if (range === 0) return 'var(--geekblue-3)'; // 如果所有值相同，使用中间蓝色
  
  // 计算当前值在行内范围内的位置 (0-1)
  const normalizedValue = (value - min) / range;
  
  // 检查是否为黑暗模式
  const isDarkMode = document.body.getAttribute('tomato-theme') === 'dark';
  
  // 将0-1范围映射到颜色等级
  if (normalizedValue < 0.4) {
    return isDarkMode ? 'rgba(47, 84, 235, 0.1)' : 'var(--geekblue-1)';
  }
  if (normalizedValue < 0.8) {
    return isDarkMode ? 'rgba(47, 84, 235, 0.2)' : 'var(--geekblue-2)';
  }
  return isDarkMode ? 'rgba(47, 84, 235, 0.3)' : 'var(--geekblue-3)';
};

const LegendaryWeaponView: React.FC = () => {
  // 添加状态管理当前步骤
  const [currentStep, setCurrentStep] = React.useState(0);
  // 添加ref来控制Carousel
  const carouselRef = React.useRef<any>(null);

  // 转换数据
  const weaponData = transformData(weaponCharacterData as WeaponCharacter[]);
  const effectData = transformEffectData(weaponEffectData as WeaponEffect[]);

  // 表格列定义
  const columns: TableColumnsType<any> = [
    {
      title: '武器名称',
      dataIndex: 'weapon_name',
      key: 'weapon_name',
      width: 120,
      fixed: 'left',
             render: (text) => <span style={{ textAlign: 'center' }}>{text}</span>,
    },
    ...characterNames.map(characterName => ({
      title: characterName,
      dataIndex: characterName,
      key: characterName,
      width: 70,
      align: 'center' as const,
      render: (value: number, record: any) => {
        // 获取当前行的所有值用于比较
        const rowValues = characterNames.map(name => record[name]);
        return (
                     <div 
             className="heatmap-cell" // 添加自定义类名
                                          style={{ 
                 backgroundColor: getBackgroundColor(value, rowValues),
                 color: 'var(--ant-color-text)', // 使用主题文字颜色
                 width: '90%',
                 height: '80%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 borderRadius: '6px', // 恢复圆角
                 padding: '6px 4px', // 调整内边距
                 fontSize: '14px',
                 margin: '0 auto' // 居中显示
               }}
           >
             {value}
           </div>
        );
      },
    }))
  ];

  // 武器特效表格列定义
  const effectColumns: TableColumnsType<any> = [
    {
      title: '武器名称',
      dataIndex: 'weapon_name',
      key: 'weapon_name',
      width: 120,
      align: 'center' as const,
      render: (text) => <span style={{ textAlign: 'center' }}>{text}</span>,
    },
    {
      title: '类型',
      dataIndex: '类型',
      key: '类型',
      width: 80,
      align: 'center' as const,
    },
    {
      title: '特效',
      dataIndex: '特效',
      key: '特效',
      width: 120,
      align: 'center' as const,
    },
    {
      title: '描述',
      dataIndex: '描述',
      key: '描述',
      width: 300,
    },
    {
      title: '削韧',
      dataIndex: '削韧',
      key: '削韧',
      width: 150,
      align: 'center' as const,
    }
  ];

  // 第一个表格内容
  const firstTable = (
    <div style={{ padding: '16px' }}>
      <Table
        className="heatmap-table" // 添加表格类名
        columns={columns}
        dataSource={weaponData}
        rowKey="weapon_id"
        pagination={false}
        size="small"
        bordered
      />
    </div>
  );

  // 第二个表格内容（武器特效）
  const secondTable = (
    <div style={{ padding: '16px' }}>
      <Table
        columns={effectColumns}
        dataSource={effectData}
        rowKey="weapon_id"
        pagination={false}
        size="small"
        bordered
        scroll={{ x: 800 }}
      />
    </div>
  );

  // 自定义步骤条
  const customSteps = (
    <div className="custom-steps-container">
      <Steps
        size="small"
        current={currentStep}
        onChange={(current) => {
          setCurrentStep(current);
          carouselRef.current?.goTo(current);
        }}
        items={[
          { title: '全角色传说武器面板' },
          { title: '传说武器庇佑效果' }
        ]}
      />
    </div>
  );

  return (
    <div style={{ padding: '16px' }}>
      {customSteps}
      <Carousel 
        ref={carouselRef}
        arrows 
        infinite={false}
        dots={false}
        beforeChange={(from, to) => setCurrentStep(to)}
      >
        <div>
          {firstTable}
        </div>
        <div>
          {secondTable}
        </div>
      </Carousel>
    </div>
  );
};

export default LegendaryWeaponView;
    