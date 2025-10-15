<template>
  <div class="home-page-container">
    <!-- 欢迎信息区域（学生版） -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1 class="welcome-title">李启明同学，你好！</h1>
        <div class="date-info">
          <span class="date">{{ currentDate }}</span>
          <span class="weekday">{{ currentWeekday }}</span>
          <span class="weather">{{ weatherInfo }}</span>
        </div>
      </div>
    </div>

    <!-- 轮播图和快捷方式区域 -->
    <div class="hero-section">
      <!-- 左侧轮播图区域 (1/3) -->
      <div class="carousel-section">
        <div class="carousel-container">
          <div class="carousel-wrapper" :style="{ transform: 'translateX(-' + (currentSlide * 100) + '%)' }">
            <div 
              v-for="(banner, index) in bannerImages" 
              :key="index" 
              class="carousel-slide"
            >
              <img :src="banner.src" :alt="banner.alt" class="banner-image" />
            </div>
          </div>

          <!-- 轮播指示器 -->
          <div class="carousel-indicators">
            <button 
              v-for="(banner, index) in bannerImages" 
              :key="index"
              :class="['indicator', { active: currentSlide === index }]"
              @click="goToSlide(index)"
            ></button>
          </div>
          
          <!-- 轮播控制按钮 -->
          <button class="carousel-btn prev" @click="prevSlide">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-btn next" @click="nextSlide">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- 右侧：人文关怀卡片（2/3） -->
      <div class="quick-access-section">
        <div class="quick-access-right">
          <div class="events-list">
            <div class="event-item birthday">
              <div class="event-avatar">
                <img src="/pic/tea/66.jpg" alt="李明艳老师" class="avatar-image" />
              </div>
              <div class="event-content">
                <span class="event-name">祝李明艳老师生日快乐</span>
              </div>
            </div>
            <div class="event-item birthday">
              <div class="event-avatar">
                <img src="/pic/stu/student04.png" alt="吴越同学" class="avatar-image" />
              </div>
              <div class="event-content">
                <span class="event-name">祝吴越粤同学生日快乐</span>
              </div>
            </div>
            <div class="event-item achievement">
              <div class="event-avatar">
                <img src="/pic/stu/student05.png" alt="晋熙同学" class="avatar-image" />
              </div>
              <div class="event-content">
                <span class="event-name">恭喜李晋熙荣获2025年优秀社团团长</span>
              </div>
            </div>
          </div>

          <!-- 今日运势（巨蟹座）：移动到人文关怀两个卡片下面 -->
          <div class="horoscope-card">
            <div class="horoscope-header">
              <span class="sign">♋ 巨蟹座</span>
              <span class="label">今日运势</span>
            </div>
            <div class="horoscope-content">
              <div class="horoscope-grid">
                <div class="horoscope-item">
                  <span class="item-label">综合：</span>
                  <span class="item-text">{{ cancerHoroscope.overall.text }}</span>
                  <span class="item-rating">{{ '★'.repeat(cancerHoroscope.overall.stars) }}{{ '☆'.repeat(5 - cancerHoroscope.overall.stars) }}</span>
                </div>
                <div class="horoscope-item">
                  <span class="item-label">学业：</span>
                  <span class="item-text">{{ cancerHoroscope.career }}</span>
                </div>
                <div class="horoscope-item">
                  <span class="item-label">人际：</span>
                  <span class="item-text">{{ cancerHoroscope.love }}</span>
                </div>
                <div class="horoscope-item">
                  <span class="item-label">财运：</span>
                  <span class="item-text">{{ cancerHoroscope.wealth }}</span>
                </div>
                <div class="horoscope-item small">
                  <span class="item-label">幸运色：</span>
                  <span class="item-text">{{ cancerHoroscope.luckyColor }}</span>
                </div>
                <div class="horoscope-item small">
                  <span class="item-label">幸运数：</span>
                  <span class="item-text">{{ cancerHoroscope.luckyNumber }}</span>
                </div>
              </div>
              <div class="horoscope-advice">{{ cancerHoroscope.advice }}</div>
            </div>
            <div class="horoscope-footer">
              <button class="refresh-btn" @click="refreshHoroscope">换一换</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 重要事件提醒（位置保留，内容替换为应用快捷 + 运势） -->
    <div class="events-section">
      <h2 class="section-title">快捷应用：</h2>
      <div class="quick-access-right">
        <div class="quick-apps">
          <div class="app-shortcut" v-for="app in quickApps" :key="app.id" @click="openApp(app)" :style="getAppCardStyle(app)">
            <span class="app-name">{{ app.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习仪表盘（学生） -->
    <div class="work-section">
      <h2 class="section-title">学习仪表盘</h2>
      <div class="work-categories">
        <!-- 学习进度 -->
        <div class="work-category">
          <h3 class="category-title">课程学习进度</h3>
          <div class="work-items">
            <div class="work-item" v-for="progress in studyProgress" :key="progress.id">
              <div class="work-metric progress-metric">{{ progress.completed }}%</div>
              <span class="work-name">{{ progress.course }}</span>
            </div>
          </div>
        </div>

        <!-- 考试分数推送 -->
        <div class="work-category">
          <h3 class="category-title">考试分数推送</h3>
          <div class="work-items">
            <div class="work-item" v-for="exam in examScores" :key="exam.id">
              <div class="work-metric score-metric">{{ exam.score }}分</div>
              <span class="work-name">{{ exam.course }}</span>
            </div>
          </div>
        </div>

        <!-- 作业推送 -->
        <div class="work-category">
          <h3 class="category-title">作业推送</h3>
          <div class="work-items">
            <div class="work-item" v-for="hw in homeworkPush" :key="hw.id">
              <div class="work-metric deadline-metric">{{ hw.due }}</div>
              <span class="work-name">{{ hw.title }}</span>
            </div>
          </div>
        </div>

        <!-- 评价推送 -->
        <div class="work-category">
          <h3 class="category-title">评价推送</h3>
          <div class="work-items">
            <div class="work-item" v-for="ev in evaluationPush" :key="ev.id">
              <div class="work-metric status-metric" :class="ev.status === '已发布' ? 'status-completed' : 'status-pending'">{{ ev.status }}</div>
              <span class="work-name">{{ ev.title }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 知识点抽查区域 -->
    <div class="knowledge-section">
      <h2 class="section-title">知识点抽查</h2>
      <div class="knowledge-content">
        <div class="knowledge-check">
          <div class="knowledge-item" v-for="kp in knowledgePoints" :key="kp.id">
            <div class="kp-title">{{ kp.title }}</div>
            <div class="kp-desc">{{ kp.desc }}</div>
            <div class="kp-tags">
              <span class="kp-tag" v-for="tag in kp.tags" :key="tag">#{{ tag }}</span>
            </div>
          </div>
          <div class="knowledge-actions">
            <button class="refresh-btn" @click="refreshKnowledge">换一组</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// 当前日期信息（学生版问候 + 日期/星期/天气）
const currentDate = ref('')
const currentWeekday = ref('')
const weatherInfo = ref('☀️ 晴')

// 巨蟹座今日运势（模拟生成 - 详细）
const cancerHoroscope = ref({
  overall: { text: '', stars: 4 },
  love: '', // 人际/情感
  career: '', // 学业/事业
  wealth: '',
  luckyColor: '',
  luckyNumber: 6,
  advice: ''
})

const horoscopeDict = {
  overall: [
    { text: '状态稳定，节奏均衡，适合推进长期计划。', stars: 4 },
    { text: '灵感活跃，效率走高，抓紧时间完成待办。', stars: 5 },
    { text: '稍有分心，合理切片任务能稳步前进。', stars: 3 },
    { text: '与人协作顺畅，团队产出可期。', stars: 4 },
    { text: '适合复盘与整理，打牢基础更重要。', stars: 4 }
  ],
  love: [
    '沟通顺畅，表达更自然，易获得支持。',
    '保持耐心倾听，能化解一些误会。',
    '适合结伴学习，互相成就。',
    '与同学的关系更融洽，氛围积极。'
  ],
  career: [
    '专注力在线，适合攻克难题与巩固薄弱点。',
    '安排有序，效率可观，进度条上升。',
    '适合做阶段性总结，形成笔记沉淀。',
    '讨论能带来启发，多向优秀同学学习。'
  ],
  wealth: [
    '理性消费，避免情绪性购买。',
    '小有偏财，注意记录收支。',
    '适合制定月度预算，培养财务意识。'
  ],
  colors: ['淡紫色', '天蓝色', '薄荷绿', '暖灰色', '柠檬黄'],
  numbers: [3, 6, 8, 9]
}

const pickOne = (arr) => arr[Math.floor(Math.random() * arr.length)]
const generateCancerHoroscope = () => {
  cancerHoroscope.value = {
    overall: pickOne(horoscopeDict.overall),
    love: pickOne(horoscopeDict.love),
    career: pickOne(horoscopeDict.career),
    wealth: pickOne(horoscopeDict.wealth),
    luckyColor: pickOne(horoscopeDict.colors),
    luckyNumber: pickOne(horoscopeDict.numbers),
    advice: pickOne([
      '把复杂任务拆成番茄钟小片段，循序渐进。',
      '先完成容易获胜的小目标，积累信心。',
      '复盘今天的关键收获，用清单固化。',
      '主动提问与讨论，往往能少走弯路。'
    ])
  }
}
const refreshHoroscope = () => generateCancerHoroscope()

// 学习仪表盘数据（模拟）
const studyProgress = ref([
  { id: 1, course: '高等数学', completed: 72 },
  { id: 2, course: '线性代数', completed: 45 },
  { id: 3, course: '大学英语', completed: 88 },
])

const examScores = ref([
  { id: 1, course: '高等数学阶段测', score: 86 },
  { id: 2, course: '大学英语随堂测', score: 92 },
])

const homeworkPush = ref([
  { id: 1, title: '线性代数 第3章作业', due: '10-18' },
  { id: 2, title: '高等数学 第5周作业', due: '10-20' },
])

const evaluationPush = ref([
  { id: 1, title: '课堂表现评价（高数）', status: '已发布' },
  { id: 2, title: '小组协作互评（英语）', status: '待完成' },
])

// 轮播图相关
const currentSlide = ref(0)
const autoPlayTimer = ref(null)

// 轮播图片数据
const bannerImages = ref([
  {
    src: '/pic/home/banner02.jpeg',
    alt: '重要通知 - 稿定集团12月人事任命'
  },
  {
    src: '/pic/home/banner01.png', 
    alt: '缓解抑郁 - 消极情绪如何应对'
  },
  {
    src: '/pic/home/banner03.jpeg',
    alt: '直播回顾 - 鸿蒙全新发布会'
  }
])

// 快捷应用
  const quickApps = ref([
    { id: 1, name: 'AI生图', icon: 'fas fa-table', color: '#8b5cf6', image: '/pic/home/shengtu.jpg' },
    { id: 2, name: 'AI文档', icon: 'fas fa-building', color: '#3b82f6', image: '/pic/home/wendang.jpeg' },
    { id: 3, name: 'AI ppt', icon: 'fas fa-bullseye', color: '#f59e0b', image: '/pic/home/ppt.jpg' },
    { id: 4, name: 'AI智能问答', icon: 'fas fa-robot', color: '#10b981', image: '/pic/home/wenda.png' }
  ])

// 知识点抽查（模拟）
const knowledgePoints = ref([])
const knowledgePool = [
  { title: '导数定义与几何意义', desc: '理解极限形式与切线斜率关系。', tags: ['高数', '极限', '导数'] },
  { title: '矩阵秩与线性相关性', desc: '会判断列向量线性无关与秩关系。', tags: ['线代', '矩阵', '秩'] },
  { title: '英语时态：现在完成时', desc: '掌握 have/has + 过去分词 的用法。', tags: ['英语', '语法', '时态'] },
  { title: '概率分布：正态分布', desc: '了解参数含义与标准化思想。', tags: ['概率论', '分布', '正态'] },
  { title: '二项式定理', desc: '能够展开 (a+b)^n 并理解系数来源。', tags: ['代数', '组合'] },
  { title: '听力技巧：抓关键词', desc: '先捕捉数字、时间、地点等关键信息。', tags: ['英语', '听力'] },
  { title: '微积分基本定理', desc: '掌握导数与积分之间的互逆关系。', tags: ['高数', '微积分', '定理'] },
]
const generateKnowledge = () => {
  const shuffled = [...knowledgePool].sort(() => Math.random() - 0.5)
  knowledgePoints.value = shuffled.slice(0, 5).map((kp, idx) => ({ id: idx + 1, ...kp }))
}
const refreshKnowledge = () => generateKnowledge()

// 获取当前日期信息
const getCurrentDateInfo = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  
  // 格式化日期
  currentDate.value = `${year}年${month}月${date}日`
  
  // 获取星期
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentWeekday.value = weekdays[now.getDay()]
  
  // 天气：如果配置了天气服务，就请求；否则使用模拟
  const apiBase = import.meta.env.VITE_WEATHER_API_BASE
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY
  const city = import.meta.env.VITE_WEATHER_CITY || '广州'
  if (apiBase && apiKey) {
    const url = `${apiBase}?city=${encodeURIComponent(city)}&key=${encodeURIComponent(apiKey)}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // 兼容不同返回结构，尽量取到天气文本
        const text = data?.now?.text || data?.weather || data?.data?.weather || '晴'
        const icon = '☀️'
        weatherInfo.value = `${icon} ${text}`
      })
      .catch(() => {
        const weathers = ['☀️ 晴', '⛅ 多云', '🌧️ 小雨', '❄️ 雪']
        weatherInfo.value = weathers[Math.floor(Math.random() * weathers.length)]
      })
  } else {
    const weathers = ['☀️ 晴', '⛅ 多云', '🌧️ 小雨', '❄️ 雪']
    weatherInfo.value = weathers[Math.floor(Math.random() * weathers.length)]
  }
}

// 轮播图控制函数
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % bannerImages.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? bannerImages.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// 自动播放
const startAutoPlay = () => {
  autoPlayTimer.value = setInterval(nextSlide, 4000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
}

// 打开应用
const openApp = (app) => {
  console.log('打开应用:', app.name)
  
  // 根据应用ID打开对应的链接或页面
  switch (app.id) {
    case 1: // AI生图
      window.open('https://agent.lhrj.cn/workshop', '_blank')
      break
    case 2: // AI文档
      window.open('https://zlaigc.cailian.net/#/agent_square', '_blank')
      break
    case 3: // AI ppt
      window.open('https://agent.lhrj.cn/aippt', '_blank')
      break
    case 4: // AI智能问答
      // 打开TchAI.vue页面，需要根据路由配置调整
      const currentUrl = window.location.origin + window.location.pathname
      const tchAIUrl = `${currentUrl}#/tch-ai`
      window.open(tchAIUrl, '_blank')
      break
    default:
      console.log('未知应用:', app.name)
  }
}

// 添加快捷方式
const addShortcut = () => {
  console.log('添加快捷方式')
  // 这里可以添加添加快捷方式的逻辑
}

onMounted(() => {
  getCurrentDateInfo()
  // 启动自动播放
  startAutoPlay()
  generateCancerHoroscope()
  generateKnowledge()
})

onBeforeUnmount(() => { 
  // 清理定时器
  stopAutoPlay()
})

// 快捷应用卡片背景样式
const getAppCardStyle = (app) => {
  const imageUrl = app?.image || ''
  return {
    background: imageUrl
      ? `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), url(${imageUrl}) center/cover no-repeat`
      : 'white',
    color: '#fff'
  }
}
</script>

<style scoped>
.home-page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 欢迎信息区域 */
.welcome-section {
  margin: 30px 30px 0 30px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.welcome-content {
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.welcome-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.date-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  color: #666;
}

.date {
  font-weight: 600;
  color: #8b5cf6;
}

.weekday {
  font-weight: 500;
}

.weather {
  font-size: 20px;
}

/* 重要事件提醒 */
.events-section {
  padding: 10px 24px 0px 24px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0 0 16px 0;
  text-align: left;
}

.events-list {
  display: flex;
  flex-direction:  row;
  gap: 12px;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #f59e0b;
  transition: all 0.3s ease;
}

.event-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.event-item.achievement {
  border-left-color: #10b981;
}

.event-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid #f3f4f6;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-icon {
  font-size: 24px;
}

.event-content {
  flex: 1;
}

.event-name {
  font-size: 16px;
  color: #374151;
  font-weight: 500;
}

/* 今日工作内容 */
.work-section {
  padding: 24px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* 知识点抽查区域 */
.knowledge-section {
  padding: 24px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.knowledge-content {
  margin-top: 16px;
}

.work-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.work-category {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #8b5cf6;
}

.work-items {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.work-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: #f8f9ff;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.work-item:hover {
  background: #f0f4ff;
  transform: translateX(4px);
}

.work-icon {
  font-size: 20px;
}

/* 新的指标样式 */
.work-metric {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 32px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  padding: 4px 8px;
}

.progress-metric {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.score-metric {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.deadline-metric {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
  font-size: 12px;
  min-width: 60px;
}

.status-metric {
  font-size: 12px;
  min-width: 70px;
}

.status-completed {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.status-pending {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.work-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

/* 内容区域样式 */
.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* 轮播图和快捷方式区域样式 */
.hero-section {
  display: flex;
  align-items: stretch;
  gap: 12px;
  margin: 12px 24px 0 24px;
  padding: 0;
}

/* 左侧轮播图区域 (1/3) */
.carousel-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 轮播图样式 */
.carousel-container {
  width: 100%;
  height: 100%;
  min-height: 120px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.carousel-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.carousel-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.carousel-btn.prev {
  left: 8px;
}

.carousel-btn.next {
  right: 8px;
}

/* 右侧应用快捷方式区域 (2/3) */
.quick-access-section {
  flex: 2;
  display: flex;
  align-items: center;
}

.quick-access-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.quick-apps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;
  height: 100%;
  min-height: 50px;
}

.app-shortcut, .add-shortcut {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 80px;
  opacity: 0.92;
}

.app-shortcut:hover, .add-shortcut:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: #e5e7eb;
  opacity: 1;
}

.app-icon, .add-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  position: relative;
  overflow: hidden;
}

.app-image {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.add-icon {
  background: #f3f4f6;
  color: #6b7280;
}

.app-name, .add-text {
  font-size: 13px;
  color: #374151;
  text-align: center;
  font-weight: 500;
  line-height: 1.3;
}

.add-text {
  color: #6b7280;
}

.app-shortcut .app-name {
  font-size: 22px;
  color: #6841ea;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(239,182,13, 0.6);
}

/* 今日运势卡片 */
.horoscope-card {
  margin-top: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  padding: 16px;
}

.horoscope-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.horoscope-header .sign {
  font-weight: 600;
  color: #8b5cf6;
}

.horoscope-header .label {
  font-size: 12px;
  color: #6b7280;
}

.horoscope-content {
  text-align: left;
  color: #374151;
  font-size: 14px;
}

.horoscope-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
}

.horoscope-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.horoscope-item.small {
  font-size: 13px;
  color: #6b7280;
}

.item-label {
  min-width: 52px;
  color: #6b7280;
}

.item-text {
  flex: 1;
}

.item-rating {
  color: #f59e0b;
  white-space: nowrap;
}

.horoscope-advice {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e5e7eb;
  color: #4b5563;
}

.horoscope-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.refresh-btn {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
}

.refresh-btn:hover {
  background: #e5e7eb;
}


/* 应用网格 */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
}

/* 知识点抽查 */
.knowledge-check {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.knowledge-item {
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #10b981;
  text-align: left;
}

.kp-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.kp-desc {
  margin-top: 6px;
  font-size: 14px;
  color: #374151;
}

.kp-tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.kp-tag {
  font-size: 12px;
  color: #065f46;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 999px;
  padding: 2px 8px;
}

.knowledge-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
}

.app-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.app-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.app-card .app-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  font-size: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid #f6f7f9;
  background: transparent;
}

.app-card .app-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: none;
}

.app-card .app-name {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  line-height: 1.3;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    gap: 24px;
  }
  
  .carousel-section {
    flex: none;
    max-width: 100%;
  }
  
  .carousel-container {
    width: 100%;
    max-width: 500px;
    height: 200px;
  }
  
  .carousel-slide {
    width: 100%;
    height: 200px;
  }
  
  .quick-access-section {
    max-width: 100%;
  }
  
  .quick-apps {
    grid-template-columns: repeat(3, 1fr);
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .welcome-section,
  .events-section,
  .work-section,
  .knowledge-section {
    padding: 16px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .date-info {
    flex-direction: column;
    gap: 8px;
    font-size: 16px;
  }
  
  .work-categories {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .workplace-container {
    padding: 16px;
  }
  
  .carousel-container {
    height: 150px;
  }
  
  .carousel-slide {
    height: 150px;
  }
  
  .quick-apps {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    min-height: auto;
  }
  
  .app-shortcut, .add-shortcut {
    padding: 20px 10px;
    height: auto;
    min-height: 70px;
    opacity: 0.95;
  }
  
  .app-icon, .add-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .app-image {
    width: 20px;
    height: 20px;
  }
  
  .app-name, .add-text {
    font-size: 12px;
  }
  
  .apps-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  .app-shortcut .app-name {
    font-size: 14px;
  }
  
  .event-avatar {
    width: 40px;
    height: 40px;
  }
  
  .event-name {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .quick-apps {
    grid-template-columns: 1fr;
  }
  
  .carousel-container {
    height: 120px;
  }
  
  .carousel-slide {
    height: 120px;
  }
  
  .apps-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  
  .app-card {
    padding: 16px 12px;
  }
  
  .app-card .app-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .app-card .app-image {
    width: 24px;
    height: 24px;
  }
  
  .app-card .app-name {
    font-size: 12px;
  }
  
  .event-avatar {
    width: 36px;
    height: 36px;
  }
  
  .event-name {
    font-size: 13px;
  }
}
</style>
