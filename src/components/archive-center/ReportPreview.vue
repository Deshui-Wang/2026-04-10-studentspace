<template>
  <div class="report-preview">
    <!-- 报告头部 -->
    <div class="report-header">
      <div class="header-content">
        <h1 class="report-title">{{ reportData.name }}</h1>
        <div class="report-meta">
          <span class="created-date">创建时间：{{ formatDate(reportData.createdAt) }}</span>
          <span class="module-count">共 {{ reportData.modules.length }} 个模块</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="print-btn" @click="printReport">打印报告</button>
        <button class="close-btn" @click="closePreview">关闭</button>
      </div>
    </div>

    <!-- 报告内容 -->
    <div class="report-content">
      <div v-for="(module, index) in reportData.modules" :key="module.id" class="module-section">
        <div class="module-header">
          <div class="module-title">
            <span class="module-icon">{{ module.icon || '📄' }}</span>
            <h2>{{ module.name }}</h2>
            <span class="module-type">{{ getModuleTypeName(module.type) }}</span>
          </div>
        </div>

        <div class="module-body">
          <!-- 模块描述 -->
          <div v-if="module.description" class="module-description">
            <p>{{ module.description }}</p>
          </div>

          <!-- 模块内容 -->
          <div v-if="module.content" class="module-content">
            <div v-if="module.contentFormat === 'markdown'" v-html="renderMarkdown(module.content)"></div>
            <div v-else-if="module.contentFormat === 'html'" v-html="module.content"></div>
            <div v-else class="plain-text">{{ module.content }}</div>
          </div>

          <!-- 图表区域 -->
          <div v-if="module.chartType && module.chartType !== 'none'" class="module-chart">
            <div class="chart-container">
              <div class="chart-placeholder">
                <div class="chart-icon">{{ getChartIcon(module.chartType) }}</div>
                <div class="chart-info">
                  <h4>{{ getChartTypeName(module.chartType) }}</h4>
                  <p>配色方案：{{ module.colorScheme }}</p>
                  <div class="chart-options">
                    <span v-if="module.showLegend">显示图例</span>
                    <span v-if="module.showLabels">显示标签</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="!module.content && (!module.chartType || module.chartType === 'none')" class="empty-module">
            <div class="empty-icon">📝</div>
            <p>该模块暂无内容</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 报告尾部 -->
    <div class="report-footer">
      <div class="footer-content">
        <p>报告生成时间：{{ formatDate(new Date().toISOString()) }}</p>
        <p>AI教师档案管理系统</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 报告数据
const reportData = ref({
  name: '',
  modules: [],
  createdAt: ''
})

// 模块类型映射
const moduleTypes = {
  'assets': '资产',
  'achievements': '成果奖励',
  'digital-literacy': '数字素养',
  'workload-stats': '工作量统计',
  'ethics': '师德师风',
  'student-data': '学生数据',
  'courseware-research': '课件教案研发数据',
  'teaching-experience': '教学经验数据'
}

// 图表类型映射
const chartTypes = {
  'bar': '柱状图',
  'line': '折线图',
  'pie': '饼图',
  'doughnut': '环形图',
  'radar': '雷达图'
}

// 图表图标映射
const chartIcons = {
  'bar': '📊',
  'line': '📈',
  'pie': '🥧',
  'doughnut': '🍩',
  'radar': '🕸️'
}

// 方法
const loadReportData = () => {
  const data = localStorage.getItem('previewReportData')
  if (data) {
    try {
      reportData.value = JSON.parse(data)
    } catch (error) {
      console.error('解析报告数据失败:', error)
      reportData.value = {
        name: '报告预览',
        modules: [],
        createdAt: new Date().toISOString()
      }
    }
  } else {
    // 如果没有数据，显示示例
    reportData.value = {
      name: '示例报告',
      modules: [
        {
          id: 'example1',
          name: '示例模块',
          type: 'workload-stats',
          icon: '📊',
          description: '这是一个示例模块',
          content: '这里显示模块的详细内容...',
          contentFormat: 'plain',
          chartType: 'bar',
          colorScheme: '经典蓝',
          showLegend: true,
          showLabels: true
        }
      ],
      createdAt: new Date().toISOString()
    }
  }
}

const getModuleTypeName = (typeId) => {
  return moduleTypes[typeId] || '未知类型'
}

const getChartTypeName = (chartType) => {
  return chartTypes[chartType] || chartType
}

const getChartIcon = (chartType) => {
  return chartIcons[chartType] || '📊'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const renderMarkdown = (text) => {
  // 简单的 Markdown 渲染
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

const printReport = () => {
  window.print()
}

const closePreview = () => {
  window.close()
}

// 组件挂载时加载数据
onMounted(() => {
  loadReportData()
})
</script>

<style scoped>
.report-preview {
  min-height: 100vh;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.report-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  flex: 1;
}

.report-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
}

.report-meta {
  display: flex;
  gap: 24px;
  color: #64748b;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.print-btn, .close-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.print-btn {
  background: #3b82f6;
  color: white;
}

.print-btn:hover {
  background: #2563eb;
}

.close-btn {
  background: #f1f5f9;
  color: #475569;
}

.close-btn:hover {
  background: #e2e8f0;
}

.report-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px;
}

.module-section {
  background: white;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.module-header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 24px;
}

.module-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-icon {
  font-size: 24px;
}

.module-title h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
}

.module-type {
  padding: 4px 8px;
  background: #e2e8f0;
  color: #64748b;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.module-body {
  padding: 24px;
}

.module-description {
  margin-bottom: 20px;
  padding: 16px;
  background: #f1f5f9;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.module-description p {
  margin: 0;
  color: #475569;
  font-style: italic;
}

.module-content {
  margin-bottom: 20px;
  line-height: 1.7;
  color: #374151;
}

.module-content :deep(strong) {
  font-weight: 600;
  color: #1a202c;
}

.module-content :deep(em) {
  font-style: italic;
}

.module-content :deep(code) {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  color: #e11d48;
}

.module-chart {
  margin-top: 20px;
}

.chart-container {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  background: #f8fafc;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.chart-icon {
  font-size: 48px;
  opacity: 0.6;
}

.chart-info h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.chart-info p {
  margin: 0 0 8px 0;
  color: #64748b;
  font-size: 14px;
}

.chart-options {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.chart-options span {
  padding: 4px 8px;
  background: #e2e8f0;
  color: #64748b;
  border-radius: 4px;
  font-size: 12px;
}

.empty-module {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.empty-module p {
  margin: 0;
  font-size: 14px;
}

.report-footer {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 24px 32px;
  text-align: center;
}

.footer-content {
  max-width: 1000px;
  margin: 0 auto;
  color: #64748b;
  font-size: 14px;
}

.footer-content p {
  margin: 4px 0;
}

/* 打印样式 */
@media print {
  .report-preview {
    background: white;
  }
  
  .report-header {
    box-shadow: none;
    border-bottom: 2px solid #000;
  }
  
  .header-actions {
    display: none;
  }
  
  .module-section {
    box-shadow: none;
    border: 1px solid #e2e8f0;
    page-break-inside: avoid;
  }
  
  .report-footer {
    border-top: 2px solid #000;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .report-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .report-content {
    padding: 16px;
  }
  
  .module-body {
    padding: 16px;
  }
  
  .chart-placeholder {
    gap: 12px;
  }
  
  .chart-icon {
    font-size: 32px;
  }
}
</style>
