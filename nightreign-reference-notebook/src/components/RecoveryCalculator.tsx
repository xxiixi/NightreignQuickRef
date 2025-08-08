import { Typography, Card, Select, Button, Divider, Tag } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useState } from 'react';
import recoverCalculateData from '../data/zh-CN/recover_calculate.json';
import '../styles/recoveryCalculator.css';

const { Text } = Typography;
const { Option } = Select;

const RecoveryCalculator: React.FC = () => {
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

  // 回血量计算器状态 - 初始选中追踪者
  const [selectedCharacter, setSelectedCharacter] = useState<string>('1120'); // 追踪者的value
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

  // 计算回血量
  const calculateRecovery = () => {
    if (!selectedCharacter) {
      return;
    }

    // 获取角色基础血量和蓝量
    const characterHealth = parseInt(selectedCharacter);
    const selectedCharacterData = characterOptions.find(option => option.value === parseInt(selectedCharacter));
    const characterFocus = selectedCharacterData?.focus || 0;
    
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
    calculationSteps.push(`角色基础蓝量: ${characterFocus} 点`);
    calculationSteps.push(`红露滴圣杯瓶初始回血量: ${(baseHealthRecovery * 100).toFixed(0)}%`);
    calculationSteps.push(`--------------------------------`);

    // 应用选中的效果（按优先级顺序）
    sortedEffects.forEach(effectId => {
      const item = recoverEffects.find(data => data.id.toString() === effectId);
      if (!item) return;

      switch (item.id) {
        case 1: // 征兆buff
          baseFocusRecovery = 0.3; // 恢复30%专注值
          calculationSteps.push(`【应用】${item.name}: 专注值恢复 ${(baseFocusRecovery * 100).toFixed(0)}%`);
          break;
        case 2: // 使用圣杯瓶时，连同恢复周围我方人物
          baseHealthRecovery = 0.5;
          baseHealthRecoveryAlly = 0.3;
          if (baseFocusRecovery != 0) {
            baseFocusRecoveryAlly = 0.15;
          }
          calculationSteps.push(`【应用】${item.name}: 回血量变为 ${(baseHealthRecovery * 100).toFixed(0)}%, 队友回血量 ${(baseHealthRecoveryAlly * 100).toFixed(0)}%`);
          break;
        case 3: // 提升圣杯瓶恢复量20%
          baseHealthRecovery *= 1.2;
          calculationSteps.push(`【应用】${item.name}: 回血量 × 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}%`);
          break;
        case 4: // 提升圣杯瓶恢复量20%
          baseHealthRecovery *= 1.2;
          calculationSteps.push(`【应用】${item.name}: 回血量 × 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}%`);
          break;
        case 5: // 提升圣杯瓶恢复量20%
          baseHealthRecovery *= 1.2;
          calculationSteps.push(`【应用】${item.name}: 回血量 × 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}%`);
          break;
        case 6: // 使用圣杯瓶时，改为缓慢恢复
          baseHealthRecovery = 0.01 * 81; // 1% × 81次 = 81%
          calculationSteps.push(`【应用】缓慢恢复: 回血量 × 0 + (1% × 81次) =  ${(baseHealthRecovery * 100).toFixed(0)}%`);
          if(baseHealthRecoveryAlly!==0){
            baseHealthRecoveryAlly = 0.05+(0.01 * 41);
            calculationSteps.push(`【应用】缓慢恢复(队友): 5% + (1% × 41次) =  ${(baseHealthRecoveryAlly * 100).toFixed(0)}%`);
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
    calculationSteps.push(`--------------------------------`);
    calculationSteps.push(`最终计算(喝一口的总恢复量):`);
    calculationSteps.push(`自己回血量: ${characterHealth} × ${result.selfHealthPercent}% = ${result.selfHealth} 点`);
    if (baseFocusRecovery > 0) {
      calculationSteps.push(`自己回蓝量: ${characterFocus} × ${result.selfFocusPercent}% = ${result.selfFocus} 点`);
    }
    if (baseHealthRecoveryAlly > 0) {
      calculationSteps.push(`队友回血量: ${characterHealth} × ${result.allyHealthPercent}% = ${result.allyHealth} 点`);
    }
    if (baseFocusRecoveryAlly > 0) {
      calculationSteps.push(`队友回蓝量: ${characterFocus} × ${result.allyFocusPercent}% = ${result.allyFocus} 点`);
    }

    setCalculationResult({ ...result, steps: calculationSteps });
  };

  return (
    <div className="recovery-calculator">
      {/* 左侧：选择区域 */}
      <div className="selection-area">
        {/* 角色选择 */}
        <div className="character-selection">
          <Text strong>选择角色：</Text>
          <Select
            placeholder="请选择你的角色"
            className="character-select"
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
        <div className="effects-selection">
          <Text strong>选择回血效果：</Text>
          <div className="effects-grid">
            {recoverEffects.map(item => (
              <div
                key={item.id}
                className={`effect-card ${selectedEffects.includes(item.id.toString()) ? 'selected' : ''}`}
                onClick={() => {
                  const newSelected = selectedEffects.includes(item.id.toString())
                    ? selectedEffects.filter(id => id !== item.id.toString())
                    : [...selectedEffects, item.id.toString()];
                  setSelectedEffects(newSelected);
                }}
              >
                <div className={`effect-card-title ${selectedEffects.includes(item.id.toString()) ? 'selected' : ''}`}>
                  {item.name}
                </div>
                <div className="effect-card-description">
                  {item.description}
                </div>
                <div className="effect-card-footer">
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
        <div className="notes-section">
          <div className="notes-container">
            <ol className="notes-list">
              <li>角色血量和蓝量均为 15 级时的数据；红色圣杯瓶初始恢复量为角色总血量的 60%。</li>
              <li>缓慢恢复情况下，队友恢复的血量：立即回血(5%) + 持续回血(每0.1s恢复1%)；持续恢复4s，共计恢复41次。(计算累计恢复百分比： 0.05 + 0.01 * 41 = 0.46)。</li>
              <li>缓慢恢复情况下，如果连着使用圣杯瓶，恢复持续时间会刷新为8s。</li>
              <li>「提升圣杯瓶恢复量 20%」词条可叠加，此处仅显示3个 (因叠加3个后恢复量已超 100%，故未添加更多)。</li>
            </ol>
          </div>
        </div>

        {/* 计算按钮 */}
        <div>
          <Button 
            type="primary" 
            onClick={calculateRecovery}
            disabled={!selectedCharacter}
            icon={<HeartOutlined />}
            className="calculate-button"
          >
            计算回血量
          </Button>
        </div>
      </div>

      {/* 右侧：数据展示区域 */}
      <div className="results-area">
        {/* 计算步骤 */}
        <Card size="small" title="计算步骤" className="steps-card">
          <div className="steps-content">
            {calculationResult?.steps ? (
              calculationResult.steps.map((step, index) => (
                <div key={index} className="step-item">
                  {step}
                </div>
              ))
            ) : (
              <div className="placeholder">
                请选择角色和效果后点击计算按钮
              </div>
            )}
          </div>
        </Card>

        {/* 计算结果 */}
        <Card size="small" title="计算结果" className="results-card">
          <div className="results-content">
            {/* 自身恢复 */}
            <div className="recovery-section">
              <Text strong className="recovery-title self">自身恢复</Text>
              <div>
                {calculationResult ? (
                  <>
                    <div className="recovery-item">
                      <Text>回血量: {calculationResult.selfHealth} 点</Text>
                      <Text className="recovery-percentage"> ({calculationResult.selfHealthPercent}%)</Text>
                    </div>
                    {calculationResult.selfFocus > 0 && (
                      <div className="recovery-item">
                        <Text>回蓝量: {calculationResult.selfFocus} 点</Text>
                        <Text className="recovery-percentage"> ({calculationResult.selfFocusPercent}%)</Text>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="recovery-placeholder">
                    待计算
                  </div>
                )}
              </div>
            </div>

            {/* 分隔线 */}
            <Divider type="vertical" className="divider" />

            {/* 队友恢复 */}
            <div className="recovery-section">
              <Text strong className="recovery-title ally">队友恢复</Text>
              <div>
                {calculationResult ? (
                  <>
                    <div className="recovery-item">
                      <Text>回血量: {calculationResult.allyHealth} 点</Text>
                      <Text className="recovery-percentage"> ({calculationResult.allyHealthPercent}%)</Text>
                    </div>
                    {calculationResult.allyFocus > 0 && (
                      <div className="recovery-item">
                        <Text>回蓝量: {calculationResult.allyFocus} 点</Text>
                        <Text className="recovery-percentage"> ({calculationResult.allyFocusPercent}%)</Text>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="recovery-placeholder">
                    待计算
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecoveryCalculator; 