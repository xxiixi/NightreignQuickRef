# NightreignQuickRef

Quick reference for Elden Ring: Nightreign entries, categorized to match in-game structure for instant lookup.

## 项目架构

这是一个基于 React + TypeScript + Vite 的前端项目，使用 Ant Design 作为 UI 组件库。

### 技术栈

- **React 19.1.0**
- **TypeScript 5.8.3** 
- **Vite 7.0.4**
- **Ant Design 5.26.7**

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

## GitHub Pages 部署

### 部署配置

项目已配置为自动部署到 GitHub Pages。部署配置包括：

1. **package.json 配置**：
   - `homepage` 字段：`https://xixi.github.io/NightreignQuickRef`
   - 部署脚本：`predeploy` 和 `deploy`

2. **Vite 配置**：
   - `base` 路径：`/NightreignQuickRef/`

3. **依赖**：
   - `gh-pages` 包用于自动部署

### 部署步骤

#### 首次部署（已完成）

1. 安装 gh-pages：
   ```bash
   npm install -D gh-pages
   ```

2. 配置 GitHub Pages：
   - 进入 GitHub 仓库设置
   - 选择 "Pages" → "Source" → "Deploy from a branch"
   - 选择 "gh-pages" 分支
   - 选择 "root" 文件夹
   - 保存设置

#### 后续部署

修改代码后，运行以下命令重新部署：

```bash
npm run deploy
```

### 访问地址

部署完成后，可通过以下地址访问：
- **在线地址**：https://xxiixi.github.io/NightreignQuickRef/

### 注意事项

1. **部署时间**：部署命令完成后，需要等待 5-10 分钟才能访问最新版本
2. **分支管理**：部署会创建/更新 `gh-pages` 分支，不影响主分支代码
3. **自动构建**：`npm run deploy` 会自动运行 `npm run build` 生成生产版本
4. **路径配置**：确保 `vite.config.ts` 中的 `base` 路径与仓库名一致

### 故障排除

- 如果部署后页面无法访问，检查 GitHub Pages 设置中的分支和文件夹配置
- 如果资源路径错误，确认 `vite.config.ts` 中的 `base` 配置
- 如果部署失败，检查 `package.json` 中的 `homepage` 字段格式
