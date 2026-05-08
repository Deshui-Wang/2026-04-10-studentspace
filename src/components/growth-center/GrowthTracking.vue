<template>
  <div class="growth-tracking">
    <!-- 1. 顶部统计概览 -->
    <div class="header">
      <div class="header-info">
        <h2>成长与跟踪</h2>
        <p class="subtitle">记录日常成长，复盘与反馈，量化进步轨迹</p>
      </div>
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
          </div>
          <div class="progress-text">成长进度 {{ Math.round(growthProgressPercentage) }}%</div>
        </div>
      </div>
      
      <div class="card stat-card weekly-activities-card">
        <div class="card-header-mini">
          <div class="header-content">
            <i class="el-icon-date activity-icon"></i>
            <h4>本周活动</h4>
          </div>
          <div class="activity-trend"><span>+12%</span></div>
        </div>
        <div class="activity-content">
          <div class="stat-value">{{ weeklyActivities }}</div>
          <div class="activity-label">项活动</div>
        </div>
      </div>

      <div class="card stat-card ai-suggestion-card">
        <div class="ai-header">
          <i class="el-icon-cpu"></i>
          <h4>智能回顾</h4>
        </div>
        <p>“{{ aiSuggestion }}”</p>
      </div>
    </div>
    
    <!-- 2. 核心：成长动态中心 (页签切换) -->
    <div class="growth-dynamic-center card">
      <div class="center-header">
        <div class="title-with-icon">
          <i class="el-icon-odometer"></i>
          <h4>成长动态中心</h4>
        </div>
        
        <!-- 核心页签切换 -->
        <div class="tab-switcher">
          <div 
            class="tab-item" 
            :class="{ active: activeSection === 'map' }"
            @click="activeSection = 'map'"
          >
            <i class="el-icon-share"></i>
            <span>成长全景图</span>
          </div>
          <div 
            class="tab-item" 
            :class="{ active: activeSection === 'log' }"
            @click="activeSection = 'log'"
          >
            <i class="el-icon-document"></i>
            <span>成长日志</span>
          </div>
        </div>
      </div>

      <div class="center-content">
        <!-- 视图1：成长全景图 (增加高度) -->
        <div v-if="activeSection === 'map'" class="view-fade">
          <div class="panorama-wrapper">
            <GrowthChainMap :embedded="true" style="height: 720px !important;" />
          </div>
        </div>

        <!-- 视图2：成长日志 (原明细列表) -->
        <div v-if="activeSection === 'log'" class="view-fade">
          <div class="filters-mini">
            <div class="filter-group">
              <el-radio-group v-model="filters.type" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="study">学习</el-radio-button>
                <el-radio-button label="exercise">练习</el-radio-button>
                <el-radio-button label="project">项目</el-radio-button>
              </el-radio-group>
            </div>
            <div class="filter-actions">
              <el-date-picker
                v-model="filters.dateRange"
                type="daterange"
                size="small"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </div>
          </div>

          <div class="event-list-container">
            <div v-if="filteredEvents.length === 0" class="empty-state">
              <i class="el-icon-document-delete"></i>
              <p>暂无符合条件的记录</p>
            </div>
            <div class="event-item" v-for="(e, i) in filteredEvents" :key="i">
              <div class="event-side">
                <div class="event-type-dot" :data-type="e.type"></div>
                <div class="line"></div>
              </div>
              <div class="event-main">
                <div class="event-meta">
                  <span class="event-date">{{ e.date }}</span>
                  <span class="event-tag" :data-type="e.type">{{ typeLabel(e.type) }}</span>
                  <span class="event-points">成长 +{{ e.growth }}</span>
                </div>
                <h5 class="event-title">{{ e.title }}</h5>
                <p class="event-detail">{{ e.detail }}</p>
                <div class="event-tags" v-if="e.tags">
                  <span v-for="t in e.tags" :key="t" class="tag-chip"># {{ t }}</span>
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
import { computed, reactive, ref } from 'vue'
import GrowthChainMap from './GrowthChainMap.vue'

// 视图切换状态
const activeSection = ref('map')

const filters = reactive({ type: 'all', dateRange: [] })

const events = ref(generateMockEvents())

const weeklyActivities = computed(() => events.value.filter(e => {
  const today = new Date();
  const eventDate = new Date(e.date);
  const diff = today.getTime() - eventDate.getTime();
  return diff / (1000 * 3600 * 24) <= 7;
}).length)

const growthProgressPercentage = ref(71)
const aiSuggestion = ref("🎯 本周 AI 建议：你在神经网络架构实战上表现卓越。建议下周重点攻克 Transformer 多头注意力机制的数学推导，这将是你进阶架构师的关键一步。")

const filteredEvents = computed(() => {
  return events.value.filter(e => {
    if (filters.type !== 'all' && e.type !== filters.type) return false
    return true
  })
})

function typeLabel(type) {
  const labels = { study: '学习', exercise: '练习', exam: '测验', project: '项目' }
  return labels[type] || type
}

function generateMockEvents() {
  const today = new Date()
  const day = (offset) => {
    const d = new Date(today); d.setDate(d.getDate() - offset);
    return d.toISOString().slice(0, 10)
  }
  return [
    { date: day(1), type: 'study', title: '深度学习 - 损失函数优化', detail: '深入理解了 CrossEntropy 与 MSE 的应用场景，完成了相关代码实现。', growth: 5, tags: ['AI', '数学', '实战'] },
    { date: day(2), type: 'project', title: '智能医疗助手原型开发', detail: '完成了多模态接口对接，测试了语音识别在老年康养场景下的准确率。', growth: 12, tags: ['项目', '康养'] },
    { date: day(3), type: 'exercise', title: 'Python 高级特性练习', detail: '掌握了装饰器与生成器的高级用法，代码运行效率提升 20%。', growth: 3, tags: ['编程', '基础'] },
    { date: day(5), type: 'study', title: '大模型微调策略学习', detail: '调研了 LoRA 与 QLoRA 技术，制定了针对特定垂直领域的微调方案。', growth: 8, tags: ['LLM', '前沿'] }
  ]
}
</script>

<style scoped>
.growth-tracking { display: flex; flex-direction: column; gap: 24px; padding: 4px; }
.header { margin-bottom: 8px; }
.header h2 { font-size: 24px; font-weight: 800; color: #1e293b; margin: 0 0 4px 0; }
.subtitle { color: #64748b; font-size: 14px; margin: 0; }

.stats-grid { display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 20px; }
.card { background: #fff; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0,0,0,0.03); padding: 24px; }

/* 统计卡片精简化 */
.stat-card { display: flex; flex-direction: column; justify-content: space-between; }
.growth-achievement-card { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1px solid #bae6fd; }
.achievement-content { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.achievement-text h4 { font-size: 18px; color: #0369a1; margin: 0; }
.achievement-subtitle { font-size: 12px; color: #0ea5e9; }
.badge-icon { width: 48px; height: 48px; }
.progress-bar { height: 8px; background: rgba(14, 165, 233, 0.1); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
.progress-fill { height: 100%; background: #0ea5e9; border-radius: 4px; }
.progress-text { font-size: 12px; color: #0369a1; font-weight: 600; }

.weekly-activities-card { background: #fff; }
.card-header-mini { display: flex; justify-content: space-between; margin-bottom: 12px; }
.header-content { display: flex; align-items: center; gap: 8px; }
.activity-icon { color: #8b5cf6; font-size: 20px; }
.header-content h4 { font-size: 14px; color: #64748b; margin: 0; }
.activity-trend { font-size: 12px; color: #10b981; font-weight: 700; background: #ecfdf5; padding: 2px 8px; border-radius: 10px; }
.activity-content { display: flex; align-items: baseline; gap: 6px; }
.stat-value { font-size: 28px; font-weight: 900; color: #1e293b; }
.activity-label { font-size: 12px; color: #94a3b8; }

.ai-suggestion-card { background: #f8fafc; border: 1px dashed #cbd5e1; }
.ai-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; color: #4f46e5; }
.ai-header h4 { font-size: 14px; margin: 0; }
.ai-suggestion-card p { font-size: 13px; line-height: 1.6; color: #475569; margin: 0; font-style: italic; }

/* 动态中心卡片与页签切换 */
.growth-dynamic-center { min-height: 850px; }
.center-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }
.title-with-icon { display: flex; align-items: center; gap: 12px; }
.title-with-icon i { font-size: 22px; color: #4f46e5; }
.title-with-icon h4 { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0; }

.tab-switcher { display: flex; background: #f1f5f9; padding: 4px; border-radius: 10px; gap: 4px; }
.tab-item { 
  display: flex; align-items: center; gap: 8px; padding: 8px 16px; 
  border-radius: 8px; cursor: pointer; transition: all 0.2s;
  font-size: 13px; font-weight: 600; color: #64748b;
}
.tab-item:hover { color: #1e293b; }
.tab-item.active { background: #fff; color: #4f46e5; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

.panorama-wrapper { border-radius: 12px; overflow: hidden; }

/* 日志视图样式 */
.filters-mini { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.event-list-container { max-width: 900px; margin: 0 auto; padding-left: 20px; }
.event-item { display: flex; gap: 20px; position: relative; }
.event-side { display: flex; flex-direction: column; align-items: center; width: 12px; }
.event-type-dot { width: 12px; height: 12px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 0 2px #e2e8f0; z-index: 2; margin-top: 5px; }
.event-type-dot[data-type="study"] { box-shadow: 0 0 0 2px #3b82f6; background: #3b82f6; }
.event-type-dot[data-type="project"] { box-shadow: 0 0 0 2px #8b5cf6; background: #8b5cf6; }
.event-type-dot[data-type="exercise"] { box-shadow: 0 0 0 2px #10b981; background: #10b981; }
.event-side .line { width: 2px; flex: 1; background: #f1f5f9; margin: 4px 0; }

.event-main { flex: 1; padding-bottom: 32px; text-align: left; }
.event-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.event-date { font-size: 12px; font-weight: 800; color: #94a3b8; }
.event-tag { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
.event-tag[data-type="study"] { background: #eff6ff; color: #3b82f6; }
.event-tag[data-type="project"] { background: #f5f3ff; color: #8b5cf6; }
.event-points { margin-left: auto; font-size: 13px; font-weight: 800; color: #10b981; }

.event-title { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
.event-detail { font-size: 13px; color: #64748b; line-height: 1.6; margin: 0 0 12px 0; }
.tag-chip { font-size: 10px; color: #4f46e5; background: #f5f3ff; padding: 2px 8px; border-radius: 4px; margin-right: 8px; font-weight: 600; }

.view-fade { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
