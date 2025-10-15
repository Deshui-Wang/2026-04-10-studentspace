<template>
  <div class="chart-card">
    <h3>基本信息画像 - 10年+专业标杆教学科研型教师</h3>
    <div class="basic-info-rings">
      <!-- 年龄组 -->
      <div class="ring-group">
        <div class="ring-container">
          <div class="ring-wrapper">
            <div ref="ageChart" class="ring-chart"></div>
          </div>
          <div class="ring-label">年龄</div>
          <div class="ring-info">38岁</div>
        </div>
        <div class="legend-container">
          <div v-for="item in ageData" :key="item.name" class="legend-item">
            <div class="legend-color" :style="{ backgroundColor: item.current ? '#ff6b6b' : item.color }"></div>
            <span class="legend-text">{{ item.name }}</span>
            <span class="legend-percentage">{{ item.value }}%</span>
          </div>
        </div>
      </div>
      
      <!-- 性别组 -->
      <div class="ring-group">
        <div class="ring-container">
          <div class="ring-wrapper">
            <div ref="genderChart" class="ring-chart"></div>
          </div>
          <div class="ring-label">性别</div>
          <div class="ring-info">女</div>
        </div>
        <div class="legend-container">
          <div v-for="item in genderData" :key="item.name" class="legend-item">
            <div class="legend-color" :style="{ backgroundColor: item.current ? '#ff6b6b' : item.color }"></div>
            <span class="legend-text">{{ item.name }}</span>
            <span class="legend-percentage">{{ item.value }}%</span>
          </div>
        </div>
      </div>
      
      <!-- 学历组 -->
      <div class="ring-group">
        <div class="ring-container">
          <div class="ring-wrapper">
            <div ref="educationChart" class="ring-chart"></div>
          </div>
          <div class="ring-label">学历</div>
          <div class="ring-info">硕士</div>
        </div>
        <div class="legend-container">
          <div v-for="item in educationData" :key="item.name" class="legend-item">
            <div class="legend-color" :style="{ backgroundColor: item.current ? '#ff6b6b' : item.color }"></div>
            <span class="legend-text">{{ item.name }}</span>
            <span class="legend-percentage">{{ item.value }}%</span>
          </div>
        </div>
      </div>
      
      <!-- 职称组 -->
      <div class="ring-group">
        <div class="ring-container">
          <div class="ring-wrapper">
            <div ref="titleChart" class="ring-chart"></div>
          </div>
          <div class="ring-label">职称</div>
          <div class="ring-info">副教授</div>
        </div>
        <div class="legend-container">
          <div v-for="item in titleData" :key="item.name" class="legend-item">
            <div class="legend-color" :style="{ backgroundColor: item.current ? '#ff6b6b' : item.color }"></div>
            <span class="legend-text">{{ item.name }}</span>
            <span class="legend-percentage">{{ item.value }}%</span>
          </div>
        </div>
      </div>
      
      <!-- 教龄组 -->
      <div class="ring-group">
        <div class="ring-container">
          <div class="ring-wrapper">
            <div ref="experienceChart" class="ring-chart"></div>
          </div>
          <div class="ring-label">教龄</div>
          <div class="ring-info">14年</div>
        </div>
        <div class="legend-container">
          <div v-for="item in experienceData" :key="item.name" class="legend-item">
            <div class="legend-color" :style="{ backgroundColor: item.current ? '#ff6b6b' : item.color }"></div>
            <span class="legend-text">{{ item.name }}</span>
            <span class="legend-percentage">{{ item.value }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts'

// 图表 refs
const ageChart = ref(null)
const genderChart = ref(null)
const educationChart = ref(null)
const titleChart = ref(null)
const experienceChart = ref(null)

// 图表实例
let ageChartInstance = null
let genderChartInstance = null
let educationChartInstance = null
let titleChartInstance = null
let experienceChartInstance = null

// 生成基本信息画像数据
function generateBasicInfoData() {
  return {
    age: [
      { name: '20-30岁', value: 15, current: false, color: '#90EE90' },
      { name: '30-40岁', value: 35, current: true, color: '#32CD32' },
      { name: '40-50岁', value: 28, current: false, color: '#228B22' },
      { name: '50-60岁', value: 18, current: false, color: '#9ACD32' },
      { name: '60岁以上', value: 4, current: false, color: '#20B2AA' }
    ],
    gender: [
      { name: '男', value: 60, current: false, color: '#4169E1' },
      { name: '女', value: 40, current: true, color: '#FF69B4' }
    ],
    education: [
      { name: '本科', value: 20, current: false, color: '#191970' },
      { name: '研究生', value: 35, current: true, color: '#8A2BE2' },
      { name: '博士', value: 30, current: false, color: '#A52A2A' },
      { name: '博士后', value: 12, current: false, color: '#87CEEB' },
      { name: '科研专家', value: 3, current: false, color: '#FF8C00' }
    ],
    title: [
      { name: '助教', value: 25, current: false, color: '#F5DEB3' },
      { name: '讲师', value: 40, current: false, color: '#FF8C00' },
      { name: '副教授', value: 28, current: true, color: '#A52A2A' },
      { name: '教授', value: 7, current: false, color: '#FF8C00' }
    ],
    experience: [
      { name: '1-5年', value: 20, current: false, color: '#90EE90' },
      { name: '6-10年', value: 30, current: false, color: '#32CD32' },
      { name: '11-15年', value: 25, current: true, color: '#228B22' },
      { name: '16-25年', value: 18, current: false, color: '#9ACD32' },
      { name: '26-35年', value: 5, current: false, color: '#20B2AA' },
      { name: '35年以上', value: 2, current: false, color: '#191970' }
    ]
  }
}

// 计算属性获取数据
const ageData = computed(() => generateBasicInfoData().age)
const genderData = computed(() => generateBasicInfoData().gender)
const educationData = computed(() => generateBasicInfoData().education)
const titleData = computed(() => generateBasicInfoData().title)
const experienceData = computed(() => generateBasicInfoData().experience)

// 环形图初始化方法
function initAgeChart() {
  if (!ageChart.value) return
  if (ageChartInstance) { try { ageChartInstance.dispose() } catch {} }
  
  ageChartInstance = echarts.init(ageChart.value)
  const data = generateBasicInfoData().age
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const isCurrent = params.data.isCurrent
        return `
          <div style="font-weight: 600; margin-bottom: 8px; color: ${isCurrent ? '#ff6b6b' : '#333'};">
            ${params.data.name}
            ${isCurrent ? ' (当前教师)' : ''}
          </div>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <span style="margin-right: 8px;">占比:</span>
            <span style="font-weight: 600; color: ${isCurrent ? '#ff6b6b' : '#5856d6'};">${params.data.value}%</span>
          </div>
        `
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    series: [{
      type: 'pie',
      radius: ['50%', '80%'],
      center: ['50%', '50%'],
      data: data.map(item => ({
        value: item.value,
        name: item.name,
        isCurrent: item.current,
        itemStyle: {
          color: item.current ? '#ff6b6b' : item.color,
          borderWidth: 3,
          borderColor: '#fff',
          shadowBlur: 8,
          shadowColor: item.current ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 0, 0, 0.1)'
        }
      })),
      label: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200
      }
    }]
  }
  
  ageChartInstance.setOption(option)
}

function initGenderChart() {
  if (!genderChart.value) return
  if (genderChartInstance) { try { genderChartInstance.dispose() } catch {} }
  
  genderChartInstance = echarts.init(genderChart.value)
  const data = generateBasicInfoData().gender
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const isCurrent = params.data.isCurrent
        return `
          <div style="font-weight: 600; margin-bottom: 8px; color: ${isCurrent ? '#ff6b6b' : '#333'};">
            ${params.data.name}
            ${isCurrent ? ' (当前教师)' : ''}
          </div>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <span style="margin-right: 8px;">占比:</span>
            <span style="font-weight: 600; color: ${isCurrent ? '#ff6b6b' : '#5856d6'};">${params.data.value}%</span>
          </div>
        `
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    series: [{
      type: 'pie',
      radius: ['50%', '80%'],
      center: ['50%', '50%'],
      data: data.map(item => ({
        value: item.value,
        name: item.name,
        isCurrent: item.current,
        itemStyle: {
          color: item.current ? '#ff6b6b' : item.color,
          borderWidth: 3,
          borderColor: '#fff',
          shadowBlur: 8,
          shadowColor: item.current ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 0, 0, 0.1)'
        }
      })),
      label: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200
      }
    }]
  }
  
  genderChartInstance.setOption(option)
}

function initEducationChart() {
  if (!educationChart.value) return
  if (educationChartInstance) { try { educationChartInstance.dispose() } catch {} }
  
  educationChartInstance = echarts.init(educationChart.value)
  const data = generateBasicInfoData().education
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const isCurrent = params.data.isCurrent
        return `
          <div style="font-weight: 600; margin-bottom: 8px; color: ${isCurrent ? '#ff6b6b' : '#333'};">
            ${params.data.name}
            ${isCurrent ? ' (当前教师)' : ''}
          </div>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <span style="margin-right: 8px;">占比:</span>
            <span style="font-weight: 600; color: ${isCurrent ? '#ff6b6b' : '#5856d6'};">${params.data.value}%</span>
          </div>
        `
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    series: [{
      type: 'pie',
      radius: ['50%', '80%'],
      center: ['50%', '50%'],
      data: data.map(item => ({
        value: item.value,
        name: item.name,
        isCurrent: item.current,
        itemStyle: {
          color: item.current ? '#ff6b6b' : item.color,
          borderWidth: 3,
          borderColor: '#fff',
          shadowBlur: 8,
          shadowColor: item.current ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 0, 0, 0.1)'
        }
      })),
      label: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200
      }
    }]
  }
  
  educationChartInstance.setOption(option)
}

function initTitleChart() {
  if (!titleChart.value) return
  if (titleChartInstance) { try { titleChartInstance.dispose() } catch {} }
  
  titleChartInstance = echarts.init(titleChart.value)
  const data = generateBasicInfoData().title
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const isCurrent = params.data.isCurrent
        return `
          <div style="font-weight: 600; margin-bottom: 8px; color: ${isCurrent ? '#ff6b6b' : '#333'};">
            ${params.data.name}
            ${isCurrent ? ' (当前教师)' : ''}
          </div>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <span style="margin-right: 8px;">占比:</span>
            <span style="font-weight: 600; color: ${isCurrent ? '#ff6b6b' : '#5856d6'};">${params.data.value}%</span>
          </div>
        `
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    series: [{
      type: 'pie',
      radius: ['50%', '80%'],
      center: ['50%', '50%'],
      data: data.map(item => ({
        value: item.value,
        name: item.name,
        isCurrent: item.current,
        itemStyle: {
          color: item.current ? '#ff6b6b' : item.color,
          borderWidth: 3,
          borderColor: '#fff',
          shadowBlur: 8,
          shadowColor: item.current ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 0, 0, 0.1)'
        }
      })),
      label: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200
      }
    }]
  }
  
  titleChartInstance.setOption(option)
}

function initExperienceChart() {
  if (!experienceChart.value) return
  if (experienceChartInstance) { try { experienceChartInstance.dispose() } catch {} }
  
  experienceChartInstance = echarts.init(experienceChart.value)
  const data = generateBasicInfoData().experience
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const isCurrent = params.data.isCurrent
        return `
          <div style="font-weight: 600; margin-bottom: 8px; color: ${isCurrent ? '#ff6b6b' : '#333'};">
            ${params.data.name}
            ${isCurrent ? ' (当前教师)' : ''}
          </div>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <span style="margin-right: 8px;">占比:</span>
            <span style="font-weight: 600; color: ${isCurrent ? '#ff6b6b' : '#5856d6'};">${params.data.value}%</span>
          </div>
        `
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    series: [{
      type: 'pie',
      radius: ['50%', '80%'],
      center: ['50%', '50%'],
      data: data.map(item => ({
        value: item.value,
        name: item.name,
        isCurrent: item.current,
        itemStyle: {
          color: item.current ? '#ff6b6b' : item.color,
          borderWidth: 3,
          borderColor: '#fff',
          shadowBlur: 8,
          shadowColor: item.current ? 'rgba(255, 107, 107, 0.3)' : 'rgba(0, 0, 0, 0.1)'
        }
      })),
      label: {
        show: false
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200
      }
    }]
  }
  
  experienceChartInstance.setOption(option)
}

// 初始化所有图表
function initCharts() {
  initAgeChart()
  initGenderChart()
  initEducationChart()
  initTitleChart()
  initExperienceChart()
}

// 销毁所有图表
function disposeCharts() {
  [ageChartInstance, genderChartInstance, educationChartInstance, titleChartInstance, experienceChartInstance].forEach(chart => {
    if (chart) {
      try { chart.dispose() } catch {}
    }
  })
  ageChartInstance = null
  genderChartInstance = null
  educationChartInstance = null
  titleChartInstance = null
  experienceChartInstance = null
}

// 监听窗口大小变化，重新渲染图表
function handleResize() {
  [ageChartInstance, genderChartInstance, educationChartInstance, titleChartInstance, experienceChartInstance].forEach(chart => {
    if (chart) {
      try { chart.resize() } catch {}
    }
  })
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => { 
  disposeCharts()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.chart-card {
  background: rgba(255,255,255,0.9);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  border: 1px solid rgba(255,255,255,0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.chart-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
}

.chart-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
  text-align: left;
}

/* 基本信息画像环形图样式 */
.basic-info-rings {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 0;
}

/* 每组环形图的外框样式 */
.ring-group {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #fafafa, #f5f5f5);
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.ring-group:hover {
  border-color: #e0e0e0;
  background: linear-gradient(135deg, #f8f8f8, #f0f0f0);
  transform: translateY(-2px);
}

.ring-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

/* 环形图外框样式 */
.ring-wrapper {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.ring-wrapper:hover {
  border-color: #d0d0d0;
  background: linear-gradient(135deg, #fdfdfd, #f5f5f5);
}

.ring-chart {
  width: 120px;
  height: 120px;
  position: relative;
  transition: all 0.3s ease;
}

.ring-chart:hover {
  transform: scale(1.05);
}

.ring-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 4px;
}

.ring-info {
  font-size: 18px;
  font-weight: 700;
  color: #5856d6;
  text-align: center;
  background: linear-gradient(135deg, #5856d6, #7e7eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(88, 86, 214, 0.2);
}

/* 图例样式 */
.legend-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.legend-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.legend-text {
  font-size: 12px;
  color: #333;
  flex: 1;
  font-weight: 500;
}

.legend-percentage {
  font-size: 12px;
  color: #666;
  font-weight: 600;
  min-width: 35px;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .basic-info-rings {
    flex-direction: column;
    gap: 20px;
  }
  
  .ring-group {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    min-width: auto;
    align-items: flex-start;
  }
  
  .ring-container {
    flex-shrink: 0;
  }
  
  .ring-wrapper {
    width: 100px;
    height: 100px;
  }
  
  .ring-chart {
    width: 80px;
    height: 80px;
  }
  
  .legend-container {
    flex: 1;
    margin-left: 16px;
  }
}

@media (max-width: 480px) {
  .ring-group {
    flex-direction: column;
    align-items: center;
  }
  
  .ring-wrapper {
    width: 80px;
    height: 80px;
  }
  
  .ring-chart {
    width: 60px;
    height: 60px;
  }
  
  .legend-container {
    margin-left: 0;
    margin-top: 12px;
  }
}
</style>
