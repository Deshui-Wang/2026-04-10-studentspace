<template>
  <div class="career-section-container">
    <div class="section-header">
      <h2 class="section-title">AI 虚拟面试</h2>
      <p class="section-subtitle">24小时在线的 AI 面试官，助你随时随地练习，提升职场竞争力</p>
    </div>

    <div class="ai-interview-main">
      <!-- 左侧预览与统计 -->
      <div class="interview-preview-panel">
        <div class="ai-avatar-card">
          <div class="card-glass">
            <img src="/pic/tea/shuziren01.png" class="ai-avatar" />
            <div class="status-indicator">
              <span class="dot"></span>
              在线候命中
            </div>
          </div>
          <div class="ai-info">
            <h4>AI 面试官：Vicky</h4>
            <p>擅长：互联网/技术/金融行业面试</p>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-mini-card">
            <div class="stat-icon blue"><i class="el-icon-timer"></i></div>
            <div class="stat-content">
              <span class="label">累计练习</span>
              <span class="value">12.5h</span>
            </div>
          </div>
          <div class="stat-mini-card">
            <div class="stat-icon purple"><i class="el-icon-data-analysis"></i></div>
            <div class="stat-content">
              <span class="label">平均得分</span>
              <span class="value">88</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧控制中心 -->
      <div class="interview-config-panel">
        <div class="config-card">
          <h3><i class="el-icon-magic-stick"></i> 开启模拟面试</h3>
          <p class="config-desc">请选择您想要模拟的职业方向，AI 将为您生成专属面试题目</p>
          
          <div class="options-grid">
            <div 
              v-for="job in jobCategories" 
              :key="job" 
              class="job-option"
              :class="{active: selectedJob === job}"
              @click="selectedJob = job"
            >
              {{ job }}
            </div>
          </div>

          <div class="difficulty-selector">
            <span class="label">面试难度：</span>
            <el-radio-group v-model="difficulty" size="small">
              <el-radio-button label="初级"></el-radio-button>
              <el-radio-button label="中级"></el-radio-button>
              <el-radio-button label="高级"></el-radio-button>
            </el-radio-group>
          </div>

          <el-button type="primary" class="start-btn" @click="startInterview">
            开始模拟面试 <i class="el-icon-right"></i>
          </el-button>
        </div>

        <div class="recent-reports">
          <div class="reports-header">
            <h4>最近面试报告</h4>
            <el-button type="text">查看全部</el-button>
          </div>
          <div class="report-list">
            <div v-for="i in 3" :key="i" class="report-item">
              <div class="report-main">
                <i class="el-icon-document-checked"></i>
                <div class="report-info">
                  <span class="report-name">后端开发 - {{ ['中级', '初级', '中级'][i-1] }}</span>
                  <span class="report-date">2026-04-2{{i+2}}</span>
                </div>
              </div>
              <div class="report-score">{{ 80+i*2 }}分</div>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 面试进行中弹窗 (根据截图复刻) -->
    <el-dialog
      v-model="interviewing"
      width="900px"
      :show-close="true"
      :close-on-click-modal="false"
      class="interview-session-dialog"
      title="AI虚拟面试进行中"
      center
      @opened="startTimer"
      @closed="stopTimer"
    >
      <div class="interview-session-body">
        <!-- 左侧：面试官形象 -->
        <div class="session-left">
          <div class="interviewer-frame">
            <img src="/pic/tea/shuziren01.png" class="interviewer-img" />
          </div>
          <div class="session-status">
            <span class="status-text">正在面试中...</span>
            <span class="timer-text">{{ formattedTime }}</span>
          </div>
        </div>

        <!-- 右侧：面试互动区 -->
        <div class="session-right">
          <div class="question-box">
            <h4 class="question-label">当前问题：</h4>
            <p class="question-content">请简单介绍一下自己，并说明为什么选择我们公司？</p>
          </div>

          <div class="voice-capture-area">
            <div class="wave-container">
              <div v-for="n in 12" :key="n" class="wave-bar" :style="{height: Math.random()*30 + 10 + 'px', animationDelay: n*0.1 + 's'}"></div>
            </div>
            <span class="capture-text">正在采集语音...</span>
          </div>

          <div class="session-actions">
            <el-button class="action-btn purple" @click="interviewing = false">回答完毕</el-button>
            <el-button class="action-btn outline">跳过问题</el-button>
            <el-button class="action-btn red" @click="interviewing = false">结束面试</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const jobCategories = ['技术开发', '产品经理', '运营策划', '设计视觉', '市场营销', '职能管理']
const selectedJob = ref('技术开发')
const difficulty = ref('中级')
const interviewing = ref(false)

// 计时器逻辑
const seconds = ref(0)
let timer = null

const formattedTime = computed(() => {
  const m = Math.floor(seconds.value / 60).toString().padStart(2, '0')
  const s = (seconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

const startInterview = () => {
  interviewing.value = true
}

const startTimer = () => {
  seconds.value = 0
  timer = setInterval(() => {
    seconds.value++
  }, 1000)
}

const stopTimer = () => {
  if (timer) clearInterval(timer)
}
</script>

<style scoped>
.career-section-container {
  padding: 40px;
  background: #f8fafc;
  min-height: 100%;
}

.section-header {
  margin-bottom: 48px;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  color: #64748b;
  font-size: 16px;
}

.ai-interview-main {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 40px;
}

/* 左侧面板 */
.interview-preview-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ai-avatar-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  border: 1px solid #eef2f6;
}

.card-glass {
  height: 380px;
  position: relative;
  background: #f1f5f9;
}

.ai-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.status-indicator {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: blink 2s infinite;
}

.ai-info {
  padding: 20px;
  text-align: center;
}

.ai-info h4 { margin: 0 0 4px 0; font-size: 17px; color: #1e293b; }
.ai-info p { margin: 0; font-size: 13px; color: #64748b; }

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.stat-mini-card {
  background: white;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #eef2f6;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-icon.blue { background: #eff6ff; color: #3b82f6; }
.stat-icon.purple { background: #f5f3ff; color: #8b5cf6; }

.stat-content { display: flex; flex-direction: column; }
.stat-content .label { font-size: 12px; color: #64748b; }
.stat-content .value { font-size: 18px; font-weight: 700; color: #1e293b; }

/* 右侧面板 */
.interview-config-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.config-card {
  background: white;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid #eef2f6;
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
}

.config-card h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-card h3 i { color: #3b82f6; }

.config-desc { color: #64748b; font-size: 14px; margin-bottom: 24px; }

.options-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.job-option {
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
}

.job-option:hover { background: #f8fafc; border-color: #3b82f6; }
.job-option.active { background: #eff6ff; border-color: #3b82f6; color: #3b82f6; }

.difficulty-selector {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.difficulty-selector .label { font-size: 14px; font-weight: 600; color: #1e293b; }

.start-btn {
  width: 100%;
  height: 52px;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 700;
}

/* 面试报告 */
.recent-reports {
  background: white;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid #eef2f6;
}

.reports-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.reports-header h4 { margin: 0; font-size: 16px; }

.report-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.report-item:hover { background: #f8fafc; }

.report-main { display: flex; align-items: center; gap: 14px; flex: 1; }
.report-main i { font-size: 20px; color: #3b82f6; }

.report-info { display: flex; flex-direction: column; }
.report-name { font-size: 14px; font-weight: 600; color: #1e293b; }
.report-date { font-size: 12px; color: #94a3b8; }

.report-score { font-size: 16px; font-weight: 700; color: #3b82f6; margin-right: 16px; }

/* 弹窗内容复刻 */
.interview-session-body {
  display: flex;
  gap: 40px;
  padding: 20px 10px;
}

.session-left {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.interviewer-frame {
  width: 100%;
  height: 320px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
}

.interviewer-img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  object-position: top center;
}

.session-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.status-text { color: #3b82f6; font-size: 14px; font-weight: 600; }
.timer-text { color: #94a3b8; font-size: 16px; font-family: monospace; }

.session-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.question-box {
  background: #fff;
  border-radius: 0;
  padding: 0;
}

.question-label { margin: 0 0 12px 0; font-size: 18px; color: #1e293b; }
.question-content { font-size: 16px; color: #64748b; line-height: 1.6; }

.voice-capture-area {
  background: #f8fafc;
  border-radius: 12px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.wave-container {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
}

.wave-bar {
  width: 4px;
  background: #22c55e;
  border-radius: 2px;
  animation: wave 1s infinite alternate;
}

.capture-text { font-size: 13px; color: #94a3b8; }

.session-actions {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.action-btn {
  height: 40px;
  padding: 0 24px;
  border-radius: 8px;
  font-weight: 600;
}

.action-btn.purple { background: #7c3aed; color: white; border: none; }
.action-btn.outline { border: 1px solid #e2e8f0; color: #64748b; }
.action-btn.red { background: #ef4444; color: white; border: none; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes wave {
  from { transform: scaleY(0.5); }
  to { transform: scaleY(1.5); }
}

/* 弹窗深度样式 */
:deep(.el-dialog) {
  border-radius: 24px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  margin: 0;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}
</style>
