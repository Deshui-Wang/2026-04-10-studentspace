<template>
  <div class="grade-management">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>学期：</label>
          <el-select 
            v-model="filters.semester" 
            placeholder="全部学期" 
            clearable 
            @change="handleFilterChange"
            class="semester-select"
          >
            <el-option label="全部学期" value="" />
            <el-option v-for="semester in semesterList" :key="semester" :label="semester" :value="semester" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>学科：</label>
          <el-select 
            v-model="filters.subject" 
            placeholder="全部学科" 
            clearable 
            @change="handleFilterChange"
            class="subject-select"
          >
            <el-option label="全部学科" value="" />
            <el-option v-for="subject in subjectList" :key="subject" :label="subject" :value="subject" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>课程：</label>
          <el-select 
            v-model="filters.course" 
            placeholder="全部课程" 
            clearable 
            @change="handleFilterChange"
            class="course-select"
          >
            <el-option label="全部课程" value="" />
            <el-option v-for="course in courseList" :key="course" :label="course" :value="course" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <el-button 
            type="primary" 
            @click="exportData"
            class="export-btn"
          >
            导出数据
          </el-button>
        </div>
      </div>
    </div>

    <!-- 详细成绩表格 -->
    <div class="table-section">
      
      <el-table 
        :data="paginatedGrades" 
        style="width: 100%"
        :default-sort="{ prop: 'score', order: 'descending' }"
        :header-cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        :cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        border
        stripe
      >
        <el-table-column prop="semester" label="学期" align="center" />
        <el-table-column prop="subject" label="学科" align="center" />
        <el-table-column prop="course" label="课程" align="center" />
        <el-table-column prop="examName" label="考试" align="center" />
        <el-table-column prop="examTime" label="考试时间" align="center" />
        <el-table-column prop="score" label="分数" width="100" sortable align="center">
          <template #default="{ row }">
            <span :class="getScoreClass(row.score)">{{ row.score }}</span>
          </template>
        </el-table-column>
        <el-table-column label="趋势" align="center" width="150" >
          <template #default="{ row }">
            <div class="trend-chart">
              <svg width="80" height="40" viewBox="0 0 80 40">
                <defs>
                  <linearGradient :id="`trendGradient-${row.id}`" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" :style="`stop-color:${row.score > row.previousScore ? '#52c41a' : row.score < row.previousScore ? '#ff4d4f' : '#666'};stop-opacity:1`" />
                    <stop offset="100%" :style="`stop-color:${row.score > row.previousScore ? '#52c41a' : row.score < row.previousScore ? '#ff4d4f' : '#666'};stop-opacity:0.3`" />
                  </linearGradient>
                </defs>
                <path 
                  :d="getTrendPath(row)" 
                  :stroke="`url(#trendGradient-${row.id})`" 
                  stroke-width="2" 
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle 
                  cx="10" 
                  cy="30" 
                  r="2" 
                  :fill="row.score > row.previousScore ? '#52c41a' : row.score < row.previousScore ? '#ff4d4f' : '#666'"
                />
                <circle 
                  cx="70" 
                  cy="10" 
                  r="2" 
                  :fill="row.score > row.previousScore ? '#52c41a' : row.score < row.previousScore ? '#ff4d4f' : '#666'"
                />
              </svg>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 15, 20, 50, 100]"
          :total="filteredGrades.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

// 响应式数据
const filters = ref({
  semester: '',
  subject: '',
  course: ''
})

const trendType = ref('course')
const anomalyType = ref('improvement')
const currentPage = ref(1)
const pageSize = ref(15)

// 图表实例
const scoreDistributionChart = ref(null)
const trendChart = ref(null)
let scoreChart = null
let trendChartInstance = null

// 模拟数据
const semesterList = ['2024春季', '2024秋季', '2023春季', '2023秋季', '2022春季', '2022秋季']
const subjectList = ['数学', '物理', '计算机', '英语', '化学', '生物']
const courseList = ['高等数学', '线性代数', '大学物理', '程序设计', '数据结构', '操作系统', '英语听说', '有机化学', '分子生物学']

// 生成模拟成绩数据
const generateGradeData = () => {
  const data = []
  const examNames = ['期中考试', '期末考试', '平时测验', '实验考试', '课程设计']
  
  let id = 1
  semesterList.forEach(semester => {
    subjectList.forEach(subject => {
      courseList.forEach(course => {
        // 每个课程随机选择5-8个考试
        const examCount = Math.floor(Math.random() * 4) + 5
        const selectedExams = [...examNames].sort(() => 0.5 - Math.random()).slice(0, examCount)
        
        selectedExams.forEach((examName, examIndex) => {
          const baseScore = Math.random() * 40 + 50 // 50-90基础分
          const variation = (Math.random() - 0.5) * 20 // ±10分变动
          const score = Math.max(0, Math.min(100, Math.round(baseScore + variation)))
          
          // 生成考试时间
          const year = semester.includes('2024') ? 2024 : semester.includes('2023') ? 2023 : 2022
          const month = semester.includes('春季') ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 3) + 9
          const day = Math.floor(Math.random() * 28) + 1
          const examTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          
          data.push({
            id: id++,
            semester: semester,
            subject: subject,
            course: course,
            examName: examName,
            examTime: examTime,
            score: score,
            previousScore: Math.max(0, Math.min(100, score + (Math.random() - 0.5) * 30))
          })
        })
      })
    })
  })
  
  return data
}

const allGrades = ref(generateGradeData())

// 计算属性
const filteredGrades = computed(() => {
  let filtered = allGrades.value
  
  if (filters.value.semester) {
    filtered = filtered.filter(grade => grade.semester === filters.value.semester)
  }
  
  if (filters.value.subject) {
    filtered = filtered.filter(grade => grade.subject === filters.value.subject)
  }
  
  if (filters.value.course) {
    filtered = filtered.filter(grade => grade.course === filters.value.course)
  }
  
  return filtered
})

// 分页后的数据
const paginatedGrades = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredGrades.value.slice(start, end)
})

const totalStudents = computed(() => {
  const uniqueStudents = new Set(filteredGrades.value.map(g => g.id))
  return uniqueStudents.size
})

const totalCourses = computed(() => {
  const uniqueCourses = new Set(filteredGrades.value.map(g => g.course))
  return uniqueCourses.size
})

const averageScore = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  const sum = filteredGrades.value.reduce((acc, grade) => acc + grade.score, 0)
  return sum / filteredGrades.value.length
})

const passRate = computed(() => {
  if (filteredGrades.value.length === 0) return 0
  const passCount = filteredGrades.value.filter(grade => grade.score >= 60).length
  return (passCount / filteredGrades.value.length) * 100
})

const anomalyStudents = computed(() => {
  const students = filteredGrades.value.map(grade => {
    const change = grade.score - grade.previousScore
    // 从 student01.png 到 student05.png 中随机选择
    const studentImageIndex = (grade.id % 5) + 1
    return {
      ...grade,
      change: Math.round(change),
      currentScore: Math.round(grade.score),
      previousScore: Math.round(grade.previousScore),
      avatar: `/pic/student${String(studentImageIndex).padStart(2, '0')}.png`
    }
  })
  
  if (anomalyType.value === 'improvement') {
    return students.filter(s => s.change > 10).sort((a, b) => b.change - a.change).slice(0, 10)
  } else {
    return students.filter(s => s.change < -10).sort((a, b) => a.change - b.change).slice(0, 10)
  }
})

// 方法
const handleFilterChange = () => {
  currentPage.value = 1
  nextTick(() => {
    updateCharts()
  })
}

const getTrendPath = (row) => {
  const scoreDiff = row.score - row.previousScore
  const maxDiff = 30 // 假设最大变化为30分
  
  // 计算起点和终点的Y坐标（Y轴向上为正）
  const startY = 30 // 起点Y坐标
  const endY = 10   // 终点Y坐标
  
  if (scoreDiff > 0) {
    // 上升趋势：从右下到左上
    return `M 10,${startY} Q 40,${startY - 10} 70,${endY}`
  } else if (scoreDiff < 0) {
    // 下降趋势：从右上到左下
    return `M 10,${endY} Q 40,${endY + 10} 70,${startY}`
  } else {
    // 持平：水平线
    return `M 10,20 Q 40,20 70,20`
  }
}

const changeTrendType = (type) => {
  trendType.value = type
  updateTrendChart()
}

const changeAnomalyType = (type) => {
  anomalyType.value = type
}

const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 70) return 'score-fair'
  if (score >= 60) return 'score-pass'
  return 'score-fail'
}

const viewStudentDetail = (row) => {
  // 查看学生详情逻辑
  console.log('查看学生详情:', row)
}

const editScore = (row) => {
  // 编辑成绩逻辑
  console.log('编辑成绩:', row)
}

const exportData = () => {
  // 导出数据逻辑
  console.log('导出数据')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 初始化分数分布图表
const initScoreDistributionChart = () => {
  if (scoreChart) {
    scoreChart.dispose()
  }
  
  scoreChart = echarts.init(scoreDistributionChart.value)
  updateScoreDistributionChart()
}

// 更新分数分布图表
const updateScoreDistributionChart = () => {
  if (!scoreChart) return
  
  const scoreRanges = [
    { name: '60分以下', min: 0, max: 59, color: '#ff4757' },
    { name: '60-70分', min: 60, max: 70, color: '#ffa502' },
    { name: '70-80分', min: 71, max: 80, color: '#ffdd59' },
    { name: '80-90分', min: 81, max: 90, color: '#7bed9f' },
    { name: '90-99分', min: 91, max: 99, color: '#5352ed' },
    { name: '满分', min: 100, max: 100, color: '#ff6b81' }
  ]
  
  const data = scoreRanges.map(range => {
    const count = filteredGrades.value.filter(grade => 
      grade.score >= range.min && grade.score <= range.max
    ).length
    
    return {
      name: range.name,
      value: count,
      itemStyle: { color: range.color }
    }
  })
  
  const option = {
    title: {
      text: '分数段分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center'
    },
    series: [
      {
        name: '分数段',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
        }
      }
    ]
  }
  
  scoreChart.setOption(option)
}

// 初始化趋势图表
const initTrendChart = () => {
  if (trendChartInstance) {
    trendChartInstance.dispose()
  }
  
  trendChartInstance = echarts.init(trendChart.value)
  updateTrendChart()
}

// 更新趋势图表
const updateTrendChart = () => {
  if (!trendChartInstance) return
  
  let categories = []
  let seriesData = []
  
  if (trendType.value === 'course') {
    categories = courseList
    seriesData = categories.map(course => {
      const courseGrades = filteredGrades.value.filter(g => g.course === course)
      return courseGrades.length > 0 
        ? courseGrades.reduce((sum, g) => sum + g.score, 0) / courseGrades.length 
        : 0
    })
  } else {
    categories = subjectList
    seriesData = categories.map(subject => {
      const subjectGrades = filteredGrades.value.filter(g => g.subject === subject)
      return subjectGrades.length > 0 
        ? subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length 
        : 0
    })
  }
  
  const option = {
    title: {
      text: `${trendType.value === 'course' ? '课程' : '学科'}平均分趋势`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      name: '平均分'
    },
    series: [
      {
        name: '平均分',
        type: 'line',
        data: seriesData,
        smooth: true,
        lineStyle: {
          color: '#5352ed',
          width: 3
        },
        itemStyle: {
          color: '#5352ed'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(83, 82, 237, 0.3)' },
            { offset: 1, color: 'rgba(83, 82, 237, 0.1)' }
          ])
        }
      }
    ]
  }
  
  trendChartInstance.setOption(option)
}

// 更新所有图表
const updateCharts = () => {
  updateScoreDistributionChart()
  updateTrendChart()
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initScoreDistributionChart()
    initTrendChart()
  })
})

// 监听筛选条件变化
watch(() => filteredGrades.value, () => {
  updateCharts()
}, { deep: true })
</script>

<style scoped>
.grade-management {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
  width: 100%;
}

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #333;
  min-width: 60px;
}

/* 自定义下拉框和按钮样式 */
.semester-select {
  width: 180px !important;
  min-width: 180px !important;
}

.semester-select .el-input__inner {
  width: 100% !important;
}

.subject-select {
  width: 180px !important;
  min-width: 180px !important;
}

.subject-select .el-input__inner {
  width: 100% !important;
}

.course-select {
  width: 200px !important;
  min-width: 200px !important;
}

.course-select .el-input__inner {
  width: 100% !important;
}

.export-btn {
  background: #409eff !important;
  border-color: #409eff !important;
  padding: 8px 20px !important;
  font-weight: 500 !important;
}

.export-btn:hover {
  background: #66b1ff !important;
  border-color: #66b1ff !important;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 22px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f0f0f0 100%);
  border-radius: 15%;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 图表区域 */
.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chart-header {
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.chart-container {
  height: 400px;
  width: 100%;
}

/* 标签页 */
.trend-tabs, .anomaly-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f5f5f5;
}

.tab-btn.active {
  background: #5352ed;
  color: white;
  border-color: #5352ed;
}

/* 异常学生区域 */
.anomaly-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.section-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.anomaly-list {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  align-content: stretch;
  justify-content: space-around;
}

.anomaly-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.anomaly-item:hover {
  border-color: #5352ed;
  box-shadow: 0 2px 8px rgba(83, 82, 237, 0.1);
}

.student-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
}

.student-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.student-info {
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: baseline;
}

.student-name {
  font-weight: 500;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  margin-right: 10px;
}

.student-details {
  font-size: 16px;
  color: #666;
}

.score-change {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-from, .score-to {
  font-size: 16px;
  font-weight: 500;
  color: #666;
}

.arrow {
  font-size: 20px;
  font-weight: bold;
}

.arrow.improvement {
  color: #52c41a;
}

.arrow.decline {
  color: #ff4d4f;
}

.change-value {
  font-size: 16px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
}

.change-value.improvement {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.change-value.decline {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

/* 表格区域 */
.table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.el-table__header-wrapper) {
  display: flex;
  justify-content: center;
}

:deep(.el-table th) {
  background-color: #fafafa;
  font-weight: 600;
  color: #333;
  text-align: center !important;
  padding: 12px 8px !important;
}

:deep(.el-table td) {
  text-align: center !important;
  padding: 12px 8px !important;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table--border) {
  border: 1px solid #ebeef5;
}

:deep(.el-table--border th),
:deep(.el-table--border td) {
  border-right: 1px solid #ebeef5;
}

:deep(.el-table--border th:last-child),
:deep(.el-table--border td:last-child) {
  border-right: none;
}

/* 成绩趋势图表 */
.trend-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
}

.trend-chart svg {
  display: block;
}

/* 成绩样式 */
.score-excellent {
  color: #52c41a;
  font-weight: bold;
}

.score-good {
  color: #1890ff;
  font-weight: bold;
}

.score-fair {
  color: #faad14;
  font-weight: bold;
}

.score-pass {
  color: #13c2c2;
  font-weight: bold;
}

.score-fail {
  color: #ff4d4f;
  font-weight: bold;
}

/* 分页 */
.pagination-wrapper {
  padding: 20px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grade-management {
    padding: 10px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .anomaly-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .score-change {
    align-self: flex-end;
  }
}
</style>
