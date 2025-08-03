# NightreignQuickRef

Quick reference for Elden Ring: Nightreign entries, categorized to match in-game structure for instant lookup.

## 项目架构

这是一个基于 React + TypeScript + Vite 的前端项目，使用 Ant Design 作为 UI 组件库。

### 技术栈

- **React 19.1.0** - 前端框架
- **TypeScript 5.8.3** - 类型安全的 JavaScript
- **Vite 7.0.4** - 构建工具和开发服务器
- **Ant Design 5.26.7** - UI 组件库
- **ESLint** - 代码质量检查

## 项目运行方式

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
cd nightreign-reference-notebook
npm install
```

### 开发模式

```bash
npm run dev
```

启动开发服务器，默认地址为 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录

### 预览构建结果

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
NightreignQuickRef/
├── .gitignore                 # Git 忽略文件
├── LICENSE                    # 许可证文件
├── README.md                  # 项目说明文档
└── nightreign-reference-notebook/ # 前端项目目录
    ├── public/                # 静态资源目录
    │   └── vite.svg
    ├── src/                   # 源代码目录
    │   ├── assets/           # 资源文件
    │   │   └── react.svg
    │   ├── App.tsx           # 主应用组件
    │   ├── App.css           # 应用样式
    │   ├── main.tsx          # 应用入口
    │   ├── index.css         # 全局样式
    │   └── vite-env.d.ts     # Vite 环境类型定义
    ├── index.html             # HTML 模板
    ├── package.json           # 项目配置和依赖
    ├── package-lock.json      # 依赖锁定文件
    ├── tsconfig.json          # TypeScript 配置
    ├── tsconfig.app.json      # 应用 TypeScript 配置
    ├── tsconfig.node.json     # Node.js TypeScript 配置
    ├── vite.config.ts         # Vite 构建配置
    ├── eslint.config.js       # ESLint 配置
    └── README.md              # 项目详细说明
```

## 开发指南

### 添加新功能

1. 在 `src` 目录下创建新的组件
2. 使用 TypeScript 编写类型安全的代码
3. 使用 Ant Design 组件保持 UI 一致性
4. 运行 `npm run lint` 确保代码质量

### 样式规范

- 使用 CSS 模块或 Ant Design 的内置样式系统
- 遵循响应式设计原则
- 保持与游戏主题一致的视觉风格

## 部署

项目构建后可以直接部署到任何静态文件服务器，如：

- GitHub Pages
- Netlify
- Vercel
- 传统 Web 服务器
