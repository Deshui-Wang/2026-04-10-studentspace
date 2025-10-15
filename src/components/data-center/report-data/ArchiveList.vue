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
    name: '个人简历_前端开发.pdf',
    description: '包含项目经验、技能展示、实习经历等内容',
    type: 'pdf',
    typeText: 'PDF文档',
    size: 2048576,
    uploadTime: '2024-12-15 10:30:00',
    downloadCount: 15,
    path: '/personal/resume.pdf'
  },
  {
    id: 2,
    name: '项目作品集_电商系统.pptx',
    description: '展示电商系统项目的完整设计思路和实现过程',
    type: 'pptx',
    typeText: 'PPT演示',
    size: 15360000,
    uploadTime: '2024-12-12 14:25:00',
    downloadCount: 8,
    path: '/personal/projects/ecommerce.pptx'
  },
  {
    id: 3,
    name: '学习笔记_数据结构.docx',
    description: '数据结构与算法的学习笔记和练习题',
    type: 'docx',
    typeText: 'Word文档',
    size: 5120000,
    uploadTime: '2024-12-10 09:15:00',
    downloadCount: 23,
    path: '/personal/notes/datastructure.docx'
  },
  {
    id: 4,
    name: '毕业设计_智能推荐系统.zip',
    description: '基于机器学习的智能推荐系统完整代码',
    type: 'zip',
    typeText: '压缩包',
    size: 25600000,
    uploadTime: '2024-12-08 16:40:00',
    downloadCount: 12,
    path: '/personal/graduation/recommendation.zip'
  },
  {
    id: 5,
    name: '实习报告_腾讯科技.pdf',
    description: '在腾讯科技实习期间的详细工作报告',
    type: 'pdf',
    typeText: 'PDF文档',
    size: 8192000,
    uploadTime: '2024-12-05 11:20:00',
    downloadCount: 6,
    path: '/personal/internship/tencent.pdf'
  },
  {
    id: 6,
    name: '技能证书_Java认证.jpg',
    description: 'Oracle Java SE 8 Programmer认证证书',
    type: 'jpg',
    typeText: '图片文件',
    size: 2048000,
    uploadTime: '2024-12-03 15:30:00',
    downloadCount: 4,
    path: '/personal/certificates/java.jpg'
  },
  {
    id: 7,
    name: '课程作业_数据库设计.xlsx',
    description: '数据库系统原理课程设计作业',
    type: 'xlsx',
    typeText: 'Excel表格',
    size: 1024000,
    uploadTime: '2024-12-01 13:45:00',
    downloadCount: 18,
    path: '/personal/homework/database.xlsx'
  },
  {
    id: 8,
    name: '技术分享_前端性能优化.mp4',
    description: '关于前端性能优化的技术分享视频',
    type: 'mp4',
    typeText: '视频文件',
    size: 128000000,
    uploadTime: '2024-11-28 20:15:00',
    downloadCount: 35,
    path: '/personal/videos/performance.mp4'
  },
  {
    id: 9,
    name: '学习资料_React教程.pdf',
    description: 'React框架学习教程和最佳实践',
    type: 'pdf',
    typeText: 'PDF文档',
    size: 12288000,
    uploadTime: '2024-11-25 08:30:00',
    downloadCount: 29,
    path: '/personal/learning/react.pdf'
  },
  {
    id: 10,
    name: '代码片段_常用工具函数.js',
    description: '日常开发中常用的JavaScript工具函数集合',
    type: 'js',
    typeText: 'JavaScript',
    size: 512000,
    uploadTime: '2024-11-22 17:20:00',
    downloadCount: 41,
    path: '/personal/code/utils.js'
  },
  {
    id: 11,
    name: '设计稿_移动端UI设计.psd',
    description: '移动端应用UI设计稿和原型图',
    type: 'psd',
    typeText: 'PSD文件',
    size: 51200000,
    uploadTime: '2024-11-20 14:10:00',
    downloadCount: 7,
    path: '/personal/designs/mobile.psd'
  },
  {
    id: 12,
    name: '论文草稿_人工智能应用.docx',
    description: '关于人工智能在教育领域应用的论文初稿',
    type: 'docx',
    typeText: 'Word文档',
    size: 8192000,
    uploadTime: '2024-11-18 10:45:00',
    downloadCount: 13,
    path: '/personal/papers/ai_education.docx'
  },
  {
    id: 13,
    name: '实验数据_机器学习结果.csv',
    description: '机器学习模型训练的实验数据和结果',
    type: 'csv',
    typeText: 'CSV数据',
    size: 2048000,
    uploadTime: '2024-11-15 16:25:00',
    downloadCount: 19,
    path: '/personal/data/ml_results.csv'
  },
  {
    id: 14,
    name: '项目文档_API接口说明.md',
    description: '项目API接口的详细说明文档',
    type: 'md',
    typeText: 'Markdown',
    size: 256000,
    uploadTime: '2024-11-12 12:30:00',
    downloadCount: 26,
    path: '/personal/docs/api.md'
  },
  {
    id: 15,
    name: '配置文件_项目环境.env',
    description: '项目环境配置文件模板',
    type: 'env',
    typeText: '环境配置',
    size: 1024,
    uploadTime: '2024-11-10 09:15:00',
    downloadCount: 8,
    path: '/personal/config/.env'
  },
  {
    id: 16,
    name: '测试用例_单元测试.js',
    description: 'JavaScript单元测试用例集合',
    type: 'js',
    typeText: 'JavaScript',
    size: 1024000,
    uploadTime: '2024-11-08 15:40:00',
    downloadCount: 15,
    path: '/personal/tests/unit_tests.js'
  },
  {
    id: 17,
    name: '备份文件_重要资料.rar',
    description: '重要学习资料和项目的备份文件',
    type: 'rar',
    typeText: 'RAR压缩',
    size: 102400000,
    uploadTime: '2024-11-05 18:20:00',
    downloadCount: 3,
    path: '/personal/backup/important.rar'
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
