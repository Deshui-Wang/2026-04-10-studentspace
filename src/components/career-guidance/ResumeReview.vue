<template>
  <div class="resume-review-container">
    <div class="page-header">
      <p class="section-description">AI智能分析您的简历，提供专业建议和优化方案</p>
    </div>

    <div class="review-content">
      <!-- 简历上传区域 -->
      <div class="upload-section">
        <div class="section-header">
          <i class="el-icon-upload"></i>
          <h3>上传简历</h3>
        </div>
        <div class="upload-area">
          <el-upload
            class="upload-dragger"
            drag
            :auto-upload="false"
            :before-upload="beforeUpload"
            :on-change="onFileChange"
            :on-error="handleUploadError"
            :limit="1"
            :multiple="false"
            accept=".pdf,.doc,.docx"
            :show-file-list="false"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将简历文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              支持 PDF、Word 格式，文件大小不超过 10MB
            </div>
          </el-upload>
        </div>
        
        <!-- 已上传文件信息 -->
        <div v-if="uploadedFile" class="uploaded-file-info">
          <div class="file-info">
            <i class="el-icon-document"></i>
            <span class="file-name">{{ uploadedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(uploadedFile.size) }}</span>
          </div>
          <el-button type="primary" @click="startAnalysis" :loading="analyzing" :disabled="!uploadedFile">
            <i class="el-icon-search"></i>
            {{ analyzing ? '分析中...' : '开始分析' }}
          </el-button>
        </div>
      </div>

      <!-- 分析结果 -->
      <div class="analysis-result">
        <div class="section-header">
          <i class="el-icon-data-analysis"></i>
          <h3>AI智能分析</h3>
        </div>
        <!-- 分析中动效 -->
        <div v-if="analyzing" class="analyzing-state">
          <img src="/pic/mianshi/jianlifenxi.gif" alt="分析中" class="analyzing-gif" />
        </div>
        <div v-else-if="!analysisResult" class="empty-state">
          <p>此处将展示 AI 智能分析结果，请先在左侧上传简历并点击「开始分析」。</p>
        </div>
        <template v-else>
        <!-- 总体评分 -->
        <transition name="slide-fade">
          <div v-if="showOverallScore" class="overall-score">
            <div class="score-circle">
              <div class="score-number">{{ analysisResult.overallScore }}</div>
              <div class="score-label">综合评分</div>
            </div>
            <div class="score-description">
              <h4>{{ getScoreLevel(analysisResult.overallScore) }}</h4>
              <p>{{ analysisResult.overallComment }}</p>
            </div>
          </div>
        </transition>

        <!-- 问题清单 -->
        <transition name="slide-fade">
          <div v-if="showIssues" class="issues-section" v-show="analysisResult.issues && analysisResult.issues.length">
            <div class="section-header">
              <i class="el-icon-warning-outline"></i>
              <h3>问题清单</h3>
              <span class="issue-count">发现 {{ analysisResult.issues.length }} 个待优化项</span>
            </div>
            <div class="issues-list">
              <div class="issue-item" v-for="(issue, idx) in analysisResult.issues" :key="idx">
                <div class="issue-left">
                  <div class="issue-number">{{ idx + 1 }}</div>
                  <div class="issue-content">
                    <span class="issue-text">{{ issue.text }}</span>
                  </div>
                </div>
                <div class="issue-priority" :class="'priority-' + issue.severity">
                  <i class="priority-icon" :class="getPriorityIcon(issue.severity)"></i>
                  <span>{{ issue.severityText }}</span>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 详细分析 -->
        <div class="detailed-analysis">
          <div class="analysis-grid">
            <!-- 内容完整性 -->
            <transition name="slide-fade">
              <div v-if="showContentCompleteness" class="analysis-card">
                <div class="card-header">
                  <i class="el-icon-document-checked"></i>
                  <h4>内容完整性</h4>
                  <div class="score-badge" :class="getScoreClass(analysisResult.contentCompleteness)">
                    {{ analysisResult.contentCompleteness }}
                  </div>
                </div>
                <div class="card-content">
                  <p>{{ analysisResult.contentCompletenessComment }}</p>
                  <div class="improvement-tips">
                    <h5>改进建议：</h5>
                    <ul>
                      <li v-for="tip in analysisResult.contentCompletenessTips" :key="tip">
                        {{ tip }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 格式规范性 -->
            <transition name="slide-fade">
              <div v-if="showFormatStandard" class="analysis-card">
                <div class="card-header">
                  <i class="el-icon-edit-outline"></i>
                  <h4>格式规范性</h4>
                  <div class="score-badge" :class="getScoreClass(analysisResult.formatStandard)">
                    {{ analysisResult.formatStandard }}
                  </div>
                </div>
                <div class="card-content">
                  <p>{{ analysisResult.formatStandardComment }}</p>
                  <div class="improvement-tips">
                    <h5>改进建议：</h5>
                    <ul>
                      <li v-for="tip in analysisResult.formatStandardTips" :key="tip">
                        {{ tip }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 关键词匹配 -->
            <transition name="slide-fade">
              <div v-if="showKeywordMatch" class="analysis-card">
                <div class="card-header">
                  <i class="el-icon-search"></i>
                  <h4>关键词匹配</h4>
                  <div class="score-badge" :class="getScoreClass(analysisResult.keywordMatch)">
                    {{ analysisResult.keywordMatch }}
                  </div>
                </div>
                <div class="card-content">
                  <p>{{ analysisResult.keywordMatchComment }}</p>
                  <div class="improvement-tips">
                    <h5>改进建议：</h5>
                    <ul>
                      <li v-for="tip in analysisResult.keywordMatchTips" :key="tip">
                        {{ tip }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 职业匹配度 -->
            <transition name="slide-fade">
              <div v-if="showCareerMatch" class="analysis-card">
                <div class="card-header">
                  <i class="el-icon-user"></i>
                  <h4>职业匹配度</h4>
                  <div class="score-badge" :class="getScoreClass(analysisResult.careerMatch)">
                    {{ analysisResult.careerMatch }}
                  </div>
                </div>
                <div class="card-content">
                  <p>{{ analysisResult.careerMatchComment }}</p>
                  <div class="improvement-tips">
                    <h5>改进建议：</h5>
                    <ul>
                      <li v-for="tip in analysisResult.careerMatchTips" :key="tip">
                        {{ tip }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 表达专业度 -->
            <transition name="slide-fade">
              <div v-if="showProfessionalism" class="analysis-card">
                <div class="card-header">
                  <i class="el-icon-medal"></i>
                  <h4>表达专业度</h4>
                  <div class="score-badge" :class="getScoreClass(analysisResult.professionalism)">
                    {{ analysisResult.professionalism }}
                  </div>
                </div>
                <div class="card-content">
                  <p>{{ analysisResult.professionalismComment }}</p>
                  <div class="improvement-tips">
                    <h5>改进建议：</h5>
                    <ul>
                      <li v-for="tip in analysisResult.professionalismTips" :key="tip">
                        {{ tip }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </transition>

            <!-- 视觉呈现 -->
            <transition name="slide-fade">
              <div v-if="showVisualPresentation" class="analysis-card">
                <div class="card-header">
                  <i class="el-icon-picture-outline"></i>
                  <h4>视觉呈现</h4>
                  <div class="score-badge" :class="getScoreClass(analysisResult.visualPresentation)">
                    {{ analysisResult.visualPresentation }}
                  </div>
                </div>
                <div class="card-content">
                  <p>{{ analysisResult.visualPresentationComment }}</p>
                  <div class="improvement-tips">
                    <h5>改进建议：</h5>
                    <ul>
                      <li v-for="tip in analysisResult.visualPresentationTips" :key="tip">
                        {{ tip }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- 优化建议 -->
        <transition name="slide-fade">
          <div v-if="showSuggestions" class="optimization-suggestions">
            <div class="section-header">
              <i class="el-icon-lightbulb"></i>
              <h3>优化建议</h3>
            </div>
            <div class="suggestions-list">
              <div
                v-for="(suggestion, index) in analysisResult.suggestions"
                :key="index"
                class="suggestion-item"
              >
                <div class="suggestion-header">
                  <div class="suggestion-icon">
                    <i :class="getSuggestionIcon(suggestion.type)"></i>
                  </div>
                  <div class="suggestion-content">
                    <h4>{{ suggestion.title }}</h4>
                    <p>{{ suggestion.description }}</p>
                  </div>
                  <div class="suggestion-priority" :class="suggestion.priority">
                    {{ getPriorityText(suggestion.priority) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button @click="downloadReport" type="primary" size="large">
            <i class="el-icon-download"></i>
            下载分析报告
          </el-button>
          <el-button @click="optimizeResume" type="success" size="large">
            <i class="el-icon-magic-stick"></i>
            一键优化
          </el-button>
          <el-button @click="reAnalyze" type="info" size="large">
            <i class="el-icon-refresh"></i>
            重新分析
          </el-button>
        </div>
        </template>
      </div>

      
    </div>
  </div>

  <!-- AI优化进度弹窗 -->
  <el-dialog
    v-model="optimizing"
    title="AI智能优化中"
    width="600px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
  >
    <div class="optimization-progress">
      <!-- 总体进度 -->
      <div class="progress-header">
        <div class="progress-icon">
          <i class="el-icon-magic-stick" :class="{ spinning: optimizing }"></i>
        </div>
        <h3>AI正在为您优化简历...</h3>
        <el-progress 
          :percentage="optimizationProgress" 
          :stroke-width="12"
          :show-text="true"
          status="success"
        ></el-progress>
      </div>

      <!-- 优化步骤列表 -->
      <div class="optimization-steps">
        <div 
          v-for="(step, index) in optimizationSteps" 
          :key="index"
          class="optimization-step"
          :class="{ 
            'active': step.status === 'processing',
            'completed': step.status === 'completed',
            'pending': step.status === 'pending'
          }"
        >
          <div class="step-icon">
            <i v-if="step.status === 'completed'" class="el-icon-check"></i>
            <i v-else-if="step.status === 'processing'" class="el-icon-loading"></i>
            <i v-else class="el-icon-more"></i>
          </div>
          <div class="step-content">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-description" v-if="step.status !== 'pending'">{{ step.description }}</div>
          </div>
          <div class="step-status">
            <span v-if="step.status === 'completed'" class="status-badge success">✓</span>
            <span v-else-if="step.status === 'processing'" class="status-badge processing">
              <i class="el-icon-loading"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- 完成后的操作按钮 -->
      <div v-if="optimizationComplete" class="optimization-complete">
        <div class="complete-icon">
          <i class="el-icon-circle-check"></i>
        </div>
        <h3>简历优化完成！</h3>
        <p>已根据AI分析结果优化您的简历，提升了内容完整性、格式规范性和关键词匹配度</p>
        <div class="complete-actions">
          <el-button type="success" size="large" @click="downloadOptimizedResume">
            <i class="el-icon-download"></i>
            下载优化后的简历
          </el-button>
          <el-button size="large" @click="closeOptimization">
            关闭
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

// 上传相关（本地模拟，不走服务端）
const uploadedFile = ref(null)
const analyzing = ref(false)

// 分析结果
const analysisResult = ref(null)
// 控制各部分显示的状态
const showOverallScore = ref(false)
const showIssues = ref(false)
const showContentCompleteness = ref(false)
const showFormatStandard = ref(false)
const showKeywordMatch = ref(false)
const showCareerMatch = ref(false)
const showProfessionalism = ref(false)
const showVisualPresentation = ref(false)
const showSuggestions = ref(false)

// 历史模块已移除

// 上传前检查
const beforeUpload = (file) => {
  const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
  const isValidSize = file.size / 1024 / 1024 < 10

  if (!isValidType) {
    ElMessage.error('只支持 PDF、Word 格式文件!')
    return false
  }
  if (!isValidSize) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return true
}

// 选择文件（本地）
const onFileChange = (uploadFile) => {
  // Element Plus on-change 参数是 UploadFile，原始文件在 raw 字段
  uploadedFile.value = uploadFile.raw
}

// 上传失败
const handleUploadError = (error) => {
  console.error('文件上传失败:', error)
}

// 生成问题清单（随机）
const generateResumeIssues = () => {
  const pool = [
    { text: '缺少量化数据，成就描述未体现具体指标', severity: 'high' },
    { text: '项目经历时间线不清晰，建议按时间倒序排列', severity: 'medium' },
    { text: '技能栏过于泛泛，建议分为「熟练」与「了解」', severity: 'medium' },
    { text: '缺少与目标职位相关的关键词，匹配度偏低', severity: 'high' },
    { text: '版面排版不够紧凑，空白区域较多', severity: 'low' },
    { text: '工作职责与成果混杂，建议拆分并突出成果', severity: 'high' },
    { text: '教育经历未补充核心课程或绩点信息', severity: 'low' },
    { text: '用词不够专业，建议统一使用动宾结构动词开头', severity: 'medium' },
    { text: '联系方式缺少 GitHub/作品链接，难以核验能力', severity: 'medium' },
    { text: '文件命名不规范，建议「姓名_职位_日期」', severity: 'low' }
  ]
  const severityTextMap = { high: '高', medium: '中', low: '低' }
  // 随机 4-6 条
  const count = Math.floor(Math.random() * 3) + 4
  const shuffled = [...pool].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map(i => ({ ...i, severityText: severityTextMap[i.severity] }))
}

// 开始分析
const startAnalysis = () => {
  analyzing.value = true
  // 重置所有显示状态
  showOverallScore.value = false
  showIssues.value = false
  showContentCompleteness.value = false
  showFormatStandard.value = false
  showKeywordMatch.value = false
  showCareerMatch.value = false
  showProfessionalism.value = false
  showVisualPresentation.value = false
  showSuggestions.value = false
  
  // 模拟分析过程
  setTimeout(() => {
    analyzing.value = false
    const score = Math.floor(Math.random() * 36) + 60 // 60-95
    const issues = generateResumeIssues()
    analysisResult.value = {
      overallScore: score,
      overallComment: score >= 90
        ? '您的简历整体表现优秀！内容充实、结构清晰，亮点突出。建议进一步强化可量化成果的展示，例如用具体数据说明项目成果和业绩提升，这将大幅提高HR的关注度和面试邀约率。'
        : score >= 80
        ? '简历质量良好，基础信息完整，项目经历描述较为清晰。建议重点补充量化成果（如提升XX%、节省XX小时），同时优化版式设计，让关键信息更加醒目，提升整体专业度。'
        : score >= 70
        ? '简历基础合格，具备必要的信息框架。当前主要问题在于内容结构需要优化、关键词匹配度不足。建议对照目标岗位JD调整描述重点，增加行业术语和技能关键词，提高简历的针对性。'
        : '简历需要系统性优化。建议从内容完整性、格式规范性、关键词匹配三个维度入手：完善项目经历细节、统一排版风格、突出与岗位相关的核心能力，以提升整体竞争力和岗位匹配度。',
      issues,
      contentCompleteness: Math.min(95, score + 3),
      contentCompletenessComment: '简历内容较为完整，基本信息、教育经历、工作/项目经历均有体现。',
      contentCompletenessTips: [
        '补充关键项目的职责与产出',
        '增加获奖/证书等证明材料',
        '添加与岗位相关的技能标签'
      ],
      formatStandard: Math.max(65, score - 7),
      formatStandardComment: '整体排版规范，局部留白与层级可进一步优化。',
      formatStandardTips: [
        '统一字体字号与行间距',
        '使用要点列表提升可读性',
        '避免大段文字堆叠'
      ],
      keywordMatch: Math.max(60, score - 5),
      keywordMatchComment: '与目标职位的关键词匹配度有提升空间。',
      keywordMatchTips: [
        '对照 JD 添加核心技能词',
        '在项目描述中嵌入相关术语',
        '强调领域经验与工具链'
      ],
      careerMatch: Math.min(95, score + 2),
      careerMatchComment: '岗位匹配度较高，核心经验方向基本契合。',
      careerMatchTips: [
        '突出核心业绩与影响',
        '强调可迁移能力',
        '明确目标岗位方向'
      ],
      professionalism: Math.max(70, score - 3),
      professionalismComment: '语言表达较为专业，动词使用恰当，但部分描述可以更精准。',
      professionalismTips: [
        '使用行业专业术语，提升表达精准度',
        '避免口语化表述，如"做了"、"弄好"等',
        '用"负责"、"主导"、"实现"等强有力的动词开头',
        '突出个人贡献，避免过多团队泛泛描述'
      ],
      visualPresentation: Math.max(65, score - 8),
      visualPresentationComment: '版式基本规范，但视觉层次感和信息密度有待优化。',
      visualPresentationTips: [
        '使用分栏或模块化布局，提升信息组织效率',
        '关键信息用加粗或颜色标注，增强视觉焦点',
        '适当留白，避免信息过于拥挤',
        '保持字体、颜色、间距的统一性，提升专业形象'
      ],
      suggestions: [
        {
          type: 'content',
          title: '增加可量化成果',
          description: '用数据体现价值，例如「将页面加载时间优化 35%」。',
          priority: 'high'
        },
        {
          type: 'format',
          title: '强化层级结构',
          description: '标题、粗体与列表结合，突出重点信息块。',
          priority: 'medium'
        },
        {
          type: 'keyword',
          title: '补充岗位关键词',
          description: '参考职位描述，补齐技术栈与业务关键词。',
          priority: 'high'
        }
      ]
    }
    
    // 逐步显示各部分内容，模拟AI生成过程
    nextTick(() => {
      setTimeout(() => { showOverallScore.value = true }, 200)
      setTimeout(() => { showIssues.value = true }, 600)
      setTimeout(() => { showContentCompleteness.value = true }, 1000)
      setTimeout(() => { showFormatStandard.value = true }, 1400)
      setTimeout(() => { showKeywordMatch.value = true }, 1800)
      setTimeout(() => { showCareerMatch.value = true }, 2200)
      setTimeout(() => { showProfessionalism.value = true }, 2600)
      setTimeout(() => { showVisualPresentation.value = true }, 3000)
      setTimeout(() => { showSuggestions.value = true }, 3400)
    })
  }, 3000)
}

// 获取评分等级
const getScoreLevel = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '一般'
  return '需要改进'
}

// 获取优先级图标
const getPriorityIcon = (severity) => {
  const iconMap = {
    high: 'el-icon-warning',
    medium: 'el-icon-info',
    low: 'el-icon-check'
  }
  return iconMap[severity] || 'el-icon-info'
}

// 获取评分样式类
const getScoreClass = (score) => {
  if (score >= 80) return 'score-good'
  if (score >= 60) return 'score-medium'
  return 'score-poor'
}

// 获取建议图标
const getSuggestionIcon = (type) => {
  const iconMap = {
    content: 'el-icon-document',
    format: 'el-icon-edit-outline',
    keyword: 'el-icon-search',
    career: 'el-icon-user'
  }
  return iconMap[type] || 'el-icon-lightbulb'
}

// 获取优先级文本
const getPriorityText = (priority) => {
  const priorityMap = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return priorityMap[priority] || '中'
}

// 格式化文件大小
const formatFileSize = (size) => {
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
  return (size / 1024 / 1024).toFixed(1) + ' MB'
}

// 历史模块已移除：formatDate

// 下载报告
const downloadReport = () => {
  console.log('下载分析报告')
}

// 优化简历相关状态
const optimizing = ref(false)
const optimizationProgress = ref(0)
const optimizationComplete = ref(false)
const optimizationSteps = ref([
  { 
    title: '分析简历结构', 
    description: '识别简历各模块，检测缺失项...',
    status: 'pending' 
  },
  { 
    title: '优化内容完整性', 
    description: '补充项目经验量化数据，完善技能描述...',
    status: 'pending' 
  },
  { 
    title: '提升格式规范性', 
    description: '统一字体样式，优化段落间距，调整版式布局...',
    status: 'pending' 
  },
  { 
    title: '增强关键词匹配', 
    description: '根据目标岗位添加核心技能词，优化专业术语...',
    status: 'pending' 
  },
  { 
    title: '优化表达专业度', 
    description: '改进动词使用，提升语言专业性，突出个人贡献...',
    status: 'pending' 
  },
  { 
    title: '美化视觉呈现', 
    description: '优化模块布局，调整视觉层次，增强可读性...',
    status: 'pending' 
  },
  { 
    title: '生成优化简历', 
    description: '整合所有优化内容，生成最终简历文档...',
    status: 'pending' 
  }
])

// 优化简历
const optimizeResume = () => {
  if (!analysisResult.value) {
    ElMessage.warning('请先上传并分析简历')
    return
  }

  // 重置状态
  optimizing.value = true
  optimizationProgress.value = 0
  optimizationComplete.value = false
  optimizationSteps.value.forEach(step => {
    step.status = 'pending'
  })

  // 开始逐步优化
  simulateOptimization()
}

// 模拟优化过程
const simulateOptimization = () => {
  const totalSteps = optimizationSteps.value.length
  let currentStep = 0

  const processNextStep = () => {
    if (currentStep < totalSteps) {
      // 标记当前步骤为处理中
      optimizationSteps.value[currentStep].status = 'processing'
      
      // 每个步骤需要1.5-2.5秒
      const stepDuration = 1500 + Math.random() * 1000
      
      setTimeout(() => {
        // 标记当前步骤为完成
        optimizationSteps.value[currentStep].status = 'completed'
        
        // 更新进度
        currentStep++
        optimizationProgress.value = Math.round((currentStep / totalSteps) * 100)
        
        // 处理下一步
        if (currentStep < totalSteps) {
          processNextStep()
        } else {
          // 所有步骤完成
          setTimeout(() => {
            optimizationComplete.value = true
          }, 500)
        }
      }, stepDuration)
    }
  }

  // 开始第一步
  processNextStep()
}

// 下载优化后的简历
const downloadOptimizedResume = () => {
  // 生成优化后的简历内容（示例）
  const optimizedContent = generateOptimizedResume()
  
  // 创建Blob对象
  const blob = new Blob([optimizedContent], { type: 'text/plain;charset=utf-8' })
  
  // 创建下载链接
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const originalName = uploadedFile.value?.name?.replace(/\.[^/.]+$/, '') || '简历'
  link.download = `${originalName}_AI优化版_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.txt`
  
  // 触发下载
  document.body.appendChild(link)
  link.click()
  
  // 清理
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('简历已下载，请查收！')
}

// 生成优化后的简历内容
const generateOptimizedResume = () => {
  const result = analysisResult.value
  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-CN')
  
  return `
═══════════════════════════════════════════
        AI 优化后的简历
═══════════════════════════════════════════

【优化日期】${dateStr}
【综合评分】${result.overallScore} 分 → 优化后预计 ${Math.min(95, result.overallScore + 15)} 分

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 基本信息
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
姓名：张三
性别：男
年龄：28岁
手机：138-xxxx-xxxx
邮箱：zhangsan@example.com
现居：北京市朝阳区
期望职位：高级前端工程师
期望薪资：25K-35K

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💼 工作经历
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【某互联网科技公司】2021.06 - 至今
职位：前端技术负责人

核心职责与成就：
• 主导公司核心业务系统前端架构设计，采用 Vue3 + TypeScript + Vite 技术栈，实现组件化、模块化开发，代码可维护性提升 40%
• 负责团队技术选型与方案评审，制定前端开发规范与最佳实践，团队开发效率提升 30%
• 实施前端性能优化方案，通过代码分割、懒加载、CDN 加速等手段，首屏加载时间优化 50%（从 3.2s 降至 1.6s）
• 搭建前端监控体系（接入 Sentry），实现错误追踪、性能监控、用户行为分析，线上问题发现率提升 60%
• 带领 5 人前端团队完成 8 个核心项目交付，按时交付率 100%，客户满意度 95%+

技术亮点：
- Vue3 Composition API、TypeScript、Vite、Pinia 状态管理
- Element Plus、Tailwind CSS、Echarts 数据可视化
- Webpack 深度优化、性能监控、CI/CD 自动化部署

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【某电商平台】2019.07 - 2021.05
职位：前端开发工程师

核心职责与成就：
• 参与电商平台 PC 端及移动端开发，使用 Vue2 + Vue Router + Vuex 构建 SPA 应用
• 独立开发商品详情页、购物车、订单系统等核心模块，日均 PV 突破 50 万
• 优化商品列表渲染性能，引入虚拟滚动技术，大列表渲染性能提升 70%
• 封装 20+ 业务组件，形成内部组件库，组件复用率达 80%
• 配合后端完成 RESTful API 对接，使用 Axios 封装请求层，统一错误处理

技术栈：Vue2、Vue Router、Vuex、Webpack、Sass、Axios

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 教育背景
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
某大学  |  计算机科学与技术  |  本科  |  2015.09 - 2019.06

主修课程：数据结构、算法设计、操作系统、计算机网络、数据库原理
获得奖项：校级一等奖学金（2次）、优秀毕业生

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️ 专业技能
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【前端框架】精通 Vue2/Vue3 生态（Vue Router、Pinia/Vuex）、熟悉 React 及 Hooks
【编程语言】精通 JavaScript (ES6+)、TypeScript，熟悉 Node.js
【工程化】熟练使用 Webpack、Vite、Rollup 等构建工具，了解 CI/CD 流程
【UI 框架】Element Plus、Ant Design、Tailwind CSS、Bootstrap
【可视化】Echarts、D3.js、AntV G2 等数据可视化库
【移动端】熟悉响应式布局、移动端适配（rem、vw/vh）、微信小程序开发
【版本管理】Git（Git Flow 工作流）、GitLab、GitHub
【其他】RESTful API 对接、性能优化、前端安全、单元测试（Jest、Vitest）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏆 项目经验
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【智慧校园管理系统】
项目描述：为高校打造的综合管理平台，涵盖教务管理、学生管理、数据中心等模块
技术栈：Vue3 + TypeScript + Element Plus + Echarts + Pinia
我的贡献：
• 主导前端架构设计，采用微前端思想进行模块拆分，支持独立开发部署
• 开发数据可视化大屏，使用 Echarts 实现多维度数据展示，支持实时数据更新
• 实现权限管理系统（RBAC），支持动态路由、按钮级权限控制
• 项目上线后服务 50+ 所高校，用户满意度 4.8/5.0

【企业内部协作平台】
项目描述：面向企业的即时通讯与项目协作工具，类似钉钉+Jira
技术栈：Vue3 + WebSocket + IndexedDB + PWA
我的贡献：
• 实现即时通讯功能，基于 WebSocket 实现消息实时推送，消息送达率 99.9%
• 开发离线存储方案，使用 IndexedDB 缓存聊天记录，支持离线查看
• 实现 PWA 特性，支持添加到桌面、离线访问，用户留存率提升 25%
• 优化大文件上传功能，采用分片上传+断点续传，上传成功率 99%+

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ 优化说明
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

本简历已通过 AI 智能分析与优化，主要改进点包括：

✅ 内容完整性：补充了量化数据与具体成果，突出个人价值
✅ 格式规范性：统一字体样式，优化段落结构，增强可读性
✅ 关键词匹配：根据目标岗位添加核心技能词，提升 ATS 通过率
✅ 表达专业度：使用行业术语与强动词，避免口语化表述
✅ 视觉呈现：优化信息层次，增强视觉焦点，提升专业形象
✅ 职业匹配：突出核心经验与可迁移能力，明确职业发展方向

评分提升：${result.overallScore} 分 → ${Math.min(95, result.overallScore + 15)} 分 (↑${Math.min(15, 95 - result.overallScore)} 分)

═══════════════════════════════════════════
           优化完成 | 祝求职顺利！
═══════════════════════════════════════════
`
}

// 关闭优化弹窗
const closeOptimization = () => {
  optimizing.value = false
  setTimeout(() => {
    optimizationProgress.value = 0
    optimizationComplete.value = false
    optimizationSteps.value.forEach(step => {
      step.status = 'pending'
    })
  }, 300)
  ElMessage.success('您可以随时点击"一键优化"重新生成简历')
}

// 重新分析
const reAnalyze = () => {
  analysisResult.value = null
  startAnalysis()
}

// 历史模块已移除：viewHistoryRecord
</script>

<style scoped>
.resume-review-container {
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.section-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.review-content {
  display: grid;
  grid-template-columns: 360px 1fr; /* 左侧上传，右侧分析 */
  align-items: start;
  column-gap: 24px; /* 保持左右间距 */
  row-gap: 8px; /* 收紧上传与历史的上下间距 */
}

.upload-section,
.analysis-result {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

.analyzing-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
}

.analyzing-gif {
  width: 240px;
  height: 240px;
  object-fit: contain;
  opacity: 0.95;
}

/* 历史记录默认随网格流布局（在上传下方，位于左列） */

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  margin-top: 20px;
}

.section-header i {
  font-size: 20px;
  color: #667eea;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.upload-area {
  margin-bottom: 20px;
}

.upload-dragger {
  width: 100%;
}

.uploaded-file-info {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  gap: 20px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-info i {
  font-size: 20px;
  color: #667eea;
}

.file-name {
  font-weight: 500;
  color: #1f2937;
}

.file-size {
  color: #6b7280;
  font-size: 14px;
}

.overall-score {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  margin-bottom: 24px;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.score-number {
  font-size: 32px;
  font-weight: 700;
}

.score-label {
  font-size: 14px;
  opacity: 0.9;
}

.score-description h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.score-description p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.6;
}

/* 问题清单样式 */
.issues-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
}

.issues-section .section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.issues-section .section-header i {
  font-size: 22px;
  color: #f59e0b;
}

.issues-section .section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.issue-count {
  font-size: 13px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 12px;
  border-radius: 12px;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.issue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid #e5e7eb;
  transition: all 0.3s ease;
}

.issue-item:hover {
  background: #f3f4f6;
  border-left-color: #667eea;
  transform: translateX(4px);
}

.issue-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.issue-number {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.issue-content {
  flex: 1;
}

.issue-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.issue-priority {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.issue-priority .priority-icon {
  font-size: 14px;
}

.priority-high {
  background: #fee2e2;
  color: #dc2626;
}

.priority-high .priority-icon {
  color: #dc2626;
}

.priority-medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-medium .priority-icon {
  color: #d97706;
}

.priority-low {
  background: #d1fae5;
  color: #059669;
}

.priority-low .priority-icon {
  color: #059669;
}

.issue-priority:hover {
  transform: scale(1.05);
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.analysis-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #667eea;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.card-header i {
  font-size: 18px;
  color: #667eea;
}

.card-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.score-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.score-good {
  background: #10b981;
}

.score-medium {
  background: #f59e0b;
}

.score-poor {
  background: #ef4444;
}

.card-content p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.improvement-tips h5 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.improvement-tips ul {
  margin: 0;
  padding-left: 16px;
}

.improvement-tips li {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 4px;
}

.suggestions-list {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.suggestion-item {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.suggestion-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.suggestion-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.suggestion-icon i {
  font-size: 18px;
  color: #667eea;
}

.suggestion-content {
  flex: 1;
}

.suggestion-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.suggestion-content p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.suggestion-priority {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.suggestion-priority.high {
  background: #fee2e2;
  color: #dc2626;
}

.suggestion-priority.medium {
  background: #fef3c7;
  color: #d97706;
}

.suggestion-priority.low {
  background: #d1fae5;
  color: #059669;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

/* 滑入渐显动画 */
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: translateY(0);
  opacity: 1;
}

/* 历史相关样式已移除 */

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-review-container {
    padding: 16px;
  }
  
  .review-content {
    grid-template-columns: 1fr; /* 小屏垂直排列 */
    row-gap: 8px; /* 小屏上下更紧凑 */
  }
  
  .upload-section,
  .analysis-result {
    padding: 16px;
  }
  
  .overall-score {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .score-description p {
    font-size: 13px;
  }
  
  .issues-section {
    padding: 16px;
  }
  
  .issues-section .section-header {
    flex-wrap: wrap;
  }
  
  .issue-count {
    width: 100%;
    text-align: center;
    margin-top: 8px;
  }
  
  .issue-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
  }
  
  .issue-item:hover {
    transform: translateX(0);
  }
  
  .issue-left {
    width: 100%;
  }
  
  .issue-priority {
    align-self: flex-end;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .el-button {
    width: 200px;
  }
  
  /* 历史相关样式已移除 */
}

/* AI优化进度弹窗样式 */
.optimization-progress {
  padding: 20px 0;
}

.progress-header {
  text-align: center;
  margin-bottom: 30px;
}

.progress-icon {
  font-size: 48px;
  color: #67c23a;
  margin-bottom: 16px;
}

.progress-icon i {
  display: inline-block;
}

.progress-icon .spinning {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.progress-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.optimization-steps {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.optimization-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.3s ease;
}

.optimization-step.pending {
  opacity: 0.5;
}

.optimization-step.active {
  background: #ecfdf5;
  border-left: 3px solid #10b981;
  animation: pulse 1.5s ease-in-out infinite;
}

.optimization-step.completed {
  background: #f0fdf4;
  border-left: 3px solid #10b981;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

.step-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: white;
  flex-shrink: 0;
}

.step-icon i {
  font-size: 16px;
}

.optimization-step.pending .step-icon {
  color: #9ca3af;
}

.optimization-step.active .step-icon {
  color: #10b981;
  animation: spin 1s linear infinite;
}

.optimization-step.completed .step-icon {
  color: #10b981;
  background: #d1fae5;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.step-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.step-status {
  flex-shrink: 0;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
}

.status-badge.success {
  background: #d1fae5;
  color: #10b981;
}

.status-badge.processing {
  background: #dbeafe;
  color: #3b82f6;
}

.status-badge.processing i {
  animation: spin 1s linear infinite;
}

.optimization-complete {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border-radius: 12px;
  margin-top: 20px;
}

.complete-icon {
  font-size: 64px;
  color: #10b981;
  margin-bottom: 16px;
}

.complete-icon i {
  display: inline-block;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.optimization-complete h3 {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.optimization-complete p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.complete-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 优化进度条样式 */
:deep(.el-progress__text) {
  font-size: 16px !important;
  font-weight: 600;
}

:deep(.el-progress-bar__outer) {
  background-color: #e5e7eb;
}

:deep(.el-progress-bar__inner) {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}
</style>
