<template>
  <div class="resume-container">
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
</script>

<style scoped>
.resume-container { max-width: 900px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 24px; }
.resume-header { display: flex; gap: 16px; align-items: center; margin-bottom: 12px; }
.avatar { width: 88px; height: 88px; border-radius: 12px; object-fit: cover; }
.info { display: flex; flex-direction: column; gap: 6px; }
.name { font-size: 28px; font-weight: 700; color: #333; }
.meta { color: #667085; }
.contacts { display: flex; gap: 16px; color: #445066; font-size: 14px; }
.section { margin-top: 18px; }
.section-title { font-size: 18px; color: #333; font-weight: 600; margin-bottom: 10px; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip { background: #f5f7ff; color: #475569; border: 1px solid #e3e8f4; padding: 6px 12px; border-radius: 3px; font-size: 13px; }
.items { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.row { display: flex; justify-content: space-between; color: #374151; }
.row.minor { color: #667085; font-size: 14px; }
.bullets { display: grid; gap: 6px; color: #4b5563; margin-top: 8px; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; color: #6b7280; }
@media (max-width: 768px) {
  .row { flex-direction: column; gap: 4px; }
  .contacts { flex-direction: column; gap: 6px; }
}
</style>


