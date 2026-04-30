<template>
  <div class="data-center">
    <div class="data-center-container">
      <!-- 右侧内容区域 (现在占据全部宽度) -->
      <div class="main-content-area">
        <div class="content-section">
          <!-- 教学数据 (上课数据) -->
          <TeachingContent
              v-if="activeTab === 'teaching'"
              :active-sub-tab="activeSubTab"
              @sub-tab-change="setActiveSubTab"
          />

          <!-- 资源数据 -->
          <ResourcesContent
              v-if="activeTab === 'resources'"
              :active-sub-tab="activeSubTab"
              @sub-tab-change="setActiveSubTab"
          />

          <!-- 成果数据 -->
          <AchievementsContent
              v-if="activeTab === 'achievements'"
              :active-sub-tab="activeSubTab"
              @sub-tab-change="setActiveSubTab"
          />

          <!-- 评价数据 -->
          <EvaluationContent
              v-if="activeTab === 'evaluation'"
              :active-sub-tab="activeSubTab"
              @sub-tab-change="setActiveSubTab"
          />

          <!-- 报告数据 (智能口袋) -->
          <ReportsContent
              v-if="activeTab === 'reports'"
              :active-sub-tab="activeSubTab"
              @sub-tab-change="setActiveSubTab"
          />

          <!-- 就业指导-招聘信息 -->
          <RecruitmentContent v-if="activeTab === 'recruitment'" />

          <!-- 就业指导-面试辅导 -->
          <InterviewContent v-if="activeTab === 'interview'" />

          <!-- 就业指导-AI虚拟面试 -->
          <VirtualInterviewContent v-if="activeTab === 'ai-interview'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TeachingContent from '@/components/data-center/data-types/TeachingContent.vue'
import ResourcesContent from '@/components/data-center/data-types/ResourcesContent.vue'
import AchievementsContent from '@/components/data-center/data-types/AchievementsContent.vue'
import EvaluationContent from '@/components/data-center/data-types/EvaluationContent.vue'
import ReportsContent from '@/components/data-center/data-types/ReportsContent.vue'
import RecruitmentContent from '@/components/career-guidance/RecruitmentContent.vue'
import InterviewContent from '@/components/career-guidance/InterviewContent.vue'
import VirtualInterviewContent from '@/components/career-guidance/VirtualInterviewContent.vue'
import { useCommonStore } from "@/stores/index.js"

const route = useRoute()
const commonStore = useCommonStore()

// 各类核心指标数据
const categoryDataMap = {
  teaching: [
    { label: '作业正确率', value: '89%' },
    { label: 'GPA', value: '6' },
    { label: '出勤率', value: '96%' },
    { label: '互动值', value: '9' }
  ],
  resources: [
    { label: '学习资料', value: '16' },
    { label: '智能作品', value: '49' }
  ],
  achievements: [
    { label: '奖学金', value: '3000' },
    { label: '竞赛获奖', value: '7' },
    { label: '优秀评比', value: '5' }
  ],
  evaluation: [
    { label: '自我评价', value: '11' },
    { label: '智能评价', value: '15' },
    { label: '评价教师', value: '42' }
  ],
  reports: [
    { label: '微盘', value: '17' },
    { label: '笔记', value: '6' }
  ],
  recruitment: [
    { label: '今日新增', value: '128' },
    { label: '我的投递', value: '5' }
  ],
  interview: [
    { label: '辅导预约', value: '1' },
    { label: '辅导课程', value: '12' }
  ],
  'ai-interview': [
    { label: '模拟次数', value: '42' },
    { label: '平均得分', value: '85' }
  ]
}

// 当前激活的主菜单
const activeTab = ref('teaching')
// 当前激活的子菜单
const activeSubTab = ref('workload')

// 计算当前分类的数据
const currentCategoryData = computed(() => {
  return categoryDataMap[activeTab.value] || []
})

// 根据主菜单设置默认的子菜单
const syncSubTab = (tab) => {
  if (tab === 'teaching') {
    activeSubTab.value = 'workload'
  } else if (tab === 'resources') {
    activeSubTab.value = 'courses'
  } else if (tab === 'achievements') {
    activeSubTab.value = 'papers'
  } else if (tab === 'evaluation') {
    activeSubTab.value = 'self-evaluation'
  } else if (tab === 'reports') {
    activeSubTab.value = 'archive'
  }
}

// 设置激活的子菜单
const setActiveSubTab = (subTab) => {
  activeSubTab.value = subTab
}

// 监听路由参数变化
watch(() => route.query.tab, (newTab) => {
  if (newTab && categoryDataMap[newTab]) {
    activeTab.value = newTab
    syncSubTab(newTab)
  } else {
    activeTab.value = 'teaching'
    syncSubTab('teaching')
  }
}, { immediate: true })

onMounted(() => {
  if (route.query.tab && categoryDataMap[route.query.tab]) {
    activeTab.value = route.query.tab
    syncSubTab(route.query.tab)
  }
})
</script>

<style scoped>
.data-center {
  min-height: calc(100vh - 0px);
  background: #f8fafc;
  padding: 0;
}

.data-center-container {
  display: flex;
  width: 100%;
  margin: 0 auto;
  min-height: calc(100vh - 0px);
}

/* 右侧内容区样式 (现在是全宽) */
.main-content-area {
  flex-grow: 1;
  width: 100%;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* 动态数据页头样式 */
.dashboard-header {
  background: white;
  padding: 24px 40px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 0; /* 移除页头和内容的间距，让内容自带的 padding 处理 */
}

.header-summary {
  display: flex;
  gap: 64px;
  align-items: center;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
}

.summary-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -32px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 24px;
  background: #e2e8f0;
}

.summary-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.summary-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.content-section {
  flex-grow: 1;
  width: 100%;
  padding: 0; /* 让子组件控制内边距 */
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .dashboard-header {
    padding: 16px 24px;
  }
  
  .header-summary {
    gap: 32px;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .summary-item:not(:last-child)::after {
    display: none;
  }
  
  .summary-value {
    font-size: 24px;
  }
}
</style>


