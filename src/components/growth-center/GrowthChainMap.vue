<template>
  <div 
    class="chain-map-viewport" 
    :class="{ 'is-embedded': embedded }"
    @mousemove="onMouseMove" 
    @mouseup="onMouseUp"
  >
    <!-- 1. 顶部控制栏 (仅在非内嵌模式显示) -->
    <div class="top-control-bar" v-if="!embedded">
      <div class="header-tools-left">
        <div class="brand-logo">
          <div class="logo-icon"></div>
          <span>GROWTH SPACE</span>
        </div>
        <div class="space-tip-mini"><i class="el-icon-rank"></i> 自由拖拽模式</div>
        <el-button size="mini" class="glass-btn" @click="resetLayout">重置布局</el-button>
      </div>

      <div class="time-range-picker">
        <div class="timeline-visual">
          <div class="timeline-points">
            <div v-for="tag in ['入学', '大一下', '大二上', '大二下', '大三上', '大三下', '毕业']" :key="tag" class="point" :class="{ active: tag === '大二下' }">
              <span class="time-label">{{ tag }}</span>
            </div>
          </div>
          <div class="timeline-line">
            <div class="line-progress" style="width: 58%"></div>
            <div class="line-handle" style="left: 58%"></div>
          </div>
        </div>
      </div>

      <div class="action-group">
        <el-button size="small" type="primary" class="glow-btn" @click="$emit('close')">退出空间</el-button>
      </div>
    </div>

    <!-- 2. 中间：现代极简拓扑画布 -->
    <div class="topology-container" ref="canvas">
      <!-- 动态连线层 -->
      <svg class="link-layer" width="100%" height="100%">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L0,10 L10,5 Z" fill="#cbd5e1" />
          </marker>
        </defs>
        
        <!-- 连线与标签 -->
        <g v-for="(link, idx) in links" :key="idx">
          <path 
            :d="generatePath(link)"
            class="flow-path"
            :class="[link.type, { 'is-v': link.dir === 'v' }]"
          />
          <text class="path-label" :x="getPathMidPoint(link).x" :y="getPathMidPoint(link).y - 8">
            {{ link.val }}{{ link.unit || 'pts' }}
          </text>
        </g>
      </svg>

      <!-- 节点层 -->
      <div 
        v-for="node in nodes" 
        :key="node.id"
        class="node-card draggable-node"
        :class="[node.type + '-node', { 'is-dragging': draggingNodeId === node.id }]"
        :style="{ left: node.x + 'px', top: node.y + 'px', width: node.width + 'px' }"
        @mousedown="onMouseDown($event, node.id)"
      >
        <!-- 目标护盾 (实色渐变) -->
        <div v-if="node.type === 'shield'" class="shield-wrap">
          <div class="shield-hexagon"><i class="el-icon-medal"></i></div>
          <div class="shield-title">{{ node.title }}</div>
        </div>

        <!-- 复合节点 (白色卡片 + 浅灰内嵌块) -->
        <template v-else-if="node.type === 'complex'">
          <div class="node-header">
            <span class="status-indicator"></span>
            <span class="title">{{ node.title }}</span>
          </div>
          <div class="inner-cards">
            <div v-for="(sub, sidx) in node.subCards" :key="sidx" class="light-sub-card">
              <div class="sub-icon"><i class="el-icon-plus"></i></div>
              <div class="sub-body">
                <span class="sub-name">{{ sub.name }}</span>
                <span class="sub-val">{{ sub.val }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- 基础节点 (侧边装饰) -->
        <template v-else-if="node.type === 'base'">
          <div class="base-node-inner">
            <div class="base-icon"><i :class="node.icon"></i></div>
            <div class="base-content">
              <span class="base-label">{{ node.title }}</span>
              <span class="base-value">{{ node.val }} <small>{{ node.unit }}</small></span>
            </div>
          </div>
        </template>

        <div class="drag-handle-hint"></div>
      </div>

      <!-- 左下角：全景预览 (浅色适配) -->
      <div class="navigator-overlay" v-if="!embedded">
        <div class="nav-preview">
          <div class="nav-viewport-rect"></div>
        </div>
        <div class="nav-zoom">17% <i class="el-icon-full-screen"></i></div>
      </div>
    </div>

    <!-- 3. 右下角：悬浮日志 (浅色适配) -->
    <div class="floating-log-panel" v-if="!embedded">
      <div class="log-header">
        <span class="pulse-dot"></span>
        <h6>GROWTH STREAM</h6>
      </div>
      <div class="log-body">
        <div v-for="(item, idx) in logData" :key="idx" class="log-row">
          <span class="time">{{ item.time }}</span>
          <span class="src" :class="item.type">{{ item.src }}</span>
          <span class="desc">{{ item.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'

const props = defineProps({
  embedded: {
    type: Boolean,
    default: false
  }
})

const draggingNodeId = ref(null)
const offset = { x: 0, y: 0 }

// --- 节点数据 ---
const nodes = ref([
  { id: 'target', type: 'shield', x: 490, y: 80, width: 120, height: 80, title: '人工智能架构专家' },
  { id: 'acad', type: 'base', x: 50, y: 250, width: 220, height: 80, title: '算法理论基础', val: '3.82', unit: 'GPA', icon: 'el-icon-notebook-1' },
  { id: 'prac', type: 'base', x: 50, y: 420, width: 220, height: 80, title: '模型训练时长', val: '1024', unit: 'Hrs', icon: 'el-icon-cpu' },
  
  { id: 'skill1', type: 'complex', x: 430, y: 220, width: 240, height: 160, title: '深度学习模型库', 
    subCards: [{ name: '神经网络架构', val: '150 pts' }, { name: 'PyTorch 实战', val: '92%' }] 
  },
  { id: 'skill2', type: 'complex', x: 430, y: 450, width: 240, height: 160, title: '大语言模型应用', 
    subCards: [{ name: 'Prompt 工程', val: '88 pts' }, { name: 'Agent 开发', val: 'Active' }] 
  },

  { id: 'out1', type: 'complex', x: 830, y: 250, width: 240, height: 160, title: '智能代理原型', 
    subCards: [{ name: '多模态感知', val: 'Stable' }, { name: '自主决策流', val: 'Online' }] 
  },
  { id: 'out2', type: 'complex', x: 1130, y: 290, width: 240, height: 160, title: 'AI 行业高级认证', 
    subCards: [{ name: '算法备案', val: '已审' }, { name: '技术论文', val: 'Pass' }] 
  }
])

const links = ref([
  { from: 'acad', to: 'skill1', val: '23', unit: 'kbps', type: 'main' },
  { from: 'acad', to: 'skill2', val: '18', unit: 'kbps', type: 'secondary' },
  { from: 'prac', to: 'skill1', val: '45', unit: 'kbps', type: 'main' },
  { from: 'skill1', to: 'target', val: '95', type: 'glow', dir: 'v' },
  { from: 'skill1', to: 'out1', val: '77', unit: 'kbps', type: 'main' },
  { from: 'skill2', to: 'out1', val: '37', unit: 'kbps', type: 'secondary' },
  { from: 'out1', to: 'out2', val: '120', unit: 'kbps', type: 'main' }
])

const logData = [
  { time: '10:15', src: 'SYS', type: 'academic', desc: '全维度数据同步成功' },
  { time: '09:30', src: 'CERT', type: 'skill', desc: '获取行业进阶证书' }
]

// --- 逻辑函数 ---
const onMouseDown = (e, id) => {
  draggingNodeId.value = id
  const node = nodes.value.find(n => n.id === id)
  offset.x = e.clientX - node.x
  offset.y = e.clientY - node.y
}

const onMouseMove = (e) => {
  if (!draggingNodeId.value) return
  const node = nodes.value.find(n => n.id === draggingNodeId.value)
  node.x = e.clientX - offset.x
  node.y = e.clientY - offset.y
}

const onMouseUp = () => { draggingNodeId.value = null }

const resetLayout = () => {
  nodes.value[0].x = 490; nodes.value[0].y = 80;
  nodes.value[1].x = 50; nodes.value[1].y = 250;
  nodes.value[2].x = 50; nodes.value[2].y = 420;
  nodes.value[3].x = 430; nodes.value[3].y = 220;
  nodes.value[4].x = 430; nodes.value[4].y = 450;
  nodes.value[5].x = 830; nodes.value[5].y = 250;
  nodes.value[6].x = 1130; nodes.value[6].y = 290;
}

const generatePath = (link) => {
  const from = nodes.value.find(n => n.id === link.from)
  const to = nodes.value.find(n => n.id === link.to)
  if (!from || !to) return ''
  
  if (link.dir === 'v') {
    // 纵向连线：从起点顶部中心到终点底部中心，改为平滑 S 曲线
    const sx = from.x + from.width / 2, sy = from.y
    const ex = to.x + to.width / 2, ey = to.y + to.height
    const dy = (ey - sy) * 0.6 // 控制点偏移量
    return `M ${sx} ${sy} C ${sx} ${sy + dy}, ${ex} ${ey - dy}, ${ex} ${ey}`
  } else {
    const sx = from.x + from.width, sy = from.y + from.height / 2
    const ex = to.x, ey = to.y + to.height / 2
    const dx = (ex - sx) * 0.4
    return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${ex - dx} ${ey}, ${ex} ${ey}`
  }
}

const getPathMidPoint = (link) => {
  const from = nodes.value.find(n => n.id === link.from)
  const to = nodes.value.find(n => n.id === link.to)
  if (!from || !to) return { x: 0, y: 0 }
  if (link.dir === 'v') {
    return { x: from.x + from.width / 2 + 10, y: from.y + (to.y + to.height - from.y) / 2 }
  } else {
    return { x: from.x + from.width + (to.x - (from.x + from.width)) / 2, y: from.y + from.height / 2 + (to.y - from.y) / 2 }
  }
}
</script>

<style scoped>
.chain-map-viewport {
  width: 100%; height: 100vh; background: #ffffff;
  /* 浅色复合底纹：极浅灰网格线 + 矩阵点 */
  background-image: 
    linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px),
    radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0);
  background-size: 60px 60px, 60px 60px, 20px 20px; 
  color: #1e293b; display: flex; flex-direction: column; overflow: hidden; user-select: none;
  transition: all 0.3s ease; position: relative;
}

.chain-map-viewport.is-embedded {
  height: 550px; border-radius: 16px; border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 24px;
}

/* 顶部控制栏 */
.top-control-bar {
  height: 64px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px);
  display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid #e2e8f0; z-index: 500;
}
.header-tools-left { display: flex; align-items: center; gap: 20px; }
.brand-logo { display: flex; align-items: center; gap: 10px; font-weight: 900; color: #4f46e5; }
.logo-icon { width: 18px; height: 18px; background: #4f46e5; clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); }
.space-tip-mini { font-size: 11px; color: #64748b; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; }

.time-range-picker { flex: 1; margin: 0 60px; }
.timeline-visual { position: relative; padding: 12px 0; }
.timeline-points { display: flex; justify-content: space-between; }
.point { width: 4px; height: 4px; background: #e2e8f0; border-radius: 50%; position: relative; }
.point.active { background: #4f46e5; box-shadow: 0 0 10px rgba(79, 70, 229, 0.4); }
.point.active .time-label { color: #1e293b; font-weight: 800; }
.time-label { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 9px; color: #94a3b8; white-space: nowrap; }
.timeline-line { position: absolute; top: 50%; width: 100%; height: 1px; background: #f1f5f9; }

/* 画布与连线 */
.topology-container { flex: 1; position: relative; overflow: hidden; }
.link-layer { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
.flow-path { fill: none; stroke: #cbd5e1; stroke-width: 2; stroke-dasharray: 6, 6; transition: all 0.3s; }
.flow-path.main { stroke: #94a3b8; stroke-width: 2.5; }
.flow-path.glow { stroke: #4f46e5; stroke-dasharray: none; stroke-width: 2.5; opacity: 0.6; }
.path-label { font-size: 9px; fill: #94a3b8; font-weight: 800; text-anchor: middle; }

/* 节点样式 (浅色现代) */
.node-card { 
  position: absolute; background: #ffffff; border: 1px solid #e2e8f0; 
  border-radius: 16px; overflow: hidden; cursor: grab; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: all 0.2s;
}
.node-card.is-dragging { 
  z-index: 1000; cursor: grabbing; border-color: #4f46e5; 
  box-shadow: 0 12px 30px rgba(79, 70, 229, 0.15); transform: scale(1.02); 
}

/* 护盾节点 (纯悬浮效果) */
.shield-node { 
  background: transparent !important; 
  border: none !important; 
  box-shadow: none !important; 
  overflow: visible !important; 
}
.shield-wrap { display: flex; flex-direction: row; align-items: center; padding: 0; gap: 15px; }
.shield-hexagon { 
  width: 54px; height: 60px; background: linear-gradient(135deg, #6366f1, #4f46e5); 
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); 
  display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px;
  filter: drop-shadow(0 8px 15px rgba(79, 70, 229, 0.4));
  transition: all 0.3s;
  flex-shrink: 0;
}
.shield-node:hover .shield-hexagon {
  transform: translateY(-2px) scale(1.05);
  filter: drop-shadow(0 10px 20px rgba(79, 70, 229, 0.6));
}
.shield-title { 
  font-size: 16px; 
  color: #1e293b; 
  font-weight: 900; 
  letter-spacing: 1px; 
  white-space: nowrap;
  background: linear-gradient(90deg, #4f46e5, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 复合节点 (白色背景 + 浅灰子块) */
.complex-node { padding: 18px; border-top: 4px solid #4f46e5; }
.node-header { display: flex; align-items: center; gap: 8px; margin-bottom: 15px; }
.status-indicator { width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
.title { font-size: 14px; font-weight: 800; color: #1e293b; }
.inner-cards { display: flex; flex-direction: column; gap: 10px; }
.light-sub-card { 
  background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; 
  padding: 10px 12px; display: flex; align-items: center; gap: 12px; 
}
.sub-icon { 
  width: 18px; height: 18px; background: rgba(79, 70, 229, 0.1); 
  color: #4f46e5; border-radius: 4px; display: flex; 
  align-items: center; justify-content: center; font-size: 12px; 
}
.sub-body { display: flex; flex-direction: column; }
.sub-name { font-size: 10px; color: #64748b; }
.sub-val { font-size: 12px; font-weight: 800; color: #1e293b; }

/* 基础节点 */
.base-node { padding: 15px; border-left: 4px solid #3b82f6; }
.base-node-inner { display: flex; align-items: center; gap: 15px; }
.base-icon { font-size: 24px; color: #3b82f6; }
.base-content { display: flex; flex-direction: column; }
.base-label { font-size: 10px; color: #64748b; }
.base-value { font-size: 18px; font-weight: 900; color: #1e293b; }
.base-value small { font-size: 10px; color: #94a3b8; margin-left: 4px; }

/* 导航器 (浅色) */
.navigator-overlay { 
  position: absolute; bottom: 32px; left: 32px; background: rgba(255, 255, 255, 0.9); 
  backdrop-filter: blur(12px); border: 1px solid #e2e8f0; border-radius: 16px; 
  padding: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; 
}
.nav-preview { width: 100px; height: 60px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 4px; position: relative; }
.nav-viewport-rect { position: absolute; width: 30px; height: 20px; border: 1px solid #4f46e5; top: 15px; left: 20px; }
.nav-zoom { font-size: 10px; color: #94a3b8; }

/* 悬浮日志 (浅色) */
.floating-log-panel { 
  position: absolute; bottom: 32px; right: 32px; width: 280px; 
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); 
  border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; 
}
.log-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.pulse-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
.log-header h6 { margin: 0; font-size: 10px; color: #64748b; letter-spacing: 1px; }
.log-body { display: flex; flex-direction: column; gap: 10px; }
.log-row { font-size: 10px; display: flex; gap: 10px; color: #64748b; }
.src.academic { color: #3b82f6; font-weight: 800; }
.src.skill { color: #4f46e5; font-weight: 800; }

.glow-btn { background: #4f46e5; border: none; font-weight: 800; }
.glass-btn { background: #f1f5f9; border: 1px solid #e2e8f0; color: #64748b; }

@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
</style>
