<template>
  <div class="ability-certifications-container">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-tabs">
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'all' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="all" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">全部</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'academic' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="academic" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">学科类竞赛</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'vocational' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="vocational" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">职业技能大赛</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'innovation' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="innovation" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">创新创业竞赛</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'arts' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="arts" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">文艺艺术类竞赛</span>
          </label>
        </div>
        
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索竞赛名称或奖项..."
            class="search-input"
          >
          <i class="search-icon">🔍</i>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="section-header">
        <h2>竞赛获奖：{{ filteredCertifications.length }}</h2>
        <div class="view-toggle">
          <el-button-group>
            <el-button 
              :type="viewMode === 'list' ? 'primary' : ''" 
              @click="viewMode = 'list'"
              size="small"
            >
              列表视图
            </el-button>
            <el-button 
              :type="viewMode === 'card' ? 'primary' : ''" 
              @click="viewMode = 'card'"
              size="small"
            >
              卡片视图
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 数据列表/卡片 -->
      <div class="content-area">
        <!-- 列表视图 -->
        <div v-if="viewMode === 'list'" class="list-view">
          <div class="table-header">
            <div class="col-name">竞赛名称</div>
            <div class="col-type">竞赛类型</div>
            <div class="col-scale">竞赛规模</div>
            <div class="col-time">竞赛时间</div>
            <div class="col-award">获得奖项</div>
            <div class="col-cert">证书详情</div>
            <div class="col-docs">附件资料</div>
            <div class="col-upload">上传</div>
            <div class="col-action">操作</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="cert in filteredCertifications" 
              :key="cert.id" 
              class="table-row"
            >
              <div class="col-name">{{ cert.name }}</div>
              <div class="col-type">
                <span 
                  class="type-badge" 
                  :class="getTypeBadgeClass(cert.type)"
                >
                  {{ getCompetitionTypeName(cert.type) }}
                </span>
              </div>
              <div class="col-scale">
                <span 
                  class="scale-badge" 
                  :class="getScaleBadgeClass(cert.scale)"
                >
                  {{ getCompetitionScaleName(cert.scale) }}
                </span>
              </div>
              <div class="col-time">{{ cert.competitionDate }}</div>
              <div class="col-award">
                <span 
                  class="award-badge" 
                  :class="getAwardBadgeClass(cert.award)"
                >
                  {{ cert.award }}
                </span>
              </div>
              <div class="col-cert">
                <button 
                  class="details-btn-small" 
                  @click="viewCertification(cert)"
                >
                  证书详情
                </button>
              </div>
              <div class="col-docs">
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in cert.documents" 
                    :key="index"
                    class="doc-item"
                    @click="viewDocument(doc)"
                  >
                    📄 {{ doc.name }}
                  </span>
                </div>
              </div>
              <div class="col-upload">
                <button 
                  class="upload-btn-small" 
                  @click="uploadDocument(cert)"
                >
                  上传
                </button>
              </div>
              <div class="col-action">
                <button 
                  class="view-btn-small" 
                  @click="viewCertification(cert)"
                >
                  查看
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片视图 -->
        <div v-if="viewMode === 'card'" class="card-view">
          <div 
            v-for="cert in filteredCertifications" 
            :key="cert.id" 
            class="competition-card"
          >
            <div class="card-header">
              <h3 class="competition-name">{{ cert.name }}</h3>
              <span 
                class="award-badge" 
                :class="getAwardBadgeClass(cert.award)"
              >
                {{ cert.award }}
              </span>
            </div>
            
            <div class="card-content">
              <div class="info-row">
                <span class="label">竞赛类型：</span>
                <span class="value">
                  <span 
                    class="type-badge" 
                    :class="getTypeBadgeClass(cert.type)"
                  >
                    {{ getCompetitionTypeName(cert.type) }}
                  </span>
                </span>
              </div>
              <div class="info-row">
                <span class="label">竞赛规模：</span>
                <span class="value">
                  <span 
                    class="scale-badge" 
                    :class="getScaleBadgeClass(cert.scale)"
                  >
                    {{ getCompetitionScaleName(cert.scale) }}
                  </span>
                </span>
              </div>
              <div class="info-row">
                <span class="label">竞赛时间：</span>
                <span class="value">{{ cert.competitionDate }}</span>
              </div>
              <div class="info-row">
                <span class="label">主办单位：</span>
                <span class="value">{{ cert.organization }}</span>
              </div>
              <div class="info-row">
                <span class="label">附件资料：</span>
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in cert.documents" 
                    :key="index"
                    class="doc-item"
                    @click="viewDocument(doc)"
                  >
                    📄 {{ doc.name }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <button 
                class="upload-btn-primary" 
                @click="uploadDocument(cert)"
              >
                上传资料
              </button>
              <button 
                class="details-btn-primary" 
                @click="viewCertification(cert)"
              >
                证书详情
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredCertifications.length === 0" class="empty-state">
          <div class="empty-icon">🏆</div>
          <h3>暂无竞赛获奖记录</h3>
          <p>您还没有添加任何竞赛获奖信息</p>
        </div>
      </div>
    </div>

    <!-- 证书详情弹窗 -->
    <div v-if="showCertificationModal" class="modal-overlay" @click="closeCertificationModal">
      <div class="modal-content details-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedCertification?.name }} - 证书详情</h3>
          <button class="close-btn" @click="closeCertificationModal">×</button>
        </div>
        <div class="modal-body details-content">
          <div class="details-section">
            <h4>竞赛基本信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">竞赛名称：</span>
                <span class="value">{{ selectedCertification?.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">竞赛类型：</span>
                <span class="value">
                  <span 
                    class="type-badge" 
                    :class="getTypeBadgeClass(selectedCertification?.type)"
                  >
                    {{ getCompetitionTypeName(selectedCertification?.type) }}
                  </span>
                </span>
              </div>
              <div class="info-item">
                <span class="label">竞赛规模：</span>
                <span class="value">
                  <span 
                    class="scale-badge" 
                    :class="getScaleBadgeClass(selectedCertification?.scale)"
                  >
                    {{ getCompetitionScaleName(selectedCertification?.scale) }}
                  </span>
                </span>
              </div>
              <div class="info-item">
                <span class="label">竞赛时间：</span>
                <span class="value">{{ selectedCertification?.competitionDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">主办单位：</span>
                <span class="value">{{ selectedCertification?.organization }}</span>
              </div>
            </div>
          </div>
          
          <div class="details-section">
            <h4>获奖信息</h4>
            <div class="award-info">
              <div class="award-display">
                <span class="award-badge-large" :class="getAwardBadgeClass(selectedCertification?.award)">
                  {{ selectedCertification?.award }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="details-section">
            <h4>证书图片</h4>
            <div class="certificate-image">
              <img 
                :src="selectedCertification?.image" 
                :alt="selectedCertification?.name + '证书'"
                @error="handleImageError"
              >
            </div>
          </div>
          
          <div class="details-section">
            <h4>附件资料</h4>
            <div class="docs-list">
              <span 
                v-for="(doc, index) in selectedCertification?.documents" 
                :key="index"
                class="doc-item"
                @click="viewDocument(doc)"
              >
                📄 {{ doc.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文档查看弹窗 -->
    <div v-if="showDocumentModal" class="modal-overlay" @click="closeDocumentModal">
      <div class="modal-content document-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDocument?.name }}</h3>
          <button class="close-btn" @click="closeDocumentModal">×</button>
        </div>
        <div class="modal-body">
          <div class="document-viewer">
            <div class="document-info">
              <p><strong>文件名：</strong>{{ selectedDocument?.name }}</p>
              <p><strong>文件大小：</strong>{{ selectedDocument?.size }}</p>
              <p><strong>上传时间：</strong>{{ selectedDocument?.uploadTime }}</p>
            </div>
            <div class="document-preview">
              <div class="preview-placeholder">
                <div class="preview-icon">📄</div>
                <p>{{ selectedDocument?.name }}</p>
                <button class="download-btn" @click="downloadDocument(selectedDocument)">
                  下载文档
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传弹窗 -->
    <div v-if="showUploadModal" class="modal-overlay" @click="closeUploadModal">
      <div class="modal-content upload-modal" @click.stop>
        <div class="modal-header">
          <h3>上传附件资料</h3>
          <button class="close-btn" @click="closeUploadModal">×</button>
        </div>
        <div class="modal-body">
          <div class="upload-area">
            <div class="upload-zone" @click="triggerFileInput">
              <div class="upload-icon">📁</div>
              <p>点击选择文件或拖拽文件到此处</p>
              <p class="upload-hint">支持 PDF、DOC、DOCX、JPG、PNG 格式</p>
            </div>
            <input 
              ref="fileInput" 
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              @change="handleFileSelect"
              style="display: none"
            >
          </div>
          <div class="uploaded-files" v-if="selectedFiles.length > 0">
            <h4>已选择文件：</h4>
            <div class="file-list">
              <div 
                v-for="(file, index) in selectedFiles" 
                :key="index"
                class="file-item"
              >
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <button class="remove-file-btn" @click="removeFile(index)">×</button>
              </div>
            </div>
          </div>
          <div class="upload-actions">
            <button class="cancel-btn" @click="closeUploadModal">取消</button>
            <button class="confirm-btn" @click="confirmUpload" :disabled="selectedFiles.length === 0">
              确认上传
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const selectedFilter = ref('all')
const searchKeyword = ref('')
const viewMode = ref('list')
const showCertificationModal = ref(false)
const showDocumentModal = ref(false)
const showUploadModal = ref(false)
const selectedCertification = ref(null)
const selectedDocument = ref(null)
const selectedFiles = ref([])
const fileInput = ref(null)

// 竞赛类型映射
const competitionTypeMap = {
  'academic': '学科类竞赛',
  'vocational': '职业技能大赛',
  'innovation': '创新创业竞赛',
  'arts': '文艺艺术类竞赛'
}

// 竞赛规模映射
const competitionScaleMap = {
  'international': '国际赛',
  'national': '国赛',
  'provincial': '省赛',
  'world': '世赛',
  'campus': '校内竞赛'
}

// 模拟竞赛获奖数据
const certifications = ref([
  {
    id: 1,
    name: '全国大学生数学建模竞赛',
    type: 'academic',
    scale: 'national',
    competitionDate: '2024-09-15',
    award: '一等奖',
    organization: '中国工业与应用数学学会',
    image: '/pic/data.png',
    documents: [
      { name: '获奖证书.pdf', size: '1.2MB', uploadTime: '2024-09-20' },
      { name: '竞赛作品.pdf', size: '2.1MB', uploadTime: '2024-09-18' }
    ]
  },
  {
    id: 2,
    name: '全国职业院校技能大赛',
    type: 'vocational',
    scale: 'national',
    competitionDate: '2024-06-10',
    award: '二等奖',
    organization: '教育部',
    image: '/pic/data.png',
    documents: [
      { name: '技能大赛证书.pdf', size: '1.5MB', uploadTime: '2024-06-12' },
      { name: '技能展示视频.mp4', size: '15.2MB', uploadTime: '2024-06-15' }
    ]
  },
  {
    id: 3,
    name: '中国国际"互联网+"大学生创新创业大赛',
    type: 'innovation',
    scale: 'national',
    competitionDate: '2024-10-20',
    award: '金奖',
    organization: '教育部',
    image: '/pic/data.png',
    documents: [
      { name: '金奖证书.pdf', size: '1.8MB', uploadTime: '2024-10-25' },
      { name: '商业计划书.pdf', size: '3.2MB', uploadTime: '2024-10-18' },
      { name: '路演PPT.pdf', size: '2.5MB', uploadTime: '2024-10-22' }
    ]
  },
  {
    id: 4,
    name: '全国大学生艺术展演',
    type: 'arts',
    scale: 'national',
    competitionDate: '2024-05-08',
    award: '特等奖',
    organization: '教育部',
    image: '/pic/national-data.png',
    documents: [
      { name: '特等奖证书.pdf', size: '2.3MB', uploadTime: '2024-05-10' },
      { name: '作品集.pdf', size: '4.1MB', uploadTime: '2024-05-12' },
      { name: '演出视频.mp4', size: '28.5MB', uploadTime: '2024-05-15' }
    ]
  },
  {
    id: 5,
    name: 'ACM国际大学生程序设计竞赛',
    type: 'academic',
    scale: 'international',
    competitionDate: '2024-11-15',
    award: '铜奖',
    organization: 'ACM',
    image: '/pic/data.png',
    documents: [
      { name: 'ACM证书.pdf', size: '945KB', uploadTime: '2024-11-18' },
      { name: '解题报告.pdf', size: '1.8MB', uploadTime: '2024-11-20' }
    ]
  },
  {
    id: 6,
    name: '世界技能大赛',
    type: 'vocational',
    scale: 'world',
    competitionDate: '2024-08-25',
    award: '优胜奖',
    organization: '世界技能组织',
    image: '/pic/data.png',
    documents: [
      { name: '世赛证书.pdf', size: '1.6MB', uploadTime: '2024-08-28' },
      { name: '技能展示.pdf', size: '2.8MB', uploadTime: '2024-08-30' }
    ]
  }
])

// 计算属性 - 过滤后的认证列表
const filteredCertifications = computed(() => {
  let filtered = certifications.value

  // 按类型筛选
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(cert => cert.type === selectedFilter.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(cert => 
      cert.name.toLowerCase().includes(keyword) ||
      cert.award.toLowerCase().includes(keyword) ||
      cert.organization.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 方法
const getCompetitionTypeName = (type) => {
  return competitionTypeMap[type] || '未知类型'
}

const getCompetitionScaleName = (scale) => {
  return competitionScaleMap[scale] || '未知规模'
}

const getTypeBadgeClass = (type) => {
  const typeClassMap = {
    'academic': 'type-academic',
    'vocational': 'type-vocational',
    'innovation': 'type-innovation',
    'arts': 'type-arts'
  }
  return typeClassMap[type] || 'type-unknown'
}

const getScaleBadgeClass = (scale) => {
  const scaleClassMap = {
    'international': 'scale-international',
    'national': 'scale-national',
    'provincial': 'scale-provincial',
    'world': 'scale-world',
    'campus': 'scale-campus'
  }
  return scaleClassMap[scale] || 'scale-unknown'
}

const getAwardBadgeClass = (award) => {
  if (award.includes('特等奖') || award.includes('金奖')) {
    return 'award-special'
  } else if (award.includes('一等奖') || award.includes('银奖')) {
    return 'award-first'
  } else if (award.includes('二等奖') || award.includes('铜奖')) {
    return 'award-second'
  } else if (award.includes('三等奖') || award.includes('优胜奖')) {
    return 'award-third'
  }
  return 'award-other'
}

const viewCertification = (cert) => {
  selectedCertification.value = cert
  showCertificationModal.value = true
}

const closeCertificationModal = () => {
  showCertificationModal.value = false
  selectedCertification.value = null
}

const viewDocument = (doc) => {
  selectedDocument.value = doc
  showDocumentModal.value = true
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  selectedDocument.value = null
}

const uploadDocument = (cert) => {
  selectedCertification.value = cert
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFiles.value = []
  selectedCertification.value = null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const confirmUpload = () => {
  // 这里可以添加上传逻辑
  console.log('上传文件:', selectedFiles.value)
  alert('文件上传成功！')
  closeUploadModal()
}

const downloadDocument = (doc) => {
  // 这里可以添加下载逻辑
  console.log('下载文档:', doc.name)
  alert(`正在下载 ${doc.name}`)
}

const handleImageError = (event) => {
  event.target.src = '/pic/data.png'
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.ability-certifications-container {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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

/* 内容区域 */
.content-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e6f1;
  background: #f8f9ff;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.view-toggle {
  display: flex;
  gap: 4px;
}

/* 列表视图 */
.list-view {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 1fr 1.2fr 1fr 2fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.table-body {
  min-height: 200px;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1.2fr 1fr 1fr 1.2fr 1fr 2fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: #f8fafc;
}

.col-name {
  font-weight: 500;
  color: #1f2937;
}

.col-number {
  color: #6b7280;
  font-family: monospace;
  font-size: 13px;
}

.col-org {
  color: #4b5563;
}

.col-type {
  color: #4b5563;
  font-size: 13px;
}

.col-cert,
.col-valid {
  color: #6b7280;
  font-size: 13px;
}

/* 文档列表样式 */
.docs-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-item {
  display: inline-block;
  padding: 2px 6px;
  background: #e0f2fe;
  color: #0277bd;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-right: 4px;
  margin-bottom: 2px;
}

.doc-item:hover {
  background: #b3e5fc;
}

/* 按钮样式 */
.upload-btn-small {
  padding: 4px 8px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.upload-btn-small:hover {
  background: #059669;
}

.upload-btn-primary {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  margin-right: 8px;
}

.upload-btn-primary:hover {
  background: #059669;
}

/* 竞赛类型标签样式 */
.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.type-academic {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.type-vocational {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.type-innovation {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.type-arts {
  background: #f3e8ff;
  color: #7c3aed;
  border: 1px solid #e9d5ff;
}

.type-unknown {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

/* 竞赛规模标签样式 */
.scale-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-width: 60px;
}

.scale-international {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.scale-national {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
}

.scale-provincial {
  background: #dbeafe;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.scale-world {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #bbf7d0;
}

.scale-campus {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.scale-unknown {
  background: #f9fafb;
  color: #9ca3af;
  border: 1px solid #e5e7eb;
}

/* 获奖等级标签样式 */
.award-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  min-width: 60px;
}

.award-special {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #92400e;
  border: 1px solid #f59e0b;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.award-first {
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
  color: #374151;
  border: 1px solid #9ca3af;
  box-shadow: 0 2px 4px rgba(156, 163, 175, 0.3);
}

.award-second {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: #92400e;
  border: 1px solid #f59e0b;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.award-third {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #92400e;
  border: 1px solid #d97706;
  box-shadow: 0 2px 4px rgba(217, 119, 6, 0.3);
}

.award-other {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.award-badge-large {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  min-width: 120px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-valid {
  background: #dcfce7;
  color: #166534;
}

.status-expired {
  background: #fee2e2;
  color: #dc2626;
}

.view-btn-small {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.view-btn-small:hover {
  background: #2563eb;
}

/* 详情按钮样式 */
.details-btn-small {
  padding: 4px 8px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.details-btn-small:hover {
  background: #7c3aed;
}

.details-btn-primary {
  padding: 8px 16px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.details-btn-primary:hover {
  background: #7c3aed;
}

/* 竞赛卡片样式 */
.competition-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.competition-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.competition-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

/* 详情弹窗样式 */
.details-modal {
  max-width: 700px;
}

.details-content {
  max-height: 60vh;
  overflow-y: auto;
}

.details-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.details-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.award-info {
  text-align: center;
  padding: 20px;
}

.award-display {
  display: flex;
  justify-content: center;
  align-items: center;
}

.certificate-image {
  text-align: center;
  margin-top: 16px;
}

.certificate-image img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 卡片视图 */
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 24px;
}

.certification-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.certification-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.cert-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 12px;
}

.card-content {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.label {
  color: #6b7280;
  min-width: 80px;
  margin-right: 8px;
}

.value {
  color: #374151;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-btn-primary {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.view-btn-primary:hover {
  background: #2563eb;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #374151;
}

.empty-state p {
  font-size: 14px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.document-modal {
  max-width: 600px;
}

.upload-modal {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.certification-image {
  text-align: center;
  margin-bottom: 20px;
}

.certification-image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.certification-info {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.info-item .label {
  font-weight: 500;
  color: #374151;
  min-width: 100px;
}

.info-item .value {
  color: #1f2937;
}

/* 文档查看器样式 */
.document-viewer {
  text-align: center;
}

.document-info {
  text-align: left;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.document-info p {
  margin: 8px 0;
  color: #374151;
}

.document-preview {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  background: #f9fafb;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.preview-icon {
  font-size: 48px;
}

.download-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.download-btn:hover {
  background: #2563eb;
}

/* 文件上传区域样式 */
.upload-area {
  margin-bottom: 20px;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: #f9fafb;
}

.upload-zone:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-hint {
  color: #6b7280;
  font-size: 12px;
  margin-top: 8px;
}

.uploaded-files {
  margin-bottom: 20px;
}

.uploaded-files h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.file-name {
  flex: 1;
  color: #374151;
  font-size: 14px;
}

.file-size {
  color: #6b7280;
  font-size: 12px;
  margin-right: 8px;
}

.remove-file-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  background: #dc2626;
}

.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-btn {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.confirm-btn:hover:not(:disabled) {
  background: #059669;
}

.confirm-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ability-certifications-container {
    padding: 16px;
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
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .view-toggle {
    justify-content: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-header {
    display: none;
  }
  
  .table-row {
    display: block;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  .col-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .col-number,
  .col-org,
  .col-type,
  .col-cert,
  .col-valid {
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .col-status {
    margin-bottom: 8px;
  }
  
  .col-docs {
    margin-bottom: 8px;
  }
  
  .col-upload,
  .col-action {
    margin-bottom: 12px;
  }
  
  .card-view {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .card-footer {
    flex-direction: column;
    gap: 8px;
  }
  
  .modal-content {
    margin: 20px;
    max-width: calc(100vw - 40px);
  }
}
</style>
