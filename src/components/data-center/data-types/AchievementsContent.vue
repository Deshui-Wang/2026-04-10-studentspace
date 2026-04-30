<template>
  <div class="ai-portfolio-container">
    <!-- 0. 数字化成果专业头部 -->
    <div class="portfolio-header">
      <div class="header-content">
        <div class="title-area">
          <div class="header-icon">
            <i class="el-icon-trophy"></i>
          </div>
          <div class="header-text">
            <h2 class="main-title">数字化成果展区</h2>
            <p class="sub-title">沉淀个人 AIGC 创作实战成果，构建数字化竞争优势</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" size="medium" round icon="el-icon-share">分享成果</el-button>
          <el-button type="info" size="medium" round plain icon="el-icon-download">导出报告</el-button>
        </div>
      </div>
      <!-- 装饰背景 -->
      <div class="header-bg-decoration"></div>
    </div>

    <!-- 顶部概览统计 -->
    <div class="portfolio-stats">
      <div class="stat-card orange">
        <div class="stat-icon"><i class="el-icon-user"></i></div>
        <div class="stat-info">
          <span class="stat-label">已生成数字人</span>
          <span class="stat-number">2</span>
        </div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon"><i class="el-icon-connection"></i></div>
        <div class="stat-info">
          <span class="stat-label">已设计工作流</span>
          <span class="stat-number">12</span>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon"><i class="el-icon-cpu"></i></div>
        <div class="stat-info">
          <span class="stat-label">已训练智能体</span>
          <span class="stat-number">8</span>
        </div>
      </div>
    </div>

    <!-- 1. 数字人成果展区 (双人大幅竖版) -->
    <div class="portfolio-section">
      <div class="section-title-wrapper">
        <h3 class="section-title">我的数字人 (Digital Humans)</h3>
        <span class="item-count">2 个成果</span>
      </div>
      <div class="portfolio-grid dh-focus-grid">
        <div v-for="i in 2" :key="'dh'+i" class="portfolio-card dh-focus-card">
          <div class="card-preview dh-focus-bg">
            <img :src="`/pic/tea/shuziren0${i}.png`" class="dh-img-focus" />
          </div>
          <div class="card-info">
            <h4>{{ dhTitles[i-1] }}</h4>
            <p>{{ dhDescs[i-1] }}</p>
            <div class="card-footer">
              <span class="tag">虚拟形象</span>
              <span class="date">2026.04.2{{i}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 工作流成果展区 -->
    <div class="portfolio-section">
      <div class="section-title-wrapper">
        <h3 class="section-title">我的工作流 (Workflows)</h3>
        <span class="item-count">12 个成果</span>
      </div>
      <div class="portfolio-grid">
        <div v-for="i in 3" :key="'wf'+i" class="portfolio-card workflow">
          <div class="card-preview workflow-bg">
            <div class="node-map">
              <div class="node mini"></div>
              <div class="line mini"></div>
              <div class="node mini"></div>
            </div>
          </div>
          <div class="card-info">
            <h4>{{ workflowTitles[i-1] }}</h4>
            <p>{{ workflowDescs[i-1] }}</p>
            <div class="card-footer">
              <span class="tag">AI 逻辑</span>
              <span class="date">2026.04.1{{i}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 智能体成果展区 -->
    <div class="portfolio-section">
      <div class="section-title-wrapper">
        <h3 class="section-title">我的智能体 (Agents)</h3>
        <span class="item-count">8 个成果</span>
      </div>
      <div class="portfolio-grid">
        <div v-for="i in 3" :key="'ag'+i" class="portfolio-card agent">
          <div class="card-preview agent-bg">
            <div class="agent-avatar-mini">
              <i class="el-icon-chat-dot-round"></i>
            </div>
          </div>
          <div class="card-info">
            <h4>{{ agentTitles[i-1] }}</h4>
            <p>{{ agentDescs[i-1] }}</p>
            <div class="card-footer">
              <span class="tag">对话助手</span>
              <span class="date">2026.04.0{{i}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. 智能评价展区 (新迁入) -->
    <div class="portfolio-section">
      <div class="section-title-wrapper">
        <h3 class="section-title">智能评价 (Digital Literacy Evaluation)</h3>
        <span class="item-count">AI 综合评估</span>
      </div>
      <div class="evaluation-container-box">
        <DigitalLiteracy />
      </div>
    </div>
  </div>
</template>

<script setup>
import DigitalLiteracy from '@/components/data-center/evaluation/DigitalLiteracy.vue'
const workflowTitles = ['自动论文校对流', '每日财经新闻精炼', 'Python代码漏洞检测']
const workflowDescs = ['利用 LLM 自动识别论文中的逻辑错误与语法缺陷', '聚合 5 个财经 API 并自动生成中文简报', '针对 Django 项目的安全性进行自动化静态审计']

const agentTitles = ['数学奥赛教练', '雅思口语陪练', '创意写作灵感包']
const agentDescs = ['精通初高中数学竞赛题库，提供解题思路而非答案', '模拟 15 种雅思真实考场场景，实时纠音并评分', '提供 100+ 种写作风格切换，辅助克服写作障碍']

const dhTitles = ['Vicky - 虚拟讲师', 'Leo - 技术导师']
const dhDescs = ['写实风格分身，用于录制英语教学视频', '多模态数字人，支持实时代码逻辑演示']
</script>

<style scoped>
.ai-portfolio-container {
  padding: 32px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* 新增：专业头部样式 */
.portfolio-header {
  background: linear-gradient(135deg, #1e2b45 0%, #2d3748 100%);
  border-radius: 24px;
  padding: 32px 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  margin-bottom: 8px;
}

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-area {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: rgba(255,255,255,0.15);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fbbf24;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

.main-title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: white;
  letter-spacing: 1px;
}

.sub-title {
  margin: 6px 0 0 0;
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-bg-decoration {
  position: absolute;
  top: -20%;
  right: -5%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
}

/* 统计卡片微调 */
.portfolio-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.blue .stat-icon { background: #eff6ff; color: #3b82f6; }
.purple .stat-icon { background: #f5f3ff; color: #8b5cf6; }
.orange .stat-icon { background: #fff7ed; color: #f97316; }

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
}

/* 展区部分 */
.portfolio-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 4px solid #3b82f6;
  padding-left: 16px;
}

.section-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.evaluation-container-box {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  border: 1px solid #eef2f6;
  padding: 0;
}

/* 数字人焦点布局 - 窄而高 */
.dh-focus-grid {
  display: flex !important;
  gap: 32px !important;
  justify-content: flex-start;
}

.dh-focus-card {
  width: 260px !important; /* 保持宽度较窄 */
  border-radius: 20px !important;
}

.dh-focus-bg {
  height: 320px !important; /* 显著增加高度 */
  background: #f1f5f9 !important;
}

.dh-img-focus {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: top; /* 确保能看到头部 */
}

/* 通用网格与卡片 */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.portfolio-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eef2f6;
  transition: all 0.3s ease;
}

.portfolio-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.card-preview {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.workflow-bg { background: linear-gradient(135deg, #60a5fa11 0%, #3b82f611 100%); }
.agent-bg { background: linear-gradient(135deg, #a78bfa11 0%, #8b5cf611 100%); }

.node-map { display: flex; align-items: center; gap: 8px; }
.node.mini { width: 20px; height: 20px; background: #3b82f6; border-radius: 4px; }
.line.mini { width: 15px; height: 1.5px; background: #cbd5e1; }

.agent-avatar-mini {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #8b5cf6;
}

.card-info { padding: 16px; }
.card-info h4 { margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #1e293b; }
.card-info p {
  margin: 0 0 16px 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  height: 34px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-footer { display: flex; align-items: center; justify-content: space-between; }
.tag { font-size: 10px; padding: 2px 6px; background: #f1f5f9; color: #475569; border-radius: 4px; }
.date { font-size: 11px; color: #94a3b8; }

@media (max-width: 768px) {
  .dh-focus-grid { flex-direction: column; align-items: center; }
  .portfolio-grid { grid-template-columns: 1fr; }
}
</style>
