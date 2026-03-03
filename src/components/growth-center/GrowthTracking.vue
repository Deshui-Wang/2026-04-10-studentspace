<template>
  <div class="growth-tracking">
    <div class="header">
      <h2>成长与跟踪</h2>
      <p class="subtitle">记录日常成长，复盘与反馈，量化进步轨迹</p>
    </div>

    <div class="stats-grid">
      <div class="card stat-card growth-achievement-card">
        <div class="achievement-content">
          <div class="achievement-text">
            <h4>前进之星</h4>
            <div class="achievement-subtitle">恭喜达成成长目标！</div>
          </div>
          <div class="achievement-badge">
            <img src="/pic/grow/huizhang.png" alt="成长徽章" class="badge-icon" />
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: growthProgressPercentage + '%' }"></div>
            <div class="progress-bubble" :style="{ left: growthProgressPercentage + '%' }">
              <div class="bubble-content">{{ Math.round(growthProgressPercentage) }}%</div>
            </div>
          </div>
          <div class="progress-text">成长进度 {{ Math.round(growthProgressPercentage) }}%</div>
        </div>
      </div>
      <div class="card stat-card weekly-activities-card">
        <div class="card-header">
          <div class="header-content">
            <div class="activity-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15.6947 14.7H15.7037M15.6947 17.7H15.7037M11.9955 14.7H12.0045M11.9955 17.7H12.0045M8.29431 14.7H8.30329M8.29431 17.7H8.30329" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h4>本周活动</h4>
          </div>
          <div class="activity-trend">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14L12 9L17 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>+12%</span>
          </div>
        </div>
        <div class="activity-content">
          <div class="stat-value">{{ weeklyActivities }}</div>
          <div class="activity-label">项活动</div>
        </div>
        <div class="activity-progress">
          <div class="progress-dots">
            <div class="dot active"></div>
            <div class="dot active"></div>
            <div class="dot active"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
          <div class="progress-text">完成度 60%</div>
        </div>
      </div>
      <div class="card stat-card ai-suggestion">
        <h4>智能回顾</h4>
        <p>基于你最近一周的表现，AI为你生成了如下建议： “{{ aiSuggestion }}”</p>
      </div>
    </div>

    <div class="charts-grid">
      <div class="card chart-card">
        <h4>成长轨迹</h4>
        <div class="trajectory-wrapper">
          <div class="trajectory-container">
            <div class="trajectory-path">
              <svg class="path-svg" viewBox="0 0 900 200" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
                    <stop offset="20%" style="stop-color:#6366f1;stop-opacity:1" />
                    <stop offset="40%" style="stop-color:#3b82f6;stop-opacity:1" />
                    <stop offset="60%" style="stop-color:#06b6d4;stop-opacity:1" />
                    <stop offset="80%" style="stop-color:#10b981;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#84cc16;stop-opacity:1" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="pathShadow">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#8b5cf6" flood-opacity="0.3"/>
                  </filter>
                </defs>
                <!-- 主路径：精确经过所有6个里程碑中心点 -->
                <path 
                  d="M20 130 C 120 105 130 110 215 105 300 100 425 85 500 55 575 15 700 70 840 25 900 55" 
                  stroke="url(#pathGradient)" 
                  stroke-width="8" 
                  fill="none" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                  filter="url(#glow)"
                  class="trajectory-line"
                />
                <!-- 装饰性虚线路径 -->
                <path 
                  d="M20 130 C 120 105 130 110 215 105 300 100 425 85 500 55 575 15 700 70 840 25 900 55" 
                  stroke="url(#pathGradient)" 
                  stroke-width="3" 
                  fill="none" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                  stroke-dasharray="15,10"
                  opacity="0.4"
                  class="trajectory-dash"
                />
                <!-- 路径阴影 -->
                <path 
                  d="M20 130 C 120 105 130 110 215 105 300 100 425 85 500 55 575 15 700 70 840 25 900 55" 
                  stroke="none" 
                  fill="none" 
                  filter="url(#pathShadow)"
                />
              </svg>
            </div>
            
            <div class="milestone-nodes">
              <div 
                v-for="(milestone, index) in trajectoryMilestones" 
                :key="milestone.id"
                class="milestone-node"
                :class="milestone.status"
                :style="milestone.position"
              >
                <div class="node-circle">
                  <span class="milestone-number">{{ String(index + 1).padStart(2, '0') }}</span>
                </div>
                <div class="node-label">
                  <div class="label-title">{{ milestone.title }}</div>
                  <div class="label-description">{{ milestone.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="filters card">
      <div class="row">
        <div class="field">
          <select v-model="filters.type">
            <option value="all">全部</option>
            <option value="study">学习</option>
            <option value="exercise">练习</option>
            <option value="exam">测验</option>
            <option value="project">项目</option>
          </select>
        </div>
        <div class="field">
          <div class="date-range">
            <input v-model="filters.start" type="date" />
            <span>—</span>
            <input v-model="filters.end" type="date" />
          </div>
        </div>
        <div class="field">
          <label>&nbsp;</label>
          <button class="secondary" @click="resetFilters">重置筛选</button>
          <button class="secondary" @click="regenerateMock">刷新示例数据</button>
        </div>
      </div>
    </div>


    <div class="card">
      <div class="event-list">
        <div v-if="filteredEvents.length === 0" class="empty">暂无符合条件的记录</div>
        <div class="event" v-for="(e, i) in filteredEvents" :key="i">
          <div class="event-head">
            <span class="badge" :data-type="e.type">{{ typeLabel(e.type) }}</span>
            <span class="title">{{ e.title }}</span>
            <span class="points">成长 +{{ e.growth }}</span>
          </div>
          <div class="meta">
            <span class="date-info">{{ e.date }}</span>
            <span class="source-info">来源 {{ e.source }}</span>
            <span class="time-info" v-if="e.time">{{ e.time }}</span>
          </div>
          <div class="detail" v-if="e.detail">{{ e.detail }}</div>
          <div class="event-footer" v-if="e.tags && e.tags.length">
            <div class="tags">
              <span class="tag" v-for="tag in e.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useMilestones } from '@/services/milestone.service.js'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)


const filters = reactive({ type: 'all', start: '', end: '' })

const events = ref(generateMockEvents())

const totalGrowth = computed(() => events.value.reduce((sum, e) => sum + e.growth, 0))
const weeklyActivities = computed(() => events.value.filter(e => {
  const today = new Date();
  const eventDate = new Date(e.date);
  const diff = today.getTime() - eventDate.getTime();
  return diff / (1000 * 3600 * 24) <= 7;
}).length)
const growthProgressPercentage = computed(() => {
  // 模拟进度条显示71%
  return 71;
})
const aiSuggestion = ref("🎯 本周表现分析：你在智慧康养实操训练上投入了充足的时间，对适老化护理设备原理掌握得很扎实。后续建议：1️⃣ 安排一次实地的电动护理床体位转移操作练习；2️⃣ 继续学习《阿尔茨海默病照护实务》第七章；3️⃣ 总结最近一次跟访评估的难点！💪")

const trajectoryMilestones = ref([
  {
    id: 1,
    title: "学习起步",
    description: "课程学习，建立知识体系",
    status: "completed",
    position: { left: "5%", top: "80%" },
    iconPath: "M12 2L2 7L12 12L22 7L12 2Z M2 17L12 22L22 17 M2 12L12 17L22 12",
    color: "#10b981"
  },
  {
    id: 2,
    title: "技能提升",
    description: "掌握核心技能，开始实践应用",
    status: "completed",
    position: { left: "20%", top: "72%" },
    iconPath: "M9.663 17H4.337C3.603 17 3 16.397 3 15.663V8.337C3 7.603 3.603 7 4.337 7H9.663C10.397 7 11 7.603 11 8.337V15.663C11 16.397 10.397 17 9.663 17Z M13 7H19.663C20.397 7 21 7.603 21 8.337V15.663C21 16.397 20.397 17 19.663 17H13V7Z",
    color: "#f59e0b"
  },
  {
    id: 3,
    title: "项目实践",
    description: "参与实际项目，积累经验",
    status: "in_progress",
    position: { left: "35%", top: "65%" },
    iconPath: "M6 9L12 15L18 9",
    color: "#3b82f6"
  },
  {
    id: 4,
    title: "能力突破",
    description: "突破瓶颈，实现能力跃升",
    status: "pending",
    position: { left: "50%", top: "50%" },
    iconPath: "M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z",
    color: "#8b5cf6"
  },
  {
    id: 5,
    title: "专业发展",
    description: "建立专业优势，成为领域专家",
    status: "pending",
    position: { left: "70%", top: "35%" },
    iconPath: "M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z M12 4.21L18 7.38V15.84L12 19L6 15.84V7.38L12 4.21Z",
    color: "#06b6d4"
  },
  {
    id: 6,
    title: "成就达成",
    description: "实现个人目标，获得认可",
    status: "pending",
    position: { left: "90%", top: "27%" },
    iconPath: "M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z",
    color: "#ef4444"
  }
])

const growthTrendData = computed(() => {
  const sortedEvents = [...events.value].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = [...new Set(sortedEvents.map(e => e.date))];
  const data = labels.map(date => {
    return sortedEvents
      .filter(e => e.date <= date)
      .reduce((sum, e) => sum + e.growth, 0)
  })
  return {
    labels,
    datasets: [{
      label: '累计成长值',
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      data,
      fill: true,
      tension: 0.3
    }]
  }
})

function resetFilters() {
  filters.type = 'all'
  filters.start = ''
  filters.end = ''
}

const filteredEvents = computed(() => {
  return events.value.filter(e => {
    if (filters.type !== 'all' && e.type !== filters.type) return false
    if (filters.start && e.date < filters.start) return false
    if (filters.end && e.date > filters.end) return false
    return true
  })
})

function regenerateMock() {
  events.value = generateMockEvents()
}

function typeLabel(type) {
  const labels = {
    study: '学习',
    exercise: '练习', 
    exam: '测验',
    project: '项目'
  }
  return labels[type] || type
}

function generateMockEvents() {
  // 生成最近两周的示例事件（出勤、作业、测验、互动、项目）
  const today = new Date()
  const fmt = (d) => d.toISOString().slice(0, 10)
  const day = (offset) => {
    const d = new Date(today)
    d.setDate(d.getDate() - offset)
    return fmt(d)
  }
  return [
    { 
      date: day(1), 
      time: '09:00-10:30',
      type: 'study', 
      source: '课堂出勤', 
      title: '老年心理学 - 全勤', 
      detail: '到课率 100%，课中专注完成随堂讨论，深刻理解了老年期常见心理危机干预手段。通过老师的案例分析，掌握了同理心倾听与回忆疗法的具体落地细节，并在课后主动完成了相关安抚话术记录。', 
      growth: 2,
      tags: ['心理学', '同理心', '课堂']
    },
    { 
      date: day(1), 
      time: '14:00-16:00',
      type: 'exercise', 
      source: '作业系统', 
      title: '长者失能评估实践作业', 
      detail: '巴氏量表（Barthel Index）填写分析，准确率 95%。对入组案例中长者日常生活活动能力的十项指标打分准确，评估逻辑清晰，备注完整，顺利通过了指导老师的复核验证。', 
      growth: 3,
      tags: ['实操', '失能评估', '量表']
    },
    { 
      date: day(2), 
      time: '10:00-11:00',
      type: 'exam', 
      source: '在线测验', 
      title: '适老环境改造测验', 
      detail: '得分 88/100，弱项是对卫浴防滑系数及灯光照度参数指标的记忆，建议加强记忆背诵。本次包含居家防跌倒硬装改造和智能传感报警系统布置两部分，整体设计动线清晰。', 
      growth: 4,
      tags: ['防跌倒', '适老改造', '测验']
    },
    { 
      date: day(3), 
      time: '15:30-17:30',
      type: 'project', 
      source: '课程项目', 
      title: '社区日照中心规划项目', 
      detail: '完成项目场地平面草图及首月活动排期表。作为小组活动策划主要负责人，成功设计了针对轻度认知症长者的“怀旧音乐下午茶”方案，兼顾了成本预算和人员调配，受到老师好评。', 
      growth: 5,
      tags: ['项目实况', '日间照料', '活动策划']
    },
    { 
      date: day(4), 
      time: '20:00-21:00',
      type: 'exercise', 
      source: '平台学习', 
      title: '康复辅具基础理论打卡', 
      detail: '每日 1 个辅具知识点，连续打卡 5 天。今天掌握了如何根据偏瘫长者的肌力等级正确选择和装配腋拐与助行器，对康复器具的承重力学分析有了系统的认知。', 
      growth: 2,
      tags: ['辅具装配', '每日学习', '打卡']
    },
    { 
      date: day(6), 
      time: '09:30-11:00',
      type: 'study', 
      source: '课堂互动', 
      title: '积极回答问题', 
      detail: '提出 2 个有价值问题并获得表扬，在讨论“吞咽障碍的老人如何进食”时，主动提出对于特殊营养粉流速配比的疑问，并在听取讲解后对胃管鼻饲的风险防控提出了建议，获得大家认可。', 
      growth: 2,
      tags: ['互动', '吞咽障碍', '参与']
    },
    { 
      date: day(7), 
      time: '14:30-15:30',
      type: 'exam', 
      source: '阶段测验', 
      title: '生命体征监测评估小测', 
      detail: '得分 92/100，血压及脉搏波形解读全对。本次测验涵盖了水银血压计实操要点、雷达睡眠波形判定等核心内容。能准确从后台趋势图识别出可能的心率异常并执行标准化上报流程。', 
      growth: 4,
      tags: ['生命体征', '波形图', '测验']
    },
    { 
      date: day(9), 
      time: '16:00-17:00',
      type: 'project', 
      source: '项目管理', 
      title: '提交阶段性报告', 
      detail: '完善某养老院“智慧看护设备引入方案”的利弊分析，得到导师认可。详细梳理了老系统与新传感器对接的接口难题及成本数据，制定了分楼层试行计划，内容详实。', 
      growth: 3,
      tags: ['报告', '智慧看护', '导师认可']
    },
    { 
      date: day(10), 
      time: '08:30-10:00',
      type: 'study', 
      source: '课堂出勤', 
      title: '长者慢病管理 - 到课', 
      detail: '按时到达，对高血压、糖尿病及心脏病三大慢病的干预有了更深理解。认真记录了胰岛素注射和低血糖急性发作的应急预案，掌握了饮食控制量表的计算方法。', 
      growth: 1,
      tags: ['慢病', '饮食控制', '笔记']
    },
    { 
      date: day(11), 
      time: '19:00-20:30',
      type: 'exercise', 
      source: '线下实操', 
      title: '海姆立克急救法练习', 
      detail: '在实训中心对接模拟人进行完整的急救流程背摔与腹部冲击训练。纠正了上肢发力位置偏低的问题，掌握了正确的按压频率与力度，大大提升了实战场控心理素质。', 
      growth: 3,
      tags: ['实训室', '急救', '海姆立克']
    },
    { 
      date: day(12), 
      time: '13:00-14:00',
      type: 'exam', 
      source: '期中考试', 
      title: '养老护理核心技能考评', 
      detail: '成绩优秀，在模拟操作考核中动作规范、沟通亲和。顺利完成了对偏瘫老人的床椅转移、翻身叩背预防压疮以及轮椅的安全操作，理论与实操的综合得分位列全班前 10%。', 
      growth: 6,
      tags: ['护理技能', '实操考核', '期中考试']
    }
  ]
}
</script>

<style scoped>
.growth-tracking { display: flex; flex-direction: column; gap: 20px; }
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.header h2 { 
  margin: 0; 
  font-size: 22px; 
  font-weight: 600;
}
.subtitle { 
  color: #6b7280; 
  font-size: 13px; 
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 20px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.stat-card h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.badge-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}

/* 成长成就卡片样式 */
.growth-achievement-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.growth-achievement-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%);
  z-index: 1;
}

.growth-achievement-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.growth-achievement-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.25);
  border-color: #f59e0b;
}

.growth-achievement-card:hover::before {
  background: linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #d97706 100%);
  height: 5px;
}

.achievement-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.achievement-text {
  flex: 1;
}

.achievement-text h4 {
  color: #92400e;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: left;
}

.achievement-text .stat-value {
  color: #92400e;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
}

.achievement-subtitle {
  color: #a16207;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
}

.achievement-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  position: relative;
}

.achievement-badge .badge-icon {
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.progress-container {
  position: relative;
  z-index: 1;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(146, 64, 14, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  color: #a16207;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.progress-bubble {
  position: absolute;
  top: -8px;
  transform: translateX(-50%);
  z-index: 10;
  transition: left 0.3s ease;
}

.bubble-content {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  border: 2px solid white;
  position: relative;
}

.bubble-content::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #f59e0b;
}

/* 本周活动卡片样式 */
.weekly-activities-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.weekly-activities-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%);
}

.weekly-activities-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.activity-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon svg {
  width: 100%;
  height: 100%;
}

.activity-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #10b981;
  font-size: 12px;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

.activity-trend svg {
  width: 12px;
  height: 12px;
}

.activity-content {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.activity-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.activity-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.progress-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e5e7eb;
  transition: all 0.3s ease;
}

.dot.active {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #111827;
}

/* 智能回顾卡片样式 */
.ai-suggestion {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.ai-suggestion::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%);
  z-index: 1;
}

.ai-suggestion::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.ai-suggestion:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25);
  border-color: #3b82f6;
}

.ai-suggestion:hover::before {
  background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #2563eb 100%);
  height: 5px;
}

.ai-suggestion h4 {
  color: #1e40af;
  font-weight: 600;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
}

.ai-suggestion p {
  font-size: 14px;
  color: #374151;
  margin: 0;
  line-height: 1.6;
  position: relative;
  z-index: 2;
  text-align: left;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.chart-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.chart-wrapper {
  position: relative;
  height: 260px;
}

/* 成长轨迹样式 */
.trajectory-wrapper {
  position: relative;
  height: 300px;
  background: linear-gradient(135deg, rgba(248, 250, 252, 24%) 0%, rgba(241, 245, 249, 39%) 100%), 
              url('/pic/grow/chegnzhangguiji.png') center/cover;
  border-radius: 16px;
  overflow: hidden;
  padding: 20px;
}

.trajectory-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.trajectory-path {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.path-svg {
  width: 100%;
  height: 100%;
}

.trajectory-line {
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: drawPath 4s ease-in-out forwards;
  transition: all 0.3s ease;
}

.trajectory-line:hover {
  stroke-width: 10;
  filter: url(#glow) brightness(1.2);
}

.trajectory-dash {
  stroke-dasharray: 15,10;
  animation: dashMove 3s linear infinite;
  opacity: 0.6;
}

.trajectory-dash:hover {
  opacity: 0.8;
  animation-duration: 2s;
}

@keyframes drawPath {
  0% {
    stroke-dashoffset: 1200;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes dashMove {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 25;
  }
}

.milestone-nodes {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.milestone-node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.milestone-node:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

/* 里程碑位置由JavaScript动态设置，CSS不覆盖 */

.node-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  border: 3px solid rgba(255, 255, 255, 0.9);
}

.milestone-number {
  font-size: 14px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.milestone-node.pending .milestone-number {
  color: #9ca3af;
}

.milestone-node.completed .node-circle {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.milestone-node.in_progress .node-circle {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  animation: pulse 2s infinite;
}

.milestone-node.pending .node-circle {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.node-icon {
  width: 26px;
  height: 26px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}


.node-label {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 14px 18px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
  text-align: center;
  min-width: 160px;
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.8);
  backdrop-filter: blur(10px);
}

.milestone-node:hover .node-label {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.label-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.label-description {
  font-size: 11px;
  color: #6b7280;
  line-height: 1.4;
}

.milestone-node.completed .label-title {
  color: #10b981;
}

.milestone-node.in_progress .label-title {
  color: #3b82f6;
}

.milestone-node.pending .label-title {
  color: #9ca3af;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .trajectory-wrapper {
    height: 250px;
    padding: 15px;
  }
  
  .node-circle {
    width: 30px;
    height: 30px;
  }
  
  .node-icon {
    width: 16px;
    height: 16px;
  }
  
  .milestone-number {
    font-size: 10px;
  }
  
  .node-label {
    min-width: 100px;
    padding: 8px 10px;
  }
  
  .label-title {
    font-size: 12px;
  }
  
  .label-description {
    font-size: 10px;
  }
  
  /* 小屏幕下调整里程碑位置，确保完全显示 */
  /* 里程碑位置由JavaScript动态设置，响应式也不覆盖 */
}

@media (max-width: 480px) {
  .trajectory-wrapper {
    height: 200px;
    padding: 10px;
  }
  
  .node-circle {
    width: 25px;
    height: 25px;
  }
  
  .node-icon {
    width: 14px;
    height: 14px;
  }
  
  .milestone-number {
    font-size: 9px;
  }
  
  .node-label {
    min-width: 80px;
    padding: 6px 8px;
  }
  
  .label-title {
    font-size: 11px;
  }
  
  .label-description {
    font-size: 9px;
  }
  
  /* 超小屏幕下进一步调整位置 */
  /* 里程碑位置由JavaScript动态设置，手机端也不覆盖 */
}
.chart-card h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); padding: 20px; }

.row { display: flex; gap: 12px; flex-wrap: wrap; }
.field { display: flex; flex-direction: row; gap: 6px; }
.date-range { display: flex; align-items: center; gap: 8px; }
.field input, .field select { height: 34px; padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; }



.event-list { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
  padding: 8px 0;
}

.event { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
  border: 1px solid #e5e7eb; 
  border-radius: 12px; 
  padding: 16px; 
  background: #fff;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.event::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.event:hover::before {
  opacity: 1;
}

.event-head { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  flex-wrap: wrap;
}

.badge { 
  display: inline-flex; 
  align-items: center; 
  height: 24px; 
  padding: 0 10px; 
  border-radius: 12px; 
  font-size: 12px; 
  font-weight: 600;
  color: #111827; 
  background: #eef2ff;
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

.badge[data-type="exercise"] { 
  background: #ecfeff; 
  color: #0c4a6e;
  border-color: rgba(6, 182, 212, 0.2);
}

.badge[data-type="exam"] { 
  background: #fef3c7; 
  color: #92400e;
  border-color: rgba(245, 158, 11, 0.2);
}

.badge[data-type="project"] { 
  background: #dcfce7; 
  color: #166534;
  border-color: rgba(34, 197, 94, 0.2);
}

.title { 
  font-weight: 600; 
  color: #111827; 
  font-size: 14px;
  flex: 1;
  text-align: left;
}

.points { 
  margin-left: auto; 
  color: #16a34a; 
  font-weight: 700; 
  font-size: 14px;
  background: rgba(34, 197, 94, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.meta { 
  font-size: 12px; 
  color: #6b7280; 
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-info::before {
  content: '📅';
  font-size: 10px;
}

.source-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.source-info::before {
  content: '📍';
  font-size: 10px;
}

.time-info {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(59, 130, 246, 0.1);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 11px;
}

.time-info::before {
  content: '⏰';
  font-size: 9px;
}

.detail { 
  font-size: 13px; 
  color: #374151; 
  line-height: 1.5;
  background: #f9fafb;
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #e5e7eb;
  text-align: left;
}

.event-footer {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
}

.tag:hover {
  background: rgba(139, 92, 246, 0.2);
  transform: scale(1.05);
}

.empty {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #d1d5db;
  position: relative;
}

.empty::before {
  content: '📝';
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}
.empty { color: #9ca3af; font-size: 13px; text-align: center; padding: 16px; }

.primary { background: #6366f1; color: #fff; border: none; border-radius: 8px; height: 36px; padding: 0 14px; cursor: pointer; }
.secondary { background: #eef2ff; color: #4f46e5; border: none; border-radius: 8px; height: 36px; padding: 0 14px; cursor: pointer; }

@media (max-width: 960px) {
  .stats-grid, .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>


