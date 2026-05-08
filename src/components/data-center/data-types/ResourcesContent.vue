<template>
  <div class="resources-container">
    <!-- 0. 学习资料专业头部 (保持原有高级感) -->
    <div class="resources-hero-header">
      <div class="header-content">
        <div class="title-area">
          <div class="header-icon-box">
            <i :class="activeCategoryTab === 'library' ? 'el-icon-folder-opened' : 'el-icon-wallet'"></i>
          </div>
          <div class="header-text">
            <h2 class="main-title">{{ activeCategoryTab === 'library' ? '官方学习资料库' : '个人成长口袋' }}</h2>
            <div class="header-stats-tags">
              <span class="stat-tag-new"><i class="el-icon-files"></i> {{ totalItems }} 份内容</span>
              <span class="stat-tag-new"><i class="el-icon-pie-chart"></i> {{ activeCategoryTab === 'library' ? '2.4 GB' : '1.8 GB' }}</span>
            </div>
          </div>
        </div>
        
        <!-- 页签切换器：采用玻璃态设计 -->
        <div class="category-tab-switcher">
          <div 
            class="cat-tab-btn" 
            :class="{ active: activeCategoryTab === 'library' }"
            @click="activeCategoryTab = 'library'; isInsideFolder = false"
          >
            <i class="el-icon-files"></i> 官方资源库
          </div>
          <div 
            class="cat-tab-btn" 
            :class="{ active: activeCategoryTab === 'pocket' }"
            @click="activeCategoryTab = 'pocket'; isInsideFolder = false"
          >
            <i class="el-icon-wallet"></i> 个人口袋
          </div>
        </div>

        <div class="header-right-actions">
          <el-input
            v-model="searchQuery"
            :placeholder="activeCategoryTab === 'library' ? '搜索课程、文件名...' : '搜索您的笔记或文件...'"
            prefix-icon="el-icon-search"
            class="premium-search"
            clearable
          ></el-input>
          <el-button type="primary" size="medium" round icon="el-icon-upload2" class="upload-btn-glow">
            {{ activeCategoryTab === 'library' ? '上传资料' : '存入口袋' }}
          </el-button>
        </div>
      </div>
      <div class="header-decoration"></div>
    </div>

    <!-- 1. 官方资源库视图 -->
    <template v-if="activeCategoryTab === 'library'">
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

      <!-- 拟真文件夹视图 (完全还原原有精美样式) -->
      <div v-if="!isInsideFolder" class="folder-view-optimized">
        <!-- 必修课 -->
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
              <div class="folder-back"><div class="folder-tab"></div></div>
              <div class="folder-papers">
                <div class="paper paper-1"></div>
                <div class="paper paper-2"></div>
                <div class="paper paper-3">
                  <p class="paper-text-preview">本课程包含核心知识点、实验手册及往年试题参考资料...</p>
                </div>
              </div>
              <div class="folder-front">
                <div class="folder-info-content">
                  <h4 class="folder-title">{{ course.name }}</h4>
                  <div class="folder-metadata-new">
                    <span class="meta-item">{{ course.fileCount }} 个文件</span>
                    <span class="meta-item">{{ (course.fileCount * 1.2).toFixed(1) }} MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 选修课 -->
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
              <div class="folder-back"><div class="folder-tab"></div></div>
              <div class="folder-papers">
                <div class="paper paper-1"></div>
                <div class="paper paper-2"></div>
              </div>
              <div class="folder-front">
                <div class="folder-info-content">
                  <h4 class="folder-title">{{ course.name }}</h4>
                  <div class="folder-metadata-new">
                    <span class="meta-item">{{ course.fileCount }} 个文件</span>
                    <span class="meta-item">{{ (course.fileCount * 0.8).toFixed(1) }} MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文件列表视图 -->
      <!-- 高级文件列表视图 (完全还原高保真列表) -->
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
    </template>

    <!-- 2. 个人口袋视图 -->
    <template v-else>
      <div class="pocket-view-wrap">
        <!-- 口袋顶栏 -->
        <div class="pocket-sub-nav">
          <div class="p-nav-tabs">
            <div 
              v-for="cat in pocketCategories" 
              :key="cat.id" 
              :class="['p-nav-item', { active: activePocketCat === cat.id }]"
              @click="activePocketCat = cat.id"
            >
              <i :class="cat.icon"></i><span>{{ cat.label }}</span>
            </div>
          </div>
          <div class="pocket-storage-info">
            <span class="label">已使用空间: 1.8 GB / 10 GB</span>
            <el-progress :percentage="18" :show-text="false" stroke-width="6" color="#7c3aed"></el-progress>
          </div>
        </div>

        <!-- 口袋内容网格 -->
        <div class="pocket-grid-content">
          <!-- 个人文件夹 (同样采用拟真样式，但配色不同) -->
          <div v-if="activePocketCat === 'all'" class="p-section">
            <h5 class="p-group-title"><i class="el-icon-folder"></i> 知识收藏分类</h5>
            <div class="p-folder-list">
              <div v-for="folder in pocketFolders" :key="folder.id" class="p-folder-item">
                <div class="p-f-icon" :style="{ color: folder.color, background: folder.color + '10' }">
                  <i class="el-icon-folder-opened"></i>
                </div>
                <div class="p-f-text">
                  <span class="name">{{ folder.name }}</span>
                  <span class="count">{{ folder.count }} 个内容</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 最近收集内容 -->
          <div class="p-section">
            <h5 class="p-group-title"><i class="el-icon-collection-tag"></i> 最近存入内容</h5>
            <div class="p-file-grid-premium">
              <div v-for="file in filteredPocketFiles" :key="file.id" class="p-file-card-premium">
                <div class="p-preview-box" :class="file.type">
                  <i :class="getFileIcon(file.type)"></i>
                  <div class="p-overlay">
                    <el-button icon="el-icon-share" circle size="mini"></el-button>
                    <el-button icon="el-icon-download" circle size="mini"></el-button>
                  </div>
                </div>
                <div class="p-info-box">
                  <span class="p-title">{{ file.name }}</span>
                  <div class="p-meta">
                    <span class="p-tag">{{ file.cat === 'doc' ? '个人笔记' : '多媒体' }}</span>
                    <span class="p-date">{{ file.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategoryTab = ref('library') 
const isInsideFolder = ref(false)
const currentFolderName = ref('')
const currentFiles = ref([])
const searchQuery = ref('')
const viewMode = ref('grid')

// --- 官方资料库数据 ---
const compulsoryCourses = [
  { id: 1, name: '人工智能导论', fileCount: 15, type: 'compulsory' },
  { id: 2, name: '数据结构与算法', fileCount: 22, type: 'compulsory' },
  { id: 3, name: '高等数学 (下)', fileCount: 18, type: 'compulsory' },
  { id: 4, name: '计算机组成原理', fileCount: 12, type: 'compulsory' }
]
const electiveCourses = [
  { id: 5, name: '数字创意设计', fileCount: 8, type: 'elective' },
  { id: 6, name: '创新创业基础', fileCount: 10, type: 'elective' }
]

const filteredCompulsory = computed(() => compulsoryCourses.filter(c => c.name.includes(searchQuery.value)))
const filteredElective = computed(() => electiveCourses.filter(c => c.name.includes(searchQuery.value)))

// --- 个人口袋数据 ---
const activePocketCat = ref('all')
const pocketCategories = [
  { id: 'all', label: '全部内容', icon: 'el-icon-files' },
  { id: 'image', label: '截图', icon: 'el-icon-picture-outline' },
  { id: 'doc', label: '笔记', icon: 'el-icon-notebook-1' },
  { id: 'star', label: '收藏', icon: 'el-icon-star-off' }
]
const pocketFolders = [
  { id: 1, name: '大模型提示词集', count: 12, color: '#3b82f6' },
  { id: 2, name: '竞赛获奖证书', count: 8, color: '#10b981' },
  { id: 3, name: '个人实习作品', count: 5, color: '#f59e0b' }
]
const pocketFiles = [
  { id: 1, name: '深度学习核心笔记.pdf', type: 'pdf', size: '1.2 MB', time: '2026-04-28', cat: 'doc' },
  { id: 2, name: '模型Loss曲线图.png', type: 'image', size: '2.4 MB', time: '2026-04-27', cat: 'image' },
  { id: 3, name: '项目演示Demo.mp4', type: 'video', size: '45 MB', time: '2026-04-26', cat: 'video' }
]

const filteredPocketFiles = computed(() => {
  let list = pocketFiles
  if (activePocketCat.value !== 'all') list = list.filter(f => f.cat === activePocketCat.value)
  if (searchQuery.value) list = list.filter(f => f.name.includes(searchQuery.value))
  return list
})

const totalItems = computed(() => activeCategoryTab.value === 'library' ? 124 : 25)

// --- 通用方法 ---
const mockFiles = [
  { id: 101, name: '课程大纲.pdf', type: 'pdf', size: '1.2MB', date: '2026-03-12' },
  { id: 102, name: '知识点复习.pptx', type: 'ppt', size: '15.5MB', date: '2026-03-15' }
]
const openFolder = (course) => { currentFolderName.value = course.name; isInsideFolder.value = true; currentFiles.value = [...mockFiles] }
const goBack = () => { isInsideFolder.value = false; currentFolderName.value = '' }

const getFileIcon = (type) => {
  switch(type) {
    case 'pdf': return 'el-icon-document'; case 'ppt': return 'el-icon-monitor';
    case 'word': return 'el-icon-document-copy'; case 'image': return 'el-icon-picture';
    case 'video': return 'el-icon-video-play'; default: return 'el-icon-document'
  }
}
const getFileColor = (type) => {
  switch(type) {
    case 'pdf': return '#ef4444'; case 'ppt': return '#f59e0b';
    case 'word': return '#3b82f6'; case 'video': return '#6366f1'; default: return '#94a3b8'
  }
}
</script>

<style scoped>
.resources-container { padding: 32px; background: #f8fafc; min-height: 100vh; }

/* 1. 还原：高保真 Hero Header */
.resources-hero-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border-radius: 24px; padding: 32px 40px; position: relative; overflow: hidden;
  margin-bottom: 32px; box-shadow: 0 10px 25px rgba(30, 41, 59, 0.1);
}
.header-content { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; }
.title-area { display: flex; align-items: center; gap: 24px; flex: 1; }
.header-icon-box { 
  width: 64px; height: 64px; background: rgba(255, 255, 255, 0.1); 
  border-radius: 18px; display: flex; align-items: center; justify-content: center; 
  font-size: 32px; color: white; backdrop-filter: blur(8px);
}
.main-title { margin: 0; font-size: 26px; font-weight: 800; color: white; }
.header-stats-tags { display: flex; gap: 12px; margin-top: 8px; }
.stat-tag-new { font-size: 12px; color: rgba(255, 255, 255, 0.7); display: flex; align-items: center; gap: 6px; }

/* 玻璃态页签切换器 */
.category-tab-switcher { 
  background: rgba(0,0,0,0.2); padding: 4px; border-radius: 12px; 
  display: flex; gap: 4px; margin: 0 30px; border: 1px solid rgba(255,255,255,0.05);
}
.cat-tab-btn { 
  padding: 8px 18px; border-radius: 10px; font-size: 14px; font-weight: 600; 
  color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.3s;
  display: flex; align-items: center; gap: 8px;
}
.cat-tab-btn:hover { color: white; }
.cat-tab-btn.active { background: white; color: #1e293b; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

.premium-search { width: 240px; }
.premium-search :deep(.el-input__inner) { border-radius: 20px; background: rgba(255,255,255,0.1); border: none; color: white; }
.upload-btn-glow { box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2); }

/* 2. 核心还原：拟真文件夹系统 */
.folder-view-optimized { display: flex; flex-direction: column; gap: 40px; }
.group-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.group-label { font-size: 13px; font-weight: 800; padding: 4px 12px; border-radius: 8px; letter-spacing: 1px; }
.group-label.compulsory { background: #eff6ff; color: #3b82f6; }
.group-label.elective { background: #f0fdf4; color: #22c55e; }
.group-line { flex: 1; height: 1px; background: #e2e8f0; }

.folder-grid-new { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 32px; }

/* 拟真文件夹容器 */
.course-folder-premium {
  position: relative; height: 240px; cursor: pointer; perspective: 1000px;
  transition: transform 0.3s ease;
}
.course-folder-premium:hover { transform: translateY(-8px); }

/* 文件夹背板 */
.folder-back {
  position: absolute; top: 20px; left: 0; width: 100%; height: calc(100% - 20px); border-radius: 20px; z-index: 1;
}
.is-compulsory .folder-back { background: #3b82f6; }
.is-elective .folder-back { background: #e2e8f0; }

.folder-tab {
  position: absolute; top: -12px; left: 20px; width: 80px; height: 25px; 
  border-radius: 12px 12px 0 0; z-index: 1;
}
.is-compulsory .folder-tab { background: #3b82f6; }
.is-elective .folder-tab { background: #e2e8f0; }

/* 内部三层纸张动画 */
.folder-papers { position: absolute; top: 30px; left: 12px; right: 12px; bottom: 10px; z-index: 2; }
.paper {
  position: absolute; width: 100%; height: 80%; background: white; border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.paper-1 { transform: translateY(12px) scale(0.92); opacity: 0.6; }
.paper-2 { transform: translateY(6px) scale(0.96); opacity: 0.8; }
.paper-3 { transform: translateY(0) scale(1); padding: 15px; overflow: hidden; }
.paper-text-preview { font-size: 11px; color: #94a3b8; line-height: 1.4; margin: 0; }

.course-folder-premium:hover .paper-1 { transform: translateY(-10px) scale(0.92); }
.course-folder-premium:hover .paper-2 { transform: translateY(-6px) scale(0.96); }
.course-folder-premium:hover .paper-3 { transform: translateY(-3px) scale(1); }

/* 文件夹前盖板 */
.folder-front {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 75%; border-radius: 0 0 20px 20px;
  z-index: 3; display: flex; flex-direction: column; justify-content: flex-end; padding: 24px;
  clip-path: polygon(0 20%, 35% 20%, 45% 0, 100% 0, 100% 100%, 0 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.2);
}
.is-compulsory .folder-front { background: linear-gradient(180deg, rgba(59, 130, 246, 0.9) 0%, #2563eb 100%); backdrop-filter: blur(4px); }
.is-elective .folder-front { background: linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, #f1f5f9 100%); backdrop-filter: blur(4px); border: 1px solid #e2e8f0; }
.folder-title { margin: 0 0 12px 0; font-size: 18px; font-weight: 800; line-height: 1.3; }
.is-compulsory .folder-title { color: white; }
.is-elective .folder-title { color: #1e293b; }
.meta-item { font-size: 13px; font-weight: 500; }
.is-compulsory .meta-item { color: rgba(255, 255, 255, 0.8); }
.is-elective .meta-item { color: #64748b; }

/* 3. 个人口袋样式升级 */
.pocket-view-wrap { background: white; border-radius: 24px; padding: 32px; border: 1px solid #f1f5f9; }
.pocket-sub-nav { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; margin-bottom: 30px; }
.p-nav-tabs { display: flex; gap: 32px; }
.p-nav-item { display: flex; align-items: center; gap: 8px; font-size: 15px; color: #64748b; cursor: pointer; font-weight: 500; position: relative; padding-bottom: 15px; }
.p-nav-item.active { color: #7c3aed; font-weight: 800; }
.p-nav-item.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 3px; background: #7c3aed; border-radius: 3px; }
.pocket-storage-info { width: 180px; }
.pocket-storage-info .label { font-size: 10px; color: #94a3b8; margin-bottom: 6px; display: block; }

.p-group-title { font-size: 16px; font-weight: 800; color: #1e293b; margin: 0 0 20px 0; display: flex; align-items: center; gap: 8px; }
.p-folder-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px; }
.p-folder-item { background: #fcfdfe; border-radius: 16px; padding: 18px; display: flex; align-items: center; gap: 15px; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.2s; }
.p-folder-item:hover { background: white; box-shadow: 0 8px 16px rgba(124, 58, 237, 0.08); transform: translateY(-3px); }
.p-f-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.p-f-text .name { font-size: 14px; font-weight: 700; color: #334155; display: block; }
.p-f-text .count { font-size: 11px; color: #94a3b8; }

.p-file-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 24px; }
.p-file-card-premium { background: white; border-radius: 18px; border: 1px solid #f1f5f9; overflow: hidden; transition: all 0.3s; }
.p-file-card-premium:hover { transform: translateY(-8px); box-shadow: 0 12px 24px rgba(0,0,0,0.06); }
.p-preview-box { height: 120px; background: #f8fafc; display: flex; align-items: center; justify-content: center; font-size: 48px; position: relative; }
.p-preview-box.pdf { color: #ef4444; }
.p-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; gap: 10px; opacity: 0; transition: 0.2s; }
.p-file-card-premium:hover .p-overlay { opacity: 1; }
.p-info-box { padding: 15px; }
.p-title { font-size: 13px; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px; }
.p-meta { display: flex; justify-content: space-between; align-items: center; }
.p-tag { font-size: 10px; color: #7c3aed; background: #f5f3ff; padding: 2px 6px; border-radius: 4px; }
.p-date { font-size: 10px; color: #94a3b8; }

/* 4. 彻底还原：高级文件列表样式 (文件夹内视图) */
.file-list-view-premium {
  background: white; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  overflow: hidden; border: 1px solid #f1f5f9; margin-top: 10px;
}
.file-table-header {
  display: flex; background: #f8fafc; padding: 16px 24px;
  font-size: 13px; font-weight: 700; color: #64748b; border-bottom: 1px solid #f1f5f9;
}
.file-table-row {
  display: flex; padding: 16px 24px; align-items: center;
  border-bottom: 1px solid #f8fafc; transition: all 0.2s; cursor: pointer;
}
.file-table-row:hover { background: #f8fbff; }
.col-name { flex: 4; display: flex; align-items: center; gap: 16px; }
.col-size { flex: 1; font-size: 13px; color: #64748b; }
.col-date { flex: 1.5; font-size: 13px; color: #94a3b8; }
.col-action { flex: 1.5; display: flex; justify-content: flex-end; }

.file-type-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.file-name-info { display: flex; flex-direction: column; min-width: 0; }
.file-name-main { font-size: 15px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-ext { font-size: 11px; color: #94a3b8; margin-top: 1px; }

.action-buttons {
  display: flex; gap: 8px; opacity: 0; transform: translateX(10px); transition: all 0.2s;
}
.file-table-row:hover .action-buttons { opacity: 1; transform: translateX(0); }
</style>
