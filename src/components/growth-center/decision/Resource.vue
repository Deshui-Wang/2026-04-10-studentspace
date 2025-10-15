<template>
  <div class="resource-component">
    <!-- TodoList 组件 -->
    <TodoList />
    
    <!-- 任务目标广场标题区域 -->
    <div class="task-plaza-header">
      <h2 class="plaza-title">任务目标广场</h2>
      <span class="plaza-description">超过98235名教师正在或已经完成了目标任务</span>
    </div>    
    <!-- 搜索和过滤区域 -->
    <div class="search-filter-section">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="搜索考评任务..."
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
      
      <div class="filter-nav">
        <div class="filter-container">
          <button 
            v-for="filter in filterOptions" 
            :key="filter.key"
            class="filter-btn"
            :class="{ active: activeFilter === filter.key }"
            @click="activeFilter = filter.key"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 考评工具卡片区域 -->
    <div class="evaluation-cards">
      <div v-if="filteredTools.length > 0" class="cards-container">
        <div 
          v-for="(tool, index) in filteredTools" 
          :key="tool.id"
          class="evaluation-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="card-header">
            <h3 class="card-title">{{ tool.title }}</h3>
            <span class="card-badge" :class="tool.badgeClass">{{ tool.badgeText }}</span>
          </div>
          
          <div class="card-tabs">
            <span 
              v-for="tab in tool.tabs" 
              :key="tab"
              class="tab-item"
            >
              {{ tab }}
            </span>
          </div>
          
          <div class="card-description">
            {{ tool.description }}
          </div>
          
          <div class="card-participants">
            <div class="participant-avatars">
              <div 
                v-for="(avatar, index) in teacherAvatars" 
                :key="index"
                class="avatar"
                :style="{ backgroundImage: `url(${avatar})` }"
              ></div>
            </div>
            <span class="participant-count">{{ tool.participantCount }}名教师正在参与考核</span>
          </div>
          
          <div class="card-action">
            <button 
              class="action-btn" 
              :class="tool.actionClass"
              @click="handleActionClick(tool)"
            >
              {{ tool.actionText }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">未找到相关考评工具</h3>
        <p class="empty-description">请尝试调整搜索条件或选择其他分类</p>
        <button class="reset-btn" @click="resetFilters">重置筛选条件</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TodoList from './TodoList.vue'

// 过滤器选项
const filterOptions = [
  { key: 'all', label: '全部' },
  { key: 'general', label: '基础能力提升' },
  { key: 'title', label: '专业能力发展' },
  { key: 'competency', label: 'AI智能胜任力' },
  { key: 'subject', label: '科研能力建设' },
  { key: 'other', label: '社会服务贡献' }
]

const activeFilter = ref('all')
const searchQuery = ref('')

// 教师头像列表
const teacherAvatars = [
  '/pic/teacher/66.jpg',
  '/pic/teacher/28.png',
  '/pic/teacher/083.png',
  '/pic/teacher/7b.jpeg',
  '/pic/teacher/85.jpeg'
]

// 考评工具数据
const evaluationTools = [
  {
    id: 1,
    title: '教学工作量基本考核',
    badgeText: '基础能力',
    badgeClass: 'badge-general',
    tabs: ['课程数', '课时数', '学生考试通过率'],
    description: '综合年度考核以及聘期内考核整体教学工作可量化考察内容的评定,适用于全体教师,不分级别和年限',
    participantCount: '98725',
    actionText: '进行中的考评任务',
    actionClass: 'btn-participating',
    category: 'general'
  },
  {
    id: 2,
    title: '科研任务完成情况',
    badgeText: '专业技能',
    badgeClass: 'badge-general',
    tabs: ['论文发表', '项目参与', '经费使用', '专利软著'],
    description: '综合年度考核以及聘期内考核整体教学工作可量化考察内容的评定,适用于全体教师,不分级别和年限',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 3,
    title: '社会服务考评',
    badgeText: '社会服务',
    badgeClass: 'badge-general',
    tabs: ['学术兼职', '横向课题', '服务地方', '成果转化'],
    description: '社会服务考评,考察成果转化效。支撑学校社会服务成果的在线对外展示与宣传)促进社会服务成果在专业教学改革和相关企业中的转化应用。',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 4,
    title: '人工智能教学胜任力考评',
    badgeText: '智能胜任',
    badgeClass: 'badge-competency',
    tabs: ['工具使用', '设计开发', '分享传播', '新技术发现'],
    description: '依托国家职业教育大数据中心,结合多平台多终端的教师教学及学习行为的归集,构建教师人工智能教学胜任力能力考评机制',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'competency'
  },
  {
    id: 5,
    title: '科研任务完成情况',
    badgeText: '科研成果',
    badgeClass: 'badge-general',
    tabs: ['论文发表', '项目参与', '经费使用', '专利软著'],
    description: '综合年度考核以及聘期内考核整体教学工作可量化考察内容的评定,适用于全体教师,不分级别和年限',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 6,
    title: '社会服务考评',
    badgeText: '社会服务',
    badgeClass: 'badge-general',
    tabs: ['学术兼职', '横向课题', '服务地方', '成果转化'],
    description: '社会服务考评,考察成果转化效。支撑学校社会服务成果的在线对外展示与宣传)促进社会服务成果在专业教学改革和相关企业中的转化应用。',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 7,
    title: '社会服务考评',
    badgeText: '社会服务',
    badgeClass: 'badge-general',
    tabs: ['学术兼职', '横向课题', '服务地方', '成果转化'],
    description: '社会服务考评,考察成果转化效。支撑学校社会服务成果的在线对外展示与宣传)促进社会服务成果在专业教学改革和相关企业中的转化应用。',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 8,
    title: '社会服务考评',
    badgeText: '社会服务',
    badgeClass: 'badge-general',
    tabs: ['学术兼职', '横向课题', '服务地方', '成果转化'],
    description: '社会服务考评,考察成果转化效。支撑学校社会服务成果的在线对外展示与宣传)促进社会服务成果在专业教学改革和相关企业中的转化应用。',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'general'
  },
  {
    id: 9,
    title: '社会服务考评',
    badgeText: '社会服务',
    badgeClass: 'badge-general',
    tabs: ['学术兼职', '横向课题', '服务地方', '成果转化'],
    description: '社会服务考评,考察成果转化效。支撑学校社会服务成果的在线对外展示与宣传)促进社会服务成果在专业教学改革和相关企业中的转化应用。',
    participantCount: '98725',
    actionText: '添加任务',
    actionClass: 'btn-join',
    category: 'general'
  }
]

// 根据过滤器和搜索查询筛选工具
const filteredTools = computed(() => {
  let filtered = evaluationTools
  
  // 按类别过滤
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(tool => tool.category === activeFilter.value)
  }
  
  // 按搜索查询过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tool => 
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tabs.some(tab => tab.toLowerCase().includes(query))
    )
  }
  
  return filtered
})

// 处理按钮点击事件
const handleActionClick = (tool) => {
  if (tool.actionText === '正在参考考核') {
    alert('您正在参与该考核，请继续完成相关任务。')
  } else {
    alert(`您已成功报名参加"${tool.title}"考核，请及时关注考核进度。`)
  }
}

// 重置筛选条件
const resetFilters = () => {
  activeFilter.value = 'all'
  searchQuery.value = ''
}
</script>

<style scoped>
.resource-component {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 任务目标广场标题区域样式 */
.task-plaza-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0;
  padding: 0 8px;
}

.plaza-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  background: linear-gradient(135deg, #1976d2 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.plaza-description {
  font-size: 16px;
  color: #6b7280;
  font-weight: 500;
  opacity: 0.8;
}
/* 搜索和过滤区域样式 */
.search-filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  margin-top: 32px;
  gap: 24px;
}

.search-box {
  position: relative;
  flex: 0 0 300px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
}

/* 导航过滤器样式 */
.filter-nav {
  flex: 1;
}

.filter-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.filter-btn {
  padding: 10px 22px;
  border: 1px solid #1976d2;
  background: white;
  color: #1976d2;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #f0f5ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.filter-btn.active {
  background: #1976d2;
  color: white;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
}

/* 考评工具卡片样式 */
.evaluation-cards {
  margin-bottom: 32px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.evaluation-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.1);
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.evaluation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  line-height: 1.4;
}

.card-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.badge-general {
  background: #fef3c7;
  color: #d97706;
}

.badge-competency {
  background: #dbeafe;
  color: #2563eb;
}

.card-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-item {
  padding: 4px 12px;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.card-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-participants {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.participant-avatars {
  display: flex;
  align-items: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 2px solid white;
  margin-left: -8px;
}

.avatar:first-child {
  margin-left: 0;
}

.participant-count {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.card-action {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-participating {
  background: #f3f4f6;
  color: #a0a3a7;
}

.btn-participating:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-join {
  background: #1976d2;
  color: white;
}

.btn-join:hover {
  background: #66a0d9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 32px 0;
}

.reset-btn {
  padding: 12px 24px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #7c3aed;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .task-plaza-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin: 24px 0;
  }
  
  .plaza-title {
    font-size: 24px;
  }
  
  .plaza-description {
    font-size: 14px;
  }  
  .search-box {
    flex: none;
  }
  
  .cards-container {
    grid-template-columns: 1fr;
  }
  
  .filter-container {
    justify-content: center;
  }
  
  .resource-component {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .card-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .card-badge {
    align-self: flex-start;
  }
}
</style>
