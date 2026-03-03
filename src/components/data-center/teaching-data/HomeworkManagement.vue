<template>
  <div class="homework-management">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-controls">
        <div class="filter-item">
          <label>学期筛选：</label>
          <el-select v-model="selectedSemester" placeholder="请选择学期" clearable @change="handleFilterChange" style="width: 200px">
            <el-option label="全部学期" value="" />
            <el-option 
              v-for="semester in semesterOptions" 
              :key="semester.value" 
              :label="semester.label" 
              :value="semester.value" 
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label>学科筛选：</label>
          <el-select v-model="selectedSubject" placeholder="请选择学科" clearable @change="handleFilterChange" style="width: 180px">
            <el-option label="全部学科" value="" />
            <el-option 
              v-for="subject in subjectOptions" 
              :key="subject.value" 
              :label="subject.label" 
              :value="subject.value" 
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label>课程筛选：</label>
          <el-select v-model="selectedCourse" placeholder="请选择课程" clearable @change="handleFilterChange" style="width: 220px">
            <el-option label="全部课程" value="" />
            <el-option 
              v-for="course in courseOptions" 
              :key="course.value" 
              :label="course.label" 
              :value="course.value" 
            />
          </el-select>
        </div>
        <div class="filter-item">
          <el-button type="primary" @click="resetFilters">重置筛选</el-button>
        </div>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="table-section">
      <el-table 
        :data="filteredHomeworkList" 
        stripe 
        style="width: 100%"
        :loading="loading"
      >
        <el-table-column prop="semester" label="学期" width="130" />
        <el-table-column prop="subject" label="学科" width="100" />
        <el-table-column prop="courseName" label="课程" min-width="150" />
        <el-table-column prop="homeworkName" label="作业名称" min-width="180" />
        <el-table-column prop="receiveTime" label="接收时间" width="160" align="center" />
        <el-table-column prop="completeTime" label="完成时间" width="160" align="center" />
        <el-table-column prop="score" label="分数" width="80" align="center" />
        <el-table-column prop="accuracyRate" label="正确率" width="100" align="center">
          <template #default="scope">
            <span class="accuracy-rate">{{ scope.row.accuracyRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              link
              size="small" 
              @click="viewDetail(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const selectedSemester = ref('')
const selectedSubject = ref('')
const selectedCourse = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const totalCount = ref(0)

// 筛选选项
const semesterOptions = ref([
  { value: '2025-2', label: '2025年下学期' },
  { value: '2024-1', label: '2024年春季学期' },
  { value: '2023-2', label: '2023年秋季学期' },
  { value: '2023-1', label: '2023年春季学期' },
  { value: '2022-2', label: '2022年秋季学期' }
])

const subjectOptions = ref([
  { value: 'health', label: '健康管理' },
  { value: 'nursing', label: '护理研究' },
  { value: 'policy', label: '政策法规' },
  { value: 'english', label: '英语' }
])

const courseOptions = ref([
  { value: 'HE101', label: '老年学概论' },
  { value: 'HE102', label: '老年社会工作实务' },
  { value: 'HE103', label: '老年心理护理实训' },
  { value: 'HE104', label: '智慧养老终端实操' },
  { value: 'HE105', label: '老年政策与法规' }
])

// 作业列表数据
const homeworkList = ref([
  {
    id: 1,
    semester: '2025年下学期',
    semesterCode: '2025-2',
    subject: '健康管理',
    subjectCode: 'health',
    courseName: '老年学概论',
    courseCode: 'HE101',
    homeworkName: '老年人口结构变化分析报告',
    receiveTime: '2025-10-15 08:00:00',
    completeTime: '2025-10-18 14:30:00',
    score: 87,
    accuracyRate: 87
  },
  {
    id: 2,
    semester: '2025年下学期',
    semesterCode: '2025-2',
    subject: '健康管理',
    subjectCode: 'health',
    courseName: '老年学概论',
    courseCode: 'HE101',
    homeworkName: '老龄化特征案例分析',
    receiveTime: '2025-10-20 08:00:00',
    completeTime: '2025-10-22 16:45:00',
    score: 92,
    accuracyRate: 92
  },
  {
    id: 3,
    semester: '2025年下学期',
    semesterCode: '2025-2',
    subject: '健康管理',
    subjectCode: 'health',
    courseName: '老年社会工作实务',
    courseCode: 'HE102',
    homeworkName: '社区养老服务需求访谈',
    receiveTime: '2025-10-10 08:00:00',
    completeTime: '2025-10-15 10:20:00',
    score: 89,
    accuracyRate: 89
  },
  {
    id: 4,
    semester: '2025年下学期',
    semesterCode: '2025-2',
    subject: '护理研究',
    subjectCode: 'nursing',
    courseName: '老年心理护理实训',
    courseCode: 'HE103',
    homeworkName: '老年抑郁心理测试实验',
    receiveTime: '2025-11-05 08:00:00',
    completeTime: '2025-11-08 11:30:00',
    score: 85,
    accuracyRate: 85
  },
  {
    id: 5,
    semester: '2023年秋季学期',
    semesterCode: '2023-2',
    subject: '政策法规',
    subjectCode: 'policy',
    courseName: '老年政策与法规',
    courseCode: 'HE105',
    homeworkName: '适老化政策演变研究',
    receiveTime: '2023-11-10 08:00:00',
    completeTime: '2023-11-15 09:15:00',
    score: 88,
    accuracyRate: 88
  },
  {
    id: 6,
    semester: '2023年秋季学期',
    semesterCode: '2023-2',
    subject: '健康管理',
    subjectCode: 'health',
    courseName: '智慧养老终端实操',
    courseCode: 'HE104',
    homeworkName: '生命体征监测设备实操报告',
    receiveTime: '2023-11-20 08:00:00',
    completeTime: '2023-11-23 15:00:00',
    score: 90,
    accuracyRate: 90
  },
  {
    id: 7,
    semester: '2023年秋季学期',
    semesterCode: '2023-2',
    subject: '政策法规',
    subjectCode: 'policy',
    courseName: '养老机构评估与管理',
    courseCode: 'HE108',
    homeworkName: '机构星级评定考核分析',
    receiveTime: '2023-10-15 08:00:00',
    completeTime: '2023-10-18 13:00:00',
    score: 95,
    accuracyRate: 95
  },
  {
    id: 8,
    semester: '2023年春季学期',
    semesterCode: '2023-1',
    subject: '健康管理',
    subjectCode: 'health',
    courseName: '老年学概论',
    courseCode: 'HE101',
    homeworkName: '老龄化社会国际对比',
    receiveTime: '2023-04-10 08:00:00',
    completeTime: '2023-04-13 10:30:00',
    score: 91,
    accuracyRate: 91
  },
  {
    id: 9,
    semester: '2023年春季学期',
    semesterCode: '2023-1',
    subject: '健康管理',
    subjectCode: 'health',
    courseName: '老年社会工作实务',
    courseCode: 'HE102',
    homeworkName: '日间照料中心设计规划',
    receiveTime: '2023-04-20 08:00:00',
    completeTime: '2023-04-25 16:00:00',
    score: 93,
    accuracyRate: 93
  },
  {
    id: 10,
    semester: '2025年下学期',
    semesterCode: '2025-2',
    subject: '英语',
    subjectCode: 'english',
    courseName: '大学英语',
    courseCode: 'course7',
    homeworkName: '英语阅读理解',
    receiveTime: '2025-09-05 08:00:00',
    completeTime: '2025-09-08 14:00:00',
    score: 82,
    accuracyRate: 82
  }
])

// 计算属性 - 过滤后的数据
const filteredHomeworkList = computed(() => {
  let filtered = homeworkList.value

  // 按学期筛选
  if (selectedSemester.value) {
    filtered = filtered.filter(item => item.semesterCode === selectedSemester.value)
  }

  // 按学科筛选
  if (selectedSubject.value) {
    filtered = filtered.filter(item => item.subjectCode === selectedSubject.value)
  }

  // 按课程筛选
  if (selectedCourse.value) {
    filtered = filtered.filter(item => item.courseCode === selectedCourse.value)
  }

  // 更新总数
  totalCount.value = filtered.length

  // 分页处理
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 方法
const handleFilterChange = () => {
  currentPage.value = 1 // 重置到第一页
}

const resetFilters = () => {
  selectedSemester.value = ''
  selectedSubject.value = ''
  selectedCourse.value = ''
  currentPage.value = 1
}

const getProgressColor = (percentage) => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
}

const viewDetail = (row) => {
  console.log('查看作业详情:', row)
  // 这里可以跳转到作业详情页面或打开详情弹窗
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 初始化
onMounted(() => {
  totalCount.value = homeworkList.value.length
})
</script>

<style scoped>
.homework-management {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.filter-section {
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  min-width: 80px;
}

/* 正确率样式 */
.accuracy-rate {
  font-weight: 400;
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-item {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-item label {
    min-width: 60px;
  }
  
  .homework-management {
    padding: 10px;
  }
}

.table-section {
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pagination-section {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 表格样式优化 */
:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #fafafa;
  color: #333;
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 12px 0;
}

:deep(.el-progress-bar__outer) {
  background-color: #f0f0f0;
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
}
</style>
