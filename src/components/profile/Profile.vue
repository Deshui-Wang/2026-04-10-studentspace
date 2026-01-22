<template>
  <div class="profile-layout">
    <aside class="side-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/profile/basic-info" active-class="active" class="nav-link">
            <span>基本信息</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile/resume" active-class="active" class="nav-link">
            <span>简历档案</span>
          </router-link>
        </li>
      </ul>
    </aside>

    <main class="main-area">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 页面加载时默认跳转到基本信息页面
onMounted(() => {
  // 如果当前路径是 /profile，则重定向到 /profile/basic-info
  if (router.currentRoute.value.path === '/profile') {
    router.replace('/profile/basic-info')
  }
})
</script>

<style scoped>
.profile-layout {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 30px;
  min-height: calc(100vh - 72px);
  margin: auto;
  max-width: 1440px;
  width: 100%;
  padding: 0 24px;
}

.side-nav {
  background: #fff;
  border-right: 1px solid #e8ecf3;
  padding: 16px 0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item { }

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 20px;
  color: #445066;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: #f5f8ff;
}

.nav-link.active {
  background: #eef4ff;
  color: #1677ff;
  border-left-color: #1677ff;
  font-weight: 600;
}

.icon { width: 20px; text-align: center; }

.main-area {
  padding: 16px 24px 24px 0;
}

/* 让主区卡片宽度与整体一致 */
.main-area :deep(.section-card) {
  background: #fff;
  border-radius: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-layout {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
  }
  
  .side-nav {
    border-right: none;
    border-bottom: 1px solid #e8ecf3;
  }
  
  .nav-list {
    display: flex;
    overflow-x: auto;
    gap: 8px;
  }
  
  .nav-link {
    white-space: nowrap;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  
  .nav-link.active {
    border-left: none;
    border-bottom-color: #1677ff;
  }
}
</style>
