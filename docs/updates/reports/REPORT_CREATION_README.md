# 报告管理系统

## 功能概述

这是一个复杂的报告创建和管理系统，专为教师个人中心设计。系统提供了丰富的模块选择和自定义功能。

## 主要功能

### 1. 报告创建弹窗
- **位置**: 个人中心 → 档案管理 → 创建按钮
- **文件**: `src/components/profile/ReportCreationModal.vue`

### 2. 模块选择
系统提供12个专业模块：

| 模块名称 | 图标 | 描述 | 组件文件 |
|---------|------|------|----------|
| 资产 | 💰 | 个人资产状况、投资情况、财务状况等 | - |
| 成果奖励 | 🏆 | 获奖情况、学术成果、荣誉证书等 | - |
| 数字素养 | 💻 | 数字化技能、技术能力、信息化水平等 | - |
| 工作量统计 | 📊 | 教学工作量、科研工作量、服务工作量等 | `WorkloadStatsModule.vue` |
| 师德师风 | 🌟 | 师德表现、教学态度、学生评价等 | - |
| 学生数据 | 👥 | 学生信息、成绩统计、指导情况等 | - |
| 课件教案研发数据 | 📚 | 课件开发、教案设计、教学资源等 | - |
| 教学经验数据 | 🎯 | 教学经验、教学方法、教学效果等 | - |

### 3. 核心功能

#### 表单功能
- 报告名称输入
- 模块选择（多选）
- 模块复制功能
- 模块删除功能

#### 数据预览
- 实时数据展示
- 模块切换预览
- 自定义数据展示

#### 图表自定义
- **图表类型**: 柱状图、折线图、饼图、环形图、雷达图、散点图
- **配色方案**: 6种预设配色方案
- **显示选项**: 图例显示、标签显示、透明度调节

### 4. 技术特性

#### 响应式设计
- 桌面端：1200px 最大宽度
- 平板端：768px 断点
- 移动端：完全适配

#### 现代化UI
- 渐变背景
- 卡片式设计
- 平滑动画
- 悬停效果

#### 组件化架构
- 模块化组件设计
- 可复用的图表组件
- 清晰的组件通信

## 文件结构

```
src/components/profile/
├── ReportCreationModal.vue          # 主弹窗组件
├── ArchiveManagement.vue            # 档案管理页面（已修改）
└── modules/                         # 模块组件目录
    ├── WorkloadStatsModule.vue      # 工作量统计模块
    └── ChartModule.vue              # 通用图表组件
```

## 使用方法

### 1. 在档案管理页面使用
```vue
<template>
  <div>
    <!-- 档案管理内容 -->
    <button @click="showReportModal = true">创建</button>
    
    <!-- 报告创建弹窗 -->
    <ReportCreationModal 
      v-if="showReportModal" 
      @close="showReportModal = false" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReportCreationModal from './ReportCreationModal.vue'

const showReportModal = ref(false)
</script>
```

### 2. 创建新的模块组件
```vue
<template>
  <div class="your-module">
    <!-- 模块内容 -->
  </div>
</template>

<script setup>
defineProps({
  moduleData: Object,
  customSettings: Object
})

defineEmits(['update-settings'])
</script>
```

### 3. 添加模块到系统
在 `ReportCreationModal.vue` 中的 `availableModules` 数组中添加新模块：

```javascript
{
  id: 'your-module',
  name: '您的模块名称',
  description: '模块描述',
  icon: '🎯',
  component: 'YourModule'
}
```

## 演示页面

访问 `/report-demo` 路由查看完整演示。

## 自定义配置

### 配色方案
在 `colorSchemes` 数组中添加新的配色方案：

```javascript
{
  name: '新配色',
  gradient: 'linear-gradient(135deg, #color1, #color2)'
}
```

### 图表类型
在图表类型选择器中添加新类型：

```html
<option value="new-chart-type">新图表类型</option>
```

## 注意事项

1. 所有模块组件都需要接收 `moduleData` 和 `customSettings` props
2. 模块组件需要发出 `update-settings` 事件
3. 图表组件使用 Canvas 绘制，确保浏览器支持
4. 响应式设计已优化，但建议在不同设备上测试

## 未来扩展

1. 集成真实的图表库（如 Chart.js）
2. 添加数据导入/导出功能
3. 实现报告模板系统
4. 添加协作功能
5. 集成AI辅助功能

## 技术栈

- Vue 3 Composition API
- CSS3 动画和渐变
- Canvas 2D 绘图
- 响应式设计
- 模块化架构
