# 教学履历页面功能说明

## 功能概述
在数据中心页面新增了"教学履历"功能，用于展示教师的教学经历和课程详情。

## 实现内容

### 1. 页面结构
- **文件位置**: `src/components/teaching-resources/TeachingResume.vue`
- **路由路径**: 数据中心 → 教学数据 → 教学履历
- **访问方式**: 点击数据中心 → 教学数据 → 教学履历

### 2. 筛选区域
- **累计任教统计**: 直接展示"累计任教：9年、累计任教：7门课"
- **时间筛选**: 支持按年份筛选（2020-2024年）
- **课程筛选**: 支持按课程名称筛选
- **样式设计**: 参考课堂互动页面的筛选区域样式

### 3. 数据列表字段
- **课程名称**: 显示课程全称
- **班级数量**: 显示该课程授课班级数
- **学院总数**: 显示涉及学院数量
- **覆盖专业**: 以标签形式显示相关专业
- **时间年限**: 显示授课时间范围
- **查看详情**: 点击查看详细信息和雷达图

### 4. 详情弹窗功能
- **综合能力评估**: 雷达图展示教学能力、学生满意度、课程设计、创新性、沟通能力
- **课程简介**: 详细课程介绍
- **课程内容概述**: 课程主要内容说明
- **教学目标**: 课程学习目标
- **教学成效**: 教学效果和成果展示

### 5. 技术实现

#### 组件技术栈
- **Vue 3**: 使用Composition API
- **Element Plus**: UI组件库
- **ECharts**: 雷达图展示
- **响应式设计**: 支持移动端适配

#### 核心功能
```javascript
// 筛选功能
const filters = ref({
  timeRange: '',
  course: ''
})

// 数据过滤
const filteredData = computed(() => {
  let result = tableData.value
  if (filters.value.timeRange) {
    result = result.filter(item => item.timeRange.includes(filters.value.timeRange))
  }
  if (filters.value.course) {
    result = result.filter(item => item.courseName === filters.value.course)
  }
  return result
})

// 雷达图初始化
const initRadarChart = () => {
  const chart = echarts.init(radarChartRef.value)
  // 配置雷达图选项
}
```

### 6. 样式设计

#### 筛选区域样式
- 白色背景卡片
- 圆角边框和阴影
- 统计信息突出显示
- 筛选器水平排列

#### 表格样式
- 斑马纹表格
- 专业标签展示
- 操作按钮样式统一

#### 详情弹窗样式
- 800px宽度弹窗
- 雷达图居中显示
- 信息分段展示
- 滚动条支持

### 7. 数据模拟

#### 课程数据示例
```javascript
{
  id: 1,
  courseName: '数据结构与算法',
  classCount: 3,
  collegeCount: 2,
  majors: ['计算机科学与技术', '软件工程', '数据科学与大数据技术'],
  timeRange: '2020-2024',
  courseIntro: '本课程是计算机科学与技术专业的核心课程...',
  courseContent: '课程内容包括线性表、栈和队列...',
  teachingObjectives: '通过本课程的学习，学生能够掌握...',
  teachingEffectiveness: '学生平均成绩85分以上...',
  abilityData: {
    teachingAbility: 90,
    studentSatisfaction: 88,
    courseDesign: 92,
    innovation: 85,
    communication: 87
  }
}
```

### 8. 使用方法

#### 访问路径
1. 启动开发服务器：`npm run dev`
2. 访问数据中心：`/data-center`
3. 点击"教学数据"卡片
4. 点击"教学履历"标签页

#### 功能操作
1. **筛选数据**: 使用时间或课程下拉框筛选
2. **查看详情**: 点击表格中的"查看详情"按钮
3. **查看雷达图**: 在详情弹窗中查看综合能力评估
4. **关闭弹窗**: 点击弹窗右上角关闭按钮

### 9. 响应式设计

#### 桌面端
- 筛选器水平排列
- 表格完整显示
- 弹窗800px宽度

#### 移动端
- 筛选器垂直排列
- 表格横向滚动
- 弹窗全屏显示

### 10. 后续扩展

#### 可扩展功能
- 数据导出功能
- 更多筛选条件
- 数据统计图表
- 课程评价系统
- 教学成果展示

#### 数据集成
- 连接真实数据库
- 实时数据更新
- 用户权限控制
- 数据缓存优化

## 文件结构
```
src/
├── components/
│   └── teaching-resources/
│       └── TeachingResume.vue    # 教学履历组件
├── views/
│   └── DataCenter.vue            # 数据中心页面（已更新）
└── router/
    └── index.js                  # 路由配置
```

## 测试验证
- 构建测试：`npm run build` ✅
- 功能测试：访问数据中心页面
- 样式测试：检查响应式设计
- 交互测试：测试筛选和弹窗功能
