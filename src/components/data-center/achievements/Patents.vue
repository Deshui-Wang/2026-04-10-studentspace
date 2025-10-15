<template>
  <div class="patents-container">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索专利名称、专利号或申请人..."
            class="search-input"
          >
          <i class="search-icon">🔍</i>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="section-header">
        <h2>专利：{{ filteredPatents.length }}</h2>
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
            <div class="col-patent-number">专利号</div>
            <div class="col-application-number">申请号</div>
            <div class="col-name">专利名称</div>
            <div class="col-field">技术领域</div>
            <div class="col-patentee">专利权人</div>
            <div class="col-applicant">申请人</div>
            <div class="col-inventor">发明/设计人</div>
            <div class="col-status">状态</div>
            <div class="col-protection">保护期限</div>
            <div class="col-agent">代理信息</div>
            <div class="col-docs">资料附件</div>
            <div class="col-upload">上传</div>
            <div class="col-action">操作</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="patent in filteredPatents" 
              :key="patent.id" 
              class="table-row"
            >
              <div class="col-patent-number">{{ patent.patentNumber }}</div>
              <div class="col-application-number">{{ patent.applicationNumber }}</div>
              <div class="col-name">{{ patent.name }}</div>
              <div class="col-field">{{ patent.technicalField }}</div>
              <div class="col-patentee">{{ patent.patentee }}</div>
              <div class="col-applicant">{{ patent.applicant }}</div>
              <div class="col-inventor">{{ patent.inventor }}</div>
              <div class="col-status">
                <span 
                  class="status-badge" 
                  :class="getStatusBadgeClass(patent.status)"
                >
                  {{ getStatusName(patent.status) }}
                </span>
              </div>
              <div class="col-protection">{{ patent.protectionPeriod }}</div>
              <div class="col-agent">{{ patent.agentInfo }}</div>
              <div class="col-docs">
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in patent.documents" 
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
                  @click="uploadDocument(patent)"
                >
                  上传
                </button>
              </div>
              <div class="col-action">
                <button 
                  class="view-btn-small" 
                  @click="viewPatent(patent)"
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
            v-for="patent in filteredPatents" 
            :key="patent.id" 
            class="patent-card"
          >
            <div class="card-header">
              <h3 class="patent-name">{{ patent.name }}</h3>
              <span 
                class="status-badge" 
                :class="getStatusBadgeClass(patent.status)"
              >
                {{ getStatusName(patent.status) }}
              </span>
            </div>
            
            <div class="card-content">
              <div class="info-row">
                <span class="label">专利号：</span>
                <span class="value">{{ patent.patentNumber }}</span>
              </div>
              <div class="info-row">
                <span class="label">申请号：</span>
                <span class="value">{{ patent.applicationNumber }}</span>
              </div>
              <div class="info-row">
                <span class="label">技术领域：</span>
                <span class="value">{{ patent.technicalField }}</span>
              </div>
              <div class="info-row">
                <span class="label">专利权人：</span>
                <span class="value">{{ patent.patentee }}</span>
              </div>
              <div class="info-row">
                <span class="label">申请人：</span>
                <span class="value">{{ patent.applicant }}</span>
              </div>
              <div class="info-row">
                <span class="label">发明/设计人：</span>
                <span class="value">{{ patent.inventor }}</span>
              </div>
              <div class="info-row">
                <span class="label">保护期限：</span>
                <span class="value">{{ patent.protectionPeriod }}</span>
              </div>
              <div class="info-row">
                <span class="label">代理信息：</span>
                <span class="value">{{ patent.agentInfo }}</span>
              </div>
              <div class="info-row">
                <span class="label">资料附件：</span>
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in patent.documents" 
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
                @click="uploadDocument(patent)"
              >
                上传资料
              </button>
              <button 
                class="view-btn-primary" 
                @click="viewPatent(patent)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredPatents.length === 0" class="empty-state">
          <div class="empty-icon">💡</div>
          <h3>暂无专利记录</h3>
          <p>您还没有添加任何专利信息</p>
        </div>
      </div>
    </div>

    <!-- 专利详情弹窗 -->
    <div v-if="showPatentModal" class="modal-overlay" @click="closePatentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedPatent?.name }}</h3>
          <button class="close-btn" @click="closePatentModal">×</button>
        </div>
        <div class="modal-body">
          <div class="patent-image">
            <img 
              :src="selectedPatent?.image" 
              :alt="selectedPatent?.name"
              @error="handleImageError"
            >
          </div>
          <div class="patent-info">
            <div class="info-item">
              <span class="label">专利号：</span>
              <span class="value">{{ selectedPatent?.patentNumber }}</span>
            </div>
            <div class="info-item">
              <span class="label">申请号：</span>
              <span class="value">{{ selectedPatent?.applicationNumber }}</span>
            </div>
            <div class="info-item">
              <span class="label">技术领域：</span>
              <span class="value">{{ selectedPatent?.technicalField }}</span>
            </div>
            <div class="info-item">
              <span class="label">专利权人：</span>
              <span class="value">{{ selectedPatent?.patentee }}</span>
            </div>
            <div class="info-item">
              <span class="label">申请人：</span>
              <span class="value">{{ selectedPatent?.applicant }}</span>
            </div>
            <div class="info-item">
              <span class="label">发明/设计人：</span>
              <span class="value">{{ selectedPatent?.inventor }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态：</span>
              <span class="value">
                <span 
                  class="status-badge" 
                  :class="getStatusBadgeClass(selectedPatent?.status)"
                >
                  {{ getStatusName(selectedPatent?.status) }}
                </span>
              </span>
            </div>
            <div class="info-item">
              <span class="label">保护期限：</span>
              <span class="value">{{ selectedPatent?.protectionPeriod }}</span>
            </div>
            <div class="info-item">
              <span class="label">代理信息：</span>
              <span class="value">{{ selectedPatent?.agentInfo }}</span>
            </div>
            <div class="info-item">
              <span class="label">专利描述：</span>
              <span class="value">{{ selectedPatent?.description }}</span>
            </div>
            <div class="info-item">
              <span class="label">资料附件：</span>
              <div class="docs-list">
                <span 
                  v-for="(doc, index) in selectedPatent?.documents" 
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
          <h3>上传专利资料</h3>
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
const searchKeyword = ref('')
const viewMode = ref('list')
const showPatentModal = ref(false)
const showDocumentModal = ref(false)
const showUploadModal = ref(false)
const selectedPatent = ref(null)
const selectedDocument = ref(null)
const selectedFiles = ref([])
const fileInput = ref(null)

// 专利状态映射
const statusMap = {
  'applied': '已申请',
  'under-review': '审查中',
  'granted': '已授权',
  'rejected': '已驳回',
  'expired': '已过期',
  'abandoned': '已放弃'
}

// 模拟专利数据
const patents = ref([
  {
    id: 1,
    patentNumber: 'ZL202410001234.5',
    applicationNumber: '202410001234.5',
    name: '一种基于人工智能的智能教学系统',
    technicalField: '人工智能',
    patentee: '某某大学',
    applicant: '某某大学',
    inventor: '张三, 李四, 王五',
    status: 'granted',
    protectionPeriod: '2024-01-15 至 2044-01-14',
    agentInfo: '北京某某专利代理事务所',
    description: '本发明公开了一种基于人工智能的智能教学系统，通过机器学习算法分析学生学习行为，提供个性化教学方案，提高教学效果。',
    image: '/pic/data.png',
    documents: [
      { name: '专利证书.pdf', size: '1.2MB', uploadTime: '2024-01-10' },
      { name: '专利申请文件.pdf', size: '2.1MB', uploadTime: '2024-01-12' }
    ]
  },
  {
    id: 2,
    patentNumber: 'ZL202310002345.6',
    applicationNumber: '202310002345.6',
    name: '一种虚拟现实教学设备',
    technicalField: '虚拟现实',
    patentee: '某某大学',
    applicant: '某某大学',
    inventor: '赵六, 孙七',
    status: 'under-review',
    protectionPeriod: '2023-06-20 至 2043-06-19',
    agentInfo: '上海某某知识产权代理有限公司',
    description: '本实用新型涉及一种虚拟现实教学设备，通过VR技术为学生提供沉浸式学习体验，适用于各种教学场景。',
    image: '/pic/data.png',
    documents: [
      { name: '专利申请文件.pdf', size: '1.8MB', uploadTime: '2023-06-18' },
      { name: '技术交底书.docx', size: '1.5MB', uploadTime: '2023-06-22' }
    ]
  },
  {
    id: 3,
    patentNumber: 'ZL202210003456.7',
    applicationNumber: '202210003456.7',
    name: '一种在线教育平台的数据处理方法',
    technicalField: '计算机软件',
    patentee: '某某大学',
    applicant: '某某大学',
    inventor: '周八, 吴九, 郑十',
    status: 'granted',
    protectionPeriod: '2022-12-10 至 2042-12-09',
    agentInfo: '广州某某专利代理有限公司',
    description: '本发明公开了一种在线教育平台的数据处理方法，通过优化数据处理算法，提高平台运行效率，改善用户体验。',
    image: '/pic/data.png',
    documents: [
      { name: '专利证书.pdf', size: '1.5MB', uploadTime: '2022-12-08' }
    ]
  },
  {
    id: 4,
    patentNumber: 'ZL202410004567.8',
    applicationNumber: '202410004567.8',
    name: '一种智能批改系统',
    technicalField: '教育技术',
    patentee: '某某大学',
    applicant: '某某大学',
    inventor: '钱十一, 孙十二',
    status: 'applied',
    protectionPeriod: '2024-03-05 至 2044-03-04',
    agentInfo: '深圳某某知识产权代理事务所',
    description: '本实用新型涉及一种智能批改系统，通过OCR技术和自然语言处理，实现作业自动批改，减轻教师工作负担。',
    image: '/pic/data.png',
    documents: [
      { name: '专利申请文件.pdf', size: '2.3MB', uploadTime: '2024-03-01' },
      { name: '技术方案.docx', size: '1.1MB', uploadTime: '2024-03-03' }
    ]
  },
  {
    id: 5,
    patentNumber: 'ZL202110005678.9',
    applicationNumber: '202110005678.9',
    name: '一种多媒体教学设备',
    technicalField: '教育设备',
    patentee: '某某大学',
    applicant: '某某大学',
    inventor: '李十三, 王十四',
    status: 'expired',
    protectionPeriod: '2021-08-15 至 2024-08-14',
    agentInfo: '成都某某专利代理事务所',
    description: '本实用新型公开了一种多媒体教学设备，集成了投影、音响、交互等功能，为现代化教学提供便利。',
    image: '/pic/data.png',
    documents: [
      { name: '专利证书.pdf', size: '1.8MB', uploadTime: '2021-08-10' }
    ]
  }
])

// 计算属性 - 过滤后的专利列表
const filteredPatents = computed(() => {
  let filtered = patents.value

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(patent => 
      patent.name.toLowerCase().includes(keyword) ||
      patent.patentNumber.toLowerCase().includes(keyword) ||
      patent.applicationNumber.toLowerCase().includes(keyword) ||
      patent.applicant.toLowerCase().includes(keyword) ||
      patent.inventor.toLowerCase().includes(keyword) ||
      patent.technicalField.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 方法
const getStatusName = (status) => {
  return statusMap[status] || '未知状态'
}

const getStatusBadgeClass = (status) => {
  const statusClassMap = {
    'applied': 'status-applied',
    'under-review': 'status-under-review',
    'granted': 'status-granted',
    'rejected': 'status-rejected',
    'expired': 'status-expired',
    'abandoned': 'status-abandoned'
  }
  return statusClassMap[status] || 'status-unknown'
}

const viewPatent = (patent) => {
  selectedPatent.value = patent
  showPatentModal.value = true
}

const closePatentModal = () => {
  showPatentModal.value = false
  selectedPatent.value = null
}

const viewDocument = (doc) => {
  selectedDocument.value = doc
  showDocumentModal.value = true
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  selectedDocument.value = null
}

const uploadDocument = (patent) => {
  selectedPatent.value = patent
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFiles.value = []
  selectedPatent.value = null
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
.patents-container {
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
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.search-box {
  position: relative;
  min-width: 400px;
  max-width: 600px;
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
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 2fr 1.2fr 1.5fr 1.5fr 1.5fr 1fr 1.5fr 1.5fr 2fr 0.8fr 0.8fr;
  gap: 12px;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
  font-size: 12px;
  min-width: 1800px;
}

.table-body {
  min-height: 200px;
}

.table-row {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 2fr 1.2fr 1.5fr 1.5fr 1.5fr 1fr 1.5fr 1.5fr 2fr 0.8fr 0.8fr;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
  min-width: 1800px;
}

.table-row:hover {
  background: #f8fafc;
}

.col-patent-number,
.col-application-number {
  color: #6b7280;
  font-family: monospace;
  font-size: 11px;
}

.col-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 13px;
}

.col-field,
.col-patentee,
.col-applicant,
.col-inventor,
.col-protection,
.col-agent {
  color: #4b5563;
  font-size: 12px;
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
  font-size: 11px;
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
  font-size: 11px;
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

.view-btn-small {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  transition: background-color 0.2s ease;
}

.view-btn-small:hover {
  background: #2563eb;
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

/* 状态标签样式 */
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-applied {
  background: #dbeafe;
  color: #1e40af;
}

.status-under-review {
  background: #fef3c7;
  color: #92400e;
}

.status-granted {
  background: #dcfce7;
  color: #166534;
}

.status-rejected {
  background: #fee2e2;
  color: #dc2626;
}

.status-expired {
  background: #f3f4f6;
  color: #6b7280;
}

.status-abandoned {
  background: #f3f4f6;
  color: #6b7280;
}

.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

/* 卡片视图 */
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  padding: 24px;
}

.patent-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.patent-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.patent-name {
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
  min-width: 100px;
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
  max-width: 900px;
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

.patent-image {
  text-align: center;
  margin-bottom: 20px;
}

.patent-image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.patent-info {
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
  min-width: 120px;
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
  .patents-container {
    padding: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
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
    min-width: auto;
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
  
  .col-patent-number,
  .col-application-number,
  .col-field,
  .col-patentee,
  .col-applicant,
  .col-inventor,
  .col-protection,
  .col-agent {
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
