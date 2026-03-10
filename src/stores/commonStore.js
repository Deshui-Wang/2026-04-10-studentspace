import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
  // 推荐使用 完整类型推断的箭头函数来定义状态
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      loading: false,
      message: '',
      messageType: 'info', // success, warning, info, error
      sidebarCollapsed: false,
      theme: 'light', // light, dark
      language: 'zh-CN',
      notifications: [],
      dialogVisible: false,
      dialogOptions: {},
      sideBarMenuIndex: 0
    }
  },

  getters: {
    getLoading: (state) => state.loading,
    getMessage: (state) => state.message,
    getMessageType: (state) => state.messageType,
    getSidebarStatus: (state) => state.sidebarCollapsed,
    getTheme: (state) => state.theme,
    getLanguage: (state) => state.language,
    getNotifications: (state) => state.notifications,
    getDialogVisible: (state) => state.dialogVisible,
    getDialogOptions: (state) => state.dialogOptions,
    isInIframe: () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return false;
      }
    },
  },

  actions: {
    // 设置加载状态
    setLoading(status) {
      this.loading = status
    },

    // 显示消息提示
    showMessage(message, type = 'info') {
      this.message = message
      this.messageType = type

      // 自动清除消息（3秒后）
      setTimeout(() => {
        this.clearMessage()
      }, 3000)
    },

    // 清除消息
    clearMessage() {
      this.message = ''
      this.messageType = 'info'
    },

    // 切换侧边栏状态
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    // 设置侧边栏状态
    setSidebarStatus(collapsed) {
      this.sidebarCollapsed = collapsed
    },

    // 切换主题
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },

    // 设置主题
    setTheme(theme) {
      this.theme = theme
    },

    // 设置语言
    setLanguage(lang) {
      this.language = lang
    },

    // 添加通知
    addNotification(notification) {
      const newNotification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...notification
      }
      this.notifications.push(newNotification)

      // 限制通知数量，最多保留10条
      if (this.notifications.length > 10) {
        this.notifications.shift()
      }
    },

    // 清除通知
    clearNotifications() {
      this.notifications = []
    },

    // 移除单个通知
    removeNotification(id) {
      this.notifications = this.notifications.filter(notif => notif.id !== id)
    },

    // 显示对话框
    showDialog(options = {}) {
      this.dialogOptions = {
        title: '提示',
        message: '',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        ...options
      }
      this.dialogVisible = true
    },

    // 隐藏对话框
    hideDialog() {
      this.dialogVisible = false
      this.dialogOptions = {}
    }
  }
})
