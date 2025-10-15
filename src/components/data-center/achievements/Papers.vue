<template>
  <div class="papers-container">
    <!-- 隐藏原来的筛选区域，因为现在由父组件统一管理 -->
    <!-- <div class="filter-section">
      <div class="filter-row">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchKeyword" 
            placeholder="搜索论文名称、作者或关键词..."
            class="search-input"
          >
          <i class="search-icon">🔍</i>
        </div>
      </div>
    </div> -->

    <!-- 内容区域 -->
    <div class="content-section">
      <div class="section-header">
        <h2>论文：{{ filteredPapers.length }}</h2>
        <div class="view-toggle">
          <el-button-group>
            <el-button 
              :type="viewMode === 'list' ? 'primary' : ''" 
              @click="viewMode = 'list'"
              size="small"
            >
              列表视图
            </el-button>
            <el-button 
              :type="viewMode === 'card' ? 'primary' : ''" 
              @click="viewMode = 'card'"
              size="small"
            >
              卡片视图
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 数据列表/卡片 -->
      <div class="content-area">
        <!-- 列表视图 -->
        <div v-if="viewMode === 'list'" class="list-view">
          <div class="table-header">
            <div class="col-name">论文名称</div>
            <div class="col-authors">作者</div>
            <div class="col-year">发表年份</div>
            <div class="col-publication">来源出版物</div>
            <div class="col-article-id">文章编号</div>
            <div class="col-docs">资料附件</div>
            <div class="col-upload">上传</div>
            <div class="col-action">操作</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="paper in filteredPapers" 
              :key="paper.id" 
              class="table-row"
            >
              <div class="col-name">{{ paper.title }}</div>
              <div class="col-authors">{{ paper.authors.join(', ') }}</div>
              <div class="col-year">{{ paper.publishYear }}</div>
              <div class="col-publication">{{ paper.publication }}</div>
              <div class="col-article-id">{{ paper.articleId }}</div>
              <div class="col-docs">
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in paper.documents" 
                    :key="index"
                    class="doc-item"
                    @click="viewDocument(doc)"
                  >
                    📄 {{ doc.name }}
                  </span>
                </div>
              </div>
              <div class="col-upload">
                <button 
                  class="upload-btn-small" 
                  @click="uploadDocument(paper)"
                >
                  上传
                </button>
              </div>
              <div class="col-action">
                <button 
                  class="view-btn-small" 
                  @click="viewPaper(paper)"
                >
                  查看
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片视图 -->
        <div v-if="viewMode === 'card'" class="card-view">
          <div 
            v-for="paper in filteredPapers" 
            :key="paper.id" 
            class="paper-card"
          >
            <div class="card-header">
              <h3 class="paper-title">{{ paper.title }}</h3>
              <span class="publish-year">{{ paper.publishYear }}</span>
            </div>
            
            <div class="card-content">
              <div class="info-row">
                <span class="label">作者：</span>
                <span class="value">{{ paper.authors.join(', ') }}</span>
              </div>
              <div class="info-row">
                <span class="label">来源出版物：</span>
                <span class="value">{{ paper.publication }}</span>
              </div>
              <div class="info-row">
                <span class="label">文章编号：</span>
                <span class="value">{{ paper.articleId }}</span>
              </div>
              <div class="info-row">
                <span class="label">资料附件：</span>
                <div class="docs-list">
                  <span 
                    v-for="(doc, index) in paper.documents" 
                    :key="index"
                    class="doc-item"
                    @click="viewDocument(doc)"
                  >
                    📄 {{ doc.name }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="card-footer">
              <button 
                class="upload-btn-primary" 
                @click="uploadDocument(paper)"
              >
                上传资料
              </button>
              <button 
                class="view-btn-primary" 
                @click="viewPaper(paper)"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredPapers.length === 0" class="empty-state">
          <div class="empty-icon">📚</div>
          <h3>暂无论文记录</h3>
          <p>您还没有添加任何论文信息</p>
        </div>
      </div>
    </div>

    <!-- 论文详情弹窗 -->
    <div v-if="showPaperModal" class="modal-overlay" @click="closePaperModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedPaper?.title }}</h3>
          <button class="close-btn" @click="closePaperModal">×</button>
        </div>
        <div class="modal-body">
          <div class="paper-image">
            <img 
              :src="selectedPaper?.image" 
              :alt="selectedPaper?.title"
              @error="handleImageError"
            >
          </div>
          <div class="paper-info">
            <div class="info-item">
              <span class="label">作者：</span>
              <span class="value">{{ selectedPaper?.authors.join(', ') }}</span>
            </div>
            <div class="info-item">
              <span class="label">发表年份：</span>
              <span class="value">{{ selectedPaper?.publishYear }}</span>
            </div>
            <div class="info-item">
              <span class="label">来源出版物：</span>
              <span class="value">{{ selectedPaper?.publication }}</span>
            </div>
            <div class="info-item">
              <span class="label">卷号：</span>
              <span class="value">{{ selectedPaper?.volume }}</span>
            </div>
            <div class="info-item">
              <span class="label">期号：</span>
              <span class="value">{{ selectedPaper?.issue }}</span>
            </div>
            <div class="info-item">
              <span class="label">页码：</span>
              <span class="value">{{ selectedPaper?.pages }}</span>
            </div>
            <div class="info-item">
              <span class="label">文章编号：</span>
              <span class="value">{{ selectedPaper?.articleId }}</span>
            </div>
            <div class="info-item">
              <span class="label">DOI：</span>
              <span class="value">{{ selectedPaper?.doi }}</span>
            </div>
            <div class="info-item">
              <span class="label">ISBN/ISSN：</span>
              <span class="value">{{ selectedPaper?.isbnIssn }}</span>
            </div>
            <div class="info-item">
              <span class="label">摘要：</span>
              <span class="value">{{ selectedPaper?.abstract }}</span>
            </div>
            <div class="info-item">
              <span class="label">关键词：</span>
              <span class="value">{{ selectedPaper?.keywords.join(', ') }}</span>
            </div>
            <div class="info-item">
              <span class="label">资料附件：</span>
              <div class="docs-list">
                <span 
                  v-for="(doc, index) in selectedPaper?.documents" 
                  :key="index"
                  class="doc-item"
                  @click="viewDocument(doc)"
                >
                  📄 {{ doc.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文档查看弹窗 -->
    <div v-if="showDocumentModal" class="modal-overlay" @click="closeDocumentModal">
      <div class="modal-content document-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDocument?.name }}</h3>
          <button class="close-btn" @click="closeDocumentModal">×</button>
        </div>
        <div class="modal-body">
          <div class="document-viewer">
            <div class="document-info">
              <p><strong>文件名：</strong>{{ selectedDocument?.name }}</p>
              <p><strong>文件大小：</strong>{{ selectedDocument?.size }}</p>
              <p><strong>上传时间：</strong>{{ selectedDocument?.uploadTime }}</p>
            </div>
            <div class="document-preview">
              <div class="preview-placeholder">
                <div class="preview-icon">📄</div>
                <p>{{ selectedDocument?.name }}</p>
                <button class="download-btn" @click="downloadDocument(selectedDocument)">
                  下载文档
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传弹窗 -->
    <div v-if="showUploadModal" class="modal-overlay" @click="closeUploadModal">
      <div class="modal-content upload-modal" @click.stop>
        <div class="modal-header">
          <h3>上传论文资料</h3>
          <button class="close-btn" @click="closeUploadModal">×</button>
        </div>
        <div class="modal-body">
          <div class="upload-area">
            <div class="upload-zone" @click="triggerFileInput">
              <div class="upload-icon">📁</div>
              <p>点击选择文件或拖拽文件到此处</p>
              <p class="upload-hint">支持 PDF、DOC、DOCX、JPG、PNG 格式</p>
            </div>
            <input 
              ref="fileInput" 
              type="file" 
              multiple 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              @change="handleFileSelect"
              style="display: none"
            >
          </div>
          <div class="uploaded-files" v-if="selectedFiles.length > 0">
            <h4>已选择文件：</h4>
            <div class="file-list">
              <div 
                v-for="(file, index) in selectedFiles" 
                :key="index"
                class="file-item"
              >
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <button class="remove-file-btn" @click="removeFile(index)">×</button>
              </div>
            </div>
          </div>
          <div class="upload-actions">
            <button class="cancel-btn" @click="closeUploadModal">取消</button>
            <button class="confirm-btn" @click="confirmUpload" :disabled="selectedFiles.length === 0">
              确认上传
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const searchKeyword = ref('')
const viewMode = ref('list')
const showPaperModal = ref(false)
const showDocumentModal = ref(false)
const showUploadModal = ref(false)
const selectedPaper = ref(null)
const selectedDocument = ref(null)
const selectedFiles = ref([])
const fileInput = ref(null)

// 模拟论文数据
const papers = ref([
  {
    id: 1,
    title: '基于深度学习的智能教学系统设计与实现',
    authors: ['张三', '李四', '王五'],
    publishYear: '2024',
    publication: '计算机教育',
    volume: '15',
    issue: '3',
    pages: '45-52',
    articleId: 'CE202403001',
    doi: '10.3969/j.issn.1672-5913.2024.03.001',
    isbnIssn: 'ISSN 1672-5913',
    abstract: '本文提出了一种基于深度学习的智能教学系统，通过分析学生学习行为数据，提供个性化学习建议，有效提升了教学效果和学习体验。',
    keywords: ['深度学习', '智能教学', '个性化学习', '教育技术'],
    image: '/pic/data.png',
    documents: [
      { name: '论文全文.pdf', size: '2.1MB', uploadTime: '2024-03-10' },
      { name: '实验数据.xlsx', size: '1.5MB', uploadTime: '2024-03-12' }
    ]
  },
  {
    id: 2,
    title: '虚拟现实技术在工程教育中的应用研究',
    authors: ['赵六', '孙七', '周八'],
    publishYear: '2023',
    publication: '高等工程教育研究',
    volume: '8',
    issue: '2',
    pages: '78-85',
    articleId: 'HEER202302001',
    doi: '10.3969/j.issn.1001-4233.2023.02.001',
    isbnIssn: 'ISSN 1001-4233',
    abstract: '本研究探讨了虚拟现实技术在工程教育中的应用，通过构建VR教学环境，显著提高了学生的实践能力和学习兴趣。',
    keywords: ['虚拟现实', '工程教育', '实践教学', 'VR技术'],
    image: '/pic/data.png',
    documents: [
      { name: '论文全文.pdf', size: '1.8MB', uploadTime: '2023-02-15' },
      { name: 'VR演示视频.mp4', size: '15.2MB', uploadTime: '2023-02-18' }
    ]
  },
  {
    id: 3,
    title: '人工智能驱动的个性化学习路径推荐算法',
    authors: ['吴九', '郑十', '钱十一'],
    publishYear: '2024',
    publication: '现代教育技术',
    volume: '34',
    issue: '1',
    pages: '23-30',
    articleId: 'MET202401001',
    doi: '10.3969/j.issn.1009-8097.2024.01.001',
    isbnIssn: 'ISSN 1009-8097',
    abstract: '本文提出了一种基于人工智能的个性化学习路径推荐算法，通过分析学习者的知识状态和学习偏好，为其推荐最优的学习路径。',
    keywords: ['人工智能', '个性化学习', '推荐算法', '学习路径'],
    image: '/pic/data.png',
    documents: [
      { name: '论文全文.pdf', size: '2.3MB', uploadTime: '2024-01-08' },
      { name: '算法实现代码.zip', size: '3.1MB', uploadTime: '2024-01-10' }
    ]
  },
  {
    id: 4,
    title: '基于大数据的在线教育质量评估体系构建',
    authors: ['孙十二', '李十三'],
    publishYear: '2023',
    publication: '电化教育研究',
    volume: '44',
    issue: '6',
    pages: '67-74',
    articleId: 'EER202306001',
    doi: '10.3969/j.issn.1003-1553.2023.06.001',
    isbnIssn: 'ISSN 1003-1553',
    abstract: '本研究构建了基于大数据的在线教育质量评估体系，通过多维度数据分析，为在线教育平台提供科学的质量评估方法。',
    keywords: ['大数据', '在线教育', '质量评估', '教育评价'],
    image: '/pic/data.png',
    documents: [
      { name: '论文全文.pdf', size: '1.9MB', uploadTime: '2023-06-12' },
      { name: '评估指标体系.xlsx', size: '856KB', uploadTime: '2023-06-15' }
    ]
  },
  {
    id: 5,
    title: '混合式教学模式在计算机专业课程中的应用实践',
    authors: ['王十四', '张十五', '刘十六', '陈十七'],
    publishYear: '2024',
    publication: '计算机应用与软件',
    volume: '41',
    issue: '4',
    pages: '89-96',
    articleId: 'CAS202404001',
    doi: '10.3969/j.issn.1000-386X.2024.04.001',
    isbnIssn: 'ISSN 1000-386X',
    abstract: '本文探讨了混合式教学模式在计算机专业课程中的应用，通过线上线下相结合的方式，有效提升了教学效果和学生参与度。',
    keywords: ['混合式教学', '计算机专业', '教学模式', '教学实践'],
    image: '/pic/data.png',
    documents: [
      { name: '论文全文.pdf', size: '2.0MB', uploadTime: '2024-04-05' },
      { name: '教学案例集.docx', size: '1.2MB', uploadTime: '2024-04-08' }
    ]
  }
])

// 计算属性 - 过滤后的论文列表
const filteredPapers = computed(() => {
  let filtered = papers.value

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(paper => 
      paper.title.toLowerCase().includes(keyword) ||
      paper.authors.some(author => author.toLowerCase().includes(keyword)) ||
      paper.publication.toLowerCase().includes(keyword) ||
      paper.keywords.some(kw => kw.toLowerCase().includes(keyword)) ||
      paper.abstract.toLowerCase().includes(keyword)
    )
  }

  return filtered
})

// 方法
const viewPaper = (paper) => {
  selectedPaper.value = paper
  showPaperModal.value = true
}

const closePaperModal = () => {
  showPaperModal.value = false
  selectedPaper.value = null
}

const viewDocument = (doc) => {
  selectedDocument.value = doc
  showDocumentModal.value = true
}

const closeDocumentModal = () => {
  showDocumentModal.value = false
  selectedDocument.value = null
}

const uploadDocument = (paper) => {
  selectedPaper.value = paper
  showUploadModal.value = true
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFiles.value = []
  selectedPaper.value = null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = [...selectedFiles.value, ...files]
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const confirmUpload = () => {
  // 这里可以添加上传逻辑
  console.log('上传文件:', selectedFiles.value)
  alert('文件上传成功！')
  closeUploadModal()
}

const downloadDocument = (doc) => {
  // 这里可以添加下载逻辑
  console.log('下载文档:', doc.name)
  alert(`正在下载 ${doc.name}`)
}

const handleImageError = (event) => {
  event.target.src = '/pic/data.png'
}

onMounted(() => {
  // 组件挂载后的初始化逻辑
})
</script>

<style scoped>
.papers-container {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.search-box {
  position: relative;
  min-width: 400px;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

/* 内容区域 */
.content-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e6f1;
  background: #f8f9ff;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.view-toggle {
  display: flex;
  gap: 4px;
}

/* 列表视图 */
.list-view {
  width: 100%;
  overflow-x: auto;
}

.table-header {
  display: grid;
  grid-template-columns: 3fr 2fr 0.8fr 1.8fr 1.2fr 2fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  min-width: 1200px;
}

.table-body {
  min-height: 200px;
}

.table-row {
  display: grid;
  grid-template-columns: 3fr 2fr 0.8fr 1.8fr 1.2fr 2fr 0.8fr 0.8fr;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
  min-width: 1200px;
}

.table-row:hover {
  background: #f8fafc;
}

.col-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
}

.col-authors {
  color: #4b5563;
  font-size: 13px;
}

.col-year {
  color: #6b7280;
  font-size: 13px;
  text-align: center;
}

.col-publication {
  color: #4b5563;
  font-size: 13px;
}

.col-article-id {
  color: #4b5563;
  font-size: 12px;
  font-family: monospace;
}

/* 文档列表样式 */
.docs-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-item {
  display: inline-block;
  padding: 2px 6px;
  background: #e0f2fe;
  color: #0277bd;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-right: 4px;
  margin-bottom: 2px;
}

.doc-item:hover {
  background: #b3e5fc;
}

/* 按钮样式 */
.upload-btn-small {
  padding: 4px 8px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.upload-btn-small:hover {
  background: #059669;
}

.upload-btn-primary {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  margin-right: 8px;
}

.upload-btn-primary:hover {
  background: #059669;
}

.view-btn-small {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
}

.view-btn-small:hover {
  background: #2563eb;
}

.view-btn-primary {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.view-btn-primary:hover {
  background: #2563eb;
}

/* 卡片视图 */
.card-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  padding: 24px;
}

.paper-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.paper-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.paper-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
  margin-right: 12px;
  line-height: 1.4;
}

.publish-year {
  background: #e0f2fe;
  color: #0277bd;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.card-content {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 14px;
}

.label {
  color: #6b7280;
  min-width: 100px;
  margin-right: 8px;
}

.value {
  color: #374151;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #374151;
}

.empty-state p {
  font-size: 14px;
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
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.document-modal {
  max-width: 600px;
}

.upload-modal {
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.paper-image {
  text-align: center;
  margin-bottom: 20px;
}

.paper-image img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.paper-info {
  display: grid;
  gap: 12px;
}

.info-item {
  display: flex;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.info-item .label {
  font-weight: 500;
  color: #374151;
  min-width: 120px;
}

.info-item .value {
  color: #1f2937;
}

/* 文档查看器样式 */
.document-viewer {
  text-align: center;
}

.document-info {
  text-align: left;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.document-info p {
  margin: 8px 0;
  color: #374151;
}

.document-preview {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  background: #f9fafb;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.preview-icon {
  font-size: 48px;
}

.download-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.download-btn:hover {
  background: #2563eb;
}

/* 文件上传区域样式 */
.upload-area {
  margin-bottom: 20px;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background: #f9fafb;
}

.upload-zone:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-hint {
  color: #6b7280;
  font-size: 12px;
  margin-top: 8px;
}

.uploaded-files {
  margin-bottom: 20px;
}

.uploaded-files h4 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 14px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.file-name {
  flex: 1;
  color: #374151;
  font-size: 14px;
}

.file-size {
  color: #6b7280;
  font-size: 12px;
  margin-right: 8px;
}

.remove-file-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  background: #dc2626;
}

.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-btn {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.confirm-btn:hover:not(:disabled) {
  background: #059669;
}

.confirm-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .papers-container {
    padding: 16px;
  }
  
  .filter-row {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
    max-width: none;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .view-toggle {
    justify-content: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
    min-width: auto;
  }
  
  .table-header {
    display: none;
  }
  
  .table-row {
    display: block;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  .col-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .col-authors,
  .col-year,
  .col-publication,
  .col-article-id {
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .col-docs {
    margin-bottom: 8px;
  }
  
  .col-upload,
  .col-action {
    margin-bottom: 12px;
  }
  
  .card-view {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .card-footer {
    flex-direction: column;
    gap: 8px;
  }
  
  .modal-content {
    margin: 20px;
    max-width: calc(100vw - 40px);
  }
}
</style>
