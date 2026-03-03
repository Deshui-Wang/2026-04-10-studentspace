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
        </div>
        <div class="job-description">{{ job.description }}</div>
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
  { label: '养老护理', value: 'nursing' },
  { label: '健康管理', value: 'health' },
  { label: '康复理疗', value: 'rehabilitation' },
  { label: '智慧康养督导', value: 'smart_care' },
  { label: '社工服务', value: 'social_work' },
  { label: '机构运营', value: 'operation' },
  { label: '适老化改造', value: 'aging_design' },
  { label: '心理慰藉', value: 'psychology' },
  { label: '医疗器械销售', value: 'sales' },
  { label: '养老顾问', value: 'consultant' }
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
  { label: '连锁养老机构', value: 'nursing_home' },
  { label: '社区综合服务', value: 'community' },
  { label: '智慧康养科技', value: 'technology' },
  { label: '医疗康复中心', value: 'medical' },
  { label: '健康管理咨询', value: 'health_mgm' },
  { label: '辅具器械制造', value: 'manufacturing' },
  { label: '养老金融/保险', value: 'finance' },
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
    title: '高级养老护理专员',
    company: '泰康之家',
    companyLogo: '/pic/logo.ico',
    salary: '8-12K',
    salaryRange: '5-15',
    location: '深圳',
    locationValue: 'shenzhen',
    industry: '连锁养老机构',
    industryValue: 'nursing_home',
    position: '养老护理',
    positionValue: 'nursing',
    description: '负责长者的日常生活照料、基础康复训练以及慢病监测。需要持有国家承认的养老护理员中高级证书，具备处理突发急救以及认知症长者沟通的能力，提供有温度的高品质服务。',
    tags: ['高级护理员', '认知症照护', '急救', '包吃住'],
    publishTime: '2天前'
  },
  {
    id: 2,
    title: '智慧康养系统实施督导',
    company: '深信服智慧医疗',
    companyLogo: '/pic/logo.ico',
    salary: '12-20K',
    salaryRange: '10-25',
    location: '北京',
    locationValue: 'beijing',
    industry: '智慧康养科技',
    industryValue: 'technology',
    position: '智慧康养督导',
    positionValue: 'smart_care',
    description: '负责各大养老区智能物联网硬件（如防跌倒雷达、智能床垫、定位胸牌）的落地与实施；跟进护理人员的系统培训，分析平台数据并协调优化警报逻辑结构等。',
    tags: ['物联网', '数据分析', '适老设备', '项目实施'],
    publishTime: '1天前'
  },
  {
    id: 3,
    title: '康复理疗师',
    company: '椿萱茂康养社区',
    companyLogo: '/pic/logo.ico',
    salary: '10-15K',
    salaryRange: '10-15',
    location: '杭州',
    locationValue: 'hangzhou',
    industry: '医疗康复中心',
    industryValue: 'medical',
    position: '康复理疗',
    positionValue: 'rehabilitation',
    description: '负责对入组长者进行专业的身体机能（如ADL量表）综合评估，制定并执行针对性的偏瘫康复、关节活动度和肌力提升的训练方案，具备康复治疗士及以上证书。',
    tags: ['康复评估', 'PT/OT治疗', '肌力评估', '理疗师'],
    publishTime: '3天前'
  },
  {
    id: 4,
    title: '健康管理师',
    company: '平安健康',
    companyLogo: '/pic/logo.ico',
    salary: '9-14K',
    salaryRange: '5-15',
    location: '上海',
    locationValue: 'shanghai',
    industry: '健康管理咨询',
    industryValue: 'health_mgm',
    position: '健康管理',
    positionValue: 'health',
    description: '依托公司云平台为签约老年客户提供一对一的慢性病建档、饮食营养搭配及服药指导。分析长者体检报告数据并制定连续性健康干预计划，具备三级以上健康管理师证。',
    tags: ['慢病管理', '营养搭配', '健康档案', '档案解读'],
    publishTime: '1天前'
  },
  {
    id: 5,
    title: '养老社区运营专员',
    company: '九如城集团',
    companyLogo: '/pic/logo.ico',
    salary: '7-11K',
    salaryRange: '5-10',
    location: '成都',
    locationValue: 'chengdu',
    industry: '社区综合服务',
    industryValue: 'community',
    position: '机构运营',
    positionValue: 'operation',
    description: '统筹社区日间照料中心的各项文娱活动策划与推进（如长者手工课、唱歌课等），协助对接街道并落实居家的家政或护理派单任务，需具备较好的沟通及抗压能力。',
    tags: ['社群运营', '长者文娱', '街道对接', '社区资源'],
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
  justify-content: space-between;
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
  text-align: left;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-left: auto;
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
