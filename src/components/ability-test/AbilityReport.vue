<template>
  <div class="ability-report">
    <div class="report-header">
      <div class="report-title-section">
        <h2 class="report-title">能力检测报告</h2>
        <p class="report-description">基于AI智能分析的个人能力评估报告和发展建议</p>
      </div>
      <div class="report-actions">
        <button class="btn-primary" @click="generateReport">
          生成新报告
        </button>
        <button class="btn-secondary" @click="downloadReport">
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

        <div class="analysis-content">
          <!-- 优势能力 -->
          <div class="strengths-content">
            <h4 class="analysis-section-title">优势能力</h4>
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
          <div class="improvements-content">
            <h4 class="analysis-section-title">待提升能力</h4>
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
          <div class="recommendations-content">
            <h4 class="analysis-section-title">发展建议</h4>
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

  <div v-if="showReportModal" class="modal-overlay" @click.self="showReportModal = false">
    <div class="modal-content">
      <button class="close-btn" @click="showReportModal = false">&times;</button>
      <StudentReport />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StudentReport from './Report.vue'

const showReportModal = ref(false)

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
    name: '康复辅具实操',
    description: '在复杂的失能老人转运和辅具使用熟练度上还有提升空间',
    icon: '🦽',
    score: 65,
    actions: [
      '反复练习电动护理床及移位机的操作',
      '参加助行器与辅助进食器具实操课',
      '多在实训中心进行体位转移模拟'
    ]
  },
  {
    id: 2,
    name: '体征数据研判',
    description: '对智能床垫/监测雷达输出的睡眠与血压等健康趋势图表解读偏弱',
    icon: '📈',
    score: 58,
    actions: [
      '学习常见生命体征异常波动的临床意义',
      '掌握智慧养老大屏监控分析界面提取',
      '跟访真实病历多做评估量表练习'
    ]
  },
  {
    id: 3,
    name: '认知症干预',
    description: '在应对失智老人的激越行为及非药物手段创新上需要突破',
    icon: '🧩',
    score: 62,
    actions: [
      '学习生命回忆法则及脱敏安抚沟通',
      '参与音乐疗法与园艺疗法工作坊',
      '设计一份包含多种感官刺激的陪伴教案'
    ]
  }
])

// 短期建议
const shortTermRecommendations = ref([
  {
    id: 1,
    priority: '高',
    title: '掌握适老智能监测技术',
    description: '学习并掌握跌倒雷达、智能床垫等至少3个核心物联网设备的平台操作与数据判读',
    tags: ['智慧养老', '设备实操', '数字化']
  },
  {
    id: 2,
    priority: '中',
    title: '加强健康风险评估训练',
    description: '熟练掌握并独立完成老人失能等级量表、预防压疮量表的综合分析与测算',
    tags: ['健康评估', '数据分析', '专业技能']
  }
])

// 长期建议
const longTermRecommendations = ref([
  {
    id: 1,
    priority: '高',
    title: '成为高级康养督导专家',
    description: '在失智症非药物干预和机构运营领域建立专业优势，能够设计方案并指导护理新人',
    tags: ['专家', '康养运营', '领导力']
  },
  {
    id: 2,
    priority: '中',
    title: '建立口碑示范品牌',
    description: '通过在社区或机构的持续深耕服务，形成个人独特的长者生命关怀风格与业界口碑',
    tags: ['品牌', '长者关怀', '影响力']
  }
])

// 学习资源
const learningResources = ref([
  {
    id: 1,
    type: '在线课程',
    title: '智慧养老居家无障碍设计改造',
    description: '全面学习老年人居家环境空间动线、适补光防眩晕和防倒防护的设计原则',
    duration: '8周',
    difficulty: '中级',
    rating: 4.8
  },
  {
    id: 2,
    type: '书籍',
    title: '《阿尔茨海默病照护实务》',
    description: '从理论到实践系统学习认知症患者异常行为干预、同理心倾听与陪伴策略',
    duration: '4周',
    difficulty: '初级',
    rating: 4.9
  },
  {
    id: 3,
    type: '工作坊',
    title: '吞咽障碍长者饮食与急救工坊',
    description: '现场实操吞咽困难流速配菜制备，及演练老人噎食黄金急救海姆立克法操作',
    duration: '2天',
    difficulty: '高级',
    rating: 5.0
  }
])

// 生成新报告
const generateReport = () => {
  console.log('生成新报告')
  showReportModal.value = true
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e5e7eb;
}

.report-title-section {
  display: flex;
  align-items: baseline;
  gap: 20px;
}

.report-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.report-description {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.report-actions {
  display: flex;
  gap: 12px;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
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
  border: 1px solid #667eea;
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

.analysis-content > div:not(:first-child) {
  margin-top: 40px;
}

.analysis-section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.strength-list, .improvement-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.strength-item, .improvement-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
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
  grid-template-columns: 1fr;
  gap: 16px;
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
  flex-direction: row-reverse;
  justify-content: center;
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
  justify-content: center;
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
  justify-content: center;
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

  .report-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .report-title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .report-actions {
    width: 100%;
    justify-content: center;
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
