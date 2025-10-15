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
          <button class="evaluate-teacher-btn" @click="evaluateTeacher">评价教师</button>
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
              <th>学生总数</th>
              <th>好评率</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredData" :key="item.id">
              <td>{{ item.courseName }}</td>
              <td>{{ item.className }}</td>
              <td>{{ item.totalStudents }}</td>
              <td>
                <div class="rating-display">
                  <span class="rating-value">{{ item.goodRating }}%</span>
                  <div class="rating-bar">
                    <div class="rating-fill" :style="{ width: item.goodRating + '%' }"></div>
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
              <span class="label">学生总数：</span>
              <span class="value">{{ selectedItem?.totalStudents }}人</span>
            </div>
            <div class="summary-item">
              <span class="label">好评率：</span>
              <span class="value">{{ selectedItem?.goodRating }}%</span>
            </div>
          </div>
          
          <div class="evaluation-list">
            <div 
              v-for="(evaluation, index) in evaluationDetails" 
              :key="index" 
              class="evaluation-item"
            >
              <div class="evaluation-header">
                <span class="student-number">学生{{ index + 1 }}</span>
                <div class="evaluation-scores">
                  <div class="score-item">
                    <span class="score-label">教学态度：</span>
                    <span class="score-value">{{ evaluation.teachingAttitude }}分</span>
                  </div>
                  <div class="score-item">
                    <span class="score-label">教学内容：</span>
                    <span class="score-value">{{ evaluation.teachingContent }}分</span>
                  </div>
                  <div class="score-item">
                    <span class="score-label">教学方法：</span>
                    <span class="score-value">{{ evaluation.teachingMethod }}分</span>
                  </div>
                  <div class="score-item">
                    <span class="score-label">学习效果：</span>
                    <span class="score-value">{{ evaluation.learningEffect }}分</span>
                  </div>
                </div>
              </div>
              <div class="evaluation-content">
                <div class="content-section">
                  <h4>优点描述：</h4>
                  <p>{{ evaluation.advantages }}</p>
                </div>
                <div class="content-section">
                  <h4>改进建议：</h4>
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
  { value: 'class1', label: '计算机科学与技术1班' },
  { value: 'class2', label: '计算机科学与技术2班' },
  { value: 'class3', label: '软件工程1班' },
  { value: 'class4', label: '软件工程2班' },
  { value: 'class5', label: '数据科学与大数据技术1班' }
])

const courseOptions = ref([
  { value: 'course1', label: '数据结构与算法' },
  { value: 'course2', label: '操作系统原理' },
  { value: 'course3', label: '数据库系统原理' },
  { value: 'course4', label: '计算机网络' },
  { value: 'course5', label: '软件工程' }
])

// 词云数据
const wordCloudData = ref([
  { text: '认真负责', size: 24, color: '#3b82f6' },
  { text: '讲解清晰', size: 22, color: '#10b981' },
  { text: '互动性强', size: 20, color: '#f59e0b' },
  { text: '内容丰富', size: 18, color: '#ef4444' },
  { text: '耐心细致', size: 16, color: '#8b5cf6' },
  { text: '生动有趣', size: 14, color: '#06b6d4' },
  { text: '重点突出', size: 12, color: '#84cc16' },
  { text: '启发思考', size: 10, color: '#f97316' }
])

// 原始数据
const rawData = ref([
  {
    id: 1,
    courseName: '数据结构与算法',
    className: '计算机科学与技术1班',
    totalStudents: 42,
    goodRating: 92
  },
  {
    id: 2,
    courseName: '操作系统原理',
    className: '计算机科学与技术2班',
    totalStudents: 38,
    goodRating: 89
  },
  {
    id: 3,
    courseName: '数据库系统原理',
    className: '软件工程1班',
    totalStudents: 45,
    goodRating: 95
  },
  {
    id: 4,
    courseName: '计算机网络',
    className: '软件工程2班',
    totalStudents: 40,
    goodRating: 87
  },
  {
    id: 5,
    courseName: '软件工程',
    className: '数据科学与大数据技术1班',
    totalStudents: 43,
    goodRating: 91
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
    '老师讲课非常认真，知识点讲解得很清楚，容易理解',
    '课堂互动很好，经常提问，让我们保持注意力',
    '教学内容丰富，理论与实践结合得很好',
    '老师很有耐心，课后也会及时回答我们的问题',
    '课程设计合理，循序渐进，不会感到困难',
    '老师讲课生动有趣，不会感到枯燥',
    '重点难点讲解得很透彻，帮助我们更好地理解',
    '作业布置合理，有助于巩固所学知识'
  ]
  
  const suggestions = [
    '希望老师能多举一些实际应用的例子',
    '建议增加一些课堂练习的时间',
    '希望老师能放慢一些讲课的节奏',
    '建议多使用一些多媒体教学工具',
    '希望老师能多关注基础较差的同学',
    '建议增加一些小组讨论的环节',
    '希望老师能提供更多的学习资源',
    '建议调整一下课程进度安排'
  ]

  for (let i = 0; i < studentCount; i++) {
    details.push({
      teachingAttitude: Math.floor(Math.random() * 20) + 80, // 80-100分
      teachingContent: Math.floor(Math.random() * 20) + 80,
      teachingMethod: Math.floor(Math.random() * 20) + 80,
      learningEffect: Math.floor(Math.random() * 20) + 80,
      advantages: advantages[Math.floor(Math.random() * advantages.length)],
      suggestions: suggestions[Math.floor(Math.random() * suggestions.length)]
    })
  }
  
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

const evaluateTeacher = () => {
  // 评价教师功能
  console.log('评价教师')
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
