<template>
  <div class="teaching-dashboard">
    <!-- 0. 专业信息头部 -->
    <div class="major-info-header">
      <div class="major-title-box">
        <div class="major-icon">
          <i class="el-icon-cpu"></i>
        </div>
        <div class="major-text">
          <h2 class="major-name">人工智能</h2>
          <p class="semester-info">2025-2026学年 第二学期 | 当前第 8 周</p>
        </div>
      </div>
      <div class="major-stats">
        <div class="stat-mini">
          <span class="label">在修课程</span>
          <span class="value">6 门</span>
        </div>
        <div class="stat-mini">
          <span class="label">本周学时</span>
          <span class="value">28</span>
        </div>
      </div>
    </div>

    <!-- 0.5 学习数据概览 -->
    <div class="learning-overview-row">
      <div v-for="stat in learningStats" :key="stat.label" class="overview-stat-card">
        <div class="stat-content">
          <span class="stat-label">{{ stat.label }}</span>
          <div class="stat-value-group">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-unit">{{ stat.unit }}</span>
          </div>
        </div>
        <div class="stat-footer">
          <span class="stat-trend" :class="{ 'positive': stat.trend.includes('+') }">
            {{ stat.trend }} <i :class="stat.trend.includes('+') ? 'el-icon-top' : 'el-icon-right'"></i>
          </span>
          <div class="stat-mini-chart" :style="{ background: stat.color + '20' }">
            <div class="chart-bar" :style="{ width: '70%', background: stat.color }"></div>
          </div>
        </div>
      </div>

      <!-- 新增：整合后的今日安排微型看板 -->
      <div class="overview-stat-card schedule-mini-card" @click="showFullCalendar = true">
        <div class="stat-content">
          <div class="schedule-header">
            <span class="stat-label">今日安排</span>
            <el-tooltip content="月度时间表" placement="top">
              <div class="mini-cal-btn-wrapper" @click.stop="showFullCalendar = true">
                <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
                  <path d="M832 128H736V64h-64v64H352V64h-64v64H192c-35.2 0-64 28.8-64 64v704c0 35.2 28.8 64 64 64h640c35.2 0 64-28.8 64-64V192c0-35.2-28.8-64-64-64z m0 768H192V416h640v480z m0-544H192v-64h128v64h64v-64h320v64h64v-64h128v64z"></path>
                </svg>
              </div>
            </el-tooltip>
          </div>
          <div class="mini-schedule-list">
            <div v-for="(item, index) in todaySchedule.slice(0, 3)" :key="index" class="mini-schedule-item" :class="{ 'is-now': item.isCurrent }">
              <span class="m-time">{{ item.time }}</span>
              <span class="m-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>




    <!-- 2. 课程中心 - 按课程组织作业、考试、出勤、互动 -->
    <div class="courses-section">
      <div class="section-header">
        <div class="title-with-icon">
          <i class="el-icon-notebook-1"></i>
          <h3 class="section-title">我的课程</h3>
        </div>
      </div>

      <div class="course-grid">
        <div v-for="course in courses" :key="course.id" class="course-modern-card">
          <!-- 1. 顶部：名称与进度 -->
          <div class="card-header-top">
            <div class="course-brand">
              <div class="brand-icon" :style="{ background: course.color + '15', color: course.color }">
                <i :class="course.icon"></i>
              </div>
              <div class="brand-info">
                <h4 class="course-name">{{ course.name }}</h4>
                <span class="teacher-label">{{ course.teacher }}</span>
              </div>
            </div>
            <div class="header-right-meta">
              <div class="grade-badge" :class="getGradeClass(course.grade)">{{ course.grade }}</div>
              <div class="completion-box">
                <span class="comp-val">{{ course.totalProgress }}%</span>
                <span class="comp-txt">完成度</span>
              </div>
            </div>
          </div>

          <!-- 2. 进度条 -->
          <div class="course-progress-linear">
            <el-progress 
              :percentage="course.totalProgress" 
              :color="course.color" 
              :show-text="false" 
              :stroke-width="8"
            ></el-progress>
          </div>

          <!-- 3. 进行中的任务 (Highlight) -->
          <div class="ongoing-task-alert" @click="handleOpenDetail(course, 'homework')">
            <i class="el-icon-warning-outline alert-icon"></i>
            <div class="alert-content">
              <span class="alert-label">当前任务</span>
              <span class="alert-task">{{ course.ongoingTask }}</span>
            </div>
          </div>

          <!-- 4. 数据矩阵 (2x2 Grid) -->
          <div class="data-matrix">
            <div class="matrix-item" @click="handleOpenDetail(course, 'homework')">
              <div class="m-icon homework">📘</div>
              <div class="m-data">
                <span class="m-val">{{ course.homework.completed }}/{{ course.homework.total }}</span>
                <span class="m-lab">作业进度</span>
              </div>
            </div>
            <div class="matrix-item" @click="handleOpenDetail(course, 'exam')">
              <div class="m-icon exam">🏆</div>
              <div class="m-data">
                <span class="m-val">{{ course.exam.score || '待考' }}</span>
                <span class="m-lab">考试成绩</span>
              </div>
            </div>
            <div class="matrix-item" @click="handleOpenDetail(course, 'attendance')">
              <div class="m-icon attendance">👤</div>
              <div class="m-data">
                <span class="m-val">{{ course.attendance.rate }}%</span>
                <span class="m-lab">出勤率</span>
              </div>
            </div>
            <div class="matrix-item" @click="handleOpenDetail(course, 'interaction')">
              <div class="m-icon interaction">💬</div>
              <div class="m-data">
                <span class="m-val">{{ course.interaction.count }}</span>
                <span class="m-lab">互动次数</span>
              </div>
            </div>
          </div>

          <!-- 5. 底部动作 -->
          <div class="card-footer-btns">
            <el-button type="text" class="detail-btn" @click="handleOpenDetail(course, 'info')">课程详情</el-button>
            <el-button type="primary" size="small" class="enter-btn" :style="{ background: course.color, borderColor: course.color }">进入课程</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程详情侧滑面板 (Drawer) -->
    <el-drawer
      v-model="showDetailDrawer"
      :with-header="false"
      size="600px"
      direction="rtl"
      custom-class="course-detail-drawer"
      :destroy-on-close="true"
    >
      <div v-if="activeCourse" class="drawer-container">
        <!-- 侧滑头部：课程简报 -->
        <div class="drawer-header" :style="{ background: activeCourse.color }">
          <div class="header-main">
            <div class="header-brand">
              <div class="h-icon-box">
                <i :class="activeCourse.icon" class="h-icon"></i>
              </div>
              <div class="h-info">
                <h2>{{ activeCourse.name }}</h2>
                <span>{{ activeCourse.teacher }} 教授 · 2024春季学期</span>
              </div>
            </div>
            <div class="header-grade">
              <span class="g-letter">{{ activeCourse.grade }}</span>
              <span class="g-label">当前评级</span>
            </div>
          </div>
          
          <!-- 维度切换 Tabs -->
          <div class="drawer-tabs">
            <div 
              v-for="tab in detailTabs" 
              :key="tab.id" 
              class="drawer-tab-item"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <i :class="tab.icon"></i>
              {{ tab.label }}
            </div>
          </div>
        </div>

        <!-- 侧滑主体：各维度详情视图 -->
        <div class="drawer-body">
          <!-- 1. 作业视图 -->
          <div v-if="activeTab === 'homework'" class="tab-view homework-view">
            <div class="view-section">
              <h3 class="view-title">作业完成趋势</h3>
              <div class="mini-stats-grid">
                <div class="mini-stat-item">
                  <span class="m-val">{{ activeCourse.homework.total }}</span>
                  <span class="m-lab">应交总数</span>
                </div>
                <div class="mini-stat-item">
                  <span class="m-val">{{ activeCourse.homework.completed }}</span>
                  <span class="m-lab">已交总数</span>
                </div>
                <div class="mini-stat-item warning" v-if="activeCourse.homework.total - activeCourse.homework.completed > 0">
                  <span class="m-val">{{ activeCourse.homework.total - activeCourse.homework.completed }}</span>
                  <span class="m-lab">待补交</span>
                </div>
              </div>
            </div>
            
            <div class="view-section">
              <div class="section-header-inline">
                <h3 class="view-title">作业历史列表</h3>
                <el-button type="text" size="mini">筛选 <i class="el-icon-arrow-down"></i></el-button>
              </div>
              <div class="item-list">
                <div v-for="i in 5" :key="i" class="list-item">
                  <div class="item-status success"></div>
                  <div class="item-main">
                    <span class="item-title">实验作业 #0{{ 6-i }}：{{ activeCourse.ongoingTask }}</span>
                    <span class="item-meta">截止于 2024-05-{{ 20+i }} · 权重 15%</span>
                  </div>
                  <div class="item-score">
                    <span class="s-val">{{ 95 - i }}</span>
                    <span class="s-max">/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. 考试视图 -->
          <div v-if="activeTab === 'exam'" class="tab-view exam-view">
            <div class="view-section">
              <h3 class="view-title">考试安排与成绩评估</h3>
              <div class="exam-card-detailed">
                <div class="exam-main-score">
                  <span class="score-num">{{ activeCourse.exam.score || '--' }}</span>
                  <span class="score-label">当前总成绩</span>
                </div>
                <div class="exam-breakdown">
                  <div class="b-item"><span>期中考试 (30%)</span><strong>92</strong></div>
                  <div class="b-item"><span>平时测验 (20%)</span><strong>88</strong></div>
                  <div class="b-item"><span>期末考试 (50%)</span><strong class="pending">未进行</strong></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 其他视图占位... (出勤、互动、课程详情) -->
          <div v-if="['attendance', 'interaction', 'info'].includes(activeTab)" class="tab-view empty-view">
            <div class="empty-placeholder">
              <i class="el-icon-timer"></i>
              <p>{{ detailTabs.find(t => t.id === activeTab).label }}详细数据正在从教务系统同步...</p>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- 4. 精简的月度工作日历弹窗 -->
    <el-dialog v-model="showFullCalendar" title="月度工作日历" width="900px" class="calendar-dialog">
      <div class="calendar-wrapper">
        <el-calendar v-model="currentCalendarDate">
          <template #date-cell="{ data }">
            <div class="calendar-day-cell" :class="{ 'is-today': data.isSelected }">
              <span class="day-number">{{ data.day.split('-').slice(2).join('') }}</span>
              <div class="day-events">
                <div v-for="(event, idx) in getEventsForDate(data.day)" :key="idx" class="event-dot" :class="event.type"></div>
              </div>
            </div>
          </template>
        </el-calendar>
        
        <!-- 当日事件详情小面板 -->
        <div class="selected-day-panel">
          <h4 class="panel-date">{{ currentCalendarDateFormatted }}</h4>
          <div class="panel-events">
            <div v-if="getEventsForDate(formatDate(currentCalendarDate)).length === 0" class="no-event">当日暂无日程</div>
            <div v-for="(event, idx) in getEventsForDate(formatDate(currentCalendarDate))" :key="idx" class="panel-event-item">
              <div class="event-time-tag">{{ event.time }}</div>
              <div class="event-name-text">{{ event.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showFullCalendar = ref(false)
const currentCalendarDate = ref(new Date())

// 格式化日期 YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const currentCalendarDateFormatted = computed(() => {
  const d = currentCalendarDate.value
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

const getGradeClass = (grade) => {
  if (grade.includes('A')) return 'grade-excellent'
  if (grade.includes('B')) return 'grade-good'
  return 'grade-normal'
}

// 侧滑面板控制
const showDetailDrawer = ref(false)
const activeCourse = ref(null)
const activeTab = ref('homework')

const detailTabs = [
  { id: 'homework', label: '作业详情', icon: 'el-icon-notebook-2' },
  { id: 'exam', label: '考试评估', icon: 'el-icon-trophy' },
  { id: 'attendance', label: '出勤统计', icon: 'el-icon-user' },
  { id: 'interaction', label: '课堂互动', icon: 'el-icon-chat-line-round' },
  { id: 'info', label: '课程大纲', icon: 'el-icon-info' }
]

const handleOpenDetail = (course, tabId) => {
  activeCourse.value = course
  activeTab.value = tabId || 'homework'
  showDetailDrawer.value = true
}

// 模拟事件数据
const calendarEvents = {
  '2026-04-27': [
    { time: '08:00', name: '人工智能导论', type: 'class' },
    { time: '10:00', name: '机器学习算法实践', type: 'practice' },
    { time: '14:00', name: '大模型前沿讲座', type: 'lecture' }
  ],
  '2026-04-28': [
    { time: '09:00', name: '深度学习实训', type: 'practice' },
    { time: '15:00', name: '实验室组会', type: 'meeting' }
  ],
  '2026-04-29': [
    { time: '08:00', name: '人工智能导论', type: 'class' },
    { time: '19:00', name: '在线代码答疑', type: 'support' }
  ]
}

const getEventsForDate = (dateStr) => {
  return calendarEvents[dateStr] || []
}

// 1. 今日日程数据
const todaySchedule = [
  { time: '08:00', tag: '课程', name: '人工智能导论', location: '主楼 A204', type: 'class', isCurrent: false, isPast: true },
  { time: '10:00', tag: '实践', name: '机器学习算法实践', location: '人工智能实验室', type: 'practice', isCurrent: true, isPast: false },
  { time: '14:00', tag: '讲座', name: '大模型前沿技术', location: '科技馆报告厅', type: 'lecture', isCurrent: false, isPast: false },
  { time: '16:00', tag: '会议', name: '科研小组周会', location: '401 研讨室', type: 'meeting', isCurrent: false, isPast: false },
  { time: '19:00', tag: '辅导', name: '代码实测指导', location: '在线', type: 'support', isCurrent: false, isPast: false }
]



// 0.5 学习概览数据
const learningStats = [
  { label: '累计学习时长', value: '128', unit: '小时', trend: '+12%', color: '#6366f1' },
  { label: '掌握知识点', value: '342', unit: '个', trend: '+5', color: '#10b981' },
  { label: '作业提交率', value: '98', unit: '%', trend: '稳定', color: '#f59e0b' },
  { label: '课程平均分', value: '92.5', unit: '分', trend: '+2.1', color: '#8b5cf6' }
]

// 2. 课程中心数据
const courses = [
  {
    id: 1,
    name: '人工智能导论',
    teacher: '周志华 教授',
    icon: 'el-icon-monitor',
    color: '#3b82f6',
    totalProgress: 85,
    grade: 'A',
    ongoingTask: '期末论文大纲提交',
    homework: { completed: 10, total: 12, status: 'normal', statusText: '2份待交' },
    exam: { score: 95, status: 'good', statusText: '优' },
    attendance: { rate: 100, status: 'perfect', statusText: '全勤' },
    interaction: { count: 24, status: 'active', statusText: '活跃' }
  },
  {
    id: 2,
    name: '机器学习',
    teacher: '吴恩达 教授',
    icon: 'el-icon-cpu',
    color: '#10b981',
    totalProgress: 65,
    grade: 'B+',
    ongoingTask: '实验三：聚类算法实现',
    homework: { completed: 6, total: 6, status: 'finished', statusText: '已完成' },
    exam: { score: null, status: 'pending', statusText: '待考' },
    attendance: { rate: 98, status: 'normal', statusText: '正常' },
    interaction: { count: 18, status: 'normal', statusText: '良好' }
  },
  {
    id: 3,
    name: '深度学习',
    teacher: '李宏毅 教授',
    icon: 'el-icon-connection',
    color: '#8b5cf6',
    totalProgress: 45,
    grade: 'B',
    ongoingTask: 'Transformer 结构复现',
    homework: { completed: 4, total: 8, status: 'warning', statusText: '截止预警' },
    exam: { score: 88, status: 'good', statusText: '良' },
    attendance: { rate: 92, status: 'warning', statusText: '异常' },
    interaction: { count: 10, status: 'normal', statusText: '良好' }
  },
  {
    id: 4,
    name: '自然语言处理',
    teacher: '孙茂松 教授',
    icon: 'el-icon-chat-square',
    color: '#f59e0b',
    totalProgress: 90,
    grade: 'A+',
    ongoingTask: '预训练模型微调实验',
    homework: { completed: 15, total: 15, status: 'finished', statusText: '已完成' },
    exam: { score: 98, status: 'perfect', statusText: '优+' },
    attendance: { rate: 100, status: 'perfect', statusText: '全勤' },
    interaction: { count: 32, status: 'super', statusText: '积极' }
  },
  {
    id: 5,
    name: '计算机视觉',
    teacher: '李飞飞 教授',
    icon: 'el-icon-view',
    color: '#ec4899',
    totalProgress: 35,
    grade: 'B-',
    ongoingTask: '目标检测算法优化',
    homework: { completed: 3, total: 10, status: 'normal', statusText: '进行中' },
    exam: { score: null, status: 'pending', statusText: '待考' },
    attendance: { rate: 100, status: 'perfect', statusText: '全勤' },
    interaction: { count: 5, status: 'low', statusText: '待提升' }
  },
  {
    id: 6,
    name: '强化学习',
    teacher: '陈杰 教授',
    icon: 'el-icon-odometer',
    color: '#6366f1',
    totalProgress: 55,
    grade: 'A-',
    ongoingTask: 'Q-Learning 迷宫避障',
    homework: { completed: 8, total: 12, status: 'normal', statusText: '进行中' },
    exam: { score: 90, status: 'good', statusText: '良' },
    attendance: { rate: 96, status: 'normal', statusText: '正常' },
    interaction: { count: 12, status: 'active', statusText: '活跃' }
  }
]
</script>

<style scoped>
.teaching-dashboard {
  padding: 24px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 0. 专业头部 */
.major-info-header {
  background: linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%);
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 32px 40px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 15px 35px rgba(30, 27, 75, 0.25);
}

.major-info-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.major-title-box {
  display: flex;
  align-items: center;
  gap: 20px;
}

.major-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.major-name {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 1px;
  text-align: left;
}

.semester-info {
  margin: 4px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
}

.major-stats {
  display: flex;
  gap: 40px;
}

.stat-mini {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stat-mini .label {
  font-size: 12px;
  opacity: 0.8;
}

.stat-mini .value {
  font-size: 24px;
  font-weight: 700;
}

/* 0.5 学习概览 */
.learning-overview-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.overview-stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
}

.stat-value-group {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
}

.stat-unit {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.stat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.stat-trend {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 2px;
}

.stat-trend.positive {
  color: #10b981;
}

.stat-mini-chart {
  width: 60px;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  border-radius: 2px;
}

/* 整合日程微型卡片样式 */
.schedule-mini-card {
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
}
.schedule-mini-card:hover {
  transform: translateY(-4px);
  border-color: #4f46e550;
}
.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.more-icon { font-size: 10px; color: #94a3b8; }
.mini-cal-btn-wrapper {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(79, 70, 229, 0.08);
  color: #4f46e5;
  transition: all 0.2s;
  cursor: pointer;
}
.mini-cal-btn-wrapper:hover {
  background: #4f46e5;
  color: white;
  transform: scale(1.1);
}

/* 课程详情侧滑面板 (Drawer) 样式 */
:deep(.course-detail-drawer) {
  background: #f8fafc;
  border-left: 1px solid #e2e8f0;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 0;
}

.drawer-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 30px 24px;
  color: white;
  position: relative;
  overflow: hidden;
}

.drawer-header::after {
  content: '';
  position: absolute;
  top: -20%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-brand {
  display: flex;
  gap: 16px;
  align-items: center;
}

.h-icon {
  font-size: 40px;
  background: rgba(255,255,255,0.2);
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
}

.h-info h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.h-info span {
  font-size: 14px;
  opacity: 0.8;
}

.header-grade {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.g-letter {
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}

.g-label {
  font-size: 11px;
  opacity: 0.8;
}

.drawer-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.drawer-tab-item {
  padding: 8px 16px;
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.drawer-tab-item.active {
  background: white;
  color: #1e293b;
}

.drawer-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.view-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.view-title {
  margin: 0 0 16px 0;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.mini-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.mini-stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
}

.mini-stat-item .m-val {
  font-size: 18px;
  font-weight: 800;
}

.mini-stat-item .m-lab {
  font-size: 11px;
  color: #94a3b8;
}

.mini-stat-item.warning .m-val { color: #ef4444; }

.item-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.item-status.success {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
}

.item-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.item-meta {
  font-size: 11px;
  color: #94a3b8;
}

.item-score {
  text-align: right;
}

.item-score .s-val {
  font-size: 16px;
  font-weight: 800;
  color: #4f46e5;
}

.item-score .s-max {
  font-size: 11px;
  color: #94a3b8;
}

.exam-card-detailed {
  display: flex;
  align-items: center;
  gap: 30px;
}

.exam-main-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f5f3ff;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  justify-content: center;
}

.score-num {
  font-size: 28px;
  font-weight: 900;
  color: #7c3aed;
  line-height: 1;
}

.score-label {
  font-size: 9px;
  color: #7c3aed;
  opacity: 0.8;
  margin-top: 4px;
}

.exam-breakdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.b-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  border-bottom: 1px dashed #f1f5f9;
  padding-bottom: 4px;
}

.b-item strong { color: #1e293b; }

.empty-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #94a3b8;
}

.empty-placeholder {
  text-align: center;
}

.empty-placeholder i {
  font-size: 40px;
  margin-bottom: 16px;
}
.mini-schedule-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mini-schedule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  padding: 4px 0;
  border-bottom: 1px dashed rgba(0,0,0,0.03);
}
.mini-schedule-item:last-child { border-bottom: none; }
.mini-schedule-item .m-time { 
  font-weight: 700; color: #4f46e5; 
  background: #f5f3ff; padding: 1px 4px; border-radius: 4px;
}
.mini-schedule-item .m-name { 
  color: #334155; font-weight: 600; 
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; 
}
.mini-schedule-item.is-now { background: #eff6ff; border-radius: 4px; padding: 4px 6px; margin: 0 -6px; }
.mini-schedule-item.is-now .m-name { color: #2563eb; }




/* 2. 课程网格样式重构 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.course-modern-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.course-modern-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border-color: #e2e8f0;
}

/* 顶部：名称与进度 */
.card-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.course-brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.course-name {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
}

.teacher-label {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.completion-box {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.header-right-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.grade-badge {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 900;
  font-family: 'Outfit', sans-serif;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.grade-excellent {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}

.grade-good {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #dcfce7;
}

.grade-normal {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #f1f5f9;
}

.comp-val {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.comp-txt {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 4px;
}

/* 进度条 */
.course-progress-linear {
  margin-top: -8px;
}

/* 进行中的任务 */
.ongoing-task-alert {
  background: #fffbeb;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  border: 1px solid #fef3c7;
}

.alert-icon {
  color: #d97706;
  font-size: 16px;
}

.alert-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.alert-label {
  font-size: 10px;
  color: #b45309;
  font-weight: 700;
}

.alert-task {
  font-size: 12px;
  color: #1e293b;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 数据矩阵 2x2 */
.data-matrix {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.matrix-item {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.m-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.m-icon.homework { background: #eff6ff; color: #3b82f6; }
.m-icon.exam { background: #fdf2f8; color: #db2777; }
.m-icon.attendance { background: #f0fdf4; color: #16a34a; }
.m-icon.interaction { background: #f5f3ff; color: #7c3aed; }

.m-data {
  display: flex;
  flex-direction: column;
}

.m-val {
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
}

.m-lab {
  font-size: 10px;
  color: #94a3b8;
}

/* 底部动作 */
.card-footer-btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px dashed #f1f5f9;
}

/* 4. 精简的月度工作日历弹窗 */
.calendar-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.calendar-wrapper {
  display: flex;
  gap: 20px;
  height: 600px;
}

:deep(.el-calendar) {
  flex: 1;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

:deep(.el-calendar-table .el-calendar-day) {
  height: auto;
  min-height: 80px;
  padding: 8px;
}

.calendar-day-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.day-number {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.day-events {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.event-dot.class { background: #3b82f6; }
.event-dot.practice { background: #10b981; }
.event-dot.lecture { background: #f59e0b; }
.event-dot.meeting { background: #64748b; }
.event-dot.support { background: #8b5cf6; }

.selected-day-panel {
  width: 280px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.panel-date {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.panel-events {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.panel-event-item {
  background: white;
  padding: 12px;
  border-radius: 10px;
  border-left: 4px solid #4f46e5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.event-time-tag {
  font-size: 11px;
  font-weight: 800;
  color: #4f46e5;
  margin-bottom: 4px;
}

.event-name-text {
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
}

.no-event {
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
  margin-top: 40px;
}
</style>
