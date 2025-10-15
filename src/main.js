import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
// 添加 Element Plus 导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入路由
import router, { isLoggedIn, currentUser, checkAuth } from './router/index.js'

const app = createApp(App)

// 提供全局状态
app.provide('isLoggedIn', isLoggedIn)
app.provide('currentUser', currentUser)
app.provide('checkAuth', checkAuth)

// 注册Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.mount('#app')
