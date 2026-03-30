<template>
  <div class="ai-virtual-interview-container">
    <div class="page-header">
      <h2 class="section-title">AI虚拟面试</h2>
      <p class="section-description">智能AI面试官，24小时随时练习，提升面试技能</p>
    </div>

    <div class="interview-dashboard">
      <!-- 面试统计 -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ interviewStats.totalInterviews }}</div>
            <div class="stat-label">总面试次数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ interviewStats.averageScore }}</div>
            <div class="stat-label">平均得分</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ interviewStats.totalTime }}</div>
            <div class="stat-label">总练习时长</div>
          </div>
        </div>
      </div>

            <!-- AI面试官设置 -->
            <div class="settings-section">
        <h3>AI面试官设置</h3>
        <div class="settings-grid">
          <div class="setting-item">
            <label>面试官性格</label>
            <el-select v-model="aiSettings.personality" placeholder="选择面试官性格" class="setting-select">
              <el-option label="友好温和" value="friendly"></el-option>
              <el-option label="专业严谨" value="professional"></el-option>
              <el-option label="挑战性" value="challenging"></el-option>
            </el-select>
          </div>
          <div class="setting-item">
            <label>面试难度</label>
            <el-select v-model="aiSettings.difficulty" placeholder="选择面试难度" class="setting-select">
              <el-option label="初级" value="beginner"></el-option>
              <el-option label="中级" value="intermediate"></el-option>
              <el-option label="高级" value="advanced"></el-option>
            </el-select>
          </div>
          <div class="setting-item">
            <label>面试时长</label>
            <el-select v-model="aiSettings.duration" placeholder="选择面试时长" class="setting-select">
              <el-option label="15分钟" value="15"></el-option>
              <el-option label="30分钟" value="30"></el-option>
              <el-option label="45分钟" value="45"></el-option>
            </el-select>
          </div>
          <div class="setting-item">
            <label>问题类型</label>
            <el-select v-model="aiSettings.questionType" placeholder="选择问题类型" class="setting-select">
              <el-option label="行为问题" value="behavioral"></el-option>
              <el-option label="技术问题" value="technical"></el-option>
              <el-option label="情景问题" value="situational"></el-option>
              <el-option label="综合问题" value="mixed"></el-option>
            </el-select>
          </div>
          <div class="settings-actions">
            <el-button type="primary" @click="saveSettings">保存</el-button>
            <el-button @click="resetSettings">重置</el-button>
          </div>
        </div>
      </div>

      <!-- 快速开始 -->
      <div class="quick-start-section">
        <h3>快速开始面试</h3>
        <div class="interview-options">
          <div
            v-for="option in interviewOptions"
            :key="option.id"
            class="interview-option"
            :class="{ active: selectedOption === option.id }"
            @click="selectOption(option.id)"
          >
            <!-- 右侧上方的小图片 -->
            <div class="option-image">
              <img :src="option.backgroundImage" :alt="option.title" />
            </div>
            
            <div class="option-content">
              <!-- 1. 名称 -->
              <h4 class="option-title">{{ option.title }}</h4>
              
              <!-- 2. 描述 -->
              <p class="option-description">{{ option.description }}</p>
              
              <!-- 3. 时间等级 -->
              <div class="option-meta">
                <span class="duration">{{ option.duration }}</span>
                <span class="difficulty">{{ option.difficulty }}</span>
              </div>
            </div>
            
            <!-- 4. 开始面试按钮 -->
            <div class="option-action">
              <el-button 
                type="primary" 
                @click.stop="startInterview(option)"
              >
                开始面试
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 面试历史 -->
      <div class="history-section">
        <h3>面试历史</h3>
        <div class="history-list">
          <div
            v-for="record in interviewHistory"
            :key="record.id"
            class="history-item"
            @click="viewInterviewDetail(record)"
          >
            <div class="history-info">
              <div class="history-title">{{ record.title }}</div>
              <div class="history-meta">
                <span class="date">{{ record.date }}</span>
                <span class="duration">{{ record.duration }}</span>
                <span class="score" :class="getScoreClass(record.score)">
                  得分: {{ record.score }}
                </span>
              </div>
            </div>
            <div class="history-actions">
              <el-button size="small" @click.stop="reviewInterview(record)">
                查看详情
              </el-button>
              <el-button size="small" type="primary" @click.stop="retryInterview(record)">
                重新练习
              </el-button>
            </div>
          </div>
        </div>
      </div>


    </div>

    <!-- 面试进行中弹窗 -->
    <el-dialog
      v-model="interviewDialogVisible"
      title="AI虚拟面试进行中"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="interview-dialog">
        <div class="interview-avatar">
          <img src="/pic/mianshi.jpg" alt="AI面试官" />
          <div class="avatar-meta">
            <div class="avatar-status">正在面试中...</div>
            <div class="interview-timer">
              <i class="el-icon-time"></i>
              <span>{{ interviewTimer }}</span>
            </div>
          </div>
        </div>
        <div class="interview-content">
          <div class="current-question">
            <h4>当前问题：</h4>
            <p>{{ currentQuestion }}</p>
          </div>
          <div class="mic-visualizer" aria-label="语音采集中">
            <div class="bars">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="mic-label">正在采集语音...</div>
          </div>
          <div class="interview-actions">
            <el-button type="primary" @click="answerQuestion">回答完毕</el-button>
            <el-button @click="skipQuestion">跳过问题</el-button>
            <el-button type="danger" @click="endInterview">结束面试</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 面试统计
const interviewStats = ref({
  totalInterviews: 12,
  averageScore: 85,
  totalTime: '6小时30分'
})

// 选中的面试选项
const selectedOption = ref(null)

// 面试选项
const interviewOptions = ref([
  {
    id: 1,
    title: '技术面试',
    description: '针对技术岗位的专业面试',
    icon: 'el-icon-cpu',
    duration: '30分钟',
    difficulty: '中等',
    backgroundImage: '/pic/mianshi/jishu.png'
  },
  {
    id: 2,
    title: '行为面试',
    description: '基于STAR法则的行为面试',
    icon: 'el-icon-s-order',
    duration: '20分钟',
    difficulty: '简单',
    backgroundImage: '/pic/mianshi/xingwei.png'
  },
  {
    id: 3,
    title: '压力面试',
    description: '模拟高压环境下的面试',
    icon: 'el-icon-warning-outline',
    duration: '25分钟',
    difficulty: '困难',
    backgroundImage: '/pic/mianshi/yali.png'
  },
  {
    id: 4,
    title: '综合面试',
    description: '包含多种面试问题类型',
    icon: 'el-icon-s-grid',
    duration: '45分钟',
    difficulty: '中等',
    backgroundImage: '/pic/mianshi/zonghe.png'
  }
])

// 面试历史
const interviewHistory = ref([
  {
    id: 1,
    title: '技术面试 - 康复辅具评估师',
    date: '2026-02-28',
    duration: '28分钟',
    score: 88
  },
  {
    id: 2,
    title: '行为面试 - 养老社区运营专员',
    date: '2026-02-15',
    duration: '22分钟',
    score: 92
  },
  {
    id: 3,
    title: '压力面试 - 智慧养老系统实施',
    date: '2026-01-30',
    duration: '30分钟',
    score: 75
  },
  {
    id: 4,
    title: '综合面试 - 高级养老照护专员',
    date: '2026-01-12',
    duration: '42分钟',
    score: 85
  }
])

// AI设置
const aiSettings = ref({
  personality: 'professional',
  difficulty: 'intermediate',
  duration: '30',
  questionType: 'behavioral'
})

// 面试弹窗
const interviewDialogVisible = ref(false)
const currentQuestion = ref('请简单介绍一下自己，并说明为什么选择我们公司？')
const interviewTimer = ref('00:00')
let timerInterval = null

// 选择面试选项
const selectOption = (optionId) => {
  selectedOption.value = optionId
}

// 开始面试
const startInterview = (option) => {
  console.log('开始面试:', option)
  // 清除选中状态，避免卡片保持紫色边框
  selectedOption.value = null
  interviewDialogVisible.value = true
  startTimer()
}

// 开始计时器
const startTimer = () => {
  let seconds = 0
  timerInterval = setInterval(() => {
    seconds++
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    interviewTimer.value = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, 1000)
}

// 停止计时器
const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// 回答问题
const answerQuestion = () => {
  console.log('回答问题')
  // 这里可以添加语音识别或文本输入功能
}

// 跳过问题
const skipQuestion = () => {
  console.log('跳过问题')
  // 这里可以切换到下一个问题
}

// 结束面试
const endInterview = () => {
  console.log('结束面试')
  interviewDialogVisible.value = false
  stopTimer()
}

// 查看面试详情
const viewInterviewDetail = (record) => {
  console.log('查看面试详情:', record)
}

// 回顾面试
const reviewInterview = (record) => {
  console.log('回顾面试:', record)
}

// 重新练习
const retryInterview = (record) => {
  console.log('重新练习:', record)
  startInterview(record)
}

// 获取分数样式类
const getScoreClass = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  return 'poor'
}

// 保存设置
const saveSettings = () => {
  console.log('保存设置:', aiSettings.value)
  // 这里可以保存到本地存储或发送到服务器
}

// 重置设置
const resetSettings = () => {
  aiSettings.value = {
    personality: 'professional',
    difficulty: 'intermediate',
    duration: '30',
    questionTypes: ['behavioral', 'technical']
  }
}

onMounted(() => {
  console.log('AI虚拟面试页面已加载')
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.ai-virtual-interview-container {
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 100%;
  overflow: hidden;
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

.interview-dashboard {
  display: grid;
  gap: 30px;
}

.stats-section {
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.stat-card {
  background: transparent;
  color: #1f2937;
  padding: 20px;
  display: flex;
  align-items: center;
}


.stat-content {
  flex: 1;
  display: flex;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.quick-start-section, .history-section, .settings-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.quick-start-section h3, .history-section h3, .settings-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 30px 0;
}

.interview-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 100%;
}

/* 移除不再需要的样式 */

.interview-option {
  background: white;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.3s ease;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex-direction: column;
  min-height: 120px;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding-right: 68px; /* 为右侧图片预留空间 */
}

/* 右侧上方的小图片样式 */
.option-image {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 68px;
  height: 68px;
  border-radius: 8px;
  overflow: hidden;
  z-index: 2;
  flex-shrink: 0;
}

.option-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}


.interview-option.active {
  border-color: #667eea;
}

.option-icon {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: linear-gradient(135deg, #d2dafc8d, #a762ec80);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.option-icon i {
  color: white;
  font-size: 20px;
}

.option-content {
  flex: 1;
  position: relative;
  z-index: 3;
  min-width: 0; /* 防止flex子元素溢出 */
  overflow: hidden; /* 防止内容溢出 */
}

.option-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.option-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.option-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.duration, .difficulty {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.option-action {
  flex-shrink: 0;
  position: relative;
  z-index: 3;
  align-self: flex-end;
}

.option-action .el-button {
  width: 120px;
  height: 36px;
  border-radius: 18px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.option-action .el-button:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.option-action .el-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .interview-options {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .option-title {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .interview-options {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .option-title {
    font-size: 16px;
  }
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}

.history-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #f8fafc;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 33px;
}

.history-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  text-align: left;
}

.history-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #6b7280;
  align-items: center;
}

.history-meta .date {
  color: #9ca3af;
}

.history-meta .duration {
  color: #6b7280;
}

.score.excellent { color: #10b981; font-weight: 600; }
.score.good { color: #3b82f6; font-weight: 600; }
.score.average { color: #f59e0b; font-weight: 600; }
.score.poor { color: #ef4444; font-weight: 600; }

.history-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.history-actions .el-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  min-width: 80px;
}

.history-actions .el-button--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.25);
}

.history-actions .el-button--primary:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.35);
}

.history-actions .el-button:not(.el-button--primary) {
  background: #ffffff;
  border-color: #e5e7eb;
  color: #374151;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.history-actions .el-button:not(.el-button--primary):hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr) auto;
  gap: 16px;
  align-items: end;
}

.setting-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.setting-item label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  min-width: 70px;
}

.setting-select {
  width: 120px;
}

.settings-actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: stretch;
  min-width: 100px;
}

.settings-actions .el-button {
  height: 36px;
  font-size: 13px;
  border-radius: 6px;
  font-weight: 500;
}

.settings-actions .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.settings-actions .el-button--primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transform: translateY(-1px);
}

.settings-actions .el-button:not(.el-button--primary) {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  color: #6b7280;
}

.settings-actions .el-button:not(.el-button--primary):hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
  transform: translateY(-1px);
}

.interview-dialog {
  display: flex;
  gap: 50px;
  align-items: flex-start;
}

.interview-avatar {
  text-align: center;
  flex-shrink: 0;
}

.interview-avatar img {
  width: 320px;
  height: 320px;
  border-radius: 10%;
  margin-bottom: 12px;
  margin-top: 20px;
  margin-left: 40px;
}

.avatar-status {
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
}

.avatar-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-left: 40px;
}

.interview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 顶部对齐问题描述，底部对齐操作按钮 */
  height: 320px; /* 与左侧图片高度对齐 */
  margin-top: 20px;
}

.current-question h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  text-align: left;
}

.current-question p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 20px 0;
  text-align: left;
}

.interview-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 20px;
}

.interview-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.interview-actions .el-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.interview-actions .el-button--primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.interview-actions .el-button--primary:hover {
  background: linear-gradient(135deg, #5a67d8, #6b46c1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.interview-actions .el-button--danger {
  background: linear-gradient(135deg, #f56565, #e53e3e);
  border-color: #f56565;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(245, 101, 101, 0.3);
}

.interview-actions .el-button--danger:hover {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
}

.interview-actions .el-button:not(.el-button--primary):not(.el-button--danger) {
  background: #ffffff;
  border-color: #d1d5db;
  color: #374151;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.interview-actions .el-button:not(.el-button--primary):not(.el-button--danger):hover {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

/* 麦克风可视化（纯CSS动画） */
.mic-visualizer {
  margin: 4px 0 16px 0;
  padding: 10px 12px;
  background: #f3f4f6;
  border-radius: 8px;
}

.mic-visualizer .bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 36px;
}

.mic-visualizer .bars span {
  display: inline-block;
  width: 4px;
  height: 8px;
  background: linear-gradient(180deg, #22c55e, #16a34a);
  border-radius: 2px;
  animation: barPulse 1s ease-in-out infinite;
  transform-origin: center bottom;
}

.mic-visualizer .bars span:nth-child(1) { animation-delay: 0s; }
.mic-visualizer .bars span:nth-child(2) { animation-delay: 0.05s; }
.mic-visualizer .bars span:nth-child(3) { animation-delay: 0.1s; }
.mic-visualizer .bars span:nth-child(4) { animation-delay: 0.15s; }
.mic-visualizer .bars span:nth-child(5) { animation-delay: 0.2s; }
.mic-visualizer .bars span:nth-child(6) { animation-delay: 0.25s; }
.mic-visualizer .bars span:nth-child(7) { animation-delay: 0.3s; }
.mic-visualizer .bars span:nth-child(8) { animation-delay: 0.35s; }
.mic-visualizer .bars span:nth-child(9) { animation-delay: 0.4s; }
.mic-visualizer .bars span:nth-child(10) { animation-delay: 0.45s; }

@keyframes barPulse {
  0%, 100% { height: 8px; opacity: 0.7; }
  50% { height: 32px; opacity: 1; }
}

.mic-visualizer .mic-label {
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-virtual-interview-container {
    padding: 16px;
  }
  
  .stats-section {
    grid-template-columns: 1fr;
  }
  
  .interview-option {
    flex-direction: column;
    text-align: center;
    min-height: 160px;
    padding-right: 20px; /* 移动端恢复正常的padding */
  }
  
  .option-image {
    position: relative;
    top: auto;
    right: auto;
    width: 60px;
    height: 60px;
    margin: 0 auto 12px auto;
  }
  
  .option-content {
    padding-right: 0;
    text-align: center;
  }
  
  .option-action {
    align-self: center;
  }
  
  .option-action .el-button {
    width: 100%;
  }
  
  .history-item {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    padding: 16px;
  }
  
  .history-info {
    text-align: center;
  }
  
  .history-meta {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .history-actions {
    justify-content: center;
    gap: 8px;
  }
  
  .history-actions .el-button {
    padding: 6px 12px;
    font-size: 12px;
    min-width: 70px;
  }
  
  .settings-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  .setting-item {
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }
  
  .setting-item label {
    min-width: 60px;
    font-size: 12px;
  }
  
  .setting-select {
    width: 100px;
  }
  
  .settings-actions {
    flex-direction: row;
    justify-content: center;
    margin-top: 16px;
    gap: 12px;
  }
  
  .settings-actions .el-button {
    flex: 1;
    max-width: 120px;
  }
  
  .interview-dialog {
    flex-direction: column;
    text-align: center;
  }
  .interview-content {
    height: auto; /* 移动端取消固定高度，避免布局拥挤 */
  }
  
  .interview-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .interview-actions .el-button {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>
