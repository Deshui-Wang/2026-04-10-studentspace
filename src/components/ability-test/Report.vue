<template>
  <div class="report-component">
    <!-- 报告头部 -->
    <div class="report-header">
      <div class="header-content">
        <h1 class="report-title">AI智能分析报告</h1>
        <p class="report-subtitle">李启明同学 - 综合能力评估</p>
        <div class="report-meta">
          <span class="report-date">报告日期：2026年03月30日</span>
          <span class="report-type">AI智能分析报告</span>
        </div>
        <button class="suggestions-btn" @click="scrollToSuggestions">
          查看建议
        </button>
      </div>
    </div>

    <div class="report-layout">
      <!-- 左侧时间菜单 -->
      <div class="report-sidebar">
        <div class="sidebar-header">
          <h3>学生档案报告</h3>
        </div>
        <div class="report-timeline">
          <div 
            class="timeline-item" 
            :class="{ active: selectedReport === index }"
            v-for="(report, index) in reportHistory" 
            :key="index"
            @click="selectReport(index)"
          >
            <div class="timeline-date">{{ report.date }}</div>
            <div class="timeline-title">{{ report.title }}</div>
            <div class="timeline-type">{{ report.type }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧报告内容 -->
      <div class="report-main">
        <div class="report-body" v-if="!isLoading">
          <!-- 学生基本信息 -->
          <div class="report-section">
            <h2 class="section-title">一、学生基本信息</h2>
            <div class="info-table">
              <div class="info-row">
                <div class="info-label">姓名</div>
                <div class="info-value">{{ studentInfo.name }}</div>
                <div class="info-label">性别</div>
                <div class="info-value">{{ studentInfo.gender }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">专业</div>
                <div class="info-value">{{ studentInfo.major }}</div>
                <div class="info-label">年级</div>
                <div class="info-value">{{ studentInfo.grade }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">学号</div>
                <div class="info-value">{{ studentInfo.studentId }}</div>
                <div class="info-label">评估学期</div>
                <div class="info-value">{{ studentInfo.term }}</div>
              </div>
            </div>
          </div>

          <!-- 综合评价 -->
          <div class="report-section">
            <h2 class="section-title">二、综合评价</h2>
            <div class="content-text typing-text" ref="evaluationText"></div>
          </div>

          <!-- 详细分析 -->
          <div class="report-section">
            <h2 class="section-title">三、详细分析</h2>
            <div class="analysis-content">
              <div class="analysis-item" v-for="(item, index) in analysisItems" :key="index">
                <h3 class="analysis-title">{{ index + 1 }}. {{ item.title }}</h3>
                <div class="analysis-text typing-text" :ref="el => analysisTextRefs[index] = el"></div>
              </div>
            </div>
          </div>

          <!-- 总结与建议 -->
          <div class="report-section" ref="suggestionsSection">
            <h2 class="section-title">四、总结与建议</h2>
            <div class="summary-content">
              <div class="summary-item">
                <h3 class="summary-title">总结</h3>
                <div class="summary-text typing-text" :ref="el => summaryTextRef = el"></div>
              </div>
              <div class="summary-item">
                <h3 class="summary-title">发展建议</h3>
                <div class="suggestions-text typing-text" :ref="el => suggestionsTextRef = el"></div>
                
                <!-- 建议详情展开区域 -->
                <div class="suggestions-details" v-if="showSuggestionsDetails">
                  <!-- 建议1：优化班级管理 -->
                  <div class="suggestion-item">
                    <div class="suggestion-header">
                      <h4 class="suggestion-title">1. 提升团队协作与领导力</h4>
                      <button class="toggle-btn" @click="toggleSuggestion(0)">
                        {{ expandedSuggestions[0] ? '收起' : '展开' }}
                      </button>
                    </div>
                    <div class="suggestion-content" v-show="expandedSuggestions[0]">
                      <div class="learning-resources">
                        <h5 class="resources-title">学习资料：</h5>
                        <div class="resources-list">
                          <div class="resource-item" v-for="resource in suggestionResources[0].learning" :key="resource.id">
                            <div class="resource-icon">📚</div>
                            <div class="resource-info">
                              <div class="resource-name">{{ resource.name }}</div>
                              <div class="resource-desc">{{ resource.description }}</div>
                            </div>
                            <button class="resource-btn" @click="openResource(resource)">查看</button>
                          </div>
                        </div>
                      </div>
                      <div class="assist-tools">
                        <h5 class="tools-title">辅助工具：</h5>
                        <div class="tools-list">
                          <div class="tool-item" v-for="tool in suggestionResources[0].tools" :key="tool.id">
                            <div class="tool-icon">🛠️</div>
                            <div class="tool-info">
                              <div class="tool-name">{{ tool.name }}</div>
                              <div class="tool-desc">{{ tool.description }}</div>
                            </div>
                            <button class="tool-btn" @click="openTool(tool)">使用</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 建议2：拓展专业视野 -->
                  <div class="suggestion-item">
                    <div class="suggestion-header">
                      <h4 class="suggestion-title">2. 深化专业学习与前沿探索</h4>
                      <button class="toggle-btn" @click="toggleSuggestion(1)">
                        {{ expandedSuggestions[1] ? '收起' : '展开' }}
                      </button>
                    </div>
                    <div class="suggestion-content" v-show="expandedSuggestions[1]">
                      <div class="learning-resources">
                        <h5 class="resources-title">学习资料：</h5>
                        <div class="resources-list">
                          <div class="resource-item" v-for="resource in suggestionResources[1].learning" :key="resource.id">
                            <div class="resource-icon">📚</div>
                            <div class="resource-info">
                              <div class="resource-name">{{ resource.name }}</div>
                              <div class="resource-desc">{{ resource.description }}</div>
                            </div>
                            <button class="resource-btn" @click="openResource(resource)">查看</button>
                          </div>
                        </div>
                      </div>
                      <div class="assist-tools">
                        <h5 class="tools-title">辅助工具：</h5>
                        <div class="tools-list">
                          <div class="tool-item" v-for="tool in suggestionResources[1].tools" :key="tool.id">
                            <div class="tool-icon">🛠️</div>
                            <div class="tool-info">
                              <div class="tool-name">{{ tool.name }}</div>
                              <div class="tool-desc">{{ tool.description }}</div>
                            </div>
                            <button class="tool-btn" @click="openTool(tool)">使用</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 建议3：推动技术创新 -->
                  <div class="suggestion-item">
                    <div class="suggestion-header">
                      <h4 class="suggestion-title">3. 加强实践能力与创新思维</h4>
                      <button class="toggle-btn" @click="toggleSuggestion(2)">
                        {{ expandedSuggestions[2] ? '收起' : '展开' }}
                      </button>
                    </div>
                    <div class="suggestion-content" v-show="expandedSuggestions[2]">
                      <div class="learning-resources">
                        <h5 class="resources-title">学习资料：</h5>
                        <div class="resources-list">
                          <div class="resource-item" v-for="resource in suggestionResources[2].learning" :key="resource.id">
                            <div class="resource-icon">📚</div>
                            <div class="resource-info">
                              <div class="resource-name">{{ resource.name }}</div>
                              <div class="resource-desc">{{ resource.description }}</div>
                            </div>
                            <button class="resource-btn" @click="openResource(resource)">查看</button>
                          </div>
                        </div>
                      </div>
                      <div class="assist-tools">
                        <h5 class="tools-title">辅助工具：</h5>
                        <div class="tools-list">
                          <div class="tool-item" v-for="tool in suggestionResources[2].tools" :key="tool.id">
                            <div class="tool-icon">🛠️</div>
                            <div class="tool-info">
                              <div class="tool-name">{{ tool.name }}</div>
                              <div class="tool-desc">{{ tool.description }}</div>
                            </div>
                            <button class="tool-btn" @click="openTool(tool)">使用</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 生成ToDo任务链按钮 -->
                  <div class="todo-section">
                    <button class="todo-btn" @click="generateTodoChain">
                      <span class="todo-icon">📋</span>
                      生成目标路径
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div class="report-loading" v-if="isLoading">
          <div class="loading-content">
            <div class="loading-icon">📊</div>
            <h3>报告生成中...</h3>
            <p>AI正在分析数据，生成个性化报告</p>
            <div class="loading-dots">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 学生基本信息
const studentInfo = ref({
  name: '李启明',
  gender: '男',
  major: '计算机科学与技术',
  grade: '2022级',
  studentId: '2022010101',
  term: '2025-2026学年第二学期'
})

// 加载状态
const isLoading = ref(true)
const selectedReport = ref(0)

// 创建ref来存储文本元素的引用
const analysisTextRefs = ref([])
const summaryTextRef = ref(null)
const suggestionsTextRef = ref(null)
const suggestionsSection = ref(null)

// 建议详情展开状态
const showSuggestionsDetails = ref(false)
const expandedSuggestions = ref([false, false, false])

// 建议资源数据
const suggestionResources = ref([
  {
    learning: [
      {
        id: 1,
        name: '《高效能人士的七个习惯》',
        description: '培养个人领导力与时间管理能力',
        url: '#'
      },
      {
        id: 2,
        name: '《非暴力沟通》',
        description: '改善人际关系，提升沟通效率',
        url: '#'
      }
    ],
    tools: [
      {
        id: 1,
        name: 'Trello (项目协作平台)',
        description: '可视化任务管理，提升团队协作效率',
        url: '#'
      },
      {
        id: 2,
        name: 'Slack (团队沟通工具)',
        description: '高效的团队即时通讯与文件共享',
        url: '#'
      }
    ]
  },
  {
    learning: [
      {
        id: 3,
        name: '行业技术峰会/讲座',
        description: '了解最新技术动态与行业趋势',
        url: '#'
      },
      {
        id: 4,
        name: 'Coursera/edX (在线课程)',
        description: '学习顶尖大学和公司的前沿课程',
        url: '#'
      }
    ],
    tools: [
      {
        id: 3,
        name: 'GitHub (开源项目平台)',
        description: '参与真实世界的开源项目，提升编程实战能力',
        url: '#'
      },
      {
        id: 4,
        name: 'Kaggle (数据科学竞赛)',
        description: '通过竞赛实践数据分析和机器学习技能',
        url: '#'
      }
    ]
  },
  {
    learning: [
      {
        id: 5,
        name: '参加编程马拉松 (Hackathon)',
        description: '在限定时间内，将创意变为现实，锻炼快速学习和解决问题的能力',
        url: '#'
      },
      {
        id: 6,
        name: '《代码大全》',
        description: '学习软件构建的实践方法，编写高质量代码',
        url: '#'
      }
    ],
    tools: [
      {
        id: 5,
        name: 'LeetCode (编程练习平台)',
        description: '通过解决算法问题，提升编程和逻辑思维能力',
        url: '#'
      },
      {
        id: 6,
        name: '个人博客/技术社区',
        description: '分享学习心得，建立个人技术品牌',
        url: '#'
      }
    ]
  }
])

// 历史报告数据
const reportHistory = ref([
  {
    date: '2026-02-28',
    title: '学期能力评估报告',
    type: 'AI智能分析'
  },
  {
    date: '2026-02-05',
    title: '专业表现评估报告',
    type: '专项评估'
  },
  {
    date: '2026-01-20',
    title: '月度发展分析报告',
    type: '定期评估'
  }
])

// 分析项目
const analysisItems = ref([
  {
    title: '学业表现与潜力',
    content: '李启明同学在核心课程《数据结构与算法》中表现优异，取得了95分的好成绩，显示出扎实的理论基础和逻辑思维能力。在《软件工程》项目中，积极参与团队协作，展现了良好的沟通和问题解决能力。学业成绩稳定，GPA达到3.8/4.0，具备优秀的学术发展潜力。\n\n具体学业数据：\n• 核心课程成绩：《数据结构与算法》- 95分， 《计算机网络》- 92分\n• 参与项目：《校园二手交易平台》- 担任后端开发\n• 学业排名：专业前10%\n• 获奖情况：获得校级“三好学生”荣誉称号'
  },
  {
    title: '实践能力与创新思维',
    content: '该生积极参与课外实践活动，在“挑战杯”竞赛中获得省级三等奖。其项目“基于AI的校园导览系统”体现了较强的创新意识和技术应用能力。建议在未来的学习中，继续加强动手实践，将理论知识与实际应用相结合，争取在更高水平的竞赛中取得突破。'
  },
  {
    title: '综合素质与发展',
    content: '李启明同学担任班级学习委员，工作认真负责，具备良好的组织协调能力。积极参与志愿服务活动，展现了良好的社会责任感。建议在保持学业优势的同时，继续拓展个人兴趣，提升综合素质，为未来的职业发展奠定坚实基础。'
  }
])

// 打字机效果函数
const typeWriter = (element, text, speed = 30) => {
  return new Promise((resolve) => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
      } else {
        clearInterval(timer)
        resolve()
      }
    }, speed)
  })
}

// 选择报告
const selectReport = (index) => {
  selectedReport.value = index
  // 这里可以添加切换报告内容的逻辑
}

// 滚动到建议部分
const scrollToSuggestions = () => {
  if (suggestionsSection.value) {
    suggestionsSection.value.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

// 切换建议展开状态
const toggleSuggestion = (index) => {
  expandedSuggestions.value[index] = !expandedSuggestions.value[index]
}

// 打开学习资源
const openResource = (resource) => {
  console.log('打开学习资源:', resource.name)
  // 这里可以添加打开资源的逻辑
  window.open(resource.url, '_blank')
}

// 打开辅助工具
const openTool = (tool) => {
  console.log('打开辅助工具:', tool.name)
  // 这里可以添加打开工具的逻辑
  window.open(tool.url, '_blank')
}

// 生成ToDo任务链 - 触发切换到成长决策标签页
const generateTodoChain = () => {
  router.push({ name: 'GoalPath' })
}

// 逐步显示内容
const showContent = async () => {
  // 等待加载完成
  await new Promise(resolve => setTimeout(resolve, 2000))
  isLoading.value = false
  
  await nextTick()
  
  // 显示综合评价
  const evaluationElement = document.querySelector('.typing-text')
  if (evaluationElement) {
    await typeWriter(evaluationElement, '李启明同学是一名综合素质优秀的学生，在校期间表现良好。该生学习态度端正，专业基础扎实，具备较强的学习能力和发展潜力。同时，积极参与社会实践和学生工作，展现了良好的团队协作精神和责任感。')
  }
  
  // 显示各项分析
  for (let i = 0; i < analysisItems.value.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 800))
    if (analysisTextRefs.value[i]) {
      await typeWriter(analysisTextRefs.value[i], analysisItems.value[i].content)
    }
  }
  
  // 显示总结
  await new Promise(resolve => setTimeout(resolve, 800))
  if (summaryTextRef.value) {
    await typeWriter(summaryTextRef.value, '李启明同学是一位品学兼优的学生，在学业和实践方面均有出色表现，是同学们的榜样。')
  }
  
  // 显示建议
  await new Promise(resolve => setTimeout(resolve, 800))
  if (suggestionsTextRef.value) {
    await typeWriter(suggestionsTextRef.value, '1. 深化专业学习：在保持现有优势的基础上，进一步深入学习专业前沿知识，构建更完整的知识体系。\n\n2. 提升项目实战能力：积极寻找实习机会，参与真实项目开发，将所学知识应用于解决实际问题。\n\n3. 拓展国际视野：关注国际学术动态，有机会可以参与国际交流项目，提升跨文化沟通能力。\n\n希望李启明同学在未来的学习和生活中，继续努力，不断超越自我，取得更大的成就。')
  }
  
  // 显示建议详情
  await new Promise(resolve => setTimeout(resolve, 1000))
  showSuggestionsDetails.value = true
}

onMounted(() => {
  showContent()
})
</script>

<style scoped>
.report-component {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

.report-header {
  background: #fff;
  border-bottom: 2px solid #e9ecef;
  padding: 30px 40px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  position: relative;
}

.report-title {
  font-size: 28px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 8px 0;
}

.report-subtitle {
  font-size: 18px;
  color: #6c757d;
  margin: 0 0 15px 0;
  font-weight: 500;
}

.report-meta {
  display: flex;
  gap: 30px;
  font-size: 14px;
  color: #6c757d;
}

.suggestions-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.suggestions-btn:hover {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  transform: translateY(-50%) translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.suggestions-btn:active {
  transform: translateY(-50%) translateY(0);
}

.report-layout {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
}

.report-sidebar {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e9ecef;
  padding: 20px 0;
}

.sidebar-header {
  padding: 0 20px 15px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.sidebar-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.report-timeline {
  padding: 0 10px;
}

.timeline-item {
  padding: 15px 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.timeline-item:hover {
  background: #f8f9fa;
}

.timeline-item.active {
  background: #e3f2fd;
  border-left-color: #1976d2;
}

.timeline-date {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
}

.timeline-title {
  font-size: 14px;
  font-weight: 500;
  color: #212529;
  margin-bottom: 2px;
  line-height: 1.4;
}

.timeline-type {
  font-size: 12px;
  color: #6c757d;
}

.report-main {
  flex: 1;
  background: #fff;
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.report-body {
  padding: 40px;
}

.report-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
  text-align: left;
}

.info-table {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.info-row {
  display: flex;
  border-bottom: 1px solid #e9ecef;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  width: 120px;
  padding: 15px 20px;
  background: #f8f9fa;
  font-weight: 500;
  color: #495057;
  border-right: 1px solid #e9ecef;
  font-size: 14px;
}

.info-value {
  flex: 1;
  padding: 15px 20px;
  color: #212529;
  font-size: 14px;
}

.content-text, .analysis-text, .summary-text, .suggestions-text {
  line-height: 1.8;
  color: #495057;
  font-size: 15px;
  text-align: justify;
  min-height: 1.2em;
  white-space: pre-line;
}

.analysis-content {
  margin-top: 20px;
}

.analysis-item {
  margin-bottom: 30px;
}

.analysis-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 15px 0;
  padding-left: 15px;
  border-left: 4px solid #1976d2;
  text-align: left;
}

.summary-content {
  margin-top: 20px;
}

.summary-item {
  margin-bottom: 25px;
}

.summary-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0 0 10px 0;
  text-align: left;
}

/* 建议详情样式 */
.suggestions-details {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.suggestion-item {
  margin-bottom: 24px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.suggestion-title {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.toggle-btn {
  padding: 6px 12px;
  background: #e3f2fd00;
  color: #1976d2;
  border: 0px solid #1976d2;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: #1976d2;
  color: white;
}

.suggestion-content {
  margin-top: 12px;
}

.learning-resources, .assist-tools {
  margin-bottom: 16px;
}

.resources-title, .tools-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 8px 0;
  text-align: left;
}

.resources-list, .tools-list {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 8px;
}

.resource-item, .tool-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
  gap: 10px;
}

.resource-item:hover, .tool-item:hover {
  background: #e3f2fd;
  border-color: #1976d2;
}

.resource-icon, .tool-icon {
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.resource-info, .tool-info {
  flex: 1;
  min-width: 0;
}

.resource-name, .tool-name {
  font-size: 14px;
  font-weight: 500;
  color: #212529;
  margin-bottom: 2px;
}

.resource-desc, .tool-desc {
  font-size: 12px;
  color: #6c757d;
  line-height: 1.4;
}

.resource-btn, .tool-btn {
  padding: 6px 12px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.resource-btn:hover, .tool-btn:hover {
  background: #1565c0;
  transform: translateY(-1px);
}

/* ToDo任务链按钮样式 */
.todo-section {
  margin-top: 24px;
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
}

.todo-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.todo-btn:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
}

.todo-icon {
  font-size: 18px;
}

.report-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
}

.loading-content {
  text-align: center;
}

.loading-icon {
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.loading-content h3 {
  font-size: 18px;
  color: #495057;
  margin: 0 0 10px 0;
}

.loading-content p {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 20px 0;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #1976d2;
  border-radius: 50%;
  animation: loading 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loading {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .suggestions-btn {
    position: static;
    transform: none;
    margin-top: 15px;
    align-self: flex-end;
  }
  
  .report-layout {
    flex-direction: column;
  }
  
  .report-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }
  
  .report-main {
    margin: 10px;
  }
  
  .report-body {
    padding: 20px;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .info-label {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }
  
  .suggestion-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .resource-item, .tool-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .resource-btn, .tool-btn {
    align-self: flex-end;
  }
}
</style>