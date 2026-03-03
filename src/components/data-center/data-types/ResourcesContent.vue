<template>
  <div class="content-section">
    <div class="content-tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'courses' }"
        @click="$emit('sub-tab-change', 'courses')"
      >
        学习资料
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'workflow' }"
        @click="$emit('sub-tab-change', 'workflow')"
      >
        工作流
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'knowledge-base' }"
        @click="$emit('sub-tab-change', 'knowledge-base')"
      >
        知识库
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'agent' }"
        @click="$emit('sub-tab-change', 'agent')"
      >
        智能体
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'digital-human' }"
        @click="$emit('sub-tab-change', 'digital-human')"
      >
        数字人
      </div>
    </div>
    
    <!-- 内容展示区域 -->
    <div class="content-area">
      <!-- 资源数据-课程页面 -->
      <Courses v-if="activeSubTab === 'courses'" />
      
      <!-- 资源数据-工作流页面 -->
      <Workflow v-if="activeSubTab === 'workflow'" />
      
      <!-- 资源数据-知识库页面 -->
      <KnowledgeBase v-if="activeSubTab === 'knowledge-base'" />
      
      <!-- 资源数据-智能体页面 -->
      <Agent v-if="activeSubTab === 'agent'" />

      <!-- 资源数据-数字人页面 -->
      <DigitalHuman v-if="activeSubTab === 'digital-human'" />
    </div>
  </div>
</template>

<script setup>
import Courses from '@/components/data-center/resource-data/Courses.vue'
import Workflow from '@/components/data-center/resource-data/Workflow.vue'
import KnowledgeBase from '@/components/data-center/resource-data/KnowledgeBase.vue'
import Agent from '@/components/data-center/resource-data/Agent.vue'
import DigitalHuman from '@/components/data-center/resource-data/DigitalHuman.vue'

defineProps({
  activeSubTab: {
    type: String,
    default: 'courses'
  }
})

defineEmits(['sub-tab-change'])
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

/* 响应式设计 */
@media (max-width: 768px) {
  .content-tabs {
    flex-wrap: wrap;
  }
  
  .tab-item {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
