// 定义数据接口
export interface EntryData {
  entry_id: string;
  entry_name: string;
  entry_type?: string | null;
  explanation: string | null;
  superposability?: string | null;
  talisman?: string;
  notes?: string | null;
  /** 词条名称/词条类型栏要展示的标签，如「未实装」 */
  tags?: string[];
}

// Boss数据接口
export interface BossData {
  id: number;
  name: string;
  baseHealth: number | string;
  /** 普通形态的额外缩放（会显示在括号里，如头领的 ×3.75）；缺省视为 1 */
  baseHealthMultiplier?: number | number[];
  /** DLC 全局缩放（仅两支 DLC 夜王使用，参与计算但不显示） */
  dlcMultiplier?: number;
  /** 单人/双人/三人的人数倍率覆盖（默认 [1,2,3]，来自 MultiPlayCorrectionParam） */
  basePlayerMultipliers?: number[];
  nightreignHealth: number | string;
  /** 永夜王倍率（[Everdark Sovereign Scaling] 等，永夜列照此显示；支持多个因子数组） */
  nightreignHealthMultiplier: number | number[] | string;
  /** 永夜王血量列的人数倍率覆盖（默认 [1,2,3]） */
  nightreignPlayerMultipliers?: number[];
  /**
   * 深夜模式基础额外血量倍率（深度 1~5，相对当前普通血量）。
   * DLC 夜王还要再乘 deepNightDlcMultiplier（0.8）。
   */
  deepNightHealthMultipliers?: number[];
  /** 深夜 DLC 归一化系数（0.8），与 deepNightHealthMultipliers 相乘；无 DLC 的行不填 */
  deepNightDlcMultiplier?: number;
  /** 深夜原始削韧承受倍率（深度 1~5，0.88~0.84） */
  deepNightPoiseDamageRate?: number[];
  /** 深夜 DLC 原始削韧承受倍率（1.136），与 deepNightPoiseDamageRate 相乘 */
  deepNightDlcPoiseMultiplier?: number;
  /** 深夜档位说明，如 "4a" */
  deepNightTier?: string;
  /** 深夜倍率的额外说明（机制特例、数据来源等） */
  deepNightNote?: string;
  normalAbsorption: number | string;
  slashAbsorption: number | string;
  strikeAbsorption: number | string;
  pierceAbsorption: number | string;
  magicAbsorption: number | string;
  fireAbsorption: number | string;
  lightningAbsorption: number | string;
  holyAbsorption: number | string;
  poisonResistance: number | string;
  scarletRotResistance: number | string;
  bleedResistance: number | string;
  deathBlightResistance: number | string;
  frostResistance: number | string;
  sleepResistance: number | string;
  madnessResistance: number | string;
  basePoise: number | string;
  nightreignPoise: number | string;
}

// 野生Boss数据接口
export interface WildBossData {
  name: string;
  normal: number;
  strike: number;
  slash: number;
  pierce: number;
  magic: number;
  fire: number;
  lightning: number;
  holy: number;
  basePoise: number | string;
  bleed: number | string;
  poison: number | string;
  scarletRot: number | string;
  frost: number | string;
  location: string;
}

// 圆桌厅堂人物数据接口
export interface CharacterData {
  name: string;
  normal: number;
  strike: number;
  slash: number;
  pierce: number;
  magic: number;
  fire: number;
  lightning: number;
  holy: number;
  basePoise: number | string;
  bleed: number | string;
  poison: number | string;
  scarletRot: number | string;
  frost: number | string;
  location: string;
}

// 词条类型颜色映射
export const typeColorMap: Record<string, string> = {
  // 局外词条
  '能力值': 'blue',
  '攻击力': 'red',
  '技艺/绝招': 'orange',
  '魔法/祷告': 'purple',
  '减伤率': 'default',
  '对异常状态的抵抗力': 'cyan',
  '恢复': 'lime',
  '行动': 'geekblue',
  '队伍成员': 'magenta',
  '仅限特定角色': 'gold',
  '仅限特定武器': 'volcano',
  '出击时的武器（战技）': 'geekblue',
  '出击时的武器（魔法）': 'purple',
  '出击时的武器（祷告）': 'yellow',
  '出击时的武器（附加）': 'blue',
  '出击时的道具': 'orange',
  '场地环境': 'green',
  '专属遗物': 'magenta',
  '武器固有': 'cyan',
  // 局内词条
  '庇佑': 'purple',
  '不甘': 'volcano',
  '额外效果': 'cyan',
  '武器属性': 'geekblue',
  '附加异常状态': 'yellow',
  '强化': 'magenta',
  // 特殊事件及地形效果
  '特殊事件': 'green',
  '特殊地形：隐城': 'purple',
  '特殊地形：腐败森林': 'red',
  '特殊地形：山顶': 'cyan',
  '特殊地形：火山口': 'volcano',
  // 道具效果分类
  '圣杯瓶': 'red',
  '采集': 'green',
  '道具': 'cyan',
  '苔药': 'orange',
  '露滴': 'purple',
  '壶': 'blue',
  '飞刀': 'volcano',
  '石': 'geekblue',
  '香': 'magenta',
  '油脂': 'gold',
  // 深夜模式词条
  '出击时的道具(结晶露滴)': 'green',
  '减益(减伤率)': 'magenta',
  '减益(能力值)': 'red',
  '减益(行动)': 'geekblue',
  // 深夜模式局内词条
  '减益(恢复)': 'volcano',
  '特殊效果': 'cyan',
  '法术触媒专属': 'purple',
  '盾牌专属': 'magenta',
  '弓弩专属': 'volcano',
}; 