// 主题相关的工具函数
export const toggleTheme = (isDarkMode: boolean, setIsDarkMode: (value: boolean) => void) => {
  const newTheme = !isDarkMode;
  setIsDarkMode(newTheme);
  
  // 更新body属性
  if (newTheme) {
    document.body.setAttribute('tomato-theme', 'dark');
  } else {
    document.body.removeAttribute('tomato-theme');
  }
  
  // 保存到localStorage
  localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  
  // 触发自定义主题变化事件
  window.dispatchEvent(new Event('themeChange'));
};

export const initializeTheme = (setIsDarkMode: (value: boolean) => void) => {
  // 从localStorage读取主题设置
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let shouldUseDark = false;
  if (savedTheme) {
    shouldUseDark = savedTheme === 'dark';
  } else {
    shouldUseDark = prefersDark;
  }
  
  setIsDarkMode(shouldUseDark);
  
  if (shouldUseDark) {
    document.body.setAttribute('tomato-theme', 'dark');
  } else {
    document.body.removeAttribute('tomato-theme');
  }
};

export const setupThemeListener = (setIsDarkMode: (value: boolean) => void) => {
  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleThemeChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('theme')) { // 只有用户没有手动设置主题时才跟随系统
      const newTheme = e.matches;
      setIsDarkMode(newTheme);
      
      if (newTheme) {
        document.body.setAttribute('tomato-theme', 'dark');
      } else {
        document.body.removeAttribute('tomato-theme');
      }
    }
  };

  darkThemeMq.addEventListener('change', handleThemeChange);
  
  return () => {
    darkThemeMq.removeEventListener('change', handleThemeChange);
  };
};

// 检测当前主题状态
export const getCurrentTheme = (): 'light' | 'dark' => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme as 'light' | 'dark';
  }
  
  // 如果没有保存的主题设置，检查系统偏好
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

// 检测是否为深色模式
export const isDarkMode = (): boolean => {
  return getCurrentTheme() === 'dark';
}; 