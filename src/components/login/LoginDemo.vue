<template>
  <div class="demo-container">
    <div class="demo-header">
      <h1>教师成长树 - 登录页面演示</h1>
      <p>这是一个现代化的登录页面，具有玻璃形态、浮动动画和渐变效果</p>
      <div class="demo-actions">
        <button @click="goToLogin" class="demo-button">查看登录页面</button>
        <button @click="goToHome" class="demo-button secondary">返回首页</button>
      </div>
    </div>
    
    <div class="demo-features">
      <h2>页面特性</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3>视觉设计</h3>
          <p>浅色基调背景，玻璃形态透明登录卡，背景模糊效果</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✨</div>
          <h3>动画效果</h3>
          <p>微妙的浮动粒子和发光效果，提升用户体验</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🌈</div>
          <h3>渐变元素</h3>
          <p>文本和按钮上漂亮的蓝绿渐变，现代化设计</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>响应式设计</h3>
          <p>适配各种设备尺寸，具有漂亮的悬停效果</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔐</div>
          <h3>登录功能</h3>
          <p>用户名密码输入，显示/隐藏密码，记住我选项</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔗</div>
          <h3>辅助功能</h3>
          <p>忘记密码链接，注册申请链接，完整的用户流程</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.demo-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 50%, #f8fbff 100%);
  padding: 40px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-header {
  text-align: center;
  margin-bottom: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.demo-header h1 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}

.demo-header p {
  font-size: 1.2rem;
  color: #64748b;
  margin-bottom: 40px;
  line-height: 1.6;
}

.demo-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.demo-button {
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.demo-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.demo-button.secondary {
  background: rgba(255, 255, 255, 0.8);
  color: #667eea;
  border: 2px solid #667eea;
}

.demo-button.secondary:hover {
  background: #667eea;
  color: white;
}

.demo-features {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-features h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 50px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 15px;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .demo-header p {
    font-size: 1rem;
  }
  
  .demo-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .demo-button {
    width: 200px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
