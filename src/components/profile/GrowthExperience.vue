<template>
  <div class="education-container">
    <!-- 职称晋升时光轴 -->
    <div class="promotion-section">
      <div class="promotion-header">
        <h3>职称晋升时光轴</h3>
        <p class="promotion-subtitle">以时间为轴，呈现关键晋升节点与发展脉络</p>
      </div>
      <div class="timeline-container">
        <div class="timeline-axis"></div>
        <div
          v-for="(m, idx) in sortedPromotionMilestones"
          :key="idx"
          class="timeline-item"
        >
          <div class="timeline-marker" :class="{ current: m.current }"></div>
          <div class="timeline-meta">
            <span class="timeline-time" :class="{ current: m.current }">
              {{ m.year }}年{{ String(m.month).padStart(2, '0') }}月
            </span>
            <span class="promotion-badge" :class="{ current: m.current }">{{ m.title }}</span>
          </div>
          <div class="experience-card">
            <div class="institution">
              <div class="institution-info">
                <span class="institution-name">{{ m.org || '—' }}</span>
                <span class="major">{{ m.context }}</span>
              </div>
            </div>
            <div v-if="m.highlights && m.highlights.length" class="promotion-highlights">
              <ul>
                <li v-for="(h, i) in m.highlights" :key="i">{{ h }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
// 添加教育奖励
const addEducationAward = () => {
  console.log('打开添加教育奖励')
}

// 职称晋升时光轴数据
const promotionMilestones = [
  {
    year: 2016,
    month: 7,
    title: '助教',
    org: '信息工程学院',
    context: '入职，参与本科教学与课程助教工作',
    highlights: ['参与《程序设计基础》重构', '协助建设课程实验资源']
  },
  {
    year: 2019,
    month: 1,
    title: '讲师',
    org: '信息工程学院',
    context: '独立承担核心课程教学，开展科研',
    highlights: ['主持教改项目1项', '发表教学论文2篇']
  },
  {
    year: 2021,
    month: 3,
    title: '副教授',
    org: '信息工程学院',
    context: '形成稳定研究方向并指导研究生',
    highlights: ['省部级课题立项', '指导研究生获得竞赛奖励']
  },
  {
    year: 2025,
    month: 5,
    title: '教授',
    current: true,
    org: '信息工程学院',
    context: '团队建设与学科发展，行业影响力提升',
    highlights: ['主持国家级项目', '发表高水平论文', '产学研合作落地']
  }
]

// 按时间倒序（年、月）
const sortedPromotionMilestones = computed(() =>
  [...promotionMilestones].sort((a, b) => (b.year - a.year) || ((b.month ?? 0) - (a.month ?? 0)))
)
</script>

<style scoped>
.education-container {
  padding: 24px;
  min-height: 100vh;
}

.promotion-section {
  margin-bottom: 24px;
}

.promotion-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
  padding: 1px 1px 27px 1px;
}

.promotion-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 0;
  text-align: left;
}

.promotion-subtitle {
  color: #6b7280;
  font-size: 14px;
}

.promotion-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #111827;
  font-weight: 700;
}

.promotion-badge.current {
  background: #2563eb;
  color: #ffffff;
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

/* 仅在职称晋升区调整时间线左内边距以放置日期标签 */
.promotion-section .timeline-container {
  padding-left: 120px;
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
  /* 为时间与职称胶囊预留高度 + 10px 间距 */
  --meta-h: 28px;
  padding-top: calc(var(--meta-h) + 25px);
}

.timeline-marker {
  position: absolute;
  left: -107px;
  top: 20px;
  width: 16px;
  height: 16px;
  background: white;
  border: 3px solid #8b5cf6;
  border-radius: 50%;
  z-index: 2;
}

.timeline-marker.current {
  border-color: #2563eb;
}

/* 时间与职称胶囊容器 */
.timeline-meta {
  position: absolute;
  left: -80px;
  top: 14px;
  transform: translateX(-8px);
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--meta-h);
}

/* 节点日期标签 */
.timeline-time {
  padding: 2px 8px;
  font-size: 12px;
  color: #6b7280;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  white-space: nowrap;
}

.timeline-time.current {
  color: #1d4ed8;
  background: #eff6ff;
  border-color: #93c5fd;
  font-weight: 600;
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
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); */
  /* border: 1px solid #e5e7eb; */
  transition: all 0.3s ease;
}

.experience-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.promotion-highlights ul {
  margin: 8px 0 0 0;
  padding-left: 0;
  color: #374151;
  font-size: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.promotion-highlights li {
  list-style: none;
  background: #eef2ff;
  color: #3730a3;
  border: 1px solid #c7d2fe;
  padding: 6px 10px;
  border-radius: 8px;
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
  
  /* 仅在职称晋升区保留较大左内边距，移动端略收缩 */
  .promotion-section .timeline-container {
    padding-left: 88px;
  }

  .timeline-container {
    padding-left: 32px;
  }
  
  .timeline-marker {
    left: -32px;
  }

  .timeline-meta {
    left: -80px;
    transform: translateX(-6px);
  }
  .timeline-time {
    font-size: 12px;
  }
  /* 适配移动端：如需略小的胶囊高度，可在此调整 */
  .timeline-item {
    --meta-h: 28px;
  }
}
</style> 