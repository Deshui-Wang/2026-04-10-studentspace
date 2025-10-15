<template>
  <div class="agent-editor-page">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <div class="nav-left">
        <div class="agent-info">
          <img :src="agentImage" alt="智能体" class="agent-avatar" />
          <div class="agent-details">
            <h2 class="agent-name">{{ agentName }}</h2>
            <span class="agent-type">角色型</span>
          </div>
          <button class="edit-icon" @click="goBack">←</button>
        </div>
        <div class="save-info">草稿 保存于 2025-08-14 19:25:35</div>
      </div>
      
      <div class="nav-center">
        <div class="nav-tabs">
          <button class="tab-btn active">逻辑编排</button>
          <button class="tab-btn">其他设置</button>
        </div>
      </div>
      
      <div class="nav-right">
        <button class="save-btn">保存</button>
        <button class="publish-btn">发布</button>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧编排区域 -->
      <div class="left-panel">
        <div class="left-sidebar">
          <button class="sidebar-icon active" title="编排">📄</button>
          <button class="sidebar-icon" title="列表">📋</button>
          <button class="sidebar-icon" title="设置">⚙️</button>
          <button class="sidebar-icon" title="预览">👁️</button>
        </div>
        
        <div class="orchestration-panel">
          <h3 class="panel-title">编排</h3>
          
          <!-- 提示词部分 -->
          <div class="section">
            <div class="section-header">
              <h4>提示词</h4>
              <button class="generate-btn">生成</button>
            </div>
            <div class="prompt-editor">
              <textarea 
                v-model="promptText" 
                placeholder="请输入提示词..."
                class="prompt-textarea"
              ></textarea>
            </div>
          </div>
          
          <!-- 变量部分 -->
          <div class="section">
            <div class="section-header">
              <h4>变量</h4>
              <button class="add-btn">+ 添加</button>
            </div>
            <div class="variables-list">
              <div class="variable-item" v-for="variable in variables" :key="variable.name">
                <input type="checkbox" :checked="variable.required" class="variable-checkbox" />
                <span class="variable-name">{{ variable.name }}</span>
                <input type="text" :placeholder="variable.name" class="variable-input" />
                <span class="variable-status">{{ variable.required ? 'REQUIRED' : 'OPTIONAL' }}</span>
                <span class="variable-type">{{ variable.type }}</span>
              </div>
            </div>
          </div>
          
          <!-- 知识库部分 -->
          <div class="section">
            <div class="section-header">
              <h4>知识库</h4>
              <button class="add-btn">+ 添加</button>
            </div>
            <div class="knowledge-list">
              <div class="knowledge-item" v-for="doc in knowledgeDocs" :key="doc.name">
                <span class="doc-name">{{ doc.name }}</span>
                <button class="quality-btn">高质量·向量检索</button>
              </div>
            </div>
          </div>
          
          <!-- 元数据过滤部分 -->
          <div class="section">
            <div class="section-header">
              <h4>元数据过滤</h4>
            </div>
            <select class="filter-select">
              <option>禁用</option>
            </select>
          </div>
          
          <!-- 工具部分 -->
          <div class="section">
            <div class="section-header">
              <h4>工具</h4>
              <button class="add-btn">+ 添加</button>
            </div>
            <div class="tools-info">0/0 启用</div>
          </div>
          
          <!-- 视觉部分 -->
          <div class="section">
            <div class="section-header">
              <h4>视觉</h4>
            </div>
            <div class="visual-toggle">
              <span>设置</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="visualEnabled" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧调试预览区域 -->
      <div class="right-panel">
        <h3 class="panel-title">调试与预览</h3>
        
        <!-- Agent设置 -->
        <div class="agent-settings">
          <button class="settings-btn">Agent 设置</button>
          <div class="model-selector">
            <select class="model-select">
              <option>gpt-4o-mini CHAT</option>
            </select>
            <button class="save-icon">💾</button>
            <button class="settings-icon">⚙️</button>
          </div>
        </div>
        
        <!-- 输入变量 -->
        <div class="input-variables">
          <h4>输入变量</h4>
          <div class="variable-inputs">
            <div class="input-group" v-for="variable in variables" :key="variable.name">
              <label>{{ variable.name }}</label>
              <input type="text" :placeholder="variable.name" class="debug-input" />
            </div>
          </div>
        </div>
        
        <!-- 预览区域 -->
        <div class="preview-area">
          <div class="preview-header">
            <span>预览</span>
            <div class="preview-actions">
              <button class="undo-btn">↶</button>
              <button class="more-btn">...</button>
            </div>
          </div>
          <div class="chat-preview">
            <div class="chat-message">
              <div class="message-avatar">🤖</div>
              <div class="message-content">
                {{ generatedMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 底部聊天界面 -->
    <div class="bottom-chat">
      <div class="chat-left">
        <span>和 Bot 聊天</span>
      </div>
      <div class="chat-right">
        <input type="text" placeholder="输入消息..." class="chat-input" />
        <button class="send-btn">▶️</button>
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-text">功能已开启</span>
        </div>
        <a href="#" class="manage-link">管理 →</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgentEditor',
  data() {
    return {
      agentImage: new URL('/pic/avatar1.png', import.meta.url).href,
      isEditMode: false,
      agentId: null,
      agentName: '',
      promptText: `请根据以下信息生成一段吸引人的促销文案：

输入变量：
- snack_store_name: 零食店名称
- target_audience: 目标受众（如：高校学生宿舍）
- product_features: 产品特点（如：新鲜、健康、种类丰富）
- promotion_strategy: 促销策略（如：限时折扣、买一送一）

要求：
1. 以主播的身份生成促销文案
2. 突出零食店的特色和优势
3. 吸引目标受众的注意力
4. 语言生动有趣，符合大学生口味
5. 输出内容不包含XML标签`,
      variables: [
        { name: 'snack_store_name', required: true, type: 'string' },
        { name: 'target_audience', required: true, type: 'string' },
        { name: 'product_features', required: true, type: 'string' },
        { name: 'promotion_strategy', required: true, type: 'string' }
      ],
      knowledgeDocs: [
        { name: '优播导入模版.xlsx...' },
        { name: '主播口播脚本思路.docx...' }
      ],
      visualEnabled: false,
      generatedMessage: '欢迎来到零食小屋! 我们专为高校学生宿舍提供最优质的零食。我们的零食不仅新鲜、健康、种类丰富,而且现在还有限时折扣、买一送一的超值优惠!快来选购你喜欢的零食吧,让你的宿舍生活更加丰富多彩!'
    }
  },
  created() {
    // 检查路由参数，判断是创建还是编辑模式
    const { mode, agentId, agentName } = this.$route.query;
    if (mode === 'edit' && agentId) {
      this.isEditMode = true;
      this.agentId = agentId;
      this.agentName = agentName || '智能体';
      this.loadAgentData(agentId);
    } else {
      this.isEditMode = false;
      this.agentName = '新智能体';
    }
  },
  methods: {
    loadAgentData(agentId) {
      // 这里可以根据agentId加载相应的智能体数据
      // 目前使用默认数据，实际项目中应该从API获取
      console.log('加载智能体数据:', agentId);
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.agent-editor-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

/* 顶部导航栏 */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.agent-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.agent-type {
  background: #e9d5ff;
  color: #7c3aed;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.edit-icon {
  background: #f3f4f6;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  color: #6b7280;
  transition: all 0.2s;
}

.edit-icon:hover {
  background: #e5e7eb;
  color: #374151;
}

.save-info {
  color: #6b7280;
  font-size: 14px;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-tabs {
  display: flex;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-right {
  display: flex;
  gap: 12px;
}

.save-btn, .publish-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn {
  background: #f3f4f6;
  color: #374151;
}

.save-btn:hover {
  background: #e5e7eb;
}

.publish-btn {
  background: #8b5cf6;
  color: #ffffff;
}

.publish-btn:hover {
  background: #7c3aed;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧面板 */
.left-panel {
  display: flex;
  width: 50%;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
}

.left-sidebar {
  width: 60px;
  background: #f8fafc;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 16px;
}

.sidebar-icon {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.sidebar-icon.active {
  background: #8b5cf6;
  color: #ffffff;
}

.sidebar-icon:hover:not(.active) {
  background: #e5e7eb;
}

.orchestration-panel {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.panel-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px 0;
  color: #1f2937;
}

/* 部分样式 */
.section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.generate-btn, .add-btn {
  background: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.generate-btn:hover, .add-btn:hover {
  background: #7c3aed;
}

/* 提示词编辑器 */
.prompt-textarea {
  width: 100%;
  min-height: 200px;
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  background: #ffffff;
}

.prompt-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* 变量列表 */
.variables-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.variable-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.variable-checkbox {
  width: 16px;
  height: 16px;
}

.variable-name {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  color: #374151;
  min-width: 120px;
}

.variable-input {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.variable-status {
  font-size: 12px;
  color: #6b7280;
  min-width: 80px;
}

.variable-type {
  font-size: 12px;
  color: #6b7280;
  min-width: 60px;
}

/* 知识库列表 */
.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.knowledge-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.doc-name {
  font-size: 14px;
  color: #374151;
}

.quality-btn {
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
}

/* 过滤器选择 */
.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
  font-size: 14px;
}

/* 工具信息 */
.tools-info {
  color: #6b7280;
  font-size: 14px;
}

/* 视觉开关 */
.visual-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #8b5cf6;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* 右侧面板 */
.right-panel {
  width: 50%;
  padding: 24px;
  background: #ffffff;
  overflow-y: auto;
}

/* Agent设置 */
.agent-settings {
  margin-bottom: 24px;
}

.settings-btn {
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 12px;
}

.model-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.model-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
  font-size: 14px;
}

.save-icon, .settings-icon {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
}

/* 输入变量 */
.input-variables {
  margin-bottom: 24px;
}

.input-variables h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.variable-inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.debug-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

/* 预览区域 */
.preview-area {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 8px 8px 0 0;
}

.preview-header span {
  font-weight: 600;
  color: #1f2937;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.undo-btn, .more-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  color: #6b7280;
}

.chat-preview {
  padding: 20px;
  min-height: 300px;
}

.chat-message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  background: #8b5cf6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #ffffff;
}

.message-content {
  flex: 1;
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  line-height: 1.5;
  color: #374151;
}

/* 底部聊天界面 */
.bottom-chat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
}

.chat-left span {
  font-size: 14px;
  color: #6b7280;
}

.chat-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-input {
  width: 300px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 14px;
}

.send-btn {
  background: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
}

.status-text {
  font-size: 12px;
  color: #10b981;
}

.manage-link {
  font-size: 12px;
  color: #8b5cf6;
  text-decoration: none;
}

.manage-link:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-panel, .right-panel {
    width: 100%;
  }
  
  .left-panel {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
}

@media (max-width: 768px) {
  .top-nav {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .nav-tabs {
    width: 100%;
  }
  
  .left-sidebar {
    width: 50px;
  }
  
  .orchestration-panel {
    padding: 16px;
  }
  
  .right-panel {
    padding: 16px;
  }
  
  .chat-input {
    width: 200px;
  }
}
</style> 