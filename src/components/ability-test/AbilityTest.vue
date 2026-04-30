<template>
  <div class="career-section-container">
    <!-- 头部标题与描述 -->
    <div class="section-header">
      <div class="header-left">
        <h2 class="section-title">{{ activeTab === 'spectrum' ? '检测图谱' : '检测报告' }}</h2>
        <p class="section-subtitle">
          {{ activeTab === 'spectrum' 
            ? '全面了解您的各项能力水平和发展潜力，基于多维度数据构建的专业能力模型' 
            : 'AI 智能生成的个人能力分析报告，提供全方位的优势诊断与成长建议' 
          }}
        </p>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area modern-content-card">
      <!-- 检测图谱内容 -->
      <div v-if="activeTab === 'spectrum'" class="tab-content">
        <AbilitySpectrum />
      </div>
      
      <!-- 检测报告内容 -->
      <div v-if="activeTab === 'report'" class="tab-content">
        <AbilityReport />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AbilitySpectrum from './AbilitySpectrum.vue'
import AbilityReport from './AbilityReport.vue'

const route = useRoute()

// 当前激活的标签页
const activeTab = ref('spectrum')

// 切换标签页
const switchTab = (tab) => {
  if (activeTab.value !== tab) {
    activeTab.value = tab
    console.log(`切换到标签页: ${tab}`)
  }
}

// 监听路由参数
watch(() => route.query.tab, (newTab) => {
  if (newTab === 'report') {
    activeTab.value = 'report'
  } else {
    activeTab.value = 'spectrum'
  }
}, { immediate: true })

onMounted(() => {
  console.log('能力检测页面已加载')
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
  background: linear-gradient(to bottom, #2b58ff, #1a41cc);
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
  background: linear-gradient(135deg, #2b58ff, #1a41cc);
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(43, 88, 255, 0.2);
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
