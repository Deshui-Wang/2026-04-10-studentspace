<template>
  <div class="notes-list">
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
                placeholder="搜索笔记标题、内容或标签..."
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
          
          <!-- 标签筛选 -->
          <div class="filter-group">
            <label class="filter-label">标签：</label>
            <select v-model="selectedTag" @change="handleTagFilter" class="tag-select">
              <option value="">全部标签</option>
              <option value="学习笔记">学习笔记</option>
              <option value="会议记录">会议记录</option>
              <option value="项目总结">项目总结</option>
              <option value="心得体会">心得体会</option>
              <option value="技术文档">技术文档</option>
              <option value="读书笔记">读书笔记</option>
              <option value="工作计划">工作计划</option>
            </select>
          </div>
        </div>
        
        <!-- 新建笔记按钮 -->
        <button class="new-note-btn" @click="createNote">
          <span class="btn-icon">📝</span>
          新建笔记
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载笔记数据...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredNotes.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <p v-if="searchQuery || selectedTag">未找到匹配的笔记</p>
      <p v-else>暂无笔记</p>
      <small v-if="!searchQuery && !selectedTag">点击"新建笔记"按钮开始记录您的想法</small>
      <small v-else>尝试调整搜索条件或筛选选项</small>
    </div>

    <!-- 笔记列表 -->
    <div v-else class="notes-grid">
      <div 
        v-for="note in paginatedNotes" 
        :key="note.id" 
        class="note-card"
        @click="viewNote(note)"
      >
        <div class="note-header">
          <h3 class="note-title">{{ note.title }}</h3>
          <div class="note-tags">
            <span 
              v-for="tag in note.tags" 
              :key="tag" 
              class="note-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="note-content">
          <p class="note-preview">{{ note.preview }}</p>
        </div>
        
        <div class="note-footer">
          <div class="note-meta">
            <span class="note-date">{{ formatDate(note.createTime) }}</span>
            <span class="note-word-count">{{ note.wordCount }}字</span>
          </div>
          <div class="note-actions">
            <button 
              class="action-btn edit-btn" 
              @click.stop="editNote(note)"
              title="编辑笔记"
            >
              ✏️
            </button>
            <button 
              class="action-btn delete-btn" 
              @click.stop="deleteNote(note.id)"
              title="删除笔记"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="page-btn" 
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        上一页
      </button>
      
      <div class="page-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          :class="['page-number', { active: page === currentPage }]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="page-btn" 
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        下一页
      </button>
    </div>

    <!-- 笔记详情模态框 -->
    <div v-if="showNoteModal" class="modal-overlay" @click="closeNoteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ selectedNote?.title }}</h2>
          <button class="close-btn" @click="closeNoteModal">×</button>
        </div>
        <div class="modal-body">
          <div class="note-tags">
            <span 
              v-for="tag in selectedNote?.tags" 
              :key="tag" 
              class="note-tag"
            >
              {{ tag }}
            </span>
          </div>
          <div class="note-full-content">
            {{ selectedNote?.content }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeNoteModal">关闭</button>
          <button class="btn-primary" @click="editNote(selectedNote)">编辑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 筛选相关数据
const searchQuery = ref('')
const selectedTag = ref('')
const loading = ref(false)

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(12)

// 模态框相关数据
const showNoteModal = ref(false)
const selectedNote = ref(null)

// 模拟笔记数据
const notes = ref([
  {
    id: 1,
    title: '《老年心理学》第一章学习笔记',
    content: '今天学习了老年人心理衰退的几种常见表现以及防御机制。重点在于要学会观察老人产生的孤独感、抑郁感等隐性特征。需要注意的是，在陪伴老人时，倾听比直接提供建议更有力量。后续需要重点复习“生命回顾疗法”的实操流程。',
    preview: '今天学习了老年人心理衰退的几种常见表现以及防御机制。重点在于要学会观察老人产生的孤独感、抑郁感等隐性特征。需要注意的是...',
    tags: ['学习笔记', '技术文档'],
    createTime: '2025-03-01 14:30:00',
    updateTime: '2025-03-01 16:45:00',
    wordCount: 156
  },
  {
    id: 2,
    title: '床垫式体征监测设备实操心得',
    content: '在实训中心第一次操作智能体征监测床垫，感受很深。首先是铺设位置必须对准老人的心脏体征位，否则数据会有偏差。其次，系统给出的呼吸暂停报警一定要结合老人的实际睡眠习惯进行二次判断。最后，设备每日数据的校准是保证健康档案准确的基石。',
    preview: '在实训中心第一次操作智能体征监测床垫，感受很深。首先是铺设位置必须对准老人的心脏体征位，否则数据会有偏差...',
    tags: ['心得体会', '项目总结'],
    createTime: '2025-02-28 09:15:00',
    updateTime: '2025-02-28 11:20:00',
    wordCount: 198
  },
  {
    id: 3,
    title: '会议记录 - 社区养老志愿服务活动推进会',
    content: '会议时间：2025年2月20日 下午2:00-4:00\n参会人员：指导老师、班长、组长及全体组员\n\n会议议题：\n1. 本次社区义诊与康复科普活动流程\n2. 适老化辅具捐赠分配方案\n3. 血压、血糖测量组排班划分\n\n讨论结果：\n- 确定增加防跌倒知识讲座环节\n- 按街区网格化分组进行上门探访\n- 特别关注空巢老人心理疏导',
    preview: '会议时间：2025年2月20日 下午2:00-4:00\n参会人员：指导老师、班长、组长及全体组员\n\n会议议题：...',
    tags: ['会议记录', '工作计划'],
    createTime: '2025-02-20 16:30:00',
    updateTime: '2025-02-20 18:00:00',
    wordCount: 234
  },
  {
    id: 4,
    title: '《阿尔茨海默症照护指南》读书笔记',
    content: '这本书深入剖析了失智老人在不同阶段（轻度、中度、重度）的行为特征和照护难点。特别强调了“非药物干预”的方法，如音乐疗法、园艺疗法以及怀旧疗法在延缓认知功能衰退中的积极作用。对于日间照料中心的护理人员来说，这本书提供了非常实用的情景应对策略。',
    preview: '这本书深入剖析了失智老人在不同阶段（轻度、中度、重度）的行为特征和照护难点。特别强调了“非药物干预”的方法...',
    tags: ['读书笔记', '学习笔记'],
    createTime: '2025-01-12 20:00:00',
    updateTime: '2025-01-12 22:30:00',
    wordCount: 178
  },
  {
    id: 5,
    title: '失智老人进食护理操作要点',
    content: '在失智老人的进食护理考查中，我总结了几个关键容易丢分的要点：\n1. 环境准备：移除桌面上与进食无关的杂物，避免老人分心；\n2. 餐具选择：使用带有防滑底座、色彩鲜明的大柄餐具；\n3. 食物处理：对于有吞咽障碍的老人，务必将食物打成泥状并加入增稠剂；\n4. 引导话术：用简单直接的指令，如“张嘴”、“咽下去”；\n5. 风险防范：进食后需保持坐姿至少30分钟，防止反流误吸。',
    preview: '在失智老人的进食护理考查中，我总结了几个关键容易丢分的要点：\n1. 环境准备：移除桌面上与进食无关的杂物，避免老人分心...',
    tags: ['技术文档', '学习笔记'],
    createTime: '2025-01-11 15:45:00',
    updateTime: '2025-01-11 17:30:00',
    wordCount: 245
  },
  {
    id: 6,
    title: '下学期实习与职业技能考证计划',
    content: '针对新的学年，我为自己制定了明确的康养学习与发展规划：\n\n技能考证：\n- 考取高级养老护理员职称\n- 拿下红十字救护员(CPR+AED)证书\n- 尝试备考健康管理师三级\n\n实践积攒：\n- 每周末去定点公办养老院完成8小时志愿服务\n- 参与导师的智慧社区适老化改造调研项目\n\n核心目标：\n- 熟练掌握20种核心护理实操操作规范\n- 整理一份“老年慢病干预案例库”报告',
    preview: '针对新的学年，我为自己制定了明确的康养学习与发展规划：\n\n技能考证：\n- 考取高级养老护理员职称\n- 拿下红十字救护员...',
    tags: ['工作计划', '学习笔记'],
    createTime: '2025-01-10 10:00:00',
    updateTime: '2025-01-10 12:15:00',
    wordCount: 312
  }
])

// 计算属性
const filteredNotes = computed(() => {
  let result = [...notes.value]
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 标签筛选
  if (selectedTag.value) {
    result = result.filter(note => 
      note.tags.includes(selectedTag.value)
    )
  }
  
  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredNotes.value.length / pageSize.value)
})

const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredNotes.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// 方法
const handleSearch = () => {
  currentPage.value = 1
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const handleTagFilter = () => {
  currentPage.value = 1
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '昨天'
  } else if (diffDays === 2) {
    return '前天'
  } else if (diffDays <= 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const createNote = () => {
  // 这里可以打开新建笔记的模态框或跳转到编辑页面
  console.log('创建新笔记')
}

const viewNote = (note) => {
  selectedNote.value = note
  showNoteModal.value = true
}

const editNote = (note) => {
  // 这里可以打开编辑笔记的模态框或跳转到编辑页面
  console.log('编辑笔记:', note)
  closeNoteModal()
}

const deleteNote = (noteId) => {
  if (confirm('确定要删除这条笔记吗？')) {
    const index = notes.value.findIndex(note => note.id === noteId)
    if (index > -1) {
      notes.value.splice(index, 1)
    }
  }
}

const closeNoteModal = () => {
  showNoteModal.value = false
  selectedNote.value = null
}

// 生命周期
onMounted(() => {
  // 模拟加载
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.notes-list {
  padding: 0;
  background: white;
  min-height: 600px;
}

/* 筛选区域 */
.filter-section {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px;
}

.filter-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.filter-middle {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #6b7280;
  font-size: 16px;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
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
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: #f3f4f6;
  color: #374151;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  white-space: nowrap;
}

.tag-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  min-width: 120px;
  cursor: pointer;
}

.tag-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.new-note-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-note-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 16px;
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
  width: 40px;
  height: 40px;
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
  padding: 80px 20px;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #374151;
}

.empty-state small {
  font-size: 14px;
  color: #9ca3af;
}

/* 笔记网格 */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.note-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.note-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.note-header {
  margin-bottom: 12px;
}

.note-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.note-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.note-content {
  margin-bottom: 16px;
}

.note-preview {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.note-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.note-date {
  font-size: 12px;
  color: #9ca3af;
}

.note-word-count {
  font-size: 12px;
  color: #9ca3af;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: #f0f9ff;
}

.delete-btn:hover {
  background: #fef2f2;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  min-width: 40px;
}

.page-number:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.page-number.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* 模态框 */
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
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
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.note-full-content {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #374151;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn-secondary {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f9fafb;
}

.btn-primary {
  padding: 8px 16px;
  border: none;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #2563eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filter-middle {
    flex-direction: column;
    gap: 16px;
  }
  
  .search-box {
    max-width: none;
  }
  
  .notes-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .page-numbers {
    flex-wrap: wrap;
  }
  
  .modal-content {
    margin: 10px;
    max-height: 90vh;
  }
}
</style>
