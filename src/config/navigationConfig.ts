// 统一的导航配置
export interface NavigationItem {
  key: string;
  label: string;
  children?: NavigationItem[];
}

// 默认页面设置
export const DEFAULT_PAGE = '游戏机制'; // 修改这里来改变默认页面

// 主导航项配置（用于顶部导航栏）
export const mainNavigationItems: NavigationItem[] = [
  {
    key: '游戏机制',
    label: '游戏机制'
  },
  {
    key: '角色数据',
    label: '角色数据'
  },
  {
    key: '词条详细数据',
    label: '词条详细数据'
  },
  {
    key: '夜王Boss数据',
    label: '夜王Boss数据'
  },
  {
    key: '传说武器详情',
    label: '传说武器详情'
  },
];

// 获取主导航项的顺序
export const getMainNavigationOrder = (): string[] => {
  return mainNavigationItems.map(item => item.key);
};

// 获取默认页面
export const getDefaultPage = (): string => {
  return DEFAULT_PAGE;
};
