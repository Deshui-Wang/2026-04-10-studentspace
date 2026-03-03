<template>
  <div class="self-evaluation-page">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>学期：</label>
          <select v-model="filters.semester" @change="handleFilterChange">
            <option value="">全部学期</option>
            <option v-for="semester in semesterOptions" :key="semester.value" :value="semester.value">
              {{ semester.label }}
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
            placeholder="搜索课程名称或学习评价内容"
            @input="handleSearchInput"
          />
        </div>
      </div>
    </div>

   <!-- 数据列表 -->
    <div class="data-table-section">
      <div class="table-header">
        <h3>学习自我评价记录</h3>
        <button class="add-evaluation-btn" @click="showAddModal">+ 新增评价</button>
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>课程名称</th>
              <th>学期</th>
              <th>评价时间</th>
              <th>学习态度</th>
              <th>知识掌握</th>
              <th>学习方法</th>
              <th>学习效果</th>
              <th>综合评分</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredData" :key="item.id">
              <td class="course-name">{{ item.courseName }}</td>
              <td class="semester">{{ item.semester }}</td>
              <td class="evaluation-time">{{ item.evaluationTime }}</td>
              <td class="score-cell">
                <div class="score-display">{{ item.learningAttitude }}</div>
              </td>
              <td class="score-cell">
                <div class="score-display">{{ item.knowledgeMastery }}</div>
              </td>
              <td class="score-cell">
                <div class="score-display">{{ item.learningMethod }}</div>
              </td>
              <td class="score-cell">
                <div class="score-display">{{ item.learningEffect }}</div>
              </td>
              <td class="total-score">
                <div class="total-score-display">{{ item.totalScore }}</div>
              </td>
              <td class="actions">
                <button class="view-btn" @click="viewDetail(item)">查看</button>
                <button class="edit-btn" @click="editEvaluation(item)">编辑</button>
                <button class="delete-btn" @click="deleteEvaluation(item)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 新增/编辑评价弹窗 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEdit ? '编辑评价' : '新增评价' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEvaluation">
            <div class="form-row">
              <div class="form-group">
                <label>课程名称 *</label>
                <select v-model="formData.courseName" required>
                  <option value="">请选择课程</option>
                  <option v-for="course in courseOptions" :key="course.value" :value="course.label">
                    {{ course.label }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>学期 *</label>
                <select v-model="formData.semester" required>
                  <option value="">请选择学期</option>
                  <option v-for="semester in semesterOptions" :key="semester.value" :value="semester.label">
                    {{ semester.label }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>学习态度评分 *</label>
                <div class="rating-input">
                  <input type="range" v-model="formData.learningAttitude" min="1" max="5" step="0.1" />
                  <span class="rating-value">{{ formData.learningAttitude }}</span>
                </div>
              </div>
              <div class="form-group">
                <label>知识掌握评分 *</label>
                <div class="rating-input">
                  <input type="range" v-model="formData.knowledgeMastery" min="1" max="5" step="0.1" />
                  <span class="rating-value">{{ formData.knowledgeMastery }}</span>
                </div>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>学习方法评分 *</label>
                <div class="rating-input">
                  <input type="range" v-model="formData.learningMethod" min="1" max="5" step="0.1" />
                  <span class="rating-value">{{ formData.learningMethod }}</span>
                </div>
              </div>
              <div class="form-group">
                <label>学习效果评分 *</label>
                <div class="rating-input">
                  <input type="range" v-model="formData.learningEffect" min="1" max="5" step="0.1" />
                  <span class="rating-value">{{ formData.learningEffect }}</span>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>学习自我评价内容 *</label>
              <textarea 
                v-model="formData.evaluationContent" 
                placeholder="请详细描述您在本课程的学习情况，包括学习态度、知识掌握程度、学习方法和效果等..."
                rows="4"
                required
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>学习改进计划</label>
              <textarea 
                v-model="formData.improvementPlan" 
                placeholder="请描述您计划如何改进学习方法和效果..."
                rows="3"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="closeModal">取消</button>
          <button type="button" class="btn-primary" @click="saveEvaluation">保存</button>
        </div>
      </div>
    </div>

    <!-- 查看详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>评价详情</h3>
          <button class="close-btn" @click="closeDetailModal">×</button>
        </div>
        <div class="modal-body">
          <div class="detail-content">
            <div class="detail-section">
              <h4>基本信息</h4>
              <div class="detail-row">
                <span class="label">课程名称：</span>
                <span class="value">{{ selectedItem?.courseName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">学期：</span>
                <span class="value">{{ selectedItem?.semester }}</span>
              </div>
              <div class="detail-row">
                <span class="label">评价时间：</span>
                <span class="value">{{ selectedItem?.evaluationTime }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>评分详情</h4>
              <div class="scores-grid">
                <div class="score-item">
                  <span class="score-label">学习态度：</span>
                  <span class="score-value">{{ selectedItem?.learningAttitude }}分</span>
                </div>
                <div class="score-item">
                  <span class="score-label">知识掌握：</span>
                  <span class="score-value">{{ selectedItem?.knowledgeMastery }}分</span>
                </div>
                <div class="score-item">
                  <span class="score-label">学习方法：</span>
                  <span class="score-value">{{ selectedItem?.learningMethod }}分</span>
                </div>
                <div class="score-item">
                  <span class="score-label">学习效果：</span>
                  <span class="score-value">{{ selectedItem?.learningEffect }}分</span>
                </div>
                <div class="score-item total">
                  <span class="score-label">综合评分：</span>
                  <span class="score-value">{{ selectedItem?.totalScore }}分</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>学习评价内容</h4>
              <div class="content-text">{{ selectedItem?.evaluationContent }}</div>
            </div>
            
            <div v-if="selectedItem?.improvementPlan" class="detail-section">
              <h4>学习改进计划</h4>
              <div class="content-text">{{ selectedItem?.improvementPlan }}</div>
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
  semester: '',
  course: '',
  search: ''
})

// 选项数据
const semesterOptions = ref([
  { value: '2025-1', label: '2025年春季学期' },
  { value: '2024-2', label: '2024年秋季学期' },
  { value: '2024-1', label: '2024年春季学期' },
  { value: '2023-2', label: '2023年秋季学期' }
])

const courseOptions = ref([
  { value: 'course1', label: '老年心理学' },
  { value: 'course2', label: '康复护理实务' },
  { value: 'course3', label: '智能健康监测系统' },
  { value: 'course4', label: '适老化环境设计' },
  { value: 'course5', label: '老年社会学' },
  { value: 'course6', label: '老年营养与膳食' },
  { value: 'course7', label: '安宁疗护与临终关怀' },
  { value: 'course8', label: '常见老年病预防与照护' },
  { value: 'course9', label: '智慧养老平台运营' },
  { value: 'course10', label: '老年人活动策划与组织' }
])

// 原始数据
const rawData = ref([
  {
    id: 1,
    courseName: '老年心理学',
    semester: '2025年春季学期',
    evaluationTime: '2025-05-15',
    learningAttitude: 4.8,
    knowledgeMastery: 4.5,
    learningMethod: 4.2,
    learningEffect: 4.6,
    totalScore: 4.53,
    evaluationContent: '本学期在老年心理学课程学习中，我保持了极高的学习热情。通过多次去社区养老中心调研，深入理解了老年人常见的孤独感、失落感等心理特征，并掌握了基本的心理疏导技巧。',
    improvementPlan: '计划在实习中更多地与老人交流，积累真实案例，提升共情能力和心理干预的实操水平。'
  },
  {
    id: 2,
    courseName: '智能健康监测系统',
    semester: '2025年春季学期',
    evaluationTime: '2025-04-20',
    learningAttitude: 4.5,
    knowledgeMastery: 4.2,
    learningMethod: 4.6,
    learningEffect: 4.4,
    totalScore: 4.43,
    evaluationContent: '通过理论结合实训设备的学习，我熟练掌握了各种适老化智能传感设备（如生命体征监测床垫、防跌倒雷达）的操作和数据分析。对智慧康养物联网架构有了清晰的认知。',
    improvementPlan: '进一步探索智能设备在不同慢性病场景下的个性化监测方案设置，关注前沿康养科技产品。'
  },
  {
    id: 3,
    courseName: '康复护理实务',
    semester: '2024年秋季学期',
    evaluationTime: '2024-12-10',
    learningAttitude: 4.9,
    knowledgeMastery: 4.6,
    learningMethod: 4.5,
    learningEffect: 4.7,
    totalScore: 4.68,
    evaluationContent: '实操性很强的一门课，我已经能够非常熟练地完成老人的体位转移、轮椅使用、吞咽障碍辅助进食等核心康复护理操作。在模拟病房的考核中表现优异。',
    improvementPlan: '力量和技巧还有待提升，计划多进行实操练习，加强人体力学运用，避免在护理中对老人或自己造成二次伤害。'
  },
  {
    id: 4,
    courseName: '常见老年病预防与照护',
    semester: '2024年秋季学期',
    evaluationTime: '2024-11-25',
    learningAttitude: 4.4,
    knowledgeMastery: 4.3,
    learningMethod: 4.2,
    learningEffect: 4.1,
    totalScore: 4.25,
    evaluationContent: '对高血压、糖尿病、阿尔茨海默症等典型老年性病理机制有了系统学习。掌握了发病征兆观察和日常照护规范，但在应对突发急性合并症的预案处理上稍显生疏。',
    improvementPlan: '结合相关急救培训（如CPR），增强在复杂病理情况下的应急处理能力和照护敏锐度。'
  },
  {
    id: 5,
    courseName: '适老化环境设计',
    semester: '2024年春季学期',
    evaluationTime: '2024-06-15',
    learningAttitude: 4.6,
    knowledgeMastery: 4.4,
    learningMethod: 4.5,
    learningEffect: 4.5,
    totalScore: 4.50,
    evaluationContent: '通过课程学习，我深刻认识到了居家及机构环境适老化改造的重要性。从无障碍通道规划到防滑地材选择，再到暖色调照明设计，具备了独立给出改造方案的能力。',
    improvementPlan: '多参与实际环境评估项目，结合老年人的经济情况提供更具成本效益的改造设计建议。'
  },
  {
    id: 6,
    courseName: '老年营养与膳食',
    semester: '2024年春季学期',
    evaluationTime: '2024-05-10',
    learningAttitude: 4.3,
    knowledgeMastery: 4.1,
    learningMethod: 4.2,
    learningEffect: 4.0,
    totalScore: 4.15,
    evaluationContent: '课程中重点学习了如何为吞咽困难及患有慢病的老人制作易消化、营养均衡的流质或半流质饮食，营养学基础有一定的提高。',
    improvementPlan: '希望能加强不同地域饮食文化相关的膳食搭配学习，为养老机构提供更人性化的菜单建议。'
  }
])

// 弹窗相关
const showModal = ref(false)
const showDetailModal = ref(false)
const isEdit = ref(false)
const selectedItem = ref(null)

// 表单数据
const formData = ref({
  courseName: '',
  semester: '',
  learningAttitude: 4.0,
  knowledgeMastery: 4.0,
  learningMethod: 4.0,
  learningEffect: 4.0,
  evaluationContent: '',
  improvementPlan: ''
})

// 计算属性
const filteredData = computed(() => {
  let result = rawData.value

  if (filters.value.semester) {
    result = result.filter(item => item.semester.includes(filters.value.semester))
  }

  if (filters.value.course) {
    result = result.filter(item => item.courseName.includes(filters.value.course))
  }

  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    result = result.filter(item => 
      item.courseName.toLowerCase().includes(searchLower) ||
      item.evaluationContent.toLowerCase().includes(searchLower)
    )
  }

  return result
})

const totalEvaluations = computed(() => rawData.value.length)

const averageScore = computed(() => {
  if (rawData.value.length === 0) return 0
  const total = rawData.value.reduce((sum, item) => sum + item.totalScore, 0)
  return (total / rawData.value.length).toFixed(1)
})

const improvementRate = computed(() => {
  // 模拟改进率计算
  return 85
})

// 事件处理
const handleFilterChange = () => {
  // 筛选逻辑已在计算属性中处理
}

const handleSearchInput = () => {
  // 搜索逻辑已在计算属性中处理
}

const showAddModal = () => {
  isEdit.value = false
  formData.value = {
    courseName: '',
    semester: '',
    learningAttitude: 4.0,
    knowledgeMastery: 4.0,
    learningMethod: 4.0,
    learningEffect: 4.0,
    evaluationContent: '',
    improvementPlan: ''
  }
  showModal.value = true
}

const editEvaluation = (item) => {
  isEdit.value = true
  formData.value = { ...item }
  showModal.value = true
}

const viewDetail = (item) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const deleteEvaluation = (item) => {
  if (confirm('确定要删除这条评价记录吗？')) {
    const index = rawData.value.findIndex(d => d.id === item.id)
    if (index > -1) {
      rawData.value.splice(index, 1)
    }
  }
}

const saveEvaluation = () => {
  // 计算综合评分
  const totalScore = (
    parseFloat(formData.value.learningAttitude) +
    parseFloat(formData.value.knowledgeMastery) +
    parseFloat(formData.value.learningMethod) +
    parseFloat(formData.value.learningEffect)
  ) / 4

  const evaluationData = {
    ...formData.value,
    totalScore: totalScore.toFixed(2),
    evaluationTime: new Date().toISOString().split('T')[0]
  }

  if (isEdit.value) {
    // 编辑模式
    const index = rawData.value.findIndex(d => d.id === selectedItem.value.id)
    if (index > -1) {
      rawData.value[index] = { ...rawData.value[index], ...evaluationData }
    }
  } else {
    // 新增模式
    evaluationData.id = Date.now()
    rawData.value.unshift(evaluationData)
  }

  closeModal()
}

const closeModal = () => {
  showModal.value = false
  selectedItem.value = null
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedItem.value = null
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.self-evaluation-page {
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

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stats-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-icon {
  font-size: 32px;
}

.stats-content {
  flex: 1;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: #6b7280;
}

/* 数据表格区域 */
.data-table-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.table-header h3 {
  margin: 0;
  color: #374151;
  font-size: 18px;
}

.add-evaluation-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.add-evaluation-btn:hover {
  background: #2563eb;
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

.course-name {
  font-weight: 600;
  color: #1f2937;
}

.semester {
  color: #6b7280;
}

.evaluation-time {
  color: #6b7280;
}

.score-cell {
  text-align: center;
}

.score-display {
  font-weight: 600;
  color: #059669;
  font-size: 16px;
}

.total-score {
  text-align: center;
}

.total-score-display {
  font-weight: 700;
  color: #1f2937;
  font-size: 18px;
}

.actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.view-btn,
.edit-btn,
.delete-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.view-btn {
  background: #3b82f6;
  color: white;
}

.view-btn:hover {
  background: #2563eb;
}

.edit-btn {
  background: #f59e0b;
  color: white;
}

.edit-btn:hover {
  background: #d97706;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
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
  max-width: 800px;
  max-height: 90vh;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #374151;
}

.form-group select,
.form-group textarea {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-input input[type="range"] {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
}

.rating-input input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}

.rating-value {
  font-weight: 600;
  color: #3b82f6;
  min-width: 30px;
  text-align: center;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary,
.btn-primary {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

/* 详情弹窗样式 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 16px;
  font-weight: 600;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.detail-row .label {
  font-weight: 500;
  color: #6b7280;
  min-width: 100px;
}

.detail-row .value {
  color: #374151;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.score-item.total {
  background: #eff6ff;
  border: 1px solid #3b82f6;
}

.score-label {
  font-weight: 500;
  color: #374151;
}

.score-value {
  font-weight: 600;
  color: #059669;
  font-size: 16px;
}

.score-item.total .score-value {
  color: #3b82f6;
  font-size: 18px;
}

.content-text {
  background: #f9fafb;
  padding: 16px;
  border-radius: 6px;
  line-height: 1.6;
  color: #374151;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .self-evaluation-page {
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
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .scores-grid {
    grid-template-columns: 1fr;
  }
}
</style>
