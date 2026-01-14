# 下拉列表冲突修复说明

## 问题根源

**原来的问题代码**：
```typescript
// 两个下拉列表使用同一个状态变量！
const [showVersionDropdown, setShowVersionDropdown] = useState(false);

// 位置1：输出标签上的小箭头（1055-1067行）
<button onClick={() => setShowVersionDropdown(!showVersionDropdown)}>

// 位置2：独立的版本选择器按钮（1087-1165行）
<button onClick={() => setShowVersionDropdown(!showVersionDropdown)}>
```

**导致的问题**：
1. 两个按钮共享同一个状态变量 `showVersionDropdown`
2. 点击一个按钮会同时影响另一个
3. 用户无法独立控制两个下拉列表
4. 在不同tab下，一个按钮可能隐藏，但状态仍被另一个按钮影响

---

## 修复方案

### 1. 创建独立的状态变量

```typescript
// 修复后：4个独立的状态变量
const [showVersionDropdown, setShowVersionDropdown] = useState(false);      // 输出标签小箭头
const [showVersionSelector, setShowVersionSelector] = useState(false);      // 独立版本选择器
const [showPreviewVersionDropdown, setShowPreviewVersionDropdown] = useState(false); // 预览tab
const [showSourceDropdown, setShowSourceDropdown] = useState(false);        // 源文件下拉
```

### 2. 创建独立的Refs

```typescript
const dropdownRef = useRef<HTMLDivElement>(null);           // 输出标签小箭头
const dropdownTriggerRef = useRef<HTMLDivElement>(null);    // 独立版本选择器
const previewDropdownRef = useRef<HTMLDivElement>(null);    // 预览tab
const sourceDropdownRef = useRef<HTMLDivElement>(null);     // 源文件
```

### 3. 更新点击外部关闭逻辑

```typescript
useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;

        // 分别检查4个下拉列表
        if (dropdownRef.current && !dropdownRef.current.contains(target)) {
            setShowVersionDropdown(false);      // 关闭输出标签下拉
        }
        if (dropdownTriggerRef.current && !dropdownTriggerRef.current.contains(target)) {
            setShowVersionSelector(false);      // 关闭独立选择器下拉
        }
        if (previewDropdownRef.current && !previewDropdownRef.current.contains(target)) {
            setShowPreviewVersionDropdown(false); // 关闭预览tab下拉
        }
        if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(target)) {
            setShowSourceDropdown(false);       // 关闭源文件下拉
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

### 4. 互相关闭其他下拉

```typescript
// 输出标签小箭头点击时
onClick={() => {
    setShowVersionDropdown(!showVersionDropdown);
    setShowVersionSelector(false);  // 关闭独立选择器
}}

// 独立选择器点击时
onClick={() => {
    setShowVersionSelector(!showVersionSelector);
    setShowVersionDropdown(false);  // 关闭输出标签下拉
}}
```

---

## 当前架构

### 顶栏布局（非预览tab）

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Source]  [HTML v2▼]  [Preview]  [空白区域]  [版本选择器 v2▼]  [复制] │
│                                                                     │
│  ↑ 输出标签小箭头              ↑ 独立版本选择器                      │
│  (showVersionDropdown)        (showVersionSelector)                 │
└─────────────────────────────────────────────────────────────────────┘
```

### 四个独立的下拉列表

1. **输出标签小箭头** (HTML/React/Vue 标签上的▼)
   - 状态：`showVersionDropdown`
   - Ref：`dropdownRef`
   - 触发条件：`isGroupActive && hasMultipleVersions`
   - 位置：输出标签右侧

2. **独立版本选择器** (顶栏右侧的版本按钮)
   - 状态：`showVersionSelector`
   - Ref：`dropdownTriggerRef`
   - 触发条件：`activeTab !== 'preview'`
   - 位置：顶栏最右侧

3. **预览tab版本选择器** (预览tab右上角)
   - 状态：`showPreviewVersionDropdown`
   - Ref：`previewDropdownRef`
   - 触发条件：`activeTab === 'preview'`
   - 位置：预览工具栏右侧

4. **源文件下拉** (Source tab 文件名)
   - 状态：`showSourceDropdown`
   - Ref：`sourceDropdownRef`
   - 触发条件：`sources.length > 1`
   - 位置：Source tab 标签

---

## 使用场景

### 场景1：Code Tab（有多个版本）
- ✅ 显示输出标签小箭头（HTML/React/Vue）
- ✅ 显示独立版本选择器
- ✅ 两个按钮可以独立操作，互不干扰

### 场景2：Code Tab（只有1个版本）
- ✅ 不显示输出标签小箭头（因为 hasMultipleVersions = false）
- ✅ 显示独立版本选择器
- ✅ 只有一个可操作按钮

### 场景3：Source Tab
- ✅ 不显示输出标签小箭头（因为没有输出）
- ✅ 显示独立版本选择器（如果有输出）
- ✅ 显示源文件下拉（如果有多个源文件）

### 场景4：Preview Tab
- ✅ 不显示顶栏的两个下拉（因为 `activeTab !== 'preview'` 条件）
- ✅ 显示预览工具栏的版本选择器

---

## 删除功能验证

所有四个下拉列表都包含删除按钮：

```typescript
{onDeleteOutput && outs.length > 1 && (
    <button onClick={(e) => {
        e.stopPropagation();
        if (confirm(`删除版本 v${version}?`)) {
            onDeleteOutput(out.id);
        }
    }}>
        <Icons.Trash />
    </button>
)}
```

**删除限制**：
- 只有当版本数 > 1 时才显示删除按钮
- 防止删除最后一个版本
- 删除前有确认对话框
- 删除后自动选择其他版本

---

## 状态同步

App.tsx 中的删除处理函数确保状态同步：

```typescript
const handleDeleteOutput = (outputId: string) => {
    // 1. 从历史记录中删除
    // 2. 如果删除的是当前激活的，自动选择其他版本
    // 3. 同步更新UI状态
};
```

---

## 总结

**修复核心**：
- ✅ 4个独立状态变量
- ✅ 4个独立Refs
- ✅ 互相关闭逻辑
- ✅ 点击外部关闭所有
- ✅ 删除功能完整实现

**结果**：
- ✅ 所有下拉列表独立工作
- ✅ 无冲突
- ✅ 用户体验流畅
- ✅ 删除功能正常
