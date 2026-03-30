<template>
  <div class="courses-page">
    <!-- 筛选条件区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <el-input 
            v-model="filters.fileName" 
            placeholder="搜索文件名称" 
            clearable
            @input="handleFilterChange"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 课程列表 -->
    <div class="content-section">
      <div class="section-header">
        <h2>资料总数：{{ totalFiles }}</h2>
      </div>

      <!-- 文件列表 -->
      <div class="files-list">
        <div class="list-header">
          <div class="header-cell">文件名称</div>
          <div class="header-cell">文件格式</div>
          <div class="header-cell">文件大小</div>
          <div class="header-cell">作者</div>
          <div class="header-cell">浏览量</div>
          <div class="header-cell">上传时间</div>
          <div class="header-cell">操作</div>
        </div>
        
        <div 
          v-for="file in filteredData" 
          :key="file.id" 
          class="list-item"
        >
          <div class="item-cell">
            <div class="file-name">{{ file.name }}</div>
          </div>
          <div class="item-cell">
            <span class="file-format">{{ file.format }}</span>
          </div>
          <div class="item-cell">
            <span class="file-size">{{ file.size }}</span>
          </div>
          <div class="item-cell">
            <span class="file-author">{{ file.author }}</span>
          </div>
          <div class="item-cell">
            <span class="file-views">{{ file.views }}</span>
          </div>
          <div class="item-cell">
            <span class="file-upload-time">{{ file.uploadTime }}</span>
          </div>
          <div class="item-cell">
            <div class="action-buttons">
              <el-button type="primary" size="small" @click="viewFile(file)">
                查看
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredData.length === 0" class="empty-state">
        <div class="empty-icon">📁</div>
        <div class="empty-text">暂无文件数据</div>
        <div class="empty-desc">请检查筛选条件或联系管理员</div>
      </div>
    </div>

    <!-- 文件详情弹窗 -->
    <el-dialog
      v-model="fileDialogVisible"
      title="文件详情"
      width="600px"
      :before-close="handleClose"
    >
      <div class="file-dialog-content">
        <h4>{{ currentFile?.name }}</h4>
        <div class="file-details">
          <div class="detail-item">
            <span class="detail-label">文件格式：</span>
            <span class="detail-value">{{ currentFile?.format }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">文件大小：</span>
            <span class="detail-value">{{ currentFile?.size }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">作者：</span>
            <span class="detail-value">{{ currentFile?.author }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">浏览量：</span>
            <span class="detail-value">{{ currentFile?.views }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">上传时间：</span>
            <span class="detail-value">{{ currentFile?.uploadTime }}</span>
          </div>
        </div>
        <div class="file-actions">
          <el-button type="primary" @click="downloadFile(currentFile)">下载文件</el-button>
          <el-button @click="handleClose">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, View } from '@element-plus/icons-vue'

// 响应式数据
const filters = ref({
  fileName: ''
})

// 弹窗控制
const fileDialogVisible = ref(false)
const currentFile = ref(null)

// 模拟数据
const filesData = ref([
  {
    id: 1,
    name: '老年学概论系统课件.pdf',
    format: 'PDF',
    size: '2.5MB',
    author: '王教授',
    views: 156,
    uploadTime: '2026-03-15'
  },
  {
    id: 2,
    name: '社会工作实务流程规范.pptx',
    format: 'PPTX',
    size: '8.2MB',
    author: '陈主任',
    views: 89,
    uploadTime: '2026-03-12'
  },
  {
    id: 3,
    name: '老年心理沟通实训演示视频.mp4',
    format: 'MP4',
    size: '125.6MB',
    author: '刘护士长',
    views: 234,
    uploadTime: '2026-03-10'
  },
  {
    id: 4,
    name: '智能监护手环配置手册.docx',
    format: 'DOCX',
    size: '1.8MB',
    author: '张技师',
    views: 67,
    uploadTime: '2026-02-25'
  },
  {
    id: 5,
    name: '各省市养老机构补贴配套文件原件集.zip',
    format: 'ZIP',
    size: '15.3MB',
    author: '政策法规科',
    views: 198,
    uploadTime: '2026-02-15'
  },
  {
    id: 6,
    name: '健康评估基本项测试表.pdf',
    format: 'PDF',
    size: '3.7MB',
    author: '李医生',
    views: 112,
    uploadTime: '2026-02-05'
  },
  {
    id: 7,
    name: '康复辅助器具使用指南图册.pdf',
    format: 'PDF',
    size: '4.2MB',
    author: '孙康复师',
    views: 145,
    uploadTime: '2026-01-28'
  },
  {
    id: 8,
    name: '星级养老院服务与管理标准.pptx',
    format: 'PPTX',
    size: '12.8MB',
    author: '周院长',
    views: 203,
    uploadTime: '2026-01-22'
  },
  {
    id: 9,
    name: '四六级英语听力精选.mp4',
    format: 'MP4',
    size: '98.4MB',
    author: '吴教授',
    views: 178,
    uploadTime: '2026-01-18'
  },
  {
    id: 10,
    name: '老年人防跌倒风险评估量表.docx',
    format: 'DOCX',
    size: '2.1MB',
    author: '郑教授',
    views: 94,
    uploadTime: '2026-01-12'
  },
  {
    id: 11,
    name: '智慧养老终端系统开发API集.zip',
    format: 'ZIP',
    size: '22.6MB',
    author: '冯工',
    views: 167,
    uploadTime: '2025-12-08'
  },
  {
    id: 12,
    name: '养老护理急救基础.pdf',
    format: 'PDF',
    size: '5.8MB',
    author: '韩主任',
    views: 89,
    uploadTime: '2025-11-03'
  },
  {
    id: 13,
    name: '银发经济市场分析报告.pptx',
    format: 'PPTX',
    size: '9.7MB',
    author: '杨研究员',
    views: 156,
    uploadTime: '2025-10-28'
  },
  {
    id: 14,
    name: '失智症照护案例实拍记录.mp4',
    format: 'MP4',
    size: '87.3MB',
    author: '朱主任',
    views: 189,
    uploadTime: '2025-09-24'
  },
  {
    id: 15,
    name: '机构消防安全合规指南.docx',
    format: 'DOCX',
    size: '3.4MB',
    author: '秦教授',
    views: 123,
    uploadTime: '2025-08-20'
  },
  {
    id: 16,
    name: '全国百佳养老院调研数据包.zip',
    format: 'ZIP',
    size: '31.2MB',
    author: '许教授',
    views: 201,
    uploadTime: '2025-07-15'
  }
])

// 计算属性
const filteredData = computed(() => {
  let filtered = filesData.value

  // 文件名称搜索
  if (filters.value.fileName) {
    const keyword = filters.value.fileName.toLowerCase()
    filtered = filtered.filter(file => 
      file.name.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

const totalFiles = computed(() => {
  return filesData.value.length
})

const totalSize = computed(() => {
  return filesData.value.reduce((sum, file) => {
    const size = parseFloat(file.size)
    return sum + size
  }, 0).toFixed(1) + 'MB'
})

const totalViews = computed(() => {
  return filesData.value.reduce((sum, file) => sum + file.views, 0)
})

// 方法
const handleFilterChange = () => {
  // 筛选逻辑已在计算属性中处理
}

const viewFile = (file) => {
  currentFile.value = file
  fileDialogVisible.value = true
}

const downloadFile = (file) => {
  console.log('下载文件:', file)
  // 这里可以添加实际的下载逻辑
}

const handleClose = () => {
  fileDialogVisible.value = false
  currentFile.value = null
}

onMounted(() => {
  // 组件挂载时的初始化逻辑
})
</script>

<style scoped>
.courses-page {
  padding: 24px;
  background: #f8f9ff;
  min-height: 100vh;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

/* 筛选区域样式 */
.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  width: 300px;
}

/* 统计概览样式 */
.stats-section {
  margin-bottom: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 22px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f9fafb 0%, #f0f0f0 100%);
  border-radius: 12px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 内容区域样式 */
.content-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

/* 文件列表样式 */
.files-list {
  padding: 0;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  background: #f8f9ff;
  border-bottom: 1px solid #e0e6f1;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.list-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  transition: background-color 0.2s ease;
}

.list-item:hover {
  background: #f8f9ff;
}

.item-cell {
  font-size: 14px;
  color: #333;
}

.file-name {
  font-weight: 600;
  color: #333;
}

.file-format {
  color: #666;
  font-weight: 500;
}

.file-size {
  color: #666;
}

.file-author {
  color: #666;
}

.file-views {
  color: #666;
}

.file-upload-time {
  color: #666;
}


.action-buttons {
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

/* 弹窗样式 */
.file-dialog-content {
  max-height: 500px;
  overflow-y: auto;
}

.file-details {
  margin: 20px 0;
}

.detail-item {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.detail-label {
  font-weight: 600;
  color: #333;
  width: 80px;
  flex-shrink: 0;
}

.detail-value {
  color: #666;
  flex: 1;
}

.file-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e6f1;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.empty-desc {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .list-header,
  .list-item {
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .courses-page {
    padding: 16px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .list-header,
  .list-item {
    display: none;
  }
  
  .files-list {
    display: block;
  }
  
  .list-item {
    display: block;
    margin-bottom: 16px;
    padding: 16px;
    border: 1px solid #e0e6f1;
    border-radius: 8px;
  }
  
  .item-cell {
    margin-bottom: 8px;
  }
  
  .action-buttons {
    justify-content: center;
    margin-top: 12px;
  }
}
</style>
