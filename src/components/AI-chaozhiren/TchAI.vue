<template>
  <div class="tch-ai-page">
    <!-- 左侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="/pic/image 2.png" alt="AI Assistant Icon" class="header-icon" />
      </div>
      
      <div class="new-chat-section">
        <button 
          class="new-chat-btn" 
          :class="{ active: activeButton === 'new-chat' }"
          @click="setActiveButton('new-chat')"
        >
          <span class="plus-icon">+</span>
          开启新对话
        </button>
        <button 
          class="screenshot-btn"
          :class="{ active: activeButton === 'ai-assistant' }"
          @click="setActiveButton('ai-assistant')"
        >
          <img class="screenshot-icon" src="/pic/ai icon.png" alt="AI" />
          <span>AI智能体助理</span>
        </button>
        <button 
          class="workflow-btn"
          :class="{ active: activeButton === 'workflow' }"
          @click="setActiveButton('workflow')"
        >
          <span class="workflow-icon">⚡</span>
          <span>智能工作流</span>
        </button>
        <button 
          class="knowledge-btn"
          :class="{ active: activeButton === 'knowledge' }"
          @click="setActiveButton('knowledge')"
        >
          <span class="knowledge-icon">📚</span>
          <span>智能无感知识库</span>
        </button>
      </div>
      
      <div class="chat-history">
        <div class="history-group">
          <h3 class="group-title">今日</h3>
          <div class="history-item" v-for="item in todayHistory" :key="item.id">
            <span class="history-text">{{ item.text }}</span>
          </div>
        </div>
        
        <div class="history-group">
          <h3 class="group-title">昨日</h3>
          <div class="history-item" v-for="item in yesterdayHistory" :key="item.id">
            <span class="history-text">{{ item.text }}</span>
          </div>
        </div>
        
        <div class="history-group">
          <h3 class="group-title">7日前</h3>
          <div class="history-item" v-for="item in weekHistory" :key="item.id">
            <span class="history-text">{{ item.text }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <div class="top-navbar">
        <div class="nav-left">
          <span class="model-info">平台已正式对接Gpt5大模型， 对话更智能， 回答更准确</span>
        </div>
        <div class="nav-right">
          <button class="close-btn">×</button>
        </div>
      </div>
      
      <!-- 中心区域 -->
      <div class="center-section" v-if="activeButton === 'new-chat'">
        <div class="title-section">
          <h1 class="main-title">
            <span class="text-black ">模型</span>
            <span class="text-black ">随心，</span>
            <span class="text-black ">智慧</span>
            <span class="text-black ">随行</span>
          </h1>
          <p class="subtitle">多重AI视角，启发无限可能，探索AI思维的万千世界</p>
        </div>
        
        <div class="input-section">
          <div class="input-container">
            <textarea 
              class="main-input" 
              placeholder="请输入, Enter键发送, Shift+Enter键换行"
              v-model="userInput"
              @keydown="handleKeydown"
            ></textarea>
            
            <div class="input-options">
              <div class="left-options">
                <div class="option-item">
                  <span>gpt-4o-mini</span>
                  <span class="dropdown-arrow">▼</span>
                </div>

              </div>
              
              <div class="right-actions">
                <button class="action-btn upload-btn">
                  <span class="upload-icon">📎</span>
                </button>
                <button class="action-btn send-btn" @click="sendMessage">
                  <span class="send-icon">↑</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mode-buttons">
        </div>
      </div>

      <!-- AI智能助理页面 -->
      <div class="ai-assistant-content" v-if="activeButton === 'ai-assistant'">
        <Agent />
      </div>
      
      <!-- 智能工作流页面 -->
      <div class="workflow-content" v-if="activeButton === 'workflow'">
        <WorkflowPage />
      </div>
      
      <!-- 智能无感知识库页面 -->
      <div class="knowledge-content" v-if="activeButton === 'knowledge'">
        <KnowledgeBasePage />
      </div>
      
      <!-- 子路由视图 -->
      <router-view />
    </div>
  </div>
</template>

<script>
import Agent from './Agent.vue'
import WorkflowPage from './WorkflowPage.vue'
import KnowledgeBasePage from './KnowledgeBasePage.vue'

export default {
  name: 'TchAI',
  components: {
    Agent,
    WorkflowPage,
    KnowledgeBasePage
  },
  data() {
    return {
      userInput: '',
      activeMode: 'concise',
      activeButton: 'new-chat', // 默认选中"开启新对话"按钮
      todayHistory: [
        { id: 1, text: '如何设计一堂有效的微课？' },
        { id: 2, text: '学生注意力不集中怎么办？' },
        { id: 3, text: '课程思政元素如何融入？' },
        { id: 4, text: '在线教学平台使用技巧' },
        { id: 5, text: '如何提高学生参与度？' }
      ],
      yesterdayHistory: [
        { id: 6, text: '教学反思怎么写？' },
        { id: 7, text: '课堂管理策略分享' },
        { id: 8, text: '作业批改效率提升' }
      ],
      weekHistory: [
        { id: 9, text: '新教师入职培训要点' },
        { id: 10, text: '教学评价体系构建' },
        { id: 11, text: '教育技术发展趋势' }
      ]
    }
  },
  methods: {
    handleKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.sendMessage()
      }
    },
    sendMessage() {
      if (this.userInput.trim()) {
        console.log('发送消息:', this.userInput)
        // 在新标签页中打开AI思考页面
        const query = encodeURIComponent(this.userInput)
        const currentUrl = window.location.origin + window.location.pathname
        const url = `${currentUrl}#/ai-thinking?query=${query}`
        window.open(url, '_blank')
        
        // 清空输入框
        this.userInput = ''
      }
    },
    setMode(mode) {
      this.activeMode = mode
    },
    setActiveButton(button) {
      this.activeButton = button
    }
  }
}
</script>

<style scoped>
.tch-ai-page {
  display: flex;
  height: 100vh;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.title-text .text-black{
  font-size: 14px;
  color: #1b2559;
  font-weight: 500;
  margin: 0;
  display: flex;
}

/* 左侧边栏样式 */
.sidebar {
  width: 15.5%;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  margin-bottom: 30px;
}

.app-title {
  font-size: 24px;
  font-weight: 700;
  color: #8b5cf6;
  margin: 0;
  display: flex
}

.new-chat-section {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.new-chat-btn {
  width: 100%;
  padding: 12px 26px;
  background: #ffffff;
  color: #8b5cf6;
  border: 1.5px solid #8b5cf6;;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  transition: background-color 0.2s;
}

.new-chat-btn:hover {
  background: #f8f7ff;
  border-color: #7c3aed;
  color: #7c3aed;
}

.new-chat-btn.active {
  background: #8b5cf6;
  color: #ffffff;
  border-color: #8b5cf6;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.new-chat-btn.active:hover {
  background: #7c3aed;
  border-color: #7c3aed;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
}

.workflow-btn {
  width: 100%;
  padding: 8px 16px;
  background: #ffffff;
  color: #8b5cf6;
  border: 1.5px solid #8b5cf6;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  transition: all 0.2s;
}

.workflow-btn:hover {
  background: #f8f7ff;
  border-color: #7c3aed;
  color: #7c3aed;
}

.workflow-btn.active {
  background: #8b5cf6;
  color: #ffffff;
  border-color: #8b5cf6;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.workflow-btn.active:hover {
  background: #7c3aed;
  border-color: #7c3aed;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.workflow-icon {
  font-size: 18px;
}

.knowledge-btn {
  width: 100%;
  padding: 8px 16px;
  background: #ffffff;
  color: #8b5cf6;
  border: 1.5px solid #8b5cf6;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap:12px;
  transition: all 0.2s;
}

.knowledge-btn:hover {
  background: #f8f7ff;
  border-color: #7c3aed;
  color: #7c3aed;
}

.knowledge-btn.active {
  background: #8b5cf6;
  color: #ffffff;
  border-color: #8b5cf6;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.knowledge-btn.active:hover {
  background: #7c3aed;
  border-color: #7c3aed;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.knowledge-icon {
  font-size: 18px;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
}

.history-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 12px;
  font-weight: 600;
  color: #b5b7bc;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
}

.history-item {
  padding: 8px 0px;
  margin-bottom: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
}

.history-item:hover {
  background: #f3f4f6;
}

.history-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.4;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #8b5cf659;
  background: #dbcef9a6;
  gap: 12px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-info {
  font-size: 14px;
  color: #8b5cf6;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #8b5cf6;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.center-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 80px 10px;
  max-width: 1000px;
  width: 60%;
  margin: auto;
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 48px;
  font-weight: 900;
  background: linear-gradient(135deg, #8b5cf6, #a855f7, #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.subtitle {
  font-size: 18px;
  color: #8b5cf6;
  margin: 0;
  font-weight: 400;
}

.screenshot-btn {
  padding: 6px 12px;
  border: 1.5px solid #8b5cf6;
  background: #ffffff;
  color: #8b5cf6;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.screenshot-btn:hover {
  background: #f8f7ff;
  border-color: #7c3aed;
  color: #7c3aed;
}

.screenshot-btn.active {
  background: #8b5cf6;
  color: #ffffff;
  border-color: #8b5cf6;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.screenshot-btn.active:hover {
  background: #7c3aed;
  border-color: #7c3aed;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.screenshot-icon {
  width: 30px;
  height: 30px;
  display: block;
}

.input-section {
  width: 100%;
  margin-bottom: 32px;
  max-width: 900px;
}

.input-container {
  border: 2px solid #8b5cf6;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-container:focus-within {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.main-input {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  font-size: 16px;
  line-height: 1.5;
  font-family: inherit;
}

.main-input::placeholder {
  color: #9ca3af;
}

.input-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.left-options {
  display: flex;
  gap: 20px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.option-item:hover {
  background: #f3f4f6;
}

.dropdown-arrow {
  font-size: 10px;
  color: #9ca3af;
}

.right-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  padding: 5px 14px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #e5e7eb;
}

.upload-icon {
  font-size: 16px;
}

.send-btn {
  background: #8b5cf6;
  color: white;
}

.send-btn:hover {
  background: #7c3aed;
}

.send-icon {
  font-size: 16px;
  font-weight: bold;
}

.mode-buttons {
  display: flex;
  gap: 12px;
}

.mode-btn {
  padding: 10px 20px;
  border: 2px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn:hover {
  border-color: #8b5cf6;
  background: #f8fafc;
}

.mode-btn.active {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

/* AI智能助理内容区域样式 */
.ai-assistant-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* 智能工作流内容区域样式 */
.workflow-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* 智能无感知识库内容区域样式 */
.knowledge-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tch-ai-page {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .center-section {
    padding: 20px;
  }
  
  .main-title {
    font-size: 36px;
  }
  
  .nav-right {
    gap: 6px;
  }
  
  .screenshot-btn {
    padding: 6px 10px;
  }
  
  .screenshot-icon {
    width: 24px;
    height: 24px;
  }
  
  .mode-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .mode-btn {
    width: 100%;
  }
}
</style> 