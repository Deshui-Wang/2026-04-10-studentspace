<template>
  <div class="chart-card">
    <h3>社会服务能力 <span class="score-badge">{{ serviceScore }}</span></h3>
    <div class="comparison-toggle">
      <button 
        class="toggle-btn" 
        :class="{ active: showComparison }"
        @click="toggleComparison"
      >
        {{ showComparison ? '隐藏对比' : '显示对比' }}
      </button>
    </div>
    <div class="service-content">
      <!-- 左侧雷达图 -->
      <div class="chart-section">
        <div ref="serviceChart" class="chart-container"></div>
      </div>
      
      <!-- 右侧指标描述 -->
      <div class="indicators-section">
        <div class="indicators-grid">
          <div v-for="(indicator, index) in serviceIndicators" :key="index" class="indicator-card">
            <div class="indicator-header">
              <div class="indicator-color" :style="{ backgroundColor: indicator.color }"></div>
              <span class="indicator-name">{{ indicator.name }}</span>
              <div class="score-comparison">
                <span class="indicator-score">{{ indicator.value }}分</span>
                <span v-if="showComparison" class="average-score">
                  (平均{{ indicator.averageValue }}分)
                </span>
              </div>
            </div>
            <div class="indicator-description">{{ indicator.description }}</div>
            <div v-if="showComparison" class="comparison-bar">
              <div class="bar-container">
                <div class="bar-label">个人</div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill personal" 
                    :style="{ width: (indicator.value / 3 * 100) + '%' }"
                  ></div>
                </div>
                <div class="bar-value">{{ indicator.value }}</div>
              </div>
              <div class="bar-container">
                <div class="bar-label">平均</div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill average" 
                    :style="{ width: (indicator.averageValue / 3 * 100) + '%' }"
                  ></div>
                </div>
                <div class="bar-value">{{ indicator.averageValue }}</div>
              </div>
            </div>
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
const serviceChart = ref(null)

// 图表实例
let serviceChartInstance = null

// 对比显示状态
const showComparison = ref(false)

// 社会服务能力分值（6-9.5分之间随机）
const serviceScore = ref((Math.random() * 3.5 + 6).toFixed(1))

// 切换对比显示
const toggleComparison = () => {
  showComparison.value = !showComparison.value
  // 重新初始化图表以显示/隐藏对比数据
  setTimeout(() => {
    initServiceChart()
  }, 100)
}

// 图表数据生成函数
function generateServiceData() {
  return [
    { name: '企业培训指导', value: 1.9, color: '#ff6b6b' },
    { name: '企业项目', value: 1.8, color: '#4ecdc4' },
    { name: '技能竞赛指导', value: 1.7, color: '#45b7d1' },
    { name: '企业人才培养', value: 1.6, color: '#96ceb4' },
    { name: '案例开发', value: 3.0, color: '#feca57' }
  ]
}

// 生成全校平均数据
function generateAverageData() {
  return [
    { name: '企业培训指导', value: 1.4 },
    { name: '企业项目', value: 1.3 },
    { name: '技能竞赛指导', value: 1.2 },
    { name: '企业人才培养', value: 1.1 },
    { name: '案例开发', value: 1.8 }
  ]
}

// 计算属性：生成指标描述数据
const serviceIndicators = computed(() => {
  const data = generateServiceData()
  const averageData = generateAverageData()
  
  return data.map(item => {
    const averageItem = averageData.find(avg => avg.name === item.name)
    return {
      ...item,
      averageValue: averageItem ? averageItem.value : 1.2,
      description: getIndicatorDescription(item.name, item.value, averageItem?.value)
    }
  })
})

// 根据指标名称和分值生成描述（增加对比信息）
function getIndicatorDescription(name, value, averageValue = 1.2) {
  const isAboveAverage = value > averageValue
  const difference = (value - averageValue).toFixed(1)
  
  const baseDescriptions = {
    '企业培训指导': value >= 1.9 ? 
      '具备丰富的企业培训经验，能够为企业提供专业的技术指导和培训服务，帮助企业提升员工技能水平。' : 
      '需要加强企业培训指导能力建设，积累更多实践经验，提升培训效果和服务质量。',
    '企业项目': value >= 1.8 ? 
      '能够承接并完成各类企业项目，具备良好的项目管理能力和技术实施能力，为企业创造实际价值。' : 
      '建议多参与企业项目合作，提升项目管理能力和技术应用水平，增强服务企业的能力。',
    '技能竞赛指导': value >= 1.7 ? 
      '在技能竞赛指导方面表现突出，能够帮助学生和员工在各类技能竞赛中取得优异成绩。' : 
      '需要加强技能竞赛指导能力，学习先进的竞赛理念和方法，提升指导效果。',
    '企业人才培养': value >= 1.6 ? 
      '在企业人才培养方面有一定经验，能够为企业制定人才培养方案，促进人才队伍建设。' : 
      '建议深入研究企业人才培养模式，提升人才培养方案设计能力和实施效果。',
    '案例开发': value >= 2.5 ? 
      '在案例开发方面表现优秀，能够开发高质量的教学案例和商业案例，为教学和企业提供有价值的参考。' : 
      '需要加强案例开发能力，学习案例开发的方法和技巧，提升案例的质量和实用性。'
  }
  
  const baseDescription = baseDescriptions[name] || '该指标需要进一步评估和改进。'
  
  if (showComparison.value) {
    const comparisonText = isAboveAverage ? 
      `\n\n相比全校平均水平高出${difference}分，表现优秀。` : 
      `\n\n相比全校平均水平低${Math.abs(difference)}分，有提升空间。`
    return baseDescription + comparisonText
  }
  
  return baseDescription
}

// 图表初始化方法
function initServiceChart() {
  if (!serviceChart.value) return
  if (serviceChartInstance) { try { serviceChartInstance.dispose() } catch {} }
  
  serviceChartInstance = echarts.init(serviceChart.value)
  const data = generateServiceData()
  const averageData = generateAverageData()
  
  const seriesData = [{
    value: data.map(item => item.value),
    name: '个人服务能力',
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
  }]
  
  // 如果显示对比，添加平均数据
  if (showComparison.value) {
    seriesData.push({
      value: averageData.map(item => item.value),
      name: '全校平均',
      itemStyle: {
        color: '#ff6b6b',
        borderColor: '#ff6b6b',
        borderWidth: 2
      },
      areaStyle: {
        color: 'rgba(255, 107, 107, 0.1)'
      },
      lineStyle: {
        width: 2,
        color: '#ff6b6b',
        type: 'dashed'
      }
    })
  }
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        if (params.seriesName === '个人服务能力') {
          const index = params.dataIndex
          return `${params.seriesName}<br/>${data[index].name}: ${params.value}分`
        } else if (params.seriesName === '全校平均') {
          const index = params.dataIndex
          return `${params.seriesName}<br/>${averageData[index].name}: ${params.value}分`
        }
        return `${params.seriesName}<br/>${params.name}: ${params.value}分`
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: { 
      show: showComparison.value,
      bottom: 10,
      data: showComparison.value ? ['个人服务能力', '全校平均'] : []
    },
    radar: {
      indicator: data.map(item => ({ name: item.name, max: 3, nameTextStyle: { color: '#333' } })),
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
        data: seriesData,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  serviceChartInstance.setOption(option)
}

// 销毁图表
function disposeChart() {
  if (serviceChartInstance) {
    try { serviceChartInstance.dispose() } catch {}
    serviceChartInstance = null
  }
}

// 监听窗口大小变化，重新渲染图表
function handleResize() {
  if (serviceChartInstance) {
    try { serviceChartInstance.resize() } catch {}
  }
}

onMounted(() => {
  // 生成新的随机分值
  serviceScore.value = (Math.random() * 3.5 + 6).toFixed(1)
  initServiceChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => { 
  disposeChart()
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

.chart-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
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
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.score-badge {
  background: linear-gradient(135deg, #ff6b6b, #ff9ff3);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  animation: scoreGlow 2s ease-in-out infinite alternate;
}

@keyframes scoreGlow {
  from {
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
    transform: scale(1);
  }
  to {
    box-shadow: 0 4px 16px rgba(255, 107, 107, 0.5);
    transform: scale(1.05);
  }
}

/* 对比切换按钮 */
.comparison-toggle {
  text-align: center;
  margin-bottom: 20px;
}

.toggle-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.toggle-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.toggle-btn.active {
  background: linear-gradient(135deg, #4ecdc4, #6dd5ed);
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.3);
}

/* 主要内容区域布局 */
.service-content {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

/* 左侧图表区域 */
.chart-section {
  flex: 0 0 350px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-container {
  width: 320px;
  height: 320px;
}

/* 右侧指标描述区域 */
.indicators-section {
  flex: 1;
  min-width: 0;
}

/* 指标网格布局 */
.indicators-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 100%;
}

/* 指标卡片样式 */
.indicator-card {
  background: linear-gradient(135deg, #fafafa, #f5f5f5);
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: fit-content;
}

.indicator-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--indicator-color, #ddd), transparent);
}

.indicator-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  border-color: #d0d0d0;
}

.indicator-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.indicator-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.indicator-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.score-comparison {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.indicator-score {
  font-size: 13px;
  font-weight: 700;
  color: #4ecdc4;
  background: linear-gradient(135deg, #4ecdc4, #6dd5ed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

.average-score {
  font-size: 11px;
  color: #ff6b6b;
  font-weight: 500;
}

.indicator-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  text-align: justify;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

/* 对比进度条 */
.comparison-bar {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e8e8e8;
}

.bar-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.bar-label {
  font-size: 10px;
  color: #666;
  width: 24px;
  flex-shrink: 0;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.personal {
  background: linear-gradient(90deg, #4ecdc4, #6dd5ed);
}

.progress-fill.average {
  background: linear-gradient(90deg, #ff6b6b, #ff9ff3);
}

.bar-value {
  font-size: 10px;
  color: #666;
  width: 20px;
  text-align: right;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .service-content {
    gap: 24px;
  }
  
  .chart-section {
    flex: 0 0 300px;
  }
  
  .chart-container {
    width: 280px;
    height: 280px;
  }
}

@media (max-width: 1024px) {
  .service-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .chart-section {
    flex: none;
    width: 100%;
  }
  
  .chart-container {
    width: 100%;
    max-width: 350px;
    height: 300px;
    margin: 0 auto;
  }
  
  .indicators-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px !important;
  }
  
  .chart-card h3 {
    flex-direction: column;
    gap: 8px;
  }
  
  .score-badge {
    font-size: 12px;
    padding: 3px 10px;
  }
  
  .indicators-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .indicator-card {
    padding: 12px;
  }
  
  .indicator-description {
    font-size: 11px;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 220px !important;
  }
  
  .indicator-header {
    gap: 8px;
  }
  
  .indicator-name {
    font-size: 12px;
  }
  
  .indicator-score {
    font-size: 12px;
  }
}
</style>
