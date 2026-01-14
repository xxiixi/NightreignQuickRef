// 数据管理器 - 用于预加载所有JSON文件
import { message } from 'antd';

// 数据接口定义
export interface EntryData {
  entry_id: string;
  entry_name: string;
  entry_type?: string | null;
  explanation: string | null;
  superposability?: string | null;
  talisman?: string;
  notes?: string | null;
}

export interface EnhancementCategory {
  category: string;
  applicable_scope: {
    [key: string]: string[];
  };
  notes: string[];
}

export interface WeaponCharacter {
  [weaponName: string]: {
    [characterName: string]: number;
  };
}

export interface WeaponEffect {
  [weaponName: string]: {
    类型: string;
    特效: string;
    描述: string;
    削韧: string;
  };
}

export interface CharacterState {
  [key: string]: string;
}

export interface CharacterData {
  [characterName: string]: CharacterState;
}

export interface MagicMove {
  attributeMark: string; // 属性痕
  attributeIcon: string; // 属性图标
  mixedMagic: string; // 混合魔法
  totalDamage: string; // 总伤害
  duration: string; // 持续时间
  mixedMagicEffect: string; // 混合魔法效果
  // 兼容中文键名
  [key: string]: string;
}

export interface InvincibleFrame {
  name: string;
  type: string;
  value: number;
}

// 道具效果数据接口
export interface ItemEffect {
  name: string;
  effect: string;
  singleGridQty: string;
  type: string;
}

// 角色等级数据接口
export interface CharacterLevelData {
  level: number; // 等级
  HP: number;
  FP: number;
  ST: number;
  [key: string]: string | number;
}

// 角色详细数据接口
export interface CharacterDetailData {
  [characterName: string]: CharacterLevelData[];
}

// 缓存数据类型
type CacheData = 
  | EntryData[]
  | WeaponCharacter
  | WeaponEffect
  | CharacterData
  | MagicMove[]
  | InvincibleFrame[]
  | EnhancementCategory[]
  | ItemEffect[]
  | CharacterDetailData
  | unknown;

// 全局数据存储
class DataManager {
  private static instance: DataManager;
  private dataCache: Map<string, CacheData> = new Map();
  private loadingPromise: Promise<void> | null = null;
  private isLoaded = false;

  private constructor() {}

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // 预加载所有数据
  public async preloadAllData(): Promise<void> {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this.loadData();
    return this.loadingPromise;
  }

  private async loadData(): Promise<void> {
    try {
      // 角色详细数据文件列表（英文文件名）
      const characterDetailFiles = [
        'tracker.json',
        'duchess.json',
        'hermit.json',
        'iron-eye.json',
        'rogue.json',
        'executor.json', 
        'guardian.json',
        'avenger.json',
      ];

      // 文件名到中文名称的映射
      const fileNameToChineseName: { [key: string]: string } = {
        'tracker.json': '追踪者',
        'duchess.json': '女爵',
        'hermit.json': '隐士',
        'iron-eye.json': '铁之眼',
        'rogue.json': '无赖',
        'executor.json': '执行者',
        'guardian.json': '守护者',
        'avenger.json': '复仇者',
      };

      const [
        outsiderEntries,
        talismanEntries,
        inGameEntries,
        weaponCharacter,
        weaponEffect,
        characterStates,
        magicMoveList,
        invincibleFrames,
        enhancementCategories,
        inGameSpecialBuff,
        characterData,
        itemEffects,
        deepNightEntries,
        inGameDeepNightEntries
      ] = await Promise.all([
        import('../data/zh-CN/outsider_entries_zh-CN.json'),
        import('../data/zh-CN/talisman_entries_zh-CN.json'),
        import('../data/zh-CN/in-game_entries_zh-CN.json'),
        import('../data/zh-CN/weapon_character.json'),
        import('../data/zh-CN/weapon_effect.json'),
        import('../data/zh-CN/character_states.json'),
        import('../data/zh-CN/magic_move_list.json'),
        import('../data/zh-CN/invincible_frames.json'),
        import('../data/zh-CN/enhancement_categories.json'),
        import('../data/zh-CN/in-game_special_buff.json'),
        import('../data/character-info/character_data.json'),
        import('../data/zh-CN/item_effect.json'),
        import('../data/zh-CN/deep_night_entries.json'),
        import('../data/zh-CN/in-game_deep_night_entries.json')
      ]);

      // 加载角色详细数据
      const characterDetailData: CharacterDetailData = {};
      for (const fileName of characterDetailFiles) {
        try {
          // 使用具体的文件路径来避免动态导入警告
          const chineseName = fileNameToChineseName[fileName];
          let characterModule;
          
          switch (fileName) {
            case 'tracker.json':
              characterModule = await import('../data/character-info/tracker.json');
              break;
            case 'duchess.json':
              characterModule = await import('../data/character-info/duchess.json');
              break;
            case 'hermit.json':
              characterModule = await import('../data/character-info/hermit.json');
              break;
            case 'iron-eye.json':
              characterModule = await import('../data/character-info/iron-eye.json');
              break;
            case 'rogue.json':
              characterModule = await import('../data/character-info/rogue.json');
              break;
            case 'executor.json':
              characterModule = await import('../data/character-info/executor.json');
              break;
            case 'guardian.json':
              characterModule = await import('../data/character-info/guardian.json');
              break;
            case 'avenger.json':
              characterModule = await import('../data/character-info/avenger.json');
              break;
            default:
              console.warn(`未知的角色文件: ${fileName}`);
              continue;
          }
          
          const moduleData = characterModule.default as { [key: string]: unknown };
          if (moduleData[chineseName]) {
            characterDetailData[chineseName] = moduleData[chineseName] as CharacterLevelData[];
          }
        } catch (error) {
          console.warn(`无法加载角色详细数据文件 ${fileName}:`, error);
        }
      }

      // 存储数据到缓存
      this.dataCache.set('outsiderEntries', outsiderEntries.default);
      this.dataCache.set('talismanEntries', talismanEntries.default);
      this.dataCache.set('inGameEntries', inGameEntries.default);
      this.dataCache.set('weaponCharacter', weaponCharacter.default);
      this.dataCache.set('weaponEffect', weaponEffect.default);
      this.dataCache.set('characterStates', characterStates.default);
      this.dataCache.set('magicMoveList', magicMoveList.default);
      this.dataCache.set('invincibleFrames', invincibleFrames.default);
      this.dataCache.set('enhancementCategories', enhancementCategories.default);
      this.dataCache.set('inGameSpecialBuff', inGameSpecialBuff.default);
      this.dataCache.set('characterData', characterData.default);
      this.dataCache.set('characterDetailData', characterDetailData);
      this.dataCache.set('itemEffects', itemEffects.default);
      this.dataCache.set('deepNightEntries', deepNightEntries.default);
      this.dataCache.set('inGameDeepNightEntries', inGameDeepNightEntries.default);

      this.isLoaded = true;
      // console.log('所有数据预加载完成');
    } catch (error) {
      console.error('数据预加载失败:', error);
      message.error('数据加载失败，请刷新页面重试');
      throw error;
    }
  }

  // 获取数据的方法
  public getOutsiderEntries(): EntryData[] {
    return (this.dataCache.get('outsiderEntries') as EntryData[]) || [];
  }

  public getTalismanEntries(): EntryData[] {
    return (this.dataCache.get('talismanEntries') as EntryData[]) || [];
  }

  public getInGameEntries(): EntryData[] {
    return (this.dataCache.get('inGameEntries') as EntryData[]) || [];
  }

  public getWeaponCharacter(): WeaponCharacter[] {
    return (this.dataCache.get('weaponCharacter') as WeaponCharacter[]) || [{}];
  }

  public getWeaponEffect(): WeaponEffect[] {
    return (this.dataCache.get('weaponEffect') as WeaponEffect[]) || [{}];
  }

  public getCharacterStates(): CharacterData[] {
    return (this.dataCache.get('characterStates') as CharacterData[]) || [];
  }

  public getMagicMoveList(): MagicMove[] {
    return (this.dataCache.get('magicMoveList') as MagicMove[]) || [];
  }

  public getInvincibleFrames(): InvincibleFrame[] {
    return (this.dataCache.get('invincibleFrames') as InvincibleFrame[]) || [];
  }

  public getEnhancementCategories(): EnhancementCategory[] {
    return (this.dataCache.get('enhancementCategories') as EnhancementCategory[]) || [];
  }

  public getInGameSpecialBuff(): EntryData[] {
    return (this.dataCache.get('inGameSpecialBuff') as EntryData[]) || [];
  }

  public getCharacterData(): CharacterData {
    return (this.dataCache.get('characterData') as CharacterData) || {};
  }

  public getCharacterDetailData(): CharacterDetailData {
    return (this.dataCache.get('characterDetailData') as CharacterDetailData) || {};
  }

  public getItemEffects(): ItemEffect[] {
    return (this.dataCache.get('itemEffects') as ItemEffect[]) || [];
  }

  public getDeepNightEntries(): EntryData[] {
    const rawData = this.dataCache.get('deepNightEntries') || [];
    // 处理深夜模式局外词条的数据格式
    const processedData: EntryData[] = [];
    
    if (Array.isArray(rawData)) {
      rawData.forEach(group => {
        if (typeof group === 'object' && group !== null) {
          Object.values(group).forEach((entry: unknown) => {
            if (entry && typeof entry === 'object' && entry !== null) {
              const entryObj = entry as Record<string, unknown>;
              processedData.push({
                entry_id: (entryObj.entry_id as string) || (entryObj.entry_entry_id as string) || '',
                entry_name: (entryObj.entry_name as string) || '',
                entry_type: (entryObj.entry_type as string) || null,
                explanation: (entryObj.explanation as string) || null,
                superposability: (entryObj.superposability as string) || null,
                notes: (entryObj.notes as string) || null
              });
            }
          });
        }
      });
    }
    
    return processedData;
  }

  public getInGameDeepNightEntries(): EntryData[] {
    const rawData = this.dataCache.get('inGameDeepNightEntries') || [];
    // 处理深夜模式局内词条的数据格式
    const processedData: EntryData[] = [];
    
    if (Array.isArray(rawData)) {
      rawData.forEach(group => {
        if (typeof group === 'object' && group !== null) {
          Object.values(group).forEach((entry: unknown) => {
            if (entry && typeof entry === 'object' && entry !== null) {
              const entryObj = entry as Record<string, unknown>;
              processedData.push({
                entry_id: (entryObj.entry_id as string) || (entryObj.entry_entry_id as string) || '',
                entry_name: (entryObj.entry_name as string) || '',
                entry_type: (entryObj.entry_type as string) || null,
                explanation: (entryObj.explanation as string) || null,
                superposability: (entryObj.superposability as string) || null,
                notes: (entryObj.notes as string) || null
              });
            }
          });
        }
      });
    }
    
    return processedData;
  }

  // 检查是否已加载
  public isDataLoaded(): boolean {
    return this.isLoaded;
  }

  // 等待数据加载完成
  public async waitForData(): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }
    return this.loadingPromise || this.preloadAllData();
  }
}

export default DataManager; 