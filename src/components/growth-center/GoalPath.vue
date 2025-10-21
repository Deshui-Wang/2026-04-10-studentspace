<template>
  <div class="goal-path">
    <div class="header">
      <h2>目标与路径</h2>
      <p class="subtitle">设定学习目标，洞察能力差距，生成达成计划</p>
    </div>

    <!-- 正在进行中的目标概览 -->
    <div class="current-goals-overview" v-if="activeGoals.length > 0">
      <div class="overview-header">
        <h3>🎯 正在进行中的目标</h3>
        <span class="goals-count">{{ activeGoals.length }} 个目标</span>
      </div>
      <div class="goals-grid">
        <div 
          class="goal-card" 
          v-for="goal in activeGoals" 
          :key="goal.id"
          :class="getGoalStatusClass(goal)"
        >
          <div class="goal-info">
            <div class="goal-title">{{ goal.title }}</div>
            <div class="goal-meta">
              <span class="goal-type">{{ getGoalTypeText(goal.type) }}</span>
              <span class="goal-score">目标: {{ goal.targetScore }}分</span>
              <span class="goal-deadline">截止: {{ formatDate(goal.deadline) }}</span>
            </div>
          </div>
          <div class="goal-progress">
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: goal.progress + '%' }"
                :class="getProgressClass(goal.progress)"
              ></div>
            </div>
            <div class="progress-text">
              <span class="progress-percent">{{ goal.progress }}%</span>
              <span class="progress-status">{{ getProgressStatus(goal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid">
      <!-- 目标设定 -->
      <div class="card">
        <div class="card-title">目标设定</div>
        <div class="form-row">
          <label>目标名称</label>
          <input v-model="goalForm.title" placeholder="例如：通过英语四级 / 拿到数据结构90分" />
        </div>
        <div class="form-row">
          <label>目标类型</label>
          <select v-model="goalForm.type">
            <option value="exam">考试成绩</option>
            <option value="skill">技能提升</option>
            <option value="project">项目成果</option>
          </select>
        </div>
        <div class="form-row">
          <label>目标分值/等级</label>
          <input v-model.number="goalForm.targetScore" type="number" min="0" max="100" placeholder="0-100" />
        </div>
        <div class="form-row">
          <label>截止日期</label>
          <input v-model="goalForm.deadline" type="date" />
        </div>
      </div>

      <!-- 能力现状与差距 -->
      <div class="card">
        <div class="card-title">当前能力与差距</div>
        <div class="gauge">
          <div class="gauge-bar">
            <div class="gauge-fill" :style="{ width: currentPercent + '%' }"></div>
          </div>
          <div class="gauge-text">
            <span>当前：{{ currentScore }}</span>
            <span>目标：{{ safeTarget }}</span>
            <span>差距：{{ gap }}</span>
          </div>
        </div>
        <div class="form-row range-row">
          <label>当前分值估计（手动拉取以查看差距变化）</label>
          <input v-model.number="currentScore" type="range" min="0" max="100" class="range-input" />
        </div>
      </div>

      <!-- 两列布局：里程碑链路 + 达成计划 -->
      <div class="two-column-layout">
        <!-- 左侧：AI目标里程碑生成 -->
        <div class="card milestone-card">
          <div class="card-title">
            <span>🎯 目标里程碑链路</span>
            <span class="subtitle">AI为您分解目标达成路径</span>
          </div>
        
        <div class="milestone-chain">
          <div class="chain-header">
            <div class="goal-info">
              <h4>{{ goalForm.title || '请先设定目标' }}</h4>
              <span class="goal-type">{{ getGoalTypeText(goalForm.type) }}</span>
            </div>
            <button class="generate-btn" @click="generateMilestoneChain" :disabled="isGenerating || !goalForm.title">
              <span v-if="isGenerating">生成中...</span>
              <span v-else-if="!goalForm.title">请先设定目标</span>
              <span v-else>🤖 AI生成里程碑</span>
            </button>
          </div>

          <div class="chain-content" v-if="milestoneChain.length > 0">
            <div class="chain-flow">
              <div class="flow-line"></div>
              <div class="milestone-items">
                <div 
                  class="milestone-item" 
                  v-for="(milestone, index) in milestoneChain" 
                  :key="index"
                  :class="{ 'current': index === 0, 'completed': milestone.completed }"
                >
                  <div class="milestone-number">{{ milestoneChain.length - index }}</div>
                  <div class="milestone-content">
                    <h5>{{ milestone.title }}</h5>
                    <p>{{ milestone.description }}</p>
                    <div class="milestone-meta">
                      <span class="timeline">{{ milestone.timeline }}</span>
                      <span class="difficulty">{{ milestone.difficulty }}</span>
                    </div>
                  </div>
                  <div class="milestone-actions">
                    <button 
                      class="toggle-btn" 
                      @click="toggleMilestone(index)"
                      :class="{ 'completed': milestone.completed }"
                    >
                      {{ milestone.completed ? '✓' : '○' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chain-summary">
              <div class="summary-item">
                <span class="label">总里程碑数</span>
                <span class="value">{{ milestoneChain.length }}</span>
              </div>
              <div class="summary-item">
                <span class="label">已完成</span>
                <span class="value completed">{{ completedMilestones }}</span>
              </div>
              <div class="summary-item">
                <span class="label">完成进度</span>
                <span class="value">{{ completionProgress }}%</span>
              </div>
            </div>
          </div>

          <div class="empty-state" v-else>
            <div class="empty-icon">🎯</div>
            <p>点击"AI生成里程碑"按钮，让AI为您分解目标达成路径</p>
            <p class="empty-desc">AI将根据您的目标类型和分值，智能生成递进式的里程碑计划</p>
          </div>
        </div>
        </div>

        <!-- 右侧：达成计划配置 -->
        <div class="card plan-card">
          <div class="card-title">达成计划</div>

          <div class="plan-form">
            <div class="plan-row">
              <label>每周投入</label>
              <select v-model="plan.weeklyHours">
                <option :value="2">2小时</option>
                <option :value="4">4小时</option>
                <option :value="6">6小时</option>
                <option :value="8">8小时</option>
                <option :value="10">10小时</option>
              </select>
            </div>
            <div class="plan-row">
              <label>学习方式</label>
              <div class="checkboxes">
                <label><input type="checkbox" value="video" v-model="plan.methods" /> 视频课程</label>
                <label><input type="checkbox" value="book" v-model="plan.methods" /> 书籍/讲义</label>
                <label><input type="checkbox" value="exercise" v-model="plan.methods" /> 题目/实操</label>
                <label><input type="checkbox" value="project" v-model="plan.methods" /> 小项目</label>
              </div>
            </div>
            <div class="plan-row">
              <label>关键里程碑</label>
              <div class="milestones">
                <div class="milestone" v-for="(m, i) in plan.milestones" :key="i">
                  <input v-model="m.name" placeholder="里程碑名称" />
                  <input v-model="m.date" type="date" />
                  <button class="link" @click="removeMilestone(i)">删除</button>
                </div>
                <button class="ghost" @click="addMilestone">+ 添加里程碑</button>
              </div>
            </div>
            <div class="plan-row">
              <label>AI建议</label>
              <div class="ai-suggestion">
                <div v-if="!showAISuggestion" class="suggestion-placeholder">
                  <div class="placeholder-content">
                    <span class="placeholder-icon">🤖</span>
                    <p>配置完目标后，点击下方按钮获取AI个性化建议</p>
                    <button class="primary generate-ai-btn" @click="generateAISuggestion" :disabled="!goalForm.title || isTyping">
                      <span v-if="isTyping">生成中...</span>
                      <span v-else-if="!goalForm.title">请先设定目标</span>
                      <span v-else>✨ 自动生成AI建议</span>
                    </button>
                  </div>
                </div>
                <div v-else class="suggestion-content-wrapper">
                  <div class="suggestion-content" v-html="formatSuggestion(displayedSuggestion)"></div>
                  <div v-if="isTyping" class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 整体操作按钮区域 - 横通整个页面，独立于所有模块 -->
    <div class="global-actions-full">
      <div class="global-actions-content">
        <div class="action-buttons">
          <button class="primary" @click="savePlan">
            <span class="icon">💾</span>
            保存目标计划
          </button>
          <button class="secondary" @click="resetAll">
            <span class="icon">🔄</span>
            重置所有设置
          </button>
        </div>
        <div class="action-tips">
          <span class="tip-text">💡 配置完成后点击保存，系统将为您生成完整的学习路径</span>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useMilestones } from '@/services/milestone.service.js'

const { setMilestones } = useMilestones()

const goalForm = reactive({
  title: '',
  type: 'exam',
  targetScore: 80,
  deadline: ''
})

const currentScore = ref(50)

const safeTarget = computed(() => {
  return Math.max(0, Math.min(100, Number(goalForm.targetScore) || 0))
})

const gap = computed(() => {
  return Math.max(0, safeTarget.value - Number(currentScore.value || 0))
})

const currentPercent = computed(() => {
  const target = safeTarget.value || 100
  if (target <= 0) return 0
  return Math.round(Math.min(100, (Number(currentScore.value || 0) / target) * 100))
})

const plan = reactive({
  weeklyHours: 6,
  methods: ['exercise'],
  milestones: [
    { name: '完成基础知识梳理', date: '' },
    { name: '阶段测验达到70分', date: '' }
  ]
})

const aiSuggestion = ref('')
const showAISuggestion = ref(false)
const isTyping = ref(false)
const displayedSuggestion = ref('')

// 里程碑链路相关
const milestoneChain = ref([])
const isGenerating = ref(false)

// 正在进行中的目标数据
const currentGoals = ref([
  {
    id: 1,
    title: '通过英语四级考试',
    type: 'exam',
    targetScore: 425,
    deadline: '2025-12-15',
    startDate: '2025-09-01',
    progress: 35,
    currentScore: 150
  },
  {
    id: 2,
    title: '掌握React开发技能',
    type: 'skill',
    targetScore: 85,
    deadline: '2025-11-30',
    startDate: '2025-08-01',
    progress: 60,
    currentScore: 51
  },
  {
    id: 3,
    title: '完成个人博客项目',
    type: 'project',
    targetScore: 90,
    deadline: '2025-12-31',
    startDate: '2025-09-15',
    progress: 60,
    currentScore: 54
  },
  {
    id: 4,
    title: '学习Python基础',
    type: 'skill',
    targetScore: 80,
    deadline: '2026-01-30',
    startDate: '2025-10-01',
    progress: 90,
    currentScore: 72
  }
])

// 过滤正在进行中的目标（未过期且已开始）
const activeGoals = computed(() => {
  const now = new Date()
  return currentGoals.value.filter(goal => {
    const deadline = new Date(goal.deadline)
    const startDate = new Date(goal.startDate)
    return deadline > now && startDate <= now
  })
})

// AI建议模板库
const suggestionTemplates = {
  exam: {
    strategies: [
      '📚 知识点梳理法：将考试大纲分解为小模块，逐个击破',
      '⏰ 时间管理法：采用番茄工作法，25分钟专注+5分钟休息',
      '🔄 循环复习法：艾宾浩斯遗忘曲线，第1、2、4、7、15天复习',
      '📝 错题本策略：建立错题档案，分析错误原因和解题思路',
      '🎯 模拟考试法：定期进行全真模拟，熟悉考试节奏'
    ],
    timeAllocation: [
      '基础阶段（40%）：概念理解+基础练习',
      '强化阶段（35%）：重点突破+综合练习', 
      '冲刺阶段（25%）：模拟考试+查漏补缺'
    ],
    resources: [
      '📖 推荐教材：选择权威教材作为主要学习资料',
      '🎥 视频课程：利用在线课程补充理解难点',
      '📱 学习APP：使用刷题APP进行碎片化学习',
      '👥 学习小组：组建学习小组互相督促和讨论'
    ]
  },
  skill: {
    strategies: [
      '🏗️ 项目驱动法：通过实际项目学习技能，边做边学',
      '📈 渐进式练习：从简单到复杂，逐步提升难度',
      '🤝 结对编程法：与他人合作，互相学习和监督',
      '📊 技能树法：将技能分解为子技能，系统化学习',
      '🎓 导师指导法：寻找经验丰富的导师进行指导'
    ],
    timeAllocation: [
      '理论学习（30%）：掌握基础概念和原理',
      '实践练习（50%）：通过项目练习巩固技能',
      '总结反思（20%）：复盘学习过程，优化方法'
    ],
    resources: [
      '💻 在线平台：利用GitHub、Stack Overflow等平台学习',
      '📚 技术文档：阅读官方文档和最佳实践',
      '🎯 实战项目：参与开源项目或自建项目',
      '🌐 技术社区：加入相关技术社区交流学习'
    ]
  },
  project: {
    strategies: [
      '🎯 SMART目标法：设定具体、可衡量、可达成、相关、有时限的目标',
      '📋 项目管理法：使用甘特图、看板等工具管理项目进度',
      '🔄 敏捷开发法：采用迭代开发，快速反馈和调整',
      '👥 团队协作法：明确分工，定期沟通，协同推进',
      '📊 里程碑管理：设置关键节点，及时评估和调整'
    ],
    timeAllocation: [
      '需求分析（20%）：明确项目目标和需求',
      '设计规划（25%）：制定详细的项目计划',
      '开发实施（40%）：按计划执行项目开发',
      '测试优化（15%）：测试、优化和完善项目'
    ],
    resources: [
      '🛠️ 开发工具：选择合适的开发环境和工具链',
      '📖 技术文档：编写和维护项目技术文档',
      '🔧 版本控制：使用Git等工具管理代码版本',
      '📈 项目管理：使用项目管理工具跟踪进度'
    ]
  }
}

// 打字机效果函数
function typewriterEffect(text, callback) {
  isTyping.value = true
  displayedSuggestion.value = ''
  let index = 0
  
  const timer = setInterval(() => {
    if (index < text.length) {
      displayedSuggestion.value += text[index]
      index++
    } else {
      clearInterval(timer)
      isTyping.value = false
      if (callback) callback()
    }
  }, 30) // 每30ms显示一个字符
}

// 自动生成AI建议
function generateAISuggestion() {
  if (!goalForm.title || isTyping.value) return
  
  const hours = plan.weeklyHours
  const diff = gap.value
  const goalType = goalForm.type
  const methods = plan.methods
  
  // 根据目标类型选择建议模板
  const templates = suggestionTemplates[goalType] || suggestionTemplates.exam
  
  // 生成个性化建议
  const suggestion = generatePersonalizedSuggestion(goalType, hours, diff, methods, templates)
  aiSuggestion.value = suggestion
  
  // 显示AI建议区域并开始打字机效果
  showAISuggestion.value = true
  typewriterEffect(suggestion)
}

function regenerateSuggestion() {
  const hours = plan.weeklyHours
  const diff = gap.value
  const goalType = goalForm.type
  const methods = plan.methods
  
  // 根据目标类型选择建议模板
  const templates = suggestionTemplates[goalType] || suggestionTemplates.exam
  
  // 生成个性化建议
  const suggestion = generatePersonalizedSuggestion(goalType, hours, diff, methods, templates)
  aiSuggestion.value = suggestion
  
  // 重新开始打字机效果
  typewriterEffect(suggestion)
}

function generatePersonalizedSuggestion(type, hours, diff, methods, templates) {
  const strategies = templates.strategies
  const timeAllocation = templates.timeAllocation
  const resources = templates.resources
  
  // 根据差距调整建议强度
  const intensity = diff > 30 ? '高强度' : diff > 15 ? '中强度' : '标准强度'
  
  // 随机选择2-3个策略
  const selectedStrategies = strategies.sort(() => 0.5 - Math.random()).slice(0, 3)
  
  // 根据学习方法调整建议
  let methodAdvice = ''
  if (methods.includes('exercise')) {
    methodAdvice = '💪 练习为主：建议70%时间用于实践练习，30%用于理论学习。'
  }
  if (methods.includes('video')) {
    methodAdvice += '🎥 视频学习：推荐观看高质量教学视频，配合笔记整理。'
  }
  if (methods.includes('book')) {
    methodAdvice += '📚 书籍学习：选择经典教材，系统化学习理论知识。'
  }
  if (methods.includes('tutor')) {
    methodAdvice += '👨‍🏫 导师指导：寻找专业导师，获得个性化指导和建议。'
  }
  
  // 生成时间安排建议
  const timeAdvice = `⏰ 时间安排：建议每周投入${hours}小时，采用${intensity}学习模式。`
  
  // 生成具体建议
  const specificAdvice = selectedStrategies.join('\n')
  
  // 生成资源推荐
  const resourceAdvice = resources.slice(0, 2).join('\n')
  
  // 生成时间分配建议
  const allocationAdvice = timeAllocation.join('\n')
  
  return `${timeAdvice}

${methodAdvice}

🎯 学习策略：
${specificAdvice}

📊 时间分配：
${allocationAdvice}

📚 推荐资源：
${resourceAdvice}

💡 个性化建议：根据当前差距${diff}分，建议重点关注薄弱环节，每两周进行一次阶段性评估和调整。`
}

function formatSuggestion(suggestion) {
  // 将换行符转换为HTML换行，并高亮显示标题
  return suggestion
    .replace(/\n/g, '<br>')
    .replace(/(⏰ 时间安排：|💪 练习为主：|🎥 视频学习：|📚 书籍学习：|👨‍🏫 导师指导：|🎯 学习策略：|📊 时间分配：|📚 推荐资源：|💡 个性化建议：)/g, '<strong>$1</strong>')
}

function copySuggestion() {
  navigator.clipboard.writeText(aiSuggestion.value).then(() => {
    alert('建议已复制到剪贴板！')
  }).catch(() => {
    alert('复制失败，请手动复制')
  })
}

function addMilestone() {
  plan.milestones.push({ name: '', date: '' })
}

function removeMilestone(index) {
  plan.milestones.splice(index, 1)
}

function savePlan() {
  const payload = {
    goal: { ...goalForm },
    currentScore: currentScore.value,
    gap: gap.value,
    plan: JSON.parse(JSON.stringify(plan))
  }
  try {
    localStorage.setItem('student_goal_plan', JSON.stringify(payload))
    alert('已保存到本地（示例）。后端接入后将保存到服务器。')
  } catch (e) {
    console.error(e)
    alert('保存失败，请稍后重试。')
  }
}

function resetAll() {
  goalForm.title = ''
  goalForm.type = 'exam'
  goalForm.targetScore = 80
  goalForm.deadline = ''
  currentScore.value = 50
  plan.weeklyHours = 6
  plan.methods = ['exercise']
  plan.milestones = [
    { name: '完成基础知识梳理', date: '' },
    { name: '阶段测验达到70分', date: '' }
  ]
  // 重置AI建议相关状态
  aiSuggestion.value = ''
  showAISuggestion.value = false
  isTyping.value = false
  displayedSuggestion.value = ''
  milestoneChain.value = []
}

// 里程碑链路相关方法
function getGoalTypeText(type) {
  const typeMap = {
    'exam': '考试成绩', 
    'skill': '技能提升', 
    'project': '项目成果'
  }
  return typeMap[type] || '未知类型'
}

// 格式化日期显示
function formatDate(dateString) {
  if (!dateString) return '未设置'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}

// 获取目标状态样式类
function getGoalStatusClass(goal) {
  const status = getProgressStatus(goal)
  return {
    'goal-stalled': status === '疑似目标停滞',
    'goal-slow': status === '过慢',
    'goal-normal': status === '正常',
    'goal-fast': status === '偏快'
  }
}

// 获取进度条样式类
function getProgressClass(progress) {
  if (progress >= 80) return 'progress-excellent'
  if (progress >= 60) return 'progress-good'
  if (progress >= 40) return 'progress-normal'
  if (progress >= 20) return 'progress-slow'
  return 'progress-stalled'
}

// 计算进度状态
function getProgressStatus(goal) {
  const now = new Date()
  const startDate = new Date(goal.startDate)
  const deadline = new Date(goal.deadline)
  const totalDays = Math.ceil((deadline - startDate) / (1000 * 60 * 60 * 24))
  const elapsedDays = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24))
  
  if (elapsedDays < 0) return '未开始'
  if (elapsedDays >= totalDays) return '已到期'
  
  const timeProgress = Math.min(100, (elapsedDays / totalDays) * 100)
  const progressDiff = goal.progress - timeProgress
  
  if (progressDiff >= 20) return '偏快'
  if (progressDiff >= 5) return '正常'
  if (progressDiff >= -10) return '偏慢'
  if (progressDiff >= -20) return '过慢'
  return '疑似目标停滞'
}

function generateMilestoneChain() {
  if (!goalForm.title) return
  
  isGenerating.value = true
  
  // 模拟AI生成过程
  setTimeout(() => {
    const chain = generateMilestonesByType(goalForm.type, goalForm.title, goalForm.targetScore)
    milestoneChain.value = chain
    setMilestones(chain)
    isGenerating.value = false
  }, 1500)
}

function generateMilestonesByType(type, title, targetScore) {
  const baseMilestones = {
    'exam': [
      {
        title: '掌握核心知识点',
        description: '系统学习考试大纲中的重点内容，建立完整的知识体系',
        timeline: '2-3周',
        difficulty: '中等',
        completed: false
      },
      {
        title: '完成基础练习',
        description: '通过大量练习题巩固基础知识，提高解题熟练度',
        timeline: '1-2周',
        difficulty: '简单',
        completed: false
      },
      {
        title: '模拟考试训练',
        description: '进行模拟考试，熟悉考试流程，提升应试技巧',
        timeline: '1-2周',
        difficulty: '中等',
        completed: false
      },
      {
        title: '查漏补缺',
        description: '针对薄弱环节进行专项训练，确保知识点的全面掌握',
        timeline: '1周',
        difficulty: '困难',
        completed: false
      },
      {
        title: '考前冲刺',
        description: '最后阶段的复习巩固，保持良好的考试状态',
        timeline: '3-5天',
        difficulty: '中等',
        completed: false
      }
    ],
    'skill': [
      {
        title: '理论学习',
        description: '学习相关技能的理论知识，了解基本原理和概念',
        timeline: '1-2周',
        difficulty: '简单',
        completed: false
      },
      {
        title: '基础实践',
        description: '通过简单的实践项目掌握基本操作和流程',
        timeline: '2-3周',
        difficulty: '中等',
        completed: false
      },
      {
        title: '进阶练习',
        description: '完成更复杂的项目，提升技能熟练度和深度',
        timeline: '3-4周',
        difficulty: '困难',
        completed: false
      },
      {
        title: '项目实战',
        description: '独立完成完整的项目，展示技能掌握程度',
        timeline: '2-3周',
        difficulty: '困难',
        completed: false
      }
    ],
    'project': [
      {
        title: '需求分析',
        description: '深入理解项目需求，制定详细的项目计划',
        timeline: '1周',
        difficulty: '中等',
        completed: false
      },
      {
        title: '技术选型',
        description: '选择合适的技术栈和工具，搭建开发环境',
        timeline: '3-5天',
        difficulty: '简单',
        completed: false
      },
      {
        title: '原型设计',
        description: '设计项目原型，确定整体架构和功能模块',
        timeline: '1-2周',
        difficulty: '中等',
        completed: false
      },
      {
        title: '核心开发',
        description: '实现项目的核心功能，完成主要业务逻辑',
        timeline: '3-4周',
        difficulty: '困难',
        completed: false
      },
      {
        title: '测试优化',
        description: '进行功能测试和性能优化，确保项目质量',
        timeline: '1-2周',
        difficulty: '中等',
        completed: false
      },
      {
        title: '部署上线',
        description: '完成项目部署，进行上线前的最后检查',
        timeline: '3-5天',
        difficulty: '简单',
        completed: false
      }
    ]
  }
  
  return baseMilestones[type] || baseMilestones['exam']
}

function toggleMilestone(index) {
  milestoneChain.value[index].completed = !milestoneChain.value[index].completed
  setMilestones(milestoneChain.value)
}

const completedMilestones = computed(() => {
  return milestoneChain.value.filter(m => m.completed).length
})

const completionProgress = computed(() => {
  if (milestoneChain.value.length === 0) return 0
  return Math.round((completedMilestones.value / milestoneChain.value.length) * 100)
})

watch([() => plan.weeklyHours, currentScore, () => goalForm.targetScore], regenerateSuggestion, { immediate: true })
</script>

<style scoped>
.goal-path {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.subtitle {
  color: #6b7280;
  font-size: 13px;
  margin: 0;
}

/* 正在进行中的目标概览样式 */
.current-goals-overview {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.overview-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.goals-count {
  background: #6366f1;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.goal-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s;
  position: relative;
}

.goal-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.goal-card.goal-stalled {
  border-left: 4px solid #ef4444;
  background: #fef2f2;
}

.goal-card.goal-slow {
  border-left: 4px solid #f59e0b;
  background: #fffbeb;
}

.goal-card.goal-normal {
  border-left: 4px solid #10b981;
  background: #f0fdf4;
}

.goal-card.goal-fast {
  border-left: 4px solid #3b82f6;
  background: #eff6ff;
}

.goal-info {
  margin-bottom: 12px;
}

.goal-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.4;
}

.goal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.goal-meta span {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.goal-progress {
  margin-top: 12px;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 4px;
}

.progress-excellent {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.progress-good {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.progress-normal {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.progress-slow {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.progress-stalled {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.progress-percent {
  font-weight: 600;
  color: #1f2937;
}

.progress-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 11px;
  color: #ea580c;
}

.goal-stalled .progress-status {
  background: #fecaca;
  color: #dc2626;
}

.goal-slow .progress-status {
  background: #fed7aa;
  color: #ea580c;
}

.goal-normal .progress-status {
  background: #bbf7d0;
  color: #059669;
}

.goal-fast .progress-status {
  background: #dbeafe;
  color: #2563eb;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  padding: 16px;
}

.card.full {
  grid-column: 1 / -1;
}

/* 两列布局样式 */
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  grid-column: 1 / -1;
}

.milestone-card {
  min-height: 500px;
}

.plan-card {
  min-height: 500px;
}

.card-title {
  font-weight: 600;
  margin-bottom: 12px;
  text-align: left;
  display: flex;
  justify-content: space-between;
}

.form-row { 
  display: flex; 
  flex-direction: row; 
  gap: 8px; 
  margin-bottom: 12px; 
  align-items: center;
}
.form-row label { 
  font-size: 13px; 
  color: #374151; 
  min-width: 80px;
  flex-shrink: 0;
  text-align: left;
}
.form-row input, .form-row select { 
  height: 34px; 
  padding: 6px 10px; 
  border: 1px solid #e5e7eb; 
  border-radius: 8px; 
  flex: 1;
}

/* 范围输入条样式 */
.range-row { 
  flex-direction: column; 
  align-items: flex-start; 
  gap: 8px; 
}

.range-input {
  width: 100% !important;
  height: 8px !important;
  padding: 0 !important;
  background: #f3f4f6;
  border-radius: 4px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #6366f1;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
  transition: all 0.2s ease;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.range-input::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #6366f1;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
  transition: all 0.2s ease;
}

.range-input::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.gauge { display: flex; flex-direction: column; gap: 10px; margin-bottom: 30px; }
.gauge-bar { height: 10px; background: #f3f4f6; border-radius: 999px; overflow: hidden; }
.gauge-fill { height: 100%; background: linear-gradient(90deg,#60a5fa,#22c55e); }
.gauge-text { display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; }

.plan-form { display: flex; flex-direction: column; gap: 12px; }
.plan-row { display: flex; flex-direction: column; gap: 8px; }
.checkboxes { display: flex; gap: 16px; flex-wrap: wrap; }
.milestones { display: flex; flex-direction: column; gap: 8px; }
.milestone { display: grid; grid-template-columns: 1fr 160px auto; gap: 8px; }

.actions { 
  margin-top: 24px; 
  padding: 20px; 
  background: #f8fafc; 
  border: 1px solid #e2e8f0; 
  border-radius: 12px; 
  border-top: 3px solid #6366f1;
}


.action-tips { 
  text-align: center; 
}

.tip-text { 
  color: #6b7280; 
  font-size: 14px; 
  font-style: italic; 
}
.primary { 
  background: linear-gradient(135deg, #6366f1, #8b5cf6); 
  color: #fff; 
  border: none; 
  border-radius: 12px; 
  height: 44px; 
  padding: 0 24px; 
  cursor: pointer; 
  box-shadow: 0 4px 14px rgba(99,102,241,0.25); 
  transition: all .2s ease; 
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}
.primary:hover { 
  background: linear-gradient(135deg, #5457f0, #7c3aed); 
  transform: translateY(-2px); 
  box-shadow: 0 8px 25px rgba(99,102,241,0.35); 
}
.primary:active { transform: translateY(0); }
.secondary { 
  background: #f8fafc; 
  color: #6b7280; 
  border: 1px solid #e2e8f0; 
  border-radius: 12px; 
  height: 44px; 
  padding: 0 24px; 
  cursor: pointer; 
  transition: all .2s ease; 
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}
.secondary:hover { 
  background: #f1f5f9; 
  border-color: #cbd5e1;
  color: #475569;
}
.ghost { background: #f9fafb; color: #374151; border: 1px dashed #e5e7eb; border-radius: 10px; height: 32px; padding: 0 12px; cursor: pointer; width: fit-content; }
.ghost:hover { background: #f3f4f6; }
.link { background: transparent; color: #ef4444; border: none; cursor: pointer; }

/* 达成计划：更优布局与可读性 */
.card.full { padding: 18px; }
.plan-form { 
  display: grid; 
  grid-template-columns: 1fr; 
  gap: 16px; 
}
.plan-form .plan-row label { font-size: 13px; color: #374151; font-weight: 500; }
.plan-form select { height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 6px 10px; background: #fff; }
.plan-form input[type="checkbox"] { accent-color: #6366f1; }
.plan-form .checkboxes { background: #fafafa; border: 1px solid #f1f5f9; border-radius: 10px; padding: 10px; }

/* 里程碑和AI建议在右侧布局中保持单列 */

/* 里程碑行更清晰的输入外观 */
.milestones { background: #fafafa; border: 1px solid #f1f5f9; border-radius: 10px; padding: 10px; }

/* 全局操作按钮区域 - 与页面内容区域对齐，独立于所有模块 */
.global-actions-full {
  background: #f8fafc;
  border-top: 3px solid #6366f1;
  padding: 40px 0;
  margin-top: 40px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.global-actions-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.global-actions-content .action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 16px;
}

.global-actions-content .action-buttons button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
  justify-content: center;
}

.global-actions-content .action-buttons .primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
}

.global-actions-content .action-buttons .primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.3);
}

.global-actions-content .action-buttons .secondary {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.global-actions-content .action-buttons .secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.global-actions-content .action-tips {
  text-align: center;
}

.global-actions-content .tip-text {
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
}
.milestone input { height: 34px; padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; }
.link { padding: 0 6px; border-radius: 8px; }

/* AI建议样式 */
.ai-suggestion {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
  min-height: 120px;
}

/* 占位符样式 */
.suggestion-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 80px;
}

.placeholder-content {
  text-align: center;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.placeholder-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.placeholder-content p {
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.5;
}

.generate-ai-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
  display: flex;
  align-items: center;
}

.generate-ai-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.3);
}

.generate-ai-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 建议内容包装器 */
.suggestion-content-wrapper {
  position: relative;
}

.suggestion-content {
  line-height: 1.6;
  color: #374151;
  font-size: 14px;
  margin-bottom: 16px;
  max-height: 300px;
  overflow-y: auto;
  text-align: left;
  min-height: 60px;
}

.suggestion-content strong {
  color: #1f2937;
  font-weight: 600;
}

/* 打字机指示器 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background: #6366f1;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  30% {
    transform: scale(1.2);
    opacity: 1;
  }
}


.link:hover { text-decoration: underline; }

/* 里程碑链路样式 */
.card-title .subtitle {
  font-size: 12px;
  color: #6b7280;
  font-weight: 400;
  margin-left: 8px;
}

.milestone-chain {
  margin-top: 16px;
}

.chain-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.goal-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #1f2937;
}

.goal-type {
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 2px 8px;
  border-radius: 12px;
}

.generate-btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-btn:hover:not(:disabled) {
  background: #5b21b6;
  transform: translateY(-1px);
}

.generate-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.chain-content {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.chain-flow {
  position: relative;
  padding: 20px;
}

.flow-line {
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #6366f1, #e5e7eb);
}

.milestone-items {
  position: relative;
  z-index: 1;
}

.milestone-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
  position: relative;
}

.milestone-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.milestone-item.current {
  border-color: #6366f1;
  background: #f8fafc;
}

.milestone-item.completed {
  border-color: #10b981;
  background: #f0fdf4;
}

.milestone-number {
  width: 32px;
  height: 32px;
  background: #6366f1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 16px;
  flex-shrink: 0;
}

.milestone-item.completed .milestone-number {
  background: #10b981;
}

.milestone-content {
  flex: 1;
  margin-right: 16px;
}

.milestone-content h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.milestone-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.milestone-meta {
  display: flex;
  gap: 12px;
}

.timeline, .difficulty {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.timeline {
  background: #dbeafe;
  color: #1e40af;
}

.difficulty {
  background: #fef3c7;
  color: #92400e;
}

.milestone-actions {
  display: flex;
  align-items: center;
}

.toggle-btn {
  width: 32px;
  height: 32px;
  border: 2px solid #d1d5db;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #6b7280;
  transition: all 0.2s;
}

.toggle-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.toggle-btn.completed {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.chain-summary {
  display: flex;
  justify-content: space-around;
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.summary-item {
  text-align: center;
}

.summary-item .label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.summary-item .value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.summary-item .value.completed {
  color: #10b981;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 16px;
}

.empty-desc {
  font-size: 14px;
  color: #9ca3af;
}

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr; }
  .two-column-layout { 
    grid-template-columns: 1fr; 
    gap: 16px;
  }
  .milestone { grid-template-columns: 1fr; }
  .chain-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  .milestone-item {
    flex-direction: column;
    gap: 12px;
  }
  .milestone-actions {
    align-self: flex-end;
  }
}
</style>


