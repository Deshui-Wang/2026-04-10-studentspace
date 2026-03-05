<template>
  <div class="student-evaluation">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>班级：</label>
          <select v-model="filters.class" @change="handleFilterChange">
            <option value="">全部班级</option>
            <option v-for="cls in classOptions" :key="cls.value" :value="cls.value">
              {{ cls.label }}
            </option>
          </select>
        </div>
        <div class="filter-item">
          <label>课程：</label>
          <select v-model="filters.course" @change="handleFilterChange">
            <option value="">全部课程</option>
            <option v-for="course in courseOptions" :key="course.value" :value="course.value">
              {{ course.label }}
            </option>
          </select>
        </div>
        <div class="filter-item search-item">
          <label>搜索：</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="搜索课程名称或班级名称"
            @input="handleSearchInput"
          />
        </div>
        <div class="filter-item">
          <button class="evaluate-teacher-btn" @click="evaluateStudent">教师评价</button>
        </div>
      </div>
    </div>

    <!-- 词云标签区域 -->
    <div class="word-cloud-section">
      <h3>高频评价词汇</h3>
      <div class="word-cloud">
        <span 
          v-for="word in wordCloudData" 
          :key="word.text" 
          class="word-tag"
          :style="{ fontSize: word.size + 'px', color: word.color }"
        >
          {{ word.text }}
        </span>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="data-table-section">
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>课程名称</th>
              <th>班级名称</th>
              <th>评价教师</th>
              <th>分数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredData" :key="item.id">
              <td>{{ item.courseName }}</td>
              <td>{{ item.className }}</td>
              <td>{{ item.teacherName }}</td>
              <td>
                <div class="rating-display">
                  <span class="rating-value">{{ item.score }}分</span>
                  <div class="rating-bar">
                    <div class="rating-fill" :style="{ width: item.score + '%' }"></div>
                  </div>
                </div>
              </td>
              <td>
                <button class="detail-btn" @click="showDetail(item)">查看详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 评价详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedItem?.courseName }} - {{ selectedItem?.className }} 评价详情</h3>
          <button class="close-btn" @click="closeDetailModal">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-summary">
            <div class="summary-item">
              <span class="label">评价教师：</span>
              <span class="value">{{ selectedItem?.teacherName }}</span>
            </div>
            <div class="summary-item">
              <span class="label">分数：</span>
              <span class="value">{{ selectedItem?.score }}分</span>
            </div>
          </div>
          
          <div class="evaluation-list">
            <div 
              v-for="(evaluation, index) in evaluationDetails" 
              :key="index" 
              class="evaluation-item"
            >
              <div class="evaluation-header">
                <span class="student-number">评价人：{{ selectedItem?.teacherName }}</span>
                <div class="evaluation-scores">
                  <div class="score-item">
                    <span class="score-label">学习态度：</span>
                    <span class="score-value">{{ evaluation.teachingAttitude }}分</span>
                  </div>
                  <div class="score-item">
                    <span class="score-label">课堂表现：</span>
                    <span class="score-value">{{ evaluation.teachingContent }}分</span>
                  </div>
                  <div class="score-item">
                    <span class="score-label">作业完成：</span>
                    <span class="score-value">{{ evaluation.teachingMethod }}分</span>
                  </div>
                  <div class="score-item">
                    <span class="score-label">实践能力：</span>
                    <span class="score-value">{{ evaluation.learningEffect }}分</span>
                  </div>
                </div>
              </div>
              <div class="evaluation-content">
                <div class="content-section">
                  <h4>学生优势：</h4>
                  <p>{{ evaluation.advantages }}</p>
                </div>
                <div class="content-section">
                  <h4>学习建议：</h4>
                  <p>{{ evaluation.suggestions }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeDetailModal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 筛选条件
const filters = ref({
  class: '',
  course: '',
  search: ''
})

// 选项数据
const classOptions = ref([
  { value: 'class1', label: '智慧健康养老服务与管理2401班' },
  { value: 'class2', label: '智慧健康养老服务与管理2402班' },
  { value: 'class3', label: '老年保健与管理2301班' },
  { value: 'class4', label: '护理(老年护理方向)2302班' },
  { value: 'class5', label: '康复工程技术2401班' }
])

const courseOptions = ref([
  { value: 'course1', label: '老年心理学' },
  { value: 'course2', label: '康复护理实务' },
  { value: 'course3', label: '智能健康监测系统' },
  { value: 'course4', label: '适老化环境设计' },
  { value: 'course5', label: '老年社会学' }
])

// 词云数据
const wordCloudData = ref([
  { text: '认真刻苦', size: 24, color: '#3b82f6' },
  { text: '思维活跃', size: 22, color: '#10b981' },
  { text: '积极互动', size: 20, color: '#f59e0b' },
  { text: '作业优秀', size: 18, color: '#ef4444' },
  { text: '动手能力强', size: 16, color: '#8b5cf6' },
  { text: '领悟力好', size: 14, color: '#06b6d4' },
  { text: '勤学好问', size: 12, color: '#84cc16' },
  { text: '进步明显', size: 10, color: '#f97316' }
])

// 原始数据
const rawData = ref([
  {
    id: 1,
    courseName: '老年心理学',
    className: '智慧健康养老服务与管理2401班',
    teacherName: '李老师',
    totalStudents: 42,
    score: 92
  },
  {
    id: 2,
    courseName: '康复护理实务',
    className: '智慧健康养老服务与管理2402班',
    teacherName: '王老师',
    totalStudents: 38,
    score: 89
  },
  {
    id: 3,
    courseName: '智能健康监测系统',
    className: '老年保健与管理2301班',
    teacherName: '张老师',
    totalStudents: 45,
    score: 95
  },
  {
    id: 4,
    courseName: '适老化环境设计',
    className: '护理(老年护理方向)2302班',
    teacherName: '陈老师',
    totalStudents: 40,
    score: 87
  },
  {
    id: 5,
    courseName: '老年社会学',
    className: '康复工程技术2401班',
    teacherName: '刘老师',
    totalStudents: 43,
    score: 91
  }
])

// 弹窗相关
const showDetailModal = ref(false)
const selectedItem = ref(null)
const evaluationDetails = ref([])

// 计算属性 - 过滤后的数据
const filteredData = computed(() => {
  let result = rawData.value

  if (filters.value.class) {
    result = result.filter(item => item.className.includes(filters.value.class))
  }

  if (filters.value.course) {
    result = result.filter(item => item.courseName.includes(filters.value.course))
  }

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    result = result.filter(item => 
      item.courseName.toLowerCase().includes(searchLower) ||
      item.className.toLowerCase().includes(searchLower)
    )
  }

  return result
})

// 生成虚拟评价数据
const generateEvaluationDetails = (item) => {
  const details = []
  const studentCount = item.totalStudents
  
  const advantages = [
    '该生学习态度端正，上课认真听讲',
    '课堂表现活跃，积极回答问题',
    '作业完成质量高，思路清晰',
    '动手能力强，能很好地完成实践任务',
    '学习计划合理，能够循序渐进',
    '思维敏捷，对知识点的领悟力很强',
    '能独立思考，遇到问题能积极寻找解决办法',
    '团队协作能力强，在小组讨论中发挥积极作用'
  ]
  
  const suggestions = [
    '建议多阅读一些专业相关的课外书籍',
    '希望在实践操作中能够更加大胆尝试',
    '建议进一步拓宽知识面，不要局限于课本',
    '可以多关注行业动态，结合实际加深理解',
    '建议在课堂上能够更加主动地提出自己的见解',
    '希望能够继续保持目前的学习热情',
    '建议多参与一些相关的社会实践活动',
    '可以多总结学习方法，提高学习效率'
  ]

  details.push({
    teachingAttitude: Math.floor(Math.random() * 10) + 90, // 90-100分
    teachingContent: Math.floor(Math.random() * 10) + 90,
    teachingMethod: Math.floor(Math.random() * 10) + 90,
    learningEffect: Math.floor(Math.random() * 10) + 90,
    advantages: advantages[Math.floor(Math.random() * advantages.length)],
    suggestions: suggestions[Math.floor(Math.random() * suggestions.length)]
  })
  
  return details
}

// 事件处理
const handleFilterChange = () => {
  // 筛选逻辑已在计算属性中处理
}

const handleSearchInput = () => {
  // 搜索逻辑已在计算属性中处理
}

const showDetail = (item) => {
  selectedItem.value = item
  evaluationDetails.value = generateEvaluationDetails(item)
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedItem.value = null
  evaluationDetails.value = []
}

const evaluateStudent = () => {
  // 教师评价功能
  console.log('教师评价')
  // 这里可以添加跳转到评价页面的逻辑
  // 或者打开评价弹窗
}

const exportData = () => {
  // 导出数据功能
  console.log('导出数据')
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.student-evaluation {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 筛选区域 */
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

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.filter-item select,
.filter-item input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
}

.search-item {
  flex: 1;
  min-width: 300px;
}

.search-item input {
  width: 100%;
}

.evaluate-teacher-btn {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.evaluate-teacher-btn:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
}

/* 词云区域 */
.word-cloud-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.word-cloud-section h3 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 18px;
}

.word-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.word-tag {
  padding: 6px 12px;
  background: #f3f4f6;
  border-radius: 20px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.word-tag:hover {
  background: #e5e7eb;
  transform: scale(1.05);
}

/* 数据表格区域 */
.data-table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-value {
  font-weight: 600;
  color: #059669;
  min-width: 40px;
}

.rating-bar {
  width: 100px;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s ease;
}

.detail-btn {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s ease;
}

.detail-btn:hover {
  background: #2563eb;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 1000px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #374151;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.detail-summary {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 6px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-item .label {
  font-weight: 500;
  color: #6b7280;
}

.summary-item .value {
  font-weight: 600;
  color: #374151;
}

.evaluation-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.evaluation-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.student-number {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.evaluation-scores {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.score-label {
  font-size: 12px;
  color: #6b7280;
}

.score-value {
  font-weight: 600;
  color: #059669;
  font-size: 12px;
}

.evaluation-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-section h4 {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #374151;
  font-weight: 600;
}

.content-section p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  padding: 8px 16px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .student-evaluation {
    padding: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-item {
    min-width: auto;
  }
  
  .evaluate-teacher-btn {
    width: 100%;
    margin-top: 8px;
  }
  
  .evaluation-scores {
    flex-direction: column;
    gap: 8px;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .detail-summary {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
