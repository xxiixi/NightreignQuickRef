import { Typography, Timeline, Table, Alert } from 'antd';
import { CheckCircleTwoTone, ClockCircleOutlined, ClockCircleTwoTone, FireTwoTone, HeartTwoTone, MoneyCollectOutlined, PauseCircleTwoTone, SafetyOutlined, ThunderboltOutlined, ThunderboltTwoTone } from '@ant-design/icons';
import '../styles/gameMechanicsView.css';

const { Title, Text } = Typography;

interface GameMechanicsViewProps {
  functionName: string;
}

/**
 * 2. 自定义列宽配置：
 *    - 使用 custom-columns 类名
 *    - 通过 --mechanics-grid-columns 变量设置
 *    - 示例：'2fr 1fr' (左侧占2份，右侧占1份)
 *    - 示例：'60% 40%' (左侧60%，右侧40%)
 *    - 示例：'1fr 1fr 1fr' (三等分)
 * 
 */
const GameMechanicsView: React.FC<GameMechanicsViewProps> = ({ functionName }) => {

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
                          children: 'Day 1 开始',
                          color: 'green',
                          label: '0:00',
                        },
                        {
                          dot: <ThunderboltTwoTone />,
                          children: '4 min',
                        },
                        {
                          dot: <ClockCircleTwoTone />,
                          children: '第一次缩圈开始',
                          label: '4:30',
                        },
                        {
                          dot: <ThunderboltTwoTone />,
                          children: '3.5 min',
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
                          children: 'Day 2 开始',
                          color: 'green',
                          label: '0:00',
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧小卡片 */}
            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    战斗机制
                  </Title>
                </div>
                <div className="card-body">
                  <div className="mechanic-content">
                    <h4>基础战斗</h4>
                    <p>近战攻击：基础伤害</p>
                    <p>远程攻击：魔法伤害</p>
                    <p>闪避：无敌帧保护</p>
                    
                    <h4>特殊机制</h4>
                    <p>连击系统：提升伤害</p>
                    <p>暴击机制：随机触发</p>
                    <p>元素克制：相性加成</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 第二行 - 升级所需卢恩 - 横向展示，5级一列 */}
          <div className="mechanics-grid single-column">
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
                    {/* 第一栏 - 1-5级 */}
                    <div className="runes-column">
                      <Table
                        dataSource={[
                          { key: '1', level: '1', runes: '--' },
                          { key: '2', level: '2', runes: '3,698' },
                          { key: '3', level: '3', runes: '7,922' },
                          { key: '4', level: '4', runes: '12,348' },
                          { key: '5', level: '5', runes: '16,978' },
                        ]}
                        columns={[
                          {
                            title: '等级',
                            dataIndex: 'level',
                            key: 'level',
                            width: '50%',
                          },
                          {
                            title: '所需卢恩',
                            dataIndex: 'runes',
                            key: 'runes',
                            width: '50%',
                            render: (text) => (
                              <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                                {text}
                              </span>
                            )
                          }
                        ]}
                        pagination={false}
                        size="small"
                        style={{ marginTop: '8px' }}
                      />
                    </div>

                    {/* 第二栏 - 6-10级 */}
                    <div className="runes-column">
                      <Table
                        dataSource={[
                          { key: '6', level: '6', runes: '21,818' },
                          { key: '7', level: '7', runes: '26,869' },
                          { key: '8', level: '8', runes: '32,137' },
                          { key: '9', level: '9', runes: '37,624' },
                          { key: '10', level: '10', runes: '43,335' },
                        ]}
                        columns={[
                          {
                            title: '等级',
                            dataIndex: 'level',
                            key: 'level',
                            width: '50%',
                          },
                          {
                            title: '所需卢恩',
                            dataIndex: 'runes',
                            key: 'runes',
                            width: '50%',
                            render: (text) => (
                              <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
                                {text}
                              </span>
                            )
                          }
                        ]}
                        pagination={false}
                        size="small"
                        style={{ marginTop: '8px' }}
                      />
                    </div>

                    <div className="runes-column">
                      <Table
                        dataSource={[
                          { key: '11', level: '11', runes: '49,271' },
                          { key: '12', level: '12', runes: '55,439' },
                          { key: '13', level: '13', runes: '61,840' },
                          { key: '14', level: '14', runes: '68,479' },
                          { key: '15', level: '15', runes: '75,358' },
                        ]}
                        columns={[
                          {
                            title: '等级',
                            dataIndex: 'level',
                            key: 'level',
                            width: '50%',
                            render: (text, record) => (
                              <span style={{ 
                                fontWeight: record.key === 'total' ? 'bold' : 'normal',
                                color: record.key === 'total' ? '#1890ff' : 'inherit'
                              }}>
                                {text}
                              </span>
                            )
                          },
                          {
                            title: '所需卢恩',
                            dataIndex: 'runes',
                            key: 'runes',
                            width: '50%',
                            render: (text) => (
                              <span style={{ 
                                fontWeight: 'bold',
                                color: '#1890ff'
                              }}>
                                {text}
                              </span>
                            )
                          }
                        ]}
                        pagination={false}
                        size="small"
                        style={{ marginTop: '8px' }}
                      />
                    </div>
                  </div>
                </div>
                                                                     {/* 升级所需卢恩注释信息 */}
                   <Alert
                     description={
                       <div className="dodge-frames-tips">
                         <div className="tip-item">
                           角色升至15级总共需要卢恩：<strong style={{ color: '#1890ff' }}>513,336</strong>
                         </div>
                         <div className="tip-item">
                           角色3级可使用<strong style={{ color: '#0360b8' }}>蓝色武器</strong>，
                           7级可使用<strong style={{ color: '#722ed1' }}>紫色武器</strong>，
                           10级可使用<strong style={{ color: '#faad14' }}>金色武器</strong>。
                         </div>
                       </div>
                     }
                     type="info"
                     showIcon={false}
                     style={{ marginTop: '10px' }}
                   />
                </div>
            </div>
          </div>

          {/* 第三行 - 防御机制 - 使用百分比宽度 */}
          <div className="mechanics-grid custom-columns" style={{ '--mechanics-grid-columns': '60% 40%' } as React.CSSProperties}>
            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    <SafetyOutlined />
                    防御机制
                  </Title>
                </div>
                <div className="card-body">
                  <div className="mechanic-content">
                    <h4>护盾系统</h4>
                    <p>物理护盾：抵挡物理伤害</p>
                    <p>魔法护盾：抵挡魔法伤害</p>
                    <p>护盾恢复：时间自动恢复</p>
                    
                    <h4>闪避机制</h4>
                    <p>完美闪避：无伤躲避</p>
                    <p>无敌帧：短暂无敌时间</p>
                    <p>闪避冷却：技能冷却时间</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    <ThunderboltOutlined />
                    技能系统
                  </Title>
                </div>
                <div className="card-body">
                  <div className="mechanic-content">
                    <h4>主动技能</h4>
                    <p>攻击技能：造成伤害</p>
                    <p>辅助技能：增益效果</p>
                    <p>控制技能：限制敌人</p>
                    
                    <h4>被动技能</h4>
                    <p>属性加成：永久提升</p>
                    <p>特殊效果：触发条件</p>
                    <p>技能组合：协同效果</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 第三行 - 其他机制 - 三等分布局 */}
          <div className="mechanics-grid custom-columns" style={{ '--mechanics-grid-columns': '1fr 1fr 1fr' } as React.CSSProperties}>
            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    装备系统
                  </Title>
                </div>
                <div className="card-body">
                  <div className="mechanic-content">
                    <h4>装备类型</h4>
                    <p>武器：攻击力提升</p>
                    <p>防具：防御力提升</p>
                    <p>饰品：特殊效果</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    等级系统
                  </Title>
                </div>
                <div className="card-body">
                  <div className="mechanic-content">
                    <h4>角色成长</h4>
                    <p>经验获取：击败敌人</p>
                    <p>等级提升：属性增强</p>
                    <p>技能解锁：新技能获得</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    道具系统
                  </Title>
                </div>
                <div className="card-body">
                  <div className="mechanic-content">
                    <h4>道具类型</h4>
                    <p>恢复道具：生命恢复</p>
                    <p>增益道具：临时强化</p>
                    <p>特殊道具：独特效果</p>
                  </div>
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