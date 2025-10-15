<template>
  <div class="growth-tracking">
    <div class="header">
      <h2>成长与跟踪</h2>
      <p class="subtitle">记录日常成长，复盘与反馈，量化进步轨迹</p>
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
          <div class="meta">{{ e.date }} · 来源 {{ e.source }}</div>
          <div class="detail" v-if="e.detail">{{ e.detail }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'

const filters = reactive({ type: 'all', start: '', end: '' })

const events = ref(generateMockEvents())

function typeLabel(t) {
  return t === 'study' ? '学习' : t === 'exercise' ? '练习' : t === 'exam' ? '测验' : '项目'
}

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
    { date: day(1), type: 'study', source: '课堂出勤', title: '高等数学 - 全勤', detail: '到课率 100%，课中专注完成随堂练习', growth: 2 },
    { date: day(1), type: 'exercise', source: '作业系统', title: '数据结构作业按时提交', detail: '链表与栈实现，正确率 95%', growth: 3 },
    { date: day(2), type: 'exam', source: '在线测验', title: '英语听力测验完成', detail: '得分 88/100，弱项为细节捕捉', growth: 4 },
    { date: day(3), type: 'project', source: '课程项目', title: '小组项目任务推进', detail: '完成接口联调并通过基础用例', growth: 5 },
    { date: day(4), type: 'exercise', source: '平台学习', title: '编程练习打卡', detail: '每日 1 题，连续打卡 5 天', growth: 2 },
    { date: day(6), type: 'study', source: '课堂互动', title: '积极回答问题', detail: '提出 2 个有价值问题并获得表扬', growth: 2 },
    { date: day(7), type: 'exam', source: '阶段测验', title: '线性代数小测', detail: '得分 92/100，矩阵运算正确率高', growth: 4 },
    { date: day(9), type: 'project', source: '项目管理', title: '提交阶段性报告', detail: '完善进度与风险项，得到导师认可', growth: 3 },
    { date: day(10), type: 'study', source: '课堂出勤', title: '计算机网络 - 到课', detail: '按时到达，课堂笔记完整', growth: 1 }
  ]
}
</script>

<style scoped>
.growth-tracking { display: flex; flex-direction: column; gap: 20px; }
.header h2 { margin: 0; font-size: 22px; }
.subtitle { color: #6b7280; font-size: 13px; }

.card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); padding: 16px; }

.row { display: flex; gap: 12px; flex-wrap: wrap; }
.field { display: flex; flex-direction: row; gap: 6px; }
.date-range { display: flex; align-items: center; gap: 8px; }
.field input, .field select { height: 34px; padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; }



.event-list { display: flex; flex-direction: column; gap: 12px; }
.event { display: flex; flex-direction: column; gap: 6px; border: 1px solid #f3f4f6; border-radius: 10px; padding: 12px; }
.event-head { display: flex; align-items: center; gap: 8px; }
.badge { display: inline-flex; align-items: center; height: 22px; padding: 0 8px; border-radius: 999px; font-size: 12px; color: #111827; background: #eef2ff; }
.badge[data-type="exercise"] { background: #ecfeff; }
.badge[data-type="exam"] { background: #fef3c7; }
.badge[data-type="project"] { background: #dcfce7; }
.title { font-weight: 600; color: #111827; }
.points { margin-left: auto; color: #16a34a; font-weight: 600; }
.meta { font-size: 12px; color: #6b7280; }
.detail { font-size: 13px; color: #374151; }
.empty { color: #9ca3af; font-size: 13px; text-align: center; padding: 16px; }

.primary { background: #6366f1; color: #fff; border: none; border-radius: 8px; height: 36px; padding: 0 14px; cursor: pointer; }
.secondary { background: #eef2ff; color: #4f46e5; border: none; border-radius: 8px; height: 36px; padding: 0 14px; cursor: pointer; }

@media (max-width: 960px) {
  
}
</style>


