<template>
  <div class="resume-container">
    <!-- 顶部操作按钮 -->
    <div class="resume-actions">
      <button class="action-btn edit-btn" @click="handleEdit">
        <i class="icon-edit"></i>
        编辑
      </button>
      <button class="action-btn regenerate-btn" @click="handleRegenerate">
        <i class="icon-refresh"></i>
        重新生成
      </button>
      <button class="action-btn download-btn" @click="handleDownload">
        <i class="icon-download"></i>
        下载
      </button>
    </div>

    <div class="resume-header">
      <img class="avatar" src="/pic/student01.png" alt="头像" />
      <div class="info">
        <div class="name">李启明</div>
        <div class="meta">应届毕业生｜计算机科学与技术（本科）｜北京理工大学</div>
        <div class="contacts">
          <span>电话：138****1234</span>
          <span>邮箱：liqiming@example.com</span>
          <span>GitHub：github.com/liqiming</span>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">求职意向</div>
      <div class="chips">
        <span class="chip">前端开发工程师</span>
        <span class="chip">Web全栈工程师</span>
        <span class="chip">算法工程师（实习）</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">教育背景</div>
      <ul class="items">
        <li>
          <div class="row">
            <span>北京理工大学 · 计算机科学与技术（本科）</span>
            <span>2021.09 - 2025.06</span>
          </div>
          <div class="row minor">GPA：3.6/4.0 · 专业前15% · 校级一等奖学金</div>
        </li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">项目经历</div>
      <ul class="items">
        <li>
          <div class="row">
            <span>智能学习空间（前端负责人）</span>
            <span>2024.03 - 2024.12</span>
          </div>
          <div class="bullets">
            <div>负责基于 Vue 3 + Vite 的前端架构与组件设计，沉淀 20+ 可复用组件。</div>
            <div>实现数据中心、个人中心、成长中心等核心模块，性能优化后首屏时间降低 35%。</div>
            <div>接入 ECharts 完成 10+ 数据可视化图表，支持按学期筛选与响应式布局。</div>
          </div>
          <div class="tags">
            <span>Vue3</span><span>Vite</span><span>Vue Router</span><span>ECharts</span><span>Element Plus</span>
          </div>
        </li>
        <li>
          <div class="row">
            <span>校园招聘助手（全栈）</span>
            <span>2023.09 - 2023.12</span>
          </div>
          <div class="bullets">
            <div>设计职位匹配算法，实现简历要素与岗位 JD 的 TF-IDF 相似度匹配，Top-K 推荐。</div>
            <div>前端实现岗位筛选、收藏与面试日程提醒，后端提供 REST API 与鉴权。</div>
          </div>
          <div class="tags">
            <span>Node.js</span><span>Express</span><span>MongoDB</span><span>TF-IDF</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">实习与实践</div>
      <ul class="items">
        <li>
          <div class="row">
            <span>字节跳动 · 前端实习生</span>
            <span>2024.07 - 2024.09</span>
          </div>
          <div class="bullets">
            <div>参与中后台组件库优化，推动 Table 虚拟滚动与列宽自适应，渲染性能提升 40%+</div>
          </div>
        </li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">荣誉奖项</div>
      <div class="chips">
        <span class="chip">ACM省赛银奖</span>
        <span class="chip">蓝桥杯省一等奖</span>
        <span class="chip">校级一等奖学金</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">技能特长</div>
      <div class="tags">
        <span>JavaScript/TypeScript</span><span>Vue3/React</span><span>Node.js</span><span>数据结构与算法</span><span>可视化</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 按钮点击事件处理
const handleEdit = () => {
  console.log('编辑简历')
  // TODO: 实现编辑功能
}

const handleRegenerate = () => {
  console.log('重新生成简历')
  // TODO: 实现重新生成功能
}

const handleDownload = () => {
  console.log('下载简历')
  // TODO: 实现下载功能
}
</script>

<style scoped>
.resume-container { 
  max-width: 900px; 
  margin: 0 auto; 
  background: #fff; 
  border-radius: 12px; 
  box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
  padding: 32px; 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 顶部操作按钮样式 */
.resume-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.edit-btn {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.edit-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.regenerate-btn {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.regenerate-btn:hover {
  background: #bbdefb;
  border-color: #90caf9;
}

.download-btn {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.download-btn:hover {
  background: #c8e6c9;
  border-color: #a5d6a7;
}

/* 图标样式 */
.icon-edit::before { content: "✏️"; }
.icon-refresh::before { content: "🔄"; }
.icon-download::before { content: "⬇️"; }

/* 简历头部样式 */
.resume-header { 
  display: flex; 
  gap: 20px; 
  align-items: center; 
  margin-bottom: 32px; 
  padding: 20px 0;
}

.avatar { 
  width: 100px; 
  height: 100px; 
  border-radius: 16px; 
  object-fit: cover; 
  border: 3px solid #f8f9fa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
  flex: 1;
}

.name { 
  font-size: 32px; 
  font-weight: 700; 
  color: #1a1a1a; 
  letter-spacing: -0.5px;
  margin-bottom: 4px;
  text-align: left;
}

.meta { 
  color: #6c757d; 
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  text-align: left;
}

.contacts { 
  display: flex; 
  gap: 20px; 
  color: #495057; 
  font-size: 14px;
  margin-top: 4px;
}

.contacts span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 章节样式 */
.section { 
  margin-top: 28px; 
  padding: 20px 0;
  border-bottom: 1px solid #f8f9fa;
}

.section:last-child {
  border-bottom: none;
}

.section-title { 
  font-size: 20px; 
  color: #2c3e50; 
  font-weight: 600; 
  margin-bottom: 16px; 
  position: relative;
  padding-left: 12px;
  text-align: left;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

/* 标签样式 */
.chips { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 12px; 
}

.chip { 
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%); 
  color: #4a5568; 
  border: 1px solid #e2e8f0; 
  padding: 8px 16px; 
  border-radius: 20px; 
  font-size: 14px; 
  font-weight: 500;
  transition: all 0.2s ease;
}

.chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 列表项样式 */
.items { 
  list-style: none; 
  padding: 0; 
  margin: 0; 
  display: grid; 
  gap: 20px; 
}

.items li {
  padding: 20px;
  background: #fafbfc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  transition: all 0.2s ease;
}

.items li:hover {
  background: #f8f9fa;
  transform: translateX(4px);
}

.row { 
  display: flex; 
  justify-content: space-between; 
  color: #2d3748; 
  font-weight: 600;
  margin-bottom: 8px;
}

.row.minor { 
  color: #718096; 
  font-size: 14px; 
  font-weight: 400;
}

.bullets { 
  display: grid; 
  gap: 8px; 
  color: #4a5568; 
  margin-top: 12px; 
  line-height: 1.6;
}

.bullets div {
  position: relative;
  padding-left: 16px;
  text-align: left;
}

.bullets div::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.tags { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 8px; 
  color: #6b7280; 
  margin-top: 12px;
}

.tags span {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-container {
    padding: 20px;
    margin: 0 16px;
  }
  
  .resume-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .resume-header { 
    flex-direction: column; 
    text-align: center;
    gap: 16px;
  }
  
  .row { 
    flex-direction: column; 
    gap: 4px; 
  }
  
  .contacts { 
    flex-direction: column; 
    gap: 8px; 
    align-items: center;
  }
  
  .name {
    font-size: 28px;
  }
  
  .section-title {
    font-size: 18px;
  }
}
</style>


