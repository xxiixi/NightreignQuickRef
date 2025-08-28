# 🚀 EdgeOne自动部署指南

## 为什么之前自动部署失败？

你之前自动部署失败的原因是：
- 默认配置使用 `/NightreignQuickRef/` 路径（适合GitHub Pages）
- EdgeOne需要根路径 `/` 才能正常工作

## 现在已修复的配置

✅ **智能路径配置**：
```javascript
base: process.env.VITE_DEPLOY_TARGET === 'github' ? '/NightreignQuickRef/' : '/'
```

✅ **环境变量控制**：
- GitHub Pages：`VITE_DEPLOY_TARGET=github`
- EdgeOne：`VITE_DEPLOY_TARGET=edgeone`

## 自动部署步骤

### 1. 在腾讯云EdgeOne中配置

1. 登录腾讯云EdgeOne控制台
2. 进入你的站点 → 静态网站托管
3. 选择"从代码仓库部署"
4. 配置参数：
   - **仓库地址**：`https://github.com/xxiixi/NightreignQuickRef`
   - **分支**：`main`
   - **构建命令**：`npm run build`
   - **输出目录**：`dist`
   - **Node.js版本**：18

### 2. 设置环境变量

在EdgeOne控制台中添加环境变量：
```
VITE_DEPLOY_TARGET=edgeone
```

### 3. 配置路由规则（重要！）

在EdgeOne中设置路由规则：
- 将所有请求重定向到 `index.html`
- 解决SPA应用刷新404问题

## 验证部署

部署完成后，检查：
- ✅ 页面正常加载
- ✅ 所有资源路径正确（以 `/` 开头）
- ✅ 路由跳转正常

## 持续部署

配置完成后，每次推送到main分支都会自动触发部署：
```bash
git push origin main  # 自动部署到EdgeOne
```

## 常见问题

**Q: 自动部署失败？**
A: 检查环境变量 `VITE_DEPLOY_TARGET=edgeone` 是否设置正确

**Q: 页面空白？**
A: 检查构建日志，确认构建成功且资源路径正确

**Q: 路由404？**
A: 在EdgeOne中配置路由规则，重定向到 `index.html`
