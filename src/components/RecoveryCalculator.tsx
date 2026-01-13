import { Typography, Card, Select, Button, Divider, Tag, Empty } from 'antd';
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

  // 回血量计算器状态 - 初始选中追踪者，队友选择女爵
  const [selectedCharacter, setSelectedCharacter] = useState<string>('1120'); 
  const [selectedAllyCharacter, setSelectedAllyCharacter] = useState<string>('860');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
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
    if (!selectedCharacter || !selectedAllyCharacter) {
      return;
    }

    // 获取角色基础血量和蓝量
    const characterHealth = parseInt(selectedCharacter);
    const allyCharacterHealth = parseInt(selectedAllyCharacter);

    const selectedCharacterData = characterOptions.find(option => option.value.toString() === selectedCharacter);
    const selectedAllyCharacterData = characterOptions.find(option => option.value.toString() === selectedAllyCharacter);

    const characterFocus = selectedCharacterData?.focus || 0;
    const allyCharacterFocus = selectedAllyCharacterData?.focus || 0;
    
    // 基础回血量（红露滴圣杯瓶）
    let baseHealthRecovery = 0.6; // 60%生命值
    let baseFocusRecovery = 0; // 基础专注值恢复
    let baseHealthRecoveryAlly = 0; // 队友回血量
    let baseFocusRecoveryAlly = 0; // 队友回蓝量

    // 定义计算优先级
    const priorityOrder = [1, 2,3,4,5,6];
    const allEffects = [...selectedEffects];
    const hasSlowRecovery = allEffects.includes('6');
    let boostCountForImmediate = 0; // 缓慢恢复时，仅对“立即10%”应用的20%提升次数
    const sortedEffects = allEffects.sort((a, b) => {
      const aPriority = priorityOrder.indexOf(parseInt(a));
      const bPriority = priorityOrder.indexOf(parseInt(b));
      return aPriority - bPriority;
    });

    // 记录计算步骤
    const calculationSteps = [];
    calculationSteps.push(`-------------基础信息-------------`);
    calculationSteps.push(`【${selectedCharacterData?.label}-自己】基础血量: ${characterHealth} 点 | 基础蓝量: ${characterFocus} 点`);

    calculationSteps.push(`【${selectedAllyCharacterData?.label}-队友】基础血量: ${allyCharacterHealth} 点 | 基础蓝量: ${allyCharacterFocus} 点`);

    if (hasSlowRecovery) {
      calculationSteps.push(`【基础回血量】包含「缓慢恢复」：基础60%不再生效，改为 立即10% + 持续(1%×81)`);
    } else {
      calculationSteps.push(`【基础回血量】红露滴圣杯瓶: ${(baseHealthRecovery * 100).toFixed(0)}%`);
    }
    calculationSteps.push(`------------应用不同效果------------`);

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
          if (hasSlowRecovery) {
            // 缓慢恢复模式：不修改自身基础（由case 6单独处理），仅设置队友恢复
            baseHealthRecoveryAlly = 0.3;
            if (baseFocusRecovery != 0) {
              baseFocusRecoveryAlly = 0.15;
            }
            calculationSteps.push(`【应用】${item.name}`);
          } else {
            baseHealthRecovery = 0.5;
            baseHealthRecoveryAlly = 0.3;
            if (baseFocusRecovery != 0) {
              baseFocusRecoveryAlly = 0.15;
            }
            calculationSteps.push(`【应用】${item.name}:【基础回血量】变为${(baseHealthRecovery * 100).toFixed(0)}%，可以恢复队友血量${(baseHealthRecoveryAlly * 100).toFixed(0)}%`);
          }
          break;

        case 3: // 提升圣杯瓶恢复量20%
          if (hasSlowRecovery) {
            boostCountForImmediate += 1;
            calculationSteps.push(`【标记】${item.name}: 仅对「立即10%」生效`);
          } else {
            baseHealthRecovery *= 1.2;
            if (baseHealthRecovery > 1.0) {
              calculationSteps.push(`【应用】${item.name}:【基础回血量】× 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}% (已达到最大值100%)`);
              baseHealthRecovery = 1.0;
            } else {
              calculationSteps.push(`【应用】${item.name}:【基础回血量】× 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}%`);
            }
          }
          break;

        case 4: // 提升圣杯瓶恢复量20%
          if (hasSlowRecovery) {
            boostCountForImmediate += 1;
            calculationSteps.push(`【应用】${item.name}: 仅对「立即10%」生效`);
          } else {
            baseHealthRecovery *= 1.2;
            if (baseHealthRecovery > 1.0) {
              calculationSteps.push(`【应用】${item.name}:【基础回血量】× 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}% (已达到最大值100%)`);
              baseHealthRecovery = 1.0;
            } else {
              calculationSteps.push(`【应用】${item.name}:【基础回血量】× 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}%`);
            }
          }
          break;

        case 5: // 提升圣杯瓶恢复量20%
          if (hasSlowRecovery) {
            boostCountForImmediate += 1;
            calculationSteps.push(`【应用】${item.name}: 仅对「立即10%」生效`);
          } else {
            baseHealthRecovery *= 1.2;
            if (baseHealthRecovery > 1.0) {
              calculationSteps.push(`【应用】${item.name}:【基础回血量】× 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}% (已达到最大值100%)`);
              baseHealthRecovery = 1.0;
            } else {
              calculationSteps.push(`【应用】${item.name}:【基础回血量】× 1.2 = ${(baseHealthRecovery * 100).toFixed(0)}%`);
            }
          }
          break;

        case 6: // 使用圣杯瓶时，改为缓慢恢复（单独逻辑）
          {
            const immediateBase = 0.1; // 10%
            const periodic = 0.01 * 81; // 81%
            const immediateMultiplier = Math.pow(1.2, boostCountForImmediate);
            let immediateAdjusted = immediateBase * immediateMultiplier;
            let cappedImmediate = false;
            if (immediateAdjusted > 1.0) {
              immediateAdjusted = 1.0;
              cappedImmediate = true;
            }
            const total = immediateAdjusted + periodic;
            baseHealthRecovery = total > 1.0 ? 1.0 : total;
            calculationSteps.push(
              `【应用】缓慢恢复: 立即10% × 1.2^${boostCountForImmediate} = ${(immediateAdjusted * 100).toFixed(0)}%${cappedImmediate ? ' (已达上限100%)' : ''}`
            );
            calculationSteps.push(`【应用】缓慢恢复: 持续回血 1%×81 = ${(periodic * 100).toFixed(0)}%`);
            calculationSteps.push(`【合计】自身恢复 = 立即部分 + 持续部分 = ${(baseHealthRecovery * 100).toFixed(0)}%${total > 1.0 ? ' (已达上限100%)' : ''}`);
            if(baseHealthRecoveryAlly!==0){
              baseHealthRecoveryAlly = 0.05 + (0.01 * 41);
              calculationSteps.push(`【应用】缓慢恢复(队友): 5%+(1%×41) =  ${(baseHealthRecoveryAlly * 100).toFixed(0)}%`);
            }
          }
          break;
      }
    });

    // 计算最终结果 向下取整
    const result = {
      selfHealth: Math.floor(characterHealth * baseHealthRecovery), // 自己回血量（具体数值）
      selfFocus: Math.floor(characterFocus * baseFocusRecovery), // 自己回蓝量（基于角色实际蓝量）
      allyHealth: Math.floor(allyCharacterHealth * baseHealthRecoveryAlly), // 队友回血量
      allyFocus: Math.floor(allyCharacterFocus * baseFocusRecoveryAlly), // 队友回蓝量（基于角色实际蓝量）
      // 添加百分比数据
      selfHealthPercent: (baseHealthRecovery * 100).toFixed(0),
      selfFocusPercent: (baseFocusRecovery * 100).toFixed(0),
      allyHealthPercent: (baseHealthRecoveryAlly * 100).toFixed(0),
      allyFocusPercent: (baseFocusRecoveryAlly * 100).toFixed(0)
    };

    calculationSteps.push(`--------自己喝一口圣杯瓶的总效果--------`);
    calculationSteps.push(`【${selectedCharacterData?.label}-自己】回血量: ${characterHealth} × ${result.selfHealthPercent}% = ${result.selfHealth} 点`);
    if (baseFocusRecovery > 0) {
      calculationSteps.push(`【${selectedCharacterData?.label}-自己】回蓝量: ${characterFocus} × ${result.selfFocusPercent}% = ${result.selfFocus} 点`);
    }
    if (baseHealthRecoveryAlly > 0) {
      calculationSteps.push(`【${selectedAllyCharacterData?.label}-队友】回血量: ${allyCharacterHealth} × ${result.allyHealthPercent}% = ${result.allyHealth} 点`);
    }
    if (baseFocusRecoveryAlly > 0) {
      calculationSteps.push(`【${selectedAllyCharacterData?.label}-队友】回蓝量: ${allyCharacterFocus} × ${result.allyFocusPercent}% = ${result.allyFocus} 点`);
    }

    setCalculationResult({ ...result, steps: calculationSteps });
  };

  return (
    <div className="recovery-calculator">
      {/* 左侧：选择区域 */}
      <div className="selection-area">
        {/* 角色选择 */}
        <div className="character-selection">
          <div className="character-row">
            <Text strong>选择我的角色:</Text>
            <Select
              placeholder="请选择你的角色"
              className="character-select"
              value={selectedCharacter}
              onChange={setSelectedCharacter}
            >
              {characterOptions.map(option => (
                <Option key={option.value} value={option.value.toString()}>
                  {option.label} ( 血量: {option.value}, 蓝量: {option.focus} )
                </Option>
              ))}
            </Select>
          </div>

          <div className="character-row">
            <Text strong>选择队友的角色:</Text>
            <Select
              placeholder="请选择队友的角色"
              className="character-select"
              value={selectedAllyCharacter}
              onChange={setSelectedAllyCharacter}
            >
              {characterOptions.map(option => (
                <Option key={option.value} value={option.value.toString()}>
                  {option.label} ( 血量: {option.value}, 蓝量: {option.focus} )
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* 回血效果选择 - 网格布局，每行两个 */}
        <div className="effects-selection">
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
              <li> 角色血量和蓝量均为「15 级」时的数据；初始「红露滴圣杯瓶」回血量为60%。</li>
              <li>「缓慢恢复」情况下「队友」恢复量的计算说明：立即回血(5%) + 持续回血(每0.1s恢复1%)；持续恢复4s，共计恢复41次。</li>
              <li>「缓慢恢复」情况下，如果连着使用圣杯瓶，恢复持续时间会刷新为8s。</li>
              <li>「提升圣杯瓶恢复量 20%」词条对「征兆buff」以及队友回血量无效。</li>
              <li>「提升圣杯瓶恢复量 20%」词条可叠加，此处仅展示3个。选择局外词条的情况下，若叠加4个，恢复量达到最大值(86% × 1.2 = 103.2%)。</li>
            </ol>
          </div>
        </div>

        {/* 计算按钮 */}
        <div>
          <Button 
            type="primary" 
            onClick={calculateRecovery}
            icon={<HeartOutlined />}
            className="calculate-button"
          >
            计算回血量（喝一口）
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
                <Empty description="请点击计算按钮" />
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