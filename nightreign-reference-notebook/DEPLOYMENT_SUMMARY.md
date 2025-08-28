# 📋 部署配置总结

## 当前配置

### 智能路径配置
- **GitHub Pages**：`/NightreignQuickRef/`
- **EdgeOne**：`/`（根路径）

### 构建脚本
- `npm run build` - 默认构建（适合EdgeOne）
- `npm run build:github` - GitHub Pages构建
- `npm run deploy` - 部署到GitHub Pages

### 环境变量
- `VITE_DEPLOY_TARGET=github` - GitHub Pages部署
- `VITE_DEPLOY_TARGET=edgeone` - EdgeOne部署

## 部署方式

### GitHub Pages（已配置）
```bash
npm run deploy
```

### EdgeOne自动部署
1. 在腾讯云EdgeOne控制台配置仓库
2. 设置环境变量：`VITE_DEPLOY_TARGET=edgeone`
3. 配置路由规则重定向到 `index.html`
4. 推送代码自动部署：`git push origin main`

## 文件结构

```
nightreign-reference-notebook/
├── vite.config.ts          # 智能路径配置
├── package.json            # 构建脚本
├── QUICK_DEPLOY.md         # 快速部署指南
├── EDGEONE_DEPLOY.md       # 详细部署文档
└── DEPLOYMENT_SUMMARY.md   # 本文件
```

## 已移除的文件
- ❌ `vite.config.edgeone.ts` - 手动配置文件
- ❌ `deploy-edgeone.sh` - 手动部署脚本
- ❌ `edgeone-deploy.json` - 手动配置文件
- ❌ 其他手动部署相关文件

## 验证部署

### GitHub Pages
访问：https://xxiixi.github.io/NightreignQuickRef/

### EdgeOne
访问：你的自定义域名

## 注意事项

1. **环境变量**：确保在EdgeOne中设置 `VITE_DEPLOY_TARGET=edgeone`
2. **路由规则**：在EdgeOne中配置所有请求重定向到 `index.html`
3. **构建命令**：使用 `npm run build`（自动检测环境）
4. **输出目录**：`dist`
