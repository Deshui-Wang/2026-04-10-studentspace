<template>
  <div class="projects-container">
    <!-- 头部工具栏 -->
    <div class="top-bar">
      <div class="bar-left">
        <h2 class="page-title">项目经历与实践</h2>
        <p class="page-desc">展示在校期间参与的各类实训项目、社会实践及专业科研成果</p>
      </div>
      <div class="bar-right">
        <div class="filter-group">
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索项目名称、岗位或亮点..." 
            prefix-icon="el-icon-search"
            size="medium"
          />
        </div>
        <el-button type="primary" icon="el-icon-plus" @click="showAddModal = true">添加新项目</el-button>
      </div>
    </div>

    <!-- 项目卡片网格 -->
    <div class="projects-grid">
      <div v-for="project in filteredProjects" :key="project.id" class="project-card-modern">
        <!-- 侧边颜色标识 -->
        <div class="card-side-accent"></div>
        
        <div class="card-main">
          <!-- 头部：项目名称与评分 -->
          <div class="project-header">
            <div class="title-section">
              <div class="p-icon">🚀</div>
              <h3 class="p-title">{{ project.name }}</h3>
            </div>
            <div class="score-badge">
              <span class="s-label">项目评分</span>
              <span class="s-val">{{ project.score }}</span>
            </div>
          </div>

          <!-- 内容区 -->
          <div class="project-body">
            <div class="info-row role-row">
              <span class="row-label">担任岗位：</span>
              <span class="role-tag">{{ project.role }}</span>
            </div>
            
            <div class="info-row content-row">
              <span class="row-label">工作内容：</span>
              <p class="content-text">{{ project.content }}</p>
            </div>
            
            <div class="info-row highlights-row">
              <span class="row-label">能力亮点：</span>
              <div class="highlights-list">
                <span v-for="(highlight, index) in project.highlights" :key="index" class="h-tag">
                  {{ highlight }}
                </span>
              </div>
            </div>
          </div>

          <!-- 底部：操作按钮 -->
          <div class="project-footer">
            <span class="date-text">参与时间：{{ project.date }}</span>
            <div class="actions">
              <el-button size="small" type="primary" plain @click="editProject(project)">编辑</el-button>
              <el-button size="small" type="danger" plain @click="deleteProject(project)">删除</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredProjects.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <h3>暂无项目记录</h3>
        <p>您还没有添加任何项目实践成果</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchKeyword = ref('')
const showAddModal = ref(false)

// 模拟项目数据
const projects = ref([
  {
    id: 1,
    name: '智慧社区适老化环境改造调研与设计',
    role: '适老化设计调研员',
    date: '2025.09 - 2025.12',
    score: 95,
    content: '负责北京市朝阳区3个试点社区的老年人居家环境调研，实地走访并收集了200份有效需求问卷。基于调研数据，参与了社区无障碍通道和居家防跌倒设施的初步方案设计，方案获得社区居委会的高度评价。',
    highlights: ['用户调研能力', '同理心', '空间规划基础', '报告撰写']
  },
  {
    id: 2,
    name: '康养机构数字孪生平台测试与验收',
    role: '测试工程师实习生',
    date: '2026.01 - 2026.03',
    score: 92,
    content: '参与平台生命体征监测模块的集成测试，编写了50+测试用例。在测试过程中发现了3个关键的传感数据同步延迟Bug，并协助开发团队进行了排查与复测，确保了平台的顺利上线。',
    highlights: ['软件测试', '物联网硬件认知', '问题排查', '团队协作']
  },
  {
    id: 3,
    name: '“乐龄伴侣”老年人陪诊小程序开发',
    role: '产品交互助理 (UI/UX)',
    date: '2025.03 - 2025.06',
    score: 98,
    content: '独立完成了小程序的老年人专属大字体、高对比度UI界面设计。深度优化了适老化的语音交互流程，简化了挂号与求助步骤，使产品的易用性评分达到4.8/5，并荣获校级创新创业大赛二等奖。',
    highlights: ['UI/UX设计', '适老化交互', '需求分析', '创新思维']
  }
])

const filteredProjects = computed(() => {
  if (!searchKeyword.value) return projects.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return projects.value.filter(p => 
    p.name.toLowerCase().includes(keyword) ||
    p.role.toLowerCase().includes(keyword) ||
    p.highlights.some(h => h.toLowerCase().includes(keyword)) ||
    p.content.toLowerCase().includes(keyword)
  )
})

const editProject = (project) => {
  console.log('Edit project:', project)
}

const deleteProject = (project) => {
  if (confirm('确定要删除该项目记录吗？')) {
    const index = projects.value.findIndex(p => p.id === project.id)
    if (index > -1) projects.value.splice(index, 1)
  }
}
</script>

<style scoped>
.projects-container {
  padding: 0;
  background: transparent;
}

/* 顶部工具栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  background: white;
  padding: 24px 32px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}

.page-title { font-size: 20px; font-weight: 800; color: #1e293b; margin: 0 0 4px 0; }
.page-desc { font-size: 13px; color: #64748b; margin: 0; }
.bar-right { display: flex; gap: 16px; align-items: center; }

/* 项目卡片网格 */
.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-card-modern {
  display: flex;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  border: 1px solid #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.project-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
  border-color: #2b58ff;
}

.card-side-accent {
  width: 6px;
  background: linear-gradient(to bottom, #10b981, #3b82f6);
  opacity: 0.8;
}

.card-main {
  flex: 1;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 卡片头部 */
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 16px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.p-icon {
  width: 40px;
  height: 40px;
  background: #f0fdf4;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.p-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.score-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eff6ff;
  padding: 6px 16px;
  border-radius: 12px;
  border: 1px solid #bfdbfe;
}

.score-badge .s-label { font-size: 11px; color: #3b82f6; font-weight: 700; }
.score-badge .s-val { font-size: 20px; color: #1d4ed8; font-weight: 800; line-height: 1.2; }

/* 卡片内容区 */
.project-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.row-label {
  min-width: 70px;
  font-size: 13px;
  font-weight: 800;
  color: #64748b;
  margin-top: 2px;
}

.role-tag {
  background: #fef2f2;
  color: #ef4444;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}

.content-text {
  margin: 0;
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  flex: 1;
  text-align: left;
}

.highlights-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.h-tag {
  background: #f8fafc;
  color: #475569;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
}

/* 卡片底部 */
.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  margin-top: 8px;
}

.date-text {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-text::before {
  content: '📅';
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 20px;
}
.empty-icon { font-size: 48px; margin-bottom: 16px; }

@media (max-width: 768px) {
  .top-bar { flex-direction: column; align-items: stretch; gap: 20px; }
  .project-header { flex-direction: column; align-items: flex-start; gap: 16px; }
  .score-badge { align-self: flex-start; }
  .info-row { flex-direction: column; gap: 4px; }
  .row-label { margin-bottom: 4px; }
  .project-footer { flex-direction: column; gap: 16px; align-items: flex-start; }
}
</style>
