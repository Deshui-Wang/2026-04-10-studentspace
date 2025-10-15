<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="avatar-section">
        <img :src="currentAvatar" alt="教师头像" class="avatar" />
        <div class="avatar-info">
          <h2>{{ teacherInfo.name }}</h2>
          <p>{{ teacherInfo.position }}</p>
        </div>
      </div>
      <div class="tags-section">
        <div class="tags-container">
          <span 
            v-for="tag in wordCloudInfo.tags" 
            :key="tag.text" 
            class="tag" 
            :style="{ backgroundColor: getRandomColor() }"
          >
{{ tag.text }}
          </span>
        </div>
      </div>
      <div class="info-cards-wrapper">
        <div class="info-card">
          <h4>{{ teacherInfo.title }}</h4>
          <ul>
            <li v-for="item in teacherInfo.details" :key="item.label">
              <span class="label">{{ item.label }}</span>
              <span class="value">{{ item.value }}</span>
            </li>
          </ul>
        </div>
        <div class="info-card activity-card">
          <h4>{{ teachingDevInfo.title }}</h4>
          <ul>
            <li v-for="(item, index) in teachingDevInfo.details" :key="index">
              <p>
                <span v-for="(part, partIndex) in item" :key="partIndex" :class="part.highlight ? `tag tag-${part.highlight}` : ''">
                  {{ part.text }}
                </span>
              </p>
            </li>
          </ul>
        </div>
        <div class="info-card activity-card">
          <h4>{{ aiCompetencyInfo.title }}</h4>
          <ul>
            <li v-for="(item, index) in aiCompetencyInfo.details" :key="index">
              <p>
                <span v-for="(part, partIndex) in item" :key="partIndex" :class="part.highlight ? `tag tag-${part.highlight}` : ''">
                  {{ part.text }}
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

// 注入事件总线
const eventBus = inject('eventBus')

// 响应式数据
const currentAvatar = ref('/pic/teacher/66.jpg')
const teacherInfo = ref({
  title: '基础信息',
  name: '张教授',
  position: '计算机科学与技术学院',
  details: [
    { label: '工号', value: 'T2024001' },
    { label: '部门', value: '计算机科学与技术学院' },
    { label: '职位', value: '副教授' },
    { label: '入职时间', value: '2018年9月' },
    { label: '学历', value: '硕士' },
    { label: '专业', value: '计算机科学与技术' }
  ]
})

const teachingDevInfo = ref({
  title: '教学发展',
  details: [
    [
      { text: '教学经验' },
      { text: ' 6年 ' },
      { text: '教学经验', highlight: 'experience' }
    ],
    [
      { text: '课程数量' },
      { text: ' 12门 ' },
      { text: '课程', highlight: 'courses' }
    ],
    [
      { text: '学生评价' },
      { text: ' 4.9分 ' },
      { text: '好评率', highlight: 'rating' }
    ],
    [
      { text: '教学创新' },
      { text: ' 8项 ' },
      { text: '创新实践', highlight: 'innovation' }
    ]
  ]
})

const aiCompetencyInfo = ref({
  title: 'AI智能胜任力',
  details: [
    [
      { text: 'AI工具使用' },
      { text: ' 7种 ' },
      { text: '智能工具', highlight: 'ai-tools' }
    ],
    [
      { text: '智能体开发' },
      { text: ' 3款 ' },
      { text: '自研工具', highlight: 'ai-agents' }
    ],
    [
      { text: '数据建模' },
      { text: ' 5个 ' },
      { text: '分析模型', highlight: 'data-models' }
    ],
    [
      { text: '智能工时' },
      { text: ' 72% ' },
      { text: '效率提升', highlight: 'efficiency' }
    ],
    [
      { text: '教学应用' },
      { text: ' 9个 ' },
      { text: 'AI场景', highlight: 'teaching-ai' }
    ],
    [
      { text: '建模分析', highlight: 'modeling-analysis' },
      { text: ' 用于智能工具 ' },
      { text: '知识库复用', highlight: 'kb-reuse' }
    ]
  ]
})

const wordCloudInfo = ref({
  tags: [
    { text: '业务骨干' },
    { text: '中坚力量' },
    { text: '学历有上升空间' },
    { text: '校内核心专业' },
    { text: '党政活动响应积极' },
    { text: '校企合作紧密' },
    { text: '个人经验发表较为频繁' },
    { text: '好评率4.9' },
    { text: '学生内口碑较高' },
    { text: '坚持人工智能以人为本原则' },
    { text: '熟练使用常见智能工具' },
    { text: '智能体狂热开发爱好者' },
    { text: '数据资产保护意识强' }
  ]
})

// Define a color palette for the word cloud tags
const colorPalette = [
  'rgba(169, 204, 227, 0.7)', // light blue
  'rgba(163, 228, 215, 0.7)', // mint
  'rgba(250, 215, 160, 0.7)', // light orange
  'rgba(215, 189, 226, 0.7)', // light purple
  'rgba(249, 231, 159, 0.7)', // light yellow
  'rgba(162, 217, 206, 0.7)', // light teal
  'rgba(245, 183, 177, 0.7)', // light pink
  'rgba(169, 223, 191, 0.7)', // light green
  'rgba(230, 176, 170, 0.7)'  // another light pink/red
];

// Function to get a random color from the palette
const getRandomColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length)];

// 监听事件总线
eventBus.on('switchToProfile', () => {
  console.log('切换到Profile页面')
})

// 监听事件总线
eventBus.on('switchToHome', () => {
  console.log('切换到Home页面')
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.profile-header {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 24px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 44px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid rgba(139, 92, 246, 0.1);
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 0px solid #8b5cf6;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
}

.avatar-info h2 {
  font-size: 2.5rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: left;
}

.avatar-info p {
  font-size: 1.2rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.tags-section {
  margin-bottom: 32px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.tag {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  user-select: none;
}

.tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
}

.tag-experience { background: linear-gradient(135deg, #fef3c7, #fde68a); }
.tag-courses { background: linear-gradient(135deg, #dbeafe, #bfdbfe); }
.tag-rating { background: linear-gradient(135deg, #dcfce7, #bbf7d0); }
.tag-innovation { background: linear-gradient(135deg, #fce7f3, #fbcfe8); }
.tag-ai-tools { background: linear-gradient(135deg, #e0e7ff, #c7d2fe); }
.tag-ai-agents { background: linear-gradient(135deg, #f0fdf4, #dcfce7); }
.tag-data-models { background: linear-gradient(135deg, #fefce8, #fef3c7); }
.tag-efficiency { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); }
.tag-teaching-ai { background: linear-gradient(135deg, #fdf2f8, #fce7f3); }
.tag-modeling-analysis { background: linear-gradient(135deg, #f0fdf4, #dcfce7); }
.tag-kb-reuse { background: linear-gradient(135deg, #fefce8, #fef3c7); }

.info-cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.info-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.info-card h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(139, 92, 246, 0.1);
  text-align: center;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.info-card li:hover {
  background: rgba(139, 92, 246, 0.05);
  border-radius: 8px;
  padding-left: 12px;
  padding-right: 12px;
}

.info-card li:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.95rem;
}

.value {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.activity-card li p {
  margin: 0;
  line-height: 1.6;
  text-align: left;
}

.activity-card li p span {
  margin-right: 4px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .info-cards-wrapper {
    grid-template-columns: 1fr;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .avatar-info h2 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }
  
  .profile-header {
    padding: 24px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }
  
  .avatar-info h2 {
    font-size: 1.8rem;
  }
  
  .avatar-info p {
    font-size: 1rem;
  }
  
  .tags-container {
    gap: 8px;
  }
  
  .tag {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .profile-header {
    padding: 20px;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .avatar-info h2 {
    font-size: 1.5rem;
  }
  
  .info-card {
    padding: 20px;
  }
  
  .info-card h4 {
    font-size: 1.1rem;
  }
}
</style>
