<template>
  <div class="knowledge-base-page">
    <!-- 头部区域 -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-left">
          <h1 class="main-title">智能无感知识库</h1>
          <p class="subtitle">导入各类知识文档，记录日常使用过的知识内容，甚至您关注过的内容等均会流入您的知识库，通过智能梳理和归纳形成结构化知识体系供您持续学习和研究。</p>
        </div>
      </div>
      
      <div class="header-controls">
        <button class="create-knowledge-btn" @click="createKnowledgeBase">
          <span class="plus-icon">+</span>
          创建知识库
        </button>
        <div class="right-controls">
          <div class="search-container">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" placeholder="搜索知识库..." class="search-input" />
            </div>
          </div>
          <button class="import-btn">
            <span class="cloud-icon-small">☁️</span>
            导入文档
          </button>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 知识库卡片网格 -->
      <div class="knowledge-grid">

        <!-- 临时知识口袋 -->
        <div class="knowledge-card highlight-card" @click="openKnowledgeBase(knowledgeBases[0])">
          <span class="accent-bar"></span>
          <div class="card-header">
            <div class="card-actions">
            </div>
          </div>
          <h3 class="card-title">{{ knowledgeBases[0].title }}</h3>
          <div class="card-stats">
            <span class="stat-item">{{ knowledgeBases[0].stats.documents }}文档上传</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[0].stats.characters }}教学内容发布</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[0].stats.applications }}智能应用</span>
          </div>
          <p class="card-description">暂存您近期使用或生产的内容， AI助理已经把这些内容总结和归纳起来，您可以随时再加工并形成更完善的知识库内容。</p>
        </div>

        <!-- 空白知识库 -->
        <div class="knowledge-card" @click="openKnowledgeBase(knowledgeBases[1])">
          <div class="card-header">
            <div class="card-actions">
            </div>
          </div>
          <h3 class="card-title">{{ knowledgeBases[1].title }}</h3>
          <div class="card-stats">
            <span class="stat-item">{{ knowledgeBases[1].stats.documents }}文档</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[1].stats.characters }}千字符</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[1].stats.applications }}关联应用</span>
          </div>
        </div>

        <!-- 主播口播脚本思路 -->
        <div class="knowledge-card" @click="openKnowledgeBase(knowledgeBases[2])">
          <div class="card-header">
            <div class="card-actions">
            </div>
          </div>
          <h3 class="card-title">{{ knowledgeBases[2].title }}</h3>
          <div class="card-stats">
            <span class="stat-item">{{ knowledgeBases[2].stats.documents }}文档</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[2].stats.characters }}千字符</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[2].stats.applications }}关联应用</span>
          </div>
          <p class="card-description">useful for when you want to answer queries about the 主播口播脚本思路.docx</p>
        </div>

        <!-- 优播导入模版 -->
        <div class="knowledge-card" @click="openKnowledgeBase(knowledgeBases[3])">
          <div class="card-header">
            <div class="card-actions">
            </div>
          </div>
          <h3 class="card-title">{{ knowledgeBases[3].title }}</h3>
          <div class="card-stats">
            <span class="stat-item">{{ knowledgeBases[3].stats.documents }}文档</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[3].stats.characters }}千字符</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[3].stats.applications }}关联应用</span>
          </div>
          <p class="card-description">useful for when you want to answer queries about the 优播导入模版.xlsx</p>
        </div>

        <!-- 核心数据生成逻辑 -->
        <div class="knowledge-card" @click="openKnowledgeBase(knowledgeBases[4])">
          <div class="card-header">
            <div class="card-actions">
            </div>
          </div>
          <h3 class="card-title">{{ knowledgeBases[4].title }}</h3>
          <div class="card-stats">
            <span class="stat-item">{{ knowledgeBases[4].stats.documents }}文档</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[4].stats.characters }}千字符</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[4].stats.applications }}关联应用</span>
          </div>
          <p class="card-description">useful for when you want to answer queries about the 核心数据生成逻辑.docx</p>
        </div>

        <!-- 财智未来 -->
        <div class="knowledge-card" @click="openKnowledgeBase(knowledgeBases[5])">
          <div class="card-header">
            <div class="card-actions">
            </div>
          </div>
          <h3 class="card-title">{{ knowledgeBases[5].title }}</h3>
          <div class="card-stats">
            <span class="stat-item">{{ knowledgeBases[5].stats.documents }}文档</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[5].stats.characters }}千字符</span>
            <span class="stat-separator">・</span>
            <span class="stat-item">{{ knowledgeBases[5].stats.applications }}关联应用</span>
          </div>
          <p class="card-description">useful for when you want to answer queries about the 财智未来.docx</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KnowledgeBasePage',
  data() {
    return {
      knowledgeBases: [
        {
          id: 1,
          title: '临时知识口袋',
          stats: { documents: 16, characters: 23, applications: 17 }
        },
        {
          id: 2,
          title: '空白知识',
          stats: { documents: 0, characters: 0, applications: 0 }
        },
        {
          id: 3,
          title: '主播口播脚本思路.docx...',
          stats: { documents: 1, characters: 1, applications: 2 }
        },
        {
          id: 4,
          title: '优播导入模版.xlsx...',
          stats: { documents: 1, characters: 1, applications: 2 }
        },
        {
          id: 5,
          title: '核心数据生成逻辑.docx...',
          stats: { documents: 3, characters: 6, applications: 0 }
        },
        {
          id: 6,
          title: '财智未来.docx...',
          stats: { documents: 1, characters: 16, applications: 0 }
        }
      ]
    }
  },
  methods: {
    createKnowledgeBase() {
      console.log('创建知识库');
      // 这里可以跳转到创建知识库页面
    },
    openKnowledgeBase(knowledgeBase) {
      console.log('打开知识库:', knowledgeBase.title);
      // 这里可以跳转到知识库详情页面
    },
    showMoreOptions(knowledgeBase) {
      console.log('显示更多选项:', knowledgeBase.title);
      // 这里可以显示操作菜单
    }
  }
}
</script>

<style scoped>
.knowledge-base-page {
  background: #fff;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 头部区域样式 */
.header-section {
  background: linear-gradient(rgba(248, 247, 255, 0.1), rgba(255, 255, 255, 0.1)), url('/pic/know_banner.png') no-repeat center / cover;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 40px 60px 30px;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.6);
}

.header-content {
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

.header-left {
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
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  display: flex;
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
  width: 300px;
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

.create-knowledge-btn {
  background: #8b5cf6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.create-knowledge-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.plus-icon {
  font-size: 20px;
  font-weight: bold;
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

/* 知识库卡片网格样式 */
.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.knowledge-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 24px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.knowledge-card:not(.highlight-card):hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

/* 突出样式：临时知识口袋 */
.knowledge-card.highlight-card {
  position: relative;
  border: 1px solid transparent;
  background: linear-gradient(#ffffff, #ffffff) padding-box,
              linear-gradient(135deg, #a78bfa, #60a5fa) border-box;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.15), 0 2px 6px rgba(0, 0, 0, 0.05);
}

.knowledge-card.highlight-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.2), 0 4px 10px rgba(0, 0, 0, 0.06);
}

.knowledge-card.highlight-card .card-title {
  color: #4f46e5;
}

.knowledge-card.highlight-card .stat-item {
  color: #6366f1;
}

.knowledge-card.highlight-card .accent-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  background: linear-gradient(180deg, #8b5cf6, #60a5fa);
}

.knowledge-card.highlight-card::after {
  content: '推荐';
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 12px;
  line-height: 1;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.08);
  border: 1px solid rgba(124, 58, 237, 0.25);
  padding: 4px 8px;
  border-radius: 9999px;
}

.knowledge-card.create-card {
  border: 2px dashed #d1d5db;
  background: #f9fafb;
  text-align: center;
}

.knowledge-card.create-card:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.folder-icon {
  font-size: 24px;
  color: #3b82f6;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.card-icon {
  width: 80px;
  height: 80px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  background: #f9fafb;
}

.create-icon {
  font-size: 32px;
  color: #6b7280;
  font-weight: bold;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  line-height: 1.3;
  display: flex;
}

.card-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: flex;
}

.card-stats {
  display: flex;
  align-items: center;
  gap: 1px;
  margin-bottom: 12px;
}

.stat-item {
  font-size: 14px;
  color: #6b7280;
}

.stat-separator {
  color: #d1d5db;
  font-weight: 300;
}

.card-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.card-link:hover {
  color: #2563eb;
}

.link-text {
  text-decoration: underline;
}

.arrow {
  font-size: 16px;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-section {
    padding: 30px 40px 20px;
  }
  
  .main-content {
    padding: 30px 40px;
  }
  
  .knowledge-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .header-section {
    padding: 20px 20px 15px;
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
  
  .knowledge-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .knowledge-card {
    padding: 20px;
  }
}
</style> 