<template>
  <div class="ability-report">
    <div class="report-header">
      <h2 class="report-title">能力检测报告</h2>
      <p class="report-description">基于AI智能分析的个人能力评估报告和发展建议</p>
      <div class="report-actions">
        <button class="btn-primary" @click="generateReport">
          <span class="btn-icon">🔄</span>
          生成新报告
        </button>
        <button class="btn-secondary" @click="downloadReport">
          <span class="btn-icon">📥</span>
          下载报告
        </button>
      </div>
    </div>

    <div class="report-content">
      <!-- 报告概览 -->
      <div class="report-overview">
        <h3>报告概览</h3>
        <div class="overview-cards">
          <div class="overview-card">
            <div class="card-icon">📊</div>
            <div class="card-content">
              <div class="card-title">综合评分</div>
              <div class="card-value">{{ overallScore }}/100</div>
              <div class="card-trend" :class="scoreTrend.type">
                {{ scoreTrend.text }}
              </div>
            </div>
          </div>
          <div class="overview-card">
            <div class="card-icon">🎯</div>
            <div class="card-content">
              <div class="card-title">能力等级</div>
              <div class="card-value">{{ abilityLevel }}</div>
              <div class="card-subtitle">{{ levelDescription }}</div>
            </div>
          </div>
          <div class="overview-card">
            <div class="card-icon">📈</div>
            <div class="card-content">
              <div class="card-title">提升潜力</div>
              <div class="card-value">{{ improvementPotential }}%</div>
              <div class="card-subtitle">还有很大提升空间</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 能力分析详情 -->
      <div class="ability-analysis">
        <h3>能力分析详情</h3>
        <div class="analysis-tabs">
          <button 
            v-for="tab in analysisTabs" 
            :key="tab.id"
            class="tab-button"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <div class="tab-content">
          <!-- 优势能力 -->
          <div v-if="activeTab === 'strengths'" class="strengths-content">
            <div class="strength-list">
              <div 
                v-for="strength in strengths" 
                :key="strength.id"
                class="strength-item"
              >
                <div class="strength-header">
                  <div class="strength-icon">{{ strength.icon }}</div>
                  <div class="strength-info">
                    <h4>{{ strength.name }}</h4>
                    <p>{{ strength.description }}</p>
                  </div>
                  <div class="strength-score">{{ strength.score }}/100</div>
                </div>
                <div class="strength-details">
                  <div class="strength-chart">
                    <div class="chart-bar">
                      <div 
                        class="chart-fill" 
                        :style="{ width: strength.score + '%' }"
                      ></div>
                    </div>
                  </div>
                  <div class="strength-recommendations">
                    <h5>保持建议：</h5>
                    <ul>
                      <li v-for="rec in strength.recommendations" :key="rec">
                        {{ rec }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 待提升能力 -->
          <div v-if="activeTab === 'improvements'" class="improvements-content">
            <div class="improvement-list">
              <div 
                v-for="improvement in improvements" 
                :key="improvement.id"
                class="improvement-item"
              >
                <div class="improvement-header">
                  <div class="improvement-icon">{{ improvement.icon }}</div>
                  <div class="improvement-info">
                    <h4>{{ improvement.name }}</h4>
                    <p>{{ improvement.description }}</p>
                  </div>
                  <div class="improvement-score">{{ improvement.score }}/100</div>
                </div>
                <div class="improvement-details">
                  <div class="improvement-chart">
                    <div class="chart-bar">
                      <div 
                        class="chart-fill improvement" 
                        :style="{ width: improvement.score + '%' }"
                      ></div>
                    </div>
                  </div>
                  <div class="improvement-actions">
                    <h5>提升建议：</h5>
                    <ul>
                      <li v-for="action in improvement.actions" :key="action">
                        {{ action }}
                      </li>
                    </ul>
                    <div class="action-buttons">
                      <button class="btn-small">查看课程</button>
                      <button class="btn-small">制定计划</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 发展建议 -->
          <div v-if="activeTab === 'recommendations'" class="recommendations-content">
            <div class="recommendation-sections">
              <div class="recommendation-section">
                <h4>短期目标 (1-3个月)</h4>
                <div class="recommendation-list">
                  <div 
                    v-for="rec in shortTermRecommendations" 
                    :key="rec.id"
                    class="recommendation-item"
                  >
                    <div class="rec-priority">{{ rec.priority }}</div>
                    <div class="rec-content">
                      <h5>{{ rec.title }}</h5>
                      <p>{{ rec.description }}</p>
                      <div class="rec-tags">
                        <span 
                          v-for="tag in rec.tags" 
                          :key="tag"
                          class="rec-tag"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="recommendation-section">
                <h4>长期目标 (6-12个月)</h4>
                <div class="recommendation-list">
                  <div 
                    v-for="rec in longTermRecommendations" 
                    :key="rec.id"
                    class="recommendation-item"
                  >
                    <div class="rec-priority">{{ rec.priority }}</div>
                    <div class="rec-content">
                      <h5>{{ rec.title }}</h5>
                      <p>{{ rec.description }}</p>
                      <div class="rec-tags">
                        <span 
                          v-for="tag in rec.tags" 
                          :key="tag"
                          class="rec-tag"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习资源推荐 -->
      <div class="learning-resources">
        <h3>推荐学习资源</h3>
        <div class="resources-grid">
          <div 
            v-for="resource in learningResources" 
            :key="resource.id"
            class="resource-card"
          >
            <div class="resource-header">
              <div class="resource-type">{{ resource.type }}</div>
              <div class="resource-rating">
                <span class="stars">{{ '★'.repeat(resource.rating) }}</span>
                <span class="rating-text">{{ resource.rating }}/5</span>
              </div>
            </div>
            <h4>{{ resource.title }}</h4>
            <p>{{ resource.description }}</p>
            <div class="resource-meta">
              <span class="resource-duration">{{ resource.duration }}</span>
              <span class="resource-difficulty">{{ resource.difficulty }}</span>
            </div>
            <button class="resource-btn">开始学习</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 当前激活的标签页
const activeTab = ref('strengths')

// 综合评分
const overallScore = ref(78)

// 能力等级
const abilityLevel = ref('中级')

// 等级描述
const levelDescription = computed(() => {
  const descriptions = {
    '初级': '具备基础能力，需要系统学习',
    '中级': '能力较为均衡，有提升空间',
    '高级': '能力突出，可以指导他人',
    '专家': '能力卓越，行业领先水平'
  }
  return descriptions[abilityLevel.value] || ''
})

// 提升潜力
const improvementPotential = ref(22)

// 评分趋势
const scoreTrend = computed(() => {
  const trend = 5 // 模拟数据
  if (trend > 0) {
    return { type: 'positive', text: `+${trend} 较上次提升` }
  } else if (trend < 0) {
    return { type: 'negative', text: `${trend} 较上次下降` }
  } else {
    return { type: 'neutral', text: '与上次持平' }
  }
})

// 分析标签页
const analysisTabs = ref([
  { id: 'strengths', name: '优势能力' },
  { id: 'improvements', name: '待提升' },
  { id: 'recommendations', name: '发展建议' }
])

// 优势能力数据
const strengths = ref([
  {
    id: 1,
    name: '沟通表达',
    description: '能够清晰有效地传达信息，善于倾听和理解他人',
    icon: '💬',
    score: 92,
    recommendations: [
      '继续保持积极倾听的习惯',
      '多参与公开演讲活动',
      '学习跨文化沟通技巧'
    ]
  },
  {
    id: 2,
    name: '团队协作',
    description: '善于与他人合作，能够有效协调团队工作',
    icon: '🤝',
    score: 88,
    recommendations: [
      '继续发挥团队协调优势',
      '学习团队管理技巧',
      '培养团队激励能力'
    ]
  },
  {
    id: 3,
    name: '学习能力',
    description: '学习新知识速度快，适应能力强',
    icon: '📚',
    score: 85,
    recommendations: [
      '保持持续学习的习惯',
      '建立个人知识管理体系',
      '分享学习经验给他人'
    ]
  }
])

// 待提升能力数据
const improvements = ref([
  {
    id: 1,
    name: '技术应用',
    description: '在数字化工具使用方面还有提升空间',
    icon: '💻',
    score: 65,
    actions: [
      '学习新的教学技术工具',
      '参加技术培训课程',
      '多实践数字化教学'
    ]
  },
  {
    id: 2,
    name: '数据分析',
    description: '数据分析和解读能力需要加强',
    icon: '📊',
    score: 58,
    actions: [
      '学习基础统计分析方法',
      '掌握数据分析工具',
      '多进行数据实践项目'
    ]
  },
  {
    id: 3,
    name: '创新思维',
    description: '在创新方法和思维模式方面需要突破',
    icon: '💡',
    score: 62,
    actions: [
      '学习设计思维方法',
      '参与创新项目实践',
      '培养批判性思维'
    ]
  }
])

// 短期建议
const shortTermRecommendations = ref([
  {
    id: 1,
    priority: '高',
    title: '提升技术应用能力',
    description: '学习并掌握至少3个新的教学技术工具，提升数字化教学水平',
    tags: ['技术', '教学', '数字化']
  },
  {
    id: 2,
    priority: '中',
    title: '加强数据分析训练',
    description: '完成数据分析基础课程，能够独立进行简单的数据分析',
    tags: ['数据分析', '统计', '技能']
  }
])

// 长期建议
const longTermRecommendations = ref([
  {
    id: 1,
    priority: '高',
    title: '成为技术应用专家',
    description: '在数字化教学领域建立专业优势，能够指导其他教师',
    tags: ['专家', '技术', '领导力']
  },
  {
    id: 2,
    priority: '中',
    title: '建立个人品牌',
    description: '通过持续学习和实践，在教育领域建立个人专业品牌',
    tags: ['品牌', '专业', '影响力']
  }
])

// 学习资源
const learningResources = ref([
  {
    id: 1,
    type: '在线课程',
    title: '数字化教学工具应用',
    description: '全面学习现代教学技术工具的使用方法和最佳实践',
    duration: '8周',
    difficulty: '中级',
    rating: 4.5
  },
  {
    id: 2,
    type: '书籍',
    title: '数据分析入门指南',
    description: '从零开始学习数据分析的基础知识和实用技巧',
    duration: '4周',
    difficulty: '初级',
    rating: 4.2
  },
  {
    id: 3,
    type: '工作坊',
    title: '创新思维训练营',
    description: '通过实践项目学习创新思维方法和工具',
    duration: '2天',
    difficulty: '中级',
    rating: 4.8
  }
])

// 生成新报告
const generateReport = () => {
  console.log('生成新报告')
  // 这里可以添加生成报告的逻辑
}

// 下载报告
const downloadReport = () => {
  console.log('下载报告')
  // 这里可以添加下载报告的逻辑
}
</script>

<style scoped>
.ability-report {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.report-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e5e7eb;
}

.report-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.report-description {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
}

.report-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}

.btn-icon {
  font-size: 16px;
}

.report-overview h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.overview-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: transform 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
}

.card-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.card-trend {
  font-size: 12px;
  font-weight: 500;
}

.card-trend.positive {
  color: #10b981;
}

.card-trend.negative {
  color: #ef4444;
}

.card-trend.neutral {
  color: #6b7280;
}

.ability-analysis h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.analysis-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
}

.tab-button {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.strength-item, .improvement-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.strength-header, .improvement-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.strength-icon, .improvement-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.strength-info, .improvement-info {
  flex: 1;
}

.strength-info h4, .improvement-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.strength-info p, .improvement-info p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.strength-score, .improvement-score {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.strength-details, .improvement-details {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.chart-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.chart-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.chart-fill.improvement {
  background: linear-gradient(90deg, #f093fb, #f5576c);
}

.strength-recommendations, .improvement-actions h5 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.strength-recommendations ul, .improvement-actions ul {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
}

.strength-recommendations li, .improvement-actions li {
  padding: 4px 0;
  font-size: 13px;
  color: #6b7280;
  position: relative;
  padding-left: 16px;
}

.strength-recommendations li::before, .improvement-actions li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-small:hover {
  background: #5a67d8;
}

.recommendation-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.recommendation-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

.recommendation-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.rec-priority {
  width: 24px;
  height: 24px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.rec-content {
  flex: 1;
}

.rec-content h5 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.rec-content p {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.rec-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.rec-tag {
  padding: 2px 8px;
  background: #e0e7ff;
  color: #667eea;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.learning-resources h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.resource-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.resource-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.resource-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.resource-type {
  padding: 4px 8px;
  background: #f0f9ff;
  color: #0369a1;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.resource-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stars {
  color: #fbbf24;
  font-size: 12px;
}

.rating-text {
  font-size: 12px;
  color: #6b7280;
}

.resource-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.resource-card p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.resource-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.resource-duration, .resource-difficulty {
  font-size: 12px;
  color: #6b7280;
}

.resource-btn {
  width: 100%;
  padding: 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.resource-btn:hover {
  background: #5a67d8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ability-report {
    padding: 20px;
  }
  
  .report-title {
    font-size: 24px;
  }
  
  .report-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .strength-details, .improvement-details {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .recommendation-sections {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .resources-grid {
    grid-template-columns: 1fr;
  }
}
</style>
