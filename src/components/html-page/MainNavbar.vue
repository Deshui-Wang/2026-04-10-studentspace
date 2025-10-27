<template>
  <div class="main-navbar">
    <div class="nav-left">
      <img src="/pic/logo.ico" class="logo" alt="logo" />
      <div class="title-container">
        <span class="brand-title">Student SpaceX</span>
        <span class="system-title">高校大学生·自由成长·学习空间</span>
      </div>
    </div>
    <ul class="nav-menu">
      <li class="nav-item" :class="{active: currentPath === '/'}" @click="goNav('/')">首页</li>      
      <li class="nav-item" :class="{active: currentPath.startsWith('/data-center')}" @click="goNav('/data-center')">学习中心</li>
      <li class="nav-item" :class="{active: currentPath.startsWith('/ability-test')}" @click="goNav('/ability-test')">能力检测</li>
      <li class="nav-item" :class="{active: currentPath.startsWith('/career-guidance')}" @click="goNav('/career-guidance')">就业指导</li>
      <li class="nav-item evaluation-center-item" :class="{active: currentPath.startsWith('/EvaluationCenter')}" @click="goNav('/EvaluationCenter')">
        成长中心
        <div class="notification-dot" v-if="hasNewNotifications"></div>
      </li>
      <li class="nav-item" :class="{active: currentPath.startsWith('/profile')}" @click="goNav('/profile')">个人中心</li>
    </ul>
    <div class="nav-user" @click="toggleUserMenu">
      <img src="/pic/student01.png" class="user-avatar" alt="用户头像" />
      <span class="user-name">{{ displayName }}</span>
      <i class="el-icon-arrow-down" :class="{ 'is-reverse': showUserMenu }"></i>
      
      <!-- 用户下拉菜单 -->
      <div class="user-dropdown" v-show="showUserMenu">
        <div class="dropdown-item" @click="goToProfile">
          <i class="el-icon-user"></i>
          <span>个人中心</span>
        </div>
        <div class="dropdown-item" @click="logout">
          <i class="el-icon-switch-button"></i>
          <span>退出登录</span>
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

// 退出登录
const logout = () => {
  showUserMenu.value = false
  // 清除本地存储的用户信息
  localStorage.removeItem('username')
  localStorage.removeItem('token')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('user')
  // 重置用户状态
  currentUser.value = ''
  // 跳转到登录页面
  router.push('/login').catch(err => {
    console.error('跳转到登录页面失败:', err)
  })
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  const userElement = event.target.closest('.nav-user')
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
  // 添加全局点击事件监听
  document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.main-navbar {
  width: 100%;
  height: 78px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  padding: 0 20px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 5px;
}

.logo {
  width: 58px;
  height: 58px;
  margin-right: 6px;
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.brand-title {
  font-size: 24px;
  font-weight: 600;
  color: #6841ea;
  line-height: 1.2;
  margin-bottom: 5px;
}

.system-title {
  font-size: 16px;
  font-weight: 500;
  color: #f3a209;
  line-height: 1.2;
}

.nav-menu {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 16px;
}

.nav-item {
  font-size: 15px;
  color: #333;
  cursor: pointer;
  padding: 8px 18px;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  position: relative;
}

.nav-item.active, .nav-item:hover {
  background: #f0f5ff;
  color: #8b5cf6;
  font-weight: 600;
}

/* Tch AI+ 特殊样式 */
.tch-ai-item {
  position: relative;
  overflow: hidden;
  background: transparent;
  border: 2px solid transparent;
  box-shadow: none;
}

.tch-ai-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.tch-ai-item:hover::before {
  left: 100%;
}

.tch-ai-text {
  position: relative;
  z-index: 2;
  color: #8b5cf6;
  font-weight: 600;
}

.tch-ai-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.tch-ai-item:hover .tch-ai-glow {
  opacity: 1;
}

/* 用户信息区域 */
.nav-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}

.nav-user:hover {
  background: #f8f9fa;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  object-fit: cover;
}

.user-name {
  font-size: 18px;
  font-weight: 400;
  color: #374151;
}

.el-icon-arrow-down {
  font-size: 12px;
  color: #9ca3af;
  transition: transform 0.2s;
}

.el-icon-arrow-down.is-reverse {
  transform: rotate(180deg);
}

/* 用户下拉菜单 */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item i {
  font-size: 16px;
  color: #6b7280;
}

.dropdown-item:last-child {
  border-top: 1px solid #f3f4f6;
}

.dropdown-item:last-child:hover {
  background: #fef2f2;
  color: #dc2626;
}

.dropdown-item:last-child i {
  color: #dc2626;
}

/* 成长中心提醒点 */
.evaluation-center-item {
  position: relative;
}

.notification-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-menu {
    gap: 20px;
  }
  
  .nav-item {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .system-title {
    font-size: 16px;
  }
  
  .user-name {
    display: none;
  }
  
  .user-dropdown {
    right: -10px;
  }
}
</style>
