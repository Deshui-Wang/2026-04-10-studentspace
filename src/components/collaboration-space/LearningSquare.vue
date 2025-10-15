<template>
  <div class="learning-square">
    
    <div class="filter-tabs">
      <button 
        v-for="tab in filterTabs" 
        :key="tab.key"
        class="filter-tab"
        :class="{ active: activeFilter === tab.key }"
        @click="activeFilter = tab.key"
      >
        {{ tab.name }}
      </button>
      <button class="publish-button" @click="openProjectFormModal">
        发布协作项目
      </button>
    </div>

    <div class="lanes-container">
      <div v-for="lane in filteredLanes" :key="lane.id" class="lane">
        <div class="lane-header">
          <span class="lane-title">{{ lane.name }}</span>
          <span class="lane-count">{{ lane.cards.length }}</span>
        </div>
        <div class="lane-cards">
          <div 
            v-for="card in lane.cards" 
            :key="card.id"
            class="card"
            :class="[`card-${card.type}`, { 'has-image': card.hasImage }]"
          >
            <div class="card-header">
              <div class="card-type-badge">{{ getTypeName(card.type) }}</div>
              <div class="card-meta">
                <span class="card-status" :class="getStatusClass(card.status)">{{ card.status }}</span>
              </div>
            </div>
            
            <div class="card-content">
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-text">{{ card.content }}</p>
            </div>
            
            <div v-if="card.hasImage" class="card-image">
              <img class="card-img" :src="card.imageUrl" alt="配图" loading="lazy" />
            </div>
            
            <div class="card-footer">
              <div class="author">
                <span class="author-avatar">{{ card.author.charAt(0) }}</span>
                <span class="author-name">{{ card.author }}</span>
              </div>
              <span class="publish-time">{{ card.publishTime }}</span>
            </div>

            <div class="card-progress-bar">
              <div 
                class="progress-bar-fill" 
                :style="{ width: card.progress + '%' }"
                :class="{ 
                  'progress-not-started': card.progress === 0,
                  'progress-in-progress': card.progress > 0 && card.progress < 100,
                  'progress-completed': card.progress === 100
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增：发布协作项目表单弹窗 -->
    <div v-if="showProjectFormModal" class="project-form-modal-overlay" @click.self="handleProjectFormCancel">
      <div class="project-form-modal">
        <h3 class="project-form-modal-title">发布协作项目</h3>
        <form @submit.prevent="handleProjectFormSubmit">
          <div class="form-group">
            <label>项目类型 <span class="required">*</span></label>
            <div class="type-select">
              <button
                type="button"
                v-for="option in publishOptions"
                :key="option.key"
                class="type-option"
                :class="{ selected: projectForm.type === option.key }"
                @click="projectForm.type = option.key"
              >
                {{ option.name }}
              </button>
            </div>
          </div>
          <div class="form-group">
            <label for="project-title">项目标题 <span class="required">*</span></label>
            <input type="text" id="project-title" v-model="projectForm.title" required placeholder="请输入项目标题">
          </div>
          <div class="form-group">
            <label for="project-description">背景描述</label>
            <textarea id="project-description" v-model="projectForm.description" rows="3" placeholder="请输入项目背景描述"></textarea>
          </div>
          <div class="form-group-row">
            <div class="form-group">
              <label for="project-cover">背景图</label>
              <input type="file" id="project-cover" class="file-input">
            </div>
            <div class="form-group">
              <label for="project-attachments">附件</label>
              <input type="file" id="project-attachments" class="file-input" multiple>
            </div>
          </div>
          <div class="form-group">
            <label>协作教师</label>
            <div class="teacher-select">
              <div v-for="teacher in teacherList" :key="teacher.id" 
                   class="teacher-option" 
                   :class="{ selected: projectForm.collaborators.includes(teacher.id) }"
                   @click="toggleTeacherSelection(teacher.id)">
                {{ teacher.name }}
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="project-due-date">交付日期</label>
            <input type="date" id="project-due-date" v-model="projectForm.dueDate">
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-cancel" @click="handleProjectFormCancel">取消</button>
            <button type="submit" class="btn btn-submit">确定</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'

const showProjectFormModal = ref(false)

const projectForm = reactive({
  type: '',
  title: '',
  description: '',
  coverImage: null,
  attachments: [],
  collaborators: [],
  dueDate: ''
})

const teacherList = [
  { id: 1, name: '张志明' },
  { id: 2, name: '李袁文' },
  { id: 3, name: '王刘昶' },
  { id: 4, name: '陈雨燕' },
  { id: 5, name: '刘明奇' },
  { id: 6, name: '赵远舟' },
  { id: 7, name: '孙海' },
  { id: 8, name: '周杰' }
]

const publishOptions = [
  { key: 'teaching', name: '协同备课' },
  { key: 'activity', name: '协同听评课' },
  { key: 'ai', name: '资源开发与共享' },
  { key: 'workflow', name: '学生发展与评价' },
  { key: 'professional', name: '专业学习与成长' }
]

const openProjectFormModal = () => {
  // Reset form
  Object.assign(projectForm, {
    type: '',
    title: '',
    description: '',
    coverImage: null,
    attachments: [],
    collaborators: [],
    dueDate: ''
  });
  showProjectFormModal.value = true;
}

const toggleTeacherSelection = (teacherId) => {
  const index = projectForm.collaborators.indexOf(teacherId)
  if (index === -1) {
    projectForm.collaborators.push(teacherId)
  } else {
    projectForm.collaborators.splice(index, 1)
  }
}

const handleProjectFormCancel = () => {
  showProjectFormModal.value = false
}

const handleProjectFormSubmit = () => {
  if (!projectForm.type) {
    alert('请选择项目类型')
    return
  }
  if (!projectForm.title.trim()) {
    alert('请输入项目标题')
    return
  }
  console.log('提交的项目数据:', JSON.parse(JSON.stringify(projectForm)))
  showProjectFormModal.value = false
  alert('发布成功！')
}

// 卡片类型定义
const cardTypes = {
  teaching: '协同备课',
  activity: '协同听评课', 
  ai: '资源开发与共享',
  workflow: '学生发展与评价',
  professional: '专业学习与成长'
}

// 筛选标签
const filterTabs = [
  { key: 'all', name: '全部' },
  { key: 'teaching', name: '协同备课' },
  { key: 'activity', name: '协同听评课' },
  { key: 'ai', name: '资源开发与共享' },
  { key: 'workflow', name: '学生发展与评价' },
  { key: 'professional', name: '专业学习与成长' }
]

// 学习广场图片素材（来自 public/pic/learning）
const learningImages = [
  '0f0.jpeg',
  '84.png',
  '24.png',
  '42.jpeg',
  '20.jpeg',
  '97.png',
  '68.jpg',
  '212.jpg',
  '808.jpg',
  '814.jpg',
  'banner3.jpeg',
  'banner1.png',
  'banner2.png'
]

const activeFilter = ref('all')

const lanes = ref([
  { id: 'not-started', name: '未开始', cards: [] },
  { id: 'in-progress', name: '进行中', cards: [] },
  { id: 'in-review', name: '验收中', cards: [] },
  { id: 'completed', name: '已完成', cards: [] }
])

// 生成并分配卡片数据
const generateAndAssignCards = () => {
  const titles = {
    teaching: [
      '人工智能课程设计',
      '电商智能体课件开发',
      'AI数字人应用技术教案',
      '数字人应用与技术课件开发', 
      '智能体开发的教学设计',
      '多语言大模型应用与实训教案设计'
    ],
    activity: [
      '大数据基座课程观摩',
      '数据治理公开课巡讲',
      '人工智能与数据基础公开课',
      '人工智能教学研讨专题巡讲',
      '教师发展培训活动总结',
      '教学成果展示活动策划'
    ],
    ai: [
      '基于ChatGPT的智能助教系统开发',
      'AI辅助课程设计工具应用',
      '智能学习分析系统构建',
      '虚拟实验室环境搭建',
      '智能题库生成系统设计',
      'AI驱动的个性化学习路径'
    ],
    workflow: [
      '教学管理流程数字化改造',
      '课程资源管理系统优化',
      '学生成绩分析工作流设计',
      '教学质量监控流程建立',
      '教师考核评价体系流程',
      '教学档案管理标准化流程'
    ],
    professional: [
      'Agent开发与实训教案设计',
      '多语言大模型应用与实训教案设计',
      '智能体开发的教学设计',
      '大模型应用与实训教案设计',
      '智能体开发的教学设计',
    ]
  }
  
  const contents = {
    teaching: [
      '在课程思政建设中，我们需要将思想政治教育元素有机融入专业课程教学中，通过案例教学、情境教学等方式，让学生在专业知识学习过程中潜移默化地接受思想政治教育...',
      '项目学习法是一种以学生为中心的教学方法，通过真实或模拟的项目任务，让学生在实践中学习知识、培养能力。本文分享了在计算机专业课程中应用项目学习法的具体实践...',
      '混合式教学结合了传统面对面教学和在线学习的优势，通过课前预习、课中互动、课后巩固的完整学习闭环，提高教学效果和学生参与度...',
      '提高学生课堂参与度是每位教师都面临的挑战。通过设计互动环节、采用小组讨论、引入案例分析等方式，可以有效激发学生的学习兴趣和主动性...',
      '教学评价体系的改革是提高教学质量的重要保障。建立多元化的评价标准，注重过程性评价，关注学生的全面发展，是当前教学改革的重要方向...',
      '将课程内容与学生的职业发展需求相结合，是提高教学实用性的重要途径。通过行业调研、企业合作等方式，确保教学内容与职业要求相匹配...'
    ],
    activity: [
      '参加教学技能大赛是一次难得的学习和提升机会。通过比赛，不仅锻炼了教学技能，更重要的是与其他优秀教师的交流学习，开阔了教学视野...',
      '指导学生创新创业项目是教师的重要职责。通过建立导师制度、提供专业指导、搭建实践平台等方式，帮助学生将创新想法转化为实际项目...',
      '校企合作是提高人才培养质量的重要途径。通过与企业建立深度合作关系，为学生提供实习实训机会，同时了解行业最新发展动态...',
      '教学观摩活动是教师相互学习的重要平台。通过观摩优秀教师的教学过程，学习先进的教学方法和技巧，提升自身的教学水平...',
      '教师发展培训是提升教师专业能力的重要途径。通过参加各类培训活动，更新教育理念，学习新的教学方法和技术手段...',
      '教学成果展示活动是展示教师教学成果的重要平台。通过精心策划和组织，展示教师在教学改革、课程建设等方面取得的成果...'
    ],
    ai: [
      '智能助教系统是人工智能技术在教育领域的重要应用。通过集成ChatGPT等大语言模型，可以为学生提供个性化的学习辅导和答疑服务...',
      'AI辅助课程设计工具能够帮助教师更高效地设计课程内容。通过分析学习数据、生成教学资源、优化教学流程等方式，提升课程设计质量...',
      '智能学习分析系统通过收集和分析学生的学习数据，为教师提供学生的学习情况分析报告，帮助教师更好地了解学生的学习状态...',
      '虚拟实验室环境为学生提供了安全、便捷的实验学习平台。通过3D建模、虚拟现实等技术，学生可以在虚拟环境中进行各种实验操作...',
      '智能题库生成系统能够根据教学大纲和知识点要求，自动生成符合教学需要的题目，提高题库建设的效率和质量...',
      'AI驱动的个性化学习路径能够根据学生的学习特点和进度，为其推荐最适合的学习内容和路径，提高学习效果...'
    ],
    workflow: [
      '教学管理流程的数字化改造是提高管理效率的重要手段。通过引入信息化管理系统，实现教学管理的标准化、规范化和高效化...',
      '课程资源管理系统是教学资源建设的重要支撑。通过建立统一的资源管理平台，实现教学资源的共享、管理和优化配置...',
      '学生成绩分析工作流能够帮助教师更好地了解学生的学习情况。通过建立数据分析模型，为教学决策提供科学依据...',
      '教学质量监控流程是保障教学质量的重要机制。通过建立多层次的监控体系，及时发现和解决教学中的问题...',
      '教师考核评价体系流程是教师管理的重要组成部分。通过建立科学的评价标准和方法，激励教师不断提升教学水平...',
      '教学档案管理标准化流程是教学管理规范化的重要体现。通过建立统一的档案管理标准，确保教学档案的完整性和规范性...'
    ],
    professional: [
      '大模型应用与实训教案设计是提高教学质量的重要途径。通过引入大模型技术，实现教学资源的共享、管理和优化配置...',
      '智能体开发的教学设计是提高教学质量的重要途径。通过引入智能体技术，实现教学资源的共享、管理和优化配置...',
      '多语言大模型应用与实训教案设计是提高教学质量的重要途径。通过引入多语言大模型技术，实现教学资源的共享、管理和优化配置...'
    ]
  }
  
  const authors = ['张志明', '李袁文', '王刘昶', '陈雨燕', '刘明奇', '赵远舟', '孙海', '周杰']
  
  const createCard = (progress) => {
    const cardTypeKeys = Object.keys(cardTypes)
    const type = cardTypeKeys[Math.floor(Math.random() * cardTypeKeys.length)]
    const titleIndex = Math.floor(Math.random() * titles[type].length)
    const contentIndex = Math.floor(Math.random() * contents[type].length)
    const withImage = Math.random() > 0.6
    
    const statuses = ['正常', '提前', '延期', '暂停']
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    // 生成随机日期
    const startDate = new Date('2025-08-01').getTime()
    const endDate = new Date('2025-09-01').getTime()
    const randomDate = new Date(startDate + Math.random() * (endDate - startDate))
    const formattedDate = randomDate.toISOString().split('T')[0]
    
    return {
      id: Date.now() + Math.random(),
      type,
      title: titles[type][titleIndex],
      content: contents[type][contentIndex],
      author: authors[Math.floor(Math.random() * authors.length)],
      publishTime: formattedDate,
      status,
      hasImage: withImage,
      imageUrl: withImage ? `/pic/learning/${learningImages[Math.floor(Math.random() * learningImages.length)]}` : '',
      progress
    }
  }

  // 重置泳道
  lanes.value.forEach(lane => lane.cards = [])

  // 2条未开始
  for (let i = 0; i < 2; i++) {
    lanes.value[0].cards.push(createCard(0))
  }
  // 5条进行中
  for (let i = 0; i < 5; i++) {
    lanes.value[1].cards.push(createCard(Math.floor(Math.random() * 89) + 1)) // 1-89
  }
  // 3条验收中
  for (let i = 0; i < 3; i++) {
    lanes.value[2].cards.push(createCard(Math.floor(Math.random() * 10) + 90)) // 90-99
  }
  // 8条已完成
  for (let i = 0; i < 8; i++) {
    lanes.value[3].cards.push(createCard(100))
  }

  // 打乱每个泳道内部的卡片顺序
  lanes.value.forEach(lane => {
    for (let i = lane.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lane.cards[i], lane.cards[j]] = [lane.cards[j], lane.cards[i]];
    }
  })
}

// 获取类型名称
const getTypeName = (type) => {
  return cardTypes[type] || type
}

const getStatusClass = (status) => {
  switch (status) {
    case '正常': return 'status-normal'
    case '提前': return 'status-ahead'
    case '延期': return 'status-delayed'
    case '暂停': return 'status-paused'
    default: return ''
  }
}

// 筛选泳道中的卡片
const filteredLanes = computed(() => {
  if (activeFilter.value === 'all') {
    return lanes.value
  }
  return lanes.value.map(lane => ({
    ...lane,
    cards: lane.cards.filter(card => card.type === activeFilter.value)
  }))
})

// 初始化
onMounted(() => {
  generateAndAssignCards()
})
</script>

<style scoped>
.learning-square {
  min-height: 90vh;
  padding: 24px;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 10px;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.filter-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;
  position: relative;
}

.publish-button {
  padding: 8px 20px;
  border: 1px solid #5856d6;
  background: #5856d6;
  color: #fff;
  border-radius: 7px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  margin-left: auto; /* 将按钮推到右侧 */
}

.publish-button:hover {
  background: #4d4bbf;
  border-color: #4d4bbf;
}

.filter-tab {
  padding: 8px 20px;
  border: 1px solid #e0e6f1;
  background: #fff;
  color: #666;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  background: #f0f5ff;
  color: #5856d6;
  border-color: #5856d6;
}

.filter-tab.active {
  background: #5856d6;
  color: #fff;
  border-color: #5856d6;
}

.lanes-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: start;
  padding: 0 24px;
  max-width: 1440px;
  margin: 0 auto;
}

.lane {
  background-color: #f7f9fc;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 220px);
}

.lane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 2px solid #8b5cf6;
  position: sticky;
  top: 0;
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  z-index: 1;
}

.lane-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.lane-count {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background-color: #8b5cf6;
  padding: 2px 8px;
  border-radius: 12px;
}

.lane-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
  background-color: #fff;
}

.lane-cards::-webkit-scrollbar {
  width: 6px;
}
.lane-cards::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.lane-cards::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

/* 无图卡片更紧凑，整体更短以形成横向错落 */
.card:not(.has-image) {
  padding-top: 16px;
  padding-bottom: 16px;
}

.card:not(.has-image) .card-title {
  -webkit-line-clamp: 1;
}

.card:not(.has-image) .card-text {
  -webkit-line-clamp: 2;
}

.card:not(.has-image) .card-content {
  margin-bottom: 12px;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 不同类型卡片的背景色 */
.card-teaching {
  background: rgba(232, 245, 255, 0.8);
  border-color: rgba(88, 86, 214, 0.2);
}

.card-activity {
  background: rgba(255, 245, 232, 0.8);
  border-color: rgba(255, 149, 0, 0.2);
}

.card-ai {
  background: rgba(232, 255, 245, 0.8);
  border-color: rgba(52, 199, 89, 0.2);
}

.card-workflow {
  background: rgba(245, 232, 255, 0.8);
  border-color: rgba(175, 82, 222, 0.2);
}

.card-professional {
  background: rgba(255, 232, 240, 0.8);
  border-color: rgba(255, 45, 85, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
}

.card-teaching .card-type-badge {
  background: rgba(88, 86, 214, 0.8);
}

.card-activity .card-type-badge {
  background: rgba(255, 149, 0, 0.8);
}

.card-ai .card-type-badge {
  background: rgba(52, 199, 89, 0.8);
}

.card-workflow .card-type-badge {
  background: rgba(175, 82, 222, 0.8);
}

.card-professional .card-type-badge {
  background: rgba(255, 45, 85, 0.8);
}

.card-meta {
  display: flex;
  font-size: 12px;
}

.card-status {
  font-size: 12px;
  font-weight: 500;
}

.status-normal {
  color: #34c759; /* green */
}
.status-ahead {
  color: #5856d6; /* primary purple */
}
.status-delayed {
  color: #ff9500; /* orange */
}
.status-paused {
  color: #8e8e93; /* gray */
}

.card-content {
  flex: 1;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: flex;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-image {
  margin-bottom: 16px;
}

.card-img {
  width: 100%;
  height: 80px;
  background: #f0f2f5;
  border-radius: 8px;
  object-fit: cover;
  display: block;
}

.image-placeholder {
  width: 100%;
  height: 160px;
  background: linear-gradient(135deg, #f0f2f5, #e6e9ed);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  border: 2px dashed #ddd;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 24px;
  height: 24px;
  background: #5856d6;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
}

.author-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.publish-time {
  font-size: 12px;
  color: #999;
}

.card-progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e0e6f1;
  border-radius: 3px;
  margin-top: 16px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-not-started {
  background-color: #d1d5db; /* gray */
}

.progress-in-progress {
  background-color: #5856d6; /* primary purple */
}

.progress-completed {
  background-color: #34c759; /* green */
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f2f5;
  border-top: 3px solid #5856d6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .lanes-container {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 16px; /* for scrollbar */
  }
  .lanes-container::-webkit-scrollbar {
    height: 8px;
  }
  .lanes-container::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  .lane {
    flex: 0 0 320px;
    scroll-snap-align: start;
  }
}

@media (max-width: 900px) {
  .lane {
    flex: 0 0 300px;
  }
}

@media (max-width: 768px) {
  .learning-square {
    padding: 16px 0; /* Adjust horizontal padding */
  }
  .lanes-container {
    padding: 0 16px 16px 16px;
  }
  .lane {
    flex: 0 0 280px;
  }
  .filter-tabs {
    gap: 8px;
    padding: 0 16px;
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  .filter-tab {
    padding: 6px 16px;
    font-size: 13px;
  }
  .page-header h1 {
    font-size: 24px;
  }
  .page-header p {
    font-size: 14px;
  }
  .publish-button {
    padding: 6px 16px;
    font-size: 13px;
    flex-shrink: 0;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 16px;
  }
  .card-title {
    font-size: 16px;
  }
  .card-text {
    font-size: 13px;
  }
  .publish-modal {
    padding: 20px;
  }
  .publish-options {
    grid-template-columns: 1fr;
  }
}

/* 新增：项目发布表单弹窗样式 */
.project-form-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.project-form-modal {
  background: #fff;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  width: 90%;
  max-width: 800px;
  text-align: left;
}

.project-form-modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-top: 0;
  margin-bottom: 24px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}
.type-select {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.type-option {
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f7f9fc;
  border: 1px solid #e0e6f1;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
  text-align: center;
}

.type-option:hover {
  border-color: #5856d6;
  color: #5856d6;
}

.type-option.selected {
  background-color: #5856d6;
  color: #fff;
  border-color: #5856d6;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.form-group .required {
  color: #ff3b30;
  margin-left: 4px;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e6f1;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f7f9fc;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

.form-group input[type="text"]:focus,
.form-group input[type="date"]:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #5856d6;
  box-shadow: 0 0 0 3px rgba(88, 86, 214, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group-row {
  display: flex;
  gap: 20px;
}
.form-group-row .form-group {
  flex: 1;
}

.file-input {
  font-size: 14px;
}
.file-input::file-selector-button {
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #e0e6f1;
  background-color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}
.file-input::file-selector-button:hover {
  background-color: #f0f5ff;
}

.teacher-select {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e0e6f1;
  border-radius: 8px;
  background-color: #f7f9fc;
}

.teacher-option {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  background-color: #fff;
  border: 1px solid #e0e6f1;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.teacher-option:hover {
  border-color: #5856d6;
  color: #5856d6;
}

.teacher-option.selected {
  background-color: #5856d6;
  color: #fff;
  border-color: #5856d6;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.btn-submit {
  background-color: #5856d6;
  color: #fff;
}
.btn-submit:hover {
  background-color: #4d4bbf;
}

.btn-cancel {
  background-color: #f0f2f5;
  color: #333;
}
.btn-cancel:hover {
  background-color: #e5e8ed;
}
</style>
