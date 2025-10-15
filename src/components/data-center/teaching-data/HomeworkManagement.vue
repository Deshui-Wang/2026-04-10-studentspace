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
  { value: '2024-1', label: '2024年春季学期' },
  { value: '2023-2', label: '2023年秋季学期' },
  { value: '2023-1', label: '2023年春季学期' },
  { value: '2022-2', label: '2022年秋季学期' }
])

const subjectOptions = ref([
  { value: 'computer', label: '计算机' },
  { value: 'math', label: '数学' },
  { value: 'physics', label: '物理' },
  { value: 'english', label: '英语' }
])

const courseOptions = ref([
  { value: 'course1', label: '数据结构与算法' },
  { value: 'course2', label: '软件工程实践' },
  { value: 'course3', label: '计算机网络实验' },
  { value: 'course4', label: '数据库原理' },
  { value: 'course5', label: '操作系统原理' }
])

// 作业列表数据
const homeworkList = ref([
  {
    id: 1,
    semester: '2024年春季学期',
    semesterCode: '2024-1',
    subject: '计算机',
    subjectCode: 'computer',
    courseName: '数据结构与算法',
    courseCode: 'course1',
    homeworkName: '链表基本操作实现',
    receiveTime: '2024-03-15 08:00:00',
    completeTime: '2024-03-18 14:30:00',
    score: 87,
    accuracyRate: 87
  },
  {
    id: 2,
    semester: '2024年春季学期',
    semesterCode: '2024-1',
    subject: '计算机',
    subjectCode: 'computer',
    courseName: '数据结构与算法',
    courseCode: 'course1',
    homeworkName: '快速排序算法设计',
    receiveTime: '2024-03-20 08:00:00',
    completeTime: '2024-03-22 16:45:00',
    score: 92,
    accuracyRate: 92
  },
  {
    id: 3,
    semester: '2024年春季学期',
    semesterCode: '2024-1',
    subject: '计算机',
    subjectCode: 'computer',
    courseName: '软件工程实践',
    courseCode: 'course2',
    homeworkName: '软件需求分析文档',
    receiveTime: '2024-03-10 08:00:00',
    completeTime: '2024-03-15 10:20:00',
    score: 89,
    accuracyRate: 89
  },
  {
    id: 4,
    semester: '2024年春季学期',
    semesterCode: '2024-1',
    subject: '计算机',
    subjectCode: 'computer',
    courseName: '计算机网络实验',
    courseCode: 'course3',
    homeworkName: '网络协议分析实验',
    receiveTime: '2024-03-25 08:00:00',
    completeTime: '2024-03-28 11:30:00',
    score: 85,
    accuracyRate: 85
  },
  {
    id: 5,
    semester: '2023年秋季学期',
    semesterCode: '2023-2',
    subject: '计算机',
    subjectCode: 'computer',
    courseName: '数据库原理',
    courseCode: 'course4',
    homeworkName: '数据库设计实践',
    receiveTime: '2023-11-10 08:00:00',
    completeTime: '2023-11-15 09:15:00',
    score: 88,
    accuracyRate: 88
  },
  {
    id: 6,
    semester: '2023年秋季学期',
    semesterCode: '2023-2',
    subject: '计算机',
    subjectCode: 'computer',
    courseName: '操作系统原理',
    courseCode: 'course5',
    homeworkName: '进程调度算法实现',
    receiveTime: '2023-11-20 08:00:00',
    completeTime: '2023-11-23 15:00:00',
    score: 90,
    accuracyRate: 90
  },
  {
    id: 7,
    semester: '2023年秋季学期',
    semesterCode: '2023-2',
    subject: '数学',
    subjectCode: 'math',
    courseName: '高等数学',
    courseCode: 'course6',
    homeworkName: '微积分习题作业',
    receiveTime: '2023-10-15 08:00:00',
    completeTime: '2023-10-18 13:00:00',
    score: 95,
    accuracyRate: 95
  },
  {
    id: 8,
    semester: '2023年春季学期',
    semesterCode: '2023-1',
    subject: '计算机',
    subjectCode: 'computer',
    courseName: '数据结构与算法',
    courseCode: 'course1',
    homeworkName: '二叉树遍历实现',
    receiveTime: '2023-04-10 08:00:00',
    completeTime: '2023-04-13 10:30:00',
    score: 91,
    accuracyRate: 91
  },
  {
    id: 9,
    semester: '2023年春季学期',
    semesterCode: '2023-1',
    subject: '计算机',
    subjectCode: 'computer',
    courseName: '软件工程实践',
    courseCode: 'course2',
    homeworkName: '系统设计文档',
    receiveTime: '2023-04-20 08:00:00',
    completeTime: '2023-04-25 16:00:00',
    score: 93,
    accuracyRate: 93
  },
  {
    id: 10,
    semester: '2024年春季学期',
    semesterCode: '2024-1',
    subject: '英语',
    subjectCode: 'english',
    courseName: '大学英语',
    courseCode: 'course7',
    homeworkName: '英语阅读理解',
    receiveTime: '2024-03-05 08:00:00',
    completeTime: '2024-03-08 14:00:00',
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
