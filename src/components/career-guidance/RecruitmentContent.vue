<template>
  <div class="career-section-container">
    <!-- 头部标题与描述 -->
    <div class="section-header">
      <h2 class="section-title">招聘信息</h2>
      <p class="section-subtitle">聚焦互联网前沿职位，助力学子高起点就业，当前提供超过 <span>10000+</span> 优质岗位</p>
    </div>

    <!-- 搜索与筛选栏 -->
    <div class="filter-bar">
      <el-input 
        placeholder="搜索职位、公司或关键词..." 
        v-model="searchQuery" 
        class="search-input"
        prefix-icon="el-icon-search"
      ></el-input>
      <el-select v-model="filters.type" placeholder="岗位类型" class="filter-select">
        <el-option label="全职" value="full-time"></el-option>
        <el-option label="实习" value="internship"></el-option>
      </el-select>
      <el-select v-model="filters.salary" placeholder="薪资范围" class="filter-select">
        <el-option label="20k-40k" value="20-40"></el-option>
        <el-option label="40k-60k" value="40-60"></el-option>
        <el-option label="60k以上" value="60+"></el-option>
      </el-select>
      <el-select v-model="filters.industry" placeholder="行业" class="filter-select">
        <el-option label="人工智能" value="ai"></el-option>
        <el-option label="云计算" value="cloud"></el-option>
        <el-option label="金融科技" value="fintech"></el-option>
      </el-select>
      <el-select v-model="filters.area" placeholder="地区" class="filter-select">
        <el-option label="北京" value="beijing"></el-option>
        <el-option label="上海" value="shanghai"></el-option>
        <el-option label="深圳" value="shenzhen"></el-option>
      </el-select>
    </div>

    <!-- 职位列表 -->
    <div class="job-list">
      <div v-for="job in jobs" :key="job.id" class="job-card">
        <div class="job-card-header">
          <h3 class="job-title">{{ job.title }}</h3>
          <span class="job-salary">{{ job.salary }}</span>
        </div>
        
        <div class="company-info">
          <div class="company-brand">
            <div class="brand-icon" :style="{background: job.brandColor}">
              <i :class="job.icon"></i>
            </div>
            <span class="company-name">{{ job.company }}</span>
          </div>
          <span class="area-tag">{{ job.area }}</span>
        </div>

        <div class="job-desc">
          {{ job.description }}
        </div>

        <div class="job-card-footer">
          <span class="post-time">{{ job.time }}</span>
          <div class="footer-right">
            <div class="job-tags">
              <span v-for="tag in job.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <el-button type="primary" class="apply-btn">立即投递</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const filters = ref({
  type: '',
  salary: '',
  industry: '',
  area: ''
})

const jobs = [
  {
    id: 1,
    title: '高级产品经理 (AI 智能助手方向)',
    salary: '45-75K',
    company: '百度 (Baidu)',
    icon: 'el-icon-cpu',
    brandColor: '#2b58ff',
    area: '北京',
    description: '负责大模型 Agent 产品的全生命周期管理，定义下一代 AI 智能助手的交互逻辑。深度参与模型评估与调优，推动多模态能力在移动端的场景落地，引领 AI 原生应用创新。',
    time: '2小时前',
    tags: ['大模型', 'Agent', '产品规划', '16薪']
  },
  {
    id: 2,
    title: '全栈开发工程师 (大规模架构)',
    salary: '40-65K',
    company: '字节跳动 (ByteDance)',
    icon: 'el-icon-connection',
    brandColor: '#363636',
    area: '北京/上海',
    description: '参与全球级短视频平台的核心中台建设，负责高并发、低延迟系统架构设计。涉及分布式系统开发、容器化部署及全链路压测，支撑亿级 DAU 流量高峰。',
    time: '1天前',
    tags: ['Go/Python', 'React', '分布式系统', '期权激励']
  },
  {
    id: 3,
    title: '资深 UI/UX 设计专家',
    salary: '35-60K',
    company: '腾讯 (Tencent)',
    icon: 'el-icon-brush',
    brandColor: '#0052d9',
    area: '深圳',
    description: '负责腾讯视频/社交产品的全链路体验升级。通过数据驱动设计决策，定义产品的视觉调性与动效规范。具备深厚的设计美学功底与复杂业务场景的逻辑抽象能力。',
    time: '刚刚',
    tags: ['体验设计', '品牌定义', '动效逻辑', '双月评优']
  },
  {
    id: 4,
    title: '高级大数据分析架构师',
    salary: '50-85K',
    company: '阿里巴巴 (Alibaba)',
    icon: 'el-icon-data-analysis',
    brandColor: '#ff6a00',
    area: '杭州',
    description: '主导集团电商核心业务的实时数仓构建。利用 Flink/Spark 等前沿技术实现海量流数据处理，挖掘用户行为背后的商业价值，为双 11 级别的促销活动提供数据决策大脑。',
    time: '3天前',
    tags: ['数仓建模', '实时计算', '算法驱动', '股票分红']
  },
  {
    id: 5,
    title: '智能硬件产品专家',
    salary: '35-55K',
    company: '小米 (Xiaomi)',
    icon: 'el-icon-monitor',
    brandColor: '#ff6700',
    area: '北京',
    description: '负责米家智能生态链的新品定义。通过深入的用户调研，打磨“人车家全生态”的硬件交互闭环，定义软硬件一体化的极致体验，打造千万级销量的爆款产品。',
    time: '2天前',
    tags: ['硬件定义', '生态链', '供应链管理', '餐补/房补']
  }
]
</script>

<style scoped>
.career-section-container {
  padding: 32px 48px;
  background: #f8f9fb;
  min-height: 100%;
}

/* 头部样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.section-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.section-subtitle span {
  color: #2b58ff;
  font-weight: 700;
}

/* 筛选栏样式 */
.filter-bar {
  background: white;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}

.search-input { flex: 2; }
.filter-select { flex: 1; }

/* 职位列表样式 */
.job-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.job-card {
  background: white;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(43, 88, 255, 0.08);
  border-color: #2b58ff22;
}

.job-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.job-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.job-salary {
  font-size: 22px;
  font-weight: 800;
  color: #ef4444;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.company-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.company-name {
  font-size: 15px;
  color: #475569;
  font-weight: 700;
}

.area-tag {
  font-size: 12px;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 2px 10px;
  border-radius: 6px;
}

.job-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.job-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.post-time {
  font-size: 12px;
  color: #cbd5e1;
}

.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.job-tags {
  display: flex;
  gap: 10px;
}

.tag {
  font-size: 12px;
  color: #2b58ff;
  background: #eff6ff;
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 500;
}

.apply-btn {
  padding: 0 32px;
  height: 36px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  background: linear-gradient(135deg, #2b58ff, #1a41cc);
  border: none;
  box-shadow: 0 4px 12px rgba(43, 88, 255, 0.2);
}

.apply-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(43, 88, 255, 0.3);
}

/* 覆盖 Element Plus 样式 */
:deep(.el-input__inner) { border-radius: 10px; }
:deep(.el-select .el-input__inner) { border-radius: 10px; }
</style>
