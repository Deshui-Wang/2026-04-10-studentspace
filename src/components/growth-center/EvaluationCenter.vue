<template>
  <div class="career-section-container">
    <!-- 头部标题与描述 -->
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">{{ activeTab === 'goal' ? '目标路径' : '成长跟踪' }}</h2>
        <p class="section-subtitle">
          {{ activeTab === 'goal' 
            ? '设定目标、洞察差距，基于 AI 智能算法为您量身定制的阶段性成长达成方案' 
            : '全方位记录您的学习过程与数字化成果，多维度复盘每一个阶段的成长轨迹' 
          }}
        </p>
      </div>
      <div class="header-right" v-if="activeTab !== 'goal'">
        <el-button size="medium" plain class="secondary-btn">查看历史轨迹</el-button>
        <el-button type="primary" size="medium" class="action-btn">导出成长档案</el-button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area modern-content-card">
      <!-- 目标路径 -->
      <div v-if="activeTab === 'goal'" class="tab-content">
        <GoalPath />
      </div>
      
      <!-- 成长跟踪 -->
      <div v-if="activeTab === 'track'" class="tab-content">
        <GrowthTracking />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoalPath from './GoalPath.vue'
import GrowthTracking from './GrowthTracking.vue'

const route = useRoute()

// 当前激活的标签页
const activeTab = ref('track')

// 切换标签页
const switchTab = (tab) => {
  activeTab.value = tab
}

// 监听路由参数
watch(() => route.query.tab, (newTab) => {
  if (newTab === 'goals') {
    activeTab.value = 'goal'
  } else {
    activeTab.value = 'track'
  }
}, { immediate: true })

// 兼容旧自定义事件：统一映射到新标签
const handleSwitchToReport = () => {
  switchTab('track')
}

onMounted(() => {
  // 监听自定义事件（兼容旧事件名）
  window.addEventListener('switch-to-report', handleSwitchToReport)
  window.addEventListener('switch-to-decision', handleSwitchToReport)
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('switch-to-report', handleSwitchToReport)
  window.removeEventListener('switch-to-decision', handleSwitchToReport)
})
</script>

<style scoped>
.career-section-container {
  padding: 32px 48px;
  background: #f8f9fb;
  min-height: 100vh;
}

/* 头部样式适配 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  position: relative;
  padding-left: 16px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(to bottom, #8b5cf6, #7c3aed);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.modern-content-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
}

.action-btn {
  border-radius: 10px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.secondary-btn {
  border-radius: 10px;
  font-weight: 600;
  color: #7c3aed;
  border-color: #7c3aed33;
  margin-right: 12px;
}

.secondary-btn:hover {
  background: #f5f3ff;
  border-color: #7c3aed;
}

.tab-content {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .career-section-container {
    padding: 24px 32px;
  }
}

@media (max-width: 768px) {
  .career-section-container {
    padding: 20px 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
