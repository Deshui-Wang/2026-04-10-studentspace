<template>
  <div class="report-component">
    <!-- 报告头部 -->
    <div class="report-header">
      <div class="header-content">
        <h1 class="report-title">AI智能分析报告</h1>
        <p class="report-subtitle">李启明副教授 - 教学能力评估</p>
        <div class="report-meta">
          <span class="report-date">报告日期：2025年9月25日</span>
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
          <h3>历史报告</h3>
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
          <!-- 教师基本信息 -->
          <div class="report-section">
            <h2 class="section-title">一、教师基本信息</h2>
            <div class="info-table">
              <div class="info-row">
                <div class="info-label">姓名</div>
                <div class="info-value">{{ teacherInfo.name }}</div>
                <div class="info-label">性别</div>
                <div class="info-value">{{ teacherInfo.gender }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">年龄</div>
                <div class="info-value">{{ teacherInfo.age }}岁</div>
                <div class="info-label">学历</div>
                <div class="info-value">{{ teacherInfo.education }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">职称</div>
                <div class="info-value">{{ teacherInfo.title }}</div>
                <div class="info-label">教龄</div>
                <div class="info-value">{{ teacherInfo.experience }}年</div>
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
                      <h4 class="suggestion-title">1. 优化班级管理</h4>
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
                      <h4 class="suggestion-title">2. 拓展专业视野</h4>
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
                      <h4 class="suggestion-title">3. 推动技术创新</h4>
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
                      生成ToDo任务链
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

// 教师基本信息
const teacherInfo = ref({
  name: '李启明',
  gender: '男',
  age: 38,
  education: '硕士学位',
  title: '副教授',
  experience: 16
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
        name: '《班级管理艺术》',
        description: '系统介绍班级管理的方法和技巧',
        url: '#'
      },
      {
        id: 2,
        name: '《学生心理辅导指南》',
        description: '了解学生心理，提升沟通效果',
        url: '#'
      }
    ],
    tools: [
      {
        id: 1,
        name: '班级管理系统',
        description: '数字化班级管理工具',
        url: '#'
      },
      {
        id: 2,
        name: '学生档案管理',
        description: '学生信息跟踪和分析',
        url: '#'
      }
    ]
  },
  {
    learning: [
      {
        id: 3,
        name: '《教育前沿技术》',
        description: '了解最新教育技术发展趋势',
        url: '#'
      },
      {
        id: 4,
        name: '《产学研合作实践》',
        description: '校企合作模式与案例分析',
        url: '#'
      }
    ],
    tools: [
      {
        id: 3,
        name: '学术会议平台',
        description: '参与学术交流的在线平台',
        url: '#'
      },
      {
        id: 4,
        name: '企业合作对接',
        description: '校企合作项目对接工具',
        url: '#'
      }
    ]
  },
  {
    learning: [
      {
        id: 5,
        name: '《AI教育应用实践》',
        description: '人工智能在教育中的创新应用',
        url: '#'
      },
      {
        id: 6,
        name: '《教学工具开发指南》',
        description: '从使用者到创造者的转变',
        url: '#'
      }
    ],
    tools: [
      {
        id: 5,
        name: 'AI工具开发平台',
        description: '低代码AI工具开发环境',
        url: '#'
      },
      {
        id: 6,
        name: '知识分享平台',
        description: '教师经验分享和传播平台',
        url: '#'
      }
    ]
  }
])

// 历史报告数据
const reportHistory = ref([
  {
    date: '2025-09-25',
    title: '教学能力综合评估',
    type: 'AI智能分析'
  },
  {
    date: '2025-06-15',
    title: '学期教学总结报告',
    type: '定期评估'
  },
  {
    date: '2025-03-20',
    title: '专业发展能力分析',
    type: '专项评估'
  },
  {
    date: '2024-12-10',
    title: '课程建设成效评估',
    type: '项目评估'
  },
  {
    date: '2024-09-01',
    title: '年度教学工作总结',
    type: '年度报告'
  },
  {
    date: '2024-06-15',
    title: '学生满意度调研报告',
    type: '调研分析'
  }
])

// 分析项目
const analysisItems = ref([
  {
    title: '教学能力与效果',
    content: '张老师承担了繁重的教学任务，本学期共承担了4门核心课程的教学工作，总计周课时16节，负责6个班级共180名学生的教学工作。日常投入度很高，展现了高度的责任心。在其指导下，所带班级学生学业成绩稳定，通过率达到89%，这反映了其教学的基础扎实，能够保证学生掌握和理解知识。\n\n具体教学工作量统计：\n• 主修课程：《数据结构与算法》- 4个班级，120名学生\n• 主修课程：《软件工程》- 2个班级，60名学生\n• 周课时安排：周一至周五，平均每天3.2课时\n• 学生指导：承担15名本科生的毕业设计指导工作\n• 教学评价：学生满意度评分4.2/5.0，同行评价优秀'
  },
  {
    title: '教学注重因材施教',
    content: '值得注意的是，分析中反映出班级内存在学业困难及学习态度欠佳的学生群体。建议张老师在后续教学中，进一步加强对这部分学生的个别关注和沟通，探索学习动机的成因，采取更有针对性的辅导策略，以实现全体学生的共同进步，进一步提升教学效果的全面性。'
  },
  {
    title: '专业发展与学习能力',
    content: '张老师具备扎实的专业理论基础，为适应人工智能技术的快速发展，持续进行实践性学习。例如，积极参与高水平学术会议、投入前沿技术研究项目，进行教学方法的实践探索。这将有助于接触新的行业动态和实际应用，拓展教师视野。'
  },
  {
    title: '技术应用与研究创新',
    content: '张老师在日常工作中积极运用各类AI功能工具，体现了在专业高度上的良好示范作用。本学期AI工具使用情况统计：\n\nAI工具使用情况：\n• 智能批改系统：累计批改作业1,200份，效率提升60%\n• 个性化学习推荐：为180名学生生成个性化学习路径\n• 智能答疑助手：处理学生问题450次，准确率92%\n• 课程内容生成：使用AI辅助生成教学案例15个\n\nAI工具开发成果：\n• 自主研发"智能编程评测系统"，已申请软件著作权\n• 开发"学生行为分析工具"，帮助识别学习困难学生\n• 参与校级AI教学平台建设，贡献核心算法模块\n\nAI应用分享情况：\n• 校内培训：组织AI工具使用培训3次，覆盖教师45人次\n• 学术交流：在"智能教育技术研讨会"做主题报告\n• 经验分享：撰写AI教学应用案例2篇，被同行引用\n\n学生AI工具使用情况：\n• 学生使用AI辅助编程工具：使用率85%，代码质量提升明显\n• 智能学习助手：学生平均每周使用12次，学习效率提升30%\n• AI作业辅导：学生满意度4.5/5.0，问题解决及时率95%'
  },
  {
    title: '课程研发与团队贡献',
    content: '张老师积极参与课程研发工作，表现突出，在团队中成功率高，效率高，对专业和课程建设做出了积极贡献。其研发能力是宝贵资源，应充分认可和发挥。'
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
  console.log('生成ToDo任务链 - 切换到成长决策')
  // 触发自定义事件，通知父组件切换到成长决策标签页
  window.dispatchEvent(new CustomEvent('switch-to-decision'))
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
    await typeWriter(evaluationElement, '张老师作为一位拥有16年丰富教学经验的骨干教师，专业能力强，实践经验丰富，态度认真，在教学和教研工作中表现出良好的职业素养。其工作认真负责，踏实肯干，在课程建设方面投入较多，在团队中贡献突出，作用明显。同时，在个人发展方面还有提升空间，具备一定的发展潜力。')
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
    await typeWriter(summaryTextRef.value, '张老师是一位教学经验丰富、认真负责的可靠教师，是教育团队中的中坚力量。')
  }
  
  // 显示建议
  await new Promise(resolve => setTimeout(resolve, 800))
  if (suggestionsTextRef.value) {
    await typeWriter(suggestionsTextRef.value, '1. 优化班级管理：建立更有效的机制，关注和帮助困难学生，促进班级整体学业水平提升。\n\n2. 拓展专业视野：加强与高校、企业的实践合作，了解行业知识，提升教学。\n\n3. 推动技术创新：从工具使用者向"创造者"和"引领者"转变，增强个人技术实践成果的分享。\n\n希望张老师在未来的工作中，继续发挥优势，在专业深度和教学创新上不断探索，取得更多成就。')
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
