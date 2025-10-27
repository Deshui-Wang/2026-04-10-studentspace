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
            v-for="(tip, index) in interviewTips"
            :key="tip.id"
            class="tip-card"
            @click="viewTipDetail(tip)"
          >
            <img class="tip-bg" :src="getTipBg(index)" alt="" />
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

      <!-- 面试步骤 -->
      <div class="coaching-section">
        <div class="section-header">
          <i class="el-icon-s-order"></i>
          <h3>面试步骤</h3>
        </div>
        <div class="interview-steps">
          <div class="steps-grid">
            <div class="steps-column">
              <div
                v-for="(step, index) in interviewSteps.slice(0, 3)"
                :key="step.id"
                class="step-card"
                @click="viewStepDetail(step)"
              >
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <h4>{{ step.name }}</h4>
                  <p>{{ step.description }}</p>
                  <div class="step-tips">
                    <span v-for="tip in step.tips" :key="tip" class="tip-tag">{{ tip }}</span>
                  </div>
                </div>
                <div class="step-arrow">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
            
            <div class="steps-column">
              <div
                v-for="(step, index) in interviewSteps.slice(3, 6)"
                :key="step.id"
                class="step-card"
                @click="viewStepDetail(step)"
              >
                <div class="step-number">{{ index + 4 }}</div>
                <div class="step-content">
                  <h4>{{ step.name }}</h4>
                  <p>{{ step.description }}</p>
                  <div class="step-tips">
                    <span v-for="tip in step.tips" :key="tip" class="tip-tag">{{ tip }}</span>
                  </div>
                </div>
                <div class="step-arrow" v-if="index < 2">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 面试小贴士 -->
          <div class="interview-tips-sidebar">
            <div class="tips-header">
              <i class="el-icon-lightbulb"></i>
              <h4>面试小贴士</h4>
            </div>
            <div class="tips-content">
              <div class="tip-item">
                <i class="el-icon-time"></i>
                <span>提前15分钟到达面试地点</span>
              </div>
              <div class="tip-item">
                <i class="el-icon-phone"></i>
                <span>保持手机静音或关机</span>
              </div>
              <div class="tip-item">
                <i class="el-icon-view"></i>
                <span>保持眼神交流，展现自信</span>
              </div>
              <div class="tip-item">
                <i class="el-icon-chat-line-round"></i>
                <span>回答问题要具体，举例说明</span>
              </div>
              <div class="tip-item">
                <i class="el-icon-question"></i>
                <span>准备3-5个问题询问面试官</span>
              </div>
            </div>
            <!-- 机器人装饰图片 -->
            <div class="robot-decoration">
              <img src="/pic/mianshi/jiqiren.png" alt="面试助手机器人" class="robot-image" />
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
          <div class="tool-card resume-builder-card" @click="openResumeBuilder">
            <img class="tool-bg" src="/pic/mianshi/jianlibianji.png" alt="简历编辑" />
            <i class="el-icon-edit"></i>
            <h4>简历制作</h4>
            <p>使用专业模板快速制作简历</p>
          </div>
          <div class="tool-card resume-review-card" @click="openResumeReview">
            <img class="tool-bg" src="/pic/mianshi/jianlimoban.png" alt="简历模板" />
            <i class="el-icon-view"></i>
            <h4>简历诊断</h4>
            <p>AI智能分析简历问题并提供建议</p>
          </div>
          <div class="tool-card resume-template-card" @click="openResumeTemplates">
            <img class="tool-bg" src="/pic/mianshi/jianlizhenduan.png" alt="简历诊断" />
            <i class="el-icon-files"></i>
            <h4>简历模板</h4>
            <p>精选简历模板，一键应用</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 简历组件弹窗 -->
    <el-dialog
      :title="getDialogTitle()"
      v-model="dialogVisible"
      width="90%"
      :before-close="closeDialog"
      class="resume-dialog"
    >
      <div class="dialog-content">
        <div v-if="currentComponent === 'ResumeBuilder'">
          <ResumeBuilder />
        </div>
        <div v-if="currentComponent === 'ResumeReview'">
          <ResumeReview />
        </div>
        <div v-if="currentComponent === 'ResumeTemplates'">
          <ResumeTemplates />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ResumeBuilder from './ResumeBuilder.vue'
import ResumeReview from './ResumeReview.vue'
import ResumeTemplates from './ResumeTemplates.vue'

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
  },
  {
    id: 4,
    question: '你最大的优点是什么？',
    answer: '这个问题让你有机会展示自己的核心优势，但要与职位要求相匹配。',
    tips: [
      '选择与职位相关的优点',
      '用具体例子证明',
      '避免过于泛泛而谈',
      '展现独特价值'
    ],
    expanded: false
  },
  {
    id: 5,
    question: '你期望的薪资是多少？',
    answer: '薪资谈判是面试的重要环节，需要合理评估自己的价值。',
    tips: [
      '提前了解行业薪资水平',
      '给出薪资范围而非具体数字',
      '强调能力匹配度',
      '考虑福利待遇'
    ],
    expanded: false
  },
  {
    id: 6,
    question: '你如何应对工作压力？',
    answer: '考察你的抗压能力和工作方法，展现你的职业素养。',
    tips: [
      '分享具体的压力管理方法',
      '举例说明成功案例',
      '展现积极心态',
      '强调团队合作'
    ],
    expanded: false
  },
  {
    id: 7,
    question: '你为什么离开上一份工作？',
    answer: '需要诚实但积极地解释离职原因，避免负面评价。',
    tips: [
      '避免批评前公司或同事',
      '强调职业发展需要',
      '展现积极态度',
      '准备合理的解释'
    ],
    expanded: false
  },
  {
    id: 8,
    question: '你对我们这个职位有什么了解？',
    answer: '展示你对职位的理解程度和准备充分性。',
    tips: [
      '详细研究职位描述',
      '了解工作内容和要求',
      '准备相关问题',
      '展现专业认知'
    ],
    expanded: false
  },
  {
    id: 9,
    question: '你未来5年的职业规划是什么？',
    answer: '考察你的职业目标和发展规划，展现你的上进心。',
    tips: [
      '结合公司发展机会',
      '展现学习成长意愿',
      '目标要具体可行',
      '体现稳定性'
    ],
    expanded: false
  },
  {
    id: 10,
    question: '你有什么问题要问我们吗？',
    answer: '这是你了解公司和展示兴趣的好机会，要准备有意义的问题。',
    tips: [
      '询问公司发展前景',
      '了解团队文化',
      '询问培训机会',
      '避免问薪资福利'
    ],
    expanded: false
  }
])

// 面试步骤数据
const interviewSteps = ref([
  {
    id: 1,
    name: '面试前准备',
    description: '充分准备面试材料和心理状态',
    icon: 'el-icon-document',
    tips: ['准备简历', '研究公司', '练习自我介绍', '准备问题']
  },
  {
    id: 2,
    name: '到达面试地点',
    description: '提前到达，保持良好的第一印象',
    icon: 'el-icon-location',
    tips: ['提前15分钟', '着装得体', '保持自信', '关闭手机']
  },
  {
    id: 3,
    name: '面试开始',
    description: '礼貌问候，建立良好的沟通氛围',
    icon: 'el-icon-user',
    tips: ['主动握手', '保持微笑', '眼神交流', '坐姿端正']
  },
  {
    id: 4,
    name: '回答问题',
    description: '清晰表达，展现专业能力和个人素质',
    icon: 'el-icon-chat-dot-round',
    tips: ['听清问题', '思考后回答', '举例说明', '保持诚实']
  },
  {
    id: 5,
    name: '提问环节',
    description: '主动提问，展现对职位的兴趣',
    icon: 'el-icon-question',
    tips: ['准备问题', '了解公司', '询问发展', '薪资讨论']
  },
  {
    id: 6,
    name: '面试结束',
    description: '礼貌结束，留下良好印象',
    icon: 'el-icon-check',
    tips: ['感谢机会', '询问后续', '保持联系', '及时跟进']
  }
])

// 根据面试步骤名称返回图标
const getStepIcon = (name) => {
  switch (name) {
    case '面试前准备':
      return 'el-icon-document'
    case '到达面试地点':
      return 'el-icon-location'
    case '面试开始':
      return 'el-icon-user'
    case '回答问题':
      return 'el-icon-chat-dot-round'
    case '提问环节':
      return 'el-icon-question'
    case '面试结束':
      return 'el-icon-check'
    default:
      return 'el-icon-s-order'
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

// 查看面试步骤详情
const viewStepDetail = (step) => {
  console.log('查看面试步骤详情:', step)
  // 这里可以打开详情弹窗或跳转到详情页面
}

// 弹窗控制
const dialogVisible = ref(false)
const currentComponent = ref('')

// 打开简历制作器
const openResumeBuilder = () => {
  console.log('点击了简历制作卡片')
  currentComponent.value = 'ResumeBuilder'
  dialogVisible.value = true
  console.log('弹窗状态:', dialogVisible.value, '当前组件:', currentComponent.value)
}

// 打开简历诊断
const openResumeReview = () => {
  console.log('点击了简历诊断卡片')
  currentComponent.value = 'ResumeReview'
  dialogVisible.value = true
  console.log('弹窗状态:', dialogVisible.value, '当前组件:', currentComponent.value)
}

// 打开简历模板
const openResumeTemplates = () => {
  console.log('点击了简历模板卡片')
  currentComponent.value = 'ResumeTemplates'
  dialogVisible.value = true
  console.log('弹窗状态:', dialogVisible.value, '当前组件:', currentComponent.value)
}

// 关闭弹窗
const closeDialog = () => {
  dialogVisible.value = false
  currentComponent.value = ''
}

// 获取弹窗标题
const getDialogTitle = () => {
  const titleMap = {
    'ResumeBuilder': '简历制作',
    'ResumeReview': '简历诊断',
    'ResumeTemplates': '简历模板'
  }
  return titleMap[currentComponent.value] || ''
}

onMounted(() => {
  console.log('面试辅导页面已加载')
})

// 获取面试技巧卡片背景图
const getTipBg = (index) => {
  const map = ['/pic/mianshifudao/01.png', '/pic/mianshifudao/02.png', '/pic/mianshifudao/03.png', '/pic/mianshifudao/04.png']
  return map[index % map.length]
}
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
  padding: 16px 16px 16px 45px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
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

.tip-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 50%;
  width: auto;
  object-fit: contain;
  opacity: 0.82;
  pointer-events: none;
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
  flex-direction: row;
  flex-wrap: wrap;
}

.question-item {
  background: white;
  border-radius: 8px;
  padding: 10px;
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
  color: #6b7280;
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

.interview-steps {
  margin-top: 20px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.steps-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  flex: 1;
}

.steps-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.step-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  position: relative;
}

.step-number::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  z-index: -1;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-icon i {
  color: #667eea;
  font-size: 18px;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  text-align: left;
}

.step-content p {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 8px 0;
  text-align: left;
  line-height: 1.4;
}

.step-tips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tip-tag {
  background: #e0e7ff;
  color: #3730a3;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.step-arrow {
  color: #9ca3af;
  font-size: 16px;
  flex-shrink: 0;
}

.step-card:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 16px;
  bottom: -8px;
  width: 2px;
  height: 16px;
  background: #e5e7eb;
}

/* 面试小贴士侧边栏 */
.interview-tips-sidebar {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 12px;
  padding: 20px;
  width: 280px;
  flex-shrink: 0;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #667eea;
}

.tips-header i {
  color: #667eea;
  font-size: 18px;
}

.tips-header h4 {
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 80px; /* 为机器人图片留出空间 */
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #667eea;
  transition: all 0.2s ease;
}

.tip-item:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.tip-item i {
  color: #667eea;
  font-size: 14px;
  flex-shrink: 0;
}

.tip-item span {
  color: #374151;
  font-size: 13px;
  line-height: 1.4;
}

/* 机器人装饰图片 */
.robot-decoration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 1;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.robot-decoration:hover {
  opacity: 1;
  transform: scale(1.05);
}

.robot-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
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
  position: relative;
  overflow: hidden;
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

/* 简历工具卡片背景图片样式 */
.tool-bg {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 80%;
  width: auto;
  object-fit: contain;
  pointer-events: none;
  z-index: 0;
}

.tool-card i,
.tool-card h4,
.tool-card p {
  position: relative;
  z-index: 1;
}

/* 简历组件弹窗样式 */
.resume-dialog .el-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.resume-dialog .el-dialog__header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px 24px;
}

.resume-dialog .el-dialog__title {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.resume-dialog .el-dialog__headerbtn .el-dialog__close {
  color: white;
  font-size: 20px;
}

.resume-dialog .el-dialog__body {
  padding: 0;
  max-height: 80vh;
  overflow-y: auto;
}

.dialog-content {
  background: #f8f9fa;
  min-height: 600px;
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
  
  .interview-steps {
    flex-direction: column;
    gap: 16px;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .interview-tips-sidebar {
    width: 100%;
    order: -1;
  }
  
  .robot-image {
    width: 50px;
    height: 50px;
  }
  
  .tips-content {
    margin-bottom: 70px;
  }
  
  .step-card {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }
  
  .step-content {
    text-align: center;
  }
  
  .step-content h4, .step-content p {
    text-align: center;
  }
  
  .resume-tools {
    grid-template-columns: 1fr;
  }
  
  .tip-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>

