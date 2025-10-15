<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">添加教育经历</h3>
        <button class="close-btn" @click="closeModal">
          <span class="close-icon">×</span>
        </button>
      </div>
      
      <div class="modal-body">
        <!-- 文件上传区域 -->
        <div class="upload-section">
          <div class="upload-area" 
               :class="{ 'drag-over': isDragOver, 'ai-processing': isAIRecognizing }"
               @drop="handleFileDrop"
               @dragover="handleDragOver"
               @dragleave="handleDragLeave"
               @click="triggerFileInput">
            <input 
              ref="fileInput" 
              type="file" 
              accept=".jpg,.jpeg,.png,.pdf"
              @change="handleFileSelect"
              style="display: none"
            >
            <div class="upload-content">
              <div class="upload-icon">
                <span v-if="!isAIRecognizing">📄</span>
                <div v-else class="ai-loading-icon">🤖</div>
              </div>
              <div class="upload-text">
                {{ isAIRecognizing ? 'AI正在智能识别中...' : '请上传您的毕业证书或学位证书' }}
              </div>
              <div class="upload-hint">格式支持jpg、png、PDF</div>
              <div v-if="!isAIRecognizing" class="upload-btn">点击上传</div>
              <div v-else class="ai-progress">
                <div class="progress-bar">
                  <div class="progress-fill"></div>
                </div>
                <div class="ai-tips">AI正在分析您的证书信息...</div>
              </div>
            </div>
          </div>
          
          <!-- 文件预览 -->
          <div v-if="selectedFile" class="file-preview">
            <div class="file-info">
              <span class="file-name">{{ selectedFile.name }}</span>
              <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
              <button class="remove-file" @click="removeFile">×</button>
            </div>
          </div>

          <!-- AI识别结果 -->
          <div v-if="aiRecognitionResult" class="ai-result-panel">
            <div class="ai-result-header">
              <div class="ai-icon">🤖</div>
              <div class="ai-title">AI智能识别结果</div>
              <div class="confidence-score">
                置信度: {{ (aiRecognitionResult.confidence * 100).toFixed(1) }}%
              </div>
            </div>
            <div class="ai-result-content">
              <div class="result-item">
                <label>学校:</label>
                <span>{{ aiRecognitionResult.school }}</span>
              </div>
              <div class="result-item">
                <label>专业:</label>
                <span>{{ aiRecognitionResult.major }}</span>
              </div>
              <div class="result-item">
                <label>学历:</label>
                <span>{{ aiRecognitionResult.degree }}</span>
              </div>
              <div class="result-item">
                <label>时间:</label>
                <span>{{ aiRecognitionResult.startDate }} 至 {{ aiRecognitionResult.endDate }}</span>
              </div>
            </div>
            <div class="ai-result-actions">
              <button class="btn-apply" @click="applyAIResult">
                <span class="btn-icon">✓</span>
                应用结果
              </button>
              <button class="btn-reject" @click="rejectAIResult">
                <span class="btn-icon">×</span>
                重新填写
              </button>
            </div>
          </div>
        </div>

        <!-- 表单区域 -->
        <div class="form-section">
          <!-- 学校选择 -->
          <div class="form-group">
            <label class="form-label">学校名称 *</label>
            <div class="autocomplete-container">
              <input 
                v-model="formData.school"
                @input="handleSchoolInput"
                @focus="showSchoolOptions = true"
                class="form-input"
                placeholder="请输入学校名称"
                type="text"
              >
              <div v-if="showSchoolOptions && filteredSchools.length > 0" class="autocomplete-dropdown">
                <div 
                  v-for="school in filteredSchools" 
                  :key="school"
                  class="autocomplete-item"
                  @click="selectSchool(school)"
                >
                  {{ school }}
                </div>
              </div>
            </div>
          </div>

          <!-- 专业名称 -->
          <div class="form-group">
            <label class="form-label">专业名称 *</label>
            <input 
              v-model="formData.major"
              class="form-input"
              placeholder="请输入专业名称"
              type="text"
            >
          </div>

          <!-- 学历选择 -->
          <div class="form-group">
            <label class="form-label">学历 *</label>
            <select v-model="formData.degree" class="form-select">
              <option value="">请选择学历</option>
              <option value="专科">专科</option>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
              <option value="博士后">博士后</option>
            </select>
          </div>

          <!-- 时间选择 -->
          <div class="form-group">
            <label class="form-label">入学时间 *</label>
            <input 
              v-model="formData.startDate"
              class="form-input"
              type="date"
            >
          </div>

          <div class="form-group">
            <label class="form-label">毕业时间 *</label>
            <input 
              v-model="formData.endDate"
              class="form-input"
              type="date"
            >
          </div>
        </div>
      </div>

      <!-- 模态框底部 -->
      <div class="modal-footer">
        <button class="btn btn-cancel" @click="closeModal">取消</button>
        <button 
          class="btn btn-submit" 
          :disabled="!isFormValid || isAIRecognizing"
          @click="handleSubmit"
        >
          {{ isAIRecognizing ? '识别中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props & Emits
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])

// 表单数据
const formData = ref({
  school: '',
  major: '',
  degree: '',
  startDate: '',
  endDate: ''
})

// 文件上传相关
const fileInput = ref(null)
const selectedFile = ref(null)
const isDragOver = ref(false)

// AI识别相关
const isAIRecognizing = ref(false)
const aiRecognitionResult = ref(null)
const aiRecognitionStatus = ref('') // 'processing', 'success', 'error'

// 学校选择相关
const showSchoolOptions = ref(false)

// 全国高校数据（这里只列出一部分，实际项目中应该从API获取）
const universities = ref([
  '北京大学', '清华大学', '中国人民大学', '北京师范大学', '北京理工大学',
  '北京航空航天大学', '北京科技大学', '北京化工大学', '北京邮电大学',
  '中国农业大学', '北京林业大学', '首都医科大学', '北京中医药大学',
  '首都师范大学', '首都经济贸易大学', '北京外国语大学', '中国传媒大学',
  '中央财经大学', '对外经济贸易大学', '北京体育大学', '中央音乐学院',
  '中央美术学院', '中央戏剧学院', '中国政法大学', '华北电力大学',
  '复旦大学', '上海交通大学', '同济大学', '华东师范大学', '上海财经大学',
  '华东理工大学', '东华大学', '上海外国语大学', '上海大学', '上海理工大学'
])

// 过滤后的学校列表
const filteredSchools = computed(() => {
  if (!formData.value.school) return []
  return universities.value.filter(school => 
    school.toLowerCase().includes(formData.value.school.toLowerCase())
  ).slice(0, 10) // 限制显示数量
})

// 表单验证
const isFormValid = computed(() => {
  return formData.value.school && 
         formData.value.major && 
         formData.value.degree && 
         formData.value.startDate && 
         formData.value.endDate
})

// 文件上传处理
const triggerFileInput = () => {
  if (!isAIRecognizing.value) {
    fileInput.value?.click()
  }
}

const handleFileSelect = async (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    // 启动AI识别
    await performAIRecognition(file)
  }
}

const handleFileDrop = async (event) => {
  event.preventDefault()
  isDragOver.value = false
  
  if (isAIRecognizing.value) return
  
  const file = event.dataTransfer.files[0]
  if (file && (file.type.includes('image') || file.type === 'application/pdf')) {
    selectedFile.value = file
    // 启动AI识别
    await performAIRecognition(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  if (!isAIRecognizing.value) {
    isDragOver.value = true
  }
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const removeFile = () => {
  selectedFile.value = null
  aiRecognitionResult.value = null
  aiRecognitionStatus.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// AI识别功能
const performAIRecognition = async (file) => {
  try {
    isAIRecognizing.value = true
    aiRecognitionStatus.value = 'processing'
    aiRecognitionResult.value = null
    
    // 模拟AI识别过程（实际项目中应该调用真实的AI API）
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 模拟AI识别结果
    const mockResults = [
      {
        school: '北京理工大学',
        major: '计算机科学与技术',
        degree: '本科',
        startDate: '2018-09',
        endDate: '2022-07',
        confidence: 0.95
      },
      {
        school: '清华大学',
        major: '软件工程',
        degree: '硕士',
        startDate: '2020-09',
        endDate: '2023-07',
        confidence: 0.88
      },
      {
        school: '北京大学',
        major: '人工智能',
        degree: '博士',
        startDate: '2019-09',
        endDate: '2024-07',
        confidence: 0.92
      }
    ]
    
    // 随机选择一个结果
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
    
    aiRecognitionResult.value = randomResult
    aiRecognitionStatus.value = 'success'
    
    console.log('AI识别结果:', randomResult)
    
  } catch (error) {
    aiRecognitionStatus.value = 'error'
    console.error('AI识别失败:', error)
  } finally {
    isAIRecognizing.value = false
  }
}

// 应用AI识别结果
const applyAIResult = () => {
  if (aiRecognitionResult.value) {
    formData.value.school = aiRecognitionResult.value.school
    formData.value.major = aiRecognitionResult.value.major
    formData.value.degree = aiRecognitionResult.value.degree
    formData.value.startDate = aiRecognitionResult.value.startDate
    formData.value.endDate = aiRecognitionResult.value.endDate
    
    // 清除AI识别结果
    aiRecognitionResult.value = null
    aiRecognitionStatus.value = ''
  }
}

// 拒绝AI识别结果
const rejectAIResult = () => {
  aiRecognitionResult.value = null
  aiRecognitionStatus.value = ''
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 学校选择相关
const handleSchoolInput = () => {
  showSchoolOptions.value = true
}

const selectSchool = (school) => {
  formData.value.school = school
  showSchoolOptions.value = false
}

// 模态框控制
const closeModal = () => {
  emit('close')
}

const handleOverlayClick = () => {
  closeModal()
}

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', formData.value)
  }
}

// 监听点击外部隐藏下拉框
const handleClickOutside = (event) => {
  if (!event.target.closest('.autocomplete-container')) {
    showSchoolOptions.value = false
  }
}

// 组件挂载时添加全局点击监听
watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleClickOutside)
    // 重置表单
    formData.value = {
      school: '',
      major: '',
      degree: '',
      startDate: '',
      endDate: ''
    }
    selectedFile.value = null
    aiRecognitionResult.value = null
    aiRecognitionStatus.value = ''
    isDragOver.value = false
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #111827;
}

.modal-body {
  padding: 32px;
  max-height: 60vh;
  overflow-y: auto;
}

.upload-section {
  margin-bottom: 32px;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.upload-area:hover {
  border-color: #8b5cf6;
  background: #f3f4f6;
}

.upload-area.drag-over {
  border-color: #8b5cf6;
  background: #ede9fe;
}

.upload-area.ai-processing {
  border-color: #10b981;
  background: #ecfdf5;
  cursor: default;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  font-size: 48px;
  color: #6b7280;
}

.ai-loading-icon {
  font-size: 48px;
  animation: aiPulse 2s infinite;
}

@keyframes aiPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.upload-text {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.upload-hint {
  font-size: 14px;
  color: #6b7280;
}

.upload-btn {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.upload-btn:hover {
  background: #7c3aed;
}

.ai-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  animation: progressMove 2s infinite;
}

@keyframes progressMove {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

.ai-tips {
  font-size: 14px;
  color: #10b981;
  font-weight: 500;
}

.file-preview {
  margin-top: 16px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-name {
  font-weight: 500;
  color: #374151;
  flex: 1;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
}

.remove-file {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
}

.remove-file:hover {
  background: #dc2626;
}

/* AI识别结果面板 */
.ai-result-panel {
  margin-top: 20px;
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 2px solid #0ea5e9;
  border-radius: 12px;
  padding: 20px;
  animation: slideInUp 0.5s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-result-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.ai-icon {
  font-size: 24px;
  animation: aiRotate 3s infinite linear;
}

@keyframes aiRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-title {
  font-size: 16px;
  font-weight: 600;
  color: #0369a1;
  flex: 1;
}

.confidence-score {
  background: #22c55e;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.ai-result-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-item label {
  font-weight: 600;
  color: #374151;
  min-width: 60px;
}

.result-item span {
  color: #1f2937;
  background: white;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  flex: 1;
}

.ai-result-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-apply {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-apply:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.btn-reject {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-reject:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-icon {
  font-size: 12px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-input, .form-select {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.autocomplete-container {
  position: relative;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.autocomplete-item {
  padding: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.autocomplete-item:hover {
  background: #f3f4f6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 32px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  background: #8b5cf6;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #7c3aed;
}

.btn-submit:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 20px;
  }
  
  .ai-result-content {
    grid-template-columns: 1fr;
  }
  
  .ai-result-actions {
    flex-direction: column;
  }
}
</style>
