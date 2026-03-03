<template>
  <div class="resume-templates-container">
    <div class="page-header">
      <p class="section-description">精选专业简历模板，一键应用，快速制作完美简历</p>
    </div>

    <div class="templates-content">
      <!-- 模板分类 -->
      <div class="template-categories">
        <div class="section-header">
          <i class="el-icon-menu"></i>
          <h3>模板分类</h3>
        </div>
        <div class="category-tabs">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-tab"
            :class="{ active: selectedCategory === category.id }"
            @click="selectCategory(category.id)"
          >
            <i :class="category.icon"></i>
            <span>{{ category.name }}</span>
            <div class="template-count">{{ getTemplateCount(category.id) }}</div>
          </div>
        </div>
      </div>

      <!-- 模板筛选 -->
      <div class="template-filters">
        <div class="filter-group">
          <label>适用行业：</label>
          <el-select v-model="selectedIndustry" placeholder="选择行业" @change="filterTemplates">
            <el-option label="全部" value="" />
            <el-option label="智慧养老" value="智慧养老" />
            <el-option label="医疗康复" value="医疗康复" />
            <el-option label="健康管理" value="健康管理" />
            <el-option label="机构运营" value="机构运营" />
            <el-option label="适老设计" value="适老设计" />
            <el-option label="社会工作" value="社会工作" />
          </el-select>
        </div>
        <div class="filter-group">
          <label>模板风格：</label>
          <el-select v-model="selectedStyle" placeholder="选择风格" @change="filterTemplates">
            <el-option label="全部" value="" />
            <el-option label="经典" value="经典" />
            <el-option label="现代" value="现代" />
            <el-option label="创意" value="创意" />
            <el-option label="简约" value="简约" />
          </el-select>
        </div>
        <div class="filter-group">
          <label>排序方式：</label>
          <el-select v-model="sortBy" placeholder="排序方式" @change="filterTemplates">
            <el-option label="最新" value="newest" />
            <el-option label="最热" value="popular" />
            <el-option label="评分" value="rating" />
          </el-select>
        </div>
      </div>

      <!-- 模板列表 -->
      <div class="templates-grid">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="template-card"
          @click="selectTemplate(template)"
        >
          <div class="template-preview">
            <img :src="template.preview" :alt="template.name" />
            <div class="template-overlay">
              <el-button type="primary" size="small" @click.stop="previewTemplateAction(template)">
                <i class="el-icon-view"></i>
                预览
              </el-button>
              <el-button type="success" size="small" @click.stop="useTemplate(template)">
                <i class="el-icon-check"></i>
                使用
              </el-button>
            </div>
          </div>
          <div class="template-info">
            <div class="template-header">
              <h4>{{ template.name }}</h4>
              <div class="template-rating">
                <el-rate
                  v-model="template.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                  score-template="{value}"
                />
              </div>
            </div>
            <p class="template-description">{{ template.description }}</p>
            <div class="template-tags">
              <el-tag
                v-for="tag in template.tags"
                :key="tag"
                size="small"
                type="info"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="template-meta">
              <span class="template-category">
                <i class="el-icon-folder"></i>
                {{ getCategoryName(template.categoryId) }}
              </span>
              <span class="template-downloads">
                <i class="el-icon-download"></i>
                {{ template.downloads }}次下载
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalTemplates"
          layout="prev, pager, next, jumper"
        />
      </div>
    </div>

    <!-- 模板预览弹窗 -->
    <el-dialog
      title="模板预览"
      :visible.sync="previewVisible"
      width="80%"
      :before-close="handleClose"
    >
      <div class="template-preview-content" v-if="previewTemplate">
        <div class="preview-header">
          <h3>{{ previewTemplate.name }}</h3>
          <p>{{ previewTemplate.description }}</p>
        </div>
        <div class="preview-image">
          <img :src="previewTemplate.preview" :alt="previewTemplate.name" />
        </div>
        <div class="preview-actions">
          <el-button @click="useTemplate(previewTemplate)" type="primary" size="large">
            <i class="el-icon-check"></i>
            使用此模板
          </el-button>
          <el-button @click="downloadTemplate(previewTemplate)" type="success" size="large">
            <i class="el-icon-download"></i>
            下载模板
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 分类数据
const categories = ref([
  { id: 1, name: '经典模板', icon: 'el-icon-document', count: 12 },
  { id: 2, name: '现代模板', icon: 'el-icon-star-on', count: 8 },
  { id: 3, name: '创意模板', icon: 'el-icon-magic-stick', count: 6 },
  { id: 4, name: '简约模板', icon: 'el-icon-circle-check', count: 10 },
  { id: 5, name: '专业模板', icon: 'el-icon-user', count: 9 }
])

// 模板数据
const templates = ref([
  {
    id: 1,
    name: '经典护工简历',
    description: '简洁大方，适合一线养老护理职位，突出专业形象与爱心',
    preview: '/pic/mianshi/jianlimoban.png',
    categoryId: 1,
    industry: '医疗康复',
    style: '经典',
    tags: ['一线护理', '通用', '专业'],
    rating: 4.5,
    downloads: 1250,
    createdAt: '2024-01-01'
  },
  {
    id: 2,
    name: '智慧康养实施简历',
    description: '设计感强，适合物联网适老设备落地和系统培训行业',
    preview: '/pic/mianshi/jianlimoban.png',
    categoryId: 2,
    industry: '智慧养老',
    style: '现代',
    tags: ['科技', '物联网', '现代'],
    rating: 4.8,
    downloads: 980,
    createdAt: '2024-01-15'
  },
  {
    id: 3,
    name: '适老空间设计师简历',
    description: '色彩柔和，适合无障碍改造、适老家具设计等创意类职位',
    preview: '/pic/mianshi/jianlimoban.png',
    categoryId: 3,
    industry: '适老设计',
    style: '创意',
    tags: ['设计', '无障碍', '艺术'],
    rating: 4.6,
    downloads: 750,
    createdAt: '2024-01-20'
  },
  {
    id: 4,
    name: '社工服务清新简历',
    description: '极简设计，突出社区志愿服务与长者心理慰藉能力',
    preview: '/pic/mianshi/jianlimoban.png',
    categoryId: 4,
    industry: '社会工作',
    style: '简约',
    tags: ['简约', '社工', '极简'],
    rating: 4.3,
    downloads: 1100,
    createdAt: '2024-01-25'
  },
  {
    id: 5,
    name: '机构运营主管简历',
    description: '严谨专业，适合养老机构院牧、床位运营和后勤管理职位',
    preview: '/pic/mianshi/jianlimoban.png',
    categoryId: 5,
    industry: '机构运营',
    style: '专业',
    tags: ['运营', '管理', '专业'],
    rating: 4.7,
    downloads: 650,
    createdAt: '2024-02-01'
  },
  {
    id: 6,
    name: '慢病康养管家简历',
    description: '温馨亲切，适合在社区或个人提供全周期慢病营养指导',
    preview: '/pic/mianshi/jianlimoban.png',
    categoryId: 1,
    industry: '健康管理',
    style: '经典',
    tags: ['慢病', '营养指导', '温馨'],
    rating: 4.4,
    downloads: 420,
    createdAt: '2024-02-05'
  },
  {
    id: 7,
    name: '高级康复理疗师简历',
    description: '专业严谨，重点罗列执业资格与OT/PT康复实操经验',
    preview: '/pic/mianshi/jianlimoban.png',
    categoryId: 5,
    industry: '医疗康复',
    style: '专业',
    tags: ['理疗', '健康', '专业'],
    rating: 4.5,
    downloads: 380,
    createdAt: '2024-02-10'
  },
  {
    id: 8,
    name: '辅具健康顾问简历',
    description: '亲和力强，适合高端辅具租赁或康养保险销售顾问',
    preview: '/pic/mianshi/jianlimoban.png',
    categoryId: 2,
    industry: '健康管理',
    style: '现代',
    tags: ['辅具顾问', '市场', '亲和力'],
    rating: 4.2,
    downloads: 890,
    createdAt: '2024-02-15'
  }
])

// 筛选和分页
const selectedCategory = ref(1)
const selectedIndustry = ref('')
const selectedStyle = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const pageSize = ref(8)

// 预览相关
const previewVisible = ref(false)
const previewTemplate = ref(null)

// 计算属性
const filteredTemplates = computed(() => {
  let filtered = templates.value

  // 按分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(template => template.categoryId === selectedCategory.value)
  }

  // 按行业筛选
  if (selectedIndustry.value) {
    filtered = filtered.filter(template => template.industry === selectedIndustry.value)
  }

  // 按风格筛选
  if (selectedStyle.value) {
    filtered = filtered.filter(template => template.style === selectedStyle.value)
  }

  // 排序
  switch (sortBy.value) {
    case 'popular':
      filtered.sort((a, b) => b.downloads - a.downloads)
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
    default:
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
  }

  return filtered
})

const totalTemplates = computed(() => filteredTemplates.value.length)

// 方法
const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
}

const getTemplateCount = (categoryId) => {
  return templates.value.filter(template => template.categoryId === categoryId).length
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : '未知分类'
}

const filterTemplates = () => {
  currentPage.value = 1
}

const selectTemplate = (template) => {
  console.log('选择模板:', template)
}

const previewTemplateAction = (template) => {
  previewTemplate.value = template
  previewVisible.value = true
}

const useTemplate = (template) => {
  console.log('使用模板:', template)
  // 这里可以跳转到简历制作页面，并传入模板信息
}

const downloadTemplate = (template) => {
  console.log('下载模板:', template)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleClose = () => {
  previewVisible.value = false
  previewTemplate.value = null
}

onMounted(() => {
  console.log('简历模板页面已加载')
})
</script>

<style scoped>
.resume-templates-container {
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

.templates-content {
  display: grid;
  gap: 30px;
}

.template-categories,
.template-filters {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
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

.category-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.category-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-tab.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.category-tab i {
  font-size: 16px;
}

.category-tab span {
  font-weight: 500;
}

.template-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.category-tab.active .template-count {
  background: rgba(255, 255, 255, 0.3);
}

.template-filters {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.template-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.template-preview {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.template-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.template-card:hover .template-preview img {
  transform: scale(1.05);
}

.template-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.template-card:hover .template-overlay {
  opacity: 1;
}

.template-info {
  padding: 20px;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.template-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.template-rating {
  flex-shrink: 0;
}

.template-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.template-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.template-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #9ca3af;
}

.template-category,
.template-downloads {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.template-preview-content {
  text-align: center;
}

.preview-header {
  margin-bottom: 20px;
}

.preview-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.preview-header p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.preview-image {
  margin-bottom: 30px;
}

.preview-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-templates-container {
    padding: 16px;
  }
  
  .template-categories,
  .template-filters {
    padding: 16px;
  }
  
  .category-tabs {
    flex-direction: column;
  }
  
  .template-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .filter-group .el-select {
    width: 100%;
  }
  
  .templates-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .preview-actions .el-button {
    width: 200px;
  }
}
</style>
