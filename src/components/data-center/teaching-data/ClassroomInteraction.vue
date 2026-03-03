<template>
  <div class="classroom-interaction-page">
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
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="table-section">
      <el-table 
        :data="paginatedInteraction" 
        style="width: 100%"
        :default-sort="{ prop: 'classTime', order: 'descending' }"
        :header-cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        :cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        border
        stripe
      >
        <el-table-column prop="semester" label="学期" align="center" />
        <el-table-column prop="subject" label="学科" align="center" />
        <el-table-column prop="course" label="课程" align="center" />
        <el-table-column prop="chapterContent" label="章节内容" align="center" />
        <el-table-column prop="classTime" label="上课时间" align="center" />
        <el-table-column prop="questionResponseRate" label="提问响应率" align="center">
          <template #default="{ row }">
            <span :class="getResponseRateClass(row.questionResponseRate)">
              {{ row.questionResponseRate }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="classroomBehavior" label="课堂行为" align="center">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              link 
              @click="showBehaviorDetails(row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="emotionCapture" label="情绪捕捉" align="center">
          <template #default="{ row }">
            <el-button 
              type="warning" 
              link 
              @click="showEmotionDetails(row)"
            >
              {{ row.emotionCapture }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredInteraction.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 课堂行为详情弹窗 -->
    <el-dialog
      v-model="showBehaviorDialog"
      title="我的课堂行为表现"
      width="600px"
      :before-close="closeBehaviorDialog"
    >
      <div class="behavior-details">
        <div class="student-info">
          <h3>{{ currentStudent.name }} ({{ currentStudent.studentId }}) 的课堂行为表现</h3>
        </div>
        
        <div class="behavior-section">
          <h4>积极讨论</h4>
          <div class="behavior-status">
            <el-tag 
              :type="currentBehaviorData.activeDiscussion ? 'success' : 'info'"
              size="large"
            >
              {{ currentBehaviorData.activeDiscussion ? '是' : '否' }}
            </el-tag>
            <span class="behavior-desc">
              {{ currentBehaviorData.activeDiscussion ? '在课堂中积极参与讨论' : '未参与积极讨论' }}
            </span>
          </div>
        </div>
        
        <div class="behavior-section">
          <h4>积极提问</h4>
          <div class="behavior-status">
            <el-tag 
              :type="currentBehaviorData.activeQuestioning ? 'primary' : 'info'"
              size="large"
            >
              {{ currentBehaviorData.activeQuestioning ? '是' : '否' }}
            </el-tag>
            <span class="behavior-desc">
              {{ currentBehaviorData.activeQuestioning ? '主动向老师提问' : '未主动提问' }}
            </span>
          </div>
        </div>
        
        <div class="behavior-section">
          <h4>回答准确</h4>
          <div class="behavior-status">
            <el-tag 
              :type="currentBehaviorData.accurateAnswers ? 'info' : 'info'"
              size="large"
            >
              {{ currentBehaviorData.accurateAnswers ? '是' : '否' }}
            </el-tag>
            <span class="behavior-desc">
              {{ currentBehaviorData.accurateAnswers ? '回答问题准确' : '回答问题不够准确' }}
            </span>
          </div>
        </div>
        
        <div class="behavior-section">
          <h4>交头接耳</h4>
          <div class="behavior-status">
            <el-tag 
              :type="currentBehaviorData.whispering ? 'warning' : 'success'"
              size="large"
            >
              {{ currentBehaviorData.whispering ? '是' : '否' }}
            </el-tag>
            <span class="behavior-desc">
              {{ currentBehaviorData.whispering ? '存在交头接耳行为' : '课堂纪律良好' }}
            </span>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 情绪捕捉详情弹窗 -->
    <el-dialog
      v-model="showEmotionDialog"
      title="我的情绪状态"
      width="500px"
      :before-close="closeEmotionDialog"
    >
      <div class="emotion-details">
        <div class="student-info">
          <h3>{{ currentStudent.name }} ({{ currentStudent.studentId }}) 的情绪状态</h3>
        </div>
        
        <div class="emotion-overview">
          <h4>当前情绪状态</h4>
          <div class="emotion-status">
            <el-tag 
              :type="getEmotionTagType(currentEmotionData.overall)"
              size="large"
              class="emotion-tag"
            >
              {{ currentEmotionData.overall }}
            </el-tag>
            <span class="emotion-desc">
              {{ getEmotionDescription(currentEmotionData.overall) }}
            </span>
          </div>
        </div>
        
        <div class="emotion-analysis">
          <h4>情绪分析</h4>
          <div class="analysis-content">
            <p v-if="currentEmotionData.overall === '消极'">
              检测到您在课堂中表现出消极情绪，建议：<br>
              • 主动参与课堂讨论<br>
              • 积极回答老师问题<br>
              • 保持专注和积极的学习态度
            </p>
            <p v-else-if="currentEmotionData.overall === '热情'">
              检测到您在课堂中表现出热情情绪，很好！<br>
              • 继续保持积极的学习状态<br>
              • 可以主动帮助其他同学<br>
              • 继续保持对学习的热情
            </p>
            <p v-else-if="currentEmotionData.overall === '疑惑'">
              检测到您在课堂中表现出疑惑情绪，建议：<br>
              • 主动向老师或同学请教<br>
              • 做好课前预习和课后复习<br>
              • 积极参与课堂讨论
            </p>
            <p v-else>
              情绪状态正常，请继续保持良好的学习状态。
            </p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 筛选条件
const filters = ref({
  semester: '',
  subject: '',
  course: ''
})

// 学期列表
const semesterList = ref([
  '2025下学期',
  '2025初学期',
  '2024下学期',
  '2024初学期'
])

// 学科列表
const subjectList = ref([
  '健康管理',
  '护理研究',
  '政策法规'
])

// 课程列表
const courseList = ref([
  '老年学概论',
  '老年社会工作实务',
  '老年心理护理实训',
  '智慧养老终端实操',
  '老年政策与法规',
  '健康管理学',
  '智能康复辅助器具应用',
  '养老机构评估与管理'
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗状态
const showBehaviorDialog = ref(false)
const showEmotionDialog = ref(false)

// 当前数据
const currentBehaviorData = ref({})
const currentEmotionData = ref({})

// 当前登录学生信息
const currentStudent = ref({
  name: '张三',
  studentId: '2021001'
})

// 生成模拟数据
const generateInteractionData = () => {
  const data = []
  const emotions = ['消极', '热情', '疑惑']
  const chapterContents = [
    '第一章：老龄化背景概论',
    '第二章：智能监护与体征监测',
    '第三章：社会支持网络构建',
    '第四章：失能与半失能照护',
    '第五章：政策支持与法规体系',
    '第六章：服务质量沟通及应对技巧',
    '第七章：智慧终端软件使用指南',
    '第八章：机构运营与实地调研'
  ]
  
  for (let i = 0; i < 50; i++) {
    const emotion = emotions[Math.floor(Math.random() * emotions.length)]
    const semester = semesterList.value[Math.floor(Math.random() * semesterList.value.length)]
    const subject = subjectList.value[Math.floor(Math.random() * subjectList.value.length)]
    
    // 学科与课程的对应关系
    const courseMap = {
      '健康管理': ['老年学概论', '老年社会工作实务', '健康管理学', '智慧养老终端实操'],
      '护理研究': ['老年心理护理实训', '智能康复辅助器具应用'],
      '政策法规': ['老年政策与法规', '养老机构评估与管理']
    }
    
    const subjectCourses = courseMap[subject] || []
    const course = subjectCourses[Math.floor(Math.random() * subjectCourses.length)] || courseList.value[0]
    
    const chapterContent = chapterContents[Math.floor(Math.random() * chapterContents.length)]
    
    // 生成上课时间（根据学期限定年份和大致月份）
    let baseYear = 2024
    if (semester.includes('2025')) baseYear = 2025
    else if (semester.includes('2023')) baseYear = 2023
    let baseMonth = semester.includes('初学期') ? '03' : '09'
    
    data.push({
      id: i + 1,
      semester: semester,
      subject: subject,
      course: course,
      chapterContent: chapterContent,
      classTime: `${baseYear}-${baseMonth}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      questionResponseRate: Math.floor(Math.random() * 40) + 60,
      emotionCapture: emotion,
      // 详细数据
      behaviorData: generateBehaviorData(),
      emotionData: generateEmotionData(emotion)
    })
  }
  
  return data
}

// 生成课堂行为数据（当前学生）
const generateBehaviorData = () => {
  // 随机生成当前学生的行为表现
  return {
    activeDiscussion: Math.random() > 0.5, // 是否参与积极讨论
    activeQuestioning: Math.random() > 0.6, // 是否积极提问
    accurateAnswers: Math.random() > 0.3, // 是否回答准确
    whispering: Math.random() > 0.8 // 是否交头接耳
  }
}

// 生成情绪数据（当前学生）
const generateEmotionData = (emotion) => {
  return {
    overall: emotion // 直接使用传入的情绪状态作为当前学生的情绪
  }
}

// 原始数据
const interactionData = ref(generateInteractionData())

// 筛选后的数据
const filteredInteraction = computed(() => {
  let result = interactionData.value

  // 按学期筛选
  if (filters.value.semester) {
    result = result.filter(item => item.semester === filters.value.semester)
  }

  // 按学科筛选
  if (filters.value.subject) {
    result = result.filter(item => item.subject === filters.value.subject)
  }

  // 按课程筛选
  if (filters.value.course) {
    result = result.filter(item => item.course === filters.value.course)
  }

  return result
})

// 分页后的数据
const paginatedInteraction = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredInteraction.value.slice(start, end)
})

// 方法
const handleFilterChange = () => {
  currentPage.value = 1
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const showBehaviorDetails = (row) => {
  currentBehaviorData.value = row.behaviorData
  showBehaviorDialog.value = true
}

const closeBehaviorDialog = () => {
  showBehaviorDialog.value = false
  currentBehaviorData.value = {}
}

const showEmotionDetails = (row) => {
  currentEmotionData.value = row.emotionData
  showEmotionDialog.value = true
}

const closeEmotionDialog = () => {
  showEmotionDialog.value = false
  currentEmotionData.value = {}
}

const getCourseTypeTag = (type) => {
  switch (type) {
    case '直播课': return 'success'
    case '录播课': return 'info'
    case '线下课': return 'warning'
    default: return ''
  }
}

const getResponseRateClass = (rate) => {
  if (rate >= 90) return 'rate-excellent'
  if (rate >= 80) return 'rate-good'
  if (rate >= 70) return 'rate-average'
  return 'rate-poor'
}

// 获取情绪标签类型
const getEmotionTagType = (emotion) => {
  switch (emotion) {
    case '消极': return 'danger'
    case '热情': return 'success'
    case '疑惑': return 'warning'
    default: return 'info'
  }
}

// 获取情绪描述
const getEmotionDescription = (emotion) => {
  switch (emotion) {
    case '消极': return '您在课堂中表现出消极情绪'
    case '热情': return '您在课堂中表现出热情情绪'
    case '疑惑': return '您在课堂中表现出疑惑情绪'
    default: return '情绪状态正常'
  }
}
</script>

<style scoped>
.classroom-interaction-page {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 筛选区域样式 */
.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.semester-select,
.subject-select,
.course-select {
  width: 180px;
}

/* 表格区域样式 */
.table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pagination-section {
  padding: 20px;
  display: flex;
  justify-content: center;
}

/* 响应率样式 */
.rate-excellent {
  color: #10b981;
  font-weight: 600;
}

.rate-good {
  color: #3b82f6;
  font-weight: 600;
}

.rate-average {
  color: #f59e0b;
  font-weight: 600;
}

.rate-poor {
  color: #ef4444;
  font-weight: 600;
}

/* 弹窗内容样式 */
.behavior-details {
  max-height: 500px;
  overflow-y: auto;
}

.student-info {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
}

.student-info h3 {
  margin: 0;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
}

.behavior-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.behavior-section h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
}

.behavior-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.behavior-desc {
  color: #6b7280;
  font-size: 14px;
}

.emotion-details h4 {
  margin: 16px 0 8px 0;
  color: #374151;
}

.emotion-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.emotion-tag {
  font-size: 16px;
  font-weight: 600;
}

.emotion-desc {
  color: #6b7280;
  font-size: 14px;
}

.emotion-overview {
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  margin-bottom: 20px;
}

.emotion-analysis {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.emotion-analysis h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
}

.analysis-content p {
  margin: 0;
  line-height: 1.6;
  color: #4b5563;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .semester-select,
  .subject-select,
  .course-select {
    width: 100%;
  }
}
</style>
