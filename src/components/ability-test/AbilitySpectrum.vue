<template>
  <div class="ability-spectrum">
    <div class="spectrum-header">
      <h2 class="spectrum-title">能力素养画像</h2>
      <p class="spectrum-description">通过多维度测评，全面了解您的各项能力水平和发展潜力</p>
    </div>

    <div class="spectrum-content">
      <!-- 专业岗位区域 -->
      <div class="career-positions-section">
        <div class="section-header">
          <h3>相关岗位</h3>
          <p class="section-subtitle">基于您的专业背景，推荐以下相关岗位</p>
        </div>
        <div class="positions-container">
          <div
            v-for="position in careerPositions"
            :key="position.id"
            class="position-tag"
            :class="{ active: selectedPosition === position.id }"
            @click="selectPosition(position.id)"
          >
            <span class="position-name">{{ position.name }}</span>
            <span class="position-level">{{ position.level }}</span>
          </div>
        </div>
      </div>

      <!-- 专业课程区域 -->
      <div class="courses-section">
        <div class="section-header">
          <h3>专业课程</h3>
          <p class="section-subtitle">您专业领域的核心课程体系</p>
        </div>
        <div class="courses-container">
          <div
            v-for="course in professionalCourses"
            :key="course.id"
            class="course-tag"
            :class="{ active: selectedCourse === course.id }"
            @click="selectCourse(course.id)"
          >
            <span class="course-name">{{ course.name }}</span>
            <span class="course-credits">{{ course.credits }}学分</span>
          </div>
        </div>
      </div>

      <!-- 个人能力图谱区域 -->
      <div class="radar-section">
        <div class="section-header">
          <h3>个人能力图谱</h3>
          <div class="legend">
            <div class="legend-item">
              <span class="legend-color" style="background: #667eea;"></span>
              <span>一级能力</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #f093fb;"></span>
              <span>二级能力</span>
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #4ecdc4;"></span>
              <span>三级能力</span>
            </div>
          </div>
        </div>
        <div class="radar-container">
          <div class="map-wrapper">
            <AbilityMap />
          </div>
        </div>
      </div>

      <!-- 能力分类卡片 -->
      <div class="ability-categories">
        <h3>能力分类</h3>
        <div class="categories-grid">
          <div
            v-for="category in abilityCategories"
            :key="category.id"
            class="category-card"
            :class="{ active: selectedCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            <div class="category-icon">
              <span>{{ category.icon }}</span>
            </div>
            <div class="category-info">
              <h4>{{ category.name }}</h4>
              <p>{{ category.description }}</p>
              <div class="category-score">
                <span class="score-label">当前得分：</span>
                <span class="score-value">{{ category.score }}/100</span>
              </div>
            </div>
            <div class="category-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: category.score + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细能力分析 -->
      <div v-if="selectedCategory" class="detailed-analysis">
        <h3>{{ getSelectedCategoryInfo().name }} - 详细分析</h3>
        <div class="analysis-content">
          <div class="analysis-chart">
            <div class="radar-chart-container">
              <div ref="radarChart" class="chart-container"></div>
            </div>
          </div>
          <div class="analysis-details">
            <div class="detail-item">
              <h4>优势领域</h4>
              <ul>
                <li v-for="strength in getSelectedCategoryInfo().strengths" :key="strength">
                  {{ strength }}
                </li>
              </ul>
            </div>
            <div class="detail-item">
              <h4>提升建议</h4>
              <ul>
                <li v-for="suggestion in getSelectedCategoryInfo().suggestions" :key="suggestion">
                  {{ suggestion }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 岗位详情弹窗 -->
    <div v-if="showPositionModal" class="modal-overlay" @click="closePositionModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ getSelectedPositionInfo().name }}</h3>
          <button class="close-btn" @click="closePositionModal">×</button>
        </div>
        <div class="modal-body">
          <div class="position-details">
            <div class="detail-section">
              <h4>岗位描述</h4>
              <p>{{ getSelectedPositionInfo().description }}</p>
            </div>
            <div class="detail-section">
              <h4>岗位要求</h4>
              <ul>
                <li v-for="requirement in getSelectedPositionInfo().requirements" :key="requirement">
                  {{ requirement }}
                </li>
              </ul>
            </div>
            <div class="detail-section">
              <h4>发展前景</h4>
              <p>{{ getSelectedPositionInfo().prospects }}</p>
            </div>
          </div>
          <div class="position-chart">
            <div class="radar-chart-container">
              <div ref="positionChart" class="chart-container"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程详情弹窗 -->
    <div v-if="showCourseModal" class="modal-overlay" @click="closeCourseModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ getSelectedCourseInfo().name }}</h3>
          <button class="close-btn" @click="closeCourseModal">×</button>
        </div>
        <div class="modal-body">
          <div class="course-details">
            <div class="detail-section">
              <h4>课程简介</h4>
              <p>{{ getSelectedCourseInfo().description }}</p>
            </div>
            <div class="detail-section">
              <h4>学习目标</h4>
              <ul>
                <li v-for="objective in getSelectedCourseInfo().objectives" :key="objective">
                  {{ objective }}
                </li>
              </ul>
            </div>
            <div class="detail-section">
              <h4>课程大纲</h4>
              <ul>
                <li v-for="outline in getSelectedCourseInfo().outline" :key="outline">
                  {{ outline }}
                </li>
              </ul>
            </div>
          </div>
          <div class="course-chart">
            <div class="radar-chart-container">
              <div ref="courseChart" class="chart-container"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import AbilityMap from './AbilityMap.vue'

// 选中的能力分类 - 默认选中第一个"学习能力"
const selectedCategory = ref('learning')

// 雷达图引用
const radarChart = ref(null)
const positionChart = ref(null)
const courseChart = ref(null)
let radarChartInstance = null
let positionChartInstance = null
let courseChartInstance = null

// 选中的岗位和课程
const selectedPosition = ref(null)
const selectedCourse = ref(null)

// 弹窗显示状态
const showPositionModal = ref(false)
const showCourseModal = ref(false)

// 专业岗位数据
const careerPositions = ref([
  {
    id: 'teacher',
    name: '高级养老护理专员',
    level: '高级',
    description: '负责为失智或半失能长者提供定制化的日常照护、健康监测及心理慰藉服务。',
    requirements: [
      '具备养老服务与管理相关专业背景',
      '持有国家认定养老护理员（高级）证书',
      '掌握突发疾病的应急救护（CPR）技能',
      '极强的沟通表达能力、同理心与耐心'
    ],
    prospects: '该岗位可由初级护理员稳步晋升至机构照护主管、日间照料中心主管乃至养老院院长。'
  },
  {
    id: 'researcher',
    name: '康复辅助器具评估师',
    level: '中级',
    description: '从事老年人身体机能健康评估、适老化辅具适配与效能研究工作。',
    requirements: [
      '扎实的康复医学与人体力学基础',
      '能够独立使用全套健康风险评估量表',
      '为长者提供精准评估及个性化辅具建议',
      '良好的数据分析与跟踪反馈能力'
    ],
    prospects: '可晋升为资深评估督导专家，或者向辅助器具产品的研发及产品经理方向发展。'
  },
  {
    id: 'consultant',
    name: '智慧康养系统实施督导',
    level: '高级',
    description: '为社区养老或养老机构提供智能监测系统（如防跌倒雷达）落地与运营指导。',
    requirements: [
      '深厚的智慧养老行业知识和硬件配置经验',
      '理解智能物联网架构在适老化场景中的布局',
      '良好的客户培训与运维沟通能力',
      '敏锐的跨界技术应用洞察力'
    ],
    prospects: '随着智慧养老深入，可发展成为区域技术合伙人、康养业务解决方案总监。'
  },
  {
    id: 'manager',
    name: '养老机构运营主管',
    level: '中级',
    description: '负责护理团队的日常排班管理、服务质量监控及社区活动的规划执行。',
    requirements: [
      '具备养老机构实际行政管理经验',
      '良好的资源协调和内外部沟通对接能力',
      '风险识别和危机公关处理能力',
      '时间管理与质量反馈控制能力'
    ],
    prospects: '主管岗位可以向综合运营总监、大型连锁康养社区负责人等高阶管理层级进阶。'
  }
])

// 专业课程数据
const professionalCourses = ref([
  {
    id: 'pedagogy',
    name: '康复护理实务',
    credits: 3,
    description: '学习失能老年人在进食、翻身、排泄、体位转移等方面的核心康复照料技术。',
    objectives: [
      '掌握不同程度失能老人的护理规范',
      '熟练应对常见的照护突发风险',
      '学会运用人体力学避免照护损伤',
      '培养以人为本的职业安全素养'
    ],
    outline: [
      '第一章：养老护理基本规范',
      '第二章：体位转移与轮椅辅助',
      '第三章：进食与吞咽障碍干预',
      '第四章：排泄护理与失禁干预',
      '第五章：压疮风险控制',
      '第六章：应急救护处理'
    ]
  },
  {
    id: 'psychology',
    name: '老年心理学',
    credits: 3,
    description: '研究老年期认知衰老规律及心理危机干预，为失智或抑郁倾向干预提供依据。',
    objectives: [
      '了解老龄化伴随的心理变化特征',
      '掌握常见的老年精神障碍前兆',
      '学会运用生命回顾及心理疏导技术',
      '提高对临终关怀的共情理解力'
    ],
    outline: [
      '第一章：老年心理学概述及理论',
      '第二章：认知功能退化与应对',
      '第三章：情绪问题与抑郁干预',
      '第四章：孤独感与社交支持网络建立',
      '第五章：失智症的心理与行为干预',
      '第六章：临终关怀的心理陪伴'
    ]
  },
  {
    id: 'methodology',
    name: '智能健康监测系统',
    credits: 4,
    description: '对接行业前沿，学习各种床边智能监测以及适老化物联网系统的原理与实操。',
    objectives: [
      '掌握智能查房感应设备的配置',
      '学会通过平台判读老人生理体征数据',
      '能够熟练处理硬件告警及联动呼叫',
      '结合智慧大屏完成机构资源调度'
    ],
    outline: [
      '第一章：智慧养老平台架构',
      '第二章：雷达与床垫监测设备部署',
      '第三章：可穿戴健康数据链路分析',
      '第四章：异常警告的层级响应机制',
      '第五章：健康数据报表的深度解读',
      '第六章：系统实操联调与维护'
    ]
  },
  {
    id: 'assessment',
    name: '老年健康管理与评估',
    credits: 2,
    description: '学习老年人基本健康档案的建立方法、评估量表使用及营养搭配建议。',
    objectives: [
      '熟记卫生管理标准数据和指标',
      '掌握各类ADL评估量表的操作',
      '学会为老年群体定制食谱或健康运动方案',
      '提高报告撰写的严谨性与专业度'
    ],
    outline: [
      '第一章：健康档案收集与隐私保护',
      '第二章：跌倒与压疮风险综合评估',
      '第三章：长者生活自理能力等级评定',
      '第四章：常见老年慢病的膳食调理',
      '第五章：定期随访与干预调整',
      '第六章：评估报告实战输出'
    ]
  },
  {
    id: 'technology',
    name: '适老化环境设计',
    credits: 3,
    description: '深度学习居家或机构环境由于人体机能退化所需要的无障碍安全设计。',
    objectives: [
      '了解适老化改造的相关法律规范及标准',
      '掌握居家动线上辅助器具的匹配',
      '学会结合色彩与照明进行失智友好设计',
      '具备出具完整空间改造方案的能力'
    ],
    outline: [
      '第一章：老龄化的人体工程学机制',
      '第二章：轮椅回转空间及卫浴防滑改造',
      '第三章：地面材料与防眩光照明',
      '第四章：智能家居在环境控制中的作用',
      '第五章：认知症友好型视觉引导路径',
      '第六章：设计案例观摩与方案汇报'
    ]
  }
])

// 能力分类数据
const abilityCategories = ref([
  {
    id: 'learning',
    name: '学习能力',
    description: '自主学习、知识获取、学习方法掌握等',
    icon: '📚',
    score: 88,
    strengths: ['自主学习能力强', '学习方法多样', '知识吸收效率高'],
    suggestions: ['提升批判性思维', '加强深度学习能力', '掌握更多学习策略']
  },
  {
    id: 'innovation',
    name: '创新能力',
    description: '创新思维、问题解决、创意表达等',
    icon: '💡',
    score: 82,
    strengths: ['思维活跃', '敢于尝试新方法', '创意表达能力强'],
    suggestions: ['加强设计思维训练', '学习创新方法论', '参与创新项目实践']
  },
  {
    id: 'research',
    name: '科研能力',
    description: '学术研究、论文写作、实验设计等',
    icon: '🔬',
    score: 75,
    strengths: ['文献调研能力强', '数据分析能力突出', '逻辑思维清晰'],
    suggestions: ['提升论文写作技巧', '加强跨学科合作', '参与更多科研项目']
  },
  {
    id: 'communication',
    name: '沟通能力',
    description: '表达交流、团队协作、人际交往等',
    icon: '💬',
    score: 85,
    strengths: ['表达清晰', '倾听能力强', '团队协作好'],
    suggestions: ['提升跨文化沟通能力', '学习冲突解决技巧', '加强演讲表达能力']
  },
  {
    id: 'leadership',
    name: '领导能力',
    description: '团队合作、项目管理、组织协调等',
    icon: '👑',
    score: 78,
    strengths: ['责任心强', '执行力好', '团队意识强'],
    suggestions: ['提升战略思维', '加强团队激励技巧', '学习项目管理方法']
  },
  {
    id: 'technology',
    name: '技术能力',
    description: '信息技术应用、数字化工具使用、编程思维等',
    icon: '💻',
    score: 72,
    strengths: ['基础软件熟练', '学习能力强', '适应新技术快'],
    suggestions: ['学习编程语言', '掌握数据分析工具', '提升数字化素养']
  },
  {
    id: 'critical-thinking',
    name: '批判性思维',
    description: '逻辑分析、问题解决、独立思考等',
    icon: '🧠',
    score: 80,
    strengths: ['逻辑思维清晰', '分析问题全面', '独立思考能力强'],
    suggestions: ['加强逻辑训练', '学习论证技巧', '提升问题分析能力']
  },
  {
    id: 'adaptability',
    name: '适应能力',
    description: '环境适应、变化应对、压力管理等',
    icon: '🌱',
    score: 83,
    strengths: ['适应能力强', '抗压能力好', '心态积极'],
    suggestions: ['提升心理韧性', '学习压力管理', '加强环境适应训练']
  }
])

// 选择能力分类
const selectCategory = (categoryId) => {
  selectedCategory.value = selectedCategory.value === categoryId ? null : categoryId
  // 更新雷达图
  updateRadarChart()
}

// 获取选中分类的详细信息
const getSelectedCategoryInfo = () => {
  return abilityCategories.value.find(cat => cat.id === selectedCategory.value) || {}
}

// 选择岗位
const selectPosition = (positionId) => {
  selectedPosition.value = selectedPosition.value === positionId ? null : positionId
  if (selectedPosition.value) {
    showPositionModal.value = true
    nextTick(() => {
      initPositionChart()
    })
  }
}

// 选择课程
const selectCourse = (courseId) => {
  selectedCourse.value = selectedCourse.value === courseId ? null : courseId
  if (selectedCourse.value) {
    showCourseModal.value = true
    nextTick(() => {
      initCourseChart()
    })
  }
}

// 获取选中岗位的详细信息
const getSelectedPositionInfo = () => {
  return careerPositions.value.find(pos => pos.id === selectedPosition.value) || {}
}

// 获取选中课程的详细信息
const getSelectedCourseInfo = () => {
  return professionalCourses.value.find(course => course.id === selectedCourse.value) || {}
}

// 关闭岗位弹窗
const closePositionModal = () => {
  showPositionModal.value = false
  selectedPosition.value = null
  if (positionChartInstance) {
    try { positionChartInstance.dispose() } catch {}
    positionChartInstance = null
  }
}

// 关闭课程弹窗
const closeCourseModal = () => {
  showCourseModal.value = false
  selectedCourse.value = null
  if (courseChartInstance) {
    try { courseChartInstance.dispose() } catch {}
    courseChartInstance = null
  }
}

// 雷达图数据 - 基于选中的能力分类
const getRadarData = () => {
  const selectedCategoryInfo = getSelectedCategoryInfo()
  if (!selectedCategoryInfo.id) {
    return {
      labels: ['学习能力', '创新能力', '科研能力', '沟通能力', '技术能力'],
      datasets: [
        {
          label: '标准值',
          data: [90, 85, 80, 88, 75],
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          borderColor: 'rgba(102, 126, 234, 0.8)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(102, 126, 234, 0.8)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4
        },
        {
          label: '当前值',
          data: [88, 82, 75, 85, 72],
          backgroundColor: 'rgba(240, 147, 251, 0.1)',
          borderColor: 'rgba(240, 147, 251, 0.8)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(240, 147, 251, 0.8)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4
        }
      ]
    }
  }

  // 根据选中的能力分类生成相关的能力指标
  const relatedAbilities = getRelatedAbilities(selectedCategoryInfo.id)

  return {
    labels: relatedAbilities.map(ability => ability.name),
    datasets: [
      {
        label: '标准值',
        data: relatedAbilities.map(ability => ability.standard),
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderColor: 'rgba(102, 126, 234, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(102, 126, 234, 0.8)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      },
      {
        label: '当前值',
        data: relatedAbilities.map(ability => ability.current),
        backgroundColor: 'rgba(240, 147, 251, 0.1)',
        borderColor: 'rgba(240, 147, 251, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(240, 147, 251, 0.8)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  }
}

// 获取与选中能力分类相关的能力指标
const getRelatedAbilities = (categoryId) => {
  const abilityMap = {
    'learning': [
      { name: '自主学习', standard: 90, current: 95 }, // 优势项
      { name: '知识获取', standard: 85, current: 70 }, // 待提升
      { name: '学习方法', standard: 88, current: 92 }, // 优势项
      { name: '学习效率', standard: 82, current: 65 }, // 待提升
      { name: '学习兴趣', standard: 85, current: 88 }  // 略高于标准
    ],
    'innovation': [
      { name: '创新思维', standard: 88, current: 75 }, // 待提升
      { name: '问题解决', standard: 85, current: 90 }, // 优势项
      { name: '创意表达', standard: 82, current: 68 }, // 待提升
      { name: '发散思维', standard: 80, current: 85 }, // 优势项
      { name: '实践创新', standard: 83, current: 72 }  // 待提升
    ],
    'research': [
      { name: '文献调研', standard: 90, current: 85 }, // 略低于标准
      { name: '数据分析', standard: 85, current: 60 }, // 待大幅提升
      { name: '论文写作', standard: 88, current: 55 }, // 待大幅提升
      { name: '实验设计', standard: 82, current: 70 }, // 待提升
      { name: '学术思维', standard: 86, current: 80 }  // 略低于标准
    ],
    'communication': [
      { name: '口头表达', standard: 88, current: 92 }, // 优势项
      { name: '书面表达', standard: 85, current: 75 }, // 待提升
      { name: '倾听理解', standard: 90, current: 95 }, // 优势项
      { name: '团队协作', standard: 87, current: 88 }, // 略高于标准
      { name: '跨文化沟通', standard: 80, current: 65 } // 待提升
    ],
    'leadership': [
      { name: '团队管理', standard: 85, current: 70 }, // 待提升
      { name: '决策能力', standard: 88, current: 85 }, // 略低于标准
      { name: '激励他人', standard: 82, current: 90 }, // 优势项
      { name: '冲突解决', standard: 80, current: 65 }, // 待提升
      { name: '战略思维', standard: 86, current: 75 }  // 待提升
    ],
    'technology': [
      { name: '基础软件', standard: 85, current: 95 }, // 优势项
      { name: '编程思维', standard: 80, current: 45 }, // 待大幅提升
      { name: '数据分析工具', standard: 82, current: 55 }, // 待大幅提升
      { name: '数字化素养', standard: 78, current: 85 }, // 优势项
      { name: '技术学习', standard: 88, current: 90 }  // 优势项
    ],
    'critical-thinking': [
      { name: '逻辑分析', standard: 90, current: 85 }, // 略低于标准
      { name: '问题识别', standard: 85, current: 90 }, // 优势项
      { name: '论证能力', standard: 88, current: 70 }, // 待提升
      { name: '独立思考', standard: 86, current: 92 }, // 优势项
      { name: '批判性思维', standard: 84, current: 75 } // 待提升
    ],
    'adaptability': [
      { name: '环境适应', standard: 88, current: 95 }, // 优势项
      { name: '变化应对', standard: 85, current: 80 }, // 略低于标准
      { name: '压力管理', standard: 82, current: 70 }, // 待提升
      { name: '心理韧性', standard: 80, current: 85 }, // 优势项
      { name: '学习新技能', standard: 87, current: 90 } // 优势项
    ]
  }

  return abilityMap[categoryId] || abilityMap['learning']
}

// 获取岗位技能要求数据
const getPositionSkills = (positionId) => {
  const skillMap = {
    'teacher': [
      { name: '教学能力', standard: 95, current: 72 },
      { name: '沟通表达', standard: 92, current: 68 },
      { name: '专业知识', standard: 98, current: 75 },
      { name: '学生管理', standard: 90, current: 65 },
      { name: '课程设计', standard: 88, current: 70 },
      { name: '教育技术', standard: 85, current: 58 }
    ],
    'researcher': [
      { name: '学术研究', standard: 98, current: 75 },
      { name: '数据分析', standard: 95, current: 68 },
      { name: '论文写作', standard: 96, current: 72 },
      { name: '实验设计', standard: 92, current: 65 },
      { name: '文献调研', standard: 97, current: 78 },
      { name: '创新思维', standard: 90, current: 62 }
    ],
    'consultant': [
      { name: '问题分析', standard: 96, current: 72 },
      { name: '解决方案设计', standard: 94, current: 68 },
      { name: '客户沟通', standard: 92, current: 70 },
      { name: '项目管理', standard: 90, current: 65 },
      { name: '行业洞察', standard: 88, current: 62 },
      { name: '团队协作', standard: 89, current: 67 }
    ],
    'manager': [
      { name: '团队管理', standard: 95, current: 70 },
      { name: '项目管理', standard: 92, current: 68 },
      { name: '决策能力', standard: 90, current: 65 },
      { name: '沟通协调', standard: 93, current: 72 },
      { name: '战略规划', standard: 88, current: 62 },
      { name: '风险控制', standard: 86, current: 58 }
    ]
  }

  return skillMap[positionId] || skillMap['teacher']
}

// 获取课程知识体系数据
const getCourseKnowledge = (courseId) => {
  const knowledgeMap = {
    'pedagogy': [
      { name: '教育理论', standard: 95, current: 68 },
      { name: '教学原理', standard: 92, current: 65 },
      { name: '教育规律', standard: 96, current: 72 },
      { name: '教育方法', standard: 88, current: 62 },
      { name: '教育评价', standard: 90, current: 67 },
      { name: '教育实践', standard: 85, current: 58 }
    ],
    'psychology': [
      { name: '学习心理', standard: 94, current: 68 },
      { name: '发展心理', standard: 91, current: 65 },
      { name: '认知理论', standard: 95, current: 72 },
      { name: '动机理论', standard: 87, current: 62 },
      { name: '个体差异', standard: 89, current: 67 },
      { name: '教学心理', standard: 85, current: 58 }
    ],
    'methodology': [
      { name: '教学设计', standard: 93, current: 68 },
      { name: '教学方法', standard: 90, current: 65 },
      { name: '教学技能', standard: 94, current: 72 },
      { name: '课堂管理', standard: 87, current: 62 },
      { name: '教学评价', standard: 89, current: 67 },
      { name: '现代技术', standard: 85, current: 58 }
    ],
    'assessment': [
      { name: '评价理论', standard: 92, current: 68 },
      { name: '评价方法', standard: 89, current: 65 },
      { name: '评价工具', standard: 93, current: 72 },
      { name: '数据分析', standard: 86, current: 62 },
      { name: '评价标准', standard: 88, current: 67 },
      { name: '评价实践', standard: 84, current: 58 }
    ],
    'technology': [
      { name: '教育技术理论', standard: 91, current: 68 },
      { name: '多媒体技术', standard: 88, current: 65 },
      { name: '网络教学', standard: 92, current: 72 },
      { name: '数字化工具', standard: 85, current: 62 },
      { name: 'AI应用', standard: 87, current: 67 },
      { name: '技术实践', standard: 83, current: 58 }
    ]
  }

  return knowledgeMap[courseId] || knowledgeMap['pedagogy']
}

// 初始化雷达图
const initRadarChart = () => {
  if (!radarChart.value) return
  if (radarChartInstance) {
    try { radarChartInstance.dispose() } catch {}
  }

  radarChartInstance = echarts.init(radarChart.value)
  const radarData = getRadarData()

  const seriesData = radarData.datasets.map((dataset, index) => ({
    value: dataset.data,
    name: dataset.label,
    itemStyle: {
      color: dataset.borderColor,
      borderColor: dataset.borderColor,
      borderWidth: 2
    },
    areaStyle: {
      color: dataset.backgroundColor
    },
    lineStyle: {
      width: 2,
      color: dataset.borderColor
    }
  }))

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const index = params.dataIndex
        return `${params.seriesName}<br/>${radarData.labels[index]}: ${params.value}分`
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: {
      show: true,
      bottom: 10,
      data: radarData.datasets.map(dataset => dataset.label),
      textStyle: {
        color: '#333',
        fontSize: 12
      }
    },
    radar: {
      indicator: radarData.labels.map(label => ({
        name: label,
        max: 100,
        nameTextStyle: {
          color: '#333',
          fontSize: 12
        }
      })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#d1d5db',
          width: 1
        }
      },
      splitLine: {
        lineStyle: {
          color: '#d1d5db',
          width: 1
        }
      },
    },
    series: [
      {
        name: '能力图谱',
        type: 'radar',
        data: seriesData,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }

  radarChartInstance.setOption(option)
}

// 初始化岗位技能雷达图
const initPositionChart = () => {
  if (!positionChart.value || !selectedPosition.value) return
  if (positionChartInstance) {
    try { positionChartInstance.dispose() } catch {}
  }

  positionChartInstance = echarts.init(positionChart.value)
  const skills = getPositionSkills(selectedPosition.value)

  const seriesData = [
    {
      value: skills.map(skill => skill.standard),
      name: '岗位要求',
      itemStyle: {
        color: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 0.8)',
        borderWidth: 2
      },
      areaStyle: {
        color: 'rgba(102, 126, 234, 0.1)'
      },
      lineStyle: {
        width: 2,
        color: 'rgba(102, 126, 234, 0.8)'
      }
    },
    {
      value: skills.map(skill => skill.current),
      name: '当前水平',
      itemStyle: {
        color: 'rgba(240, 147, 251, 0.8)',
        borderColor: 'rgba(240, 147, 251, 0.8)',
        borderWidth: 2
      },
      areaStyle: {
        color: 'rgba(240, 147, 251, 0.1)'
      },
      lineStyle: {
        width: 2,
        color: 'rgba(240, 147, 251, 0.8)'
      }
    }
  ]

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const index = params.dataIndex
        return `${params.seriesName}<br/>${skills[index].name}: ${params.value}分`
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: {
      show: true,
      bottom: 10,
      data: ['岗位要求', '当前水平'],
      textStyle: {
        color: '#333',
        fontSize: 12
      }
    },
    radar: {
      indicator: skills.map(skill => ({
        name: skill.name,
        max: 100,
        nameTextStyle: {
          color: '#333',
          fontSize: 12
        }
      })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#d1d5db',
          width: 1
        }
      },
      splitLine: {
        lineStyle: {
          color: '#d1d5db',
          width: 1
        }
      },
    },
    series: [
      {
        name: '技能图谱',
        type: 'radar',
        data: seriesData,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }

  positionChartInstance.setOption(option)
}

// 初始化课程知识雷达图
const initCourseChart = () => {
  if (!courseChart.value || !selectedCourse.value) return
  if (courseChartInstance) {
    try { courseChartInstance.dispose() } catch {}
  }

  courseChartInstance = echarts.init(courseChart.value)
  const knowledge = getCourseKnowledge(selectedCourse.value)

  const seriesData = [
    {
      value: knowledge.map(k => k.standard),
      name: '课程要求',
      itemStyle: {
        color: 'rgba(78, 205, 196, 0.8)',
        borderColor: 'rgba(78, 205, 196, 0.8)',
        borderWidth: 2
      },
      areaStyle: {
        color: 'rgba(78, 205, 196, 0.1)'
      },
      lineStyle: {
        width: 2,
        color: 'rgba(78, 205, 196, 0.8)'
      }
    },
    {
      value: knowledge.map(k => k.current),
      name: '掌握程度',
      itemStyle: {
        color: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 0.8)',
        borderWidth: 2
      },
      areaStyle: {
        color: 'rgba(102, 126, 234, 0.1)'
      },
      lineStyle: {
        width: 2,
        color: 'rgba(102, 126, 234, 0.8)'
      }
    }
  ]

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const index = params.dataIndex
        return `${params.seriesName}<br/>${knowledge[index].name}: ${params.value}分`
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e6f1',
      borderWidth: 1,
      textStyle: { color: '#333' }
    },
    legend: {
      show: true,
      bottom: 10,
      data: ['课程要求', '掌握程度'],
      textStyle: {
        color: '#333',
        fontSize: 12
      }
    },
    radar: {
      indicator: knowledge.map(k => ({
        name: k.name,
        max: 100,
        nameTextStyle: {
          color: '#333',
          fontSize: 12
        }
      })),
      radius: '80%',
      center: ['50%', '50%'],
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(240,242,245,0.3)', 'rgba(240,242,245,0.1)']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#d1d5db',
          width: 1
        }
      },
      splitLine: {
        lineStyle: {
          color: '#d1d5db',
          width: 1
        }
      },
    },
    series: [
      {
        name: '知识图谱',
        type: 'radar',
        data: seriesData,
        animationDuration: 1000,
        animationEasing: 'cubicOut'
      }
    ]
  }

  courseChartInstance.setOption(option)
}

// 销毁图表
const disposeChart = () => {
  if (radarChartInstance) {
    try { radarChartInstance.dispose() } catch {}
    radarChartInstance = null
  }
  if (positionChartInstance) {
    try { positionChartInstance.dispose() } catch {}
    positionChartInstance = null
  }
  if (courseChartInstance) {
    try { courseChartInstance.dispose() } catch {}
    courseChartInstance = null
  }
}

// 监听窗口大小变化，重新渲染图表
const handleResize = () => {
  if (radarChartInstance) {
    try { radarChartInstance.resize() } catch {}
  }
  if (positionChartInstance) {
    try { positionChartInstance.resize() } catch {}
  }
  if (courseChartInstance) {
    try { courseChartInstance.resize() } catch {}
  }
}

// 监听选中分类变化，重新绘制雷达图
const updateRadarChart = () => {
  nextTick(() => {
    initRadarChart()
  })
}

// 组件挂载后绘制雷达图
onMounted(() => {
  initRadarChart()
  window.addEventListener('resize', handleResize)
})

// 组件卸载前清理
onBeforeUnmount(() => {
  disposeChart()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.ability-spectrum {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.spectrum-header {
  text-align: center;
  margin-bottom: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spectrum-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.spectrum-description {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.section-subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin: 4px 0 0 0;
}

/* 专业岗位样式 */
.career-positions-section,
.courses-section {
  margin-bottom: 40px;
}

.positions-container,
.courses-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.position-tag,
.course-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.position-tag:hover,
.course-tag:hover {
  background: #e3f2fd;
  border-color: #2196f3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
}

.position-tag.active,
.course-tag.active {
  background: #2196f3;
  border-color: #1976d2;
  color: white;
}

.position-name,
.course-name {
  font-weight: 500;
}

.position-level,
.course-credits {
  font-size: 12px;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
}

.position-tag:not(.active) .position-level,
.course-tag:not(.active) .course-credits {
  background: #e5e7eb;
  color: #000;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f9fa;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-body {
  padding: 30px;
  max-height: calc(80vh - 100px);
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.position-details,
.course-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  text-align: left;
}

.detail-section p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  text-align: left;
}

.detail-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-section li {
  padding: 4px 0;
  color: #6b7280;
  font-size: 14px;
  position: relative;
  padding-left: 16px;
  text-align: left;
}

.detail-section li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #2196f3;
  font-weight: bold;
}

.position-chart,
.course-chart {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  color: #6b7280;
}

.chart-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.chart-placeholder p {
  font-size: 18px;
  margin-bottom: 8px;
  font-weight: 500;
}

.chart-placeholder small {
  font-size: 14px;
}

.radar-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.radar-container {
  background: transparent;
  border-radius: 12px;
  padding: 0;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
}

.map-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  justify-content: center;
}

.radar-placeholder {
  color: #6b7280;
}

.radar-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.radar-placeholder p {
  font-size: 18px;
  margin-bottom: 8px;
}

.radar-placeholder small {
  font-size: 14px;
}

.ability-categories h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  text-align: left;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.category-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.category-card:hover::before {
  opacity: 0.05;
}

.category-card.active {
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.category-card.active::before {
  opacity: 0.1;
}

.category-icon {
  font-size: 32px;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.category-info {
  position: relative;
  z-index: 1;
}

.category-info h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.category-info p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.category-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.score-label {
  font-size: 14px;
  color: #6b7280;
}

.score-value {
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
}

.category-progress {
  position: relative;
  z-index: 1;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.detailed-analysis {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 30px;
  margin-top: 20px;
}

.detailed-analysis h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.analysis-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.analysis-chart {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.radar-chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.chart-placeholder {
  color: #6b7280;
}

.chart-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.analysis-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.detail-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.detail-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-item li {
  padding: 6px 0;
  color: #6b7280;
  font-size: 14px;
  position: relative;
  padding-left: 20px;
}

.detail-item li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ability-spectrum {
    padding: 20px;
  }

  .spectrum-title {
    font-size: 24px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .legend {
    gap: 16px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .analysis-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .radar-container {
    padding: 0;
    min-height: 400px;
  }

  .map-wrapper {
    justify-content: flex-start;
  }

  /* 岗位和课程标签响应式 */
  .positions-container,
  .courses-container {
    gap: 8px;
  }

  .position-tag,
  .course-tag {
    padding: 6px 12px;
    font-size: 13px;
  }

  /* 弹窗响应式 */
  .modal-content {
    margin: 10px;
    max-height: 90vh;
  }

  .modal-body {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 20px;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .position-chart,
  .course-chart {
    padding: 30px 15px;
  }
}
</style>
