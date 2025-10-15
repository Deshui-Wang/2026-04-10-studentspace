<template>
  <div class="module-preview-chart">
    <div class="chart-container" ref="chartContainer"></div>
    <div v-if="!hasChart" class="no-chart-placeholder">
      <div class="placeholder-icon">📊</div>
      <div class="placeholder-text">暂无图表</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  moduleType: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    default: 'bar'
  },
  colorScheme: {
    type: String,
    default: '经典蓝'
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  showLabels: {
    type: Boolean,
    default: true
  }
})

const chartContainer = ref(null)
let chartInstance = null

// 配色方案映射
const colorSchemes = {
  '经典蓝': ['#667eea', '#764ba2'],
  '活力橙': ['#f093fb', '#f5576c'],
  '自然绿': ['#4facfe', '#00f2fe'],
  '温暖黄': ['#43e97b', '#38f9d7'],
  '优雅紫': ['#fa709a', '#fee140'],
  '商务灰': ['#a8edea', '#fed6e3']
}

// 模块类型数据生成器
const moduleDataGenerators = {
  'assets': () => ({
    title: '资产统计',
    data: [
      { name: '教学设备', value: 85, color: '#007aff' },
      { name: '办公用品', value: 62, color: '#34c759' },
      { name: '图书资料', value: 78, color: '#ff9500' },
      { name: '软件授权', value: 45, color: '#5856d6' },
      { name: '其他资产', value: 33, color: '#ff3b30' }
    ]
  }),
  'achievements': () => ({
    title: '成果奖励',
    data: [
      { name: '教学成果', value: 92, color: '#007aff' },
      { name: '科研成果', value: 78, color: '#34c759' },
      { name: '荣誉称号', value: 65, color: '#ff9500' },
      { name: '竞赛指导', value: 88, color: '#5856d6' },
      { name: '其他奖励', value: 56, color: '#ff3b30' }
    ]
  }),
  'digital-literacy': () => ({
    title: '数字素养',
    data: [
      { name: '在线教学', value: 4.2, color: '#007aff' },
      { name: '数字工具', value: 3.8, color: '#34c759' },
      { name: '数据分析', value: 3.5, color: '#ff9500' },
      { name: '创新应用', value: 4.0, color: '#5856d6' },
      { name: '持续学习', value: 3.7, color: '#ff3b30' }
    ]
  }),
  'workload-stats': () => ({
    title: '工作量统计',
    data: [
      { name: '2021', value: 320, color: '#007aff' },
      { name: '2022', value: 380, color: '#34c759' },
      { name: '2023', value: 420, color: '#ff9500' },
      { name: '2024', value: 450, color: '#5856d6' }
    ]
  }),
  'ethics': () => ({
    title: '师德师风',
    data: [
      { name: '学生评价', value: 4.6, color: '#007aff' },
      { name: '同事评价', value: 4.4, color: '#34c759' },
      { name: '领导评价', value: 4.5, color: '#ff9500' },
      { name: '自我评价', value: 4.3, color: '#5856d6' }
    ]
  }),
  'student-data': () => ({
    title: '学生数据',
    data: [
      { name: '优秀率', value: 85, color: '#007aff' },
      { name: '及格率', value: 95, color: '#34c759' },
      { name: '出勤率', value: 92, color: '#ff9500' },
      { name: '满意度', value: 88, color: '#5856d6' }
    ]
  }),
  'courseware-research': () => ({
    title: '课件研发',
    data: [
      { name: '课件数量', value: 45, color: '#007aff' },
      { name: '教案数量', value: 38, color: '#34c759' },
      { name: '视频资源', value: 25, color: '#ff9500' },
      { name: '互动内容', value: 32, color: '#5856d6' }
    ]
  }),
  'teaching-experience': () => ({
    title: '教学经验',
    data: [
      { name: '课程思政', value: 4.1, color: '#007aff' },
      { name: '教学理念', value: 3.9, color: '#34c759' },
      { name: '教学反思', value: 4.0, color: '#ff9500' },
      { name: '实践应用', value: 3.8, color: '#5856d6' }
    ]
  })
}

const hasChart = ref(false)

// 生成图表配置
const generateChartOption = () => {
  const moduleData = moduleDataGenerators[props.moduleType]?.()
  if (!moduleData) return null

  const colors = colorSchemes[props.colorScheme] || colorSchemes['经典蓝']
  const data = moduleData.data

  let option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      show: props.showLegend,
      orient: 'horizontal',
      bottom: '5%',
      textStyle: {
        fontSize: 12
      }
    },
    series: []
  }

  switch (props.chartType) {
    case 'bar':
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: { 
          left: '3%', 
          right: '4%', 
          bottom: '15%', 
          top: '10%',
          containLabel: true 
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { 
            color: '#666', 
            fontSize: 11,
            rotate: data.length > 4 ? 45 : 0
          }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f0f2f5' } },
          axisLabel: { color: '#666', fontSize: 11 }
        },
        series: [{
          name: moduleData.title,
          type: 'bar',
          data: data.map((item, idx) => ({
            value: item.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors[0] },
                { offset: 1, color: colors[1] }
              ]),
              borderRadius: [4, 4, 0, 0],
              shadowBlur: 8,
              shadowColor: colors[0] + '40'
            }
          })),
          barWidth: '60%',
          label: {
            show: props.showLabels,
            position: 'top',
            fontSize: 10,
            color: '#666'
          }
        }]
      }
      break

    case 'line':
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        grid: { 
          left: '3%', 
          right: '4%', 
          bottom: '15%', 
          top: '10%',
          containLabel: true 
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { 
            color: '#666', 
            fontSize: 11,
            rotate: data.length > 4 ? 45 : 0
          }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: '#f0f2f5' } },
          axisLabel: { color: '#666', fontSize: 11 }
        },
        series: [{
          name: moduleData.title,
          type: 'line',
          data: data.map(item => item.value),
          smooth: true,
          lineStyle: {
            color: colors[0],
            width: 3
          },
          itemStyle: {
            color: colors[0],
            borderWidth: 2,
            borderColor: '#fff'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colors[0] + '30' },
              { offset: 1, color: colors[0] + '05' }
            ])
          },
          label: {
            show: props.showLabels,
            position: 'top',
            fontSize: 10,
            color: '#666'
          }
        }]
      }
      break

    case 'pie':
      option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          show: props.showLegend,
          orient: 'vertical',
          right: '5%',
          top: 'center',
          textStyle: { fontSize: 11 }
        },
        series: [{
          name: moduleData.title,
          type: 'pie',
          radius: '60%',
          center: ['40%', '50%'],
          data: data.map((item, idx) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: colors[0] },
                { offset: 1, color: colors[1] }
              ]),
              shadowBlur: 10,
              shadowColor: colors[0] + '40'
            }
          })),
          label: {
            show: props.showLabels,
            formatter: '{b}: {c}',
            fontSize: 10
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      break

    case 'doughnut':
      option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          show: props.showLegend,
          orient: 'vertical',
          right: '5%',
          top: 'center',
          textStyle: { fontSize: 11 }
        },
        series: [{
          name: moduleData.title,
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          data: data.map((item, idx) => ({
            value: item.value,
            name: item.name,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
                { offset: 0, color: colors[0] },
                { offset: 1, color: colors[1] }
              ]),
              shadowBlur: 10,
              shadowColor: colors[0] + '40'
            }
          })),
          label: {
            show: props.showLabels,
            formatter: '{b}: {c}',
            fontSize: 10
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      break

    case 'radar':
      option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: props.showLegend,
          bottom: '5%',
          textStyle: { fontSize: 11 }
        },
        radar: {
          indicator: data.map(item => ({
            name: item.name,
            max: Math.max(...data.map(d => d.value)) * 1.2
          })),
          radius: '70%',
          axisName: {
            fontSize: 11,
            color: '#666'
          }
        },
        series: [{
          name: moduleData.title,
          type: 'radar',
          data: [{
            value: data.map(item => item.value),
            name: moduleData.title,
            itemStyle: {
              color: colors[0] + '60'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: colors[0] + '40' },
                { offset: 1, color: colors[0] + '10' }
              ])
            },
            lineStyle: {
              color: colors[0],
              width: 2
            }
          }]
        }]
      }
      break

    default:
      return null
  }

  return option
}

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  const option = generateChartOption()
  if (!option) {
    hasChart.value = false
    return
  }

  hasChart.value = true
  chartInstance = echarts.init(chartContainer.value)
  chartInstance.setOption(option)

  // 响应式调整
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
}

// 监听属性变化
watch([() => props.moduleType, () => props.chartType, () => props.colorScheme, () => props.showLegend, () => props.showLabels], () => {
  nextTick(() => {
    initChart()
  })
}, { deep: true })

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})
</script>

<style scoped>
.module-preview-chart {
  width: 100%;
  height: 200px;
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.no-chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
}

.placeholder-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.placeholder-text {
  font-size: 14px;
  font-weight: 500;
}
</style>
