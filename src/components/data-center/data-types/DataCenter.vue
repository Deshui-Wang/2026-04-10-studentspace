<template>
  <div class="data-center">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">智能学习·自由成长·明确目标·使命必达</h1>
    </div>
    <!-- 数据卡片网格 -->
    <div class="data-cards-grid">
      <TeachingDataCard
          :active-tab="activeTab"
          @tab-change="setActiveTab"
      />
      <ResourcesDataCard
          :active-tab="activeTab"
          @tab-change="setActiveTab"
      />
      <AchievementsDataCard
          :active-tab="activeTab"
          @tab-change="setActiveTab"
      />
      <EvaluationDataCard
          :active-tab="activeTab"
          @tab-change="setActiveTab"
      />
      <ReportsDataCard
          :active-tab="activeTab"
          @tab-change="setActiveTab"
      />
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <!-- 教学数据 -->
      <TeachingContent
          v-if="activeTab === 'teaching'"
          :active-sub-tab="activeSubTab"
          @sub-tab-change="setActiveSubTab"
      />

      <!-- 资源数据 -->
      <ResourcesContent
          v-if="activeTab === 'resources'"
          :active-sub-tab="activeSubTab"
          @sub-tab-change="setActiveSubTab"
      />

      <!-- 成果数据 -->
      <AchievementsContent
          v-if="activeTab === 'achievements'"
          :active-sub-tab="activeSubTab"
          @sub-tab-change="setActiveSubTab"
      />

      <!-- 评价数据 - 恢复使用EvaluationContent组件 -->
      <EvaluationContent
          v-if="activeTab === 'evaluation'"
          :active-sub-tab="activeSubTab"
          @sub-tab-change="setActiveSubTab"
      />

      <!-- 报告数据 -->
      <ReportsContent
          v-if="activeTab === 'reports'"
          :active-sub-tab="activeSubTab"
          @sub-tab-change="setActiveSubTab"
      />
    </div>
  </div>
</template>

<script setup>
import {nextTick, ref, watch} from 'vue'
import TeachingDataCard from '@/components/data-center/data-types/TeachingDataCard.vue'
import ResourcesDataCard from '@/components/data-center/data-types/ResourcesDataCard.vue'
import AchievementsDataCard from '@/components/data-center/data-types/AchievementsDataCard.vue'
import EvaluationDataCard from '@/components/data-center/data-types/EvaluationDataCard.vue'
import ReportsDataCard from '@/components/data-center/data-types/ReportsDataCard.vue'
import TeachingContent from '@/components/data-center/data-types/TeachingContent.vue'
import ResourcesContent from '@/components/data-center/data-types/ResourcesContent.vue'
import AchievementsContent from '@/components/data-center/data-types/AchievementsContent.vue'
import EvaluationContent from '@/components/data-center/data-types/EvaluationContent.vue'
import ReportsContent from '@/components/data-center/data-types/ReportsContent.vue'
import {useCommonStore} from "@/stores/index.js";

const commonStore = useCommonStore()
// 当前激活的主菜单
const activeTab = ref('teaching')
// 当前激活的子菜单
const activeSubTab = ref('workload')
// 设置激活的主菜单
const setActiveTab = (tab) => {
  activeTab.value = tab
  // 根据主菜单设置默认的子菜单
  if (tab === 'teaching') {
    activeSubTab.value = 'workload'
  } else if (tab === 'resources') {
    activeSubTab.value = 'courses'
  } else if (tab === 'achievements') {
    activeSubTab.value = 'papers'
  } else if (tab === 'evaluation') {
    activeSubTab.value = 'self-evaluation'  // 评价数据默认显示自我评价
  } else if (tab === 'reports') {
    activeSubTab.value = 'archive'
  }
}

// 设置激活的子菜单
const setActiveSubTab = (subTab) => {
  activeSubTab.value = subTab
}


watch(() => commonStore.sideBarMenuIndex, (newTab) => {
  if (newTab === 2) {
    setActiveTab('teaching')
    activeSubTab.value = 'grades'
  } else if (newTab === 3) {
    setActiveTab('achievements')
  }else if (newTab === 4) {
    setActiveTab('achievements')
    activeSubTab.value = 'ability-certification'
  }else if (newTab === 5) {

  }else if (newTab === 6) {
    setActiveTab('evaluation')
    activeSubTab.value = 'student'
  }else if (newTab === 7) {
    setActiveTab('evaluation')
    activeSubTab.value = 'self-evaluation'
  }
})
</script>

<style scoped>
.data-center {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 4s ease-in-out infinite;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
  position: relative;
  letter-spacing: 1px;
  display: inline-block;
}

.page-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
  background-size: 300% 300%;
  filter: blur(15px);
  opacity: 0.3;
  z-index: -1;
  animation: gradientShift 4s ease-in-out infinite;
}

.page-title::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  filter: blur(30px);
  z-index: -2;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.data-cards-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto 20px auto;
}

.content-section {
  max-width: 1400px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .data-cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .page-title {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .data-center {
    padding: 10px;
  }

  .data-cards-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 30px;
  }

  .page-title {
    font-size: 18px;
    letter-spacing: 0.5px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 16px;
  }
}
</style>
