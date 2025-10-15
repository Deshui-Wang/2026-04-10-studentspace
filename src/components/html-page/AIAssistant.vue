<template>
  <div class="ai-assistant">
    <!-- 悬浮球 -->
    <div v-show="!isPanelVisible" class="floating-ball" @click="openPanel">
      <!-- 背景光晕效果 -->
      <div class="glow-effect"></div>
      
      
      <!-- 主球体 -->
      <div class="ball-main">
        <div class="ball-icon">
          <img src="/pic/ai icon.png" alt="AI助手" class="ai-icon" />
        </div>
        
      </div>
      
      <!-- 悬浮提示 -->
      <div class="tooltip">
        <span>小智人AI助手</span>
        <div class="tooltip-arrow"></div>
      </div>
    </div>

    <!-- 聊天面板 -->
    <div v-show="isPanelVisible" class="chat-panel">
      <div class="panel-header">
        <div class="header-left">
          <div class="ai-avatar">
            <img src="/pic/ai icon.png" alt="AI助手" class="ai-avatar-icon" />
            <div class="avatar-status"></div>
          </div>
          <div class="header-info">
            <h3>小智人</h3>
            <span class="status">Gemini Pro · 正在为您服务</span>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn close-btn" @click="closePanel" title="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="panel-content">
        <!-- 导航标签页容器 -->
        <div class="nav-container">
          <div class="nav-tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="nav-tab"
              :class="{ active: activeTab === tab.id }"
              @click="handleTabClick(tab.id)"
            >
              <div class="tab-icon">
                <img :src="tab.icon" :alt="tab.label" class="tab-icon-img" />
              </div>
              <div class="tab-text">
                <span class="tab-label">{{ tab.label }}</span>
                <span v-if="tab.count" class="tab-count">({{ tab.count }})</span>
              </div>
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="content-area">
          <!-- 默认状态 - 显示欢迎消息 -->
          <div v-if="!activeTab" class="tab-content">
            <div class="messages-content">
              <div class="message-item">
                <div class="message-avatar">
                  <img src="/pic/ai icon.png" alt="AI助手" class="message-avatar-img" />
                </div>
                <div class="message-content">
                  <div class="message-header">
                    <span class="message-sender">小智人</span>
                    <span class="message-time">刚刚</span>
                  </div>
                  <div class="message-text">您好！我是小智人AI助手，有什么可以帮助您的吗？</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 消息标签页内容 -->
          <div v-if="activeTab === 'messages'" class="tab-content">
            <div class="messages-content">
              <div class="message-item">
                <div class="message-avatar">
                  <img src="/pic/ai icon.png" alt="AI助手" class="message-avatar-img" />
                </div>
                <div class="message-content">
                  <div class="message-header">
                    <span class="message-sender">小智人</span>
                    <span class="message-time">刚刚</span>
                  </div>
                  <div class="message-text">您好！我是小智人AI助手，有什么可以帮助您的吗？</div>
                </div>
              </div>
              
              <div class="message-item">
                <div class="message-avatar">
                  <img src="/pic/ai icon.png" alt="AI助手" class="message-avatar-img" />
                </div>
                <div class="message-content">
                  <div class="message-header">
                    <span class="message-sender">小智人</span>
                    <span class="message-time">2分钟前</span>
                  </div>
                  <div class="message-text">我注意到您最近在准备《高等数学》课程，需要我帮您整理教学大纲吗？</div>
                </div>
              </div>
              
              <div class="message-item">
                <div class="message-avatar">
                  <img src="/pic/ai icon.png" alt="AI助手" class="message-avatar-img" />
                </div>
                <div class="message-content">
                  <div class="message-header">
                    <span class="message-sender">小智人</span>
                    <span class="message-time">5分钟前</span>
                  </div>
                  <div class="message-text">检测到您有3个待处理的任务，点击"任务"标签页查看详情。</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 任务标签页内容 -->
          <div v-if="activeTab === 'tasks'" class="tab-content">
            <div class="suggestions-box">
              <div class="suggestion-item" @click="handleSuggestion('撰写《高等数学》期末教学反思')">
                撰写《高等数学》期末教学反思
              </div>
              <div class="suggestion-item" @click="handleSuggestion('更新《人工智能基础》课程课件')">
                更新《人工智能基础》课程课件
              </div>
              <div class="suggestion-item" @click="handleSuggestion('处理《计算机网络》课程学生邮件')">
                处理《计算机网络》课程学生邮件
              </div>
            </div>
          </div>

          <!-- 临时口袋标签页内容 -->
          <div v-if="activeTab === 'pocket'" class="tab-content">
            <div class="empty-state">
              <div class="empty-icon">📁</div>
              <p>暂无临时内容</p>
            </div>
          </div>

          <!-- 智能中心标签页内容 -->
          <div v-if="activeTab === 'center'" class="tab-content">
            <div class="center-content">
              <div class="center-item" @click="openIntelligentCenter">
                <div class="center-icon">🧠</div>
                <div class="center-text">
                  <h4>智能中心</h4>
                  <p>访问更多AI功能</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入区域 - 重新组织布局 -->
        <div class="input-area">
          <!-- 快捷功能按钮 - 移到输入框上方 -->
          <div class="quick-actions">
            <button class="quick-btn" @click="handleQuickAction('screenshot')" title="截图">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
              <span>截图</span>
            </button>
            <button class="quick-btn" @click="handleQuickAction('translate')" title="翻译">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>翻译</span>
            </button>
            <button class="quick-btn" @click="handleQuickAction('draw')" title="画图">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
              <span>画图</span>
            </button>
            <button class="quick-btn" @click="handleQuickAction('document')" title="文档">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
              </svg>
              <span>文档</span>
            </button>
          </div>

          <!-- 输入框和操作按钮容器 - 添加细边框 -->
          <div class="input-container">
            <textarea 
              v-model="chatInput"
              @keydown.enter.prevent="handleEnterKey"
              class="chat-input" 
              placeholder="请输入您的问题...@提及课程或活动"
              ref="chatInputRef"
              rows="3"
            ></textarea>
            <div class="input-actions">
              <button class="action-btn-small" @click="handleAttachment" title="上传文件">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button class="action-btn-small" @click="handleMention" title="提及">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </button>
              <button 
                @click="sendMessage" 
                class="send-btn"
                :disabled="!chatInput.trim()"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 响应式数据
const isPanelVisible = ref(false)
const activeTab = ref(null) // 默认为null，不显示任何内容
const chatInput = ref('')
const chatInputRef = ref(null)
const route = useRoute()
const router = useRouter()

// 标签页配置 - 使用图片图标
const tabs = ref([
  {
    id: 'messages',
    label: '消息',
    count: 1,
    icon: '/pic/xiaoxi.png'
  },
  {
    id: 'tasks',
    label: '任务',
    count: 3,
    icon: '/pic/renwu.png'
  },
  {
    id: 'pocket',
    label: 'AI笔记',
    count: null,
    icon: '/pic/koudai.png'
  },
  {
    id: 'center',
    label: '智能中心',
    count: null,
    icon: '/pic/image 1.png'
  }
])

// 处理标签页点击
const handleTabClick = (tabId) => {
  if (tabId === 'center') {
    // 智能中心直接打开外链
    openIntelligentCenter()
  } else {
    // 其他标签页切换显示内容
    activeTab.value = activeTab.value === tabId ? null : tabId
  }
}

// 打开面板
const openPanel = () => {
  console.log('打开面板')
  isPanelVisible.value = true
  nextTick(() => {
    chatInputRef.value?.focus()
  })
}

// 关闭面板
const closePanel = () => {
  console.log('关闭面板')
  isPanelVisible.value = false
  activeTab.value = null // 关闭面板时重置标签页状态
}

// 处理建议点击
const handleSuggestion = (suggestion) => {
  console.log('点击建议:', suggestion)
  chatInput.value = suggestion
  nextTick(() => {
    chatInputRef.value?.focus()
  })
}

// 处理快捷功能
const handleQuickAction = (action) => {
  console.log('快捷功能:', action)
  // 这里可以添加具体的功能实现
}

// 处理附件上传
const handleAttachment = () => {
  console.log('上传附件')
  // 这里可以添加文件上传功能
}

// 处理提及功能
const handleMention = () => {
  console.log('提及功能')
  // 这里可以添加@提及功能
}

// 处理回车键
const handleEnterKey = (event) => {
  if (event.shiftKey) {
    // Shift + Enter 换行
    return
  } else {
    // Enter 发送消息
    event.preventDefault()
    sendMessage()
  }
}

// 打开智能中心
const openIntelligentCenter = () => {
  window.open('https://agent.lhrj.cn/', '_blank')
}

// 发送消息
const sendMessage = () => {
  if (!chatInput.value.trim()) return
  
  console.log('发送消息:', chatInput.value)
  
  // 这里可以添加发送消息的逻辑
  chatInput.value = ''
}

// 键盘快捷键支持
const handleKeydown = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    if (isPanelVisible.value) {
      closePanel()
    } else {
      openPanel()
    }
  }
  
  if (event.key === 'Escape' && isPanelVisible.value) {
    closePanel()
  }
}

// 路由监听
watch(() => route.path, (newPath) => {
  console.log('路由变化:', newPath)
  
  const autoOpenPages = ['/EvaluationCenter', '/tch-ai', '/ai-thinking']
  
  if (autoOpenPages.includes(newPath) && !isPanelVisible.value) {
    console.log('自动打开面板')
    openPanel()
  }
}, { immediate: false })

// 组件挂载时的初始化
onMounted(() => {
  console.log('小智人AI助手已启动')
  document.addEventListener('keydown', handleKeydown)
})

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.ai-assistant {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 悬浮球样式 */
.floating-ball {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 64px;
  height: 64px;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* 背景光晕效果 */
.glow-effect {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    transform: scale(1);
    opacity: 0.5;
  }
  to {
    transform: scale(1.2);
    opacity: 0.8;
  }
}





/* 主球体 */
.ball-main {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.4),
    0 4px 16px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  animation: breathe 3s ease-in-out infinite;
  overflow: hidden;
}

@keyframes breathe {
  0%, 100% { 
    transform: scale(1); 
  }
  25% { 
    transform: scale(1.05); 
  }
  50% { 
    transform: scale(1.05); 
  }
  75% { 
    transform: scale(1.05); 
  }
}

.ball-icon {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.ai-icon {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  transition: all 0.3s ease;
}

/* 悬浮提示 */
.tooltip {
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.tooltip-arrow {
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.9);
}

/* 悬浮球交互效果 */
.floating-ball:hover {
  transform: scale(1.05);
}

.floating-ball:hover .ball-main {
  transform: scale(1.1) translateY(-8px);
  box-shadow: 
    0 12px 48px rgba(102, 126, 234, 0.6),
    0 8px 24px rgba(102, 126, 234, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  animation-play-state: paused;
}

.floating-ball:hover .ai-icon {
  transform: scale(1.1);
}

.floating-ball:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(-8px);
}


.floating-ball:active .ball-main {
  transform: scale(0.95);
}

/* 聊天面板样式 - 增加高度 */
.chat-panel {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 450px;
  height: 800px; /* 从750px增加到800px */
  background: white;
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  animation: panelSlideIn 0.3s ease-out;
}

@keyframes panelSlideIn {
  from {
    transform: scale(0.8) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.panel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.panel-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  pointer-events: none;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.ai-avatar {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
}

.ai-avatar-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #4ade8000;
  border: 2px solid rgba(255, 255, 255, 0);
  border-radius: 50%;
}

.header-info h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.2;
  text-align: left;
}

.status {
  font-size: 13px;
  opacity: 0.9;
  margin-top: 2px;
}

.header-actions {
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.action-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 导航标签页容器 - 整体浅色背景框 */
.nav-container {
  padding: 20px 24px; /* 增加内边距 */
}

.nav-tabs {
  display: flex;
  align-items: baseline;
  gap: 1px; /* 增加间距 */
  padding: 1px; /* 增加内边距 */
  background: #f3f4f6; /* 白色背景 */
  border-radius: 66px;
}

.nav-tab {
  display: flex;
  flex-direction: column; /* 改为垂直布局 */
  align-items: center;
  gap: 6px; /* 减少间距 */
  padding: 16px 12px; /* 增加内边距 */
  background: transparent;
  border: none;
  border-radius: 66px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #64748b;
  flex: 1;
  justify-content: center;
  min-height: 80px; /* 增加最小高度 */
}

.nav-tab:hover {
  background: #f1f5f9;
  color: #475569;
  transform: translateY(-2px); /* 添加悬停上移效果 */
}

.nav-tab.active {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
  transform: scale(0.95);
}

.nav-tab.active .tab-icon-img {
  filter: none;
  opacity: 1;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.tab-icon-img {
  width: 34px;
  height: 34px;
  object-fit: contain;
  transition: all 0.2s ease;
}

.nav-tab:hover .tab-icon-img {
  transform: scale(1.1);
}

.nav-tab.active .tab-icon-img {

}

.tab-text {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tab-label {
  font-weight: 500;
  font-size: 13px;
  text-align: center;
}

.tab-count {
  font-size: 11px;
  opacity: 0.8;
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.tab-content {
  height: 100%;
}

/* 默认状态 */
.default-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.welcome-content {
  text-align: center;
  color: #64748b;
}

.welcome-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.welcome-content p {
  margin: 0;
  font-size: 14px;
}

/* 建议框 */
.suggestions-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.suggestion-item {
  padding: 6px 0;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
}

.suggestion-item:last-of-type {
  border-bottom: none;
}

.suggestion-item:hover {
  color: #667eea;
  background: #f8fafc;
  margin: 0 -12px;
  padding: 12px;
  border-radius: 8px;
}

.suggestion-link {
  padding: 12px 0;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  text-decoration: underline;
}

.suggestion-link:hover {
  color: #5a6fd8;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 智能中心内容 */
.center-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.center-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.center-item:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.center-icon {
  font-size: 24px;
}

.center-text h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.center-text p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

/* 消息内容样式 */
.messages-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.message-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.message-sender {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.message-time {
  font-size: 12px;
  color: #64748b;
}

.message-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  text-align: left;
}

/* 输入区域 - 重新设计布局 */
.input-area {
  padding: 20px 24px;
  background: #fafbfc;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 快捷功能按钮 - 移到输入框上方，与输入框紧邻 */
.quick-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
}

.quick-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 5px 11px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  color: #64748b;
  min-width: 60px;
}

.quick-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #667eea;
}

/* 输入框和操作按钮容器 - 添加细边框 */
.input-container {
  border: 1px solid #8b5cf6;
  border-radius: 12px;
  background: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background: #fafbfc;
  resize: none;
  font-family: inherit;
  line-height: 1.5;
}

.chat-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.input-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.action-btn-small {
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn-small:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #667eea;
}

.send-btn {
  padding: 8px 17px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .floating-ball {
    right: 20px;
    bottom: 20px;
    width: 56px;
    height: 56px;
  }
  
  .ball-main {
    width: 48px;
    height: 48px;
  }
  
  .ball-icon {
    width: 40px;
    height: 40px;
  }
  
  .ai-icon {
    width: 24px;
    height: 24px;
  }
  
  .tooltip {
    display: none;
  }
  
  .chat-panel {
    right: 20px;
    bottom: 20px;
    width: calc(100vw - 40px);
    height: calc(100vh - 40px);
    max-height: 800px;
  }
  
  .nav-container {
    padding: 12px 16px;
  }
  
  .nav-tabs {
    padding: 12px;
    gap: 8px;
  }
  
  .nav-tab {
    padding: 12px 8px;
    font-size: 13px;
    min-height: 70px;
  }
  
  .tab-icon-img {
    width: 20px;
    height: 20px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .input-area {
    padding: 16px;
  }
  
  .quick-actions {
    gap: 6px;
  }  
  .quick-btn {
    padding: 6px 8px;
    font-size: 11px;
    min-width: 50px;
  }
  }
  </style>  
