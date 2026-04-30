<template>
  <div class="resources-container">
    <!-- 0. 学习资料专业头部 -->
    <div class="resources-hero-header">
      <div class="header-content">
        <div class="title-area">
          <div class="header-icon-box">
            <i class="el-icon-folder-opened"></i>
          </div>
          <div class="header-text">
            <h2 class="main-title">学习资料库</h2>
            <div class="header-stats-tags">
              <span class="stat-tag-new"><i class="el-icon-files"></i> 124 份资料</span>
              <span class="stat-tag-new"><i class="el-icon-pie-chart"></i> 2.4 GB</span>
            </div>
          </div>
        </div>
        <div class="header-right-actions">
          <el-input
            v-model="searchQuery"
            placeholder="搜索课程、文件名..."
            prefix-icon="el-icon-search"
            class="premium-search"
            clearable
          ></el-input>
          <el-button type="primary" size="medium" round icon="el-icon-upload2">上传资料</el-button>
        </div>
      </div>
      <div class="header-decoration"></div>
    </div>

    <!-- 面包屑导航 (进入文件夹后显示) -->
    <div v-if="isInsideFolder" class="breadcrumb-nav-premium">
      <el-button icon="el-icon-back" circle size="small" @click="goBack" class="back-btn"></el-button>
      <div class="path-container">
        <span class="path-root" @click="goBack">全部资料</span>
        <i class="el-icon-arrow-right separator"></i>
        <span class="path-current">{{ currentFolderName }}</span>
      </div>
      <div class="view-options">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button label="grid"><i class="el-icon-menu"></i></el-radio-button>
          <el-radio-button label="list"><i class="el-icon-s-unfold"></i></el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 最近查看区域 (仅在首页显示) -->
    <div v-if="!isInsideFolder && !searchQuery" class="recent-section">
      <h3 class="sub-section-title"><i class="el-icon-time"></i> 最近查看</h3>
      <div class="recent-grid">
        <div v-for="file in recentFiles" :key="file.id" class="recent-file-card">
          <div class="recent-icon" :style="{ background: getFileColor(file.type) + '15', color: getFileColor(file.type) }">
            <i :class="getFileIcon(file.type)"></i>
          </div>
          <div class="recent-info">
            <span class="recent-name">{{ file.name }}</span>
            <span class="recent-meta">{{ file.course }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件夹视图 -->
    <div v-if="!isInsideFolder" class="folder-view-optimized">
      <!-- 必修课区域 -->
      <div class="course-group-new">
        <div class="group-header">
          <span class="group-label compulsory">必修课程</span>
          <span class="group-line"></span>
        </div>
        <div class="folder-grid-new">
          <div 
            v-for="course in filteredCompulsory" 
            :key="course.id" 
            class="course-folder-premium is-compulsory"
            @click="openFolder(course)"
          >
            <!-- 文件夹背板与顶页签 -->
            <div class="folder-back">
              <div class="folder-tab"></div>
            </div>
            
            <!-- 内部露出的纸张层 -->
            <div class="folder-papers">
              <div class="paper paper-1"></div>
              <div class="paper paper-2"></div>
              <div class="paper paper-3">
                <p class="paper-text-preview">The course contains key knowledge points...</p>
              </div>
            </div>

            <!-- 文件夹前盖板 (文字信息层) -->
            <div class="folder-front">
              <div class="folder-info-content">
                <h4 class="folder-title">{{ course.name }}</h4>
                <div class="folder-metadata-new">
                  <span class="meta-item">{{ course.fileCount }} files</span>
                  <span class="meta-item">{{ (course.fileCount * 1.2).toFixed(1) }} MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 选修课区域 -->
      <div class="course-group-new">
        <div class="group-header">
          <span class="group-label elective">选修课程</span>
          <span class="group-line"></span>
        </div>
        <div class="folder-grid-new">
          <div 
            v-for="course in filteredElective" 
            :key="course.id" 
            class="course-folder-premium is-elective"
            @click="openFolder(course)"
          >
            <div class="folder-back">
              <div class="folder-tab"></div>
            </div>
            
            <div class="folder-papers">
              <div class="paper paper-1"></div>
              <div class="paper paper-2"></div>
            </div>

            <div class="folder-front">
              <div class="folder-info-content">
                <h4 class="folder-title">{{ course.name }}</h4>
                <div class="folder-metadata-new">
                  <span class="meta-item">{{ course.fileCount }} files</span>
                  <span class="meta-item">{{ (course.fileCount * 0.8).toFixed(1) }} MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件列表视图 -->
    <div v-else class="file-list-view-premium">
      <div class="file-table-header">
        <div class="col-name">名称</div>
        <div class="col-size">大小</div>
        <div class="col-date">修改日期</div>
        <div class="col-action">操作</div>
      </div>
      <div class="file-table-body">
        <div v-for="file in currentFiles" :key="file.id" class="file-table-row">
          <div class="col-name">
            <div class="file-type-icon" :style="{ background: getFileColor(file.type) + '15', color: getFileColor(file.type) }">
              <i :class="getFileIcon(file.type)"></i>
            </div>
            <div class="file-name-info">
              <span class="file-name-main">{{ file.name }}</span>
              <span class="file-ext">{{ file.type.toUpperCase() }} 文件</span>
            </div>
          </div>
          <div class="col-size">{{ file.size }}</div>
          <div class="col-date">{{ file.date }}</div>
          <div class="col-action">
            <div class="action-buttons">
              <el-tooltip content="预览" placement="top"><el-button icon="el-icon-view" circle size="mini"></el-button></el-tooltip>
              <el-tooltip content="下载" placement="top"><el-button type="primary" icon="el-icon-download" circle size="mini"></el-button></el-tooltip>
              <el-tooltip content="收藏" placement="top"><el-button icon="el-icon-star-off" circle size="mini"></el-button></el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isInsideFolder = ref(false)
const currentFolderName = ref('')
const currentFiles = ref([])
const searchQuery = ref('')
const viewMode = ref('grid')

// 模拟必修课程数据
const compulsoryCourses = [
  { id: 1, name: '人工智能导论', fileCount: 15, type: 'compulsory' },
  { id: 2, name: '数据结构与算法', fileCount: 22, type: 'compulsory' },
  { id: 3, name: '高等数学 (下)', fileCount: 18, type: 'compulsory' },
  { id: 4, name: '计算机组成原理', fileCount: 12, type: 'compulsory' }
]

// 模拟选修课程数据
const electiveCourses = [
  { id: 5, name: '数字创意设计', fileCount: 8, type: 'elective' },
  { id: 6, name: '心理学与生活', fileCount: 5, type: 'elective' },
  { id: 7, name: '创新创业基础', fileCount: 10, type: 'elective' }
]

// 模拟最近查看文件
const recentFiles = [
  { id: 1, name: '深度学习全套讲义.pdf', type: 'pdf', course: '深度学习' },
  { id: 2, name: '期末复习大纲.docx', type: 'word', course: '人工智能' },
  { id: 3, name: '实验一代码实现.zip', type: 'zip', course: '机器学习' },
  { id: 4, name: '神经网络可视化.pptx', type: 'ppt', course: '计算机视觉' }
]

// 过滤后的课程
const filteredCompulsory = computed(() => {
  return compulsoryCourses.filter(c => c.name.includes(searchQuery.value))
})

const filteredElective = computed(() => {
  return electiveCourses.filter(c => c.name.includes(searchQuery.value))
})

// 模拟文件数据
const mockFiles = [
  { id: 101, name: '课程教学大纲.pdf', type: 'pdf', size: '1.2MB', date: '2026-03-12' },
  { id: 102, name: '第一章节：基础概念.pptx', type: 'ppt', size: '15.5MB', date: '2026-03-15' },
  { id: 103, name: '课后习题参考答案.docx', type: 'word', size: '450KB', date: '2026-03-18' },
  { id: 104, name: '期末复习重点资料.pdf', type: 'pdf', size: '3.8MB', date: '2026-04-02' },
  { id: 105, name: '学习参考书目清单.xlsx', type: 'excel', size: '120KB', date: '2026-04-10' }
]

const openFolder = (course) => {
  currentFolderName.value = course.name
  isInsideFolder.value = true
  currentFiles.value = [...mockFiles]
}

const goBack = () => {
  isInsideFolder.value = false
  currentFolderName.value = ''
}

const getFileIcon = (type) => {
  switch(type) {
    case 'pdf': return 'el-icon-document'
    case 'ppt': return 'el-icon-monitor'
    case 'word': return 'el-icon-document-copy'
    case 'excel': return 'el-icon-s-grid'
    case 'zip': return 'el-icon-box'
    case 'video': return 'el-icon-video-play'
    default: return 'el-icon-document'
  }
}

const getFileColor = (type) => {
  switch(type) {
    case 'pdf': return '#ef4444'
    case 'ppt': return '#f59e0b'
    case 'word': return '#3b82f6'
    case 'excel': return '#10b981'
    case 'zip': return '#8b5cf6'
    case 'video': return '#6366f1'
    default: return '#94a3b8'
  }
}
</script>

<style scoped>
.resources-container {
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 顶部专业 Hero Header */
.resources-hero-header {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-radius: 24px;
  padding: 32px 40px;
  position: relative;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
}

.header-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-area {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-icon-box {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.main-title {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
}

.header-stats-tags {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.stat-tag-new {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.header-right-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.premium-search {
  width: 280px;
}

.premium-search :deep(.el-input__inner) {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding-left: 40px;
}

.premium-search :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

.premium-search :deep(.el-input__prefix) {
  color: rgba(255, 255, 255, 0.8);
}

.header-decoration {
  position: absolute;
  top: -20%;
  right: -5%;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
}

/* 豪华面包屑 */
.breadcrumb-nav-premium {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 12px 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.back-btn {
  margin-right: 16px;
}

.path-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.path-root {
  color: #64748b;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
}

.path-root:hover { color: #3b82f6; }

.separator { color: #cbd5e1; font-size: 12px; }

.path-current {
  color: #1e293b;
  font-weight: 700;
}

/* 最近查看 */
.recent-section {
  margin-bottom: 32px;
}

.sub-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.recent-file-card {
  background: white;
  padding: 12px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;
}

.recent-file-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-color: #e2e8f0;
}

.recent-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.recent-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.recent-name {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-meta {
  font-size: 11px;
  color: #94a3b8;
}

/* 优化后的文件夹网格 */
.course-group-new {
  margin-bottom: 40px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.group-label {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 8px;
  letter-spacing: 1px;
}

.group-label.compulsory { background: #eff6ff; color: #3b82f6; }
.group-label.elective { background: #f0fdf4; color: #22c55e; }

.group-line {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.folder-grid-new {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 32px;
}

/* 核心：拟真文件夹容器 */
.course-folder-premium {
  position: relative;
  height: 240px;
  cursor: pointer;
  perspective: 1000px;
  transition: transform 0.3s ease;
}

.course-folder-premium:hover {
  transform: translateY(-8px);
}

/* 1. 文件夹背板 */
.folder-back {
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  height: calc(100% - 20px);
  border-radius: 20px;
  z-index: 1;
}

.is-compulsory .folder-back { background: #3b82f6; }
.is-elective .folder-back { background: #e2e8f0; }

/* 文件夹页签 (顶部凸起) */
.folder-tab {
  position: absolute;
  top: -12px;
  left: 20px;
  width: 80px;
  height: 25px;
  border-radius: 12px 12px 0 0;
  z-index: 1;
}

.is-compulsory .folder-tab { background: #3b82f6; }
.is-elective .folder-tab { background: #e2e8f0; }

/* 2. 内部纸张层 */
.folder-papers {
  position: absolute;
  top: 30px; /* 调低白色纸张的水平起始高度 */
  left: 12px;
  right: 12px;
  bottom: 10px;
  z-index: 2;
}

.paper {
  position: absolute;
  width: 100%;
  height: 80%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.paper-1 { transform: translateY(12px) scale(0.92); opacity: 0.6; }
.paper-2 { transform: translateY(6px) scale(0.96); opacity: 0.8; }
.paper-3 { 
  transform: translateY(0) scale(1); 
  padding: 15px;
  overflow: hidden;
}

.paper-text-preview {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.4;
  margin: 0;
}

/* 悬浮时纸张弹出 - 保持较小的弹出幅度 */
.course-folder-premium:hover .paper-1 { transform: translateY(-10px) scale(0.92); }
.course-folder-premium:hover .paper-2 { transform: translateY(-6px) scale(0.96); }
.course-folder-premium:hover .paper-3 { transform: translateY(-3px) scale(1); }

/* 3. 文件夹前盖板 (文字层) */
.folder-front {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 75%;
  border-radius: 0 0 20px 20px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
  /* 文件夹前部切口效果 */
  clip-path: polygon(0 20%, 35% 20%, 45% 0, 100% 0, 100% 100%, 0 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
}

.is-compulsory .folder-front {
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.9) 0%, #2563eb 100%);
  backdrop-filter: blur(4px);
}

.is-elective .folder-front {
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, #f1f5f9 100%);
  backdrop-filter: blur(4px);
  border: 1px solid #e2e8f0;
}

.folder-info-content {
  position: relative;
  z-index: 4;
}

.folder-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.3;
}

.is-compulsory .folder-title { color: white; }
.is-elective .folder-title { color: #1e293b; }

.folder-metadata-new {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-item {
  font-size: 13px;
  font-weight: 500;
}

.is-compulsory .meta-item { color: rgba(255, 255, 255, 0.8); }
.is-elective .meta-item { color: #64748b; }

/* 高级文件列表 */
.file-list-view-premium {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

.file-table-header {
  display: flex;
  background: #f8fafc;
  padding: 16px 24px;
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  border-bottom: 1px solid #f1f5f9;
}

.file-table-row {
  display: flex;
  padding: 16px 24px;
  align-items: center;
  border-bottom: 1px solid #f8fafc;
  transition: all 0.2s;
  cursor: pointer;
}

.file-table-row:hover {
  background: #f8fbff;
}

.col-name { flex: 4; display: flex; align-items: center; gap: 16px; }
.col-size { flex: 1; font-size: 13px; color: #64748b; }
.col-date { flex: 1.5; font-size: 13px; color: #94a3b8; }
.col-action { flex: 1.5; display: flex; justify-content: flex-end; }

.file-type-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.file-name-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.file-name-main {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-ext {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 1px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s;
}

.file-table-row:hover .action-buttons {
  opacity: 1;
  transform: translateX(0);
}

/* 响应式 */
@media (max-width: 1024px) {
  .recent-grid { grid-template-columns: repeat(2, 1fr); }
  .folder-grid-new { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .resources-header-box { flex-direction: column; align-items: flex-start; gap: 20px; }
  .search-input { width: 100%; }
  .recent-grid { grid-template-columns: 1fr; }
  .folder-grid-new { grid-template-columns: 1fr; }
  .col-size, .col-date { display: none; }
}
</style>
