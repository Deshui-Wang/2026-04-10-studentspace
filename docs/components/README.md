# 数据中心组件化重构

## 重构说明

将原本臃肿的 `DataCenter.vue` 文件拆分为多个独立的组件，提高代码的可维护性和可扩展性。

## 文件结构

```
src/components/data-center/
├── README.md                    # 说明文档
├── DataCardStyles.vue          # 共享样式文件
├── TeachingDataCard.vue        # 教学数据卡片
├── ResourcesDataCard.vue       # 资源数据卡片
├── AchievementsDataCard.vue    # 教学成果卡片
├── EvaluationDataCard.vue      # 评价数据卡片
├── ReportsDataCard.vue         # 报告数据卡片
├── TeachingContent.vue         # 教学数据内容区域
├── ResourcesContent.vue        # 资源数据内容区域
├── AchievementsContent.vue     # 教学成果内容区域
├── EvaluationContent.vue       # 评价数据内容区域
└── ReportsContent.vue          # 报告数据内容区域
```

## 组件职责

### 数据卡片组件 (DataCard)
- 负责显示各模块的概览数据
- 处理主菜单的点击事件
- 维护激活状态的样式

### 内容区域组件 (Content)
- 负责显示子菜单标签页
- 管理子菜单的切换逻辑
- 渲染对应的功能组件

## 使用方式

在主文件 `DataCenter.vue` 中：

```vue
<template>
  <div class="data-center-page">
    <!-- 数据卡片区域 -->
    <div class="data-cards-container">
      <TeachingDataCard 
        :active-tab="activeTab" 
        @tab-change="setActiveTab" 
      />
      <!-- 其他数据卡片... -->
    </div>

    <!-- 内容区域 -->
    <TeachingContent 
      v-if="activeTab === 'teaching'"
      :active-sub-tab="activeSubTab"
      @sub-tab-change="setActiveSubTab"
    />
    <!-- 其他内容组件... -->
  </div>
</template>
```

## 扩展新模块

1. 创建新的数据卡片组件 (如 `NewModuleDataCard.vue`)
2. 创建新的内容区域组件 (如 `NewModuleContent.vue`)
3. 在主文件中导入并使用新组件
4. 在 `setActiveTab` 方法中添加新模块的默认子菜单

## 优势

1. **代码分离**：每个功能模块独立，便于维护
2. **可复用性**：组件可以在其他地方复用
3. **团队协作**：不同开发者可以并行开发不同模块
4. **性能优化**：可以按需加载组件
5. **易于测试**：每个组件可以独立测试
