# 下拉列表定位修复总结

## 问题描述
用户报告点击下拉按钮后，顶栏内部会变高，需要上下滚动才能看到各个版本的文件。下拉列表应该覆盖在顶栏上方，而不是撑开顶栏。

## 根本原因
1. 下拉列表使用 `absolute` 定位，受父容器 `overflow` 属性影响
2. 顶栏有 `overflow-x-auto` 类，可能裁剪或影响子元素定位
3. 输出标签组有 `overflow-visible` 类，可能影响布局
4. 部分下拉列表缺少 `ref` 绑定，导致点击外部关闭功能失效

## 修复方案

### 1. 移除顶栏的滚动限制
```diff
- <div className="flex items-center bg-slate-100 dark:bg-slate-900 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-[#1e1e1e] transition-colors">
+ <div className="flex items-center bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-[#1e1e1e] transition-colors">
```

### 2. 移除输出标签组的 overflow-visible
```diff
- className={`relative h-full flex items-center ... group overflow-visible`}
+ className={`relative h-full flex items-center ... group`}
```

### 3. 所有下拉列表使用 fixed 定位 + 高 z-index
```typescript
// 4个下拉列表全部使用：
className="fixed top-[calc(100%+4px)] right-4 w-80 ... z-[100] animate-fade-in-up"
```

### 4. 确保所有下拉列表都绑定正确的 ref

| 下拉列表 | 状态变量 | Ref | 位置 |
|---------|---------|-----|------|
| 输出标签小箭头 | `showVersionDropdown` | `dropdownRef` | `right-4` |
| 独立版本选择器 | `showVersionSelector` | `dropdownTriggerRef` | `right-4` |
| 预览tab版本 | `showPreviewVersionDropdown` | `previewDropdownRef` | `right-4` |
| 源文件下拉 | `showSourceDropdown` | `sourceDropdownRef` | `left-4` |

## 修复后的效果

✅ **下拉列表覆盖显示**：使用 `fixed` 定位，脱离文档流，不会撑开父容器
✅ **高 z-index**：`z-[100]` 确保覆盖其他内容
✅ **点击外部关闭**：所有下拉列表都有独立的 ref 绑定
✅ **独立状态**：4个状态变量互不干扰
✅ **无滚动条**：顶栏不再需要水平滚动

## 测试要点

1. **点击顶栏输出标签的小箭头** → 下拉列表应该覆盖在顶栏下方，顶栏高度不变
2. **点击顶栏右侧的版本选择器** → 下拉列表应该覆盖显示，顶栏高度不变
3. **在预览tab点击版本选择器** → 下拉列表应该覆盖显示
4. **在Source tab点击文件名** → 下拉列表应该覆盖显示
5. **点击页面其他位置** → 所有下拉列表都应该关闭

## 文件修改

- ✅ `components/ResultViewer.tsx` - 移除 overflow 限制，添加所有 ref 绑定
- ✅ 所有下拉列表使用 `fixed` 定位 + `z-[100]`
