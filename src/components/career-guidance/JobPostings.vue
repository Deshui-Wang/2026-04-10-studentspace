<template>
  <div class="job-postings-container">
    <div class="page-header">
      <h2 class="section-title">招聘信息</h2>
      <p class="section-description">本校与多家企业合作，并提供 超过「10000+」职位信息</p>
    </div>

    <div class="search-filters">
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索职位、公司或关键词..."
          prefix-icon="el-icon-search"
          clearable
          @input="handleSearch"
        />
      </div>
      <div class="filter-dropdowns">
        <el-select
          v-model="selectedPosition"
          placeholder="岗位类型"
          clearable
          @change="handleFilterChange"
          class="filter-select"
        >
          <el-option
            v-for="position in positionOptions"
            :key="position.value"
            :label="position.label"
            :value="position.value"
          />
        </el-select>
        
        <el-select
          v-model="selectedSalary"
          placeholder="薪资范围"
          clearable
          @change="handleFilterChange"
          class="filter-select"
        >
          <el-option
            v-for="salary in salaryOptions"
            :key="salary.value"
            :label="salary.label"
            :value="salary.value"
          />
        </el-select>
        
        <el-select
          v-model="selectedIndustry"
          placeholder="行业"
          clearable
          @change="handleFilterChange"
          class="filter-select"
        >
          <el-option
            v-for="industry in industryOptions"
            :key="industry.value"
            :label="industry.label"
            :value="industry.value"
          />
        </el-select>
        
        <el-select
          v-model="selectedLocation"
          placeholder="地区"
          clearable
          @change="handleFilterChange"
          class="filter-select"
        >
          <el-option
            v-for="location in locationOptions"
            :key="location.value"
            :label="location.label"
            :value="location.value"
          />
        </el-select>
      </div>
    </div>

    <div class="job-list">
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        class="job-card"
        @click="viewJobDetails(job)"
      >
        <div class="job-header">
          <div class="job-title">{{ job.title }}</div>
          <div class="job-salary">{{ job.salary }}</div>
        </div>
        <div class="job-company">
          <img :src="job.companyLogo" :alt="job.company" class="company-logo" />
          <span class="company-name">{{ job.company }}</span>
          <el-tag size="small" type="info">{{ job.location }}</el-tag>
        </div>
        <div class="job-description">{{ job.description }}</div>
        <div class="job-tags">
          <el-tag
            v-for="tag in job.tags"
            :key="tag"
            size="small"
            class="job-tag"
          >
            {{ tag }}
          </el-tag>
        </div>
        <div class="job-footer">
          <span class="publish-time">{{ job.publishTime }}</span>
          <el-button type="primary" size="small" @click.stop="applyJob(job)">
            立即投递
          </el-button>
        </div>
      </div>
    </div>

    <div v-if="filteredJobs.length === 0" class="no-results">
      <i class="el-icon-search"></i>
      <p>暂无相关职位信息</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 搜索关键词
const searchKeyword = ref('')

// 筛选条件
const selectedPosition = ref('')
const selectedSalary = ref('')
const selectedIndustry = ref('')
const selectedLocation = ref('')

// 下拉选择选项
const positionOptions = ref([
  { label: '前端开发', value: 'frontend' },
  { label: '后端开发', value: 'backend' },
  { label: '全栈开发', value: 'fullstack' },
  { label: 'UI/UX设计', value: 'design' },
  { label: '产品经理', value: 'product' },
  { label: '数据分析', value: 'data' },
  { label: '运营', value: 'operation' },
  { label: '销售', value: 'sales' },
  { label: '市场', value: 'marketing' },
  { label: '人事', value: 'hr' },
  { label: '财务', value: 'finance' }
])

const salaryOptions = ref([
  { label: '5K以下', value: '0-5' },
  { label: '5-10K', value: '5-10' },
  { label: '10-15K', value: '10-15' },
  { label: '15-25K', value: '15-25' },
  { label: '25-35K', value: '25-35' },
  { label: '35K以上', value: '35+' }
])

const industryOptions = ref([
  { label: '互联网', value: 'internet' },
  { label: '金融', value: 'finance' },
  { label: '教育', value: 'education' },
  { label: '医疗', value: 'medical' },
  { label: '制造业', value: 'manufacturing' },
  { label: '房地产', value: 'real-estate' },
  { label: '零售', value: 'retail' },
  { label: '其他', value: 'other' }
])

const locationOptions = ref([
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '深圳', value: 'shenzhen' },
  { label: '广州', value: 'guangzhou' },
  { label: '杭州', value: 'hangzhou' },
  { label: '成都', value: 'chengdu' },
  { label: '武汉', value: 'wuhan' },
  { label: '西安', value: 'xian' }
])

// 模拟职位数据
const jobs = ref([
  {
    id: 1,
    title: '前端开发工程师',
    company: '腾讯科技',
    companyLogo: '/pic/logo.ico',
    salary: '15-25K',
    salaryRange: '15-25',
    location: '深圳',
    locationValue: 'shenzhen',
    industry: '互联网',
    industryValue: 'internet',
    position: '前端开发',
    positionValue: 'frontend',
    description: '负责公司前端产品的开发与维护，参与产品需求分析和技术方案设计...',
    tags: ['Vue.js', 'React', 'JavaScript', 'HTML5'],
    publishTime: '2天前'
  },
  {
    id: 2,
    title: '产品经理',
    company: '字节跳动',
    companyLogo: '/pic/logo.ico',
    salary: '20-35K',
    salaryRange: '25-35',
    location: '北京',
    locationValue: 'beijing',
    industry: '互联网',
    industryValue: 'internet',
    position: '产品经理',
    positionValue: 'product',
    description: '负责产品规划、需求分析、用户体验设计，协调开发团队完成产品迭代...',
    tags: ['产品设计', '用户研究', '数据分析', '项目管理'],
    publishTime: '1天前'
  },
  {
    id: 3,
    title: 'UI设计师',
    company: '阿里巴巴',
    companyLogo: '/pic/logo.ico',
    salary: '12-20K',
    salaryRange: '10-15',
    location: '杭州',
    locationValue: 'hangzhou',
    industry: '互联网',
    industryValue: 'internet',
    position: 'UI/UX设计',
    positionValue: 'design',
    description: '负责移动端和Web端界面设计，参与产品视觉规范制定...',
    tags: ['UI设计', 'Sketch', 'Figma', 'Photoshop'],
    publishTime: '3天前'
  },
  {
    id: 4,
    title: '金融分析师',
    company: '招商银行',
    companyLogo: '/pic/logo.ico',
    salary: '18-30K',
    salaryRange: '15-25',
    location: '上海',
    locationValue: 'shanghai',
    industry: '金融',
    industryValue: 'finance',
    position: '数据分析',
    positionValue: 'data',
    description: '负责金融市场分析、风险评估和投资建议，参与金融产品设计...',
    tags: ['金融分析', '风险评估', '投资', 'CFA'],
    publishTime: '1天前'
  },
  {
    id: 5,
    title: '教育产品经理',
    company: '新东方',
    companyLogo: '/pic/logo.ico',
    salary: '15-25K',
    salaryRange: '15-25',
    location: '北京',
    locationValue: 'beijing',
    industry: '教育',
    industryValue: 'education',
    position: '产品经理',
    positionValue: 'product',
    description: '负责在线教育产品的规划与设计，分析用户需求，制定产品策略...',
    tags: ['教育', '产品设计', '在线教育', '用户研究'],
    publishTime: '2天前'
  }
])

// 筛选后的职位列表
const filteredJobs = computed(() => {
  let result = jobs.value

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(job => 
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.description.toLowerCase().includes(keyword) ||
      job.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  // 按岗位类型筛选
  if (selectedPosition.value) {
    result = result.filter(job => job.positionValue === selectedPosition.value)
  }

  // 按薪资范围筛选
  if (selectedSalary.value) {
    result = result.filter(job => {
      const jobSalary = job.salaryRange
      const selectedRange = selectedSalary.value
      
      if (selectedRange === '35+') {
        return parseInt(jobSalary.split('-')[0]) >= 35
      } else if (selectedRange === '0-5') {
        return parseInt(jobSalary.split('-')[1]) <= 5
      } else {
        const [min, max] = selectedRange.split('-').map(Number)
        const [jobMin, jobMax] = jobSalary.split('-').map(Number)
        return jobMin >= min && jobMax <= max
      }
    })
  }

  // 按行业筛选
  if (selectedIndustry.value) {
    result = result.filter(job => job.industryValue === selectedIndustry.value)
  }

  // 按地区筛选
  if (selectedLocation.value) {
    result = result.filter(job => job.locationValue === selectedLocation.value)
  }

  return result
})

// 搜索处理
const handleSearch = () => {
  console.log('搜索关键词:', searchKeyword.value)
}

// 筛选条件变化处理
const handleFilterChange = () => {
  console.log('筛选条件变化:', {
    position: selectedPosition.value,
    salary: selectedSalary.value,
    industry: selectedIndustry.value,
    location: selectedLocation.value
  })
}

// 查看职位详情
const viewJobDetails = (job) => {
  console.log('查看职位详情:', job)
  // 这里可以跳转到职位详情页面或打开详情弹窗
}

// 投递简历
const applyJob = (job) => {
  console.log('投递职位:', job)
  // 这里可以打开投递简历的弹窗或跳转到投递页面
}

onMounted(() => {
  console.log('招聘信息页面已加载')
})
</script>

<style scoped>
.job-postings-container {
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
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

.search-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  align-items: center;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 200px;
}

.filter-dropdowns {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select {
  min-width: 120px;
  width: 140px;
}

.job-list {
  display: grid;
  gap: 20px;
}

.job-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.job-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.job-salary {
  font-size: 16px;
  font-weight: 600;
  color: #f5576c;
}

.job-company {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.company-logo {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.company-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.job-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.job-tag {
  font-size: 12px;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.publish-time {
  font-size: 12px;
  color: #9ca3af;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.no-results i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .job-postings-container {
    padding: 16px;
  }
  
  .search-filters {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .search-bar {
    min-width: auto;
  }
  
  .filter-dropdowns {
    flex-direction: column;
    gap: 8px;
  }
  
  .filter-select {
    min-width: auto;
    width: 100%;
  }
  
  .job-card {
    padding: 16px;
  }
  
  .job-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .job-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
</style>
