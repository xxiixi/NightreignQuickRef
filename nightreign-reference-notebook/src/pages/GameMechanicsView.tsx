import { Typography, Timeline, Table, Alert, Empty, Select, Button, Card, Divider, Tag } from 'antd';
import { CheckCircleTwoTone, ClockCircleOutlined, ClockCircleTwoTone, FireTwoTone, HeartTwoTone, MoneyCollectOutlined, PauseCircleTwoTone, ThunderboltTwoTone, ExclamationCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { useState } from 'react';
import recoverCalculateData from '../data/zh-CN/recover_calculate.json';
import '../styles/gameMechanicsView.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface GameMechanicsViewProps {
  functionName: string;
}

const GameMechanicsView: React.FC<GameMechanicsViewProps> = ({ functionName }) => {
  // 获取category对应的颜色
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case '基础值':
        return 'red';
      case '局内词条(可叠加)':
        return 'green';
      case '局外词条(不可叠加)':
        return 'pink';
      case '局内buff':
        return 'purple';
      default:
        return 'orange';
    }
  };

  // 回血量计算器状态
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]); // 不再默认选中红露滴圣杯瓶
  const [calculationResult, setCalculationResult] = useState<{
    selfHealth: number;
    selfFocus: number;
    allyHealth: number;
    allyFocus: number;
    selfHealthPercent: string;
    selfFocusPercent: string;
    allyHealthPercent: string;
    allyFocusPercent: string;
    steps?: string[];
  } | null>(null);

  // 回血效果数据
  const recoverEffects = recoverCalculateData.items;

  // 角色选项 以及 15级时对应的血量和蓝量
  const characterOptions = [
    { value: 1120, label: '追踪者', focus: 140 },
    { value: 1280, label: '守护者', focus: 115 },
    { value: 820, label: '铁眼', focus: 115 },
    { value: 860, label: '女爵', focus: 180 },
    { value: 1200, label: '无赖', focus: 95 },
    { value: 1000, label: '执行者', focus: 100 },
    { value: 780, label: '复仇者', focus: 200 },
    { value: 740, label: '隐士', focus: 195 },
  ];

  // 多选框事件处理
  const handleEffectChange = (checkedValues: string[]) => {
    setSelectedEffects(checkedValues);
  };

  // 计算回血量
  const calculateRecovery = () => {
    if (!selectedCharacter) {
      return;
    }

    // 获取角色基础血量和蓝量
    const characterHealth = parseInt(selectedCharacter);
    const selectedCharacterData = characterOptions.find(option => option.value.toString() === selectedCharacter);
    const characterFocus = selectedCharacterData?.focus || 100;
    
    // 基础回血量（红露滴圣杯瓶）
    let baseHealthRecovery = 0.6; // 60%生命值
    let baseFocusRecovery = 0; // 基础专注值恢复
    let baseHealthRecoveryAlly = 0; // 队友回血量
    let baseFocusRecoveryAlly = 0; // 队友回蓝量

    // 定义计算优先级
    const priorityOrder = [1, 2,3,4,5,6];
    const allEffects = [...selectedEffects];
    const sortedEffects = allEffects.sort((a, b) => {
      const aPriority = priorityOrder.indexOf(parseInt(a));
      const bPriority = priorityOrder.indexOf(parseInt(b));
      return aPriority - bPriority;
    });

    // 记录计算步骤
    const calculationSteps = [];
    calculationSteps.push(`角色基础血量: ${characterHealth} 点`);
    calculationSteps.push(`红露滴圣杯瓶初始回血量: ${(baseHealthRecovery * 100).toFixed(0)}%`);

    // 应用选中的效果（按优先级顺序）
    sortedEffects.forEach(effectId => {
      const item = recoverEffects.find(data => data.id.toString() === effectId);
      if (!item) return;

      switch (item.id) {
        case 1: // 征兆buff
          baseFocusRecovery = 0.3; // 恢复30%专注值
          calculationSteps.push(`应用 ${item.name}: 专注值恢复 ${(baseFocusRecovery * 100).toFixed(0)}%`);
          break;
        case 2: // 使用圣杯瓶时，连同恢复周围我方人物
          baseHealthRecovery = 0.5;
          baseHealthRecoveryAlly = 0.3;
          if (baseFocusRecovery != 0) {
            baseFocusRecoveryAlly = 0.15;
          }
          calculationSteps.push(`应用 ${item.name}: 回血量变为 ${(baseHealthRecovery * 100).toFixed(0)}%, 队友回血量 ${(baseHealthRecoveryAlly * 100).toFixed(0)}%`);
          break;
        case 3: // 提升圣杯瓶恢复量20%
          baseHealthRecovery *= 1.2;
          calculationSteps.push(`应用 ${item.name}: 回血量 × 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}%`);
          break;
        case 4: // 提升圣杯瓶恢复量20%
          baseHealthRecovery *= 1.2;
          calculationSteps.push(`应用 ${item.name}: 回血量 × 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}%`);
          break;
        case 5: // 提升圣杯瓶恢复量20%
          baseHealthRecovery *= 1.2;
          calculationSteps.push(`应用 ${item.name}: 回血量 × 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}%`);
          break;
        case 6: // 使用圣杯瓶时，改为缓慢恢复
          baseHealthRecovery = 0.01 * 81; // 1% × 81秒 = 81%
          calculationSteps.push(`应用缓慢恢复: 回血量百分比为 1% × 81次 =  ${(baseHealthRecovery * 100).toFixed(0)}%`);
          if(baseHealthRecoveryAlly!==0){
            baseHealthRecoveryAlly = 0.05+(0.01 * 41);
          }
          break;
      }
    });

    // 计算最终结果 向下取整
    const result = {
      selfHealth: Math.floor(characterHealth * baseHealthRecovery), // 自己回血量（具体数值）
      selfFocus: Math.floor(characterFocus * baseFocusRecovery), // 自己回蓝量（基于角色实际蓝量）
      allyHealth: Math.floor(characterHealth * baseHealthRecoveryAlly), // 队友回血量
      allyFocus: Math.floor(characterFocus * baseFocusRecoveryAlly), // 队友回蓝量（基于角色实际蓝量）
      // 添加百分比数据
      selfHealthPercent: (baseHealthRecovery * 100).toFixed(0),
      selfFocusPercent: (baseFocusRecovery * 100).toFixed(0),
      allyHealthPercent: (baseHealthRecoveryAlly * 100).toFixed(0),
      allyFocusPercent: (baseFocusRecoveryAlly * 100).toFixed(0)
    };

    // 添加最终计算结果到步骤中
    calculationSteps.push(`最终计算:`);
    calculationSteps.push(`  自己回血量: ${characterHealth} × ${result.selfHealthPercent}% = ${result.selfHealth} 点`);
    if (baseFocusRecovery > 0) {
      calculationSteps.push(`  自己回蓝量: ${characterFocus} × ${result.selfFocusPercent}% = ${result.selfFocus} 点`);
    }
    if (baseHealthRecoveryAlly > 0) {
      calculationSteps.push(`  队友回血量: ${characterHealth} × ${result.allyHealthPercent}% = ${result.allyHealth} 点`);
    }
    if (baseFocusRecoveryAlly > 0) {
      calculationSteps.push(`  队友回蓝量: ${characterFocus} × ${result.allyFocusPercent}% = ${result.allyFocus} 点`);
    }

    setCalculationResult({ ...result, steps: calculationSteps });
  };

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
                          { key: '1', level: '1', runes: '--' },
                          { key: '2', level: '2', runes: '3,698' },
                          { key: '3', level: '3', runes: '7,922' },
                          { key: '4', level: '4', runes: '12,348' },
                          { key: '5', level: '5', runes: '16,978' },
                          { key: '6', level: '6', runes: '21,818' },
                          { key: '7', level: '7', runes: '26,869' },
                          { key: '8', level: '8', runes: '32,137' },
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

                    {/* 第二栏 - 9-15级 */}
                    <div className="runes-column">
                      <Table
                        dataSource={[
                          { key: '9', level: '9', runes: '37,624' },
                          { key: '10', level: '10', runes: '43,335' },
                          { key: '11', level: '11', runes: '49,271' },
                          { key: '12', level: '12', runes: '55,439' },
                          { key: '13', level: '13', runes: '61,840' },
                          { key: '14', level: '14', runes: '68,479' },
                          { key: '15', level: '15', runes: '75,358' },
                          { key: 'total', level: '总计', runes: '513,336' },
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
                  
                  {/* 升级所需卢恩注释信息 */}
                  <Alert
                    description={
                      <div className="dodge-frames-tips">
                        <div className="tip-item">
                          角色3级可使用<strong style={{ color: '#0360b8' }}>蓝色武器</strong>，
                          7级可使用<strong style={{ color: '#722ed1' }}>紫色武器</strong>，
                          10级可使用<strong style={{ color: '#faad14' }}>金色武器</strong>。
                        </div>
                      </div>
                    }
                    type="info"
                    showIcon={false}
                    style={{ marginTop: '35px' }}
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
                    <HeartOutlined />
                    回血量计算器
                  </Title>
                </div>
                  <div className="card-body">
                   <div style={{ display: 'flex', gap: '24px', minHeight: '500px' }}>
                     {/* 左侧：选择区域 */}
                     <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column' }}>
                       {/* 角色选择 */}
                       <div style={{ marginBottom: '20px' }}>
                         <Text strong>选择角色：</Text>
                         <Select
                           placeholder="请选择你的角色"
                           style={{ width: '100%', marginTop: 8 }}
                           value={selectedCharacter}
                           onChange={setSelectedCharacter}
                         >
                           {characterOptions.map(option => (
                             <Option key={option.value} value={option.value}>
                               {option.label} ( 血量: {option.value}, 蓝量: {option.focus} )
                             </Option>
                           ))}
                         </Select>
                       </div>

                       {/* 回血效果选择 - 网格布局，每行两个 */}
                       <div style={{ flex: '1' }}>
                         <Text strong>选择回血效果：</Text>
                         <div style={{ 
                           marginTop: 8,
                           display: 'grid',
                           gridTemplateColumns: '1fr 1fr',
                           gap: '8px',
                           maxHeight: '400px',
                           overflowY: 'auto'
                         }}>
                           {recoverEffects.map(item => (
                             <div
                               key={item.id}
                               style={{
                                 padding: '12px',
                                 border: '1px solid #d9d9d9',
                                 borderRadius: '6px',
                                 cursor: 'pointer',
                                 transition: 'all 0.3s ease',
                                 backgroundColor: selectedEffects.includes(item.id.toString()) ? '#f0f8ff' : '#ffffff',
                                 borderColor: selectedEffects.includes(item.id.toString()) ? '#1890ff' : '#d9d9d9',
                                 boxShadow: selectedEffects.includes(item.id.toString()) ? '0 2px 8px rgba(24, 144, 255, 0.15)' : 'none',
                                 minHeight: '80px',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 justifyContent: 'space-between'
                               }}
                               onClick={() => {
                                 const newSelected = selectedEffects.includes(item.id.toString())
                                   ? selectedEffects.filter(id => id !== item.id.toString())
                                   : [...selectedEffects, item.id.toString()];
                                 setSelectedEffects(newSelected);
                               }}
                             >
                               <div style={{ 
                                 fontWeight: 'bold', 
                                 fontSize: '13px',
                                 color: item.id === 1 ? '#666' : (selectedEffects.includes(item.id.toString()) ? '#1890ff' : 'inherit'),
                                 marginBottom: '4px',
                                 lineHeight: '1.3'
                               }}>
                                 {item.name}
                               </div>
                               <div style={{ 
                                 fontSize: '11px', 
                                 color: '#666',
                                 marginBottom: '4px',
                                 lineHeight: '1.3'
                               }}>
                                 {item.description}
                               </div>
                               <div style={{ 
                                 display: 'flex',
                                 justifyContent: 'space-between',
                                 alignItems: 'center'
                               }}>
                                 <Tag 
                                   color={getCategoryColor(item.category || '')}
                                   style={{ 
                                     fontSize: '10px',
                                     margin: 0,
                                     fontWeight: 'bold'
                                   }}
                                 >
                                   {item.category}
                                 </Tag>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>

                       {/* 备注信息 */}
                       <div style={{ marginTop: '16px', marginBottom: '12px' }}>
                         <div style={{ 
                           backgroundColor: '#f6f8fa', 
                           padding: '12px', 
                           borderRadius: '6px',
                           border: '1px solid #e1e4e8'
                         }}>
                           <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
                             <div style={{ marginBottom: '4px' }}>• 角色血量和蓝量均为 15 级时的数据</div>
                             <div style={{ marginBottom: '4px' }}>• 红色圣杯瓶初始恢复量为角色总血量的 60%</div>
                             <div>• 「提升圣杯瓶恢复量 20%」词条可叠加，此处仅显示 3 个（因叠加 3 个后恢复量已超 100%，故未添加更多）</div>
                           </div>
                         </div>
                       </div>

                       {/* 计算按钮 */}
                       <div style={{ marginTop: '8px' }}>
                         <Button 
                           type="primary" 
                           onClick={calculateRecovery}
                           disabled={!selectedCharacter}
                           icon={<HeartOutlined />}
                           style={{ width: '100%' }}
                         >
                           计算回血量
                         </Button>
                       </div>
                     </div>

                                            {/* 右侧：数据展示区域 */}
                       <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                         {/* 计算步骤 */}
                         <Card size="small" title="计算步骤" style={{ flex: '1', marginBottom: '16px' }}>
                           <div style={{ 
                             backgroundColor: '#f5f5f5', 
                             padding: '12px', 
                             borderRadius: '6px',
                             fontFamily: 'monospace',
                             fontSize: '12px',
                             lineHeight: '1.6',
                             height: '100%',
                             overflowY: 'auto',
                             minHeight: '328px'
                           }}>
                             {calculationResult?.steps ? (
                               calculationResult.steps.map((step, index) => (
                                 <div key={index} style={{ marginBottom: '4px' }}>
                                   {step}
                                 </div>
                               ))
                             ) : (
                               <div style={{ color: '#999', fontStyle: 'italic' }}>
                                 请选择角色和效果后点击计算按钮
                               </div>
                             )}
                           </div>
                         </Card>

                         {/* 计算结果 */}
                         <Card size="small" title="计算结果" style={{ flex: '0 0 auto' }}>
                           <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                             {/* 自身恢复 */}
                             <div style={{ flex: '1' }}>
                               <Text strong style={{ color: '#52c41a', fontSize: '14px' }}>自身恢复</Text>
                               <div style={{ marginTop: '8px' }}>
                                 {calculationResult ? (
                                   <>
                                     <div style={{ marginBottom: '4px' }}>
                                       <Text>回血量: {calculationResult.selfHealth} 点</Text>
                                       <Text style={{ color: '#666', fontSize: '12px' }}> ({calculationResult.selfHealthPercent}%)</Text>
                                     </div>
                                     {calculationResult.selfFocus > 0 && (
                                       <div>
                                         <Text>回蓝量: {calculationResult.selfFocus} 点</Text>
                                         <Text style={{ color: '#666', fontSize: '12px' }}> ({calculationResult.selfFocusPercent}%)</Text>
                                       </div>
                                     )}
                                   </>
                                 ) : (
                                   <div style={{ color: '#999', fontStyle: 'italic' }}>
                                     待计算
                                   </div>
                                 )}
                               </div>
                             </div>

                             {/* 分隔线 */}
                             <Divider type="vertical" style={{ height: '60px', margin: '0 8px' }} />

                             {/* 队友恢复 */}
                             <div style={{ flex: '1' }}>
                               <Text strong style={{ color: '#1890ff', fontSize: '14px' }}>队友恢复</Text>
                               <div style={{ marginTop: '8px' }}>
                                 {calculationResult ? (
                                   <>
                                     <div style={{ marginBottom: '4px' }}>
                                       <Text>回血量: {calculationResult.allyHealth} 点</Text>
                                       <Text style={{ color: '#666', fontSize: '12px' }}> ({calculationResult.allyHealthPercent}%)</Text>
                                     </div>
                                     {calculationResult.allyFocus > 0 && (
                                       <div>
                                         <Text>回蓝量: {calculationResult.allyFocus} 点</Text>
                                         <Text style={{ color: '#666', fontSize: '12px' }}> ({calculationResult.allyFocusPercent}%)</Text>
                                       </div>
                                     )}
                                   </>
                                 ) : (
                                   <div style={{ color: '#999', fontStyle: 'italic' }}>
                                     待计算
                                   </div>
                                 )}
                               </div>
                             </div>
                           </div>
                         </Card>
                       </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* 其他功能尚未完成卡片 */}
          <div className="mechanics-grid">
            <div className="mechanic-card">
              <div className="card-content">
                <div className="card-title-section">
                  <Title level={5} className="mechanic-card-title">
                    <ExclamationCircleOutlined />
                    其他功能尚未完成
                  </Title>
                </div>
                <div className="card-body">
                  <Empty description="更多功能开发中..." />
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