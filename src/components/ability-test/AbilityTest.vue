<template>
  <div class="ability-test-container">
    
    <!-- 顶部统计信息区域 - 可切换卡片 -->
    <div class="stats-header">
      <div class="stats-container">
        <div 
          class="stat-item" 
          :class="{ active: activeTab === 'spectrum' }"
          @click="switchTab('spectrum')"
        >
          <div class="stat-icon">
            <img src="/pic/zhineng.svg" alt="检测图谱图标" />
          </div>
          <div class="stat-content">
            <div class="stat-title">检测图谱</div>
            <div class="stat-subtitle">全面了解您的各项能力水平和发展潜力</div>
          </div>
        </div>
        <div 
          class="stat-item" 
          :class="{ active: activeTab === 'report' }"
          @click="switchTab('report')"
        >
          <div class="stat-icon">
            <img src="/pic/jineng.svg" alt="检测报告图标" />
          </div>
          <div class="stat-content">
            <div class="stat-title">检测报告</div>
            <div class="stat-subtitle">AI智能生成的个人能力分析报告和发展建议</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
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
import { ref, onMounted, onUnmounted } from 'vue'
import AbilitySpectrum from './AbilitySpectrum.vue'
import AbilityReport from './AbilityReport.vue'

// 当前激活的标签页
const activeTab = ref('spectrum')

// 切换标签页
const switchTab = (tab) => {
  if (activeTab.value !== tab) {
    activeTab.value = tab
    console.log(`切换到标签页: ${tab}`)
  }
}

onMounted(() => {
  console.log('能力检测页面已加载')
  
  // 添加键盘导航支持
  const handleKeydown = (event) => {
    if (event.key === '1') {
      switchTab('spectrum')
    } else if (event.key === '2') {
      switchTab('report')
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  // 清理事件监听器
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
.ability-test-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 顶部统计信息样式 */
.stats-header {
  background: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: 24px;
  box-shadow: none;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: auto;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
}

.stat-item:hover::before {
  opacity: 0.05;
}

.stat-item.active {
  border-color: #667eea;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
}

.stat-item.active::before {
  opacity: 0.1;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.stat-icon img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.stat-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.stat-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.2;
  text-align: left;
}

.stat-subtitle {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.3;
  text-align: left;
}

.keyboard-hint {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 4px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.stat-item:hover .keyboard-hint {
  opacity: 1;
}

.content-area {
  flex: 1;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-container {
    gap: 16px;
  }
  
  .stat-item {
    padding: 16px;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
  }
  
  .stat-icon img {
    width: 20px;
    height: 20px;
  }
  
  .stat-title {
    font-size: 16px;
  }
  
  .stat-subtitle {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .ability-test-container {
    padding: 16px;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .stat-item {
    padding: 16px;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
  }
  
  .stat-icon img {
    width: 18px;
    height: 18px;
  }
  
  .stat-title {
    font-size: 15px;
  }
  
  .stat-subtitle {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .ability-test-container {
    padding: 12px;
  }
  
  .stat-item {
    padding: 12px;
    gap: 12px;
  }
  
  .stat-icon {
    width: 32px;
    height: 32px;
  }
  
  .stat-icon img {
    width: 16px;
    height: 16px;
  }
  
  .stat-title {
    font-size: 14px;
  }
  
  .stat-subtitle {
    font-size: 10px;
  }
}
</style>
