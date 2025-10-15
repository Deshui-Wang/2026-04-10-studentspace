<template>
  <div class="ai-thinking-page">
    <!-- 顶部状态栏 -->
    <div class="status-bar">
      <div class="status-metrics">
        <div class="metric-item">
          <span class="metric-label">BURN:</span>
          <span class="metric-value">{{ burnTokens }} tokens</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">SOURCES:</span>
          <span class="metric-value">{{ sourcesCount }} sources</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">REMAINING:</span>
          <span class="metric-value">{{ remainingCredits }} credits</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">TIME:</span>
          <span class="metric-value">{{ elapsedTime }} min</span>
        </div>
      </div>
      <button class="back-btn" @click="goBack">
        ← 返回
      </button>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 思维导图区域 -->
      <div class="mind-map-container" 
           @mousedown="startDrag" 
           @mousemove="onDrag" 
           @mouseup="stopDrag" 
           @wheel="onWheel">
        <div class="mind-map" :style="mindMapStyle">
          <!-- 起始节点 -->
          <div class="node start-node" :class="{ 'animate-in': showStartNode }">
            <div class="node-content">
              <span class="node-text">{{ userQuery }}</span>
            </div>
          </div>

          <!-- 研究分析节点 -->
          <div class="node research-node" :class="{ 'animate-in': showResearchNodes }">
            <div class="node-content">
              <span class="node-text">研究分析</span>
            </div>
          </div>

          <!-- 信息收集节点 -->
          <div class="node info-node" :class="{ 'animate-in': showInfoNodes }">
            <div class="node-content">
              <span class="node-text">信息收集</span>
            </div>
          </div>

          <!-- 深度思考节点 -->
          <div class="node thinking-node" :class="{ 'animate-in': showThinkingNodes }">
            <div class="node-content">
              <span class="node-text">深度思考</span>
            </div>
          </div>

          <!-- 最终输出节点 -->
          <div class="node output-node" :class="{ 'animate-in': showOutputNode }">
            <div class="node-content">
              <span class="node-text">最终回答</span>
            </div>
          </div>

          <!-- 连接线 -->
          <svg class="connections" width="100%" height="100%">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
              </marker>
            </defs>
            
            <!-- 起始到研究的连接 -->
            <path v-if="showResearchConnection" 
                  :d="`M ${getNodePosition('start').x + 100} ${getNodePosition('start').y} L ${getNodePosition('research').x - 100} ${getNodePosition('research').y}`"
                  stroke="#8b5cf6" stroke-width="3" 
                  fill="none" stroke-dasharray="8,4"
                  marker-end="url(#arrowhead)" class="connection-line" />
            
            <!-- 研究到信息收集的连接 -->
            <path v-if="showInfoConnection" 
                  :d="`M ${getNodePosition('research').x + 100} ${getNodePosition('research').y} L ${getNodePosition('info').x - 100} ${getNodePosition('info').y}`"
                  stroke="#8b5cf6" stroke-width="3" 
                  fill="none" stroke-dasharray="8,4"
                  marker-end="url(#arrowhead)" class="connection-line" />
            
            <!-- 信息收集到深度思考的连接 -->
            <path v-if="showThinkingConnection" 
                  :d="`M ${getNodePosition('info').x + 100} ${getNodePosition('info').y} L ${getNodePosition('thinking').x - 100} ${getNodePosition('thinking').y}`"
                  stroke="#8b5cf6" stroke-width="3" 
                  fill="none" stroke-dasharray="8,4"
                  marker-end="url(#arrowhead)" class="connection-line" />
            
            <!-- 深度思考到最终输出的连接 -->
            <path v-if="showOutputConnection" 
                  :d="`M ${getNodePosition('thinking').x + 100} ${getNodePosition('thinking').y} L ${getNodePosition('output').x - 100} ${getNodePosition('output').y}`"
                  stroke="#8b5cf6" stroke-width="3" 
                  fill="none" stroke-dasharray="8,4"
                  marker-end="url(#arrowhead)" class="connection-line" />
          </svg>
        </div>
        
        <!-- 缩放控制按钮 -->
        <div class="zoom-controls">
          <button class="zoom-btn" @click="zoomIn" title="放大">
            <span class="zoom-icon">+</span>
          </button>
          <button class="zoom-btn" @click="zoomOut" title="缩小">
            <span class="zoom-icon">−</span>
          </button>
          <button class="zoom-btn" @click="resetZoom" title="重置">
            <span class="zoom-icon">⌂</span>
          </button>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <button class="control-btn" @click="startThinking" :disabled="isThinking">
          {{ isThinking ? '思考中...' : '重新思考' }}
        </button>
      </div>

      <!-- 控制台输出区域 -->
      <div class="console-output">
        <div class="console-header">
          <span class="console-title">AI思考过程</span>
        </div>
        <div class="console-content">
          <div v-for="(log, index) in consoleLogs" :key="index" class="log-entry">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-command">{{ log.command }}</span>
            <span class="log-output">{{ log.output }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIThinking',
  data() {
    return {
      userQuery: '',
      burnTokens: 0,
      sourcesCount: 0,
      remainingCredits: 100,
      elapsedTime: 0,
      isThinking: false,
      showStartNode: false,
      showResearchNodes: false,
      showInfoNodes: false,
      showThinkingNodes: false,
      showOutputNode: false,
      showResearchConnection: false,
      showInfoConnection: false,
      showThinkingConnection: false,
      showOutputConnection: false,
      consoleLogs: [],
      thinkingInterval: null,
      timeInterval: null,
      mindMapTransform: {
        scale: 1,
        x: 0,
        y: 0
      },
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0
    }
  },
  computed: {
    mindMapStyle() {
      return {
        transform: `translate(${this.mindMapTransform.x}px, ${this.mindMapTransform.y}px) scale(${this.mindMapTransform.scale})`
      }
    }
  },
  mounted() {
    // 获取URL查询参数
    this.userQuery = this.$route.query.query || '如何设计一堂有效的微课？'
    
    // 添加调试信息
    console.log('AIThinking mounted')
    console.log('Current route:', this.$route.path)
    console.log('Query params:', this.$route.query)
    console.log('User query:', this.userQuery)
    
    this.initializeAnimation()
    
    // 自动开始思考过程
    this.$nextTick(() => {
      setTimeout(() => {
        this.startThinking()
      }, 1000) // 延迟1秒开始，让用户看到初始状态
    })
  },
  beforeUnmount() {
    if (this.thinkingInterval) {
      clearInterval(this.thinkingInterval)
    }
    if (this.timeInterval) {
      clearInterval(this.timeInterval)
    }
  },
  methods: {
    initializeAnimation() {
      // 延迟显示起始节点
      setTimeout(() => {
        this.showStartNode = true
      }, 500)
    },
    
    startThinking() {
      if (this.isThinking) return
      
      this.isThinking = true
      this.resetAnimation()
      
      // 开始计时
      this.timeInterval = setInterval(() => {
        this.elapsedTime += 0.1
        if (this.elapsedTime >= 3.8) {
          clearInterval(this.timeInterval)
        }
      }, 100)
      
      // 模拟思考过程
      this.simulateThinking()
    },
    
    simulateThinking() {
      let step = 0
      const totalSteps = 8
      
      this.thinkingInterval = setInterval(() => {
        step++
        
        switch (step) {
          case 1:
            this.showResearchNodes = true
            this.showResearchConnection = true
            this.addConsoleLog('MetaAI.Ask', '开始研究相关查询...')
            break
          case 2:
            this.showInfoNodes = true
            this.showInfoConnection = true
            this.addConsoleLog('MetaAI.Ask', '收集相关信息...')
            break
          case 3:
            this.showThinkingNodes = true
            this.showThinkingConnection = true
            this.addConsoleLog('MetaAI.Thinking', '深度分析思考...')
            break
          case 4:
            this.addConsoleLog('MetaAI.Thinking', '整合信息...')
            break
          case 5:
            this.addConsoleLog('MetaAI.Thinking', '生成解决方案...')
            break
          case 6:
            this.showOutputNode = true
            this.showOutputConnection = true
            this.addConsoleLog('MetaAI.Report', '生成最终回答...')
            break
          case 7:
            this.addConsoleLog('MetaAI.Report', '完成！用时: 71s, 消耗: 18.4k tokens')
            break
          case 8:
            this.finishThinking()
            break
        }
        
        if (step >= totalSteps) {
          clearInterval(this.thinkingInterval)
        }
      }, 800)
    },
    
    addConsoleLog(command, output) {
      const now = new Date()
      const time = now.toLocaleTimeString()
      
      this.consoleLogs.push({
        time: `[${time}]`,
        command: `> ${command}`,
        output: output
      })
      
      // 自动滚动到底部
      this.$nextTick(() => {
        const consoleContent = document.querySelector('.console-content')
        if (consoleContent) {
          consoleContent.scrollTop = consoleContent.scrollHeight
        }
      })
    },
    
    finishThinking() {
      this.isThinking = false
      this.burnTokens = 173469
      this.sourcesCount = 291
      this.remainingCredits = 100
      this.elapsedTime = 3.8
    },
    
    resetAnimation() {
      this.showStartNode = false
      this.showResearchNodes = false
      this.showInfoNodes = false
      this.showThinkingNodes = false
      this.showOutputNode = false
      this.showResearchConnection = false
      this.showInfoConnection = false
      this.showThinkingConnection = false
      this.showOutputConnection = false
      this.consoleLogs = []
      this.burnTokens = 0
      this.sourcesCount = 0
      this.elapsedTime = 0
      
      // 重新初始化
      setTimeout(() => {
        this.showStartNode = true
      }, 500)
    },
    
    getNodePosition(nodeType) {
      const containerWidth = 800 // 容器宽度
      const containerHeight = 500 // 容器高度
      const nodeWidth = 200 // 节点宽度
      const nodeHeight = 80 // 节点高度
      
      switch (nodeType) {
        case 'start':
          return { x: containerWidth * 0.1 + nodeWidth / 2, y: containerHeight / 2 }
        case 'research':
          return { x: containerWidth * 0.3 + nodeWidth / 2, y: containerHeight / 2 }
        case 'info':
          return { x: containerWidth * 0.5 + nodeWidth / 2, y: containerHeight / 2 }
        case 'thinking':
          return { x: containerWidth * 0.7 + nodeWidth / 2, y: containerHeight / 2 }
        case 'output':
          return { x: containerWidth * 0.9 + nodeWidth / 2, y: containerHeight / 2 }
        default:
          return { x: 0, y: 0 }
      }
    },
    
    goBack() {
      // 检查是否有历史记录，如果没有则回到首页
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/tch-ai')
      }
    },

    startDrag(event) {
      this.isDragging = true
      this.lastMouseX = event.clientX
      this.lastMouseY = event.clientY
    },

    onDrag(event) {
      if (!this.isDragging) return

      const dx = event.clientX - this.lastMouseX
      const dy = event.clientY - this.lastMouseY

      this.mindMapTransform.x += dx
      this.mindMapTransform.y += dy

      this.lastMouseX = event.clientX
      this.lastMouseY = event.clientY
    },

    stopDrag() {
      this.isDragging = false
    },

    onWheel(event) {
      event.preventDefault()
      const delta = event.deltaY
      const scale = this.mindMapTransform.scale
      const newScale = delta > 0 ? scale * 0.9 : scale * 1.1
      this.mindMapTransform.scale = Math.max(0.1, Math.min(5, newScale))
    },

    zoomIn() {
      this.mindMapTransform.scale *= 1.1
      this.mindMapTransform.scale = Math.min(5, this.mindMapTransform.scale)
    },

    zoomOut() {
      this.mindMapTransform.scale *= 0.9
      this.mindMapTransform.scale = Math.max(0.1, this.mindMapTransform.scale)
    },

    resetZoom() {
      this.mindMapTransform.scale = 1
      this.mindMapTransform.x = 0
      this.mindMapTransform.y = 0
    }
  }
}
</script>

<style scoped>
.ai-thinking-page {
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 状态栏样式 */
.status-bar {
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-metrics {
  display: flex;
  gap: 32px;
  justify-content: center;
}

.back-btn {
  padding: 8px 16px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: #7c3aed;
}

.metric-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.metric-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 14px;
  font-weight: 700;
  color: #8b5cf6;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
}

/* 思维导图容器 */
.mind-map-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: grab;
}

.mind-map-container:active {
  cursor: grabbing;
}

.mind-map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  touch-action: none; /* Disable default touch behavior */
  transform-origin: center center;
  transition: transform 0.1s ease-out;
}

/* 节点样式 */
.node {
  position: absolute;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.node.animate-in {
  opacity: 1;
  transform: scale(1);
}

.start-node {
  top: 50%;
  left: 10%;
  transform: translateY(-50%) scale(0.8);
}

.start-node.animate-in {
  transform: translateY(-50%) scale(1);
}

.research-node {
  top: 50%;
  left: 30%;
  transform: translateY(-50%) scale(0.8);
}

.research-node.animate-in {
  transform: translateY(-50%) scale(1);
}

.info-node {
  top: 50%;
  left: 50%;
  transform: translateY(-50%) scale(0.8);
}

.info-node.animate-in {
  transform: translateY(-50%) scale(1);
}

.thinking-node {
  top: 50%;
  left: 70%;
  transform: translateY(-50%) scale(0.8);
}

.thinking-node.animate-in {
  transform: translateY(-50%) scale(1);
}

.output-node {
  top: 50%;
  left: 90%;
  transform: translateY(-50%) scale(0.8);
}

.output-node.animate-in {
  transform: translateY(-50%) scale(1);
}

.node-content {
  background: #ffffff;
  border: 2px solid #8b5cf6;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 4px 6px rgba(139, 92, 246, 0.1);
  min-width: 200px;
  text-align: center;
}

.node-text {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
}

/* 连接线样式 */
.connections {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
}

.connection-line {
  opacity: 0;
  animation: drawLine 1s ease-out forwards;
}

@keyframes drawLine {
  from {
    opacity: 0;
    stroke-dashoffset: 100;
  }
  to {
    opacity: 1;
    stroke-dashoffset: 0;
  }
}

/* 缩放控制按钮 */
.zoom-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.zoom-btn {
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 6px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 18px;
}

.zoom-btn:hover {
  background: #7c3aed;
}

.zoom-icon {
  line-height: 1;
}

/* 控制面板 */
.control-panel {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.control-btn {
  padding: 12px 24px;
  border: 2px solid #8b5cf6;
  background: #ffffff;
  color: #8b5cf6;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover:not(:disabled) {
  background: #8b5cf6;
  color: #ffffff;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 控制台输出 */
.console-output {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #1f2937;
  color: #f9fafb;
  max-height: 300px;
  overflow: hidden;
}

.console-header {
  background: #374151;
  padding: 12px 16px;
  border-bottom: 1px solid #4b5563;
}

.console-title {
  font-size: 14px;
  font-weight: 600;
  color: #f9fafb;
}

.console-content {
  padding: 16px;
  max-height: 250px;
  overflow-y: auto;
}

.log-entry {
  margin-bottom: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
}

.log-time {
  color: #9ca3af;
  margin-right: 8px;
}

.log-command {
  color: #60a5fa;
  margin-right: 8px;
}

.log-output {
  color: #f9fafb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .status-metrics {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
  
  .mind-map-container {
    min-height: 400px;
  }
  
  .node-content {
    min-width: 150px;
    padding: 12px 16px;
  }
  
  .control-panel {
    flex-direction: column;
  }
}
</style> 