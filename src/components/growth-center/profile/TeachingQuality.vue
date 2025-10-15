<template>
  <div class="chart-card">
    <h3>综合教学质量 <span class="score-badge">{{ qualityScore }}</span></h3>
    <div class="comparison-toggle">
      <button 
        class="toggle-btn" 
        :class="{ active: showComparison }"
        @click="toggleComparison"
      >
        {{ showComparison ? '隐藏对比' : '显示对比' }}
      </button>
    </div>
    <div class="quality-content">
      <!-- 左侧雷达图 -->
      <div class="chart-section">
        <div ref="qualityChart" class="chart-container"></div>
      </div>
      
      <!-- 右侧指标描述 -->
      <div class="indicators-section">
        <div class="indicators-grid">
          <div v-for="(indicator, index) in qualityIndicators" :key="index" class="indicator-card">
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
const qualityChart = ref(null)

// 图表实例
let qualityChartInstance = null

// 对比显示状态
const showComparison = ref(false)

// 综合教学质量分值（6-9.5分之间随机）
const qualityScore = ref((Math.random() * 3.5 + 6).toFixed(1))

// 切换对比显示
const toggleComparison = () => {
  showComparison.value = !showComparison.value
  // 重新初始化图表以显示/隐藏对比数据
  setTimeout(() => {
    initQualityChart()
  }, 100)
}

// 图表数据生成函数
function generateQualityData() {
  return [
    { name: '学生出勤', value: 2.4, color: '#ff6b6b' },
    { name: '课堂互动', value: 2.1, color: '#4ecdc4' },
    { name: '考试通过', value: 2.3, color: '#45b7d1' },
    { name: '竞赛指导', value: 1.8, color: '#96ceb4' },
    { name: '其他教师评价', value: 1.9, color: '#feca57' },
    { name: '学生评价', value: 2.0, color: '#a8e6cf' }
  ]
}

// 生成全校平均数据
function generateAverageData() {
  return [
    { name: '学生出勤', value: 2.0 },
    { name: '课堂互动', value: 1.8 },
    { name: '考试通过', value: 2.1 },
    { name: '竞赛指导', value: 1.5 },
    { name: '其他教师评价', value: 1.7 },
    { name: '学生评价', value: 1.8 }
  ]
}

// 计算属性：生成指标描述数据
const qualityIndicators = computed(() => {
  const data = generateQualityData()
  const averageData = generateAverageData()
  
  return data.map(item => {
    const averageItem = averageData.find(avg => avg.name === item.name)
    return {
      ...item,
      averageValue: averageItem ? averageItem.value : 1.5,
      description: getIndicatorDescription(item.name, item.value, averageItem?.value)
    }
  })
})

// 根据指标名称和分值生成描述（增加对比信息）
function getIndicatorDescription(name, value, averageValue = 1.5) {
  const isAboveAverage = value > averageValue
  const difference = (value - averageValue).toFixed(1)
  
  const baseDescriptions = {
    '学生出勤': value >= 2.3 ? 
      '学生出勤率保持较高水平，课堂纪律良好，学生参与度积极，体现了良好的教学吸引力和管理能力。' : 
      '需要关注学生出勤情况，改进教学方法，提升课堂吸引力，确保学生积极参与学习。',
    '课堂互动': value >= 2.0 ? 
      '课堂互动效果良好，师生交流活跃，能够有效调动学生积极性，营造良好的学习氛围。' : 
      '建议加强课堂互动设计，采用更多互动式教学方法，提升学生参与度和学习效果。',
    '考试通过': value >= 2.2 ? 
      '学生考试通过率较高，说明教学效果良好，学生掌握知识程度较好，教学质量得到有效保障。' : 
      '需要分析考试通过率偏低的原因，调整教学策略，加强重点难点讲解，提升教学效果。',
    '竞赛指导': value >= 1.8 ? 
      '在竞赛指导方面有一定经验，能够帮助学生参与各类竞赛活动，提升学生实践能力和创新意识。' : 
      '建议加强竞赛指导能力建设，学习先进的指导方法，提升学生竞赛成绩和综合素质。',
    '其他教师评价': value >= 1.9 ? 
      '获得同事的认可和好评，在团队协作、教学交流等方面表现良好，具备良好的职业素养。' : 
      '需要加强与同事的沟通交流，积极参与教学研讨活动，提升团队协作能力和专业影响力。',
    '学生评价': value >= 2.0 ? 
      '学生评价较高，说明教学方式受到学生欢迎，师生关系融洽，教学效果得到学生认可。' : 
      '建议关注学生反馈，改进教学方式，提升教学满意度，建立更好的师生关系。'
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
function initQualityChart() {
  if (!qualityChart.value) return
  if (qualityChartInstance) { try { qualityChartInstance.dispose() } catch {} }
  
  qualityChartInstance = echarts.init(qualityChart.value)
  const data = generateQualityData()
  const averageData = generateAverageData()
  
  const seriesData = [{
    value: data.map(item => item.value),
    name: '个人教学质量',
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
  }]
  
  // 如果显示对比，添加平均数据
  if (showComparison.value) {
    seriesData.push({
      value: averageData.map(item => item.value),
      name: '全校平均',
      itemStyle: {
        color: '#ff9500',
        borderColor: '#ff9500',
        borderWidth: 2
      },
      areaStyle: {
        color: 'rgba(255, 149, 0, 0.1)'
      },
      lineStyle: {
        width: 2,
        color: '#ff9500',
        type: 'dashed'
      }
    })
  }
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        if (params.seriesName === '个人教学质量') {
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
      data: showComparison.value ? ['个人教学质量', '全校平均'] : []
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
        name: '综合教学质量',
        type: 'radar',
        data: seriesData,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }
  
  qualityChartInstance.setOption(option)
}

// 销毁图表
function disposeChart() {
  if (qualityChartInstance) {
    try { qualityChartInstance.dispose() } catch {}
    qualityChartInstance = null
  }
}

// 监听窗口大小变化，重新渲染图表
function handleResize() {
  if (qualityChartInstance) {
    try { qualityChartInstance.resize() } catch {}
  }
}

onMounted(() => {
  // 生成新的随机分值
  qualityScore.value = (Math.random() * 3.5 + 6).toFixed(1)
  initQualityChart()
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

/* 主要内容区域布局 */
.quality-content {
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

.indicator-score {
  font-size: 13px;
  font-weight: 700;
  color: #5856d6;
  background: linear-gradient(135deg, #5856d6, #7e7eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}

.score-comparison {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.average-score {
  font-size: 11px;
  color: #ff9500;
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
  background: linear-gradient(90deg, #5856d6, #7e7eff);
}

.progress-fill.average {
  background: linear-gradient(90deg, #ff9500, #ffad33);
}

.bar-value {
  font-size: 10px;
  color: #666;
  width: 20px;
  text-align: right;
  flex-shrink: 0;
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
  background: linear-gradient(135deg, #ff6b6b, #ff9ff3);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .quality-content {
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
  .quality-content {
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
