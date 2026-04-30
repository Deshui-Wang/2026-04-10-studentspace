<script setup>
import MainNavbar from './components/html-page/MainNavbar.vue'
import Footer from './components/html-page/Footer.vue'
import AIAssistant from './components/html-page/AIAssistant.vue'
import { ref, provide, onMounted, computed } from 'vue'
import { isLoggedIn, currentUser, checkAuth } from './router/index.js'
import {useCommonStore} from "@/stores/index.js";
import SideBar from "@/components/html-page/SideBar.vue";

// AI助手面板可见性
const isAIAssistantPanelVisible = ref(false)
const commonStore = useCommonStore()
// 头像选择弹框状态
const showAvatarSelector = ref(false)
const avatarSelectorData = ref({
  currentAvatar: '/pic/body.png',
  avatarOptions: []
})
const selectedAvatarId = ref('avatar1')

// 提供全局状态给子组件
provide('isLoggedIn', isLoggedIn)
provide('currentUser', currentUser)
provide('checkAuth', checkAuth)

// 创建事件总线
const eventBus = {
  listeners: {},
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
  },
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  },
  off(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback)
      if (index > -1) {
        this.listeners[event].splice(index, 1)
      }
    }
  }
}

// 提供事件总线给子组件
provide('eventBus', eventBus)

// 监听头像选择弹框事件
eventBus.on('openAvatarSelector', (data) => {
  avatarSelectorData.value = data
  selectedAvatarId.value = 'avatar1'
  showAvatarSelector.value = true
})

// 选择头像
const selectAvatar = (avatarId) => {
  selectedAvatarId.value = avatarId
}

// 确认头像选择
const confirmAvatarSelection = () => {
  const selected = avatarSelectorData.value.avatarOptions.find(
    avatar => avatar.id === selectedAvatarId.value
  )
  if (selected) {
    eventBus.emit('avatarSelected', selected)
    showAvatarSelector.value = false
  }
}

// 关闭弹框
const closeAvatarSelector = () => {
  showAvatarSelector.value = false
}

// 页面加载时检查认证状态
onMounted(() => {
  checkAuth()
})

// 更新AI助手面板可见性
const handleAIAssistantPanelToggle = (isVisible) => {
  isAIAssistantPanelVisible.value = isVisible
}

// 计算属性：决定是否显示导航栏
const shouldShowNavbar = computed(() => {
  // 在登录页面和智能体编辑页面隐藏导航栏
  return window.location.pathname !== "/login" && window.location.pathname !== "/agent-editor"  && !commonStore.isInIframe;
})
</script>

<template>
  <div id="app" :class="{ 'ai-panel-visible': isAIAssistantPanelVisible }">
    <div class="app-layout">
      <!-- 全局侧边栏导航 -->
      <MainNavbar 
        v-if="shouldShowNavbar && !commonStore.isInIframe" 
        class="global-sidebar" 
      />
      <SideBar v-if="commonStore.isInIframe" class="global-sidebar" />

      <!-- 右侧主视图区域 -->
      <div class="main-view-container">
        <div class="main-view-content">
          <router-view />
          <Footer v-if="!$route.meta.hideFooter" />
        </div>
      </div>
    </div>
    
    <!-- 小智人AI智能悬浮球 - 全局显示 -->
    <AIAssistant @panel-toggled="handleAIAssistantPanelToggle" />

    <!-- 头像选择弹层 -->
    <div v-if="showAvatarSelector" class="avatar-selector-overlay" @click="closeAvatarSelector">
      <!-- ... (保持原样) -->
      <div class="avatar-selector-modal" @click.stop>
        <div class="modal-header">
          <h3>选择数字分身形象</h3>
          <button class="close-btn" @click="closeAvatarSelector">×</button>
        </div>
        <div class="avatar-options">
          <div
            v-for="avatar in avatarSelectorData.avatarOptions"
            :key="avatar.id"
            class="avatar-option"
            :class="{ active: selectedAvatarId === avatar.id }"
            @click="selectAvatar(avatar.id)"
          >
            <img :src="avatar.src" :alt="avatar.name" />
            <span class="avatar-name">{{ avatar.name }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="confirm-btn" @click="confirmAvatarSelection">确认选择</button>
          <button class="cancel-btn" @click="closeAvatarSelector">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

.app-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.global-sidebar {
  flex-shrink: 0;
  z-index: 100;
}

.main-view-container {
  flex-grow: 1;
  height: 100vh;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: margin-right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.main-view-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

#app.ai-panel-visible .main-view-container {
  margin-right: 450px;
}

/* 兼容原有类名以减少冲突 */
.main-content {
  display: contents;
}


/* 头像选择弹层样式 */
.avatar-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.avatar-selector-modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.avatar-options {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.avatar-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.avatar-option:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.avatar-option.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.15);
}

.avatar-option img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: contain;
  margin-bottom: 10px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
}

.avatar-name {
  font-size: 0.9rem;
  color: #333;
  text-align: center;
  font-weight: 500;
}

.modal-footer {
  padding: 20px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  border-top: 1px solid #eee;
}

.confirm-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background: #e9ecef;
  color: #333;
}

/* 移动端响应式样式 */
@media (max-width: 768px) {
  .avatar-selector-modal {
    width: 95%;
    max-height: 90vh;
  }

  .avatar-options {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 15px;
  }

  .avatar-option img {
    width: 80px;
    height: 80px;
  }

  .modal-header {
    padding: 15px;
  }

  .modal-header h3 {
    font-size: 1.1rem;
  }

  .modal-footer {
    padding: 15px;
    flex-direction: column;
  }

  .confirm-btn, .cancel-btn {
    width: 100%;
    padding: 12px;
  }
}
</style>
