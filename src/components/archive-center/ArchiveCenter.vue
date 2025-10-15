<template>
  <div class="archive-center-page">
    <!-- 当前档案进度显示区 -->
    <div class="current-progress-section">
      <div class="progress-info">
        <h2 class="progress-title">进行中的档案</h2>
        <p class="progress-subtitle">您正在设计和撰写2025年下半年的优秀教师评选报告</p>
        <!-- <p class="progress-task-summary">1个档案管理任务 · 1个报告生成任务 · 3个数据统计任务</p> -->
      </div>
      <div class="progress-card-wrapper">
        <div class="progress-card">
          <div class="progress-card-icon-container">
            <div class="progress-card-icon">
              <div class="document-icon">
                <div class="document-icon-lines"></div>
                <div class="task-badge">档案</div>
              </div>
            </div>
          </div>
          <p class="progress-percentage">已完成 85%</p>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: 85%"></div>
          </div>
          <button class="refresh-button">
            <span class="refresh-icon">📊</span>
            <span>去完成</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 档案报告内容 -->
    <div class="archive-content">
      <ArchiveReport />
    </div>
  </div>
</template>

<script setup>
import ArchiveReport from '@/components/archive-center/ArchiveReport.vue'
</script>

<style scoped>
.archive-center-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
}

/* 当前档案进度显示区 */
.current-progress-section {
  background-color: #1976d2;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 25px 25px;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
  margin: auto;
  max-width: 1400px;
}

.progress-info {
  flex: 1;
  z-index: 1;
  text-align: left;
}

.progress-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.progress-subtitle {
  font-size: 16px;
  margin: 0 0 8px 0;
  opacity: 0.9;
}

.progress-task-summary {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

.progress-card-wrapper {
  flex-shrink: 0;
  margin-left: 40px;
  z-index: 1;
}

.progress-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 260px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  text-align: center;
  color: #1f2937;
  position: relative;
  padding-top: 50px;
}

.progress-card-icon-container {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background: white;
  border-radius: 50%;
  padding: 5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.progress-card-icon {
  width: 100%;
  height: 100%;
  background-color: #d32f2f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.document-icon {
  width: 28px;
  height: 36px;
  background-color: #64b5f6;
  border-radius: 4px;
  position: relative;
}

.document-icon-lines {
  position: absolute;
  top: 8px;
  left: 5px;
  right: 5px;
  height: 2px;
  background-color: white;
  box-shadow: 0 5px 0 0 white, 0 10px 0 0 white, 0 15px 0 0 white;
}

.task-badge {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  color: #333;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  border: 1px solid #ddd;
}

.progress-percentage {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.progress-bar-container {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar {
  height: 100%;
  background: #1976d2;
  border-radius: 3px;
  transition: width 0.5s ease-in-out;
}

.refresh-button {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.refresh-button:hover {
  background-color: #e3f2fd;
}

.refresh-icon {
  font-size: 16px;
  transition: transform 0.5s ease;
}

.refresh-button:hover .refresh-icon {
  transform: rotate(180deg);
}

.archive-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .archive-center-page {
    padding: 16px;
  }
  
  .current-progress-section {
    flex-direction: column;
    text-align: center;
    padding: 32px 20px;
  }
  
  .progress-card-wrapper {
    margin-left: 0;
    margin-top: 20px;
  }
  
  .progress-title {
    font-size: 28px;
  }
  
  .progress-subtitle {
    font-size: 14px;
  }
  
  .progress-task-summary {
    font-size: 12px;
  }
}
</style>
