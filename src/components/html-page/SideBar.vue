<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 控制侧边栏展开/收起
const isCollapsed = ref(false)

// 切换侧边栏状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// 当前路由路径
const currentPath = computed(() => route.path)

// 导航函数
const goNav = (path) => {
  router.push(path)
}

// 侧边栏菜单项
const menuItems = [
  { path: '/', label: '主页', icon: '🏠' },
  { path: '/data-center', label: '学习中心', icon: '📚' },
  { path: '/ability-test', label: '能力检测', icon: '📊' },
  { path: '/career-guidance', label: '就业指导', icon: '💼' },
  { path: '/EvaluationCenter', label: '成长中心', icon: '🌱' },
  { path: '/profile', label: '档案中心', icon: '📁' },
  { path: '/AIAssistant', label: 'AI助手', icon: '🤖' }
]
</script>

<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 折叠/展开按钮 -->
    <div class="sidebar-toggle" @click="toggleSidebar">
      <span class="toggle-icon">{{ isCollapsed ? '»' : '«' }}</span>
    </div>

    <!-- 菜单项 -->
    <ul class="sidebar-menu">
      <li
        v-for="item in menuItems"
        :key="item.path"
        class="sidebar-menu-item"
        :class="{
          active: currentPath === item.path || currentPath.startsWith(item.path + '/'),
          collapsed: isCollapsed
        }"
        @click="goNav(item.path)"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-label" v-if="!isCollapsed">{{ item.label }}</span>
        <span v-if="isCollapsed" class="tooltip">{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar {
  max-width: 200px;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(0,0,0,0.06);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-toggle {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 40px;
  background: #8b5cf6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  z-index: 101;
  font-size: 12px;
}


.sidebar-menu {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 10px 0;
  flex-grow: 1;
}

.sidebar-menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  position: relative;
  font-size: 14px;
  gap: 10px;

}

.sidebar-menu-item:not(.collapsed) {
  justify-content: flex-start;
}

.sidebar-menu-item:hover {
  background: #f0f5ff;
  color: #8b5cf6;
}

.sidebar-menu-item.active {
  background: #f0f5ff;
  color: #8b5cf6;
  font-weight: 600;
}

.menu-icon {
  font-size: 16px;
}

.menu-label {
  flex: 1;
  overflow: hidden;
  white-space: none;
  text-overflow: ellipsis;
  text-align: left;
}

/* 在收起状态下显示工具提示 */
.sidebar.collapsed .sidebar-menu-item {
  justify-content: center;
  padding: 12px 5px;
}

.sidebar.collapsed .sidebar-menu-item .tooltip {
  position: absolute;
  left: 60px;
  top: 0;
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  white-space: nowrap;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
}

.sidebar.collapsed .sidebar-menu-item:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.sidebar.collapsed .sidebar-menu-item .tooltip::before {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent #333 transparent transparent;
}
</style>
