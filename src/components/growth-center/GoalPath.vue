<template>
  <div class="goal-path">
    <div class="header">
      <h2>目标与路径</h2>
      <p class="subtitle">设定学习目标，洞察能力差距，生成达成计划</p>
    </div>

    <div class="grid">
      <!-- 目标设定 -->
      <div class="card">
        <div class="card-title">目标设定</div>
        <div class="form-row">
          <label>目标名称</label>
          <input v-model="goalForm.title" placeholder="例如：通过英语四级 / 拿到数据结构90分" />
        </div>
        <div class="form-row">
          <label>目标类型</label>
          <select v-model="goalForm.type">
            <option value="exam">考试成绩</option>
            <option value="skill">技能提升</option>
            <option value="project">项目成果</option>
          </select>
        </div>
        <div class="form-row">
          <label>目标分值/等级</label>
          <input v-model.number="goalForm.targetScore" type="number" min="0" max="100" placeholder="0-100" />
        </div>
        <div class="form-row">
          <label>截止日期</label>
          <input v-model="goalForm.deadline" type="date" />
        </div>
      </div>

      <!-- 能力现状与差距 -->
      <div class="card">
        <div class="card-title">当前能力与差距</div>
        <div class="gauge">
          <div class="gauge-bar">
            <div class="gauge-fill" :style="{ width: currentPercent + '%' }"></div>
          </div>
          <div class="gauge-text">
            <span>当前：{{ currentScore }}</span>
            <span>目标：{{ safeTarget }}</span>
            <span>差距：{{ gap }}</span>
          </div>
        </div>
        <div class="form-row">
          <label>当前分值估计</label>
          <input v-model.number="currentScore" type="range" min="0" max="100" />
        </div>
      </div>

      <!-- 达成计划配置 -->
      <div class="card full">
        <div class="card-title">达成计划</div>

        <div class="plan-form">
          <div class="plan-row">
            <label>每周投入</label>
            <select v-model="plan.weeklyHours">
              <option :value="2">2小时</option>
              <option :value="4">4小时</option>
              <option :value="6">6小时</option>
              <option :value="8">8小时</option>
              <option :value="10">10小时</option>
            </select>
          </div>
          <div class="plan-row">
            <label>学习方式</label>
            <div class="checkboxes">
              <label><input type="checkbox" value="video" v-model="plan.methods" /> 视频课程</label>
              <label><input type="checkbox" value="book" v-model="plan.methods" /> 书籍/讲义</label>
              <label><input type="checkbox" value="exercise" v-model="plan.methods" /> 题目/实操</label>
              <label><input type="checkbox" value="project" v-model="plan.methods" /> 小项目</label>
            </div>
          </div>
          <div class="plan-row">
            <label>关键里程碑</label>
            <div class="milestones">
              <div class="milestone" v-for="(m, i) in plan.milestones" :key="i">
                <input v-model="m.name" placeholder="里程碑名称" />
                <input v-model="m.date" type="date" />
                <button class="link" @click="removeMilestone(i)">删除</button>
              </div>
              <button class="ghost" @click="addMilestone">+ 添加里程碑</button>
            </div>
          </div>
          <div class="plan-row">
            <label>AI建议</label>
            <div class="ai-suggestion">
              <p>{{ aiSuggestion }}</p>
              <button class="primary" @click="regenerateSuggestion">重新生成</button>
            </div>
          </div>
        </div>

        <div class="actions">
          <button class="primary" @click="savePlan">保存计划</button>
          <button class="secondary" @click="resetAll">重置</button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const goalForm = reactive({
  title: '',
  type: 'exam',
  targetScore: 80,
  deadline: ''
})

const currentScore = ref(50)

const safeTarget = computed(() => {
  return Math.max(0, Math.min(100, Number(goalForm.targetScore) || 0))
})

const gap = computed(() => {
  return Math.max(0, safeTarget.value - Number(currentScore.value || 0))
})

const currentPercent = computed(() => {
  const target = safeTarget.value || 100
  if (target <= 0) return 0
  return Math.round(Math.min(100, (Number(currentScore.value || 0) / target) * 100))
})

const plan = reactive({
  weeklyHours: 6,
  methods: ['exercise'],
  milestones: [
    { name: '完成基础知识梳理', date: '' },
    { name: '阶段测验达到70分', date: '' }
  ]
})

const aiSuggestion = ref('建议每周至少安排3次学习，每次2小时，视频+练习结合，2周完成基础，4周完成进阶。')

function regenerateSuggestion() {
  const hours = plan.weeklyHours
  const diff = gap.value
  aiSuggestion.value = `根据当前差距${diff}分，建议每周投入${hours}小时，采用“视频-练习-复盘”循环；每两周设置一个里程碑并进行小测。`
}

function addMilestone() {
  plan.milestones.push({ name: '', date: '' })
}

function removeMilestone(index) {
  plan.milestones.splice(index, 1)
}

function savePlan() {
  const payload = {
    goal: { ...goalForm },
    currentScore: currentScore.value,
    gap: gap.value,
    plan: JSON.parse(JSON.stringify(plan))
  }
  try {
    localStorage.setItem('student_goal_plan', JSON.stringify(payload))
    alert('已保存到本地（示例）。后端接入后将保存到服务器。')
  } catch (e) {
    console.error(e)
    alert('保存失败，请稍后重试。')
  }
}

function resetAll() {
  goalForm.title = ''
  goalForm.type = 'exam'
  goalForm.targetScore = 80
  goalForm.deadline = ''
  currentScore.value = 50
  plan.weeklyHours = 6
  plan.methods = ['exercise']
  plan.milestones = [
    { name: '完成基础知识梳理', date: '' },
    { name: '阶段测验达到70分', date: '' }
  ]
  regenerateSuggestion()
}

watch([() => plan.weeklyHours, currentScore, () => goalForm.targetScore], regenerateSuggestion, { immediate: true })
</script>

<style scoped>
.goal-path {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header h2 {
  margin: 0;
  font-size: 22px;
}

.subtitle {
  color: #6b7280;
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  padding: 16px;
}

.card.full {
  grid-column: 1 / -1;
}

.card-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.form-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.form-row label { font-size: 13px; color: #374151; }
.form-row input, .form-row select { height: 34px; padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; }

.gauge { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
.gauge-bar { height: 10px; background: #f3f4f6; border-radius: 999px; overflow: hidden; }
.gauge-fill { height: 100%; background: linear-gradient(90deg,#60a5fa,#22c55e); }
.gauge-text { display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; }

.plan-form { display: flex; flex-direction: column; gap: 12px; }
.plan-row { display: flex; flex-direction: column; gap: 8px; }
.checkboxes { display: flex; gap: 16px; flex-wrap: wrap; }
.milestones { display: flex; flex-direction: column; gap: 8px; }
.milestone { display: grid; grid-template-columns: 1fr 160px auto; gap: 8px; }

.actions { display: flex; gap: 10px; margin-top: 8px; justify-content: flex-end; }
.primary { background: #6366f1; color: #fff; border: none; border-radius: 10px; height: 36px; padding: 0 16px; cursor: pointer; box-shadow: 0 4px 14px rgba(99,102,241,0.25); transition: all .2s ease; }
.primary:hover { background: #5457f0; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(99,102,241,0.3); }
.primary:active { transform: translateY(0); }
.secondary { background: #eef2ff; color: #4f46e5; border: none; border-radius: 10px; height: 36px; padding: 0 16px; cursor: pointer; transition: background .2s ease; }
.secondary:hover { background: #e0e7ff; }
.ghost { background: #f9fafb; color: #374151; border: 1px dashed #e5e7eb; border-radius: 10px; height: 32px; padding: 0 12px; cursor: pointer; width: fit-content; }
.ghost:hover { background: #f3f4f6; }
.link { background: transparent; color: #ef4444; border: none; cursor: pointer; }

/* 达成计划：更优布局与可读性 */
.card.full { padding: 18px; }
.plan-form { display: grid; grid-template-columns: 1fr 1fr; column-gap: 20px; row-gap: 14px; }
.plan-form .plan-row label { font-size: 13px; color: #374151; font-weight: 500; }
.plan-form select { height: 36px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 6px 10px; background: #fff; }
.plan-form input[type="checkbox"] { accent-color: #6366f1; }
.plan-form .checkboxes { background: #fafafa; border: 1px solid #f1f5f9; border-radius: 10px; padding: 10px; }

/* 让从第三行起的块级（里程碑、AI建议）占满两列 */
.plan-form .plan-row:nth-child(n+3) { grid-column: 1 / -1; }

/* 里程碑行更清晰的输入外观 */
.milestones { background: #fafafa; border: 1px solid #f1f5f9; border-radius: 10px; padding: 10px; }
.milestone input { height: 34px; padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; }
.link { padding: 0 6px; border-radius: 8px; }
.link:hover { text-decoration: underline; }

/* AI 建议盒子优化 */
.ai-suggestion { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
.ai-suggestion p { margin: 0; color: #374151; line-height: 1.6; }
.ai-suggestion .primary { flex-shrink: 0; height: 32px; }

@media (max-width: 960px) {
  .grid { grid-template-columns: 1fr; }
  .milestone { grid-template-columns: 1fr; }
}
</style>


