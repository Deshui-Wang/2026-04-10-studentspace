<template>
  <div class="main-navbar global-sidebar">
    <!-- 顶部 Logo 区域 -->
    <div class="sidebar-top">
      <div class="nav-left">
        <img src="/pic/logo.ico" class="logo" alt="logo" />
        <div class="title-container">
          <span class="brand-title">Student SpaceX</span>
          <span class="system-title">高校大学生·学习空间</span>
        </div>
      </div>
    </div>

      <!-- 菜单区域 -->
    <div class="sidebar-content">
      <!-- 导航菜单列表 -->
      <ul class="nav-menu">
        <!-- 2. 首页 -->
        <li class="nav-item" :class="{active: currentPath === '/'}" @click="goNav('/')">
          <i class="el-icon-s-home"></i>
          <span class="nav-text">首页</span>
        </li>      
        
        <!-- 3. 学习空间区域 -->
        <li class="menu-divider"></li>
        <li class="menu-section-header">学习空间</li>

        <li class="nav-item data-item" :class="{active: currentPath === '/data-center' && ($route.query.tab === 'teaching' || !$route.query.tab)}" @click="goNav('/data-center?tab=teaching')">
          <i class="el-icon-monitor"></i>
          <span class="nav-text">学习中心</span>
        </li>

        <!-- 8.1 学习资料 (对应资源数据) -->
        <li class="nav-item data-item" :class="{active: currentPath === '/data-center' && $route.query.tab === 'resources'}" @click="goNav('/data-center?tab=resources')">
          <i class="el-icon-folder"></i>
          <span class="nav-text">学习资料</span>
        </li>

        <!-- 8.2 数字化成果 (对应学习成果) -->
        <li class="nav-item data-item" :class="{active: currentPath === '/data-center' && $route.query.tab === 'achievements'}" @click="goNav('/data-center?tab=achievements')">
          <i class="el-icon-document-checked"></i>
          <span class="nav-text">数字化成果</span>
        </li>

        <!-- 8.4 个人口袋 (对应智能口袋) -->
        <li class="nav-item data-item" :class="{active: currentPath === '/data-center' && $route.query.tab === 'reports'}" @click="goNav('/data-center?tab=reports')">
          <i class="el-icon-wallet"></i>
          <span class="nav-text">个人口袋</span>
        </li>

        <!-- 4. 智能检测中心 (原能力检测与成长中心合并) -->
        <li class="menu-divider"></li>
        <li class="menu-section-header">智能检测中心</li>

        <li class="nav-item data-item" :class="{active: currentPath === '/ability-test' && !$route.query.tab}" @click="goNav('/ability-test')">
          <i class="el-icon-cpu"></i>
          <span class="nav-text">检测图谱</span>
        </li>

        <li class="nav-item data-item" :class="{active: currentPath === '/ability-test' && $route.query.tab === 'report'}" @click="goNav('/ability-test?tab=report')">
          <i class="el-icon-document"></i>
          <span class="nav-text">检测报告</span>
        </li>

        <li class="nav-item data-item" :class="{active: currentPath === '/EvaluationCenter' && $route.query.tab === 'goals'}" @click="goNav('/EvaluationCenter?tab=goals')">
          <i class="el-icon-guide"></i>
          <span class="nav-text">目标路径</span>
        </li>

        <li class="nav-item data-item" :class="{active: currentPath === '/EvaluationCenter' && !$route.query.tab}" @click="goNav('/EvaluationCenter')">
          <i class="el-icon-medal"></i>
          <span class="nav-text">成长跟踪</span>
          <div class="notification-dot" v-if="hasNewNotifications"></div>
        </li>

        <!-- 5. 就业指导区域 -->
        <li class="menu-divider"></li>
        <li class="menu-section-header">就业指导</li>

        <li class="nav-item data-item" :class="{active: currentPath === '/profile/resume'}" @click="goNav('/profile/resume')">
          <i class="el-icon-document-copy"></i>
          <span class="nav-text">个人简历</span>
        </li>

        <li class="nav-item data-item" :class="{active: currentPath === '/data-center' && $route.query.tab === 'recruitment'}" @click="goNav('/data-center?tab=recruitment')">
          <i class="el-icon-message-solid"></i>
          <span class="nav-text">招聘信息</span>
        </li>

        <li class="nav-item data-item" :class="{active: currentPath === '/data-center' && $route.query.tab === 'interview'}" @click="goNav('/data-center?tab=interview')">
          <i class="el-icon-mic"></i>
          <span class="nav-text">面试辅导</span>
        </li>

        <li class="nav-item data-item" :class="{active: currentPath === '/data-center' && $route.query.tab === 'ai-interview'}" @click="goNav('/data-center?tab=ai-interview')">
          <i class="el-icon-video-camera"></i>
          <span class="nav-text">AI虚拟面试</span>
        </li>
      </ul>
    </div>

    <!-- 底部辅助与个人中心区域 -->
    <div class="sidebar-footer">
      <!-- 用户信息区域 - 移动到底部作为个人中心 -->
      <div class="nav-user-section bottom-profile" :class="{ active: currentPath.startsWith('/profile') && currentPath !== '/profile/resume' }" @click="goToProfile">
        <div class="user-info-card">
          <img src="/pic/student01.png" class="user-avatar" alt="用户头像" />
          <div class="user-details">
            <span class="user-name">{{ displayName }}</span>
            <span class="user-role">个人中心</span>
          </div>
          <i class="el-icon-setting"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, inject, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const route = useRoute()
const currentPath = computed(() => route.path)

// 注入全局状态
const currentUser = inject('currentUser', ref(''))
const checkAuth = inject('checkAuth', () => {})

// 计算显示的用户名
const displayName = computed(() => {
  if (currentUser.value && typeof currentUser.value === 'object') {
    return currentUser.value.username || '用户'
  }
  return currentUser.value || '李启明'
})

// 新消息提醒状态
const hasNewNotifications = ref(true)

// 用户菜单状态
const showUserMenu = ref(false)

// 导航函数
const goNav = (path) => {
  router.push(path)
  // 点击成长中心后清除提醒
  if (path === '/EvaluationCenter') {
    hasNewNotifications.value = false
  }
}

// 切换用户菜单
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// 跳转到个人中心
const goToProfile = () => {
  showUserMenu.value = false
  router.push('/profile')
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  const userElement = event.target.closest('.nav-user-section')
  if (!userElement) {
    showUserMenu.value = false
  }
}

// 页面加载时获取用户信息
onMounted(() => {
  const user = localStorage.getItem('user')
  if (user) {
    try {
      currentUser.value = JSON.parse(user)
    } catch (e) {
      currentUser.value = user
    }
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.main-navbar {
  width: 260px;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.03);
  position: relative;
  z-index: 100;
}

.sidebar-top {
  padding: 24px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 42px;
  height: 42px;
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: #6841ea;
  line-height: 1.2;
}

.system-title {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  line-height: 1.2;
  margin-top: 2px;
}

.sidebar-content {
  flex-grow: 1;
  padding: 20px 12px;
  overflow-y: auto;
}

/* 用户信息区域样式 - 底部模式 */
.nav-user-section {
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid transparent;
}

.bottom-profile {
  margin-bottom: 12px;
  background: #f8fafc;
}

.nav-user-section:hover {
  background: #eff6ff;
  border-color: #3b82f633;
}

.nav-user-section.active {
  background: #8b5cf6;
  border-color: #8b5cf6;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.user-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.user-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  width: 100%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-user-section.active .user-name,
.nav-user-section.active .user-role,
.nav-user-section.active i {
  color: white;
}

.user-role {
  font-size: 11px;
  color: #94a3b8;
  text-align: left;
  width: 100%;
}

.nav-user-section i {
  color: #cbd5e1;
  font-size: 16px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: #475569;
  border-radius: 8px;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: #eff6ff;
  color: #3b82f6;
}

/* 导航菜单样式 */
.nav-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  font-size: 15px;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
  position: relative;
}

.nav-item i {
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.nav-item.active {
  background: #8b5cf6;
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.nav-item.active i {
  color: white;
}

/* 菜单分组样式 */
.menu-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 16px 8px 8px 8px;
}

.menu-section-header {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: left;
}

.data-item {
  font-size: 14px;
}

/* 成长中心提醒点 */
.evaluation-center-item {
  position: relative;
}

.notification-dot {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #f1f5f9;
}

.help-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.help-item:hover {
  color: #64748b;
  background: #f8fafc;
}

/* 响应式设计 - 大屏幕侧边栏，小屏幕隐藏或抽屉 */
@media (max-width: 1024px) {
  .main-navbar {
    position: fixed;
    left: -260px;
    transition: left 0.3s;
  }
}
</style>
