<template>
  <div class="workflow-page">
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 工作流卡片网格 -->
      <div class="workflows-grid">
        <!-- 工作流卡片 1 - 编辑助理 -->
        <div class="workflow-card" :data-workflow-id="workflows[0].id">
          <div class="card-header">
            <div class="workflow-info">
              <h3 class="workflow-title">{{ workflows[0].title }}</h3>
              <p class="workflow-description">{{ workflows[0].description }}</p>
            </div>
            <div class="workflow-stats">
              <span class="stat-number">{{ workflows[0].stats.number }}</span>
              <span class="stat-date">{{ workflows[0].stats.date }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="workflow-image">
              <div class="star-icon">⭐</div>
            </div>
            <div class="workflow-status">
              <span class="status-badge" :class="workflows[0].status">{{ workflows[0].statusText }}</span>
              <span class="type-tag" :class="workflows[0].type">{{ workflows[0].typeText }}</span>
            </div>
          </div>
        </div>

        <!-- 工作流卡片 2 -->
        <div class="workflow-card" :data-workflow-id="workflows[1].id">
          <div class="card-header">
            <div class="workflow-info">
              <h3 class="workflow-title">{{ workflows[1].title }}</h3>
              <p class="workflow-description">{{ workflows[1].description }}</p>
            </div>
            <div class="workflow-stats">
              <span class="stat-number">{{ workflows[1].stats.number }}</span>
              <span class="stat-date">{{ workflows[1].stats.date }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="workflow-image">
              <div class="robot-icon">🤖</div>
            </div>
            <div class="workflow-status">
              <span class="status-badge" :class="workflows[1].status">{{ workflows[1].statusText }}</span>
              <span class="type-tag" :class="workflows[1].type">{{ workflows[1].typeText }}</span>
            </div>
          </div>
        </div>

        <!-- 工作流卡片 3 -->
        <div class="workflow-card" :data-workflow-id="workflows[2].id">
          <div class="card-header">
            <div class="workflow-info">
              <h3 class="workflow-title">{{ workflows[2].title }}</h3>
              <p class="workflow-description">{{ workflows[2].description }}</p>
            </div>
            <div class="workflow-stats">
              <span class="stat-number">{{ workflows[2].stats.number }}</span>
              <span class="stat-date">{{ workflows[2].stats.date }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="workflow-image">
              <div class="chart-icon">📊</div>
            </div>
            <div class="workflow-status">
              <span class="status-badge" :class="workflows[2].status">{{ workflows[2].statusText }}</span>
              <span class="type-tag" :class="workflows[2].type">{{ workflows[2].typeText }}</span>
            </div>
          </div>
        </div>

        <!-- 工作流卡片 4 -->
        <div class="workflow-card" :data-workflow-id="workflows[3].id">
          <div class="card-header">
            <div class="workflow-info">
              <h3 class="workflow-title">{{ workflows[3].title }}</h3>
              <p class="workflow-description">{{ workflows[3].description }}</p>
            </div>
            <div class="workflow-stats">
              <span class="stat-number">{{ workflows[3].stats.number }}</span>
              <span class="stat-date">{{ workflows[3].stats.date }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="workflow-image">
              <div class="code-icon">💻</div>
            </div>
            <div class="workflow-status">
              <span class="status-badge" :class="workflows[3].status">{{ workflows[3].statusText }}</span>
              <span class="type-tag" :class="workflows[3].type">{{ workflows[3].typeText }}</span>
            </div>
          </div>
        </div>

        <!-- 工作流卡片 5 -->
        <div class="workflow-card" :data-workflow-id="workflows[4].id">
          <div class="card-header">
            <div class="workflow-info">
              <h3 class="workflow-title">{{ workflows[4].title }}</h3>
              <p class="workflow-description">{{ workflows[4].description }}</p>
            </div>
            <div class="workflow-stats">
              <span class="stat-number">{{ workflows[4].stats.number }}</span>
              <span class="stat-date">{{ workflows[4].stats.date }}</span>
            </div>
          </div>
          
          <div class="card-body">
            <div class="workflow-image">
              <div class="brain-icon">🧠</div>
            </div>
            <div class="workflow-status">
              <span class="status-badge" :class="workflows[4].status">{{ workflows[4].statusText }}</span>
              <span class="type-tag" :class="workflows[4].type">{{ workflows[4].typeText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkflowPage',
  data() {
    return {
      workflows: [
        {
          id: 1,
          title: '照护计划生成助理',
          description: '日常帮我根据长者体征生成照护计划',
          stats: { number: '4.2k', date: '08-27 11:51 更新' },
          status: 'draft',
          statusText: '草稿',
          type: 'assistant',
          typeText: '助理型'
        },
        {
          id: 2,
          title: '智能用药提醒客服',
          description: '自动处理家属对老人用药及健康的咨询',
          stats: { number: '3.8k', date: '08-26 15:30 更新' },
          status: 'draft',
          statusText: '草稿',
          type: 'service',
          typeText: '服务型'
        },
        {
          id: 3,
          title: '慢病数据分析师',
          description: '自动分析院内长者慢病数据并生成报告',
          stats: { number: '2.9k', date: '08-25 09:15 更新' },
          status: 'draft',
          statusText: '草稿',
          type: 'analysis',
          typeText: '分析型'
        },
        {
          id: 4,
          title: '智慧终端配置助手',
          description: '帮助运维人员快速完成各终端指令交互',
          stats: { number: '5.1k', date: '08-24 14:20 更新' },
          status: 'draft',
          statusText: '草稿',
          type: 'development',
          typeText: '开发型'
        },
        {
          id: 5,
          title: '文娱活动策划师',
          description: '为日间照料中心生成节假日或常规创意活动方案',
          stats: { number: '3.5k', date: '08-23 16:45 更新' },
          status: 'draft',
          statusText: '草稿',
          type: 'creative',
          typeText: '创意型'
        }
      ]
    }
  },
  methods: {
    createWorkflow() {
      // 创建工作流应用
      console.log('创建工作流应用');
      // 这里可以跳转到工作流编辑器页面
    },
    editWorkflow(workflow) {
      // 编辑工作流
      console.log('编辑工作流:', workflow.title);
      // 这里可以跳转到工作流编辑器页面
    }
  }
}
</script>

<style scoped>
.workflow-page {
  background: #ffffff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 头部区域样式 */
.header-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(248, 247, 255, 0.1), rgba(219, 206, 249, 0.3));
  padding: 40px 60px 30px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: url('/pic/workflow_banner.png') no-repeat;
  background-size: cover;
  background-position: center right;
  opacity: 0.5;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.header-left {
  flex: 1;
  max-width: 600px;
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
  font-size: 18px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
  display: flex;
}

.header-right {
  position: relative;
  width: 200px;
  height: 200px;
}

.header-graphics {
  position: relative;
  width: 100%;
  height: 100%;
}

.ai-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #8b5cf6, #667eea);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
}

.ai-text {
  font-size: 36px;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
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

.create-workflow-btn {
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

.create-workflow-btn:hover {
  background: #7c3aed;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.plus-icon {
  font-size: 20px;
  font-weight: bold;
}

/* 工作流卡片网格样式 */
.workflows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.workflow-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.workflow-card:hover {
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

.workflow-info {
  flex: 1;
}

.workflow-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  display: flex;
}

.workflow-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
  display: flex;
}

.workflow-stats {
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

.workflow-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.star-icon {
  font-size: 32px;
  color: #fbbf24;
}

.robot-icon {
  font-size: 32px;
  color: #8b5cf6;
}

.chart-icon {
  font-size: 32px;
  color: #10b981;
}

.code-icon {
  font-size: 32px;
  color: #f97316;
}

.brain-icon {
  font-size: 32px;
  color: #ec4899;
}

.workflow-status {
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

.type-tag.assistant {
  background: #e9d5ff;
  color: #7c3aed;
}

.type-tag.service {
  background: #dbeafe;
  color: #1e40af;
}

.type-tag.analysis {
  background: #dcfce7;
  color: #166534;
}

.type-tag.development {
  background: #fef3c7;
  color: #92400e;
}

.type-tag.creative {
  background: #fce7f3;
  color: #be185d;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.draft-text {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  border-radius: 6px;
  font-size: 12px;
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

.publish-btn:hover {
  border-color: #10b981;
  color: #10b981;
}

.more-btn {
  padding: 6px 10px;
  min-width: 32px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-section {
    padding: 30px 40px 20px;
  }
  
  .main-content {
    padding: 30px 40px;
  }
  
  .workflows-grid {
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
    width: 150px;
    height: 150px;
  }
  
  .main-title {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
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
  
  .workflows-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .workflow-card {
    padding: 20px;
  }
}
</style> 