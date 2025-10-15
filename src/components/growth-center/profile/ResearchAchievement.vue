<template>
  <div class="chart-card">
    <h3>科研成本消耗与成果奖励 <span class="score-badge">{{ researchScore }}</span></h3>
    <div class="comparison-toggle">
      <button 
        class="toggle-btn" 
        :class="{ active: showComparison }"
        @click="toggleComparison"
      >
        {{ showComparison ? '隐藏对比' : '显示对比' }}
      </button>
    </div>
    <div class="research-content">
      <!-- 左侧雷达图 -->
      <div class="chart-section">
        <div ref="researchChart" class="chart-container"></div>
      </div>
      
      <!-- 右侧指标描述 -->
      <div class="indicators-section">
        <div class="indicators-grid">
          <div v-for="(indicator, index) in researchIndicators" :key="index" class="indicator-card">
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
const researchChart = ref(null)

// 图表实例
let researchChartInstance = null

// 对比显示状态
const showComparison = ref(false)

// 科研与成果分值（6-9.5分之间随机）
const researchScore = ref((Math.random() * 3.5 + 6).toFixed(1))

// 切换对比显示
const toggleComparison = () => {
  showComparison.value = !showComparison.value
  // 重新初始化图表以显示/隐藏对比数据
  setTimeout(() => {
    initResearchChart()
  }, 100)
}

// 图表数据生成函数
function generateResearchData() {
  return [
    { name: '科研项目', value: 2.2, color: '#007aff' },
    { name: '经费奖金比率', value: 1.8, color: '#34c759' },
    { name: '论文发表', value: 2.5, color: '#ff9500' },
    { name: '专利', value: 1.9, color: '#ff3b30' },
    { name: '证书认证', value: 2.1, color: '#af52de' },
    { name: '国际项目', value: 1.7, color: '#5ac8fa' }
  ]
}

// 生成全校平均数据
function generateAverageData() {
  return [
    { name: '科研项目', value: 1.6 },
    { name: '经费奖金比率', value: 1.4 },
    { name: '论文发表', value: 1.8 },
    { name: '专利', value: 1.3 },
    { name: '证书认证', value: 1.5 },
    { name: '国际项目', value: 1.2 }
  ]
}

// 计算属性：生成指标描述数据
const researchIndicators = computed(() => {
  const data = generateResearchData()
  const averageData = generateAverageData()
  
  return data.map(item => {
    const averageItem = averageData.find(avg => avg.name === item.name)
    return {
      ...item,
      averageValue: averageItem ? averageItem.value : 1.3,
      description: getIndicatorDescription(item.name, item.value, averageItem?.value)
    }
  })
})

// 根据指标名称和分值生成描述（增加对比信息）
function getIndicatorDescription(name, value, averageValue = 1.3) {
  const isAboveAverage = value > averageValue
  const difference = (value - averageValue).toFixed(1)
  
  const baseDescriptions = {
    '科研项目': value >= 2.1 ? 
      '在科研项目方面表现优秀，能够承担和完成各类科研项目，具备良好的项目管理和研究能力。' : 
      '需要加强科研项目申请和管理能力，提升项目研究水平，争取更多高质量科研项目。',
    '经费奖金比率': value >= 1.8 ? 
      '科研经费使用效率较高，能够合理配置资源，在有限的经费下取得较好的研究成果。' : 
      '需要优化科研经费使用策略，提高经费利用效率，确保每一分钱都用在刀刃上。',
    '论文发表': value >= 2.4 ? 
      '在学术论文发表方面表现突出，能够产出高质量的学术成果，在学术界具有一定影响力。' : 
      '建议加强学术研究能力，提升论文质量，多参与学术交流，增加高质量论文发表数量。',
    '专利': value >= 1.9 ? 
      '在专利申请和授权方面有一定成果，具备良好的技术创新能力和知识产权保护意识。' : 
      '需要加强技术创新能力，提升专利申请质量，注重知识产权的保护和转化应用。',
    '证书认证': value >= 2.0 ? 
      '持有相关专业证书和认证，具备扎实的专业技能和行业认可度，能够胜任高水平的科研工作。' : 
      '建议考取相关专业证书和认证，提升专业技能水平，增强在行业内的竞争力和认可度。',
    '国际项目': value >= 1.7 ? 
      '在国际合作项目方面有一定经验，能够参与国际学术交流，具备一定的国际视野和合作能力。' : 
      '需要加强国际合作能力，积极参与国际学术交流，提升国际影响力和合作水平。'
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
function initResearchChart() {
  if (!researchChart.value) return
  if (researchChartInstance) { try { researchChartInstance.dispose() } catch {} }
  
  researchChartInstance = echarts.init(researchChart.value)
  const data = generateResearchData()
  const averageData = generateAverageData()
  
  const seriesData = [{
    value: data.map(item => item.value),
    name: '个人科研能力',
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
  }]
  
  // 如果显示对比，添加平均数据
  if (showComparison.value) {
    seriesData.push({
      value: averageData.map(item => item.value),
      name: '全校平均',
      itemStyle: {
        color: '#af52de',
        borderColor: '#af52de',
        borderWidth: 2
      },
      areaStyle: {
        color: 'rgba(175, 82, 222, 0.1)'
      },
      lineStyle: {
        width: 2,
        color: '#af52de',
        type: 'dashed'
      }
    })
  }
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        if (params.seriesName === '个人科研能力') {
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
      data: showComparison.value ? ['个人科研能力', '全校平均'] : []
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
        name: '科研成本消耗与成果奖励',
        type: 'radar',
        data: seriesData,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  researchChartInstance.setOption(option)
}

// 销毁图表
function disposeChart() {
  if (researchChartInstance) {
    try { researchChartInstance.dispose() } catch {}
    researchChartInstance = null
  }
}

// 监听窗口大小变化，重新渲染图表
function handleResize() {
  if (researchChartInstance) {
    try { researchChartInstance.resize() } catch {}
  }
}

onMounted(() => {
  // 生成新的随机分值
  researchScore.value = (Math.random() * 3.5 + 6).toFixed(1)
  initResearchChart()
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
  background: linear-gradient(135deg, #007aff, #5ac8fa);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

/* 主要内容区域布局 */
.research-content {
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
  color: #007aff;
  background: linear-gradient(135deg, #007aff, #5ac8fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

.average-score {
  font-size: 11px;
  color: #af52de;
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
  background: linear-gradient(90deg, #007aff, #5ac8fa);
}

.progress-fill.average {
  background: linear-gradient(90deg, #af52de, #c77dff);
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
  .research-content {
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
  .research-content {
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
