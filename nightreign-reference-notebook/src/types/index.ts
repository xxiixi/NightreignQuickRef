// 定义数据接口
export interface EntryData {
  entry_id: string;
  entry_name: string;
  entry_type?: string | null;
  explanation: string | null;
  superposability?: string | null;
  talisman?: string;
}

// Boss数据接口
export interface BossData {
  id: number;
  name: string;
  baseHealth: number;
  normalAbsorption: number;
  slashAbsorption: number;
  strikeAbsorption: number;
  pierceAbsorption: number;
  magicAbsorption: number;
  fireAbsorption: number;
  lightningAbsorption: number;
  holyAbsorption: number;
  poisonResistance: number | string;
  scarletRotResistance: number | string;
  bleedResistance: number | string;
  deathBlightResistance: number | string;
  frostResistance: number | string;
  sleepResistance: number | string;
  madnessResistance: number | string;
  basePoise: number;
  nightreignHealthMultiplier: number | string;
}

// 词条类型颜色映射
export const typeColorMap: Record<string, string> = {
  '能力': 'blue',
  '攻击力': 'red',
  '技艺/绝招': 'orange',
  '魔法/祷告': 'purple',
  '减伤率': 'green',
  '对异常状态的抵抗力': 'cyan',
  '恢复': 'lime',
  '行动': 'geekblue',
  '队伍成员': 'magenta',
  '仅限特定角色': 'gold',
  '仅限特定武器': 'volcano',
  '出击时的武器（战技）': 'geekblue',
  '出击时的武器（附加）': 'blue',
  '出击时的道具': 'orange',
  '场地环境': 'green',
  '庇佑': 'purple',
  '不甘': 'volcano',
}; 