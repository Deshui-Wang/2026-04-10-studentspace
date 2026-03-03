import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  // 推荐使用 完整类型推断的箭头函数来定义状态
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      token: localStorage.getItem('token') || '',
      refreshToken: localStorage.getItem('refreshToken') || '',
      userRole: '',
      permissions: []
    }
  },
  
  getters: {
    getToken: (state) => state.token,
    isAuthenticated: (state) => !!state.token,
    getUserRole: (state) => state.userRole,
    getUserPermissions: (state) => state.permissions
  },
  
  actions: {
    setTokens(token, refreshToken = '') {
      this.token = token
      if (refreshToken) {
        this.refreshToken = refreshToken
      }
      // 同时保存到localStorage
      localStorage.setItem('token', token)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
    },
    
    clearTokens() {
      this.token = ''
      this.refreshToken = ''
      this.userRole = ''
      this.permissions = []
      
      // 从localStorage中移除
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },
    
    setUserRole(role) {
      this.userRole = role
    },
    
    setPermissions(permissions) {
      this.permissions = [...permissions]
    }
  }
})