# 📋 部署配置总结

## 当前配置

### 部署目标
- **GitHub Pages**：`/NightreignQuickRef/`

### 构建脚本
- `npm run build` - 构建项目
- `npm run deploy` - 部署到GitHub Pages

## 部署方式

### GitHub Pages（推荐）
```bash
npm run deploy
```

这个命令会：
1. 自动构建项目（`npm run build`）
2. 将构建结果部署到GitHub Pages

## 文件结构

```
nightreign-reference-notebook/
├── vite.config.ts          # 构建配置
├── package.json            # 构建脚本
└── DEPLOYMENT_SUMMARY.md   # 本文件
```

## 验证部署

### GitHub Pages
访问：https://xxiixi.github.io/NightreignQuickRef/

## 注意事项

1. **构建命令**：使用 `npm run build`
2. **输出目录**：`dist`
3. **部署路径**：固定为 `/NightreignQuickRef/`
