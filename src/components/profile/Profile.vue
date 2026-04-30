<template>
  <div class="career-section-container">
    <!-- 头部标题与描述 -->
    <div class="section-header profile-page-header">
      <div class="header-left">
        <h2 class="section-title">个人中心</h2>
        <p class="section-subtitle">全方位管理您的档案，多维度展示您的专业成长轨迹</p>
      </div>
      <div class="header-right">
        <!-- 完整的 9 项水平导航 -->
        <div class="horizontal-nav-container">
          <div class="horizontal-nav">
            <router-link to="/profile/basic-info" active-class="active" class="nav-btn">基本信息</router-link>
            <router-link to="/profile/reflection" active-class="active" class="nav-btn">个人反思</router-link>
            <router-link to="/profile/evaluation" active-class="active" class="nav-btn">教师评价</router-link>
            <router-link to="/profile/projects" active-class="active" class="nav-btn">项目经历</router-link>
            <router-link to="/profile/scholarships" active-class="active" class="nav-btn">奖学金</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  if (router.currentRoute.value.path === '/profile') {
    router.replace('/profile/basic-info')
  }
})
</script>

<style scoped>
.career-section-container {
  padding: 32px 48px;
  background: #f8f9fb;
  min-height: 100vh;
}

.profile-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 改为 center 适应较长的导航 */
  margin-bottom: 32px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  position: relative;
  padding-left: 16px;
  text-align: left;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(to bottom, #2b58ff, #1a41cc);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 水平导航容器 - 支持滚动 */
.horizontal-nav-container {
  max-width: 800px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
}

.horizontal-nav-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.horizontal-nav {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
  white-space: nowrap;
}

.nav-btn {
  padding: 8px 16px;
  font-size: 13px; /* 稍微缩小字号以容纳更多项 */
  font-weight: 600;
  color: #64748b;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-btn:hover {
  color: #1a41cc;
  background: rgba(43, 88, 255, 0.05);
}

.nav-btn.active {
  background: white;
  color: #2b58ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.content-area {
  animation: fadeIn 0.5s ease-out;
}

/* 动画效果 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1400px) {
  .profile-page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .horizontal-nav-container {
    width: 100%;
    max-width: none;
  }
}
</style>
