<template>
  <div class="profile-content-stack">
    <!-- 1. 用户核心信息大卡片 -->
    <div class="modern-card profile-main-card">
      <div class="profile-avatar-section">
        <div class="avatar-glow">
          <img src="/pic/student01.png" alt="李启明" class="main-avatar" />
        </div>
        <div class="name-badge">
          <h2 class="user-name">李启明</h2>
          <span class="user-id">学号：2023001001</span>
        </div>
        <el-button type="primary" size="medium" class="edit-profile-btn" plain>申请修改</el-button>
      </div>
      
      <div class="profile-info-grid">
        <div class="info-item">
          <span class="label">所属系别</span>
          <span class="value">人工智能与计算机科学系</span>
        </div>
        <div class="info-item">
          <span class="label">所属班级</span>
          <span class="value">人工智能 2301班</span>
        </div>
        <div class="info-item">
          <span class="label">民族 / 年龄</span>
          <span class="value">汉族 · 22岁</span>
        </div>
        <div class="info-item">
          <span class="label">户籍所在地</span>
          <span class="value">北京市朝阳区</span>
        </div>
      </div>
    </div>

    <!-- 2. 核心荣誉成就 (独立大卡片) -->
    <div class="modern-card honors-showcase-card">
      <div class="card-header">
        <div class="header-title">
          <i class="el-icon-trophy"></i>
          <h3>核心荣誉与顶尖竞赛</h3>
        </div>
        <span class="header-tag">HIGHEST HONORS</span>
      </div>
      <div class="honors-grid">
        <div class="honor-item highlight">
          <div class="honor-icon gold">👑</div>
          <div class="honor-content">
            <div class="honor-title">年度“十佳大学生”</div>
            <div class="honor-desc">全校综合素质最高荣誉 · 德智体美劳全面发展</div>
          </div>
        </div>
        <div class="honor-item">
          <div class="honor-icon silver">🏆</div>
          <div class="honor-content">
            <div class="honor-title">全国大学生数学建模竞赛 · 一等奖</div>
            <div class="honor-desc">算法建模赛项 · 国家级核心专业竞赛</div>
          </div>
        </div>
        <div class="honor-item">
          <div class="honor-icon bronze">🥇</div>
          <div class="honor-content">
            <div class="honor-title">“蓝桥杯”全国软件人才大赛 · 金奖</div>
            <div class="honor-desc">2024 全国 IT 领域顶尖赛事</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 下方详情双列布局 -->
    <div class="profile-details-row">
      <!-- 专业资质与职务 -->
      <div class="modern-card detail-card">
        <div class="card-header">
          <div class="header-title">
            <i class="el-icon-medal"></i>
            <h3>专业资质与社会职务</h3>
          </div>
        </div>
        <div class="detail-body">
          <div class="achievement-list">
            <div class="achievement-row">
              <div class="a-icon cert">📜</div>
              <div class="a-info">
                <div class="a-title">AWS 认证机器学习专家</div>
                <div class="a-meta">Amazon Web Services · 国际核心资质</div>
              </div>
            </div>
            <div class="achievement-row">
              <div class="a-icon cert">💻</div>
              <div class="a-info">
                <div class="a-title">阿里云高级架构师 (ACE)</div>
                <div class="a-meta">阿里云认证 · 云计算架构顶层能力</div>
              </div>
            </div>
            <div class="achievement-row">
              <div class="a-icon star">⭐</div>
              <div class="a-info">
                <div class="a-title">校学生会主席</div>
                <div class="a-meta">2023.09 - 2024.06 · 负责全校活动统筹</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学业表现与兴趣 -->
      <div class="modern-card detail-card">
        <div class="card-header">
          <div class="header-title">
            <i class="el-icon-notebook-2"></i>
            <h3>学业表现与个人标签</h3>
          </div>
        </div>
        <div class="detail-body">
          <div class="performance-summary">
            <div class="stat-pill">
              <span class="s-val">3.6</span>
              <span class="s-label">GPA 指数</span>
            </div>
            <div class="stat-pill">
              <span class="s-val">前 15%</span>
              <span class="s-label">综合排名</span>
            </div>
          </div>
          <div class="interest-cloud-v2">
            <span class="i-tag">深度学习</span>
            <span class="i-tag">大模型微调</span>
            <span class="i-tag">人工智能</span>
            <span class="i-tag">数据挖掘</span>
          </div>
          <div class="simple-info-list">
            <div class="info-row">
              <span class="key">在读状态</span>
              <span class="val">本科 · 大三</span>
            </div>
            <div class="info-row">
              <span class="key">辅导员</span>
              <span class="val">王元</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.profile-content-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modern-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  padding: 32px;
}

/* 1. 主卡片样式 */
.profile-main-card {
  display: flex;
  align-items: center;
  gap: 60px;
  background: linear-gradient(135deg, #ffffff 0%, #fcfdff 100%);
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 180px;
}

.avatar-glow {
  width: 130px;
  height: 130px;
  border-radius: 36px;
  padding: 2px;
  background: linear-gradient(135deg, #2b58ff, #7c3aed);
}

.main-avatar {
  width: 100%;
  height: 100%;
  border-radius: 35px;
  object-fit: cover;
  border: 2px solid white;
}

.user-name { font-size: 26px; font-weight: 800; color: #1e293b; margin: 0; }
.user-id { font-size: 13px; color: #94a3b8; font-weight: 500; }

.profile-info-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.info-item .label { font-size: 12px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; display: block; }
.info-item .value { font-size: 15px; color: #334155; font-weight: 600; }

/* 2. 荣誉成就展示 (横向大卡片) */
.honors-showcase-card {
  border-left: 6px solid #fbbf24;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-title i { font-size: 20px; color: #fbbf24; }
.header-title h3 { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0; }
.header-tag { font-size: 10px; font-weight: 800; color: #fbbf24; background: #fffbeb; padding: 4px 10px; border-radius: 20px; letter-spacing: 1px; }

.honors-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.honor-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
  transition: all 0.3s;
}

.honor-item:hover { transform: translateY(-4px); background: #f1f5f9; }
.honor-item.highlight { background: #fffbeb; border: 1px solid #fef3c7; }

.honor-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.honor-title { font-size: 14px; font-weight: 800; color: #1e293b; margin-bottom: 4px; text-align: left;}
.honor-desc { font-size: 12px; color: #64748b; line-height: 1.4; text-align: left;}

/* 3. 详情行 */
.profile-details-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.detail-card .header-title i { color: #2b58ff; }

.achievement-list { display: flex; flex-direction: column; gap: 16px; }
.achievement-row { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 12px; transition: background 0.2s; }
.achievement-row:hover { background: #f8fafc; }

.a-icon { width: 40px; height: 40px; border-radius: 10px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.a-icon.cert { background: #eef2ff; color: #4338ca; }
.a-icon.star { background: #ecfeff; color: #0891b2; }

.a-title { font-size: 14px; font-weight: 700; color: #1e293b; text-align: left; }
.a-meta { font-size: 12px; color: #64748b; text-align: left;}

.performance-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
.stat-pill { background: #f8fafc; padding: 16px; border-radius: 16px; text-align: center; }
.s-val { display: block; font-size: 20px; font-weight: 800; color: #2b58ff; }
.s-label { font-size: 11px; color: #94a3b8; font-weight: 700; }

.interest-cloud-v2 { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.i-tag { padding: 6px 12px; background: #f1f5f9; border-radius: 10px; font-size: 12px; color: #475569; font-weight: 500; }

.simple-info-list { border-top: 1px solid #f1f5f9; padding-top: 16px; }
.info-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
.info-row .key { color: #94a3b8; }
.info-row .val { color: #1e293b; font-weight: 600; }

@media (max-width: 1200px) {
  .honors-grid { grid-template-columns: 1fr; }
  .profile-details-row { grid-template-columns: 1fr; }
}
</style>