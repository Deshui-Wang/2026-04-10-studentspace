<template>
  <div class="netdisk-container vertical-layout">
    <!-- 1. 顶部操作与分类区 -->
    <div class="netdisk-top-section">
      <!-- 顶部操作条 -->
      <div class="main-header">
        <div class="header-left-part">
          <div class="breadcrumb-area">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item @click="currentFolder = null">我的口袋</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentFolder">{{ currentFolder.name }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="storage-mini-info">
            <span class="storage-usage">2.4GB / 10GB</span>
            <el-progress :percentage="24" :show-text="false" stroke-width="4" color="#3b82f6" class="mini-progress"></el-progress>
          </div>
        </div>
        
        <div class="header-tools">
          <el-input
            v-model="searchQuery"
            placeholder="搜索您的文件..."
            prefix-icon="el-icon-search"
            class="search-bar"
            clearable
          />
          <el-button type="primary" size="medium" round class="top-upload-btn" icon="el-icon-plus">
            上传文件
          </el-button>
          <el-button-group class="view-switch">
            <el-button :type="viewMode === 'grid' ? 'primary' : 'default'" size="small" icon="el-icon-menu" @click="viewMode = 'grid'"></el-button>
            <el-button :type="viewMode === 'list' ? 'primary' : 'default'" size="small" icon="el-icon-s-unfold" @click="viewMode = 'list'"></el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 横向分类菜单 -->
      <div class="horizontal-category-bar">
        <div 
          v-for="item in categories" 
          :key="item.id" 
          :class="['cat-tab', { active: activeCategory === item.id }]"
          @click="activeCategory = item.id"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- 2. 主内容展示区 -->
    <div class="netdisk-content-area">
      <div class="content-scroll-wrapper">
        <!-- 文件夹列表 -->
        <div v-if="activeCategory === 'all' && !currentFolder" class="section-block">
          <h4 class="block-title">最近文件夹</h4>
          <div class="folder-grid">
            <div 
              v-for="folder in folders" 
              :key="folder.id" 
              class="folder-item-new"
              @click="handleFolderClick(folder)"
            >
              <div class="folder-icon-box" :style="{ backgroundColor: folder.color + '15', color: folder.color }">
                <i class="el-icon-folder"></i>
              </div>
              <div class="folder-info-text">
                <span class="f-name">{{ folder.name }}</span>
                <span class="f-count">{{ folder.count }}个项</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 文件列表/网格 -->
        <div class="section-block">
          <div class="block-header">
            <h4 class="block-title">{{ activeCategoryLabel }}</h4>
            <div class="batch-actions">
              <el-button type="text" size="small" icon="el-icon-sort">排序</el-button>
              <el-button type="text" size="small" icon="el-icon-check-tag">批量操作</el-button>
            </div>
          </div>

          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="file-grid">
            <div v-for="file in filteredFiles" :key="file.id" class="file-card-modern">
              <div class="file-preview-area" :class="file.type">
                <i :class="getFileIcon(file.type)"></i>
              </div>
              <div class="file-info-modern">
                <span class="file-name-text">{{ file.name }}</span>
                <div class="file-bottom-meta">
                  <span>{{ file.size }}</span>
                  <span class="dot-sep"></span>
                  <span>{{ file.time.split(' ')[0] }}</span>
                </div>
              </div>
              <div class="card-action-overlay">
                <el-button icon="el-icon-download" circle size="mini"></el-button>
                <el-button icon="el-icon-more" circle size="mini"></el-button>
              </div>
            </div>
          </div>

          <!-- 列表视图 -->
          <div v-else class="file-list">
            <el-table :data="filteredFiles" style="width: 100%" class="modern-list-table">
              <el-table-column label="文件名称" min-width="350">
                <template #default="scope">
                  <div class="list-item-name">
                    <div class="type-icon-small" :class="scope.row.type">
                      <i :class="getFileIcon(scope.row.type)"></i>
                    </div>
                    <span>{{ scope.row.name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="size" label="大小" width="120" />
              <el-table-column prop="time" label="修改时间" width="200" />
              <el-table-column label="操作" width="120" align="right">
                <template #default>
                  <el-button type="text" icon="el-icon-download"></el-button>
                  <el-button type="text" icon="el-icon-more-outline"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref('all')
const viewMode = ref('grid')
const searchQuery = ref('')
const currentFolder = ref(null)

const categories = [
  { id: 'all', label: '全部文件', icon: 'el-icon-files' },
  { id: 'image', label: '图片', icon: 'el-icon-picture-outline' },
  { id: 'video', label: '视频', icon: 'el-icon-video-play' },
  { id: 'doc', label: '文档', icon: 'el-icon-document' },
  { id: 'star', label: '我的收藏', icon: 'el-icon-star-off' },
  { id: 'trash', label: '回收站', icon: 'el-icon-delete' }
]

const activeCategoryLabel = computed(() => {
  return categories.find(c => c.id === activeCategory.value)?.label || '全部文件'
})

const folders = ref([
  { id: 1, name: 'AI 学习报告', count: 12, color: '#3b82f6' },
  { id: 2, name: '项目成果集', count: 8, color: '#10b981' },
  { id: 3, name: '证书奖项', count: 5, color: '#f59e0b' },
  { id: 4, name: '视频课程录屏', count: 24, color: '#8b5cf6' }
])

const allFiles = ref([
  { id: 1, name: '2026春季学期综合报告.pdf', type: 'pdf', size: '1.2 MB', time: '2026-04-28 14:20', cat: 'doc' },
  { id: 2, name: '算法实践项目演示.mp4', type: 'video', size: '45.8 MB', time: '2026-04-27 09:15', cat: 'video' },
  { id: 3, name: '能力检测得分图.png', type: 'image', size: '850 KB', time: '2026-04-26 16:40', cat: 'image' },
  { id: 4, name: '核心素质评估表.xlsx', type: 'excel', size: '45 KB', time: '2026-04-25 10:05', cat: 'doc' },
  { id: 5, name: '个人简历-李启明.pdf', type: 'pdf', size: '2.4 MB', time: '2026-04-24 11:30', cat: 'doc' },
  { id: 6, name: '校园生活瞬间.jpg', type: 'image', size: '1.5 MB', time: '2026-04-23 15:20', cat: 'image' }
])

const filteredFiles = computed(() => {
  let list = allFiles.value
  if (activeCategory.value !== 'all') {
    list = list.filter(f => f.cat === activeCategory.value)
  }
  if (searchQuery.value) {
    list = list.filter(f => f.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  return list
})

const getFileIcon = (type) => {
  switch(type) {
    case 'pdf': return 'el-icon-document'
    case 'image': return 'el-icon-picture'
    case 'video': return 'el-icon-video-camera'
    case 'excel': return 'el-icon-data-analysis'
    default: return 'el-icon-document'
  }
}

const handleFolderClick = (folder) => {
  currentFolder.value = folder
}
</script>

<style scoped>
.netdisk-container {
  display: flex;
  height: calc(100vh - 40px);
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.vertical-layout {
  flex-direction: column;
}

/* 1. 顶部区域样式 */
.netdisk-top-section {
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.main-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid rgba(0,0,0,0.03);
}

.header-left-part {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.storage-mini-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.storage-usage {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.mini-progress {
  width: 100px;
}

.header-tools {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-bar {
  width: 280px;
}

.search-bar :deep(.el-input__inner) {
  border-radius: 12px;
  background: white;
  border: 1px solid #e2e8f0;
}

.top-upload-btn {
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* 2. 横向分类条 */
.horizontal-category-bar {
  display: flex;
  padding: 0 32px;
  height: 56px;
  align-items: center;
  gap: 32px;
}

.cat-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  padding: 0 4px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.cat-tab i {
  font-size: 16px;
}

.cat-tab:hover {
  color: #3b82f6;
}

.cat-tab.active {
  color: #3b82f6;
  font-weight: 700;
}

.cat-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #3b82f6;
  border-radius: 3px 3px 0 0;
}

/* 3. 内容滚动区 */
.netdisk-content-area {
  flex: 1;
  overflow: hidden;
}

.content-scroll-wrapper {
  height: 100%;
  padding: 32px;
  overflow-y: auto;
}

.section-block {
  margin-bottom: 48px;
}

.block-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 文件夹样式 - 新 */
.folder-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.folder-item-new {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
}

.folder-item-new:hover {
  background: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.04);
  border-color: #3b82f630;
  transform: translateY(-2px);
}

.folder-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.folder-info-text {
  display: flex;
  flex-direction: column;
}

.f-name {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

.f-count {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

/* 文件网格样式 - 新 */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
}

.file-card-modern {
  position: relative;
  background: white;
  border-radius: 18px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
  transition: all 0.3s;
}

.file-card-modern:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.08);
}

.file-preview-area {
  height: 130px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
}

.file-preview-area.pdf { color: #ef4444; }
.file-preview-area.video { color: #8b5cf6; }
.file-preview-area.image { color: #3b82f6; }
.file-preview-area.excel { color: #10b981; }

.file-info-modern {
  padding: 16px;
}

.file-name-text {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-bottom-meta {
  margin-top: 6px;
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot-sep {
  width: 3px;
  height: 3px;
  background: #cbd5e1;
  border-radius: 50%;
}

.card-action-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}

.file-card-modern:hover .card-action-overlay {
  opacity: 1;
}

/* 列表视图样式 */
.modern-list-table {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

.list-item-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-icon-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.type-icon-small.pdf { background: #fee2e2; color: #ef4444; }
.type-icon-small.video { background: #f3e8ff; color: #8b5cf6; }
.type-icon-small.image { background: #eff6ff; color: #3b82f6; }
.type-icon-small.excel { background: #dcfce7; color: #10b981; }
</style>
