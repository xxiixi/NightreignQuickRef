# 🚀 EdgeOne自动部署指南

## 自动部署 vs 手动部署

### 自动部署（推荐）
- ✅ 选择仓库和分支，一键部署
- ✅ 自动构建和部署
- ✅ 支持持续集成
- ❌ 需要正确配置构建参数

### 手动部署
- ✅ 完全控制构建过程
- ✅ 可以自定义构建配置
- ❌ 需要手动上传文件

## 自动部署配置

### 1. 创建EdgeOne专用分支（推荐）

```bash
# 创建并切换到edgeone分支
git checkout -b edgeone

# 推送分支到远程仓库
git push origin edgeone
```

### 2. 在腾讯云EdgeOne中配置

1. 登录腾讯云EdgeOne控制台
2. 进入你的站点 → 静态网站托管
3. 选择"从代码仓库部署"
4. 配置以下参数：
   - **仓库地址**：你的GitHub仓库URL
   - **分支**：`edgeone`（或使用main分支）
   - **构建命令**：`npm run build`
   - **输出目录**：`dist`
   - **Node.js版本**：18

### 3. 环境变量配置

在EdgeOne控制台中设置环境变量：
```
VITE_DEPLOY_TARGET=edgeone
```

## 分支策略

### 方案1：使用main分支（简单）
- 直接使用main分支
- 自动使用根路径 `/` 部署
- 适合EdgeOne部署

### 方案2：使用专用分支（推荐）
- 创建 `edgeone` 分支
- 专门用于EdgeOne部署
- 避免与GitHub Pages冲突

## 构建配置说明

### 路径配置
- **GitHub Pages**：`/NightreignQuickRef/`
- **EdgeOne**：`/`（根路径）

### 环境变量控制
```javascript
// vite.config.ts
base: process.env.VITE_DEPLOY_TARGET === 'github' ? '/NightreignQuickRef/' : '/'
```

## 常见问题解决

### 问题1：自动部署失败
**原因**：构建命令或环境配置错误
**解决**：
1. 检查Node.js版本（推荐18+）
2. 确认构建命令：`npm run build`
3. 确认输出目录：`dist`

### 问题2：页面空白或资源404
**原因**：路径配置错误
**解决**：
1. 确保设置了环境变量 `VITE_DEPLOY_TARGET=edgeone`
2. 检查构建后的index.html中的资源路径

### 问题3：路由跳转404
**原因**：SPA路由配置问题
**解决**：在EdgeOne中配置路由规则，将所有请求重定向到 `index.html`

## 验证部署

部署完成后检查：
- ✅ 页面正常加载
- ✅ 所有资源正确加载
- ✅ 路由跳转正常
- ✅ 功能完整可用

## 持续部署

配置完成后，每次推送到对应分支都会自动触发部署：
```bash
git push origin edgeone  # 自动部署到EdgeOne
git push origin main     # 自动部署到GitHub Pages
```
