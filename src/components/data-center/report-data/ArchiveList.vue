<template>
  <div class="archive-list">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-controls">
        <!-- 中间筛选区域 -->
        <div class="filter-middle">
          <!-- 搜索框 -->
          <div class="search-box">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="搜索文件名、类型或描述..."
                class="search-input"
                @input="handleSearch"
              />
              <button 
                v-if="searchQuery" 
                class="clear-search"
                @click="clearSearch"
                title="清除搜索"
              >
                ×
              </button>
            </div>
          </div>
          
          <!-- 文件类型筛选 -->
          <div class="filter-group">
            <label class="filter-label">文件类型：</label>
            <select v-model="selectedType" @change="handleTypeFilter" class="type-select">
              <option value="">全部类型</option>
              <option value="pdf">PDF文档</option>
              <option value="docx">Word文档</option>
              <option value="pptx">PPT演示</option>
              <option value="xlsx">Excel表格</option>
              <option value="zip">压缩包</option>
              <option value="jpg">图片文件</option>
              <option value="mp4">视频文件</option>
              <option value="js">JavaScript</option>
              <option value="psd">PSD文件</option>
              <option value="csv">CSV数据</option>
              <option value="md">Markdown</option>
              <option value="env">环境配置</option>
            </select>
          </div>
          
          <!-- 排序选项 -->
          <div class="filter-group">
            <label class="filter-label">排序：</label>
            <select v-model="sortBy" @change="handleSort" class="sort-select">
              <option value="uploadTime">上传时间</option>
              <option value="name">文件名</option>
              <option value="size">文件大小</option>
            </select>
            <button 
              class="sort-order-btn" 
              @click="toggleSortOrder"
              :title="sortOrder === 'desc' ? '降序' : '升序'"
            >
              {{ sortOrder === 'desc' ? '↓' : '↑' }}
            </button>
          </div>
        </div>
        
        <!-- 上传文件按钮 -->
        <button class="upload-btn" @click="uploadFile">
          上传文件
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载文件数据...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredFiles.length === 0" class="empty-state">
      <div class="empty-icon">📁</div>
      <p v-if="searchQuery || selectedType">未找到匹配的文件</p>
      <p v-else>暂无文件</p>
      <small v-if="!searchQuery && !selectedType">点击"上传文件"按钮开始上传您的个人资料</small>
      <small v-else>尝试调整搜索条件或筛选选项</small>
    </div>

    <!-- 文件列表表格 -->
    <div v-else class="archive-table-container">
      <table class="archive-table">
        <thead>
          <tr>
            <th class="col-name">文件名称</th>
            <th class="col-type">文件类型</th>
            <th class="col-size">文件大小</th>
            <th class="col-upload-time">上传时间</th>
            <th class="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(file, index) in paginatedFiles" 
            :key="file.id"
            class="archive-row"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <!-- 文件名称 -->
            <td class="col-name">
              <div class="name-cell">
                <div class="file-icon">{{ getFileIcon(file.type) }}</div>
                <div class="name-content">
                  <div class="name-title">{{ file.name }}</div>
                </div>
              </div>
            </td>
            
            <!-- 文件类型 -->
            <td class="col-type">
              <div class="type-info">
                <span class="type-text">{{ file.typeText }}</span>
              </div>
            </td>
            
            <!-- 文件大小 -->
            <td class="col-size">
              <div class="size-info">
                <div class="file-size">{{ formatFileSize(file.size) }}</div>
              </div>
            </td>
            
            <!-- 上传时间 -->
            <td class="col-upload-time">
              <div class="time-info">
                <div class="upload-time">{{ formatDate(file.uploadTime) }}</div>
              </div>
            </td>
            
            <!-- 操作 -->
            <td class="col-actions">
              <div class="action-buttons">
                <button 
                  class="action-btn preview-btn"
                  @click="previewFile(file)"
                  title="预览文件"
                >
                  预览
                </button>
                <button 
                  class="action-btn download-btn"
                  @click="downloadFile(file)"
                  title="下载文件"
                >
                  下载
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="filteredFiles.length > 0" class="pagination-container">
      <div class="pagination-info">
        共 {{ filteredFiles.length }} 条记录，第 {{ currentPage }} / {{ totalPages }} 页
      </div>
      <div class="pagination-controls">
        <button 
          class="page-btn" 
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
        >
          上一页
        </button>
        <span class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            :class="['page-btn', { active: page === currentPage }]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </span>
        <button 
          class="page-btn" 
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
        >
          下一页
        </button>
      </div>
    </div>
    
    <!-- 文件预览弹窗 -->
    <div v-if="showPreview" class="preview-modal" @click="closePreview">
      <div class="preview-content" @click.stop>
        <div class="preview-header">
          <h3 class="preview-title">{{ currentFile?.name }}</h3>
          <button class="close-btn" @click="closePreview">×</button>
        </div>
        <div class="preview-body">
          <div class="file-info">
            <div class="info-item">
              <span class="info-label">文件描述：</span>
              <span class="info-value">{{ currentFile?.description }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">文件类型：</span>
              <span class="info-value">{{ currentFile?.typeText }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">文件大小：</span>
              <span class="info-value">{{ formatFileSize(currentFile?.size) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">上传时间：</span>
              <span class="info-value">{{ formatDate(currentFile?.uploadTime) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">文件路径：</span>
              <span class="info-value">{{ currentFile?.path }}</span>
            </div>
          </div>
          <div class="preview-actions">
            <button class="action-btn download-btn" @click="downloadFile(currentFile)">
              <span class="btn-icon">📥</span>
              下载文件
            </button>
            <button class="action-btn edit-btn" @click="editFile">
              <span class="btn-icon">✏️</span>
              编辑文件
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
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const showPreview = ref(false)
const currentFile = ref(null)

// 筛选相关数据
const searchQuery = ref('')
const selectedType = ref('')
const sortBy = ref('uploadTime')
const sortOrder = ref('desc')

// 模拟文件数据
const files = ref([
  {
    id: 1,
    name: '康复护理实务_实操手册.pdf',
    description: '包含老人体位转移、进食辅助等标准实操规范',
    type: 'pdf',
    typeText: 'PDF文档',
    size: 2048576,
    uploadTime: '2025-05-15 10:30:00',
    downloadCount: 15,
    path: '/personal/care_manual.pdf'
  },
  {
    id: 2,
    name: '适老化环境改造设计方案集.pptx',
    description: '展示居家及机构养老环境的无障碍设计思路',
    type: 'pptx',
    typeText: 'PPT演示',
    size: 15360000,
    uploadTime: '2025-04-12 14:25:00',
    downloadCount: 22,
    path: '/personal/projects/aging_design.pptx'
  },
  {
    id: 3,
    name: '学习笔记_老年心理学.docx',
    description: '老年心理学课程核心理论、干预方法与案例分析',
    type: 'docx',
    typeText: 'Word文档',
    size: 5120000,
    uploadTime: '2025-03-10 09:15:00',
    downloadCount: 45,
    path: '/personal/notes/elder_psychology.docx'
  },
  {
    id: 4,
    name: '智慧健康监测云平台_资料包.zip',
    description: '包含物联网床垫、防跌倒雷达监测系统设备技术规格及配置',
    type: 'zip',
    typeText: '压缩包',
    size: 25600000,
    uploadTime: '2025-02-08 16:40:00',
    downloadCount: 12,
    path: '/personal/graduation/smart_monitor.zip'
  },
  {
    id: 5,
    name: '实习日记_市第一养老院.pdf',
    description: '在社区及机构养老基地的完整实习照护记录',
    type: 'pdf',
    typeText: 'PDF文档',
    size: 8192000,
    uploadTime: '2025-01-05 11:20:00',
    downloadCount: 30,
    path: '/personal/internship/nursing_home.pdf'
  },
  {
    id: 6,
    name: '技能证书_高级养老护理员.jpg',
    description: '人社局颁发的高级养老护理职业技能等级证书高清扫描件',
    type: 'jpg',
    typeText: '图片文件',
    size: 2048000,
    uploadTime: '2024-12-03 15:30:00',
    downloadCount: 4,
    path: '/personal/certificates/senior_care.jpg'
  },
  {
    id: 7,
    name: '课程作业_吞咽困难老人周食谱.xlsx',
    description: '针对慢病和不同吞咽障碍老人的营养流质膳食搭配明细',
    type: 'xlsx',
    typeText: 'Excel表格',
    size: 1024000,
    uploadTime: '2024-12-01 13:45:00',
    downloadCount: 18,
    path: '/personal/homework/elder_diet.xlsx'
  },
  {
    id: 8,
    name: '心肺复苏(CPR)实训教学视频.mp4',
    description: '对突发心脏骤停老人的实操施救标准演练视频',
    type: 'mp4',
    typeText: '视频文件',
    size: 128000000,
    uploadTime: '2024-11-28 20:15:00',
    downloadCount: 88,
    path: '/personal/videos/cpr_training.mp4'
  },
  {
    id: 9,
    name: '失智老人安宁疗护指南.pdf',
    description: '阿尔茨海默症长者照护重点与临终关怀实务操作策略',
    type: 'pdf',
    typeText: 'PDF文档',
    size: 12288000,
    uploadTime: '2024-11-25 08:30:00',
    downloadCount: 29,
    path: '/personal/learning/dementia_care.pdf'
  },
  {
    id: 10,
    name: '老年人健康风险评估表.csv',
    description: '涵盖ADL、跌倒风险、压疮风险等综合评估量表模型数据',
    type: 'csv',
    typeText: 'CSV数据',
    size: 512000,
    uploadTime: '2024-11-22 17:20:00',
    downloadCount: 61,
    path: '/personal/data/risk_assessment.csv'
  },
  {
    id: 11,
    name: '智能康复辅具产品原型.psd',
    description: '改良版助力防跌倒智能手杖工业与外观设计源文件',
    type: 'psd',
    typeText: 'PSD文件',
    size: 51200000,
    uploadTime: '2024-11-20 14:10:00',
    downloadCount: 7,
    path: '/personal/designs/smart_cane.psd'
  },
  {
    id: 12,
    name: '毕业设计_智慧养老社区建设标准.docx',
    description: '结合多维度传感器的未来社区智慧化养老模型论文草稿',
    type: 'docx',
    typeText: 'Word文档',
    size: 8192000,
    uploadTime: '2024-11-18 10:45:00',
    downloadCount: 13,
    path: '/personal/papers/smart_community.docx'
  }
])

// 计算属性
const filteredFiles = computed(() => {
  let result = [...files.value]
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(file => 
      file.name.toLowerCase().includes(query) ||
      file.typeText.toLowerCase().includes(query) ||
      file.description.toLowerCase().includes(query)
    )
  }
  
  // 类型筛选
  if (selectedType.value) {
    result = result.filter(file => file.type === selectedType.value)
  }
  
  // 排序
  result.sort((a, b) => {
    let aVal, bVal
    
    switch (sortBy.value) {
      case 'name':
        aVal = a.name.toLowerCase()
        bVal = b.name.toLowerCase()
        break
      case 'size':
        aVal = a.size
        bVal = b.size
        break
      case 'uploadTime':
      default:
        aVal = new Date(a.uploadTime).getTime()
        bVal = new Date(b.uploadTime).getTime()
        break
    }
    
    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
  
  return result
})

const paginatedFiles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredFiles.value.slice(start, end)
})

const totalCount = computed(() => filteredFiles.value.length)
const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 方法

const getFileIcon = (type) => {
  const icons = {
    pdf: '📄',
    docx: '📝',
    pptx: '📊',
    xlsx: '📈',
    zip: '📦',
    rar: '📦',
    jpg: '🖼️',
    png: '🖼️',
    mp4: '🎥',
    js: '📜',
    psd: '🎨',
    csv: '📊',
    md: '📝',
    env: '⚙️'
  }
  return icons[type] || '📄'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 筛选相关方法
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const handleTypeFilter = () => {
  currentPage.value = 1 // 重置到第一页
}

const handleSort = () => {
  currentPage.value = 1 // 重置到第一页
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  currentPage.value = 1
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  sortBy.value = 'uploadTime'
  sortOrder.value = 'desc'
  currentPage.value = 1
}

const uploadFile = () => {
  console.log('上传文件')
  // 这里可以打开文件上传的弹窗或跳转到上传页面
  alert('文件上传功能开发中...')
}

// 预览文件
const previewFile = (file) => {
  currentFile.value = file
  showPreview.value = true
}

// 关闭预览
const closePreview = () => {
  showPreview.value = false
  currentFile.value = null
}

// 下载文件
const downloadFile = (file) => {
  console.log('下载文件:', file?.name)
  // 这里可以实现实际的下载逻辑
  alert(`正在下载文件：${file?.name}`)
  // 增加下载次数
  file.downloadCount++
}

// 编辑文件
const editFile = () => {
  console.log('编辑文件:', currentFile.value?.name)
  // 这里可以跳转到编辑页面或打开编辑弹窗
  alert(`正在编辑文件：${currentFile.value?.name}`)
}

// 生命周期
onMounted(() => {
  // 模拟加载
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.archive-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* 筛选区域 */
.filter-section {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 24px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.filter-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.upload-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.filter-middle {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: flex-start;
}

.search-box {
  flex: 0 0 280px;
  min-width: 280px;
  max-width: 280px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 10px;
  font-size: 14px;
  color: #6b7280;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 13px;
  background: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-search {
  position: absolute;
  right: 8px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: #374151;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.type-select,
.sort-select {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  max-width: 120px;
}

.type-select:focus,
.sort-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.sort-order-btn {
  padding: 8px 8px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 32px;
  flex-shrink: 0;
}

.sort-order-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}



/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 表格容器 */
.archive-table-container {
  overflow-x: auto;
}

.archive-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.archive-table th {
  background: #f8fafc;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
  text-align: center;
}

.archive-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.archive-row {
  transition: all 0.2s ease;
  animation: fadeInUp 0.3s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.archive-row:hover {
  background: #f8fafc;
}

/* 列样式 */
.col-name {
  min-width: 200px;
}

.name-cell {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.file-icon {
  font-size: 20px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.name-content {
  flex: 1;
  min-width: 0;
}

.name-title {
  font-weight: 500;
  color: #111827;
  word-break: break-word;
}

.col-type {
  min-width: 100px;
  text-align: center;
}

.type-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-text {
  font-size: 14px;
  color: #374151;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}

.col-size {
  min-width: 100px;
  text-align: center;
}

.size-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-size {
  font-weight: 500;
  color: #111827;
  font-size: 14px;
}

.col-upload-time {
  min-width: 120px;
  text-align: center;
}

.time-info {
  text-align: center;
}

.upload-time {
  font-weight: 500;
  color: #111827;
  font-size: 14px;
}


/* 操作列 */
.col-actions {
  width: 120px;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  transform: translateY(-1px);
}

.preview-btn {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.preview-btn:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-icon {
  font-size: 14px;
}

/* 预览弹窗 */
.preview-modal {
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
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.preview-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.preview-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.preview-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.file-info {
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-start;
}

.info-label {
  font-weight: 600;
  color: #374151;
  min-width: 100px;
  margin-right: 12px;
}

.info-value {
  color: #6b7280;
  flex: 1;
}

.preview-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.download-btn {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.download-btn:hover {
  background: #059669;
  border-color: #059669;
}

.edit-btn {
  background: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.edit-btn:hover {
  background: #d97706;
  border-color: #d97706;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .search-box {
    flex: 0 0 240px;
    min-width: 240px;
    max-width: 240px;
  }
  
  .filter-controls {
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .filter-section {
    padding: 16px;
  }
  
  .filter-controls {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .filter-middle {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .title-section {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .search-box {
    flex: 1;
    min-width: auto;
    max-width: none;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .type-select,
  .sort-select {
    min-width: auto;
    max-width: none;
  }
  
  .archive-table {
    font-size: 12px;
  }
  
  .archive-table th,
  .archive-table td {
    padding: 8px 6px;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .filter-section {
    padding: 12px;
  }
  
  .filter-title {
    font-size: 16px;
  }
  
  .upload-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .search-input {
    padding: 8px 10px 8px 36px;
    font-size: 13px;
  }
  
  .type-select,
  .sort-select {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .sort-order-btn {
    padding: 6px 8px;
    font-size: 13px;
  }
  
  .reset-btn {
    padding: 6px 10px;
    font-size: 13px;
  }
}
</style>
