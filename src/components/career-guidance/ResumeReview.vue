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
        <div class="overall-score">
          <div class="score-circle">
            <div class="score-number">{{ analysisResult.overallScore }}</div>
            <div class="score-label">综合评分</div>
          </div>
          <div class="score-description">
            <h4>{{ getScoreLevel(analysisResult.overallScore) }}</h4>
            <p>{{ analysisResult.overallComment }}</p>
          </div>
        </div>

        <!-- 问题清单 -->
        <div class="issues-section" v-if="analysisResult.issues && analysisResult.issues.length">
          <div class="section-header">
            <i class="el-icon-warning-outline"></i>
            <h3>问题清单</h3>
          </div>
          <div class="issues-list">
            <div class="issue-item" v-for="(issue, idx) in analysisResult.issues" :key="idx">
              <div class="issue-content">
                <span class="issue-index">{{ idx + 1 }}.</span>
                <span class="issue-text">{{ issue.text }}</span>
              </div>
              <span class="issue-severity" :class="'sev-' + issue.severity">{{ issue.severityText }}</span>
            </div>
          </div>
        </div>

        <!-- 详细分析 -->
        <div class="detailed-analysis">
          <div class="analysis-grid">
            <!-- 内容完整性 -->
            <div class="analysis-card">
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

            <!-- 格式规范性 -->
            <div class="analysis-card">
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

            <!-- 关键词匹配 -->
            <div class="analysis-card">
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

            <!-- 职业匹配度 -->
            <div class="analysis-card">
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
          </div>
        </div>

        <!-- 优化建议 -->
        <div class="optimization-suggestions">
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

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button @click="downloadReport" type="primary" size="large">
            <i class="el-icon-download"></i>
            下载诊断报告
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
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 上传相关（本地模拟，不走服务端）
const uploadedFile = ref(null)
const analyzing = ref(false)

// 分析结果
const analysisResult = ref(null)

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
  
  // 模拟分析过程
  setTimeout(() => {
    analyzing.value = false
    const score = Math.floor(Math.random() * 36) + 60 // 60-95
    const issues = generateResumeIssues()
    analysisResult.value = {
      overallScore: score,
      overallComment: score >= 90
        ? '整体表现优秀，可进一步强化亮点与可量化成果。'
        : score >= 80
        ? '简历质量良好，建议补充量化成果并优化版式。'
        : score >= 70
        ? '简历基础合格，需加强结构与关键词匹配。'
        : '需系统性优化内容与格式，提升岗位匹配度。',
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
  }, 3000)
}

// 获取评分等级
const getScoreLevel = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '一般'
  return '需要改进'
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
  console.log('下载诊断报告')
}

// 优化简历
const optimizeResume = () => {
  console.log('一键优化简历')
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
  line-height: 1.5;
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
</style>
