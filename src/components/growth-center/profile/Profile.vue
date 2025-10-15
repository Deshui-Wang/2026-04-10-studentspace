<template>
  <div class="light-dashboard-container">
    <!-- 导航栏 -->
    <div class="profile-navigation">
      <div class="nav-items">
        <div class="nav-item" @click="scrollToSection('basic-info')">基本信息画像</div>
        <div class="nav-item" @click="scrollToSection('ai-competency')">AI智能胜任力</div>
        <div class="nav-item" @click="scrollToSection('teaching-ability')">教学能力</div>
        <div class="nav-item" @click="scrollToSection('service-capability')">社会服务能力</div>
        <div class="nav-item" @click="scrollToSection('research-achievement')">科研与成果</div>
        <div class="nav-item" @click="scrollToSection('teaching-quality')">综合教学质量</div>
      </div>
      <div class="nav-actions">
        <button class="generate-report-btn" @click="generateReport">
          <span class="btn-icon">📊</span>
          <span class="btn-text">生成画像报告</span>
        </button>
      </div>
    </div>

    <div class="overview-grid">
      <!-- 基本信息画像 -->
      <div id="basic-info" class="profile-section">
        <BasicInfoProfile />
      </div>
      
      <!-- AI智能胜任力 -->
      <div id="ai-competency" class="profile-section">
        <AICompetency />
      </div>
      
      <!-- 教学能力 -->
      <div id="teaching-ability" class="profile-section">
        <TeachingAbility />
      </div>
      
      <!-- 社会服务 -->
      <div id="service-capability" class="profile-section">
        <ServiceCapability />
      </div>
      
      <!-- 科研与成果 -->
      <div id="research-achievement" class="profile-section">
        <ResearchAchievement />
      </div>
      
      <!-- 教学质量指数 -->
      <div id="teaching-quality" class="profile-section">
        <TeachingQuality />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BasicInfoProfile from './BasicInfoProfile.vue'
import AICompetency from './AICompetency.vue'
import TeachingAbility from './TeachingAbility.vue'
import ServiceCapability from './ServiceCapability.vue'
import ResearchAchievement from './ResearchAchievement.vue'
import TeachingQuality from './TeachingQuality.vue'

// 滚动到指定区域
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 生成画像报告 - 切换到报告页面
const generateReport = () => {
  // 触发父组件的标签页切换事件
  const event = new CustomEvent('switch-to-report')
  window.dispatchEvent(event)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.light-dashboard-container {
  color: #333;
  padding: 10px 10px;
  font-family: 'Poppins', sans-serif;
  margin: auto;
  width: 100%;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 */
.profile-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.nav-items {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-item {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  color: #3b82f6;
  background: #f1f5f9;
}

.nav-item:active {
  transform: translateY(1px);
}

.nav-actions {
  display: flex;
  align-items: center;
}

.generate-report-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.generate-report-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.generate-report-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  font-family: 'Poppins', sans-serif;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
}

.profile-section {
  scroll-margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .nav-items {
    gap: 16px;
  }
  
  .nav-item {
    font-size: 13px;
    padding: 6px 10px;
  }
}

@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-navigation {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .nav-items {
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }
  
  .nav-item {
    font-size: 12px;
    padding: 6px 8px;
  }
  
  .generate-report-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .nav-items {
    gap: 8px;
  }
  
  .nav-item {
    font-size: 11px;
    padding: 4px 6px;
  }
}
</style>
