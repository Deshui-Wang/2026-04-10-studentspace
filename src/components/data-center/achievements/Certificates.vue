<template>
  <div class="certificates-container">
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
            :class="{ active: selectedFilter === 'national-gov' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="national-gov" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">国家及政府奖学金</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'school' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="school" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">校级奖学金</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'enterprise-social' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="enterprise-social" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">企业及社会奖学金</span>
          </label>
        </div>
        
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索奖学金名称..."
            class="search-input"
          >
          <i class="search-icon">🔍</i>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="section-header">
        <h2>奖学金记录：{{ filteredCertificates.length }}</h2>
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
            <div class="col-name">奖学金名称</div>
            <div class="col-type">奖学金类型</div>
            <div class="col-amount">获得金额</div>
            <div class="col-date">获得时间</div>
            <div class="col-details">申请详情</div>
            <div class="col-action">操作</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="scholarship in filteredCertificates" 
              :key="scholarship.id" 
              class="table-row"
            >
              <div class="col-name">{{ scholarship.name }}</div>
              <div class="col-type">
                <span 
                  class="type-badge" 
                  :class="getTypeBadgeClass(scholarship.type)"
                >
                  {{ getScholarshipTypeName(scholarship.type) }}
                </span>
              </div>
              <div class="col-amount">{{ scholarship.amount }}</div>
              <div class="col-date">{{ scholarship.awardDate }}</div>
              <div class="col-details">
                <button 
                  class="details-btn" 
                  @click="viewDetails(scholarship)"
                >
                  查看详情
                </button>
              </div>
              <div class="col-action">
                <button 
                  class="view-btn-small" 
                  @click="viewScholarship(scholarship)"
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
            v-for="scholarship in filteredCertificates" 
            :key="scholarship.id" 
            class="scholarship-card"
          >
            <div class="card-header">
              <h3 class="scholarship-name">{{ scholarship.name }}</h3>
              <span 
                class="type-badge" 
                :class="getTypeBadgeClass(scholarship.type)"
              >
                {{ getScholarshipTypeName(scholarship.type) }}
              </span>
            </div>
            
            <div class="card-content">
              <div class="info-row">
                <span class="label">获得金额：</span>
                <span class="value amount">{{ scholarship.amount }}</span>
              </div>
              <div class="info-row">
                <span class="label">获得时间：</span>
                <span class="value">{{ scholarship.awardDate }}</span>
              </div>
              <div class="info-row">
                <span class="label">申请详情：</span>
                <span class="value">
                  <button 
                    class="details-btn-small" 
                    @click="viewDetails(scholarship)"
                  >
                    查看详情
                  </button>
                </span>
              </div>
            </div>
            
            <div class="card-footer">
              <button 
                class="view-btn-primary" 
                @click="viewScholarship(scholarship)"
              >
                查看奖学金
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredCertificates.length === 0" class="empty-state">
          <div class="empty-icon">🏆</div>
          <h3>暂无奖学金记录</h3>
          <p>您还没有添加任何奖学金信息</p>
        </div>
      </div>
    </div>

    <!-- 奖学金查看弹窗 -->
    <div v-if="showScholarshipModal" class="modal-overlay" @click="closeScholarshipModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedScholarship?.name }}</h3>
          <button class="close-btn" @click="closeScholarshipModal">×</button>
        </div>
        <div class="modal-body">
          <div class="scholarship-image">
            <img 
              :src="selectedScholarship?.image" 
              :alt="selectedScholarship?.name"
              @error="handleImageError"
            >
          </div>
          <div class="scholarship-info">
            <div class="info-item">
              <span class="label">奖学金类型：</span>
              <span class="value">
                <span 
                  class="type-badge" 
                  :class="getTypeBadgeClass(selectedScholarship?.type)"
                >
                  {{ getScholarshipTypeName(selectedScholarship?.type) }}
                </span>
              </span>
            </div>
            <div class="info-item">
              <span class="label">获得金额：</span>
              <span class="value amount">{{ selectedScholarship?.amount }}</span>
            </div>
            <div class="info-item">
              <span class="label">获得时间：</span>
              <span class="value">{{ selectedScholarship?.awardDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">颁发机构：</span>
              <span class="value">{{ selectedScholarship?.organization }}</span>
            </div>
            <div class="info-item">
              <span class="label">申请详情：</span>
              <div class="details-section">
                <button 
                  class="details-btn-primary" 
                  @click="viewDetails(selectedScholarship)"
                >
                  查看申请详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 申请详情弹窗 -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content details-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedScholarship?.name }} - 申请详情</h3>
          <button class="close-btn" @click="closeDetailsModal">×</button>
        </div>
        <div class="modal-body">
          <div class="details-content">
            <div class="details-section">
              <h4>申请信息</h4>
              <div class="info-item">
                <span class="label">申请时间：</span>
                <span class="value">{{ selectedScholarship?.applicationDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">申请状态：</span>
                <span class="value">
                  <span class="status-badge status-approved">已通过</span>
                </span>
              </div>
              <div class="info-item">
                <span class="label">申请理由：</span>
                <span class="value">{{ selectedScholarship?.applicationReason }}</span>
              </div>
            </div>
            
            <div class="details-section">
              <h4>评审信息</h4>
              <div class="info-item">
                <span class="label">评审时间：</span>
                <span class="value">{{ selectedScholarship?.reviewDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">评审意见：</span>
                <span class="value">{{ selectedScholarship?.reviewComment }}</span>
              </div>
            </div>
            
            <div class="details-section">
              <h4>附件材料</h4>
              <div class="docs-list">
                <div 
                  v-for="(doc, index) in selectedScholarship?.documents" 
                  :key="index"
                  class="doc-item"
                  @click="viewDocument(doc)"
                >
                  📄 {{ doc.name }}
                </div>
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const selectedFilter = ref('all')
const searchKeyword = ref('')
const viewMode = ref('list')
const showScholarshipModal = ref(false)
const showDetailsModal = ref(false)
const showDocumentModal = ref(false)
const selectedScholarship = ref(null)
const selectedDocument = ref(null)

// 奖学金类型映射
const scholarshipTypeMap = {
  'national-gov': '国家及政府奖学金',
  'school': '校级奖学金',
  'enterprise-social': '企业及社会奖学金'
}

// 模拟奖学金数据
const certificates = ref([
  {
    id: 1,
    name: '国家奖学金',
    type: 'national-gov',
    amount: '8000元',
    awardDate: '2024-01-15',
    organization: '教育部',
    image: '/pic/data.png',
    applicationDate: '2023-10-15',
    reviewDate: '2023-12-20',
    applicationReason: '学习成绩优异，综合素质突出，积极参与社会实践和志愿服务活动，在学术研究方面有突出表现。',
    reviewComment: '该生学习成绩优秀，综合素质良好，符合国家奖学金评选条件，同意推荐。',
    documents: [
      { name: '国家奖学金申请表.pdf', size: '1.2MB', uploadTime: '2023-10-10' },
      { name: '成绩单.pdf', size: '856KB', uploadTime: '2023-10-12' },
      { name: '获奖证书.pdf', size: '2.1MB', uploadTime: '2023-10-15' }
    ]
  },
  {
    id: 2,
    name: '校长奖学金',
    type: 'school',
    amount: '5000元',
    awardDate: '2023-12-20',
    organization: '学校',
    image: '/pic/data.png',
    applicationDate: '2023-11-01',
    reviewDate: '2023-12-15',
    applicationReason: '在学术研究、社会实践、文体活动等方面表现突出，为学校争得荣誉。',
    reviewComment: '该生各方面表现优秀，符合校长奖学金评选标准。',
    documents: [
      { name: '校长奖学金申请表.pdf', size: '1.5MB', uploadTime: '2023-11-01' },
      { name: '个人事迹材料.pdf', size: '2.3MB', uploadTime: '2023-11-05' }
    ]
  },
  {
    id: 3,
    name: '华为奖学金',
    type: 'enterprise-social',
    amount: '3000元',
    awardDate: '2023-09-10',
    organization: '华为技术有限公司',
    image: '/pic/data.png',
    applicationDate: '2023-08-15',
    reviewDate: '2023-09-05',
    applicationReason: '在计算机科学与技术专业学习优秀，对华为企业文化有深入了解，立志投身科技事业。',
    reviewComment: '该生专业基础扎实，学习态度端正，符合华为奖学金评选要求。',
    documents: [
      { name: '华为奖学金申请表.pdf', size: '1.8MB', uploadTime: '2023-08-15' },
      { name: '专业成绩单.pdf', size: '1.1MB', uploadTime: '2023-08-20' }
    ]
  },
  {
    id: 4,
    name: '励志奖学金',
    type: 'national-gov',
    amount: '5000元',
    awardDate: '2023-11-30',
    organization: '教育部',
    image: '/pic/data.png',
    applicationDate: '2023-10-01',
    reviewDate: '2023-11-20',
    applicationReason: '家庭经济困难但学习刻苦，成绩优秀，积极参与勤工助学活动。',
    reviewComment: '该生家庭经济困难，但学习努力，成绩优秀，符合励志奖学金条件。',
    documents: [
      { name: '励志奖学金申请表.pdf', size: '2.0MB', uploadTime: '2023-10-01' },
      { name: '家庭经济困难证明.pdf', size: '1.5MB', uploadTime: '2023-10-05' },
      { name: '勤工助学证明.pdf', size: '800KB', uploadTime: '2023-10-10' }
    ]
  }
])

// 计算属性 - 过滤后的奖学金列表
const filteredCertificates = computed(() => {
  let filtered = certificates.value

  // 按类型筛选
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(scholarship => scholarship.type === selectedFilter.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(scholarship => 
      scholarship.name.toLowerCase().includes(keyword) ||
      scholarship.organization.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 方法
const getScholarshipTypeName = (type) => {
  return scholarshipTypeMap[type] || '未知类型'
}

const getTypeBadgeClass = (type) => {
  const typeClassMap = {
    'national-gov': 'type-national',
    'school': 'type-school',
    'enterprise-social': 'type-enterprise'
  }
  return typeClassMap[type] || 'type-unknown'
}

const viewScholarship = (scholarship) => {
  selectedScholarship.value = scholarship
  showScholarshipModal.value = true
}

const closeScholarshipModal = () => {
  showScholarshipModal.value = false
  selectedScholarship.value = null
}

const viewDetails = (scholarship) => {
  selectedScholarship.value = scholarship
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedScholarship.value = null
}

const viewDocument = (doc) => {
  selectedDocument.value = doc
  showDocumentModal.value = true
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  selectedDocument.value = null
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
.certificates-container {
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
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1.5fr 0.8fr;
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
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1.5fr 0.8fr;
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

.col-type {
  color: #4b5563;
  font-size: 13px;
}

.col-amount {
  color: #059669;
  font-weight: 600;
  font-size: 14px;
}

.col-date {
  color: #6b7280;
  font-size: 13px;
}

.col-details {
  color: #4b5563;
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

/* 证书类型标签样式 */
.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
}

.type-national {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.type-school {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.type-enterprise {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.type-unknown {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
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

/* 上传按钮样式 */
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
.details-btn {
  padding: 4px 8px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.details-btn:hover {
  background: #7c3aed;
}

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

/* 金额样式 */
.amount {
  color: #059669;
  font-weight: 600;
  font-size: 16px;
}

/* 奖学金卡片样式 */
.scholarship-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.scholarship-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.scholarship-name {
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

.status-approved {
  background: #dcfce7;
  color: #166534;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 卡片视图 */
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 24px;
}

.certificate-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.certificate-card:hover {
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

.certificate-image {
  text-align: center;
  margin-bottom: 20px;
}

.certificate-image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.certificate-info {
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
  .certificates-container {
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
  .col-issue,
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
