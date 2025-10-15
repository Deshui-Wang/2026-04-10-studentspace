<template>
  <div 
    class="data-card" 
    :class="{ active: activeTab === 'evaluation' }"
    @click="$emit('tab-change', 'evaluation')"
  >
    <h3 class="card-title">评价数据</h3>
    <div class="card-content">
      <div class="data-row">
        <div class="data-item">
          <span class="data-value">11</span>
          <span class="data-label">自我评价</span>
        </div>
        <div class="data-item">
          <span class="data-value">15</span>
          <span class="data-label">智能评价</span>
        </div>
        <div class="data-item">
          <span class="data-value">42</span>
          <span class="data-label">评价教师</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeTab: {
    type: String,
    default: ''
  }
})

defineEmits(['tab-change'])
</script>

<style scoped>
.data-card {
  background: white;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  z-index: 2;
}

.data-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.data-card:hover::before {
  opacity: 0.05;
}

.data-card.active {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.data-card.active::before {
  opacity: 0.1;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  text-align: center;
}

.card-content {
  padding: 0;
}

.data-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.data-value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 4px;
}

.data-label {
  font-size: 11px;
  color: #6b7280;
  text-align: center;
  line-height: 1.2;
  word-break: break-all;
}

@media (max-width: 768px) {
  .data-card {
    padding: 8px;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .data-value {
    font-size: 16px;
  }
  
  .data-label {
    font-size: 10px;
  }
}
</style>
