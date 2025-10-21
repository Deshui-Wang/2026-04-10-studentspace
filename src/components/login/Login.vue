<template>
  <div class="login-container">
    <!-- 背景粒子效果 -->
    <div class="particles">
      <div 
        v-for="(particle, index) in particles" 
        :key="index"
        class="particle"
        :style="getParticleStyle(particle)"
      ></div>
    </div>
    
    <!-- 发光效果 -->
    <div class="glow-effect glow-1"></div>
    <div class="glow-effect glow-2"></div>
    <div class="glow-effect glow-3"></div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo-container">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        </div>
        <h1 class="login-title">学生智慧成长空间</h1>
        <p class="login-subtitle">欢迎来到你的学习天地，请登录开始探索</p>
      </div>
      
      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 用户名输入 -->
        <div class="input-group">
          <div class="input-wrapper">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="input-icon">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="3" y="10" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input 
              v-model="formData.username"
              type="text" 
              placeholder="请输入用户名"
              class="form-input"
              :class="{ 'error': errors.username }"
              @focus="clearError('username')"
            />
          </div>
          <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
        </div>
        
        <!-- 密码输入 -->
        <div class="input-group">
          <div class="input-wrapper">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="input-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <input 
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'" 
              placeholder="请输入密码"
              class="form-input"
              :class="{ 'error': errors.password }"
              @focus="clearError('password')"
            />
            <button 
              type="button" 
              @click="togglePassword"
              class="password-toggle"
            >
              <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12A18.45 18.45 0 0 1 5.06 5.06L17.94 17.94Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12A18.5 18.5 0 0 1 19.07 19.07L9.9 4.24Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
        </div>
        
        <!-- 记住我和忘记密码 -->
        <div class="form-options">
          <label class="checkbox-wrapper">
            <input 
              v-model="formData.rememberMe" 
              type="checkbox" 
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">记住我</span>
          </label>
          <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">忘记密码？</a>
        </div>
        
        <!-- 登录按钮 -->
        <button 
          type="submit" 
          class="login-button"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">登录</span>
          <span v-else class="loading-spinner">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="spinner">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
              </circle>
            </svg>
            登录中...
          </span>
        </button>
        
        <!-- 注册链接 -->
        <div class="register-link">
          <span>还没有账户？</span>
          <a href="#" @click.prevent="handleRegister">申请注册</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 错误信息
const errors = reactive({
  username: '',
  password: ''
})

// 状态
const showPassword = ref(false)
const isLoading = ref(false)

// 粒子数据
const particles = ref([])

// 生成粒子
const generateParticles = () => {
  const particleCount = 30
  for (let i = 0; i < particleCount; i++) {
    particles.value.push({
      id: i,
      size: Math.random() * 6 + 3,
      left: Math.random() * 100,
      animationDuration: Math.random() * 15 + 10,
      animationDelay: Math.random() * 5
    })
  }
}

// 获取粒子样式
const getParticleStyle = (particle) => {
  return {
    width: `${particle.size}px`,
    height: `${particle.size}px`,
    left: `${particle.left}%`,
    animationDuration: `${particle.animationDuration}s`,
    animationDelay: `${particle.animationDelay}s`
  }
}

// 切换密码显示
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// 清除错误
const clearError = (field) => {
  errors[field] = ''
}

// 验证表单
const validateForm = () => {
  let isValid = true
  
  // 清除之前的错误
  errors.username = ''
  errors.password = ''
  
  // 验证用户名
  if (!formData.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  }
  
  // 验证密码
  if (!formData.password.trim()) {
    errors.password = '请输入密码'
    isValid = false
  }
  
  return isValid
}

// 处理登录
const handleLogin = async () => {
  if (!validateForm()) {
    return
  }
  
  isLoading.value = true
  
  try {
    // 模拟登录验证
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 验证账号密码
    if (formData.username === 'liqiming' && formData.password === '123456') {
      // 登录成功 - 修复存储逻辑
      const userInfo = {
        username: '李启明',
        id: 1,
        role: 'student'
      }
      
      // 存储认证信息
      localStorage.setItem('token', 'mock-jwt-token-' + Date.now())
      localStorage.setItem('user', JSON.stringify(userInfo))
      localStorage.setItem('isLoggedIn', 'true')
      
      console.log('登录成功，准备跳转到首页')
      
      // 跳转到首页 - 修复路径
      await router.push('/')
    } else {
      // 登录失败
      errors.password = '用户名或密码错误'
    }
  } catch (error) {
    console.error('登录失败:', error)
    errors.password = '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 处理忘记密码
const handleForgotPassword = () => {
  alert('请联系管理员重置密码')
}

// 处理注册
const handleRegister = () => {
  alert('请联系管理员申请注册')
}

// 页面加载时生成粒子
onMounted(() => {
  generateParticles()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b9d 0%, #c44569 25%, #f8b500 50%, #ff9ff3 75%, #54a0ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 粒子效果 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: linear-gradient(45deg, #ff6b9d, #c44569, #f8b500);
  border-radius: 50%;
  opacity: 0.6;
  animation: floatParticle linear infinite;
}

@keyframes floatParticle {
  0% {
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) translateX(50px) rotate(360deg);
    opacity: 0;
  }
}

/* 发光效果 */
.glow-effect {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 107, 157, 0.3) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}

.glow-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  left: 10%;
  animation: floatGlow 6s ease-in-out infinite;
}

.glow-2 {
  width: 200px;
  height: 200px;
  top: 60%;
  right: 15%;
  animation: floatGlow 8s ease-in-out infinite reverse;
}

.glow-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 20%;
  animation: floatGlow 10s ease-in-out infinite;
}

@keyframes floatGlow {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.6;
  }
}

/* 登录卡片 */
.login-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 2;
}

/* Logo区域 */
.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff6b9d, #c44569, #f8b500);
  border-radius: 20px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(255, 107, 157, 0.3);
}

.logo-icon {
  width: 40px;
  height: 40px;
  color: white;
}

.login-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ff6b9d, #c44569, #f8b500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
}

.login-subtitle {
  color: #fff;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 400;
}

/* 表单样式 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #94a3b8;
  z-index: 3;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 52px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #1e293b;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input::placeholder {
  color: #94a3b8;
}

.form-input:focus {
  outline: none;
  border-color: #ff6b9d;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 4px rgba(255, 107, 157, 0.1);
}

.form-input.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.3s ease;
  z-index: 3;
}

.password-toggle:hover {
  color: #ff6b9d;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-left: 4px;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #ff6b9d, #c44569);
  border-color: #ff6b9d;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  color: #64748b;
  font-size: 14px;
  user-select: none;
}

.forgot-password {
  color: #ff6b9d;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #c44569;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #ff6b9d, #c44569, #e84393);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 107, 157, 0.4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-top: 24px;
  color: #64748b;
  font-size: 14px;
}

.register-link a {
  color: #ff6b9d;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #c44569;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    margin: 20px;
    padding: 32px 24px;
  }
  
  .login-title {
    font-size: 2rem;
  }
  
  .logo-container {
    width: 60px;
    height: 60px;
  }
  
  .logo-icon {
    width: 30px;
    height: 30px;
  }
}

/* 淡入动画 */
.login-card {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
