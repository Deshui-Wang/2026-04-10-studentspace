<template>
  <div class="ai-assistant-page">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-left">
          <h1 class="main-title">打造您的专属智能伙伴</h1>
          <p class="subtitle">从简单对话到复杂流程,一站式智能体定制平台</p>
        </div>
        <div class="header-right">
          <div class="header-graphics">
            <div class="server-blocks">
            </div>
          </div>
        </div>
      </div>
      
      <div class="header-controls">
        <button class="create-agent-btn" @click="createAgent">
          <span class="plus-icon">+</span>
          创建智能体
        </button>
        <div class="right-controls">
          <div class="search-container">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" placeholder="请输入内容" class="search-input" />
            </div>
          </div>
          <button class="import-btn">
            <span class="cloud-icon-small">☁️</span>
            导入DSL文件
          </button>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="content-header">
      </div>

      <!-- 智能体卡片网格 -->
      <div class="agents-grid">
        <!-- 智能体卡片 1 -->
        <div class="agent-card" :data-agent-id="agents[0].id">
          <div class="card-header">
            <div class="agent-info">
              <h3 class="agent-title">{{ agents[0].title }}</h3>
              <p class="agent-description">{{ agents[0].description }}</p>
            </div>
            <div class="agent-stats">
              <span class="stat-number">{{ agents[0].stats.number }}</span>
              <span class="stat-date">{{ agents[0].stats.date }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="agent-image">
              <div class="number-icon"> ☎️</div>
            </div>
            <div class="agent-status">
              <span class="status-badge" :class="agents[0].status">{{ agents[0].statusText }}</span>
              <span class="type-tag" :class="agents[0].type">{{ agents[0].typeText }}</span>
            </div>
          </div>
          
          <div class="card-actions">
            <button class="action-btn edit-btn" @click="editAgent(agents[0])">编辑</button>
            <button class="action-btn run-btn">运行</button>
            <button class="action-btn unpublish-btn">取消发布</button>
            <button class="action-btn more-btn">...</button>
          </div>
        </div>

        <!-- 智能体卡片 2 -->
        <div class="agent-card" :data-agent-id="agents[1].id">
          <div class="card-header">
            <div class="agent-info">
              <h3 class="agent-title">{{ agents[1].title }}</h3>
              <p class="agent-description">{{ agents[1].description }}</p>
            </div>
            <div class="agent-stats">
              <span class="stat-number">{{ agents[1].stats.number }}</span>
              <span class="stat-date">{{ agents[1].stats.date }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="agent-image">
              <div class="number-icon">👩</div>
            </div>
            <div class="agent-status">
              <span class="status-badge" :class="agents[1].status">{{ agents[1].statusText }}</span>
              <span class="type-tag" :class="agents[1].type">{{ agents[1].typeText }}</span>
            </div>
          </div>
          
          <div class="card-actions">
            <button class="action-btn edit-btn" @click="editAgent(agents[1])">编辑</button>
            <button class="action-btn run-btn">运行</button>
            <button class="action-btn unpublish-btn">取消发布</button>
            <button class="action-btn more-btn">...</button>
          </div>
        </div>

        <!-- 智能体卡片 3 -->
        <div class="agent-card" :data-agent-id="agents[2].id">
          <div class="card-header">
            <div class="agent-info">
              <h3 class="agent-title">{{ agents[2].title }}</h3>
              <p class="agent-description">{{ agents[2].description }}</p>
            </div>
            <div class="agent-stats">
              <span class="stat-number">{{ agents[2].stats.number }}</span>
              <span class="stat-date">{{ agents[2].stats.date }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="agent-image">
              <div class="number-icon">🤖</div>
            </div>
            <div class="agent-status">
              <span class="status-badge" :class="agents[2].status">{{ agents[2].statusText }}</span>
              <span class="type-tag" :class="agents[2].type">{{ agents[2].typeText }}</span>
            </div>
          </div>
          
          <div class="card-actions">
            <button class="action-btn edit-btn" @click="editAgent(agents[2])">编辑</button>
            <button class="action-btn publish-btn">发布</button>
            <button class="action-btn more-btn">...</button>
          </div>
        </div>

        <!-- 智能体卡片 4 -->
        <div class="agent-card" :data-agent-id="agents[3].id">
          <div class="card-header">
            <div class="agent-info">
              <h3 class="agent-title">{{ agents[3].title }}</h3>
              <p class="agent-description">{{ agents[3].description }}</p>
            </div>
            <div class="agent-stats">
              <span class="stat-number">{{ agents[3].stats.number }}</span>
              <span class="stat-date">{{ agents[3].stats.date }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="agent-image">
              <div class="badge-icon">⭐</div>
            </div>
            <div class="agent-status">
              <span class="status-badge" :class="agents[3].status">{{ agents[3].statusText }}</span>
              <span class="type-tag" :class="agents[3].type">{{ agents[3].typeText }}</span>
            </div>
          </div>
          
          <div class="card-actions">
            <button class="action-btn edit-btn" @click="editAgent(agents[3])">编辑</button>
            <button class="action-btn run-btn">运行</button>
            <button class="action-btn unpublish-btn">取消发布</button>
            <button class="action-btn more-btn">...</button>
          </div>
        </div>

        <!-- 智能体卡片 5 -->
        <div class="agent-card" :data-agent-id="agents[4].id">
          <div class="card-header">
            <div class="agent-info">
              <h3 class="agent-title">{{ agents[4].title }}</h3>
              <p class="agent-description">{{ agents[4].description }}</p>
            </div>
            <div class="agent-stats">
              <span class="stat-number">{{ agents[4].stats.number }}</span>
              <span class="stat-date">{{ agents[4].stats.date }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="agent-image">
              <div class="panda-icon">🐼</div>
            </div>
            <div class="agent-status">
              <span class="status-badge" :class="agents[4].status">{{ agents[4].statusText }}</span>
              <span class="type-tag" :class="agents[4].type">{{ agents[4].typeText }}</span>
            </div>
          </div>
          
          <div class="card-actions">
            <button class="action-btn edit-btn" @click="editAgent(agents[4])">编辑</button>
            <button class="action-btn run-btn">运行</button>
            <button class="action-btn unpublish-btn">取消发布</button>
            <button class="action-btn more-btn">...</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Agent',
  data() {
    return {
      agents: [
        {
          id: 1,
          title: '客服小优',
          description: '客服小优',
          image: '/pic/customer-service.png',
          stats: { number: '4k', date: '08-14 19:26 更新' },
          status: 'published',
          statusText: '已发布',
          type: 'basic',
          typeText: '基础型'
        },
        {
          id: 2,
          title: '主播',
          description: '主播',
          image: new URL('/pic/avatar1.png', import.meta.url).href,
          stats: { number: '8.8k', date: '08-14 19:25 更新' },
          status: 'published',
          statusText: '已发布',
          type: 'role',
          typeText: '角色型'
        },
        {
          id: 3,
          title: '小溜溜',
          description: '嘟嘟嘟嘟嘟嘟嘟',
          image: null,
          stats: { number: '10k', date: '06-17 17:39 更新' },
          status: 'draft',
          statusText: '草稿',
          type: 'process',
          typeText: '流程型'
        },
        {
          id: 4,
          title: '客服',
          description: '客服客服',
          image: null,
          stats: { number: '5.8k', date: '06-11 10:38 更新' },
          status: 'published',
          statusText: '已发布',
          type: 'role',
          typeText: '角色型'
        },
        {
          id: 5,
          title: '王得水',
          description: '得水的智能助理',
          image: null,
          stats: { number: '3.7k', date: '08-27 11:17 更新' },
          status: 'published',
          statusText: '已发布',
          type: 'role',
          typeText: '角色型'
        }
      ]
    }
  },
  methods: {
    createAgent() {
      this.$router.push('/agent-editor');
    },
    editAgent(agent) {
      this.$router.push({
        path: '/agent-editor',
        query: { 
          mode: 'edit',
          agentId: agent.id,
          agentName: agent.title
        }
      });
    }
  }
}
</script>

<style scoped>
.ai-assistant-page {
  background: #ffffff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 头部区域样式 */
.header-section {
  background: linear-gradient(rgba(248, 247, 255, 0.4), rgba(255, 255, 255, 0.6)), url('/pic/agent_banner.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 40px 60px 30px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-left {
  flex: 1;
  max-width: 500px;
}

.main-title {
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6, #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 20px 0;
  line-height: 1.2;
  display: flex;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  display: flex;
}

.header-right {
  position: relative;
  width: 300px;
  height: 200px;
}

.header-graphics {
  position: relative;
  width: 100%;
  height: 100%;
}

.cloud-icon {
  position: absolute;
  top: 20px;
  right: 40px;
  font-size: 48px;
  opacity: 0.8;
}

.server-blocks {
  position: absolute;
  top: 80px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.server-block {
  width: 60px;
  height: 20px;
  background: rgba(139, 92, 246, 0.3);
  border-radius: 4px;
}

.database-icon {
  position: absolute;
  bottom: 60px;
  right: 80px;
  font-size: 32px;
  opacity: 0.7;
}

.shield-icon {
  position: absolute;
  top: 40px;
  left: 20px;
  font-size: 24px;
  opacity: 0.6;
}

.s-logo {
  position: absolute;
  bottom: 40px;
  left: 60px;
  font-size: 28px;
  font-weight: bold;
  color: #8b5cf6;
  opacity: 0.8;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-container {
  flex: 0 0 auto;
  width: 400px;
}

.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-icon {
  margin-right: 12px;
  color: #9ca3af;
}

.search-input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #374151;
}

.search-input::placeholder {
  color: #9ca3af;
}

.import-btn {
  background: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
}

.import-btn:hover {
  background: #7c3aed;
}

.cloud-icon-small {
  font-size: 16px;
}

/* 主内容区域样式 */
.main-content {
  padding: 40px 60px;
}

.content-header {
  margin-bottom: 40px;
}

.create-agent-btn {
  background: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.create-agent-btn:hover {
  background: #7c3aed;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.plus-icon {
  font-size: 20px;
  font-weight: bold;
}

/* 智能体卡片网格样式 */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.agent-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.agent-card:hover {
  border-color: #8b5cf6;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.agent-info {
  flex: 1;
}

.agent-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  display: flex;
}

.agent-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  display: flex;
}

.agent-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.stat-number {
  font-size: 16px;
  font-weight: 600;
  color: #8b5cf6;
}

.stat-date {
  font-size: 12px;
  color: #9ca3af;
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.agent-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.agent-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.number-icon {
  font-size: 32px;
  font-weight: bold;
  color: #f97316;
  background: #fef3c7;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.panda-icon {
  font-size: 40px;
}

.badge-icon {
  font-size: 32px;
  color: #8b5cf6;
}

.agent-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.published {
  background: #dcfce7;
  color: #166534;
}

.status-badge.draft {
  background: #fef3c7;
  color: #92400e;
}

.type-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.type-tag.basic {
  background: #dbeafe;
  color: #1e40af;
}

.type-tag.role {
  background: #e9d5ff;
  color: #7c3aed;
}

.type-tag.process {
  background: #fce7f3;
  color: #be185d;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.edit-btn:hover {
  border-color: #8b5cf6;
  color: #8b5cf6;
}

.run-btn:hover {
  border-color: #10b981;
  color: #10b981;
}

.unpublish-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}

.publish-btn:hover {
  border-color: #10b981;
  color: #10b981;
}

.more-btn {
  padding: 8px 12px;
  min-width: 40px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-section {
    padding: 30px 40px 20px;
  }
  
  .main-content {
    padding: 30px 40px;
  }
  
  .agents-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .header-section {
    padding: 20px 20px 15px;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .header-right {
    width: 200px;
    height: 150px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  .header-controls {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .right-controls {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .search-container {
    width: 100%;
  }
  
  .main-content {
    padding: 20px 20px;
  }
  
  .agents-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .agent-card {
    padding: 20px;
  }
}
</style> 