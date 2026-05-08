<template>
  <div class="goal-path-container">
    <!-- 1. 目标列表区域 -->
    <div class="goals-grid">
      <!-- 新建目标卡片占位 -->
      <div class="goal-card new-goal-placeholder" @click="openNewGoalModal">
        <div class="placeholder-content">
          <i class="el-icon-plus"></i>
          <span>开启新的成长目标</span>
        </div>
      </div>

      <!-- 已有目标卡片 -->
      <div 
        v-for="goal in currentGoals" 
        :key="goal.id" 
        class="goal-card real-goal"
        :class="getGoalStatusClass(goal)"
        @click="viewGoalDetail(goal)"
      >
        <div class="card-tag">{{ getGoalTypeText(goal.type) }}</div>
        <div class="card-body">
          <div class="goal-icon">🎯</div>
          <h4 class="goal-name">{{ goal.title }}</h4>
          
          <div class="progress-section">
            <div class="progress-info">
              <span class="label">达成进度</span>
              <span class="value">{{ goal.progress }}%</span>
            </div>
            <el-progress 
              :percentage="goal.progress" 
              :stroke-width="10" 
              :color="getProgressColor(goal.progress)"
              :show-text="false"
            ></el-progress>
          </div>

          <div class="meta-info">
            <div class="meta-item">
              <i class="el-icon-time"></i>
              <span>截止: {{ goal.deadline }}</span>
            </div>
            <div class="meta-item">
              <i class="el-icon-aim"></i>
              <span>目标值: {{ goal.targetScore }}分</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <el-button type="text" class="detail-btn">查看路径详情 <i class="el-icon-right"></i></el-button>
        </div>
      </div>
    </div>

    <!-- 2. 侧滑页面：新建/配置目标管理 (Drawer) -->
    <el-drawer 
      :title="isEdit ? '编辑目标管理' : '开启新的成长目标'" 
      v-model="showGoalModal" 
      size="600px"
      direction="rtl"
      custom-class="modern-goal-drawer"
      :append-to-body="true"
      destroy-on-close
    >
      <div class="drawer-config-content">
        <div class="config-steps">
          <!-- 目标基础设定 -->
          <div class="config-section">
            <div class="section-tag">STEP 01</div>
            <h5 class="section-h">设定核心目标</h5>
            <el-form :model="goalForm" label-position="top" class="custom-form">
              <el-form-item label="目标岗位/名称">
                <el-input v-model="goalForm.title" placeholder="例如：人工智能架构专家"></el-input>
              </el-form-item>
              <div class="form-row">
                <el-form-item label="目标类型" style="flex: 1;">
                  <el-select v-model="goalForm.type" placeholder="请选择" style="width: 100%;">
                    <el-option label="职业岗位" value="job"></el-option>
                    <el-option label="技能考证" value="skill"></el-option>
                    <el-option label="学术深造" value="academic"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="截止日期" style="flex: 1;">
                  <el-date-picker v-model="goalForm.deadline" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                </el-form-item>
              </div>
            </el-form>
          </div>

          <!-- 差距分析 -->
          <div class="config-section">
            <div class="section-tag">STEP 02</div>
            <h5 class="section-h">能力现状评估</h5>
            <div class="gap-analysis-container">
              <div class="score-display">
                <div class="ring-mini">
                  <span class="num">{{ currentScore }}</span>
                  <span class="txt">当前值</span>
                </div>
                <div class="gap-text">
                  距离目标还差 <span class="danger">{{ gap }}</span> 分
                </div>
              </div>
              <div class="slider-box">
                <el-slider v-model="currentScore" :max="100"></el-slider>
                <div class="slider-labels">
                  <span>小白</span>
                  <span>专家</span>
                </div>
              </div>
            </div>
          </div>

          <!-- AI 里程碑生成 -->
          <div class="config-section">
            <div class="section-tag">STEP 03</div>
            <div class="ai-title-row">
              <h5 class="section-h">AI 智能分解路径</h5>
              <el-button 
                type="primary" 
                size="mini" 
                round
                :loading="isGenerating" 
                @click="generateMilestones"
                :disabled="!goalForm.title"
                class="ai-gen-btn"
              >
                🤖 智能生成
              </el-button>
            </div>
            
            <div class="ai-milestone-list" v-if="milestones.length > 0">
              <div v-for="(m, index) in milestones" :key="index" class="milestone-item-mini">
                <div class="m-idx">{{ index + 1 }}</div>
                <div class="m-content">
                  <div class="m-t">{{ m.title }}</div>
                  <div class="m-d">{{ m.desc }}</div>
                </div>
                <div class="m-time">{{ m.timeline }}</div>
              </div>
            </div>
            <div v-else class="ai-placeholder">
              输入目标后点击“智能生成”，AI 将为您规划达成路径
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="drawer-action-footer">
          <el-button @click="showGoalModal = false" class="cancel-btn">暂不开启</el-button>
          <el-button type="primary" class="save-confirm-btn" @click="handleSaveGoal">立即开启成长路径</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 3. 详情侧滑抽屉：由右向左滑出 (Drawer) -->
    <el-drawer
      v-model="showDetailDrawer"
      :title="currentDetailGoal?.title"
      direction="rtl"
      size="500px"
      custom-class="goal-detail-drawer"
      destroy-on-close
    >
      <div class="drawer-content" v-if="currentDetailGoal">
        <!-- 头部进度状态 -->
        <div class="detail-status-section">
          <div class="progress-circle-wrap">
            <el-progress type="circle" :percentage="currentDetailGoal.progress" :width="100" :color="getProgressColor(currentDetailGoal.progress)"></el-progress>
          </div>
          <div class="status-meta">
            <div class="meta-row">
              <span class="label">目标类型:</span>
              <el-tag size="small" type="info">{{ getGoalTypeText(currentDetailGoal.type) }}</el-tag>
            </div>
            <div class="meta-row">
              <span class="label">预期分值:</span>
              <span class="value">{{ currentDetailGoal.targetScore }}分</span>
            </div>
            <div class="meta-row">
              <span class="label">剩余时间:</span>
              <span class="value accent">约 45 天</span>
            </div>
          </div>
        </div>

        <!-- 详细里程碑链路 -->
        <div class="detail-section">
          <h5 class="section-title"><i class="el-icon-map-location"></i> 详细里程碑链路</h5>
          <div class="detail-timeline">
            <el-steps direction="vertical" :active="2" finish-status="success">
              <el-step 
                v-for="(m, i) in (milestones.length > 0 ? milestones : defaultMilestones)" 
                :key="i"
                :title="m.title"
                :description="m.desc"
              >
                <template #icon>
                  <div class="step-icon">{{ i + 1 }}</div>
                </template>
              </el-step>
            </el-steps>
          </div>
        </div>

        <!-- 任务清单 -->
        <div class="detail-section">
          <h5 class="section-title"><i class="el-icon-notebook-2"></i> 今日推荐任务</h5>
          <div class="task-list">
            <div class="task-item">
              <el-checkbox>完成“智慧康养”章节视频观看</el-checkbox>
              <span class="time">30min</span>
            </div>
            <div class="task-item">
              <el-checkbox>提交第三阶段模拟实操报告</el-checkbox>
              <span class="time">1h</span>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="showDetailDrawer = false">关闭详情</el-button>
          <el-button type="primary" @click="handleEditGoal">编辑设置</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

// --- 状态数据 ---
const showGoalModal = ref(false)
const showDetailDrawer = ref(false)
const isEdit = ref(false)
const isGenerating = ref(false)
const currentDetailGoal = ref(null)

// 已有目标列表 Mock 数据
const currentGoals = ref([
  { id: 1, title: '智慧康养机构运营经理', type: 'job', progress: 45, deadline: '2025-12-30', targetScore: 85 },
  { id: 2, title: '高级健康数据分析师', type: 'skill', progress: 12, deadline: '2026-06-15', targetScore: 90 },
  { id: 3, title: '认知症干预实训专家', type: 'job', progress: 78, deadline: '2025-09-20', targetScore: 80 }
])

const defaultMilestones = [
  { title: '基础理论储备', desc: '完成相关专业领域的 5 门核心课程学习', timeline: '1-2个月' },
  { title: '模拟实操训练', desc: '在实训中心完成 40 小时的岗位情景模拟练习', timeline: '1个月' },
  { title: '实战项目深度参与', desc: '在合作机构进行为期 3 个月的深度轮岗实操', timeline: '3个月' }
]

// 弹窗表单数据
const goalForm = reactive({
  title: '',
  type: 'job',
  deadline: '',
  targetScore: 85
})

const currentScore = ref(30)
const milestones = ref([])

// --- 计算属性 ---
const gap = computed(() => Math.max(0, (goalForm.targetScore || 85) - currentScore.value))

// --- 交互方法 ---
const openNewGoalModal = (e) => {
  e.stopPropagation() 
  isEdit.value = false
  Object.assign(goalForm, { title: '', type: 'job', deadline: '', targetScore: 85 })
  milestones.value = []
  currentScore.value = 30
  showGoalModal.value = true
}

// 查看详情：侧滑抽屉
const viewGoalDetail = (goal) => {
  currentDetailGoal.value = goal
  showDetailDrawer.value = true
}

const handleEditGoal = () => {
  showDetailDrawer.value = false
  isEdit.value = true
  Object.assign(goalForm, { ...currentDetailGoal.value })
  showGoalModal.value = true
}

const generateMilestones = () => {
  if (!goalForm.title) return
  isGenerating.value = true
  setTimeout(() => {
    milestones.value = [
      { title: '基础理论储备', desc: '完成核心课程学习', timeline: '1个月' },
      { title: '模拟实操训练', desc: '情景模拟练习', timeline: '1个月' },
      { title: '实战项目参与', desc: '轮岗实操', timeline: '3个月' }
    ]
    isGenerating.value = false
  }, 1000)
}

const handleSaveGoal = () => {
  if (!goalForm.title) {
    ElMessage.warning('请输入目标名称')
    return
  }
  const newGoal = {
    id: Date.now(),
    title: goalForm.title,
    type: goalForm.type,
    progress: 0,
    deadline: goalForm.deadline ? new Date(goalForm.deadline).toLocaleDateString() : '未设置',
    targetScore: goalForm.targetScore
  }
  currentGoals.value.unshift(newGoal)
  showGoalModal.value = false
  ElMessage.success('成功开启目标管理！')
}

// 辅助方法
const getGoalTypeText = (type) => {
  const map = { job: '职业岗位', skill: '技能考证', academic: '学术深造' }
  return map[type] || '其他'
}

const getProgressColor = (val) => {
  if (val < 30) return '#94a3b8'
  if (val < 70) return '#3b82f6'
  return '#10b981'
}

const getGoalStatusClass = (goal) => {
  if (goal.progress > 70) return 'status-fast'
  if (goal.progress < 20) return 'status-slow'
  return ''
}
</script>

<style scoped>
.goal-path-container { padding: 0; }

/* 列表网格 */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.goal-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  padding: 24px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.goal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.06);
  border-color: #7c3aed33;
}

/* 占位卡片 */
.new-goal-placeholder {
  border: 2px dashed #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(248, 250, 252, 0.5);
}

.placeholder-content { display: flex; flex-direction: column; align-items: center; gap: 12px; color: #94a3b8; }
.placeholder-content i { font-size: 24px; }

/* 详情抽屉样式 */
.drawer-content { padding: 24px; }

.detail-status-section {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #f8fafc;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 32px;
}

.status-meta { flex: 1; }
.meta-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; font-size: 14px; }
.meta-row .label { color: #94a3b8; }
.meta-row .value { color: #1e293b; font-weight: 600; }
.meta-row .value.accent { color: #7c3aed; }

.detail-section { margin-bottom: 32px; }
.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-timeline { padding-left: 10px; }
.step-icon {
  width: 20px;
  height: 20px;
  background: #7c3aed;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}

.task-list { display: flex; flex-direction: column; gap: 12px; }
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
}
.task-item .time { font-size: 12px; color: #94a3b8; }

.drawer-footer { padding: 20px; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; }
.drawer-footer .el-button { flex: 1; }

.card-tag { position: absolute; top: 20px; right: 20px; font-size: 10px; padding: 4px 10px; background: #f1f5f9; color: #64748b; border-radius: 20px; font-weight: 700; }
.goal-icon { font-size: 32px; margin-bottom: 16px; }
.goal-name { font-size: 17px; color: #1e293b; margin: 0 0 20px 0; line-height: 1.4; }
.progress-info { display: flex; justify-content: space-between; margin-bottom: 8px; }
.progress-info .label { font-size: 12px; color: #94a3b8; }
.progress-info .value { font-size: 14px; font-weight: 800; color: #1e293b; }
.meta-info { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
.meta-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; }
.card-footer { margin-top: 16px; text-align: right; }
.detail-btn { font-weight: 600; color: #7c3aed; }

/* 新增：侧滑配置抽屉样式 */
.drawer-config-content { padding: 30px; }
.config-steps { display: flex; flex-direction: column; gap: 40px; }
.config-section { position: relative; }
.section-tag { font-size: 10px; font-weight: 800; color: #7c3aed; background: #f5f3ff; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 8px; }
.section-h { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0 0 20px 0; }

.custom-form :deep(.el-form-item__label) { font-weight: 700; color: #64748b; font-size: 13px; }
.form-row { display: flex; gap: 20px; }

.gap-analysis-container { background: #f8fafc; border-radius: 16px; padding: 20px; border: 1px solid #f1f5f9; }
.score-display { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.ring-mini { width: 64px; height: 64px; border-radius: 50%; background: #fff; border: 2px solid #7c3aed22; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.ring-mini .num { font-size: 18px; font-weight: 800; color: #7c3aed; }
.ring-mini .txt { font-size: 9px; color: #94a3b8; }
.gap-text { font-size: 14px; font-weight: 600; color: #475569; }
.gap-text .danger { color: #ef4444; font-size: 18px; margin: 0 4px; }
.slider-labels { display: flex; justify-content: space-between; margin-top: 4px; font-size: 11px; color: #94a3b8; }

.ai-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.ai-gen-btn { box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2); }
.ai-milestone-list { display: flex; flex-direction: column; gap: 12px; }
.milestone-item-mini { display: flex; align-items: center; gap: 15px; background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #f1f5f9; }
.m-idx { width: 24px; height: 24px; background: #f1f5f9; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #7c3aed; }
.m-content { flex: 1; }
.m-t { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
.m-d { font-size: 11px; color: #94a3b8; }
.m-time { font-size: 11px; font-weight: 700; color: #7c3aed; }
.ai-placeholder { text-align: center; padding: 40px; background: #f8fafc; border-radius: 12px; border: 1px dashed #e2e8f0; color: #94a3b8; font-size: 12px; }

.drawer-action-footer { width: 100%; display: flex; gap: 15px; padding: 0 10px; }
.cancel-btn { flex: 1; border-radius: 12px; height: 48px; font-weight: 600; }
.save-confirm-btn { flex: 2; border-radius: 12px; height: 48px; font-weight: 700; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border: none; box-shadow: 0 8px 20px rgba(124, 58, 237, 0.25); }
</style>
