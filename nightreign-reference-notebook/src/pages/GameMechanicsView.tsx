import React, { useState } from 'react';
import { Typography, Timeline, Table, Alert, Steps, Progress, Statistic } from 'antd';
import { CheckCircleTwoTone, ClockCircleTwoTone, FireTwoTone, HeartTwoTone, LockOutlined, MoneyCollectTwoTone, PauseCircleTwoTone, ThunderboltTwoTone, CloudOutlined, PlayCircleTwoTone, MessageOutlined, TrophyTwoTone } from '@ant-design/icons';
import RecoveryCalculator from '../components/RecoveryCalculator';
import DataSourceTooltip from '../components/DataSourceTooltip';
import GiscusComments from '../components/GiscusComments';
import '../styles/gameMechanicsView.css';

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



  if (functionName === '游戏机制') {
    return (
      <>
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
                                        Day 1: 封印监牢Boss血量/攻击力
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
                                        <div className="progress-label">Boss攻击力：</div>
                                        <Progress
                                          percent={day1TimelineStep <= 4 ? 53 : 0}
                                          strokeColor="#3f8600"
                                          format={(percent) => `${percent}%`}
                                        />
                                      </div>
                                    </div>

                                    <div className="boss-progress-container">
                                      <div className="boss-section-title">
                                        <LockOutlined />
                                        Day 2: 封印监牢Boss血量/攻击力
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
                                        <div className="progress-label">Boss攻击力：</div>
                                        <Progress
                                          percent={day1TimelineStep <= 1 ? 80 :
                                            day1TimelineStep <= 3 ? 100 : 100}
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
                                        夜雨伤害（当前数据为9.10更新前版本，更新后夜雨伤害增加，具体数据待更新）
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

            {/* 评分系统板块 */}
            <div className="mechanics-grid">
              <div className="mechanic-card" id="deep-night-rating-rules">
                <div className="card-content">
                  <div className="card-title-section">
                    <Title level={5} className="mechanic-card-title">
                      <TrophyTwoTone twoToneColor="#faad14" />
                      深夜模式评分规则
                    </Title>
                  </div>
                  <div className="card-body">
                    <div className="rating-system-content">
                      <div className="rating-table-section">
                        <Title level={5} style={{ marginBottom: '16px', fontSize: '16px' }}>评分规则</Title>
                        <Table
                          dataSource={[
                            { key: '1', depthLevel: '深度一 (0-999)', firstDayLoss: '-0', secondDayLoss: '-0', finalDayLoss: '-0', victory: '+200' },
                            { key: '2', depthLevel: '深度二 (1000-1999)', firstDayLoss: '-200', secondDayLoss: '-100', finalDayLoss: '-0', victory: '+200' },
                            { key: '3', depthLevel: '深度三 (2000-3999)', firstDayLoss: '-400', secondDayLoss: '-300', finalDayLoss: '-200', victory: '+200' },
                            { key: '4', depthLevel: '深度四 (4000-5999)', firstDayLoss: '-600', secondDayLoss: '-500', finalDayLoss: '-400', victory: '+200' },
                            { key: '5', depthLevel: '深度五 (6000+)', firstDayLoss: '-800', secondDayLoss: '-700', finalDayLoss: '-600', victory: '+200' },
                          ]}
                          columns={[
                            {
                              title: '深度等级',
                              dataIndex: 'depthLevel',
                              key: 'depthLevel',
                              width: '20%',
                              align: 'left',
                            },
                            {
                              title: 'Day 1 失败',
                              dataIndex: 'firstDayLoss',
                              key: 'firstDayLoss',
                              width: '20%',
                              align: 'center',
                              render: (text) => (
                                <span style={{ color: text.startsWith('+') ? '#52c41a'  : '#1890ff' }}>
                                  {text}
                                </span>
                              )
                            },
                            {
                              title: 'Day 2 失败',
                              dataIndex: 'secondDayLoss',
                              key: 'secondDayLoss',
                              width: '20%',
                              align: 'center',
                              render: (text) => (
                                <span style={{ color: text.startsWith('+') ? '#52c41a'  : '#1890ff' }}>
                                  {text}
                                </span>
                              )
                            },
                            {
                              title: 'Day 3 失败',
                              dataIndex: 'finalDayLoss',
                              key: 'finalDayLoss',
                              width: '20%',
                              align: 'center',
                              render: (text) => (
                                <span style={{ color: text.startsWith('+') ? '#52c41a'  : '#1890ff' }}>
                                  {text}
                                </span>
                              )
                            },
                            {
                              title: '胜利',
                              dataIndex: 'victory',
                              key: 'victory',
                              width: '20%',
                              align: 'center',
                              render: (text) => (
                                <span style={{ color: text.startsWith('+') ? '#52c41a' : '#1890ff' }}>
                                  {text}
                                </span>
                              )
                            },
                          ]}
                          pagination={false}
                          size="small"
                          bordered
                        />
                      </div>

                      {/* 条件修正表 */}
                      <div className="rating-table-section" style={{ marginTop: '24px' }}>
                        <Title level={5} style={{ marginBottom: '16px', fontSize: '16px' }}>评分修正</Title>
                        <Table
                          dataSource={[
                            {
                              key: '1',
                              condition: '隐藏地图',
                              lossModifier: '+200',
                              winModifier: '+100',
                              description: '随机位置在地图上不可见【仅限等级3+】'
                            },
                            {
                              key: '2',
                              condition: '隐藏夜王',
                              lossModifier: '+200',
                              winModifier: '+100',
                              description: '夜王身份在进Boss房前隐藏【仅限等级3+】'
                            },
                            {
                              key: '3',
                              condition: '其他玩家提前退出',
                              lossModifier: '50%',
                              winModifier: '无',
                              description: '其他玩家提前退出时，惩罚减半'
                            },
                            {
                              key: '4',
                              condition: '自己提前退出',
                              lossModifier: '无',
                              winModifier: '无',
                              description: '无论输赢，都会在未来的游戏中结算惩罚（按照退出时间点判负）'
                            },
                            {
                              key: '5',
                              condition: '高1级匹配',
                              lossModifier: '+50',
                              winModifier: '+50',
                              description: '对局深度比自己深度多1级时，结算时额外+50'
                            },
                            {
                              key: '6',
                              condition: '低1级匹配',
                              lossModifier: '-50',
                              winModifier: '-50',
                              description: '对局深度比自己深度少1级时，结算时额外-50'
                            },
                          ]}
                          columns={[
                            {
                              title: '条件',
                              dataIndex: 'condition',
                              key: 'condition',
                              width: '20%',
                              align: 'left',
                            },
                            {
                              title: '失败时修正',
                              dataIndex: 'lossModifier',
                              key: 'lossModifier',
                              width: '15%',
                              align: 'center',
                              render: (text) => (
                                <span style={{ 
                                  color: text.startsWith('+') ? '#52c41a' : '#1890ff'
                                }}>
                                  {text}
                                </span>
                              )
                            },
                            {
                              title: '胜利时修正',
                              dataIndex: 'winModifier',
                              key: 'winModifier',
                              width: '15%',
                              align: 'center',
                              render: (text) => (
                                <span style={{ 
                                  color: text.startsWith('+') ? '#52c41a' : '#1890ff'
                                }}>
                                  {text}
                                </span>
                              )
                            },
                            {
                              title: '描述',
                              dataIndex: 'description',
                              key: 'description',
                              width: '50%',
                              align: 'left',
                            },
                          ]}
                          pagination={false}
                          size="small"
                          bordered
                        />
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

            {/* 评论与讨论 */}
            <div className="mechanics-grid">
              <div className="mechanic-card" id="comments-discussion">
                <div className="card-content">
                  <div className="card-title-section">
                    <Title level={5} className="mechanic-card-title">
                      <MessageOutlined />
                      评论与讨论(需登录github帐号)
                    </Title>
                  </div>
                  <div className="card-body">
                    <GiscusComments />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </>
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