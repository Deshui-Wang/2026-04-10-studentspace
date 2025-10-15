<template>
  <div class="digital-literacy-page">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="usage-stats">
        <span class="stats-text">智能工具使用情况：217次/天</span>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="data-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>技术应用</th>
            <th>使用次数</th>
            <th>成品数量</th>
            <th>学术科研</th>
            <th>评估反馈</th>
            <th>数字伦理</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in digitalLiteracyData" :key="item.technology">
            <td class="technology-name">{{ item.technology }}</td>
            <td class="usage-count">{{ item.usageCount }}</td>
            <td class="product-count">{{ item.productCount }}</td>
            <td class="academic-research">
              <div class="percentage-bar">
                <div class="percentage-fill" :style="{ width: item.academicResearch + '%' }"></div>
                <span class="percentage-text">{{ item.academicResearch }}%</span>
              </div>
            </td>
            <td class="evaluation-score">
              <div class="score-display">{{ item.evaluationScore }}</div>
            </td>
            <td class="digital-ethics">
              <div class="ethics-score">{{ item.digitalEthics }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 数字素养数据
const digitalLiteracyData = ref([
  {
    technology: 'AI大模型对话',
    usageCount: 12500,
    productCount: 0,
    academicResearch: 35,
    evaluationScore: 3.2,
    studentWorks: {
      quantity: 0,
      quality: 0,
      experience: 0
    },
    digitalEthics: 3.5
  },
  {
    technology: 'AI PPT',
    usageCount: 38,
    productCount: 18,
    academicResearch: 78,
    evaluationScore: 4.0,
    studentWorks: {
      quantity: 35,
      quality: 3.9,
      experience: 4.1
    },
    digitalEthics: 4.2
  },
  {
    technology: 'AI生图',
    usageCount: 52,
    productCount: 25,
    academicResearch: 72,
    evaluationScore: 3.8,
    studentWorks: {
      quantity: 42,
      quality: 3.7,
      experience: 3.9
    },
    digitalEthics: 4.0
  },
  {
    technology: 'AI生视频',
    usageCount: 28,
    productCount: 8,
    academicResearch: 65,
    evaluationScore: 3.6,
    studentWorks: {
      quantity: 15,
      quality: 3.5,
      experience: 3.7
    },
    digitalEthics: 3.8
  },
  {
    technology: '智能体',
    usageCount: 35,
    productCount: 15,
    academicResearch: 88,
    evaluationScore: 4.4,
    studentWorks: {
      quantity: 22,
      quality: 4.2,
      experience: 4.4
    },
    digitalEthics: 4.6
  },
  {
    technology: '工作流',
    usageCount: 42,
    productCount: 20,
    academicResearch: 82,
    evaluationScore: 4.1,
    studentWorks: {
      quantity: 30,
      quality: 4.0,
      experience: 4.2
    },
    digitalEthics: 4.3
  },
  {
    technology: '知识库',
    usageCount: 58,
    productCount: 32,
    academicResearch: 90,
    evaluationScore: 4.6,
    studentWorks: {
      quantity: 48,
      quality: 4.4,
      experience: 4.5
    },
    digitalEthics: 4.7
  },
  {
    technology: '数字人',
    usageCount: 25,
    productCount: 6,
    academicResearch: 68,
    evaluationScore: 3.7,
    studentWorks: {
      quantity: 12,
      quality: 3.6,
      experience: 3.8
    },
    digitalEthics: 3.9
  },
  {
    technology: '配音作品',
    usageCount: 33,
    productCount: 14,
    academicResearch: 75,
    evaluationScore: 3.9,
    studentWorks: {
      quantity: 18,
      quality: 3.8,
      experience: 4.0
    },
    digitalEthics: 4.1
  },
  {
    technology: '数字人视频',
    usageCount: 20,
    productCount: 5,
    academicResearch: 62,
    evaluationScore: 3.5,
    studentWorks: {
      quantity: 8,
      quality: 3.4,
      experience: 3.6
    },
    digitalEthics: 3.7
  },
  {
    technology: '知识图谱',
    usageCount: 48,
    productCount: 22,
    academicResearch: 92,
    evaluationScore: 4.7,
    studentWorks: {
      quantity: 38,
      quality: 4.5,
      experience: 4.6
    },
    digitalEthics: 4.8
  },
  {
    technology: '能力图谱',
    usageCount: 41,
    productCount: 19,
    academicResearch: 89,
    evaluationScore: 4.5,
    studentWorks: {
      quantity: 33,
      quality: 4.3,
      experience: 4.4
    },
    digitalEthics: 4.6
  },
  {
    technology: '生成式分析',
    usageCount: 36,
    productCount: 16,
    academicResearch: 86,
    evaluationScore: 4.3,
    studentWorks: {
      quantity: 26,
      quality: 4.1,
      experience: 4.3
    },
    digitalEthics: 4.4
  }
])
</script>

<style scoped>
.digital-literacy-page {
  padding: 24px;
  background: white;
  min-height: 600px;
}

/* 筛选区域 */
.filter-section {
  margin-bottom: 24px;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.usage-stats {
  display: flex;
  align-items: center;
}

.stats-text {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

/* 数据表格 */
.data-table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table thead {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.data-table th {
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  border-right: 1px solid #e2e8f0;
  text-align: center;
}

.data-table th:last-child {
  border-right: none;
}

.data-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #f3f4f6;
  border-right: 1px solid #f3f4f6;
  vertical-align: top;
}

.data-table td:last-child {
  border-right: none;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

/* 技术应用列 */
.technology-name {
  font-weight: 600;
  color: #1f2937;
  min-width: 120px;
}

/* 使用次数和成品数量 */
.usage-count,
.product-count {
  text-align: center;
  font-weight: 500;
  color: #374151;
  min-width: 80px;
}

/* 学术科研百分比条 */
.academic-research {
  min-width: 120px;
}

.percentage-bar {
  position: relative;
  background: #e5e7eb;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.percentage-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.percentage-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 评估反馈 */
.evaluation-score {
  text-align: center;
  min-width: 100px;
}

.score-display {
  font-weight: 600;
  color: #059669;
  font-size: 16px;
}


/* 数字伦理 */
.digital-ethics {
  text-align: center;
  min-width: 80px;
}

.ethics-score {
  font-weight: 600;
  color: #7c3aed;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .data-table-container {
    overflow-x: auto;
  }
  
  .data-table {
    min-width: 1000px;
  }
}

@media (max-width: 768px) {
  .digital-literacy-page {
    padding: 16px;
  }
  
  .data-table th,
  .data-table td {
    padding: 12px 8px;
    font-size: 12px;
  }
  
  .stats-text {
    font-size: 14px;
  }
}
</style>
