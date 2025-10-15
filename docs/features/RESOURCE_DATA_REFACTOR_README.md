# 资源数据组件重构说明

## 概述
将"数据中心-资源数据"下的三个核心组件（课件、课程、固定资产）整合到新的 `resource-data` 文件夹中，提高代码组织性和可维护性。

## 重构内容

### 1. 新建文件夹结构
```
src/components/data-center/resource-data/
├── Courseware.vue    # 课件管理组件
├── Courses.vue       # 课程管理组件
└── MyAssets.vue      # 固定资产管理组件
```

### 2. 组件移动
- **Courseware.vue**: 从 `src/components/teaching-resources/` 移动到 `src/components/data-center/resource-data/`
- **Courses.vue**: 从 `src/components/teaching-resources/` 移动到 `src/components/data-center/resource-data/`
- **MyAssets.vue**: 从 `src/components/profile/` 移动到 `src/components/data-center/resource-data/`

### 3. 导入路径更新

#### ResourcesContent.vue
```javascript
// 更新前
import Courseware from '../teaching-resources/Courseware.vue'
import Courses from '../teaching-resources/Courses.vue'
import MyAssets from '../profile/MyAssets.vue'

// 更新后
import Courseware from '../resource-data/Courseware.vue'
import Courses from '../resource-data/Courses.vue'
import MyAssets from '../resource-data/MyAssets.vue'
```

#### router/index.js
```javascript
// 更新前
import MyAssets from '../components/profile/MyAssets.vue'
import Courseware from '../components/teaching-resources/Courseware.vue'

// 更新后
import MyAssets from '../components/resource-data/MyAssets.vue'
import Courseware from '../components/resource-data/Courseware.vue'
```

## 功能验证
- ✅ 服务器启动正常
- ✅ 组件导入路径已更新
- ✅ 路由配置已同步
- ✅ 数据中心页面功能正常

## 影响范围
- 数据中心页面的"资源数据"选项卡
- 教学管理页面的"课件教案"功能
- 个人主页的"我的资产"功能

## 注意事项
1. 原有的组件文件已复制到新位置，原文件仍保留
2. 所有相关的导入路径已同步更新
3. 路由配置已相应调整
4. 功能完全兼容，无需额外配置

## 后续建议
1. 可以考虑删除原位置的组件文件（如果确认不再需要）
2. 可以考虑将其他相关资源管理组件也整合到此文件夹
3. 建议为 resource-data 文件夹添加统一的样式和工具函数
