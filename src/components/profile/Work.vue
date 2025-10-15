<template>
  <div class="work-experience">
    <!-- 顶部按钮区域 -->
    <div class="top-actions">
      <div class="section-header">工作年限：9年2个月</div>
      <div class="spacer"></div>
      <div class="action-buttons">
        <button class="btn btn-edit">编辑</button>
        <button class="btn btn-add">添加工作经历</button>
      </div>
    </div>
    
    <div class="experience-list">
      <div 
        v-for="(item, index) in workExperience" 
        :key="index"
        class="experience-item"
      >
        <!-- 卡片外的时间和任职单位 -->
        <div class="header-info">
          <div class="time-period">{{ item.timePeriod }}</div>
          <div class="employer-info">
            <span class="institution-name">{{ item.institution }}</span>
            <span class="department">{{ item.department }}</span>
            <span class="position-text">{{ item.position }}</span>
          </div>
        </div>
        
        <!-- 内容卡片 -->
        <div class="content-card">
          <div class="card-content">
            <!-- 左侧标题区域 -->
            <div class="titles-section">
              <div class="title-item">
                <div class="title-label">教授班级:</div>
              </div>
              <div class="title-item">
                <div class="title-label">工作总结:</div>
              </div>
            </div>
            
            <!-- 右侧内容区域 -->
            <div class="content-section">
              <!-- 教授班级 -->
              <div class="classes-grid">
                <span 
                  v-for="(cls, clsIndex) in item.classes" 
                  :key="clsIndex"
                  class="class-tag"
                >
                  {{ cls }}
                </span>
              </div>
              
              <!-- 工作总结 -->
              <div class="documents-list">
                <a 
                  v-for="(doc, docIndex) in item.documents" 
                  :key="docIndex"
                  :href="doc.url" 
                  class="document-link"
                  target="_blank"
                >
                  <span class="document-icon">📄</span>
                  {{ doc.name }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const workExperience = ref([
  {
    timePeriod: '2005年7月 至 2009年9月',
    institution: '北京理工大学',
    department: '计算机工程学院',
    position: '二级讲师',
    classes: [
      '软件工程 2014(一班)',
      '软件工程 2014(二班)',
      '计算机基础 2014(一班)',
      '智能工程 2014(一班)'
    ],
    documents: [
      {
        name: '2014年度上学期教学工作总结报告.doc',
        url: '/documents/2014-teaching-summary.doc'
      },
      {
        name: '理工类学科教学经验总结报告.doc',
        url: '/documents/science-engineering-experience.doc'
      },
      {
        name: '2014年度上学期教学工作总结报告.doc',
        url: '/documents/2014-teaching-summary.doc'
      }
    ]
  },
  {
    timePeriod: '2009年10月 至 2014年6月',
    institution: '清华大学',
    department: '信息科学技术学院',
    position: '副教授',
    classes: [
      '人工智能导论 2015(一班)',
      '机器学习 2015(二班)',
      '深度学习 2016(一班)',
      '计算机视觉 2016(二班)'
    ],
    documents: [
      {
        name: '2015-2016年度教学工作总结.doc',
        url: '/documents/2015-2016-teaching-summary.doc'
      },
      {
        name: '人工智能课程建设报告.doc',
        url: '/documents/ai-course-construction.doc'
      }
    ]
  },
  {
    timePeriod: '2014年7月 至 2019年8月',
    institution: '北京大学',
    department: '计算机科学与技术系',
    position: '教授',
    classes: [
      '数据结构与算法 2017(一班)',
      '操作系统原理 2017(二班)',
      '计算机网络 2018(一班)',
      '数据库系统 2018(二班)'
    ],
    documents: [
      {
        name: '2017-2018年度教学成果总结.doc',
        url: '/documents/2017-2018-teaching-achievements.doc'
      },
      {
        name: '计算机核心课程改革报告.doc',
        url: '/documents/core-course-reform.doc'
      }
    ]
  },
  {
    timePeriod: '2019年9月 至 2022年12月',
    institution: '上海交通大学',
    department: '电子信息与电气工程学院',
    position: '特聘教授',
    classes: [
      '数字信号处理 2020(一班)',
      '通信原理 2020(二班)',
      '信号与系统 2021(一班)',
      '电磁场与电磁波 2021(二班)'
    ],
    documents: [
      {
        name: '2020-2021年度教学工作总结.doc',
        url: '/documents/2020-2021-teaching-summary.doc'
      },
      {
        name: '电子信息类课程建设报告.doc',
        url: '/documents/electronic-info-courses.doc'
      }
    ]
  },
  {
    timePeriod: '2023年1月 至今',
    institution: '浙江大学',
    department: '计算机科学与技术学院',
    position: '讲席教授',
    classes: [
      '软件架构设计 2023(一班)',
      '云计算技术 2023(二班)',
      '大数据分析 2024(一班)',
      '区块链技术 2024(二班)'
    ],
    documents: [
      {
        name: '2023-2024年度教学工作总结.doc',
        url: '/documents/2023-2024-teaching-summary.doc'
      },
      {
        name: '新兴技术课程建设报告.doc',
        url: '/documents/emerging-tech-courses.doc'
      }
    ]
  }
])
</script>

<style scoped>
.section-header {
  font-size: 24px;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 0;
  text-align: left;
}

.work-experience {
  padding: 24px;
  background: #f5f5f500;
  min-height: 100vh;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.spacer {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #fcfcfc;
  color: #8b5cf6;
  border: 1px solid #8b5cf6;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.btn-add {
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

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.experience-list {
  max-width: 1200px;
  margin: 0 auto;
}

.experience-item {
  margin-bottom: 30px;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 20px;
}

.time-period {
  font-size: 16px;
  color: #9ca3af;
  font-weight: 500;
}

.employer-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.institution-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.department {
  font-size: 16px;
  color: #333;
}

.position-text {
  font-size: 16px;
  color: #333;
}

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-content {
  display: flex;
  padding: 30px;
  background: #f5f7ff;
  border: 1px solid #e0e6f1;
}

.titles-section {
  width: 120px;
  flex-shrink: 0;
  margin-right: 30px;
}

.title-item {
  margin-bottom: 40px;
}

.title-item:first-child {
  margin-bottom: 60px;
}

.title-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.content-section {
  flex: 1;
}

.classes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 40px;
}

.class-tag {
  background: #fff;
  color: #3b82f6;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.class-tag:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.document-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.document-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .top-actions {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 0 15px;
  }
  
  .card-content {
    flex-direction: column;
    padding: 20px;
  }
  
  .titles-section {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .title-item {
    margin-bottom: 20px;
  }
  
  .title-item:first-child {
    margin-bottom: 20px;
  }
  
  .classes-grid {
    margin-bottom: 20px;
  }
}
</style> 