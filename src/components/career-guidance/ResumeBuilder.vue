<template>
  <div class="resume-builder-container">
    <div class="page-header">
      <p class="section-description">了解简历基本必要信息模块都有哪些，尝试为自己撰写一份个人简历</p>
    </div>

    <div class="builder-content">

      <!-- 左：简历信息填写 -->
      <div class="resume-form">
        <div class="section-header">
          <i class="el-icon-edit"></i>
          <h3>填写信息</h3>
        </div>
        
        <el-form :model="resumeData" label-width="100px" class="resume-form-content">
          <!-- 基本信息 -->
          <div class="form-section">
            <h4 class="form-section-title">基本信息</h4>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名" required>
                  <el-input v-model="resumeData.basicInfo.name" placeholder="请输入您的姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-select v-model="resumeData.basicInfo.gender" placeholder="请选择">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="手机号" required>
                  <el-input v-model="resumeData.basicInfo.phone" placeholder="请输入手机号" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" required>
                  <el-input v-model="resumeData.basicInfo.email" placeholder="请输入邮箱" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="地址">
              <el-input v-model="resumeData.basicInfo.address" placeholder="请输入地址" />
            </el-form-item>
          </div>

          <!-- 教育经历 -->
          <div class="form-section">
            <h4 class="form-section-title">教育经历</h4>
            <div
              v-for="(education, index) in resumeData.education"
              :key="index"
              class="education-item"
            >
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="学校名称">
                    <el-input v-model="education.school" placeholder="请输入学校名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="专业">
                    <el-input v-model="education.major" placeholder="请输入专业" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="学历">
                    <el-select v-model="education.degree" placeholder="请选择">
                      <el-option label="高中" value="高中" />
                      <el-option label="大专" value="大专" />
                      <el-option label="本科" value="本科" />
                      <el-option label="硕士" value="硕士" />
                      <el-option label="博士" value="博士" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开始时间">
                    <el-date-picker
                      v-model="education.startDate"
                      type="month"
                      placeholder="选择时间"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结束时间">
                    <el-date-picker
                      v-model="education.endDate"
                      type="month"
                      placeholder="选择时间"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="item-actions">
                <el-button
                  v-if="resumeData.education.length > 1"
                  type="danger"
                  size="small"
                  @click="removeEducation(index)"
                >
                  删除
                </el-button>
              </div>
            </div>
            <el-button type="primary" size="small" @click="addEducation">
              添加教育经历
            </el-button>
          </div>

          <!-- 工作经历 -->
          <div class="form-section">
            <h4 class="form-section-title">工作经历</h4>
            <div
              v-for="(work, index) in resumeData.workExperience"
              :key="index"
              class="work-item"
            >
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="公司名称">
                    <el-input v-model="work.company" placeholder="请输入公司名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="职位">
                    <el-input v-model="work.position" placeholder="请输入职位" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="开始时间">
                    <el-date-picker
                      v-model="work.startDate"
                      type="month"
                      placeholder="选择时间"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="结束时间">
                    <el-date-picker
                      v-model="work.endDate"
                      type="month"
                      placeholder="选择时间"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="工作描述">
                <el-input
                  v-model="work.description"
                  type="textarea"
                  :rows="3"
                  placeholder="请描述您的工作内容和成就"
                />
              </el-form-item>
              <div class="item-actions">
                <el-button
                  v-if="resumeData.workExperience.length > 1"
                  type="danger"
                  size="small"
                  @click="removeWork(index)"
                >
                  删除
                </el-button>
              </div>
            </div>
            <el-button type="primary" size="small" @click="addWork">
              添加工作经历
            </el-button>
          </div>

          <!-- 技能特长 -->
          <div class="form-section">
            <h4 class="form-section-title">技能特长</h4>
            <el-form-item label="专业技能">
              <el-input
                v-model="resumeData.skills"
                type="textarea"
                :rows="3"
                placeholder="请列出您的专业技能，用逗号分隔"
              />
            </el-form-item>
          </div>

          <!-- 自我评价 -->
          <div class="form-section">
            <h4 class="form-section-title">自我评价</h4>
            <el-form-item label="个人简介">
              <el-input
                v-model="resumeData.selfEvaluation"
                type="textarea"
                :rows="4"
                placeholder="请简要介绍您的个人特点和优势"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>

      <!-- 右：实时预览 -->
      <div class="resume-live-preview">
        <div class="preview-header">
          <i class="el-icon-view"></i>
          <h3>简历预览</h3>
        </div>

        <div class="preview-card">
          <div class="preview-basic">
            <div class="name-line">
              <span class="name">{{ resumeData.basicInfo.name || '姓名' }}</span>
              <span class="gender" v-if="resumeData.basicInfo.gender">（{{ resumeData.basicInfo.gender }}）</span>
            </div>
            <div class="contacts">
              <span v-if="resumeData.basicInfo.phone">📞 {{ resumeData.basicInfo.phone }}</span>
              <span v-if="resumeData.basicInfo.email">✉️ {{ resumeData.basicInfo.email }}</span>
              <span v-if="resumeData.basicInfo.address">📍 {{ resumeData.basicInfo.address }}</span>
            </div>
          </div>

          <div class="preview-section" v-if="resumeData.selfEvaluation">
            <h4>个人简介</h4>
            <p class="multiline">{{ resumeData.selfEvaluation }}</p>
          </div>

          <div class="preview-section" v-if="resumeData.education && resumeData.education.length">
            <h4>教育经历</h4>
            <div class="preview-list">
              <div
                class="preview-item"
                v-for="(edu, idx) in resumeData.education"
                :key="'edu-' + idx"
              >
                <div class="item-head">
                  <span class="item-title">{{ edu.school || '学校名称' }}</span>
                  <span class="item-meta">
                    {{ (edu.startDate || '') + (edu.startDate || edu.endDate ? ' — ' : '') + (edu.endDate || '') }}
                  </span>
                </div>
                <div class="item-sub">
                  <span>{{ edu.major || '专业' }}</span>
                  <span v-if="edu.degree"> · {{ edu.degree }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="preview-section" v-if="resumeData.workExperience && resumeData.workExperience.length">
            <h4>工作经历</h4>
            <div class="preview-list">
              <div
                class="preview-item"
                v-for="(work, idx) in resumeData.workExperience"
                :key="'work-' + idx"
              >
                <div class="item-head">
                  <span class="item-title">{{ work.company || '公司名称' }}</span>
                  <span class="item-meta">
                    {{ (work.startDate || '') + (work.startDate || work.endDate ? ' — ' : '') + (work.endDate || '') }}
                  </span>
                </div>
                <div class="item-sub">
                  <span>{{ work.position || '职位' }}</span>
                </div>
                <p v-if="work.description" class="multiline">{{ work.description }}</p>
              </div>
            </div>
          </div>

          <div class="preview-section" v-if="resumeData.skills">
            <h4>技能特长</h4>
            <div class="skill-tags">
              <el-tag
                v-for="(skill, idx) in resumeData.skills.split(',').map(s => s.trim()).filter(Boolean)"
                :key="'skill-' + idx"
                size="small"
                type="info"
                class="skill-tag"
              >
                {{ skill }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button @click="previewResume" type="primary" size="large">
          <i class="el-icon-view"></i>
          预览简历
        </el-button>
        <el-button @click="downloadResume" type="success" size="large">
          <i class="el-icon-download"></i>
          下载简历
        </el-button>
        <el-button @click="saveResume" type="info" size="large">
          <i class="el-icon-document"></i>
          保存草稿
        </el-button>
      </div>
    </div>

    <!-- 简历预览弹窗 -->
    <el-dialog
      class="resume-dialog"
      :visible.sync="previewVisible"
      width="80%"
      :before-close="handleClose"
    >
      <div class="resume-preview">
        <div class="preview-content">
          <!-- 简历预览内容（与右侧实时预览一致） -->
          <div class="preview-card">
            <div class="preview-basic">
              <div class="name-line">
                <span class="name">{{ resumeData.basicInfo.name || '姓名' }}</span>
                <span class="gender" v-if="resumeData.basicInfo.gender">（{{ resumeData.basicInfo.gender }}）</span>
              </div>
              <div class="contacts">
                <span v-if="resumeData.basicInfo.phone">📞 {{ resumeData.basicInfo.phone }}</span>
                <span v-if="resumeData.basicInfo.email">✉️ {{ resumeData.basicInfo.email }}</span>
                <span v-if="resumeData.basicInfo.address">📍 {{ resumeData.basicInfo.address }}</span>
              </div>
            </div>

            <div class="preview-section" v-if="resumeData.selfEvaluation">
              <h4>个人简介</h4>
              <p class="multiline">{{ resumeData.selfEvaluation }}</p>
            </div>

            <div class="preview-section" v-if="resumeData.education && resumeData.education.length">
              <h4>教育经历</h4>
              <div class="preview-list">
                <div
                  class="preview-item"
                  v-for="(edu, idx) in resumeData.education"
                  :key="'edu-dialog-' + idx"
                >
                  <div class="item-head">
                    <span class="item-title">{{ edu.school || '学校名称' }}</span>
                    <span class="item-meta">
                      {{ (edu.startDate || '') + (edu.startDate || edu.endDate ? ' — ' : '') + (edu.endDate || '') }}
                    </span>
                  </div>
                  <div class="item-sub">
                    <span>{{ edu.major || '专业' }}</span>
                    <span v-if="edu.degree"> · {{ edu.degree }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="preview-section" v-if="resumeData.workExperience && resumeData.workExperience.length">
              <h4>工作经历</h4>
              <div class="preview-list">
                <div
                  class="preview-item"
                  v-for="(work, idx) in resumeData.workExperience"
                  :key="'work-dialog-' + idx"
                >
                  <div class="item-head">
                    <span class="item-title">{{ work.company || '公司名称' }}</span>
                    <span class="item-meta">
                      {{ (work.startDate || '') + (work.startDate || work.endDate ? ' — ' : '') + (work.endDate || '') }}
                    </span>
                  </div>
                  <div class="item-sub">
                    <span>{{ work.position || '职位' }}</span>
                  </div>
                  <p v-if="work.description" class="multiline">{{ work.description }}</p>
                </div>
              </div>
            </div>

            <div class="preview-section" v-if="resumeData.skills">
              <h4>技能特长</h4>
              <div class="skill-tags">
                <el-tag
                  v-for="(skill, idx) in resumeData.skills.split(',').map(s => s.trim()).filter(Boolean)"
                  :key="'skill-dialog-' + idx"
                  size="small"
                  type="info"
                  class="skill-tag"
                >
                  {{ skill }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 简历数据
const resumeData = reactive({
  basicInfo: {
    name: '',
    gender: '',
    phone: '',
    email: '',
    address: ''
  },
  education: [
    {
      school: '',
      major: '',
      degree: '',
      startDate: '',
      endDate: ''
    }
  ],
  workExperience: [
    {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ],
  skills: '',
  selfEvaluation: ''
})

// 预览弹窗
const previewVisible = ref(false)

// Prefill：根据项目中已有的示例/登录信息初始化默认值
const prefillResumeData = () => {
  try {
    // 从本地存储读取用户名称
    const rawUser = localStorage.getItem('user')
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser)
        if (!resumeData.basicInfo.name) {
          resumeData.basicInfo.name = parsed.username || ''
        }
      } catch {
        if (!resumeData.basicInfo.name) {
          resumeData.basicInfo.name = rawUser
        }
      }
    }

    // 基本信息：参考 `profile/BasicInfo.vue` 展示的示例数据
    if (!resumeData.basicInfo.address) {
      resumeData.basicInfo.address = '北京市朝阳区'
    }
    // 邮箱/电话项目暂无统一来源，保留为空以避免误导

    // 教育经历：与康养大健康相关的默认数据
    const edu = resumeData.education && resumeData.education[0]
    if (edu) {
      if (!edu.school) edu.school = '北京劳动保障职业学院'
      if (!edu.major) edu.major = '智慧健康养老服务与管理'
      if (!edu.degree) edu.degree = '大专'
      if (!edu.startDate) edu.startDate = '2021-09'
      if (!edu.endDate) edu.endDate = '2024-06'
    }
  } catch (e) {
    // 静默失败，避免阻断页面
    console.warn('prefillResumeData failed:', e)
  }
}

onMounted(() => {
  prefillResumeData()
})

// 添加教育经历
const addEducation = () => {
  resumeData.education.push({
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: ''
  })
}

// 删除教育经历
const removeEducation = (index) => {
  resumeData.education.splice(index, 1)
}

// 添加工作经历
const addWork = () => {
  resumeData.workExperience.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  })
}

// 删除工作经历
const removeWork = (index) => {
  resumeData.workExperience.splice(index, 1)
}


// 预览简历
const previewResume = () => {
  previewVisible.value = true
}

// 下载简历
const downloadResume = () => {
  console.log('下载简历')
  // 这里可以实现简历下载功能
}

// 保存简历
const saveResume = () => {
  console.log('保存简历草稿')
  // 这里可以实现简历保存功能
}

// 关闭预览
const handleClose = () => {
  previewVisible.value = false
}
</script>

<style scoped>
.resume-builder-container {
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

.builder-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  /* Keep the whole builder within the viewport with room for header/padding */
  max-height: calc(100vh - 180px);
}

.resume-form {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  overflow: auto;
}

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


.resume-form-content {
  max-width: 800px;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.education-item,
.work-item {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.item-actions {
  margin-top: 12px;
  text-align: right;
}

.action-buttons {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 0;
  /* Keep actions always visible */
  position: sticky;
  bottom: 0;
  background: white;
  padding: 12px 0;
  border-top: 1px solid #e5e7eb;
  z-index: 1;
}

.resume-preview {
  max-height: 80vh;
  overflow-y: auto;
}

/* 右侧预览区域样式 */
.resume-live-preview {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  overflow: auto;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.preview-header i {
  font-size: 20px;
  color: #667eea;
}

.preview-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.preview-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.preview-basic .name-line {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.preview-basic .contacts {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #4b5563;
}

.preview-section {
  margin-top: 20px;
}

.preview-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 10px 0;
  padding-bottom: 6px;
  border-bottom: 2px solid #e5e7eb;
}

.preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-item .item-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.preview-item .item-title {
  font-weight: 600;
  color: #111827;
}

.preview-item .item-meta {
  color: #6b7280;
  font-size: 12px;
}

.preview-item .item-sub {
  color: #374151;
  font-size: 13px;
  margin-top: 4px;
}

.multiline {
  white-space: pre-wrap;
  line-height: 1.5;
  color: #374151;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-content {
  padding: 20px;
}

.resume-template {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 8px;
}

.resume-template h3 {
  color: #1f2937;
  margin-bottom: 16px;
}

.resume-template p {
  color: #6b7280;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-builder-container {
    padding: 16px;
  }
  
  .builder-content {
    display: flex;
    flex-direction: column;
  }

  .resume-form {
    padding: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons .el-button {
    width: 200px;
  }
}

/* Dialog height tuning: make body scrollable and keep header/footer visible */
.resume-dialog .el-dialog__body {
  max-height: calc(90vh - 120px);
  overflow: auto;
}
</style>
