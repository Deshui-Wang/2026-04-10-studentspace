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
    </div>

    <!-- 1. 今日日程 (精简横向时间轴) -->
    <div class="schedule-section">
      <div class="section-header">
        <div class="title-with-icon">
          <i class="el-icon-date"></i>
          <h3 class="section-title">今日日程</h3>
        </div>
        <el-button type="primary" size="small" plain @click="showFullCalendar = true" class="calendar-btn">
          查看完整课表
        </el-button>
      </div>
      
      <div class="timeline-container">
        <div class="timeline-track">
          <div v-for="(item, index) in todaySchedule" :key="index" class="timeline-item" :class="{ 'is-current': item.isCurrent, 'is-past': item.isPast }">
            <div class="item-header">
              <div class="timeline-dot"></div>
              <span class="item-time">{{ item.time }}</span>
            </div>
            <div class="item-card">
              <div class="card-top">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-tag" :class="item.type">{{ item.tag }}</span>
              </div>
              <div class="item-location">
                <i class="el-icon-location-information"></i> {{ item.location }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 1.5 进行中的学习任务 (新增横条区域) -->
    <div class="ongoing-tasks-section">
      <div class="section-header">
        <div class="title-with-icon">
          <i class="el-icon-collection-tag"></i>
          <h3 class="section-title">进行中的学习任务</h3>
        </div>
        <div class="header-more">
          <span class="task-count">当前有 4 个任务进行中</span>
        </div>
      </div>
      
      <div class="tasks-horizontal-container">
        <div v-for="task in ongoingTasks" :key="task.id" class="task-horizontal-card">
          <div class="task-top">
            <span class="task-type-tag" :style="{ background: task.color + '15', color: task.color }">{{ task.type }}</span>
            <span class="task-deadline">{{ task.deadline }}</span>
          </div>
          <div class="task-info">
            <h4 class="task-name">{{ task.name }}</h4>
            <p class="task-course">{{ task.course }}</p>
          </div>
          <div class="task-progress-box">
            <div class="progress-info">
              <span class="progress-label">当前进度</span>
              <span class="progress-val">{{ task.progress }}%</span>
            </div>
            <el-progress :percentage="task.progress" :color="task.color" :show-text="false" :stroke-width="6"></el-progress>
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
        <div v-for="course in courses" :key="course.id" class="course-main-card">
          <div class="course-card-header">
            <div class="course-icon" :style="{ background: course.color + '15', color: course.color }">
              <i :class="course.icon"></i>
            </div>
            <div class="course-info">
              <h4 class="course-name">{{ course.name }}</h4>
              <span class="teacher-name">任课教师：{{ course.teacher }}</span>
            </div>
            <div class="course-progress">
              <el-progress type="circle" :percentage="course.totalProgress" :width="40" :stroke-width="4" :color="course.color"></el-progress>
            </div>
          </div>

          <div class="course-metrics-tabs">
            <div class="metric-item">
              <div class="metric-icon homework"><i class="el-icon-edit-outline"></i></div>
              <div class="metric-content">
                <span class="m-label">作业</span>
                <span class="m-value">{{ course.homework.completed }}/{{ course.homework.total }}</span>
              </div>
              <div class="m-status" :class="course.homework.status">{{ course.homework.statusText }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-icon exam"><i class="el-icon-document-checked"></i></div>
              <div class="metric-content">
                <span class="m-label">考试</span>
                <span class="m-value">{{ course.exam.score || '--' }}</span>
              </div>
              <div class="m-status" :class="course.exam.status">{{ course.exam.statusText }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-icon attendance"><i class="el-icon-user"></i></div>
              <div class="metric-content">
                <span class="m-label">出勤</span>
                <span class="m-value">{{ course.attendance.rate }}%</span>
              </div>
              <div class="m-status" :class="course.attendance.status">{{ course.attendance.statusText }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-icon interaction"><i class="el-icon-chat-dot-round"></i></div>
              <div class="metric-content">
                <span class="m-label">互动</span>
                <span class="m-value">{{ course.interaction.count }}次</span>
              </div>
              <div class="m-status" :class="course.interaction.status">{{ course.interaction.statusText }}</div>
            </div>
          </div>

          <div class="course-footer">
            <el-button type="text" size="small">课程详情 <i class="el-icon-arrow-right"></i></el-button>
            <el-button type="primary" size="mini" round>去学习</el-button>
          </div>
        </div>
      </div>
    </div>

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

// 1.5 进行中的学习任务数据
const ongoingTasks = [
  { id: 1, name: '深度学习导论 - 实验一', course: '深度学习', deadline: '剩余 2天', progress: 45, type: '实验', color: '#8b5cf6' },
  { id: 2, name: '人工智能伦理报告', course: '人工智能导论', deadline: '剩余 5天', progress: 80, type: '作业', color: '#3b82f6' },
  { id: 3, name: '卷积神经网络大作业', course: '计算机视觉', deadline: '剩余 12天', progress: 15, type: '项目', color: '#ec4899' },
  { id: 4, name: '自然语言处理 - 期中测验', course: '自然语言处理', deadline: '剩余 1天', progress: 0, type: '考试', color: '#f59e0b' }
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
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
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

/* 1. 今日日程 */
.schedule-section {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e293b;
}

.title-with-icon i {
  font-size: 20px;
  color: #4f46e5;
}

.section-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
}

.timeline-container {
  overflow-x: auto;
  padding: 10px 0;
}

.timeline-track {
  display: flex;
  gap: 20px;
  min-width: max-content;
  position: relative;
}

.timeline-track::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
  height: 2px;
  background: #f1f5f9;
  z-index: 1;
}

.timeline-item {
  position: relative;
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 2;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  background: white;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  flex-shrink: 0;
}

.item-time {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
}

.item-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
  gap: 8px;
}

.item-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
}

.item-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  white-space: nowrap;
}

.item-tag.class { background: #e0e7ff; color: #4338ca; }
.item-tag.practice { background: #dcfce7; color: #15803d; }
.item-tag.lecture { background: #fef3c7; color: #b45309; }
.item-tag.meeting { background: #f1f5f9; color: #475569; }
.item-tag.support { background: #f5f3ff; color: #6d28d9; }

.item-location {
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.timeline-item.is-current .timeline-dot {
  border-color: #4f46e5;
  background: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
}

.timeline-item.is-current .item-time { color: #4f46e5; }
.timeline-item.is-current .item-card {
  border-color: #4f46e5;
  background: white;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.1);
}

.timeline-item.is-past { opacity: 0.6; }

/* 1.5 进行中的学习任务 */
.ongoing-tasks-section {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.tasks-horizontal-container {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.tasks-horizontal-container::-webkit-scrollbar {
  height: 4px;
}
.tasks-horizontal-container::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.task-horizontal-card {
  min-width: 280px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-horizontal-card:hover {
  transform: translateY(-2px);
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background: white;
}

.task-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-type-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.task-deadline {
  font-size: 12px;
  color: #ef4444;
  font-weight: 600;
}

.task-name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.task-course {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.task-progress-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
  font-size: 11px;
  color: #94a3b8;
}

.progress-val {
  font-size: 11px;
  font-weight: 700;
  color: #1e293b;
}

.task-count {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}


/* 2. 课程网格 */
.courses-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 2. 课程列表 (横向单行优化) */
.course-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-main-card {
  background: white;
  border-radius: 16px;
  padding: 16px 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
}

.course-main-card:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  border-color: #4f46e530;
}

.course-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 280px;
  flex-shrink: 0;
  margin-bottom: 0;
}

.course-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.course-info {
  flex-grow: 1;
  min-width: 0;
}

.course-name {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.teacher-name {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  display: block;
}

.course-progress {
  flex-shrink: 0;
}

.course-metrics-tabs {
  display: flex;
  flex: 1;
  gap: 16px;
  margin-bottom: 0;
}

.metric-item {
  flex: 1;
  background: #f8fafc;
  border-radius: 10px;
  padding: 8px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  position: relative;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.metric-item:hover {
  background: white;
  border-color: #e2e8f0;
}

.metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.metric-icon.homework { background: #eff6ff; color: #3b82f6; }
.metric-icon.exam { background: #f0fdf4; color: #10b981; }
.metric-icon.attendance { background: #fff7ed; color: #f59e0b; }
.metric-icon.interaction { background: #f5f3ff; color: #8b5cf6; }

.metric-content {
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 600;
}

.m-value {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
}

.m-status {
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 8px;
  font-weight: 700;
  position: absolute;
  top: 4px;
  right: 6px;
}

.m-status.normal { background: #f1f5f9; color: #64748b; }
.m-status.good { background: #dcfce7; color: #15803d; }
.m-status.perfect { background: #d1fae5; color: #065f46; }
.m-status.warning { background: #fee2e2; color: #b91c1c; }
.m-status.finished { background: #f0f9ff; color: #0369a1; }
.m-status.active { background: #ede9fe; color: #5b21b6; }
.m-status.super { background: #fae8ff; color: #86198f; }

.course-footer {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .course-main-card { gap: 16px; }
  .course-card-header { width: 220px; }
  .course-metrics-tabs { gap: 8px; }
  .metric-item { padding: 6px 8px; gap: 6px; }
  .metric-icon { width: 28px; height: 28px; font-size: 14px; }
  .m-status { display: none; } /* 空间不足时隐藏状态小标签 */
}

@media (max-width: 900px) {
  .course-main-card { flex-wrap: wrap; }
  .course-card-header { width: 100%; }
  .course-metrics-tabs { width: 100%; display: grid; grid-template-columns: 1fr 1fr; }
  .course-footer { width: 100%; justify-content: flex-end; border-top: 1px solid #f1f5f9; padding-top: 12px; }
  .major-info-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  .major-stats { width: 100%; justify-content: space-between; }
}

/* 日历弹窗样式 */
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
