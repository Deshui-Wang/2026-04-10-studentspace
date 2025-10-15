<template>
  <div class="teacher-ethics-container">
    <div class="page-header">
      <h1>师德师风建设与考评</h1>
      <p>当前个人处于全校教师师德师风综合考评上升梯队</p>
    </div>

    <!-- AI智能胜任力模块 -->
    <div class="module-card">
      <div class="module-header">
        <h2>AI智能胜任力 <span class="score-badge">{{ aiScore }}</span></h2>
      </div>
      <div class="module-content">
        <div class="chart-section">
          <div ref="aiChart" class="radar-chart"></div>
        </div>
        <div class="indicators-section">
          <div class="indicators-grid">
            <div class="indicator-item" v-for="(indicator, index) in aiIndicators" :key="index">
              <div class="indicator-header">
                <span class="indicator-name">{{ indicator.name }}</span>
                <span class="indicator-score">{{ indicator.score }}</span>
              </div>
              <div class="indicator-description">{{ indicator.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 基本教学能力模块 -->
    <div class="module-card">
      <div class="module-header">
        <h2>基本教学能力 <span class="score-badge">{{ teachingScore }}</span></h2>
      </div>
      <div class="module-content">
        <div class="chart-section">
          <div ref="teachingChart" class="radar-chart"></div>
        </div>
        <div class="indicators-section">
          <div class="indicators-grid">
            <div class="indicator-item" v-for="(indicator, index) in teachingIndicators" :key="index">
              <div class="indicator-header">
                <span class="indicator-name">{{ indicator.name }}</span>
                <span class="indicator-score">{{ indicator.score }}</span>
              </div>
              <div class="indicator-description">{{ indicator.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 社会服务能力模块 -->
    <div class="module-card">
      <div class="module-header">
        <h2>社会服务能力 <span class="score-badge">{{ serviceScore }}</span></h2>
      </div>
      <div class="module-content">
        <div class="chart-section">
          <div ref="serviceChart" class="radar-chart"></div>
        </div>
        <div class="indicators-section">
          <div class="indicators-grid">
            <div class="indicator-item" v-for="(indicator, index) in serviceIndicators" :key="index">
              <div class="indicator-header">
                <span class="indicator-name">{{ indicator.name }}</span>
                <span class="indicator-score">{{ indicator.score }}</span>
              </div>
              <div class="indicator-description">{{ indicator.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 科研成本消耗与成果奖励模块 -->
    <div class="module-card">
      <div class="module-header">
        <h2>科研成本消耗与成果奖励 <span class="score-badge">{{ researchScore }}</span></h2>
      </div>
      <div class="module-content">
        <div class="chart-section">
          <div ref="researchChart" class="radar-chart"></div>
        </div>
        <div class="indicators-section">
          <div class="indicators-grid">
            <div class="indicator-item" v-for="(indicator, index) in researchIndicators" :key="index">
              <div class="indicator-header">
                <span class="indicator-name">{{ indicator.name }}</span>
                <span class="indicator-score">{{ indicator.score }}</span>
              </div>
              <div class="indicator-description">{{ indicator.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 综合教学质量模块 -->
    <div class="module-card">
      <div class="module-header">
        <h2>综合教学质量 <span class="score-badge">{{ qualityScore }}</span></h2>
      </div>
      <div class="module-content">
        <div class="chart-section">
          <div ref="qualityChart" class="radar-chart"></div>
        </div>
        <div class="indicators-section">
          <div class="indicators-grid">
            <div class="indicator-item" v-for="(indicator, index) in qualityIndicators" :key="index">
              <div class="indicator-header">
                <span class="indicator-name">{{ indicator.name }}</span>
                <span class="indicator-score">{{ indicator.score }}</span>
              </div>
              <div class="indicator-description">{{ indicator.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

// 图表引用
const aiChart = ref(null)
const teachingChart = ref(null)
const serviceChart = ref(null)
const researchChart = ref(null)
const qualityChart = ref(null)

// 图表实例
let aiChartInstance = null
let teachingChartInstance = null
let serviceChartInstance = null
let researchChartInstance = null
let qualityChartInstance = null

// 各模块总分
const aiScore = ref((Math.random() * 3.5 + 6).toFixed(1))
const teachingScore = ref((Math.random() * 3.5 + 6).toFixed(1))
const serviceScore = ref((Math.random() * 3.5 + 6).toFixed(1))
const researchScore = ref((Math.random() * 3.5 + 6).toFixed(1))
const qualityScore = ref((Math.random() * 3.5 + 6).toFixed(1))

// AI智能胜任力指标数据
const aiIndicators = ref([
  {
    name: '以人为本',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '关注学生个体差异，因材施教，体现人文关怀'
  },
  {
    name: '社会责任',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '承担社会责任，服务社会发展，传播正能量'
  },
  {
    name: '知识与技能',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '掌握扎实的专业知识和教学技能'
  },
  {
    name: '教学与应用',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '将AI技术有效应用于教学实践'
  },
  {
    name: '职业能力',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '具备良好的职业素养和专业能力'
  },
  {
    name: '助力专业发展',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '推动专业建设和学科发展'
  }
])

// 基本教学能力指标数据
const teachingIndicators = ref([
  {
    name: '思政教学',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '将思想政治教育融入专业教学'
  },
  {
    name: '课堂实施',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '课堂教学组织有序，方法得当'
  },
  {
    name: '课后跟踪',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '课后辅导及时，跟踪学生学习情况'
  },
  {
    name: '教学经验发表',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '总结教学经验，发表教学论文'
  },
  {
    name: '行业证书',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '获得相关行业资格证书'
  }
])

// 社会服务能力指标数据
const serviceIndicators = ref([
  {
    name: '企业培训指导',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '为企业提供专业培训和指导服务'
  },
  {
    name: '企业项目',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '参与企业项目合作，解决实际问题'
  },
  {
    name: '技能竞赛指导',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '指导学生参加各类技能竞赛'
  },
  {
    name: '企业人才培养',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '参与企业人才培养方案制定'
  },
  {
    name: '案例开发',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '开发教学案例，丰富教学内容'
  }
])

// 科研成本消耗与成果奖励指标数据
const researchIndicators = ref([
  {
    name: '在研项目',
    score: Math.floor(Math.random() * 5 + 3),
    description: '承担各级各类科研项目数量'
  },
  {
    name: '科研经费',
    score: Math.floor(Math.random() * 100 + 50),
    description: '获得科研经费支持（万元）'
  },
  {
    name: '成果奖励',
    score: Math.floor(Math.random() * 10 + 5),
    description: '获得科研成果奖励数量'
  },
  {
    name: '专利价值',
    score: Math.floor(Math.random() * 200 + 100),
    description: '专利技术价值评估（万元）'
  }
])

// 综合教学质量指标数据
const qualityIndicators = ref([
  {
    name: '学生出勤',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '学生课堂出勤率及参与度'
  },
  {
    name: '课堂互动',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '课堂师生互动质量'
  },
  {
    name: '考试通过',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '学生考试通过率'
  },
  {
    name: '竞赛指导',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '指导学生竞赛获奖情况'
  },
  {
    name: '其他教师评价',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '同行教师评价反馈'
  },
  {
    name: '学生评价',
    score: (Math.random() * 1.5 + 1.5).toFixed(1),
    description: '学生评教满意度'
  }
])

// 初始化AI智能胜任力雷达图
function initAIChart() {
  if (!aiChart.value) return
  if (aiChartInstance) { try { aiChartInstance.dispose() } catch {} }
  
  aiChartInstance = echarts.init(aiChart.value)
  const data = aiIndicators.value.map(item => item.score)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}分',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { show: false },
    radar: {
      indicator: aiIndicators.value.map(item => ({ name: item.name, max: 3, nameTextStyle: { color: '#333' } })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      splitLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
    },
    series: [
      {
        name: 'AI智能胜任力',
        type: 'radar',
        data: [{
          value: data,
          name: '胜任力指数',
          itemStyle: {
            color: '#34c759',
            borderColor: '#34c759',
            borderWidth: 2
          },
          areaStyle: {
            color: 'rgba(52, 199, 89, 0.2)'
          },
          lineStyle: {
            width: 2,
            color: '#34c759'
          }
        }],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  aiChartInstance.setOption(option)
}

// 初始化基本教学能力雷达图
function initTeachingChart() {
  if (!teachingChart.value) return
  if (teachingChartInstance) { try { teachingChartInstance.dispose() } catch {} }
  
  teachingChartInstance = echarts.init(teachingChart.value)
  const data = teachingIndicators.value.map(item => item.score)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}分',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { show: false },
    radar: {
      indicator: teachingIndicators.value.map(item => ({ name: item.name, max: 3, nameTextStyle: { color: '#333' } })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      splitLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
    },
    series: [
      {
        name: '基本教学能力',
        type: 'radar',
        data: [{
          value: data,
          name: '教学能力指数',
          itemStyle: {
            color: '#ff9500',
            borderColor: '#ff9500',
            borderWidth: 2
          },
          areaStyle: {
            color: 'rgba(255, 149, 0, 0.2)'
          },
          lineStyle: {
            width: 2,
            color: '#ff9500'
          }
        }],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  teachingChartInstance.setOption(option)
}

// 初始化社会服务能力雷达图
function initServiceChart() {
  if (!serviceChart.value) return
  if (serviceChartInstance) { try { serviceChartInstance.dispose() } catch {} }
  
  serviceChartInstance = echarts.init(serviceChart.value)
  const data = serviceIndicators.value.map(item => item.score)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}分',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { show: false },
    radar: {
      indicator: serviceIndicators.value.map(item => ({ name: item.name, max: 3, nameTextStyle: { color: '#333' } })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      splitLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
    },
    series: [
      {
        name: '社会服务能力',
        type: 'radar',
        data: [{
          value: data,
          name: '服务能力指数',
          itemStyle: {
            color: '#4ecdc4',
            borderColor: '#4ecdc4',
            borderWidth: 2
          },
          areaStyle: {
            color: 'rgba(78, 205, 196, 0.2)'
          },
          lineStyle: {
            width: 2,
            color: '#4ecdc4'
          }
        }],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  serviceChartInstance.setOption(option)
}

// 初始化科研成本消耗与成果奖励雷达图
function initResearchChart() {
  if (!researchChart.value) return
  if (researchChartInstance) { try { researchChartInstance.dispose() } catch {} }
  
  researchChartInstance = echarts.init(researchChart.value)
  const data = researchIndicators.value.map(item => item.score)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { show: false },
    radar: {
      indicator: researchIndicators.value.map(item => ({ name: item.name, max: 300, nameTextStyle: { color: '#333' } })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      splitLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
    },
    series: [
      {
        name: '科研成本消耗与成果奖励',
        type: 'radar',
        data: [{
          value: data,
          name: '科研指数',
          itemStyle: {
            color: '#007aff',
            borderColor: '#007aff',
            borderWidth: 2
          },
          areaStyle: {
            color: 'rgba(0, 122, 255, 0.2)'
          },
          lineStyle: {
            width: 2,
            color: '#007aff'
          }
        }],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  researchChartInstance.setOption(option)
}

// 初始化综合教学质量雷达图
function initQualityChart() {
  if (!qualityChart.value) return
  if (qualityChartInstance) { try { qualityChartInstance.dispose() } catch {} }
  
  qualityChartInstance = echarts.init(qualityChart.value)
  const data = qualityIndicators.value.map(item => item.score)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}分',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { show: false },
    radar: {
      indicator: qualityIndicators.value.map(item => ({ name: item.name, max: 3, nameTextStyle: { color: '#333' } })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
      splitLine: { 
        lineStyle: { 
          color: '#d1d5db',
          width: 1
        } 
      },
    },
    series: [
      {
        name: '综合教学质量',
        type: 'radar',
        data: [{
          value: data,
          name: '质量指数',
          itemStyle: {
            color: '#5856d6',
            borderColor: '#5856d6',
            borderWidth: 2
          },
          areaStyle: {
            color: 'rgba(88, 86, 214, 0.2)'
          },
          lineStyle: {
            width: 2,
            color: '#5856d6'
          }
        }],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  qualityChartInstance.setOption(option)
}

// 初始化所有图表
function initAllCharts() {
  nextTick(() => {
    initAIChart()
    initTeachingChart()
    initServiceChart()
    initResearchChart()
    initQualityChart()
  })
}

// 销毁所有图表
function disposeAllCharts() {
  [aiChartInstance, teachingChartInstance, serviceChartInstance, researchChartInstance, qualityChartInstance].forEach(chart => {
    if (chart) {
      try { chart.dispose() } catch {}
    }
  })
  aiChartInstance = null
  teachingChartInstance = null
  serviceChartInstance = null
  researchChartInstance = null
  qualityChartInstance = null
}

// 监听窗口大小变化
function handleResize() {
  [aiChartInstance, teachingChartInstance, serviceChartInstance, researchChartInstance, qualityChartInstance].forEach(chart => {
    if (chart) {
      try { chart.resize() } catch {}
    }
  })
}

onMounted(() => {
  initAllCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  disposeAllCharts()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.teacher-ethics-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  padding: 20px;
  font-family: 'Poppins', sans-serif;
}

.page-header {
  text-align: center;
  padding-block-end: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #5856d6, #7e7eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.module-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #5856d6, #7e7eff, #34c759, #ff9500);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.module-header {
  margin-bottom: 30px;
  text-align: center;
}

.module-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.score-badge {
  background: linear-gradient(135deg, #6841ea, #40a9ff);
  color: white;
  padding: 6px 16px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
}

.module-content {
  display: flex;
  gap: 40px;
  align-items: center;
}

.chart-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.radar-chart {
  width: 400px;
  height: 400px;
}

.indicators-section {
  flex: 1;
  padding-left: 20px;
}

.indicators-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.indicator-item {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.indicator-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.indicator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.indicator-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.indicator-score {
  font-size: 18px;
  font-weight: 500;
  color: #5856d6;
  background: linear-gradient(135deg, #5856d6, #7e7eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 0 20px;
}

.indicator-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  50% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes scoreGlow {
  from {
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    transform: scale(1);
  }
  to {
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.5);
    transform: scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .module-content {
    flex-direction: column;
    gap: 30px;
  }
  
  .indicators-section {
    padding-left: 0;
  }
  
  .radar-chart {
    width: 450px;
    height: 350px;
  }
}

@media (max-width: 768px) {
  .teacher-ethics-container {
    padding: 15px;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .module-card {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .module-header h2 {
    font-size: 20px;
    flex-direction: column;
    gap: 10px;
  }
  
  .score-badge {
    font-size: 14px;
    padding: 4px 12px;
  }
  
  .radar-chart {
    width: 300px;
    height: 300px;
  }
  
  .indicators-grid {
    gap: 15px;
  }
  
  .indicator-item {
    padding: 15px;
  }
  
  .indicator-name {
    font-size: 14px;
  }
  
  .indicator-score {
    font-size: 16px;
  }
  
  .indicator-description {
    font-size: 13px;
  }
}
</style>