<template>
  <div class="report-creation-modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- 模态框头部 -->
      <div class="modal-header">
        <h2>创建报告</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <!-- 模态框内容 -->
      <div class="modal-body">
        <!-- 基本信息表单 -->
        <div class="form-section">
          <div class="form-group">
            <input 
              type="text" 
              id="reportName" 
              v-model="reportForm.name" 
              placeholder="李启明的报告"
              class="form-input"
            />
          </div>
        </div>

        <!-- 模块编辑区域 -->
        <div class="modules-section">
          <div class="section-header">
            <h3>报告模块</h3>
            <button class="add-module-btn" @click="addNewModule" :disabled="!reportForm.name.trim()">
              + 添加模块
            </button>
          </div>

          <!-- 模块列表 -->
          <div v-if="reportModules.length > 0" class="modules-list">
            <div 
              v-for="(module, index) in reportModules" 
              :key="module.id"
              class="module-item"
            >
              <!-- 模块头部 - 包含模块类型选择和操作按钮 -->
              <div class="module-header">
                <div class="module-type-selector">
                  <select v-model="module.type" class="form-select" @change="onModuleTypeChange(module)">
                    <option value="">选择模块类型</option>
                    <option 
                      v-for="moduleType in availableModuleTypes" 
                      :key="moduleType.id"
                      :value="moduleType.id"
                    >
                      {{ moduleType.name }}
                    </option>
                  </select>
                </div>
                <div class="module-actions">
                  <button class="edit-btn" @click="editModule(index)" :class="{ active: editingModuleIndex === index }">
                    {{ editingModuleIndex === index ? '完成编辑' : '编辑' }}
                  </button>
                  <button class="remove-btn" @click="removeModule(index)">删除</button>
                </div>
              </div>

              <!-- 模块编辑区域 -->
              <div v-if="editingModuleIndex === index" class="module-edit-area">
                <div class="edit-form">

                  <!-- 图表设置和预览区域 -->
                  <div class="chart-configuration">
                    <!-- 左侧：图表预览和设置 -->
                    <div class="chart-left-panel">
                      <div class="chart-preview-section">
                        <label>图表预览区</label>
                        <div class="chart-preview-container">
                          <ReportModulePreview
                            :module-type="module.type"
                            :chart-type="module.chartType"
                            :color-scheme="module.colorScheme"
                            :show-legend="module.showLegend"
                            :show-labels="module.showLabels"
                          />
                        </div>
                        
                      </div>
                      

                    </div>
                    <div class="chart-settings">
                        <div class="setting-row">
                          <div class="setting-item">
                            <label>图表类型</label>
                            <select v-model="module.chartType" class="form-select">
                              <option value="none">无图表</option>
                              <option value="bar">柱状图</option>
                              <option value="line">折线图</option>
                              <option value="pie">饼图</option>
                              <option value="doughnut">环形图</option>
                              <option value="radar">雷达图</option>
                            </select>
                          </div>
                          <div class="setting-item">
                            <select v-model="module.colorScheme" class="form-select">
                              <option 
                                v-for="scheme in colorSchemes" 
                                :key="scheme.name"
                                :value="scheme.name"
                              >
                                {{ scheme.name }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="setting-row">
                          <div class="setting-item">
                            <label>
                              <input type="checkbox" v-model="module.showLegend" />
                              显示图例
                            </label>
                          </div>
                          <div class="setting-item">
                            <label>
                              <input type="checkbox" v-model="module.showLabels" />
                              显示标签
                            </label>
                          </div>
                        </div>
                      </div>
                    <!-- 右侧：总结说明 -->
                    <div class="chart-right-panel">
                      <div class="form-group">
                        <label>针对本模块数据的总结说明</label>
                        <textarea 
                          v-model="module.summary" 
                          placeholder="请输入针对本模块数据的总结说明"
                          class="form-textarea summary-textarea"
                          rows="8"
                        ></textarea>
                      </div>
                    </div>                    


                  </div>
                </div>
              </div>

              <!-- 模块预览 -->
              <div v-else class="module-preview">
                <div class="preview-header">
                  <span class="preview-name">{{ module.name || '未命名模块' }}</span>
                  <span class="preview-type">{{ getModuleTypeName(module.type) }}</span>
                </div>
                <div class="preview-content">
                  <p class="preview-description">{{ module.description || '暂无描述' }}</p>
                  <div v-if="module.chartType && module.chartType !== 'none'" class="preview-chart">
                    <div class="chart-preview-container">
                      <ReportModulePreview
                        :module-type="module.type"
                        :chart-type="module.chartType"
                        :color-scheme="module.colorScheme"
                        :show-legend="module.showLegend"
                        :show-labels="module.showLabels"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="empty-state">
            <div class="empty-icon">📝</div>
            <h4>还没有添加任何模块</h4>
            <p>点击"添加模块"按钮开始创建您的报告</p>
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal">取消</button>
        <button 
          class="preview-btn" 
          @click="previewReport" 
          :disabled="!canPreview"
        >
          预览报告
        </button>
        <button 
          class="save-btn" 
          @click="saveReport" 
          :disabled="!canSave"
        >
          保存报告
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import ReportModulePreview from './ReportModulePreview.vue'

// 定义可用的模块类型
const availableModuleTypes = [
  { id: 'assets', name: '资产' },
  { id: 'achievements', name: '成果奖励' },
  { id: 'digital-literacy', name: '数字素养' },
  { id: 'workload-stats', name: '工作量统计' },
  { id: 'ethics', name: '师德师风' },
  { id: 'student-data', name: '学生数据' },
  { id: 'courseware-research', name: '课件教案研发数据' },
  { id: 'teaching-experience', name: '教学经验数据' }
]

// 配色方案
const colorSchemes = [
  { name: '经典蓝', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '活力橙', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '自然绿', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '温暖黄', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: '优雅紫', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: '商务灰', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
]

// 表单数据
const reportForm = reactive({
  name: ''
})

// 报告模块列表
const reportModules = ref([])

// 当前编辑的模块索引
const editingModuleIndex = ref(-1)

// 计算属性
const canSave = computed(() => {
  return reportForm.name.trim() && reportModules.value.length > 0 && 
         reportModules.value.every(module => module.type)
})

const canPreview = computed(() => {
  return reportForm.name.trim() && reportModules.value.length > 0
})

// 方法
const addNewModule = () => {
  const newModule = {
    id: `module_${Date.now()}`,
    name: `模块${reportModules.value.length + 1}`,
    type: '',
    description: '',
    summary: '', // 添加总结说明字段
    chartType: 'bar', // 默认柱状图
    colorScheme: '经典蓝',
    showLegend: true,
    showLabels: true
  }
  
  reportModules.value.push(newModule)
  editingModuleIndex.value = reportModules.value.length - 1
}

const editModule = (index) => {
  if (editingModuleIndex.value === index) {
    // 完成编辑
    editingModuleIndex.value = -1
  } else {
    // 开始编辑
    editingModuleIndex.value = index
  }
}

const removeModule = (index) => {
  reportModules.value.splice(index, 1)
  if (editingModuleIndex.value === index) {
    editingModuleIndex.value = -1
  } else if (editingModuleIndex.value > index) {
    editingModuleIndex.value--
  }
}

const onModuleTypeChange = (module) => {
  // 当模块类型改变时，可以设置默认的图表类型
  if (module.type && !module.chartType) {
    module.chartType = 'bar'
  }
}

const getModuleTypeName = (typeId) => {
  const moduleType = availableModuleTypes.find(type => type.id === typeId)
  return moduleType ? moduleType.name : '未选择'
}

const getChartTypeName = (chartType) => {
  const chartTypes = {
    'bar': '柱状图',
    'line': '折线图',
    'pie': '饼图',
    'doughnut': '环形图',
    'radar': '雷达图'
  }
  return chartTypes[chartType] || chartType
}

const previewReport = () => {
  if (!canPreview.value) return
  
  const reportData = {
    name: reportForm.name,
    modules: reportModules.value,
    createdAt: new Date().toISOString()
  }
  
  // 将报告数据存储到 localStorage 供预览页面使用
  localStorage.setItem('previewReportData', JSON.stringify(reportData))
  
  // 在新标签页打开预览页面
  const previewUrl = '/report-preview'
  window.open(previewUrl, '_blank')
}

const saveReport = () => {
  if (!canSave.value) return
  
  const reportData = {
    name: reportForm.name,
    modules: reportModules.value,
    createdAt: new Date().toISOString()
  }
  
  console.log('保存报告:', reportData)
  // 这里应该调用API保存报告
  closeModal()
}

const closeModal = () => {
  // 重置表单
  reportForm.name = ''
  reportModules.value = []
  editingModuleIndex.value = -1
  // 触发关闭事件
  emit('close')
}

// 定义事件
const emit = defineEmits(['close'])
</script>

<style scoped>
.report-creation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* 更新模态框头部样式 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #1976d2 0%, #1890ff 100%);
  border-radius: 16px 16px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 500;
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  display: flex;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #8b5cf6;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modules-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.add-module-btn {
  padding: 10px 20px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-module-btn:hover:not(:disabled) {
  background: #7c3aed;
}

.add-module-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.module-item {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.module-item:hover {
  border-color: #d1d5db;
}

/* 更新模块头部样式 */
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.module-type-selector {
  flex: 1;
  margin-right: 16px;
  display: flex;
  align-items: center;
}

.module-type-selector .form-select {
  width: 100%;
  max-width: 200px;
}

.module-actions {
  display: flex;
  gap: 8px;
}

.edit-btn, .remove-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: #f3f4f6;
  color: #374151;
}

.edit-btn:hover {
  background: #e5e7eb;
}

.edit-btn.active {
  background: #8b5cf6;
  color: white;
}

.remove-btn {
  background: #fef2f2;
  color: #dc2626;
}

.remove-btn:hover {
  background: #fee2e2;
}

.module-edit-area {
  padding: 20px;
  background: white;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 新增图表配置区域样式 */
.chart-configuration {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 24px;
  margin-top: 20px;
}

.chart-left-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-right-panel {
  display: grid;
  grid-column: 1/span 2;
  flex-direction: column;
}

.chart-preview-section {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.chart-preview-section label {
  display: block;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  display: flex;
}

.chart-preview-container {
  width: 100%;
  height: 200px;
  border-radius: 6px;
  overflow: hidden;
  background: white;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.setting-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.summary-textarea {
  height: 200px;
  resize: vertical;
}

.module-preview {
  padding: 20px;
  background: white;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.preview-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.preview-type {
  padding: 2px 6px;
  background: #e5e7eb;
  color: #6b7280;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.preview-content {
  color: #6b7280;
  line-height: 1.6;
}

.preview-description {
  margin: 0 0 12px 0;
  font-style: italic;
}

.preview-chart {
  margin-top: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 32px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.cancel-btn, .preview-btn, .save-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.preview-btn {
  background: #10b981;
  color: white;
}

.preview-btn:hover:not(:disabled) {
  background: #059669;
}

.preview-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.save-btn {
  background: #8b5cf6;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #7c3aed;
}

.save-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    margin: 10px;
    max-height: 95vh;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .setting-row {
    grid-template-columns: 1fr;
  }
  
  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .module-type-selector {
    width: 100%;
    margin-right: 0;
  }
  
  .module-type-selector .form-select {
    max-width: none;
  }
  
  .module-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .chart-configuration {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
