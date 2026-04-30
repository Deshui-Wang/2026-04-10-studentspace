<template>
  <div class="evaluation-container">
    <!-- 头部工具栏 -->
    <div class="top-bar">
      <div class="bar-left">
        <h2 class="page-title">教师评价</h2>
        <p class="page-desc">查看各科任课教师对您在学习过程中的专业评价与建议</p>
      </div>
      <div class="bar-right">
        <div class="filter-group">
          <el-select v-model="filters.course" placeholder="课程筛选" size="medium" clearable>
            <el-option v-for="opt in courseOptions" :key="opt.value" :label="opt.label" :value="opt.label" />
          </el-select>
          <el-input 
            v-model="filters.search" 
            placeholder="搜索教师或课程..." 
            prefix-icon="el-icon-search"
            size="medium"
          />
        </div>
      </div>
    </div>

    <!-- 高频词云概览 -->
    <div class="word-cloud-card modern-card">
      <div class="card-header">
        <i class="el-icon-data-analysis"></i>
        <h3>综合评价特征词</h3>
      </div>
      <div class="cloud-tags">
        <span class="cloud-tag primary">认真刻苦</span>
        <span class="cloud-tag success">思维活跃</span>
        <span class="cloud-tag warning">积极互动</span>
        <span class="cloud-tag danger">作业优秀</span>
        <span class="cloud-tag info">动手能力强</span>
        <span class="cloud-tag primary">领悟力高</span>
        <span class="cloud-tag success">团队协作</span>
      </div>
    </div>

    <!-- 评价卡片列表 -->
    <div class="evaluation-grid">
      <div v-for="item in filteredData" :key="item.id" class="eval-card-modern">
        <!-- 侧边颜色标识 -->
        <div class="card-side-accent"></div>
        
        <div class="card-main">
          <!-- 左侧：教师信息 -->
          <div class="teacher-profile">
            <div class="avatar-wrap">
              <img :src="item.teacherAvatar" :alt="item.teacherName" class="teacher-avatar" @error="handleImageError" />
            </div>
            <div class="teacher-info">
              <span class="t-name">{{ item.teacherName }}</span>
              <span class="t-title">任课教师</span>
            </div>
          </div>

          <!-- 中间：评价主体 -->
          <div class="eval-content">
            <div class="eval-header">
              <div class="tags-row">
                <span class="tag-course">{{ item.courseName }}</span>
                <span class="tag-class">{{ item.className }}</span>
              </div>
              <span class="eval-date">{{ item.evaluationDate }}</span>
            </div>
            
            <div class="eval-body">
              <div class="text-block">
                <span class="block-label">学生优势：</span>
                <p>{{ item.advantages }}</p>
              </div>
              <div class="text-block suggestion">
                <span class="block-label">学习建议：</span>
                <p>{{ item.suggestions }}</p>
              </div>
            </div>
          </div>

          <!-- 右侧：评分 -->
          <div class="eval-score">
            <div class="score-circle">
              <svg viewBox="0 0 36 36" class="circular-chart">
                <path class="circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path class="circle"
                  :stroke-dasharray="`${item.score}, 100`"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" class="percentage">{{ item.score }}</text>
              </svg>
            </div>
            <span class="score-text">综合评分</span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredData.length === 0" class="empty-state">
        <div class="empty-icon">👩‍🏫</div>
        <h3>暂无评价记录</h3>
        <p>没有找到相关的教师评价数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filters = ref({ course: '', search: '' })

const courseOptions = [
  { value: 'course1', label: '老年心理学' },
  { value: 'course2', label: '康复护理实务' },
  { value: 'course3', label: '智能健康监测系统' },
  { value: 'course4', label: '适老化环境设计' },
  { value: 'course5', label: '老年社会学' }
]

const handleImageError = (e) => {
  e.target.src = '/pic/student01.png' // Fallback image
}

const rawData = ref([
  {
    id: 1,
    courseName: '老年心理学',
    className: '智慧健康养老服务与管理2401班',
    teacherName: '李云岚',
    teacherAvatar: '/pic/tea/66.jpg',
    evaluationDate: '2026-03-20',
    score: 92,
    advantages: '该生学习态度端正，上课认真听讲。思维敏捷，对老年人心理特征的知识点领悟力很强，并在课堂讨论中展现了出色的共情能力。',
    suggestions: '建议多阅读一些前沿的心理学案例书籍，将理论知识更紧密地与实际干预方案结合。'
  },
  {
    id: 2,
    courseName: '康复护理实务',
    className: '智慧健康养老服务与管理2401班',
    teacherName: '王建平',
    teacherAvatar: '/pic/tea/85.jpeg',
    evaluationDate: '2026-03-15',
    score: 89,
    advantages: '动手能力强，能很好地完成轮椅转移、翻身叩背等实践任务。团队协作能力强，在小组实操中发挥了积极的统筹作用。',
    suggestions: '希望在实操过程中更加注重人体力学的运用，注意保护自身的腰部安全，大胆尝试复杂操作。'
  },
  {
    id: 3,
    courseName: '智能健康监测系统',
    className: '智慧健康养老服务与管理2401班',
    teacherName: '张明哲',
    teacherAvatar: '/pic/tea/shuziren01.png',
    evaluationDate: '2026-03-05',
    score: 95,
    advantages: '对智能设备和物联网数据具有很强的敏感度，作业完成质量极高，思路清晰，能够独立完成数据监测平台的模拟配置。',
    suggestions: '可以多关注行业内最新的康养智能硬件动态，尝试自己设计一些基础的健康监测流程图。'
  },
  {
    id: 4,
    courseName: '适老化环境设计',
    className: '智慧健康养老服务与管理2401班',
    teacherName: '陈芳',
    teacherAvatar: '/pic/tea/shuziren02.png',
    evaluationDate: '2026-02-28',
    score: 87,
    advantages: '学习计划合理，能够循序渐进地掌握空间设计的规范标准，提交的居家适老化改造图纸细节考虑周到。',
    suggestions: '建议在设计中更多地考虑成本效益，多研究一些低成本但高效的适老化改造案例。'
  }
])

const filteredData = computed(() => {
  return rawData.value.filter(item => {
    const matchCourse = !filters.value.course || item.courseName === filters.value.course
    const matchSearch = !filters.value.search || 
                       item.teacherName.toLowerCase().includes(filters.value.search.toLowerCase()) ||
                       item.courseName.toLowerCase().includes(filters.value.search.toLowerCase())
    return matchCourse && matchSearch
  })
})
</script>

<style scoped>
.evaluation-container {
  padding: 0;
  background: transparent;
}

.modern-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  padding: 24px 32px;
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
.filter-group { display: flex; gap: 12px; }

/* 词云概览 */
.word-cloud-card {
  margin-bottom: 24px;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.card-header i { font-size: 18px; color: #2b58ff; }
.card-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; }

.cloud-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.cloud-tag {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: #f8fafc;
}
.cloud-tag.primary { background: #eff6ff; color: #2b58ff; }
.cloud-tag.success { background: #ecfdf5; color: #10b981; }
.cloud-tag.warning { background: #fffbeb; color: #f59e0b; }
.cloud-tag.danger { background: #fef2f2; color: #ef4444; }
.cloud-tag.info { background: #f5f3ff; color: #8b5cf6; }

/* 评价卡片列表 */
.evaluation-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.eval-card-modern {
  display: flex;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  border: 1px solid #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.eval-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
  border-color: #2b58ff;
}

.card-side-accent {
  width: 6px;
  background: linear-gradient(to bottom, #2b58ff, #7c3aed);
  opacity: 0.8;
}

.card-main {
  flex: 1;
  display: flex;
  padding: 24px;
  gap: 32px;
  align-items: center;
}

/* 左侧：教师信息 */
.teacher-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 100px;
  padding-right: 24px;
  border-right: 1px dashed #e2e8f0;
}

.avatar-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
}

.teacher-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
}

.teacher-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.t-name { font-size: 15px; font-weight: 800; color: #1e293b; }
.t-title { font-size: 11px; color: #94a3b8; font-weight: 600; }

/* 中间：内容 */
.eval-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.eval-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags-row { display: flex; gap: 8px; }
.tag-course { background: #eff6ff; color: #2b58ff; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; }
.tag-class { background: #f8fafc; color: #64748b; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; }
.eval-date { font-size: 12px; color: #94a3b8; }

.eval-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.text-block p {
  margin: 0;
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
}

.block-label {
  font-size: 12px;
  font-weight: 800;
  color: #2b58ff;
  margin-bottom: 4px;
  display: inline-block;
}

.text-block.suggestion {
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 12px;
  border-left: 3px solid #10b981;
}

.text-block.suggestion .block-label { color: #10b981; }

/* 右侧：评分环 */
.eval-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  padding-left: 24px;
  border-left: 1px dashed #e2e8f0;
}

.score-circle {
  width: 70px;
  height: 70px;
}

.circular-chart {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: #f1f5f9;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 3.8;
  stroke-linecap: round;
  stroke: #2b58ff;
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  0% { stroke-dasharray: 0 100; }
}

.percentage {
  fill: #1e293b;
  font-family: sans-serif;
  font-size: 10px;
  font-weight: 800;
  text-anchor: middle;
}

.score-text {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 20px;
}
.empty-icon { font-size: 48px; margin-bottom: 16px; }

@media (max-width: 900px) {
  .card-main { flex-direction: column; align-items: flex-start; gap: 20px; }
  .teacher-profile { border-right: none; border-bottom: 1px dashed #e2e8f0; padding-right: 0; padding-bottom: 16px; width: 100%; flex-direction: row; }
  .eval-score { border-left: none; border-top: 1px dashed #e2e8f0; padding-left: 0; padding-top: 16px; width: 100%; flex-direction: row; justify-content: flex-end; }
}
</style>
