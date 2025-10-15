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
  { value: '2024-1', label: '2024年春季学期' },
  { value: '2023-2', label: '2023年秋季学期' },
  { value: '2023-1', label: '2023年春季学期' },
  { value: '2022-2', label: '2022年秋季学期' }
])

const courseOptions = ref([
  { value: 'course1', label: '数据结构与算法' },
  { value: 'course2', label: '操作系统原理' },
  { value: 'course3', label: '数据库系统原理' },
  { value: 'course4', label: '计算机网络' },
  { value: 'course5', label: '软件工程' },
  { value: 'course6', label: '计算机组成原理' },
  { value: 'course7', label: '人工智能基础' },
  { value: 'course8', label: '编译原理' },
  { value: 'course9', label: 'Web开发技术' },
  { value: 'course10', label: '软件测试' }
])

// 原始数据
const rawData = ref([
  {
    id: 1,
    courseName: '数据结构与算法',
    semester: '2024年春季学期',
    evaluationTime: '2024-03-15',
    learningAttitude: 4.5,
    knowledgeMastery: 4.2,
    learningMethod: 4.0,
    learningEffect: 4.3,
    totalScore: 4.25,
    evaluationContent: '本学期在数据结构与算法课程学习中，我保持了积极的学习态度，认真完成作业和实验。通过大量编程实践，对基本数据结构有了较好的理解，但在算法复杂度分析方面还需要加强。',
    improvementPlan: '计划在下学期增加更多算法练习，特别是动态规划和图算法，同时加强数学基础的学习，提高算法分析能力。'
  },
  {
    id: 2,
    courseName: '操作系统原理',
    semester: '2024年春季学期',
    evaluationTime: '2024-03-20',
    learningAttitude: 4.3,
    knowledgeMastery: 4.1,
    learningMethod: 4.2,
    learningEffect: 4.0,
    totalScore: 4.15,
    evaluationContent: '操作系统课程内容较为抽象，我通过阅读教材、观看视频和完成实验来学习。对进程管理、内存管理等核心概念有了基本理解，但在系统调用和内核机制方面还需要深入学习。',
    improvementPlan: '计划通过阅读更多技术文档和开源代码，加深对操作系统底层机制的理解，同时多做实验来巩固理论知识。'
  },
  {
    id: 3,
    courseName: '数据库系统原理',
    semester: '2023年秋季学期',
    evaluationTime: '2023-12-10',
    learningAttitude: 4.6,
    knowledgeMastery: 4.4,
    learningMethod: 4.5,
    learningEffect: 4.3,
    totalScore: 4.45,
    evaluationContent: '数据库课程学习效果良好，通过理论学习和实践操作，对SQL语言、数据库设计和事务处理有了较好的掌握。能够独立完成数据库设计和查询优化。',
    improvementPlan: '继续保持当前的学习方法，计划学习更多高级数据库技术，如分布式数据库和NoSQL数据库。'
  },
  {
    id: 4,
    courseName: '计算机网络',
    semester: '2024年春季学期',
    evaluationTime: '2024-04-05',
    learningAttitude: 4.0,
    knowledgeMastery: 3.8,
    learningMethod: 4.1,
    learningEffect: 3.9,
    totalScore: 3.95,
    evaluationContent: '计算机网络课程涉及大量协议和概念，我通过绘制网络拓扑图和实验来理解各种协议的工作原理。对TCP/IP协议栈有了基本认识，但在网络安全和性能优化方面还需要加强。',
    improvementPlan: '计划通过搭建小型网络实验环境，深入理解各种网络协议的实际应用，同时学习网络安全相关知识。'
  },
  {
    id: 5,
    courseName: '软件工程',
    semester: '2023年秋季学期',
    evaluationTime: '2023-11-25',
    learningAttitude: 4.4,
    knowledgeMastery: 4.3,
    learningMethod: 4.2,
    learningEffect: 4.1,
    totalScore: 4.25,
    evaluationContent: '软件工程课程让我学会了系统性的软件开发方法，通过团队项目实践，掌握了需求分析、系统设计、编码实现和测试的完整流程。对敏捷开发方法有了深入理解。',
    improvementPlan: '计划学习更多项目管理工具和版本控制技术，提高团队协作能力，同时关注软件质量保证和持续集成。'
  },
  {
    id: 6,
    courseName: '数据结构与算法',
    semester: '2023年秋季学期',
    evaluationTime: '2023-10-15',
    learningAttitude: 4.2,
    knowledgeMastery: 3.9,
    learningMethod: 3.8,
    learningEffect: 3.7,
    totalScore: 3.9,
    evaluationContent: '上学期刚开始学习数据结构时，对抽象概念理解不够深入，通过大量练习和同学讨论，逐渐掌握了基本数据结构的实现和应用。在算法设计方面还需要更多练习。',
    improvementPlan: '计划通过刷题网站加强算法练习，特别是排序、查找和递归算法，同时学习更多高级数据结构如红黑树、B树等。'
  },
  {
    id: 7,
    courseName: '计算机组成原理',
    semester: '2023年春季学期',
    evaluationTime: '2023-06-20',
    learningAttitude: 4.1,
    knowledgeMastery: 4.0,
    learningMethod: 3.9,
    learningEffect: 3.8,
    totalScore: 3.95,
    evaluationContent: '计算机组成原理课程让我了解了计算机硬件的基本工作原理，通过实验和仿真，对CPU、内存、I/O系统有了直观认识。在指令集和流水线技术方面还需要进一步学习。',
    improvementPlan: '计划通过阅读计算机体系结构相关书籍，深入学习现代处理器的设计原理，同时关注并行计算和GPU编程。'
  },
  {
    id: 8,
    courseName: '人工智能基础',
    semester: '2024年春季学期',
    evaluationTime: '2024-04-18',
    learningAttitude: 4.7,
    knowledgeMastery: 4.2,
    learningMethod: 4.5,
    learningEffect: 4.3,
    totalScore: 4.43,
    evaluationContent: '人工智能课程内容非常有趣，我通过实践项目学习了机器学习的基本算法，对神经网络、深度学习有了初步了解。能够使用Python实现简单的机器学习模型。',
    improvementPlan: '计划深入学习深度学习框架如TensorFlow和PyTorch，同时关注自然语言处理和计算机视觉等应用领域。'
  },
  {
    id: 9,
    courseName: '编译原理',
    semester: '2023年秋季学期',
    evaluationTime: '2023-12-05',
    learningAttitude: 3.8,
    knowledgeMastery: 3.6,
    learningMethod: 3.7,
    learningEffect: 3.5,
    totalScore: 3.65,
    evaluationContent: '编译原理课程理论性较强，对词法分析、语法分析、语义分析等概念理解不够深入。通过课程设计实现了一个简单的编译器，但功能还比较基础。',
    improvementPlan: '计划重新学习编译原理的理论知识，通过实现更复杂的编译器功能来加深理解，同时学习现代编译器技术。'
  },
  {
    id: 10,
    courseName: 'Web开发技术',
    semester: '2024年春季学期',
    evaluationTime: '2024-05-10',
    learningAttitude: 4.6,
    knowledgeMastery: 4.4,
    learningMethod: 4.3,
    learningEffect: 4.5,
    totalScore: 4.45,
    evaluationContent: 'Web开发课程让我掌握了前端和后端开发的基本技能，通过项目实践学会了HTML、CSS、JavaScript和Node.js等技术。能够独立开发简单的Web应用。',
    improvementPlan: '计划学习更多前端框架如React和Vue.js，同时关注Web性能优化和安全性，准备学习微服务架构。'
  },
  {
    id: 11,
    courseName: '软件测试',
    semester: '2023年春季学期',
    evaluationTime: '2023-05-25',
    learningAttitude: 4.0,
    knowledgeMastery: 3.9,
    learningMethod: 4.1,
    learningEffect: 3.8,
    totalScore: 3.95,
    evaluationContent: '软件测试课程让我了解了软件质量保证的重要性，学习了各种测试方法和工具。通过实践项目，掌握了单元测试、集成测试和系统测试的基本流程。',
    improvementPlan: '计划深入学习自动化测试工具和持续集成技术，同时关注性能测试和安全测试，提高软件质量保证能力。'
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
