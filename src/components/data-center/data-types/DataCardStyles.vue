<template>
  <!-- 这个文件仅用于导出共享样式 -->
</template>

<script>
// 共享的数据卡片样式
export const dataCardStyles = `
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
`

// 共享的内容区域样式
export const contentSectionStyles = `
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
  padding: 40px;
}

.placeholder-content {
  text-align: center;
  color: #6b7280;
}

.placeholder-content h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #374151;
}

.placeholder-content p {
  font-size: 16px;
}

@media (max-width: 768px) {
  .content-tabs {
    flex-wrap: wrap;
  }
  
  .tab-item {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .content-area {
    padding: 20px;
  }
}
`
</script>
