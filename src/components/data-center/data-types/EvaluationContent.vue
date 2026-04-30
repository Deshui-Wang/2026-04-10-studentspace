<template>
  <div class="content-section">
    <div class="content-tabs">
      <div
        class="tab-item"
        :class="{ active: activeSubTab === 'digital-literacy' || !activeSubTab }"
        @click="$emit('sub-tab-change', 'digital-literacy')"
      >
        智能评价
      </div>
    </div>

    <!-- 内容展示区域 -->
    <div class="content-area">
      <!-- 数字素养页面 (智能评价) -->
      <DigitalLiteracy />
    </div>
  </div>
</template>

<script setup>
import DigitalLiteracy from '@/components/data-center/evaluation/DigitalLiteracy.vue'

defineProps({
  activeSubTab: {
    type: String,
    default: 'digital-literacy'
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

.placeholder-content {
  text-align: center;
  color: #6b7280;
  padding: 40px;
}

.placeholder-content h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #374151;
}

.placeholder-content p {
  font-size: 16px;
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

  .content-area {
    padding: 0;
  }
}
</style>
