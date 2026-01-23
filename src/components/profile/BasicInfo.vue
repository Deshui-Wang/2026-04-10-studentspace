<template>
  <div class="stack">
    <div class="page-header">
      <div class="section-header">个人信息</div>
      <button class="edit-btn">申请编辑</button>
    </div>
    
    <div class="section-card">
      <div class="summary-card">
        <div class="avatar-wrap">
          <img class="avatar-img" src="/pic/student01.png" alt="头像" />
        </div>
        <div class="summary-info">
          <div class="name">李启明</div>
          <div class="meta">
            <span>民族：汉族</span>
            <span>年龄：22</span>
            <span>身份证：110106200307070011</span>
          </div>
          <div class="meta">
            <span>户籍：北京市朝阳区</span>
            <span>就读院校：北京劳动保障职业学院</span>
          </div>
          <div class="meta">
            <span>系别：智慧健康养老服务与管理专业</span>
            <span>班级：智慧康养 01班</span>
          </div>
        </div>
      </div>
    </div>

    <div class="two-col">
      <div class="col-left">
        <div class="section-header">学籍信息</div>
        <div class="section-card">
          <h2 class="section-title">在读状态</h2>
          <div class="chips">
            <span class="chip">专科·大三</span>
            <span class="chip">学号：2023001001</span>
            <span class="chip">辅导员：王元</span>
          </div>
          <div class="divider"></div>
          <div class="block">
            <div class="block-title">联系方式</div>
            <div class="chips">
              <span class="chip">电话：138****1234</span>
              <span class="chip">邮箱：liqiming@example.com</span>
            </div>
          </div>
        </div>

        <div class="section-card">
          <h2 class="section-title">兴趣方向</h2>
          <div class="chips">
            <span class="chip type-1">社会服务</span>
            <span class="chip type-2">养护看护</span>
            <span class="chip type-3">人工智能</span>
            <span class="chip type-4">健康理疗</span>
          </div>
        </div>
      </div>

      <div class="col-right">
      </div>
    </div>
    <div class="two-col">
      <div class="col-left">
        <div class="section-header">校园情况</div>
        <div class="section-card">
          <h2 class="section-title">校内成绩与表现</h2>
          <div class="chips">
            <span class="chip type-2">GPA：3.6/4.0</span>
            <span class="chip type-2">成绩排名：前15%</span>
            <span class="chip type-4">奖学金：校级一等奖学金</span>
            <span class="chip type-3">竞赛：个护赛银奖</span>
          </div>
        </div>
      </div>

      <div class="col-right">
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.stack { 
  display: grid; gap: 16px; 
  color: #333;
  padding: 24px;
  font-family: 'Poppins', sans-serif;
  margin: auto;
  width: 100%;
  max-width: 1440px;
  display: flex;
  flex-direction: column;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

/* 章节标题 */
.section-header {
  font-size: 24px;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 0;
  text-align: left;
}

/* 编辑按钮 */
.edit-btn {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
}

.edit-btn:hover {
  background: #0958d9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
}

.edit-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(22, 119, 255, 0.3);
}

/* 框样式 */
.section-card { 
  background: #fff; 
  padding: 24px; 
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 顶部概要卡片 */
.summary-card {
  display: grid;
  grid-template-columns: 160px 1fr;
  align-items: start;
  gap: 30px;
  background: transparent;
  border-radius: 12px;
  padding: 0px;
}
.avatar-wrap { width: 160px; height: 160px; border-radius: 50%; overflow: hidden; background: #f5f7fb; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.summary-info .name { font-size: 32px; font-weight: 700; color: #333; display: flex;}
.summary-info .meta { display: flex; gap: 18px; margin-top: 20px; color: #667085; font-size: 14px; }
.title-badge { color: #1677ff; font-weight: 600; }

/* 两列主体 */
.two-col { display: grid; grid-template-columns: 1fr 0fr; gap: 16px; }
.col-left, .col-right { display: grid; gap: 16px; }

.section-title { margin: 0 0 20px 0; font-size: 16px; color: #333; font-weight: 600; display: flex;}
.desc { margin: 0; color: #555; line-height: 1.8; display: flex;}
.divider { height: 0px; background: #eef0f5; margin: 34px 0; }
.block { }
.block-title { color: #333; font-weight: 600; margin-bottom: 20px;  display: flex;}
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip { background: #f5f7ff; color: #475569; border: 1px solid #e3e8f4; padding: 6px 12px; border-radius: 3px; font-size: 13px; }
.chip.type-1 { background: #eef6ff; border-color: #d6e6ff; }
.chip.type-2 { background: #eefaf4; border-color: #d3f0e0; }
.chip.type-3 { background: #f6efff; border-color: #eadcff; }
.chip.type-4 { background: #eef6ff; border-color: #d6e6ff; }

@media (max-width: 1100px) {
  .two-col { grid-template-columns: 1fr; }
}
</style> 