import React, { useEffect, useState } from 'react';
import { Typography, Timeline, Table, Alert, Steps, Progress, Statistic } from 'antd';
import { CheckCircleTwoTone, ClockCircleTwoTone, FireTwoTone, HeartTwoTone, LockOutlined, MoneyCollectTwoTone, PauseCircleTwoTone, ThunderboltTwoTone, CloudOutlined, PlayCircleTwoTone } from '@ant-design/icons';
import RecoveryCalculator from '../components/RecoveryCalculator';
import DataSourceTooltip from '../components/DataSourceTooltip';
import '../styles/gameMechanicsView.css';
import DataManager, { type MagicMove } from '../utils/dataManager';

const { Title, Text } = Typography;

interface GameMechanicsViewProps {
  functionName: string;
}

const CircleShrinkEffect: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  // 根据时间点计算圈的大小
  const getCircleSize = (step: number) => {
    switch (step) {
      case 0: return 100;
      case 1: return 60;
      case 2: return 60;  // 第一次缩圈结束
      case 3: return 20;  // 第二次缩圈开始
      case 4: return 20;  // 第二次缩圈结束
      case 5: return 20;
      default: return 100;
    }
  };

  const currentSize = getCircleSize(currentStep);

  const isShrinkingStart = (step: number) => {
    return step === 1 || step === 3;
  };

  const getShrinkPhase = (step: number) => {
    if (step === 1) return 'first';
    if (step === 3) return 'second';
    return 'none';
  };

  const isFirstShrinkPhase = (step: number) => {
    return step === 1 || step === 2;
  };

  const isFirstShrinkEnd = (step: number) => {
    return step === 2;
  };

  const isFirstShrinkCompleted = (step: number) => {
    return step >= 2;
  };

  const isSecondShrinkStart = (step: number) => {
    return step === 3;
  };

  const isSecondShrinkEnd = (step: number) => {
    return step === 4;
  };

  const getPreviousSize = (step: number) => {
    switch (step) {
      case 1: return 100;
      case 3: return 60;
      default: return currentSize;
    }
  };

  const shouldPulse = isShrinkingStart(currentStep);
  const previousSize = getPreviousSize(currentStep);
  const shrinkPhase = getShrinkPhase(currentStep);
  const isFirstShrink = isFirstShrinkPhase(currentStep);
  const isFirstShrinkEndPhase = isFirstShrinkEnd(currentStep);
  const isFirstShrinkCompletedPhase = isFirstShrinkCompleted(currentStep);
  const isSecondShrinkStartPhase = isSecondShrinkStart(currentStep);
  const isSecondShrinkEndPhase = isSecondShrinkEnd(currentStep);

  return (
    <div className="circle-shrink-container">
      <div className="circle-shrink-wrapper">
        {/* 外圈 - 固定大小 */}
        <div className={`circle-outer ${isFirstShrinkCompletedPhase ? 'circle-outer-faded' : ''} ${isSecondShrinkStartPhase ? 'circle-outer-second-shrink' : ''}`} />

        {/* 内圈 - 根据时间点动态变化 */}
        <div
          className={`circle-inner ${shouldPulse ? 'circle-pulse' : ''} ${shrinkPhase !== 'none' ? `shrink-${shrinkPhase}` : ''} ${isFirstShrink ? 'first-shrink-no-bg' : ''} ${isFirstShrinkEndPhase ? 'first-shrink-end-dark' : ''} ${isSecondShrinkStartPhase ? 'second-shrink-start-dark' : ''} ${isSecondShrinkEndPhase ? 'second-shrink-end-dark' : ''}`}
          style={{
            width: `${currentSize}%`,
            height: `${currentSize}%`,
            transition: 'all 0.8s ease-in-out'
          }}
        />

        {/* 脉冲效果圈 - 只在缩圈开始时显示 */}
        {shouldPulse && (
          <div
            className={`circle-pulse-ring ${isSecondShrinkStartPhase ? 'second-shrink-pulse' : ''}`}
            style={{
              width: `${previousSize}%`,
              height: `${previousSize}%`,
            }}
          />
        )}

        {/* 中心点 */}
        <div className="circle-center" />

      </div>

    </div>
  );
};

const GameMechanicsView: React.FC<GameMechanicsViewProps> = ({ functionName }) => {
  // 隐士出招表数据
  const [magicMoves, setMagicMoves] = useState<MagicMove[]>([]);
  // 时间轴状态
  const [day1TimelineStep, setDay1TimelineStep] = useState(0);

  // 获取当前时间点的时间和描述
  const getCurrentTimeInfo = (step: number) => {
    const timelineItems = [
      { time: '0:00', description: 'Day 1/ Day 2 开始' },
      { time: '4:30', description: '第一次缩圈开始' },
      { time: '7:30', description: '第一次缩圈结束' },
      { time: '11:00', description: '第二次缩圈开始' },
      { time: '14:30', description: '第二次缩圈结束' },
    ];

    if (step >= 0 && step < timelineItems.length) {
      return timelineItems[step];
    }
    return { time: '0:00', description: 'Day 1/ Day 2 开始' };
  };

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
            <div className="mechanic-card" id="game-time-mechanism">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    <ClockCircleTwoTone twoToneColor="blue" />
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
                          dot: <FireTwoTone twoToneColor="red" />,
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
            <div className="mechanic-card" id="runes-required">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    <MoneyCollectTwoTone twoToneColor="#faad14" />
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
                        <div className="tip-item">
                          3. 单人模式获得1.5倍卢恩 | 双人模式获得1.3倍卢恩 | 三人模式获得1倍卢恩
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

          {/* 可点击时间轴 */}
          <div className="mechanics-grid one-columns">
            <div className="mechanic-card" id="prison-rain-mechanism">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    <PlayCircleTwoTone twoToneColor="#722ed1" />
                    游戏时间机制: 监牢/夜雨
                  </Title>
                </div>
                <div className="card-body">
                  <div className="timeline-layout-container">
                    <div className="timeline-content-wrapper">
                      {/* 时间轴内容 */}
                      <div className="timeline-content">
                        {/* 时间轴 + 两栏布局 */}
                        <div className="timeline-with-steps">
                          {/* 左侧时间轴 */}
                          <div className="timeline-steps-container">
                            <Steps
                              size="small"
                              direction="vertical"
                              current={day1TimelineStep}
                              onChange={setDay1TimelineStep}
                              items={[
                                { title: '0:00', description: 'Day 1/ Day 2 开始' },
                                { title: '4:30', description: '第一次缩圈开始' },
                                { title: '7:30', description: '第一次缩圈结束' },
                                { title: '11:00', description: '第二次缩圈开始' },
                                { title: '14:30', description: '第二次缩圈结束' },
                              ]}
                            />
                          </div>

                          {/* 右侧内容区域 */}
                          {/* 两栏布局 */}
                          <div className="timeline-two-columns">
                            {/* 第一栏：缩圈效果图 */}
                            <div className="timeline-column">
                              <div className="timeline-column-content">
                                <CircleShrinkEffect currentStep={day1TimelineStep} />
                                <div style={{
                                  textAlign: 'center',
                                  marginTop: '12px',
                                  fontSize: '12px',
                                  color: '#666',
                                  fontWeight: 'normal'
                                }}>
                                  {getCurrentTimeInfo(day1TimelineStep).time} - {getCurrentTimeInfo(day1TimelineStep + 1).time} <br />
                                  {getCurrentTimeInfo(day1TimelineStep).description}
                                </div>
                              </div>
                            </div>

                            {/* 第二栏：封印监牢Boss + 雨中冒险伤害 */}
                            <div className="timeline-column">
                              <div className="timeline-column-content">
                                <div className="boss-info">
                                  <div className="boss-progress-container">
                                    <div className="boss-section-title">
                                      <LockOutlined />
                                      Day 1: 封印监牢Boss血量/角色减伤率
                                    </div>
                                    <div className="boss-progress-item">
                                      <div className="progress-label">Boss血量：</div>
                                      <Progress
                                        percent={day1TimelineStep <= 4 ? 55 : 100}
                                        strokeColor="#cf1322"
                                        format={(percent) => `${percent}%`}
                                      />
                                    </div>
                                    <div className="boss-progress-item">
                                      <div className="progress-label">角色减伤率：</div>
                                      <Progress
                                        percent={day1TimelineStep <= 4 ? 47 : 0}
                                        strokeColor="#3f8600"
                                        format={(percent) => `${percent}%`}
                                      />
                                    </div>
                                  </div>

                                  <div className="boss-progress-container">
                                    <div className="boss-section-title">
                                      <LockOutlined />
                                      Day 2: 封印监牢Boss血量/角色减伤率
                                    </div>
                                    <div className="boss-progress-item">
                                      <div className="progress-label">Boss血量：</div>
                                      <Progress
                                        percent={day1TimelineStep <= 1 ? 75 :
                                          day1TimelineStep <= 4 ? 100 : 0}
                                        strokeColor="#cf1322"
                                        format={(percent) => `${percent}%`}
                                      />
                                    </div>
                                    <div className="boss-progress-item">
                                      <div className="progress-label">角色减伤率：</div>
                                      <Progress
                                        percent={day1TimelineStep <= 1 ? 20 :
                                          day1TimelineStep <= 3 ? 0 : 0}
                                        strokeColor="#3f8600"
                                        format={(percent) => `${percent}%`}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="damage-info">
                                  <div className="boss-progress-container">
                                    <div className="boss-section-title">
                                      <CloudOutlined />
                                      夜雨伤害
                                    </div>
                                    <div className="damage-stat">
                                      <Statistic
                                        title="每秒受到的伤害"
                                        value={day1TimelineStep === 0 ? '夜雨尚未出现' :
                                          day1TimelineStep === 1 ? '当前角色血量 × 2% + 15' :
                                            day1TimelineStep === 2 ? '当前角色血量 × 2% + 15' :
                                              day1TimelineStep === 3 ? '当前角色血量 × 2% + 30' :
                                                day1TimelineStep === 4 ? '当前角色血量 × 2% + 30' : '当前角色血量 × 2% + 30'}
                                        valueStyle={{
                                          color: day1TimelineStep === 0 ? '#666' : '#1890ff',
                                          fontSize: '20px',
                                        }}
                                      />
                                    </div>
                                    <div className="damage-stat" style={{ marginTop: '8px' }}>
                                      <Text type="secondary" style={{ fontSize: '14px', color: '#666' }}>
                                        超时秒杀机制：110秒后，伤害变为10%+30/0.5s，120秒后直接秒杀
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mechanics-grid">
            <div className="mechanic-card" id="recovery-calculator">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    <HeartTwoTone twoToneColor="#eb2f96" />
                    回血量计算器
                    <DataSourceTooltip
                      links={[{
                        text: "【黑夜君临】圣杯瓶恢复、缓回、群回机制解析及常见误区",
                        url: "https://www.bilibili.com/video/BV1M18jzQE9X"
                      }]}
                    />
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
            <div className="mechanic-card" id="hermit-magic-list">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
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