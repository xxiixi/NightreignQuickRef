import { Typography, Timeline } from 'antd';
import { CheckCircleTwoTone, ClockCircleOutlined, ClockCircleTwoTone, FireTwoTone, HeartTwoTone, PauseCircleTwoTone, SafetyOutlined, ThunderboltOutlined, ThunderboltTwoTone } from '@ant-design/icons';
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
                    升级所需卢恩
                  </Title>
                </div>
                <div className="card-body">
                  <div className="rune-table-container">
                    <div className="rune-grid">
                      {/* 第一列：等级1-5 */}
                      <div className="rune-column">
                        <div className="rune-column-header">等级 1-5</div>
                        <div className="rune-row">
                          <span className="rune-level">1</span>
                          <span className="rune-amount">--</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">2</span>
                          <span className="rune-amount">3,698</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">3</span>
                          <span className="rune-amount">7,922</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">4</span>
                          <span className="rune-amount">12,348</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">5</span>
                          <span className="rune-amount">16,978</span>
                        </div>
                      </div>

                      {/* 第二列：等级6-10 */}
                      <div className="rune-column">
                        <div className="rune-column-header">等级 6-10</div>
                        <div className="rune-row">
                          <span className="rune-level">6</span>
                          <span className="rune-amount">21,818</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">7</span>
                          <span className="rune-amount">26,869</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">8</span>
                          <span className="rune-amount">32,137</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">9</span>
                          <span className="rune-amount">37,624</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">10</span>
                          <span className="rune-amount">43,335</span>
                        </div>
                      </div>

                      {/* 第三列：等级11-15 */}
                      <div className="rune-column">
                        <div className="rune-column-header">等级 11-15</div>
                        <div className="rune-row">
                          <span className="rune-level">11</span>
                          <span className="rune-amount">49,271</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">12</span>
                          <span className="rune-amount">55,439</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">13</span>
                          <span className="rune-amount">61,840</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">14</span>
                          <span className="rune-amount">68,479</span>
                        </div>
                        <div className="rune-row">
                          <span className="rune-level">15</span>
                          <span className="rune-amount">75,358</span>
                        </div>
                      </div>
                    </div>
                    <div className="rune-total">
                      <div className="weapon-level-note">
                        3级可使用蓝色武器; 7级可使用紫色武器; 10级可使用金色武器
                      </div>
                      <div className="rune-total-info">
                        <span className="rune-total-label">| 总计</span>
                        <span className="rune-total-amount">513,336</span>
                      </div>
                    </div>
                  </div>
                </div>
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