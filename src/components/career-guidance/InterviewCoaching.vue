<template>
  <div class="interview-coaching-container">
    <div class="page-header">
      <h2 class="section-title">面试辅导</h2>
      <p class="section-description">专业的面试指导，提升您的面试成功率</p>
    </div>

    <div class="coaching-sections">
      <!-- 面试技巧 -->
      <div class="coaching-section">
        <div class="section-header">
          <i class="el-icon-trophy"></i>
          <h3>面试技巧</h3>
        </div>
        <div class="tips-grid">
          <div
            v-for="tip in interviewTips"
            :key="tip.id"
            class="tip-card"
            @click="viewTipDetail(tip)"
          >
            <div class="tip-icon">
              <i :class="getTipIcon(tip.title)"></i>
            </div>
            <div class="tip-content">
              <h4>{{ tip.title }}</h4>
              <p>{{ tip.description }}</p>
            </div>
            <div class="tip-level">
              <el-tag :type="tip.level === '初级' ? 'success' : tip.level === '中级' ? 'warning' : 'danger'">
                {{ tip.level }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="coaching-section">
        <div class="section-header">
          <i class="el-icon-question"></i>
          <h3>常见问题</h3>
        </div>
        <div class="questions-list">
          <div
            v-for="question in commonQuestions"
            :key="question.id"
            class="question-item"
            @click="toggleQuestion(question.id)"
          >
            <div class="question-header">
              <span class="question-text">{{ question.question }}</span>
              <i :class="question.expanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </div>
            <div v-if="question.expanded" class="question-answer">
              <p>{{ question.answer }}</p>
              <div class="answer-tips">
                <h5>回答要点：</h5>
                <ul>
                  <li v-for="tip in question.tips" :key="tip">{{ tip }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 模拟面试 -->
      <div class="coaching-section">
        <div class="section-header">
          <i class="el-icon-video-camera"></i>
          <h3>模拟面试</h3>
        </div>
        <div class="mock-interview">
          <div class="interview-types">
            <div
              v-for="type in interviewTypes"
              :key="type.id"
              class="interview-type-card"
              @click="startMockInterview(type)"
            >
              <div class="type-icon">
                <i :class="getTypeIcon(type.name)"></i>
              </div>
              <div class="type-content">
                <h4>{{ type.name }}</h4>
                <p>{{ type.description }}</p>
                <div class="type-meta">
                  <span class="duration">{{ type.duration }}</span>
                  <span class="difficulty">{{ type.difficulty }}</span>
                </div>
              </div>
              <el-button type="primary" size="small">开始练习</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 简历优化 -->
      <div class="coaching-section">
        <div class="section-header">
          <i class="el-icon-document"></i>
          <h3>简历优化</h3>
        </div>
        <div class="resume-tools">
          <div class="tool-card" @click="openResumeBuilder">
            <i class="el-icon-edit"></i>
            <h4>简历制作</h4>
            <p>使用专业模板快速制作简历</p>
          </div>
          <div class="tool-card" @click="openResumeReview">
            <i class="el-icon-view"></i>
            <h4>简历诊断</h4>
            <p>AI智能分析简历问题并提供建议</p>
          </div>
          <div class="tool-card" @click="openResumeTemplates">
            <i class="el-icon-files"></i>
            <h4>简历模板</h4>
            <p>精选简历模板，一键应用</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 面试技巧数据
const interviewTips = ref([
  {
    id: 1,
    title: '自我介绍技巧',
    description: '如何在30秒内抓住面试官注意力',
    icon: 'el-icon-user',
    level: '初级'
  },
  {
    id: 2,
    title: 'STAR法则',
    description: '用具体案例回答行为面试问题',
    icon: 'el-icon-star-on',
    level: '中级'
  },
  {
    id: 3,
    title: '压力面试应对',
    description: '如何在高压环境下保持冷静',
    icon: 'el-icon-warning',
    level: '高级'
  },
  {
    id: 4,
    title: '薪资谈判',
    description: '如何合理提出薪资要求',
    icon: 'el-icon-money',
    level: '中级'
  }
])

// 根据面试技巧标题返回图标
const getTipIcon = (title) => {
  switch (title) {
    case '自我介绍技巧':
      return 'el-icon-user'
    case 'STAR法则':
      return 'el-icon-star-on'
    case '压力面试应对':
      return 'el-icon-warning'
    case '薪资谈判':
      return 'el-icon-money'
    default:
      return 'el-icon-collection'
  }
}

// 常见问题数据
const commonQuestions = ref([
  {
    id: 1,
    question: '请简单介绍一下自己',
    answer: '这是面试中最常见的问题，需要简洁明了地介绍自己的背景、技能和职业目标。',
    tips: [
      '控制在1-2分钟内',
      '突出与职位相关的经验',
      '展现个人特色和优势',
      '避免重复简历内容'
    ],
    expanded: false
  },
  {
    id: 2,
    question: '为什么选择我们公司？',
    answer: '这个问题考察你对公司的了解程度和求职动机，需要提前做好功课。',
    tips: [
      '了解公司文化和价值观',
      '研究公司业务和发展前景',
      '结合个人职业规划',
      '展现对公司的真诚兴趣'
    ],
    expanded: false
  },
  {
    id: 3,
    question: '你的缺点是什么？',
    answer: '这是一个陷阱问题，需要巧妙回答，既要诚实又要展现自我改进能力。',
    tips: [
      '选择可以改进的缺点',
      '说明正在采取改进措施',
      '避免说致命缺点',
      '展现学习能力'
    ],
    expanded: false
  }
])

// 模拟面试类型
const interviewTypes = ref([
  {
    id: 1,
    name: '技术面试',
    description: '针对技术岗位的专业面试练习',
    icon: 'el-icon-cpu',
    duration: '30-45分钟',
    difficulty: '中等'
  },
  {
    id: 2,
    name: '行为面试',
    description: '基于STAR法则的行为面试练习',
    icon: 'el-icon-s-order',
    duration: '20-30分钟',
    difficulty: '简单'
  },
  {
    id: 3,
    name: '压力面试',
    description: '模拟高压环境下的面试场景',
    icon: 'el-icon-warning-outline',
    duration: '15-25分钟',
    difficulty: '困难'
  }
])

// 根据模拟面试名称返回图标
const getTypeIcon = (name) => {
  switch (name) {
    case '技术面试':
      return 'el-icon-cpu'
    case '行为面试':
      return 'el-icon-s-order'
    case '压力面试':
      return 'el-icon-warning-outline'
    default:
      return 'el-icon-video-camera'
  }
}

// 切换问题展开状态
const toggleQuestion = (questionId) => {
  const question = commonQuestions.value.find(q => q.id === questionId)
  if (question) {
    question.expanded = !question.expanded
  }
}

// 查看技巧详情
const viewTipDetail = (tip) => {
  console.log('查看技巧详情:', tip)
  // 这里可以打开详情弹窗或跳转到详情页面
}

// 开始模拟面试
const startMockInterview = (type) => {
  console.log('开始模拟面试:', type)
  // 这里可以跳转到模拟面试页面
}

// 打开简历制作器
const openResumeBuilder = () => {
  console.log('打开简历制作器')
  // 这里可以跳转到简历制作页面
}

// 打开简历诊断
const openResumeReview = () => {
  console.log('打开简历诊断')
  // 这里可以跳转到简历诊断页面
}

// 打开简历模板
const openResumeTemplates = () => {
  console.log('打开简历模板')
  // 这里可以跳转到简历模板页面
}

onMounted(() => {
  console.log('面试辅导页面已加载')
})
</script>

<script>
// 仅用于类型提示（不影响 <script setup> 执行），避免 IDE 对下方函数挂载的误解
export default {}
</script>

<style scoped>
.interview-coaching-container {
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.section-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.coaching-sections {
  display: grid;
  gap: 30px;
}

.coaching-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-header i {
  font-size: 20px;
  color: #667eea;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.tip-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.tip-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-icon i {
  color: white;
  font-size: 16px;
}

.tip-content {
  flex: 1;
}

.tip-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  text-align: left;
}

.tip-content p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
  text-align: left;
}

.tip-level {
  flex-shrink: 0;
}

.questions-list {
  display: flex;
  gap: 12px;
}

.question-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.question-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-text {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.question-header i {
  color: #9ca3af;
  transition: transform 0.3s ease;
}

.question-item:hover .question-header i {
  transform: rotate(180deg);
}

.question-answer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.question-answer p {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.answer-tips h5 {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.answer-tips ul {
  margin: 0;
  padding-left: 16px;
}

.answer-tips li {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 4px;
}

.interview-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.interview-type-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 16px;
}

.interview-type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.type-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.type-icon i {
  color: white;
  font-size: 20px;
}

.type-content {
  flex: 1;
}

.type-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  text-align: left;
}

.type-content p {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 8px 0;
  text-align: left;
}

.type-meta {
  display: flex;
  gap: 12px;
}

.duration, .difficulty {
  font-size: 11px;
  color: #9ca3af;
}

.resume-tools {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.tool-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.tool-card i {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 12px;
  display: block;
}

.tool-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.tool-card p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .interview-coaching-container {
    padding: 16px;
  }
  
  .coaching-section {
    padding: 16px;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .interview-types {
    grid-template-columns: 1fr;
  }
  
  .resume-tools {
    grid-template-columns: 1fr;
  }
  
  .tip-card, .interview-type-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
