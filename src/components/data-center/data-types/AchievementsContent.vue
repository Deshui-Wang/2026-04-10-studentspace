<template>
  <div class="content-section">
    <div class="content-tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'papers' }"
        @click="$emit('sub-tab-change', 'papers')"
      >
        科研成果
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'certificates' }"
        @click="$emit('sub-tab-change', 'certificates')"
      >
        奖学金
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'ability-certification' }"
        @click="$emit('sub-tab-change', 'ability-certification')"
      >
        竞赛获奖
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'international-ability' }"
        @click="$emit('sub-tab-change', 'international-ability')"
      >
        技能证书
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'teaching-achievements' }"
        @click="$emit('sub-tab-change', 'teaching-achievements')"
      >
        成长荣誉
      </div>
    </div>
    
    <!-- 内容展示区域 -->
    <div class="content-area">
      <!-- 科研成果页面 - 包含论文和专利筛选 -->
      <div v-if="activeSubTab === 'papers'" class="research-achievements-container">
        <!-- 统一的筛选区域 -->
        <div class="filter-section">
          <div class="filter-row">
            <div class="filter-tabs">
              <label 
                class="filter-tab" 
                :class="{ active: researchFilter === 'papers' }"
              >
                <input 
                  type="radio" 
                  name="research-filter" 
                  value="papers" 
                  v-model="researchFilter"
                  class="filter-checkbox"
                >
                <span class="filter-label">论文</span>
              </label>
              <label 
                class="filter-tab" 
                :class="{ active: researchFilter === 'patents' }"
              >
                <input 
                  type="radio" 
                  name="research-filter" 
                  value="patents" 
                  v-model="researchFilter"
                  class="filter-checkbox"
                >
                <span class="filter-label">专利</span>
              </label>
            </div>
            
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchKeyword" 
                :placeholder="researchFilter === 'papers' ? '搜索论文名称、作者或关键词...' : '搜索专利名称、专利号或申请人...'"
                class="search-input"
              >
              <i class="search-icon">🔍</i>
            </div>
          </div>
        </div>


        <!-- 根据筛选显示对应内容，并传递搜索关键词 -->
        <div v-if="researchFilter === 'papers'" class="embedded-component">
          <Papers :search-keyword="searchKeyword" />
        </div>
        <div v-if="researchFilter === 'patents'" class="embedded-component">
          <Patents :search-keyword="searchKeyword" />
        </div>
      </div>
      
      <!-- 成果数据-证书页面 -->
      <Certificates v-if="activeSubTab === 'certificates'" />
      
      <!-- 成果数据-能力认证页面 -->
      <AbilityCertifications v-if="activeSubTab === 'ability-certification'" />
      
      <!-- 成果数据-国际能力页面 -->
      <InternationalAbility v-if="activeSubTab === 'international-ability'" />
      
      <!-- 成果数据-教学成果页面 -->
      <TeachingAchievements v-if="activeSubTab === 'teaching-achievements'" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Papers from '@/components/data-center/achievements/Papers.vue'
import Certificates from '@/components/data-center/achievements/Certificates.vue'
import AbilityCertifications from '@/components/data-center/achievements/AbilityCertifications.vue'
import InternationalAbility from '@/components/data-center/achievements/InternationalAbility.vue'
import TeachingAchievements from '@/components/data-center/achievements/TeachingAchievements.vue'
import Patents from '@/components/data-center/achievements/Patents.vue'

const props = defineProps({
  activeSubTab: {
    type: String,
    default: 'papers'
  }
})

defineEmits(['sub-tab-change'])

// 科研成果筛选状态
const researchFilter = ref('papers')
// 搜索关键词
const searchKeyword = ref('')

// 监听 activeSubTab 变化，当切换到科研成果时重置筛选状态
watch(() => props.activeSubTab, (newTab) => {
  if (newTab === 'papers') {
    researchFilter.value = 'papers'
    searchKeyword.value = ''
  }
}, { immediate: true })

// 监听筛选状态变化
watch(researchFilter, (newFilter) => {
  console.log('筛选状态变化:', newFilter)
  // 清空搜索关键词
  searchKeyword.value = ''
})
</script>

<style scoped>
/* 内容区域 */
.content-section {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.content-tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
}

.tab-item {
  padding: 16px 24px;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
}

.tab-item:hover {
  color: #3b82f6;
  background: #f1f5f9;
}

.tab-item.active {
  color: #3b82f6;
  background: white;
  border-bottom-color: #3b82f6;
}

.content-area {
  min-height: 600px;
  padding: 0;
}

/* 科研成果容器样式 */
.research-achievements-container {
  padding: 0;
}

/* 嵌入组件的容器样式 - 彻底隐藏子组件的顶部结构 */
.embedded-component {
  /* 重置嵌入组件的容器样式，避免与父容器冲突 */
}

/* 隐藏嵌入组件的顶部标签栏和筛选区域 */
.embedded-component :deep(.content-section) {
  padding: 0;
  background: transparent;
  min-height: auto;
  border-radius: 0;
  box-shadow: none;
  margin: 0;
}

.embedded-component :deep(.content-tabs) {
  display: none !important; /* 强制隐藏顶部标签栏 */
}

.embedded-component :deep(.content-area) {
  padding: 0;
  min-height: auto;
}

.embedded-component :deep(.filter-section) {
  display: none !important; /* 强制隐藏筛选区域 */
}

.embedded-component :deep(.patents-container),
.embedded-component :deep(.papers-container) {
  padding: 0;
  background: transparent;
  min-height: auto;
  border-radius: 0;
  box-shadow: none;
  margin: 0;
}

/* 筛选区域样式 */
.filter-section {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 24px;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.filter-tabs {
  display: flex;
  gap: 20px;
  flex: 1;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  user-select: none;
  padding: 4px 0;
}

.filter-tab:hover {
  color: #3b82f6;
}

.filter-tab.active {
  color: #3b82f6;
}

.filter-checkbox {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
  accent-color: #3b82f6;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.search-box {
  position: relative;
  min-width: 300px;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-tabs {
    flex-wrap: wrap;
  }
  
  .tab-item {
    padding: 12px 16px;
    font-size: 14px;
  }

  .filter-row {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filter-tabs {
    flex-wrap: wrap;
    gap: 16px;
  }

  .search-box {
    min-width: auto;
    max-width: none;
  }
}
</style>
