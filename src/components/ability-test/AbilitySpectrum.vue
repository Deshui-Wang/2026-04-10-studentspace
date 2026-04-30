<template>
  <div class="literacy-graph-container">
    <!-- 1. 核心图谱画布 -->
    <div class="graph-canvas-wrap" ref="canvasWrap" @mousemove="handleMouseMove">
      <svg class="graph-svg" :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`" preserveAspectRatio="xMidYMid meet">
        <!-- 定义渐变和滤镜 -->
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.4" />
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.9" />
          </linearGradient>
        </defs>

        <!-- 背景连接线 -->
        <g class="links-layer">
          <path 
            v-for="(link, index) in links" 
            :key="`link-${index}`"
            :d="calculatePath(link)"
            :class="['graph-link', { active: isLinkActive(link) }]"
          />
        </g>

        <!-- 节点层 -->
        <g class="nodes-layer">
          <g 
            v-for="node in nodes" 
            :key="node.id" 
            class="node-group"
            :class="{ dimmed: activeNode && !isNodeRelated(node) }"
            @mouseenter="handleNodeHover(node)"
            @mouseleave="handleNodeLeave"
          >
            <!-- 节点外圈 -->
            <circle 
              :cx="node.x" 
              :cy="node.y" 
              :r="node.r + 4" 
              class="node-outer"
              :style="{ stroke: node.color }"
            />
            <!-- 节点主体 -->
            <circle 
              :cx="node.x" 
              :cy="node.y" 
              :r="node.r" 
              class="node-inner"
              :style="{ fill: node.color }"
            />
            <!-- 节点文本 -->
            <text 
              :x="node.x" 
              :y="node.y + node.r + 18" 
              text-anchor="middle" 
              class="node-label"
            >
              {{ node.label }}
            </text>
            <!-- 百分比数值 -->
            <text 
              :x="node.x" 
              :y="node.y + 4" 
              text-anchor="middle" 
              class="node-value"
            >
              {{ node.value }}%
            </text>
          </g>
        </g>

        <!-- 右侧目标岗位层 -->
        <g class="jobs-layer">
          <rect 
            v-for="(job, index) in jobs" 
            :key="`job-${index}`"
            :x="canvasWidth - 180"
            :y="job.y - 20"
            width="160"
            height="40"
            rx="20"
            class="job-card"
            :class="{ active: isJobRelated(job) }"
          />
          <text 
            v-for="(job, index) in jobs" 
            :key="`job-text-${index}`"
            :x="canvasWidth - 100"
            :y="job.y + 5"
            text-anchor="middle"
            class="job-label"
          >
            {{ job.name }}
          </text>
        </g>
      </svg>
      
      <!-- 图例 -->
      <div class="legend-overlay">
        <div class="legend-item"><span class="dot knowledge"></span>知识点</div>
        <div class="legend-item"><span class="dot skill"></span>技能点</div>
        <div class="legend-item"><span class="dot ability"></span>核心素养</div>
      </div>
    </div>

    <!-- 3. 底部详细信息浮层 (改为跟随鼠标) -->
    <transition name="fade">
      <div 
        v-if="activeNode" 
        class="node-detail-panel"
        :style="{ 
          left: `${mousePos.x + 20}px`, 
          top: `${mousePos.y + 20}px` 
        }"
      >
        <div class="detail-header" :style="{ borderLeftColor: activeNode.color }">
          <h4>{{ activeNode.label }}</h4>
          <span class="type-tag" :style="{ background: activeNode.color }">{{ activeNode.type }}</span>
        </div>
        <p class="detail-desc">{{ activeNode.desc }}</p>
        <div class="impact-stats">
          <div class="stat-item">
            <span class="s-label">岗位匹配度贡献</span>
            <span class="s-val">+{{ (activeNode.value * 0.15).toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- 4. 新增：底部 AI 智能诊断区域 -->
    <div class="insights-section">
      <div class="insight-card score-card">
        <div class="card-label">综合能力得分</div>
        <div class="score-display">
          <span class="score-num">84.5</span>
          <span class="score-trend up">↑ 2.4</span>
        </div>
        <div class="score-desc">超越全校 89% 的同类专业学生</div>
      </div>

      <div class="insight-card analysis-card">
        <div class="card-title"><i class="el-icon-cpu"></i> AI 核心诊断</div>
        <div class="analysis-tags">
          <div class="ana-tag success">核心素养卓越</div>
          <div class="ana-tag primary">技术栈均衡</div>
          <div class="ana-tag warning">实战经验待加强</div>
        </div>
        <p class="analysis-text">
          根据您的能力检测数据，您的“老年生理学”与“共情素养”已达到行业高标准。当前主要的提升空间在于“数字化方案设计”的逻辑深度，建议在接下来的课程中加强对适老化交互案例的深度拆解。
        </p>
      </div>

      <div class="insight-card path-card">
        <div class="card-title"><i class="el-icon-guide"></i> 进阶路径建议</div>
        <div class="path-steps">
          <div class="path-step">
            <span class="step-icon">01</span>
            <div class="step-info">
              <h6>完成 Python 爬虫实战</h6>
              <p>针对健康数据采集模块进行强化</p>
            </div>
          </div>
          <div class="path-step">
            <span class="step-icon">02</span>
            <div class="step-info">
              <h6>参与智慧助老实训项目</h6>
              <p>将理论知识转化为真实的解决方案能力</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const canvasWidth = 1200
const canvasHeight = 650
const activeNode = ref(null)
const mousePos = ref({ x: 0, y: 0 })

// 处理鼠标移动，记录坐标
const handleMouseMove = (e) => {
  if (!activeNode.value) return
  // 获取相对于容器的坐标
  const rect = e.currentTarget.getBoundingClientRect()
  mousePos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

// 节点数据定义
const nodes = ref([
  // 左侧起点层 (Roots)
  { id: 'k1', x: 150, y: 150, r: 35, label: '专业知识', type: '知识', value: 85, color: '#3b82f6', desc: '涵盖老年学、康复学、心理学等理论基础' },
  { id: 's1', x: 150, y: 325, r: 35, label: '实践技能', type: '技能', value: 78, color: '#10b981', desc: '包括智能设备操作、康复护理实操等' },
  { id: 'a1', x: 150, y: 500, r: 35, label: '核心素养', type: '素养', value: 92, color: '#f59e0b', desc: '包含共情能力、职业道德、沟通技巧' },

  // 中间层 (Knowledge Points)
  { id: 'n1', x: 450, y: 100, r: 28, label: 'Python基础', type: '技能', value: 72, color: '#10b981', desc: '用于康养数据处理与自动化工作流' },
  { id: 'n2', x: 480, y: 200, r: 32, label: '老年生理学', type: '知识', value: 94, color: '#3b82f6', desc: '对高龄群体身体机能的深度理解' },
  { id: 'n3', x: 520, y: 325, r: 30, label: 'UI设计界面', type: '技能', value: 65, color: '#10b981', desc: '适老化移动端界面的交互设计能力' },
  { id: 'n4', x: 480, y: 450, r: 28, label: '共情心理', type: '素养', value: 88, color: '#f59e0b', desc: '与老年群体建立深层信任的核心纽带' },
  { id: 'n5', x: 450, y: 550, r: 30, label: '数据分析', type: '技能', value: 81, color: '#10b981', desc: '对健康监测数据的统计与趋势预测' },

  // 进阶层 (Advanced Skills)
  { id: 'n6', x: 750, y: 180, r: 40, label: '智能健康管理', type: '技能', value: 85, color: '#8b5cf6', desc: '综合运用软硬件进行健康干预' },
  { id: 'n7', x: 750, y: 470, r: 40, label: '数字化方案设计', type: '技能', value: 76, color: '#8b5cf6', desc: '为康养机构提供全套数字化转型方案' }
])

// 岗位数据
const jobs = ref([
  { id: 'j1', y: 150, name: '智慧康养架构师' },
  { id: 'j2', y: 325, name: '数字化产品经理' },
  { id: 'j3', y: 500, name: '健康数据分析师' }
])

// 连线数据
const links = ref([
  { from: 'k1', to: 'n2' }, { from: 'k1', to: 'n1' },
  { from: 's1', to: 'n1' }, { from: 's1', to: 'n3' }, { from: 's1', to: 'n5' },
  { from: 'a1', to: 'n4' }, { from: 'a1', to: 'n3' },
  { from: 'n1', to: 'n6' }, { from: 'n2', to: 'n6' }, { from: 'n5', to: 'n6' },
  { from: 'n3', to: 'n7' }, { from: 'n4', to: 'n7' }, { from: 'n5', to: 'n7' },
  { from: 'n6', to: 'j1' }, { from: 'n7', to: 'j2' }, { from: 'n5', to: 'j3' }, { from: 'n6', to: 'j3' }
])

// 计算 SVG 路径
const calculatePath = (link) => {
  const fromNode = nodes.value.find(n => n.id === link.from)
  const toNode = nodes.value.find(n => n.id === link.to) || { x: canvasWidth - 180, y: jobs.value.find(j => j.id === link.to)?.y }
  
  if (!fromNode || !toNode) return ''
  
  const cp1x = fromNode.x + (toNode.x - fromNode.x) / 2
  const cp2x = fromNode.x + (toNode.x - fromNode.x) / 2
  
  return `M ${fromNode.x} ${fromNode.y} C ${cp1x} ${fromNode.y} ${cp2x} ${toNode.y} ${toNode.x} ${toNode.y}`
}

// 交互逻辑
const handleNodeHover = (node) => {
  activeNode.value = node
}

const handleNodeLeave = () => {
  activeNode.value = null
}

const isLinkActive = (link) => {
  if (!activeNode.value) return false
  return link.from === activeNode.value.id || link.to === activeNode.value.id
}

const isNodeRelated = (node) => {
  if (!activeNode.value) return true
  if (node.id === activeNode.value.id) return true
  return links.value.some(l => 
    (l.from === activeNode.value.id && l.to === node.id) || 
    (l.to === activeNode.value.id && l.from === node.id)
  )
}

const isJobRelated = (job) => {
  if (!activeNode.value) return false
  return links.value.some(l => l.from === activeNode.value.id && l.to === job.id)
}
</script>

<style scoped>
.literacy-graph-container {
  padding: 0 0 40px 0;
  background: #0f172a; /* 深色科技感背景 */
  border-radius: 12px;
  color: white;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  height: auto;
  min-height: 800px;
}

/* 画布样式 */
.graph-canvas-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.graph-svg {
  width: 100%;
  height: 100%;
}

/* 连线样式 */
.graph-link {
  fill: none;
  stroke: url(#lineGrad);
  stroke-width: 1.5;
  transition: all 0.4s;
  opacity: 0.4; /* 提高默认亮度 */
}

.graph-link.active {
  stroke: #3b82f6;
  stroke-width: 3;
  opacity: 1;
  filter: url(#glow);
}

/* 节点样式 */
.node-group {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.node-group.dimmed {
  opacity: 0.1;
}

.node-outer {
  fill: none;
  stroke-width: 2;
  stroke-dasharray: 4 2;
  opacity: 0.3;
  transition: all 0.3s ease;
}

.node-inner {
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3));
  transition: r 0.3s;
}

.node-group:hover .node-outer {
  opacity: 0.8;
  stroke-dasharray: none; /* 悬浮时虚线变实线，增加确定感 */
}

.node-group:hover .node-inner {
  r: 40;
}

.node-label {
  fill: #94a3b8;
  font-size: 12px;
  font-weight: 600;
}

.node-value {
  fill: white;
  font-size: 11px;
  font-weight: 800;
  pointer-events: none;
}

/* 岗位卡片 */
.job-card {
  fill: rgba(255, 255, 255, 0.05);
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
  transition: all 0.3s;
}

.job-card.active {
  fill: rgba(59, 130, 246, 0.1);
  stroke: #3b82f6;
  stroke-width: 2;
}

.job-label {
  fill: #fff;
  font-size: 14px;
  font-weight: 600;
  pointer-events: none;
}

/* 详情面板 (Tooltip 模式) */
.node-detail-panel {
  position: absolute;
  width: 260px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  pointer-events: none; /* 防止遮挡鼠标导致 mouseleave 触发 */
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-left: 4px solid #3b82f6;
  padding-left: 12px;
}

.detail-header h4 {
  margin: 0;
  font-size: 16px;
}

.type-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.detail-desc {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 10px;
  border-radius: 6px;
}

.s-val {
  color: #10b981;
  font-weight: 700;
}

.legend-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 16px;
  background: rgba(0,0,0,0.3);
  padding: 8px 16px;
  border-radius: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot.knowledge { background: #3b82f6; }
.dot.skill { background: #10b981; }
.dot.ability { background: #f59e0b; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }

/* AI 诊断区域样式 */
.insights-section {
  display: grid;
  grid-template-columns: 240px 1fr 1fr;
  gap: 24px;
  padding: 0 32px 32px 32px;
  margin-top: -20px; /* 紧贴画布 */
}

.insight-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s;
}

.insight-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(59, 130, 246, 0.3);
}

.card-label { font-size: 13px; color: #94a3b8; margin-bottom: 12px; }
.score-num { font-size: 48px; font-weight: 800; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.score-trend { font-size: 14px; margin-left: 10px; font-weight: 700; }
.score-trend.up { color: #10b981; }
.score-desc { font-size: 12px; color: #64748b; margin-top: 12px; }

.card-title { font-size: 16px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; color: #fff; }
.card-title i { color: #3b82f6; }

.analysis-tags { display: flex; gap: 8px; margin-bottom: 16px; }
.ana-tag { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.ana-tag.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.ana-tag.primary { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.ana-tag.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

.analysis-text { font-size: 13px; color: #94a3b8; line-height: 1.8; margin: 0; }

.path-steps { display: flex; flex-direction: column; gap: 16px; }
.path-step { display: flex; gap: 16px; align-items: center; }
.step-icon { width: 32px; height: 32px; background: rgba(139, 92, 246, 0.1); color: #8b5cf6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
.step-info h6 { margin: 0; font-size: 14px; color: #fff; }
.step-info p { margin: 2px 0 0 0; font-size: 11px; color: #64748b; }
</style>
