import { createRouter, createWebHashHistory } from 'vue-router'
import { ref } from 'vue'

// 导入所有页面组件
import Home from '../components/home/HomePage.vue'
import LearningSquare from '../components/collaboration-space/LearningSquare.vue'
import TchAI from '../components/AI-chaozhiren/TchAI.vue'
import AIThinking from '../components/AI-chaozhiren/AIThinking.vue'
import Agent from '../components/AI-chaozhiren/Agent.vue'
import AgentEditor from '../components/AI-chaozhiren/AgentEditor.vue'
import EvaluationCenter from '../components/growth-center/EvaluationCenter.vue'
import Login from '../components/login/Login.vue'
import LoginDemo from '../components/login/LoginDemo.vue'
import DataCenter from '../components/data-center/data-types/DataCenter.vue'
import AbilityTest from '../components/ability-test/AbilityTest.vue'
import CareerGuidance from '../components/career-guidance/CareerGuidance.vue'

// 个人主页与子页面
import Profile from '../components/profile/Profile.vue'
import BasicInfo from '../components/profile/BasicInfo.vue'
import Resume from '../components/profile/Resume.vue'

// 成长中心
import GoalPath from '../components/growth-center/GoalPath.vue'

// 教学管理页面 - 修复导入路径
import WorkloadQuantification from '../components/data-center/teaching-data/WorkloadQuantification.vue'
import Attendance from '../components/data-center/teaching-data/Attendance.vue'
import HomeworkManagement from '../components/data-center/teaching-data/HomeworkManagement.vue'
import {useCommonStore} from "@/stores/index.js";

// 全局状态管理
const isLoggedIn = ref(false)
const currentUser = ref(null)

// 认证检查函数
const checkAuth = () => {
    const commonStore = useCommonStore()
  if (commonStore.isInIframe){
      isLoggedIn.value = true
      return true
  }
  // 检查多种认证状态
  const token = localStorage.getItem('token')
  const isLoggedInFlag = localStorage.getItem('isLoggedIn')
  const user = localStorage.getItem('user')

  if (token && isLoggedInFlag === 'true' && user) {
    isLoggedIn.value = true
    currentUser.value = JSON.parse(user)
    console.log('用户已登录:', currentUser.value)
  } else {
    isLoggedIn.value = false
    currentUser.value = null
    console.log('用户未登录')
  }
}

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/login-demo',
    name: 'LoginDemo',
    component: LoginDemo
  },
  {
    path: '/learning-square',
    name: 'LearningSquare',
    component: LearningSquare
  },
  {
    path: '/tch-ai',
    name: 'TchAI',
    component: TchAI
  },
  {
    path: '/ai-thinking',
    name: 'AIThinking',
    component: AIThinking
  },
  {
    path: '/agent',
    name: 'Agent',
    component: Agent
  },
  {
    path: '/agent-editor',
    name: 'AgentEditor',
    component: AgentEditor
  },
  {
    path: '/EvaluationCenter',
    name: 'EvaluationCenter',
    component: EvaluationCenter
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    redirect: '/profile/basic-info',
    children: [
      {
        path: 'basic-info',
        name: 'BasicInfo',
        component: BasicInfo
      },
      {
        path: 'resume',
        name: 'Resume',
        component: Resume
      }
    ]
  },
  {
    path: '/workload-quantification',
    name: 'WorkloadQuantification',
    component: WorkloadQuantification
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: Attendance
  },
  {
    path: '/homework-management',
    name: 'HomeworkManagement',
    component: HomeworkManagement
  },
  {
    path: '/data-center',
    name: 'DataCenter',
    component: DataCenter
  },
  {
    path: '/ability-test',
    name: 'AbilityTest',
    component: AbilityTest
  },
  {
    path: '/career-guidance',
    name: 'CareerGuidance',
    component: CareerGuidance
  },
  {
    path: '/goal-path',
    name: 'GoalPath',
    component: GoalPath
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // checkAuth()

  console.log('路由守卫检查:', {
    to: to.name,
    isLoggedIn: isLoggedIn.value,
    currentUser: currentUser.value
  })

  // 如果用户未登录且访问的不是登录页面，重定向到登录页
  if (!isLoggedIn.value && to.name !== 'Login' && to.name !== 'LoginDemo') {
    console.log('重定向到登录页')
    next({ name: 'Login' })
  } else {
    console.log('允许访问页面:', to.name)
    next()
  }
})

export default router
export { isLoggedIn, currentUser, checkAuth }
