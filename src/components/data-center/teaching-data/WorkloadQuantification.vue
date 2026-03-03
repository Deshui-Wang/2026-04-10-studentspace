<template>
  <div class="workload-quantification">
    <!-- 标题和上传按钮行 -->
    <div class="title-section">
      <h3 class="module-title">本周无课时间：4.7小时/天（大把的时光，你打算用来干嘛呢？）</h3>
    </div>
        <!-- 筛选行 -->
        <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>课程：</label>
          <el-select 
            v-model="selectedCourse" 
            placeholder="全部课程" 
            clearable 
            @change="handleFilterChange"
            class="course-select"
          >
            <el-option label="全部课程" value="" />
            <el-option v-for="course in courseOptions" :key="course.value" :label="course.label" :value="course.value" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>类型：</label>
          <el-select 
            v-model="selectedType" 
            placeholder="全部类型" 
            clearable 
            @change="handleFilterChange"
            class="type-select"
          >
            <el-option label="全部类型" value="" />
            <el-option v-for="type in typeOptions" :key="type.value" :label="type.label" :value="type.value" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>学期：</label>
          <el-select 
            v-model="selectedSemester" 
            placeholder="全部学期" 
            clearable 
            @change="handleFilterChange"
            class="semester-select"
          >
            <el-option label="全部学期" value="" />
            <el-option v-for="semester in semesterOptions" :key="semester.value" :label="semester.label" :value="semester.value" />
          </el-select>
        </div>
      </div>
    </div>
    <!-- 第一部分：日历和当日课程 -->
    <div class="calendar-section">
      <div class="calendar-container">
        <div class="calendar-header">
          <div class="calendar-title">
            <h3>{{ currentMonthFormatted }}</h3>
            <div class="month-nav">
              <button @click="previousMonth" class="nav-btn" title="上一个月">‹</button>
              <button @click="nextMonth" class="nav-btn" title="下一个月">›</button>
            </div>
          </div>
          <div class="quick-actions">
            <button @click="goToToday" class="today-btn">今天</button>
            <button @click="showYearPicker = !showYearPicker" class="year-picker-btn">
              {{ currentYear }}年
            </button>
            <div v-if="showYearPicker" class="year-picker">
              <div class="year-picker-header">
                <span>选择年份</span>
                <button @click="showYearPicker = false" class="close-btn">×</button>
              </div>
              <div class="year-list">
                <div 
                  v-for="year in availableYears" 
                  :key="year"
                  :class="['year-item', { 'active': year === currentYear }]"
                  @click="selectYear(year)"
                >
                  {{ year }}年
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="calendar-grid">
          <div class="calendar-weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
          </div>
          <div class="calendar-days">
            <div 
              v-for="day in monthDays" 
              :key="day.date" 
              :class="['calendar-day', { 
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'selected': day.date === selectedDate,
                'has-courses': day.courseCount > 0
              }]"
              @click="selectDate(day.date)"
            >
              <span class="day-number">{{ day.day }}</span>
              <span v-if="day.courseCount > 0" class="course-count">{{ day.courseCount }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="daily-courses">
        <div class="daily-courses-header">
          <h3>{{ selectedDateFormatted }} 课程安排</h3>
          <div class="course-count-badge" v-if="dailyCourses.length > 0">
            共 {{ dailyCourses.length }} 节课
          </div>
        </div>
        <div class="courses-list">
          <div v-if="dailyCourses.length === 0" class="no-courses">
            <div class="no-courses-icon"></div>
            <p>暂无课程安排</p>
          </div>
          <div v-else>
            <div v-for="(course, index) in dailyCourses" :key="course.id" class="course-item">
              <div class="course-time">
                <div class="time-slot">{{ course.timeSlot }}</div>
              </div>
              <div class="course-info">
                <div class="info-top">
                  <div class="title-line">
                    <span class="course-name">{{ course.name }}</span>
                    <span class="course-code">（{{ course.code }}）</span>
                  </div>
                  <div class="type-badge">
                    <span class="course-type-badge" :class="course.type.toLowerCase()">{{ course.type }}</span>
                  </div>
                </div>
                <div class="info-bottom">
                  <span class="classroom">{{ course.classroom }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 其他日程模块 -->
    <div class="other-schedule-section">
      <div class="other-schedule">
        <div class="other-schedule-header">
          <h3>其他日程</h3>
          <div class="schedule-count-badge" v-if="otherSchedules.length > 0">
            共 {{ otherSchedules.length }} 项
          </div>
        </div>
        <div class="schedule-list">
          <div v-if="otherSchedules.length === 0" class="no-schedules">
            <div class="no-schedules-icon">📅</div>
            <p>暂无其他日程安排</p>
          </div>
          <div v-else>
            <div v-for="(schedule, index) in otherSchedules" :key="schedule.id" class="schedule-item">
              <div class="schedule-time">
                <div class="time-slot">{{ schedule.timeSlot }}</div>
                <div class="date-info">{{ schedule.dateInfo }}</div>
              </div>
              <div class="schedule-info">
                <div class="info-top">
                  <div class="title-line">
                    <span class="schedule-title">{{ schedule.title }}</span>
                    <span class="schedule-type">{{ schedule.type }}</span>
                  </div>
                  <div class="priority-badge">
                    <span class="priority" :class="schedule.priority.toLowerCase()">{{ schedule.priority }}</span>
                  </div>
                </div>
                <div class="info-bottom">
                  <span class="location">{{ schedule.location }}</span>
                  <span class="organizer">{{ schedule.organizer }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'

// Local date helpers to avoid UTC shift when using ISO strings
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const parseLocalDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  // 直接计算星期几，避免时区问题
  const date = new Date(year, month - 1, day)
  // 确保使用本地时间
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// 日历相关数据
const currentDate = ref(new Date())
const selectedDate = ref(formatDate(new Date()))
const showYearPicker = ref(false)

// 星期数组
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 时间槽配置
const timeSlots = [
  { start: '08:00', end: '09:40', period: 1 },
  { start: '10:00', end: '11:40', period: 2 },
  { start: '14:00', end: '15:40', period: 3 },
  { start: '16:00', end: '17:40', period: 4 },
  { start: '19:00', end: '20:40', period: 5 }
]

// 基础课程模板
const baseCourses = [
  {
    id: 1,
    code: 'HE101',
    name: '老年学概论',
    type: '理论课',
    classes: ['养老21-1班', '养老21-2班'],
    totalHours: 64,
    totalCredits: 4,
    progress: 75
  },
  {
    id: 2,
    code: 'HE102',
    name: '老年社会工作实务',
    type: '实践课',
    classes: ['养老21-1班'],
    totalHours: 48,
    totalCredits: 3,
    progress: 60
  },
  {
    id: 3,
    code: 'HE103',
    name: '老年心理护理实训',
    type: '实验课',
    classes: ['养老21-2班', '养老21-3班'],
    totalHours: 32,
    totalCredits: 2,
    progress: 45
  },
  {
    id: 4,
    code: 'HE104',
    name: '智慧养老终端实操',
    type: '实践课',
    classes: ['养老21-1班', '养老21-2班', '养老21-3班'],
    totalHours: 48,
    totalCredits: 3,
    progress: 60
  },
  {
    id: 5,
    code: 'HE105',
    name: '老年政策与法规',
    type: '理论课',
    classes: ['养老21-1班', '养老21-2班'],
    totalHours: 48,
    totalCredits: 3,
    progress: 60
  },
  {
    id: 6,
    code: 'HE106',
    name: '健康管理学',
    type: '理论课',
    classes: ['养老21-3班'],
    totalHours: 48,
    totalCredits: 3,
    progress: 60
  },
  {
    id: 7,
    code: 'HE107',
    name: '智能康复辅助器具应用',
    type: '理论课',
    classes: ['养老21-1班', '养老21-2班', '养老21-3班'],
    totalHours: 32,
    totalCredits: 2,
    progress: 45
  },
  {
    id: 8,
    code: 'HE108',
    name: '养老机构评估与管理',
    type: '理论课', 
    classes: ['养老21-1班'],
    totalHours: 48,
    totalCredits: 3,
    progress: 60
  }
]

// 教室配置
const classrooms = ['主楼101', '主楼102', '实验楼103', '教学二楼104', '教学二楼201', '实验楼202', '主楼203', '主楼301', '主楼302', '主楼303', '实验室401', '智慧养老实训室']

// 生成指定日期的课程安排（轮询使用基础课程数据）
const generateCoursesForDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number)
  // 直接计算星期几，避免时区问题
  const date = new Date(year, month - 1, day)
  const dayOfWeek = date.getDay()
  
  // 只安排周一到周五的课程
  if (dayOfWeek < 1 || dayOfWeek > 5) {
    return []
  }
  
  // 使用日期作为随机种子，确保同一天的数据一致
  const seed = date.getTime()
  
  // 修复随机数生成函数
  const random = (seedValue) => {
    const x = Math.sin(seedValue) * 10000
    return x - Math.floor(x)
  }
  
  // 每天随机安排2-5节课
  const courseCount = Math.floor(random(seed) * 4) + 2 // 2-5节课
  const usedTimeSlots = new Set()
  const courses = []
  
  for (let i = 0; i < courseCount; i++) {
    // 随机选择时间槽
    let timeSlotIndex
    let attempts = 0
    do {
      timeSlotIndex = Math.floor(random(seed + i + attempts) * timeSlots.length)
      attempts++
      // 防止无限循环
      if (attempts > 10) {
        timeSlotIndex = i % timeSlots.length
        break
      }
    } while (usedTimeSlots.has(timeSlotIndex))
    usedTimeSlots.add(timeSlotIndex)
    
    const timeSlot = timeSlots[timeSlotIndex]
    const courseIndex = Math.floor(random(seed + i + 100) * baseCourses.length)
    const course = baseCourses[courseIndex]
    const className = course.classes[Math.floor(random(seed + i + 200) * course.classes.length)]
    const classroom = classrooms[Math.floor(random(seed + i + 300) * classrooms.length)]
    
    courses.push({
      id: `${course.id}-${dateStr}-${i}`,
      name: course.name,
      code: course.code,
      type: course.type,
      className: className,
      classroom: classroom,
      timeSlot: `${timeSlot.start}-${timeSlot.end}`,
      period: timeSlot.period,
      totalHours: course.totalHours,
      totalCredits: course.totalCredits,
      classes: course.classes
    })
  }
  
  return courses.sort((a, b) => a.period - b.period)
}

// 计算当前年份
const currentYear = computed(() => currentDate.value.getFullYear())

// 可用年份列表
const availableYears = computed(() => {
  const years = []
  const currentYear = new Date().getFullYear()
  for (let year = currentYear - 2; year <= currentYear + 2; year++) {
    years.push(year)
  }
  return years
})

// 获取月份的开始日期（月初）
const getMonthStart = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// 获取月份的最后一天
const getMonthEnd = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

// 计算当前月的天数（月视图）
const monthDays = computed(() => {
  const monthStart = getMonthStart(currentDate.value)
  const monthEnd = getMonthEnd(currentDate.value)
  const days = []
  
  // 获取月初是星期几（0=周日, 1=周一, ..., 6=周六）
  const firstDayOfWeek = monthStart.getDay()
  
  // 添加上个月的日期（用于填充日历网格）
  const prevMonth = new Date(monthStart)
  prevMonth.setMonth(prevMonth.getMonth() - 1)
  const prevMonthEnd = getMonthEnd(prevMonth)
  
  // 添加上个月的末尾几天
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(prevMonthEnd)
    date.setDate(prevMonthEnd.getDate() - i)
    const dateStr = formatDate(date)
    const today = new Date()
    const isToday = dateStr === formatDate(today)
    
    days.push({
      day: date.getDate(),
      date: dateStr,
      isCurrentMonth: false,
      isToday,
      courseCount: getCourseCountForDate(dateStr)
    })
  }
  
  // 添加当前月的所有日期
  for (let day = 1; day <= monthEnd.getDate(); day++) {
    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day)
    const dateStr = formatDate(date)
    const today = new Date()
    const isToday = dateStr === formatDate(today)
    
    days.push({
      day: day,
      date: dateStr,
      isCurrentMonth: true,
      isToday,
      courseCount: getCourseCountForDate(dateStr)
    })
  }
  
  // 添加下个月的日期（用于填充日历网格）
  const remainingDays = 42 - days.length // 6行 x 7天 = 42个格子
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, day)
    const dateStr = formatDate(date)
    const today = new Date()
    const isToday = dateStr === formatDate(today)
    
    days.push({
      day: day,
      date: dateStr,
      isCurrentMonth: false,
      isToday,
      courseCount: getCourseCountForDate(dateStr)
    })
  }
  
  return days
})

// 格式化当前月显示
const currentMonthFormatted = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年${month}月`
})

// 获取指定日期的课程数量
const getCourseCountForDate = (date) => {
  const courses = generateCoursesForDate(date)
  return courses.length
}

// 选中日期
const selectDate = (date) => {
  selectedDate.value = date
}

// 格式化选中日期
const selectedDateFormatted = computed(() => {
  const date = parseLocalDate(selectedDate.value)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekday}`
})

// 获取选中日期的课程
const dailyCourses = computed(() => {
  return generateCoursesForDate(selectedDate.value)
})

// 其他日程数据
const otherSchedules = ref([
  {
    id: 1,
    title: '智慧养老发展趋势在线公开课',
    type: '公开课',
    timeSlot: '14:00-15:30',
    dateInfo: '2024-01-15',
    location: '线上',
    organizer: '健康服务与管理学院',
    priority: '高'
  },
  {
    id: 2,
    title: '适老化适装设计前沿系列讲座',
    type: '讲座',
    timeSlot: '09:00-11:00',
    dateInfo: '2024-01-16',
    location: '阶梯教室',
    organizer: '健康服务与管理学院',
    priority: '中'
  },
  {
    id: 3,
    title: '智慧养老终端设计大赛赛前研讨会',
    type: '研讨会',
    timeSlot: '16:00-17:00',
    dateInfo: '2024-01-17',
    location: '活动室',
    organizer: '学生处',
    priority: '低'
  },
  {
    id: 4,
    title: '银发经济发展研讨交流会',
    type: '研讨会',
    timeSlot: '19:00-20:30',
    dateInfo: '2024-01-18',
    location: '图书馆',
    organizer: '校团委',
    priority: '中'
  },
  {
    id: 5,
    title: '老龄化社会与应对策略专家论坛',
    type: '专家论坛',
    timeSlot: '10:00-11:00',
    dateInfo: '2024-01-19',
    location: '学术报告厅',
    organizer: '健康服务与管理学院',
    priority: '高'
  }
])

// 年份选择
const selectYear = (year) => {
  currentDate.value = new Date(year, currentDate.value.getMonth(), currentDate.value.getDate())
  showYearPicker.value = false
}

// 月导航
const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

// 回到今天
const goToToday = () => {
  const today = new Date()
  currentDate.value = new Date(today) // 确保创建新的Date对象
  selectedDate.value = formatDate(today)
}

// 原有的工作量量化相关数据
const selectedCourse = ref('')
const selectedType = ref('')
const selectedSemester = ref('')

// 筛选选项
const courseOptions = ref([
  { value: 'HE101', label: '老年学概论' },
  { value: 'HE102', label: '老年社会工作实务' },
  { value: 'HE103', label: '老年心理护理实训' },
  { value: 'HE104', label: '智慧养老终端实操' },
  { value: 'HE105', label: '老年政策与法规' },
  { value: 'HE106', label: '健康管理学' },
  { value: 'HE107', label: '智能康复辅助器具应用' },
  { value: 'HE108', label: '养老机构评估与管理' }
])

const typeOptions = ref([
  { value: 'theory', label: '理论课' },
  { value: 'practice', label: '实践课' },
  { value: 'experiment', label: '实验课' }
])

const semesterOptions = ref([
  { value: '2024-1', label: '2024春季' },
  { value: '2023-2', label: '2023秋季' },
  { value: '2023-1', label: '2023春季' },
  { value: '2022-2', label: '2022秋季' },
  { value: '2022-1', label: '2022春季' }
])


// 筛选功能
const handleFilterChange = () => {
  console.log('筛选条件变化:', { 
    course: selectedCourse.value, 
    type: selectedType.value, 
    semester: selectedSemester.value 
  })
}

// 添加上传排课表功能
const uploadSchedule = () => {
  console.log('上传排课表')
  // 这里可以添加上传排课表的逻辑
  // 可以打开文件选择对话框或上传组件
}

// 生命周期
onMounted(() => {
  // 初始化时选中今天
  selectedDate.value = formatDate(new Date())
})

// 监听筛选条件变化
watch([selectedCourse, selectedType, selectedSemester], () => {
  handleFilterChange()
}, { deep: true })
</script>

<style scoped>
.workload-quantification {
  padding: 20px;
  background: #f8f9fa;
  min-height: auto;
  width: 100%;
}

/* 第一部分：日历和当日课程 */
.calendar-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  align-items: stretch; /* 确保两个模块高度一致 */
  min-height: 500px; /* 设置最小高度 */
}

.calendar-container {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%; /* 确保日历容器占满可用高度 */
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  position: relative;
}

.calendar-title {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.calendar-title h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.month-nav {
  display: flex;
  gap: 6px;
}

.nav-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.nav-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
  background: #f0f8ff;
}

.quick-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.today-btn {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: all 0.2s;
}

.today-btn:hover {
  border-color: #1677ff;
  color: #1677ff;
  background: #f0f8ff;
}

.year-picker-btn {
  padding: 4px 8px;
  border: 1px solid #1677ff;
  background: #1677ff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.year-picker-btn:hover {
  background: #4096ff;
  border-color: #4096ff;
}

.year-picker {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 180px;
  margin-top: 8px;
}

.year-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.year-list {
  max-height: 150px;
  overflow-y: auto;
  padding: 6px 0;
}

.year-item {
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  color: #666;
}

.year-item:hover {
  background: #f0f8ff;
  color: #1677ff;
}

.year-item.active {
  background: #1677ff;
  color: white;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
  flex: 1; /* 填充剩余空间 */
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}

.weekday {
  text-align: center;
  padding: 6px;
  font-weight: 500;
  color: #666;
  font-size: 12px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  flex: 1; /* 填充剩余空间 */
  min-height: 300px; /* 确保月视图有足够的最小高度 */
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
  min-height: 40px; /* 增加月视图中日期格子的高度 */
  padding: 4px;
}

.calendar-day:hover {
  background: #f0f0f0;
}

.calendar-day.other-month {
  color: #ccc;
}

.calendar-day.today {
  background: #e6f7ff;
  color: #1677ff;
  font-weight: 600;
}

.calendar-day.selected {
  background: #1677ff;
  color: white;
}

.calendar-day.has-courses {
  font-weight: 600;
}

.calendar-day.has-courses:not(.selected) {
  background: #fff7e6;
  color: #fa8c16;
}

.day-number {
  font-size: 13px;
  font-weight: 500;
}

.course-count {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.daily-courses {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%; /* 与日历区域保持相同高度 */
  display: flex;
  flex-direction: column;
}

.daily-courses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.daily-courses-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.course-count-badge {
  background: #1677ff;
  color: white;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
}

.courses-list {
  flex: 1; /* 填充剩余空间 */
  overflow-y: auto;
  min-height: 0; /* 确保flex子项可以收缩 */
}

.no-courses {
  text-align: center;
  color: #999;
  padding: 20px 0;
}

.no-courses-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.no-courses p {
  margin: 0;
  font-size: 12px;
}

.course-item {
  display: flex;
  gap: 12px;
  padding: 15px;
  border: 1px solid #f0f0f0; 
  border-radius: 6px;
  margin-bottom: 15px;
  transition: all 0.2s;
  background: #f8f9fa;
}

.course-item:hover {
  border-color: #1677ff;
  box-shadow: 0 1px 4px rgba(22, 119, 255, 0.15);
}

.course-item:last-child {
  margin-bottom: 0;
}

.course-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 15px;
  background: #fff;
  border-radius: 6px;
}

.time-slot {
  font-size: 14px;
  color: #1677ff;
  font-weight: 600;
}

.course-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-top {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 6px;
}

.title-line {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.course-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.course-code {
  font-size: 11px;
  color: #9aa0a6;
}

.type-badge {
  justify-self: end;
}

.info-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
}


.classroom {
  color: #52c41a;
  font-weight: 500;
  font-size: 14px;
}

.course-type-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

.course-type-badge.理论课 {
  background: #e6f2ff;
  color: #1677ff;
}

.course-type-badge.实践课 {
  background: #fff4e6;
  color: #fa8c16;
}

.course-type-badge.实验课 {
  background: #effbea;
  color: #52c41a;
}

/* 其他日程模块样式 */
.other-schedule-section {
  margin-top: 20px;
}

.other-schedule {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 300px;
}

.other-schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.other-schedule-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.schedule-count-badge {
  background: #52c41a;
  color: white;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
}

.schedule-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-schedules {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.no-schedules-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.no-schedules p {
  margin: 0;
  font-size: 14px;
}

.schedule-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.2s;
  background: #fafafa;
}

.schedule-item:hover {
  border-color: #52c41a;
  box-shadow: 0 2px 6px rgba(82, 196, 26, 0.15);
  background: #f6ffed;
}

.schedule-item:last-child {
  margin-bottom: 0;
}

.schedule-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  padding: 8px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.time-slot {
  font-size: 13px;
  color: #52c41a;
  font-weight: 600;
}

.date-info {
  font-size: 11px;
  color: #999;
}

.schedule-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-top {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
}

.title-line {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}

.schedule-title {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.schedule-type {
  font-size: 12px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.priority-badge {
  justify-self: end;
}

.priority {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
}

.priority.高 {
  background: #fff2e8;
  color: #fa8c16;
}

.priority.中 {
  background: #e6f7ff;
  color: #1677ff;
}

.priority.低 {
  background: #f6ffed;
  color: #52c41a;
}

.info-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location {
  color: #52c41a;
  font-weight: 500;
  font-size: 12px;
}

.organizer {
  color: #666;
  font-size: 12px;
}

/* 标题和按钮行样式 */
.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0;
}

.module-title {
  margin: 0;
  font-size: 16px;
  color: #5856d6;
  font-weight: 600;
  padding-bottom: 8px;
  display: flex;
  align-items: center;
}

.upload-btn {
  background: #5856d6 !important;
  border-color: #5856d6 !important;
  padding: 8px 10px !important;
  font-weight: 500 !important;
  border-radius: 6px !important;
}

.upload-btn:hover {
  background: #7e7eff !important;
  border-color: #7e7eff !important;
}

.upload-btn:focus {
  background: #5856d6 !important;
  border-color: #5856d6 !important;
}

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #333;
  min-width: 60px;
}

/* 自定义下拉框和按钮样式 */
.course-select {
  width: 200px !important;
  min-width: 200px !important;
}

.course-select .el-input__inner {
  width: 100% !important;
}

.type-select {
  width: 180px !important;
  min-width: 180px !important;
}

.type-select .el-input__inner {
  width: 100% !important;
}

.semester-select {
  width: 180px !important;
  min-width: 180px !important;
}

.semester-select .el-input__inner {
  width: 100% !important;
}


/* 响应式设计 */
@media (max-width: 1024px) {
  .calendar-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .workload-quantification {
    padding: 10px;
  }
  
  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
}
</style>
