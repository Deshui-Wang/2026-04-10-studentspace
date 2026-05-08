<template>
  <div class="ai-tools-usage-card">
    <!-- 顶部摘要状态 -->
    <div class="usage-summary-bar">
      <span class="summary-label">智能工具使用情况:</span>
      <span class="summary-value">217次/天</span>
    </div>

    <!-- 数据表格 -->
    <div class="usage-table-wrap">
      <table class="usage-table">
        <thead>
          <tr>
            <th class="text-left">技术应用</th>
            <th>使用次数</th>
            <th>成品数量</th>
            <th width="240">学术科研</th>
            <th>评估反馈</th>
            <th>数字伦理</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td class="text-left font-bold">{{ item.name }}</td>
            <td>{{ item.usageCount }}</td>
            <td>{{ item.productCount }}</td>
            <td>
              <div class="progress-cell">
                <div class="progress-bg">
                  <div class="progress-fill" :style="{ width: item.research + '%' }">
                    <span class="progress-text">{{ item.research }}%</span>
                  </div>
                </div>
              </div>
            </td>
            <td><span class="score-green">{{ item.feedback }}</span></td>
            <td><span class="score-purple">{{ item.ethics }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableData = ref([
  { name: 'AI大模型对话', usageCount: 12500, productCount: 0, research: 35, feedback: '3.2', ethics: '3.5' },
  { name: 'AI PPT', usageCount: 38, productCount: 18, research: 78, feedback: '4', ethics: '4.2' },
  { name: 'AI生图', usageCount: 52, productCount: 25, research: 72, feedback: '3.8', ethics: '4' },
  { name: 'AI生视频', usageCount: 28, productCount: 8, research: 65, feedback: '3.6', ethics: '3.8' },
  { name: '智能体', usageCount: 35, productCount: 15, research: 88, feedback: '4.4', ethics: '4.6' },
  { name: '工作流', usageCount: 42, productCount: 20, research: 82, feedback: '4.1', ethics: '4.3' },
  { name: '知识库', usageCount: 58, productCount: 32, research: 90, feedback: '4.6', ethics: '4.7' },
  { name: '数字人', usageCount: 25, productCount: 6, research: 68, feedback: '3.7', ethics: '3.9' },
  { name: '配音作品', usageCount: 33, productCount: 14, research: 75, feedback: '3.9', ethics: '4.1' },
  { name: '数字人视频', usageCount: 20, productCount: 5, research: 62, feedback: '3.5', ethics: '3.7' },
  { name: '知识图谱', usageCount: 48, productCount: 22, research: 92, feedback: '4.7', ethics: '4.8' },
  { name: '能力图谱', usageCount: 41, productCount: 19, research: 89, feedback: '4.5', ethics: '4.6' },
  { name: '生成式分析', usageCount: 36, productCount: 16, research: 86, feedback: '4.3', ethics: '4.4' }
])
</script>

<style scoped>
.ai-tools-usage-card {
  background: #fff;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
}

.usage-summary-bar {
  background: #f8fafc;
  border: 1px solid #eef2f6;
  border-radius: 8px;
  padding: 12px 20px;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.summary-label { color: #1e293b; font-weight: 600; font-size: 14px; }
.summary-value { color: #334155; font-size: 14px; }

.usage-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.usage-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.usage-table th {
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  padding: 16px 12px;
  text-align: center;
  border-bottom: 1px solid #f1f5f9;
}

.usage-table td {
  padding: 16px 12px;
  text-align: center;
  color: #475569;
  border-bottom: 1px solid #f8fafc;
}

.usage-table tr:hover td {
  background: #fcfdfe;
}

.text-left { text-align: left !important; }
.font-bold { font-weight: 700; color: #1e293b !important; }

/* 进度条样式 */
.progress-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-bg {
  width: 100%;
  height: 24px;
  background: #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  transition: width 0.6s ease-in-out;
}

.progress-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}

/* 分值颜色 */
.score-green { color: #10b981; font-weight: 800; font-size: 15px; }
.score-purple { color: #8b5cf6; font-weight: 800; font-size: 15px; }
</style>
