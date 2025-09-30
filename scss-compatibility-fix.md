# SCSS兼容性修复记录

## 问题描述
Vue2的SCSS预编译器已从node-sass更换为dart-sass，导致部分旧语法不兼容。

## 修复内容

### 1. 深度选择器语法修复
**修复前:**
```scss
::v-deep .u-button {
    width: 240rpx;
    height: 80rpx;
}
```

**修复后:**
```scss
:deep(.u-button) {
    width: 240rpx;
    height: 80rpx;
}
```

### 2. 配置文件修改
在 `manifest.json` 中添加配置，确保使用node-sass：

```json
{
    "vueVersion": "2",
    "fallbackLocale": "zh-Hans",
    "sassImplementationName": "node-sass"
}
```

## dart-sass兼容性说明

### 支持的语法
✅ 基础SCSS语法
✅ 变量 `$variable`
✅ 嵌套规则
✅ 混合 `@mixin` / `@include`
✅ 函数 `rgba()`, `linear-gradient()`
✅ 父选择器 `&`
✅ 新的深度选择器 `:deep()`

### 不支持的语法
❌ 旧的深度选择器 `::v-deep`, `/deep/`, `>>>`
❌ 旧的颜色函数 `lighten()`, `darken()` (需要使用新的模块系统)
❌ 旧的`@import`语法 (需要使用`@use`)

## 修复效果

1. **✅ 解决SCSS编译错误** - 移除了不兼容的`::v-deep`语法
2. **✅ 保证向后兼容** - 配置继续使用node-sass
3. **✅ 提升编译稳定性** - 避免dart-sass的兼容性问题
4. **✅ 保持功能完整** - 深度选择器功能正常工作

## 开发建议

1. **新项目**: 直接使用dart-sass语法 `:deep()`
2. **现有项目**: 可以暂时使用node-sass配置，逐步迁移
3. **组件样式**: 优先使用scoped样式和class选择器
4. **深度选择器**: 必要时使用`:deep()`语法