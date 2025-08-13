import React, { useEffect, useState } from 'react';
import { Typography, Timeline, Table, Alert } from 'antd';
import { CheckCircleTwoTone, ClockCircleOutlined, ClockCircleTwoTone, FireTwoTone, HeartTwoTone, MoneyCollectOutlined, PauseCircleTwoTone, ThunderboltTwoTone } from '@ant-design/icons';
import RecoveryCalculator from '../components/RecoveryCalculator';
import '../styles/gameMechanicsView.css';
import DataManager, { type MagicMove } from '../utils/dataManager';

const { Title, Text } = Typography;

interface GameMechanicsViewProps {
  functionName: string;
}

const GameMechanicsView: React.FC<GameMechanicsViewProps> = ({ functionName }) => {
  // 隐士出招表数据
  const [magicMoves, setMagicMoves] = useState<MagicMove[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dataManager = DataManager.getInstance();
        await dataManager.waitForData();
        setMagicMoves(dataManager.getMagicMoveList());
      } catch (error) {
        // no-op; GameMechanicsView 其他区域仍可渲染
        console.error('Failed to load magic moves:', error);
      }
    };
    loadData();
  }, []);

  const magicMoveColumns = [
    { title: '属性痕', dataIndex: '属性痕', key: '属性痕', width: '12%', align: 'center' as const },
    { title: '属性图标', dataIndex: '属性图标', key: '属性图标', width: '12%', align: 'center' as const },
    { title: '混合魔法', dataIndex: '混合魔法', key: '混合魔法', width: '12%', align: 'center' as const },
    { title: '总伤害', dataIndex: '总伤害', key: '总伤害', width: '9%', align: 'center' as const },
    { title: '持续时间', dataIndex: '持续时间', key: '持续时间', width: '9%', align: 'center' as const },
    {
      title: '混合魔法效果',
      dataIndex: '混合魔法效果',
      key: '混合魔法效果',
      ellipsis: false,
      align: 'left' as const,
      render: (text: string) => (
        <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', textAlign: 'left', lineHeight: '1.5', padding: '4px 0' }}>
          {text}
        </div>
      ),
    },
  ];

  if (functionName === '游戏机制') {
    return (
      <div className="game-mechanics-container" style={{ '--mechanics-container-width': '1400px' } as React.CSSProperties}>
        <div className="mechanics-layout">
          
          {/* 游戏时间机制 - 自定义宽度比例 2:1 */}
          <div className="mechanics-grid custom-columns" style={{ '--mechanics-grid-columns': '1.2fr 2fr' } as React.CSSProperties}>
            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    <ClockCircleOutlined />
                    游戏时间机制
                  </Title>
                </div>
                <div className="card-body">
                  <div className="mechanic-timeline">
                    <Timeline
                      mode="left"
                      items={[
                        {
                          dot: <PauseCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '16px' }} />,  
                          children: 'Day 1 / Day 2 开始',
                          color: 'green',
                          label: '0:00',
                        },
                        {
                          dot: <ThunderboltTwoTone />,
                          children: '4.5 min',
                        },
                        {
                          dot: <ClockCircleTwoTone />,
                          children: '第一次缩圈开始',
                          label: '4:30',
                        },
                        {
                          dot: <ThunderboltTwoTone />,
                          children: '3 min',
                        },
                        {
                          dot: <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '16px' }} />,
                          children: '第一次缩圈结束',
                          label: '7:30',
                        },
                        {
                          dot: <ThunderboltTwoTone />,
                          children: '3.5 min',
                        },
                        {
                          dot: <ClockCircleTwoTone />,
                          children: '第二次缩圈开始',
                          label: '11:00',
                        },
                        {
                          dot: <ThunderboltTwoTone />,
                          children: '3 min',
                        },
                        {
                          dot: <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: '16px' }} />,
                          children: '第二次缩圈结束',
                          label: '14:00',
                        },
                        {
                          dot: <FireTwoTone twoToneColor="red"/>,
                          children: '战斗!',
                        },
                        {
                          dot: <HeartTwoTone twoToneColor="#eb2f96" />,
                          children: 'Day 2 开始 / 最终Boss战',
                          color: 'green',
                          label: '0:00',
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧小卡片 - 升级所需卢恩 */}
            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                  <MoneyCollectOutlined />
                    升级所需卢恩
                  </Title>
                </div>
                <div className="card-body">
                  <div className="runes-table-container">
                    {/* 第一栏 - 1-8级 */}
                    <div className="runes-column">
                      <Table
                        dataSource={[
                          { key: '1', level: '1', runes: '0', totalCost: '-' },
                          { key: '2', level: '2', runes: '3,698', totalCost: '3,698' },
                          { key: '3', level: '3', runes: '7,922', totalCost: '11,620' },
                          { key: '4', level: '4', runes: '12,348', totalCost: '23,968' },
                          { key: '5', level: '5', runes: '16,978', totalCost: '40,946' },
                          { key: '6', level: '6', runes: '21,818', totalCost: '62,764' },
                          { key: '7', level: '7', runes: '26,869', totalCost: '89,633' },
                          { key: '8', level: '8', runes: '32,137', totalCost: '121,770' },
                        ]}
                        columns={[
                          {
                            title: '等级',
                            dataIndex: 'level',
                            key: 'level',
                            width: '33%',
                          },
                          {
                            title: '所需卢恩',
                            dataIndex: 'runes',
                            key: 'runes',
                            width: '33%',
                            render: (text) => (
                              <span style={{ color: '#1890ff' }}>
                                {text}
                              </span>
                            )
                          },
                          {
                            title: '总成本',
                            dataIndex: 'totalCost',
                            key: 'totalCost',
                            width: '34%',
                          }
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                        style={{ marginTop: '8px' }}
                      />
                    </div>

                    {/* 第二栏 - 9-15级 */}
                    <div className="runes-column">
                      <Table
                        dataSource={[
                          { key: '9', level: '9', runes: '37,624', totalCost: '159,394' },
                          { key: '10', level: '10', runes: '43,335', totalCost: '202,729' },
                          { key: '11', level: '11', runes: '49,271', totalCost: '252,000' },
                          { key: '12', level: '12', runes: '55,439', totalCost: '307,439' },
                          { key: '13', level: '13', runes: '61,840', totalCost: '369,279' },
                          { key: '14', level: '14', runes: '68,479', totalCost: '437,758' },
                          { key: '15', level: '15', runes: '75,358', totalCost: '513,116' },
                          { key: 'total', level: '总计', runes: '513,336', totalCost: '-' },
                        ]}
                        columns={[
                          {
                            title: '等级',
                            dataIndex: 'level',
                            key: 'level',
                            width: '33%',
                          },
                          {
                            title: '所需卢恩',
                            dataIndex: 'runes',
                            key: 'runes',
                            width: '33%',
                            render: (text) => (
                              <span style={{ 
                                color: '#1890ff'
                              }}>
                                {text}
                              </span>
                            )
                          },
                          {
                            title: '总成本',
                            dataIndex: 'totalCost',
                            key: 'totalCost',
                            width: '34%',

                          }
                        ]}
                        pagination={false}
                        size="small"
                        bordered
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                  </div>
                  
                  {/* 升级所需卢恩注释信息 */}
                  <Alert
                    // 加一个title：小提示
                    description={
                      <div className="dodge-frames-tips">
                        <div className="tip-item">
                          1. 角色 3 级可使用<strong style={{ color: '#0360b8' }}>蓝色武器</strong>，
                          7 级可使用<strong style={{ color: '#722ed1' }}>紫色武器</strong>，
                          10 级可使用<strong style={{ color: '#faad14' }}>金色武器</strong>。
                        </div>
                        <div className="tip-item">
                        2. 如果当前卢恩足够升级，左上角显示等级的数字左边会出现一个白色箭头(局内)。
                        </div>
                      </div>
                    }
                    type="info"
                    showIcon={false}
                    style={{ marginTop: '15px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mechanics-grid">
            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    <HeartTwoTone twoToneColor="#eb2f96" />
                    回血量计算器
                  </Title>
                </div>
                  <div className="card-body">
                  <RecoveryCalculator />
                 </div>
              </div>
            </div>
          </div>

          {/* 隐士出招表 */}
          <div className="mechanics-grid">
            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    <ThunderboltTwoTone />
                    隐士出招表
                  </Title>
                </div>
                <div className="card-body">
                  <Table
                    dataSource={magicMoves}
                    columns={magicMoveColumns}
                    pagination={false}
                    size="small"
                    bordered
                    rowKey={(record) => (record as MagicMove).属性痕}
                    scroll={{ x: '100%' }}
                    style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                    footer={() => (
                      <div className="footer-text">备注：总伤害为角色 15 级时测试数据</div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 其他功能保持原有的简单显示
  return (
    <div className="mechanics-development-placeholder">
      <Title level={3} className="mechanics-development-title">{functionName}</Title>
      <Text className="mechanics-development-text">此功能正在开发中...</Text>
    </div>
  );
};

export default GameMechanicsView; 