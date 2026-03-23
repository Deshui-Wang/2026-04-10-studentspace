import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  // 推荐使用 完整类型推断的箭头函数来定义状态
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      userInfo: {
          username: '李启明',
          role: 'student',
          avatar: '/pic/body.png'
      },
      isLoggedIn: true,
      profile: {}
    }
  },
  
  getters: {
    getUserInfo: (state) => state.userInfo,
    getIsLoggedIn: (state) => state.isLoggedIn
  },
  
  actions: {
    login(userData) {
      this.userInfo = userData
      this.isLoggedIn = true
    },
    
    logout() {
      this.userInfo = null
      this.isLoggedIn = false
    },
    
    updateProfile(profileData) {
      this.profile = { ...this.profile, ...profileData }
    }
  }
})