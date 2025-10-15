<template>
  <div class="international-ability-container">
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
            :class="{ active: selectedFilter === 'professional' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="professional" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">职业资格证书</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'skill' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="skill" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">技能等级证书</span>
          </label>
          <label 
            class="filter-tab" 
            :class="{ active: selectedFilter === 'language' }"
          >
            <input 
              type="radio" 
              name="filter" 
              value="language" 
              v-model="selectedFilter"
              class="filter-checkbox"
            >
            <span class="filter-label">语言能力证书</span>
          </label>
        </div>
        
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索证书名称或编号..."
            class="search-input"
          >
          <i class="search-icon">🔍</i>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="section-header">
        <h2>技能证书：{{ filteredAbilities.length }}</h2>
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
            <div class="col-name">证书名称</div>
            <div class="col-number">证书编号</div>
            <div class="col-org">颁发机构</div>
            <div class="col-type">证书类型</div>
            <div class="col-cert">获得时间</div>
            <div class="col-action">操作</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="ability in filteredAbilities" 
              :key="ability.id" 
              class="table-row"
            >
              <div class="col-name">{{ ability.name }}</div>
              <div class="col-number">{{ ability.number }}</div>
              <div class="col-org">{{ ability.organization }}</div>
              <div class="col-type">
                <span 
                  class="type-badge" 
                  :class="getTypeBadgeClass(ability.type)"
                >
                  {{ getAbilityTypeName(ability.type) }}
                </span>
              </div>
              <div class="col-cert">{{ ability.certificationDate }}</div>
              <div class="col-action">
                <button 
                  class="view-btn-small" 
                  @click="viewAbility(ability)"
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
            v-for="ability in filteredAbilities" 
            :key="ability.id" 
            class="ability-card"
          >
            <div class="card-header">
              <h3 class="ability-name">{{ ability.name }}</h3>
              <span 
                class="type-badge" 
                :class="getTypeBadgeClass(ability.type)"
              >
                {{ getAbilityTypeName(ability.type) }}
              </span>
            </div>
            
            <div class="card-content">
              <div class="info-row">
                <span class="label">证书编号：</span>
                <span class="value">{{ ability.number }}</span>
              </div>
              <div class="info-row">
                <span class="label">颁发机构：</span>
                <span class="value">{{ ability.organization }}</span>
              </div>
              <div class="info-row">
                <span class="label">获得时间：</span>
                <span class="value">{{ ability.certificationDate }}</span>
              </div>
            </div>
            
            <div class="card-footer">
              <button 
                class="view-btn-primary" 
                @click="viewAbility(ability)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredAbilities.length === 0" class="empty-state">
          <div class="empty-icon">🏆</div>
          <h3>暂无技能证书记录</h3>
          <p>您还没有添加任何技能证书信息</p>
        </div>
      </div>
    </div>

    <!-- 证书详情弹窗 -->
    <div v-if="showAbilityModal" class="modal-overlay" @click="closeAbilityModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedAbility?.name }}</h3>
          <button class="close-btn" @click="closeAbilityModal">×</button>
        </div>
        <div class="modal-body">
          <div class="ability-image">
            <img 
              :src="selectedAbility?.image" 
              :alt="selectedAbility?.name"
              @error="handleImageError"
            >
          </div>
          <div class="ability-info">
            <div class="info-item">
              <span class="label">证书编号：</span>
              <span class="value">{{ selectedAbility?.number }}</span>
            </div>
            <div class="info-item">
              <span class="label">颁发机构：</span>
              <span class="value">{{ selectedAbility?.organization }}</span>
            </div>
            <div class="info-item">
              <span class="label">证书类型：</span>
              <span class="value">
                <span 
                  class="type-badge" 
                  :class="getTypeBadgeClass(selectedAbility?.type)"
                >
                  {{ getAbilityTypeName(selectedAbility?.type) }}
                </span>
              </span>
            </div>
            <div class="info-item">
              <span class="label">获得时间：</span>
              <span class="value">{{ selectedAbility?.certificationDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">说明资料：</span>
              <div class="docs-list">
                <span 
                  v-for="(doc, index) in selectedAbility?.documents" 
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
          <h3>上传说明资料</h3>
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
const showAbilityModal = ref(false)
const showDocumentModal = ref(false)
const showUploadModal = ref(false)
const selectedAbility = ref(null)
const selectedDocument = ref(null)
const selectedFiles = ref([])
const fileInput = ref(null)

// 证书类型映射
const abilityTypeMap = {
  'professional': '职业资格证书',
  'skill': '技能等级证书',
  'language': '语言能力证书'
}

// 模拟技能证书数据
const abilities = ref([
  {
    id: 1,
    name: '计算机软件资格考试高级程序员',
    number: 'SC2024001',
    organization: '工业和信息化部',
    certificationDate: '2024-03-15',
    type: 'professional',
    image: '/pic/data.png',
    documents: [
      { name: '高级程序员证书.pdf', size: '2.3MB', uploadTime: '2024-03-20' },
      { name: '成绩单.pdf', size: '856KB', uploadTime: '2024-03-22' }
    ]
  },
  {
    id: 2,
    name: '全国计算机等级考试四级网络工程师',
    number: 'NCRE2024002',
    organization: '教育部考试中心',
    certificationDate: '2024-01-20',
    type: 'skill',
    image: '/pic/data.png',
    documents: [
      { name: '四级证书.pdf', size: '1.2MB', uploadTime: '2024-01-25' },
      { name: '成绩报告单.pdf', size: '945KB', uploadTime: '2024-01-26' }
    ]
  },
  {
    id: 3,
    name: '雅思英语能力测试',
    number: 'IELTS2024003',
    organization: '英国文化教育协会',
    certificationDate: '2024-02-10',
    type: 'language',
    image: '/pic/data.png',
    documents: [
      { name: '雅思成绩单.pdf', size: '1.5MB', uploadTime: '2024-02-15' },
      { name: '考试确认信.pdf', size: '856KB', uploadTime: '2024-02-08' }
    ]
  },
  {
    id: 4,
    name: '注册会计师证书',
    number: 'CPA2024004',
    organization: '中国注册会计师协会',
    certificationDate: '2024-04-05',
    type: 'professional',
    image: '/pic/data.png',
    documents: [
      { name: 'CPA证书.pdf', size: '2.1MB', uploadTime: '2024-04-10' },
      { name: '执业证书.pdf', size: '1.8MB', uploadTime: '2024-04-12' }
    ]
  },
  {
    id: 5,
    name: '日语能力测试N1级',
    number: 'JLPT2024005',
    organization: '日本国际交流基金会',
    certificationDate: '2024-01-15',
    type: 'language',
    image: '/pic/data.png',
    documents: [
      { name: 'N1证书.pdf', size: '1.3MB', uploadTime: '2024-01-20' },
      { name: '成绩通知书.pdf', size: '892KB', uploadTime: '2024-01-22' }
    ]
  },
  {
    id: 6,
    name: '电工职业技能等级证书（高级）',
    number: 'ELEC2024006',
    organization: '人力资源和社会保障部',
    certificationDate: '2024-02-28',
    type: 'skill',
    image: '/pic/data.png',
    documents: [
      { name: '高级电工证书.pdf', size: '1.7MB', uploadTime: '2024-03-05' },
      { name: '技能鉴定表.pdf', size: '1.1MB', uploadTime: '2024-03-06' }
    ]
  }
])

// 计算属性 - 过滤后的能力列表
const filteredAbilities = computed(() => {
  let filtered = abilities.value

  // 按类型筛选
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(ability => ability.type === selectedFilter.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(ability => 
      ability.name.toLowerCase().includes(keyword) ||
      ability.number.toLowerCase().includes(keyword) ||
      ability.organization.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 方法
const getAbilityTypeName = (type) => {
  return abilityTypeMap[type] || '未知类型'
}

const getTypeBadgeClass = (type) => {
  const typeClassMap = {
    'professional': 'type-professional',
    'skill': 'type-skill',
    'language': 'type-language'
  }
  return typeClassMap[type] || 'type-unknown'
}

const viewAbility = (ability) => {
  selectedAbility.value = ability
  showAbilityModal.value = true
}

const closeAbilityModal = () => {
  showAbilityModal.value = false
  selectedAbility.value = null
}

const viewDocument = (doc) => {
  selectedDocument.value = doc
  showDocumentModal.value = true
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  selectedDocument.value = null
}

const uploadDocument = (ability) => {
  selectedAbility.value = ability
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFiles.value = []
  selectedAbility.value = null
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
.international-ability-container {
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
  grid-template-columns: 2fr 1.5fr 1.5fr 1.2fr 1fr 0.8fr;
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
  grid-template-columns: 2fr 1.5fr 1.5fr 1.2fr 1fr 0.8fr;
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

.col-cert {
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

.type-professional {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.type-skill {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.type-language {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.type-unknown {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

/* 卡片视图 */
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  padding: 24px;
}

.ability-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.ability-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.ability-name {
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

.ability-image {
  text-align: center;
  margin-bottom: 20px;
}

.ability-image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.ability-info {
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
  .international-ability-container {
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
  .col-cert {
    margin-bottom: 4px;
    font-size: 14px;
  }
  
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
