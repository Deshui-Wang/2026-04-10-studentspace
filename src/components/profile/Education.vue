<template>
  <div class="education-container">
    <!-- 筛选选项 -->
    <div class="filter-section">
      <div class="section-header">最高学历：Doctorate博士</div>
      <button class="add-award-btn" @click="addEducationAward">
        添加教育经历
      </button>
    </div>

    <!-- 时间线内容 -->
    <div class="timeline-container">
      <!-- 时间线轴线 -->
      <div class="timeline-axis"></div>
      
      <!-- 学习经历项目 -->
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="experience-card">
          <div class="card-header">
            <div class="date-range">2005年7月 至 2009年9月</div>
            <div class="degree-type">
              <span class="degree-icon">🎓</span>
              本科
            </div>
          </div>
          <div class="institution">
            <img src="/pic/teacher/person/bjlg.png" alt="北京理工大学" class="institution-logo">
            <div class="institution-info">
              <span class="institution-name">北京理工大学</span>
              <span class="major">计算机软件工程</span>
            </div>
            <div class="certification-status certified">
              <span class="status-icon">✓</span>
              <span class="status-text">已认证</span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-view">查看</button>
            <button class="btn btn-edit">编辑</button>
            <button class="btn btn-upload">上传资料</button>
          </div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="experience-card">
          <div class="card-header">
            <div class="date-range">2009年7月 至 2012年9月</div>
            <div class="degree-type">
              <span class="degree-icon">🎓</span>
              硕士
            </div>
          </div>
          <div class="institution">
            <img src="/pic/teacher/person/bjlg.png" alt="北京理工大学" class="institution-logo">
            <div class="institution-info">
              <span class="institution-name">北京理工大学</span>
              <span class="major">人工智能</span>
            </div>
            <div class="certification-status certified">
              <span class="status-icon">✓</span>
              <span class="status-text">已认证</span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-view">查看</button>
            <button class="btn btn-edit">编辑</button>
            <button class="btn btn-upload">上传资料</button>
          </div>
        </div>
      </div>

      <!-- 学术培训经历项目 -->
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="experience-card">
          <div class="card-header">
            <div class="date-range">2011年7月</div>
            <div class="degree-type academic">
              <span class="degree-icon">🎓</span>
              访问学者
            </div>
          </div>
          <div class="institution">
            <img src="/pic/teacher/person/bjdx.png" alt="北京大学" class="institution-logo">
            <div class="institution-info">
              <span class="institution-name">北京大学</span>
              <span class="major">机器人应用技术</span>
            </div>
            <div class="certification-status certified">
              <span class="status-icon">✓</span>
              <span class="status-text">已认证</span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-view">查看</button>
            <button class="btn btn-edit">编辑</button>
            <button class="btn btn-upload">上传资料</button>
          </div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="experience-card">
          <div class="card-header">
            <div class="date-range">2011年7月</div>
            <div class="degree-type academic">
              <span class="degree-icon">📚</span>
              学术交流
            </div>
          </div>
          <div class="institution">
            <img src="/pic/teacher/person/bjhangtian.png" alt="北京航天技术研究院" class="institution-logo">
            <div class="institution-info">
              <span class="institution-name">北京航天技术研究院</span>
              <span class="major">航天机器人数据分析</span>
            </div>
            <div class="certification-status pending">
              <span class="status-icon">!</span>
              <span class="status-text">待认证</span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-view">查看</button>
            <button class="btn btn-edit">编辑</button>
            <button class="btn btn-upload">上传资料</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加教育经历弹层 -->
    <AddEducationModal 
      :visible="showAddModal"
      @close="closeAddModal"
      @submit="handleAddEducation"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AddEducationModal from './AddEducationModal.vue'

// 弹层状态
const showAddModal = ref(false)

// 添加教育奖励
const addEducationAward = () => {
  showAddModal.value = true
}

// 关闭弹层
const closeAddModal = () => {
  showAddModal.value = false
}

// 处理添加教育经历
const handleAddEducation = (educationData) => {
  console.log('添加教育经历:', educationData)
  // 这里可以调用API保存数据，然后更新列表
  // 暂时只是关闭弹层
  showAddModal.value = false
}
</script>

<style scoped>
.section-header {
  font-size: 24px;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 0;
  text-align: left;
}

.education-container {
  padding: 24px;
  min-height: 100vh;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  border-radius: 12px;
}

.filter-options {
  display: flex;
  gap: 24px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.filter-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #6366f1;
}

.filter-label {
  font-size: 16px;
  color: #374151;
  font-weight: 500;
}

/* 添加教育奖励按钮样式 */
.add-award-btn {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.add-award-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.add-icon {
  font-size: 16px;
}

.timeline-container {
  position: relative;
  padding-left: 40px;
}

.timeline-axis {
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #8b5cf6 0%, #6366f1 100%);
  border-radius: 1px;
}

.timeline-item {
  position: relative;
  margin-bottom: 32px;
}

.timeline-marker {
  position: absolute;
  left: -40px;
  top: 20px;
  width: 16px;
  height: 16px;
  background: white;
  border: 3px solid #8b5cf6;
  border-radius: 50%;
  z-index: 2;
}

.timeline-marker::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #8b5cf6;
  border-radius: 50%;
}

.experience-card {
  background: #f5f7ff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.experience-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.date-range {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.degree-type {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.degree-type.academic {
  background: #e0e7ff;
  color: #4338ca;
}

.degree-icon {
  font-size: 16px;
}

.institution {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.institution-logo {
  width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.institution-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 33px;
}

.institution-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.major {
  font-size: 16px;
  color: #374151;
}

.certification-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  margin-left: auto;
}

.certification-status.certified {
  color: #059669;
}

.certification-status.pending {
  color: #d97706;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
}

.certified .status-icon {
  background: #d1fae5;
}

.pending .status-icon {
  background: #fed7aa;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn {
  padding: 5px 10px;
  border: 1px solid #99bbf3;
  background: white;
  color: #3b82f6;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #3b82f6;
  color: white;
}

.btn:active {
  transform: scale(0.98);
}

@media (max-width: 768px) {
  .education-container {
    padding: 16px;
  }
  
  .timeline-container {
    padding-left: 32px;
  }
  
  .timeline-marker {
    left: -32px;
  }
  
  .filter-section {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .add-award-btn {
    width: 100%;
    justify-content: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
