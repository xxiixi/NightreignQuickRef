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
  属性痕: string;
  属性图标: string;
  混合魔法: string;
  总伤害: string;
  持续时间: string;
  混合魔法效果: string;
}

export interface InvincibleFrame {
  name: string;
  type: string;
  value: number;
}

// 全局数据存储
class DataManager {
  private static instance: DataManager;
  private dataCache: Map<string, any> = new Map();
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
        inGameSpecialBuff
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
        import('../data/zh-CN/in-game_special_buff.json')
      ]);

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

      this.isLoaded = true;
      console.log('所有数据预加载完成');
    } catch (error) {
      console.error('数据预加载失败:', error);
      message.error('数据加载失败，请刷新页面重试');
      throw error;
    }
  }

  // 获取数据的方法
  public getOutsiderEntries(): EntryData[] {
    return this.dataCache.get('outsiderEntries') || [];
  }

  public getTalismanEntries(): EntryData[] {
    return this.dataCache.get('talismanEntries') || [];
  }

  public getInGameEntries(): EntryData[] {
    return this.dataCache.get('inGameEntries') || [];
  }

  public getWeaponCharacter(): WeaponCharacter[] {
    return this.dataCache.get('weaponCharacter') || [];
  }

  public getWeaponEffect(): WeaponEffect[] {
    return this.dataCache.get('weaponEffect') || [];
  }

  public getCharacterStates(): CharacterData[] {
    return this.dataCache.get('characterStates') || [];
  }

  public getMagicMoveList(): MagicMove[] {
    return this.dataCache.get('magicMoveList') || [];
  }

  public getInvincibleFrames(): InvincibleFrame[] {
    return this.dataCache.get('invincibleFrames') || [];
  }

  public getEnhancementCategories(): EnhancementCategory[] {
    return this.dataCache.get('enhancementCategories') || [];
  }

  public getInGameSpecialBuff(): any[] {
    return this.dataCache.get('inGameSpecialBuff') || [];
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