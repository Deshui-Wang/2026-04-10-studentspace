<template>
  <div class="ability-spectrum">
    <div class="spectrum-header">
      <h2 class="spectrum-title">能力检测图谱</h2>
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
    name: '人工智能工程师',
    level: '初级',
    description: '负责课堂教学、学生指导、课程设计等工作，是教育行业的核心岗位。',
    requirements: [
      '具备相关专业背景和教学能力',
      '良好的沟通表达能力和耐心',
      '持续学习和自我提升的意识',
      '掌握现代教学方法和工具'
    ],
    prospects: '教师职业发展路径清晰，可以从初级教师逐步晋升为高级教师、学科带头人、教学主任等职位，也可以向教育管理、教育研究等方向发展。'
  },
  {
    id: 'researcher',
    name: '高级提示词研究员',
    level: '中级',
    description: '从事学术研究、科研项目申报、论文写作等工作，推动学科发展。',
    requirements: [
      '扎实的学术功底和研究能力',
      '良好的文献调研和数据分析能力',
      '创新思维和问题解决能力',
      '团队合作和项目管理能力'
    ],
    prospects: '研究员可以逐步成长为资深研究员、项目负责人、学科带头人，也可以转向产业界从事技术研发或管理工作。'
  },
  {
    id: 'consultant',
    name: '大模型售前技术咨询师',
    level: '高级',
    description: '为企业或机构提供专业咨询服务，解决实际问题并提供解决方案。',
    requirements: [
      '深厚的专业知识和实践经验',
      '优秀的分析和解决问题的能力',
      '良好的客户沟通和项目管理能力',
      '敏锐的市场洞察力'
    ],
    prospects: '咨询师可以发展成为高级咨询师、合伙人，也可以创立自己的咨询公司，发展前景广阔。'
  },
  {
    id: 'manager',
    name: '智能化项目经理',
    level: '中级',
    description: '负责项目的规划、执行、监控和收尾，确保项目目标的实现。',
    requirements: [
      '项目管理和团队协作能力',
      '良好的沟通和协调能力',
      '风险识别和控制能力',
      '时间管理和资源调配能力'
    ],
    prospects: '项目经理可以晋升为高级项目经理、项目总监，也可以转向其他管理岗位如部门经理、运营总监等。'
  }
])

// 专业课程数据
const professionalCourses = ref([
  {
    id: 'pedagogy',
    name: '人工智能原理',
    credits: 3,
    description: '学习教育学的基本理论、教育规律和教育方法，为从事教育工作奠定理论基础。',
    objectives: [
      '掌握教育学的基本概念和理论体系',
      '理解教育的基本规律和原则',
      '学会运用教育理论指导实践',
      '培养教育思维和教育情怀'
    ],
    outline: [
      '第一章：教育学概述',
      '第二章：教育的基本规律',
      '第三章：教育目的与教育制度',
      '第四章：课程与教学',
      '第五章：德育与美育',
      '第六章：教师与学生'
    ]
  },
  {
    id: 'psychology',
    name: '教育心理学',
    credits: 3,
    description: '研究教育过程中的心理现象和规律，为教育实践提供心理学依据。',
    objectives: [
      '了解学习心理的基本规律',
      '掌握学生心理发展的特点',
      '学会运用心理学原理指导教学',
      '提高教育工作的科学性和有效性'
    ],
    outline: [
      '第一章：教育心理学概述',
      '第二章：学习理论',
      '第三章：认知发展理论',
      '第四章：学习动机与学习策略',
      '第五章：个体差异与因材施教',
      '第六章：教学心理与课堂管理'
    ]
  },
  {
    id: 'methodology',
    name: '教学论',
    credits: 4,
    description: '研究教学的基本理论、方法和技能，提高教学质量和效果。',
    objectives: [
      '掌握教学的基本理论和方法',
      '学会设计有效的教学方案',
      '提高课堂教学技能',
      '培养教学反思和改进能力'
    ],
    outline: [
      '第一章：教学论概述',
      '第二章：教学目标与内容',
      '第三章：教学方法与手段',
      '第四章：教学组织形式',
      '第五章：教学评价与反馈',
      '第六章：现代教学技术应用'
    ]
  },
  {
    id: 'assessment',
    name: '教育评价学',
    credits: 2,
    description: '学习教育评价的理论、方法和技能，科学评价教育质量和效果。',
    objectives: [
      '了解教育评价的基本理论',
      '掌握各种评价方法和工具',
      '学会设计评价方案',
      '提高评价的科学性和公正性'
    ],
    outline: [
      '第一章：教育评价概述',
      '第二章：评价目标与标准',
      '第三章：评价方法与工具',
      '第四章：学生评价',
      '第五章：教师评价',
      '第六章：课程与教学评价'
    ]
  },
  {
    id: 'technology',
    name: '教育技术学',
    credits: 3,
    description: '学习现代教育技术的理论和应用，提高教学效率和效果。',
    objectives: [
      '了解教育技术的基本理论',
      '掌握现代教学媒体的使用',
      '学会设计多媒体教学资源',
      '提高信息化教学能力'
    ],
    outline: [
      '第一章：教育技术概述',
      '第二章：教学媒体与教学环境',
      '第三章：多媒体课件设计',
      '第四章：网络教学与在线学习',
      '第五章：人工智能在教育中的应用',
      '第六章：教育信息化发展趋势'
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
