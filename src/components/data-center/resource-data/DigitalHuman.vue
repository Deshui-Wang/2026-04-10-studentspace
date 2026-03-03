<template>
  <div class="digital-human-page">
    <div class="header-section">
      <h2 class="page-title">数字人资源库</h2>
    </div>

    <div class="cards-grid">
      <div 
        class="human-card" 
        v-for="human in digitalHumans" 
        :key="human.id"
      >
        <!-- 角色形象背景容器 -->
        <div class="card-image-container">
          <!-- 这里使用渐变底色或实际头像作为人物展示的占位 -->
          <img v-if="human.avatar" :src="human.avatar" class="human-avatar-img" alt="avatar" />
          <div v-else class="human-avatar-placeholder">🧑‍💼</div>

          <!-- 左上角 3D/2D 标签 -->
          <div class="type-badge">{{ human.tag }}</div>

          <!-- 悬浮在人物前方的职业/领域标识（蓝紫色药丸） -->
          <div class="role-pill">
            <span class="role-icon">💬</span>
            <span class="role-text">{{ human.role }}</span>
          </div>
        </div>

        <!-- 底部信息条 -->
        <div class="card-footer">
          <div class="footer-left">
            <span class="human-name">{{ human.name }}</span>
          </div>
          <div class="footer-right">
            <span class="status-text">{{ human.status }}</span>
            <span class="edit-icon">📝</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const digitalHumans = ref([
  { 
    id: 1, 
    name: '小李', 
    role: '适老化设计顾...', 
    status: '未分配', 
    avatar: '/pic/tea/shuziren01.png', 
    tag: '3D' 
  },
  { 
    id: 2, 
    name: '王阿姨', 
    role: '慢病管理助手...', 
    status: '未分配', 
    avatar: '/pic/tea/shuziren02.png', 
    tag: '2D' 
  },
  { 
    id: 3, 
    name: '张护工', 
    role: '康复指导专员...', 
    status: '已分配', 
    avatar: '/pic/tea/shuziren01.png', 
    tag: '3D' 
  }
])
</script>

<style scoped>
.digital-human-page {
  padding: 24px;
  background: #f8f9ff;
  min-height: calc(100vh - 200px);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.create-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background: #2563eb;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.human-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.human-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image-container {
  height: 380px;
  position: relative;
  background: linear-gradient(to bottom, #e3f2fd, #bbdefb);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.human-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.human-avatar-placeholder {
  font-size: 120px;
}

.type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.role-pill {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(49, 58, 107, 0.85);
  backdrop-filter: blur(4px);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.role-icon {
  font-size: 14px;
}

.role-text {
  font-weight: 500;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.footer-left {
  display: flex;
  align-items: center;
}

.human-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-text {
  font-size: 13px;
  color: #6b7280;
}

.edit-icon {
  font-size: 14px;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s;
}

.edit-icon:hover {
  color: #4b5563;
}
</style>
