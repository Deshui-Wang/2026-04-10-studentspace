<template>
  <div class="todo-list-component">
    <div class="todo-header">
      <h2 class="todo-title">成长任务进度 - 当前成长缓慢，请加油！</h2>
      <div class="progress-summary">
        <span class="progress-text">已完成 {{ completedCount }}/{{ totalCount }} 项任务</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="todo-container">
      <div class="task-chain">
        <div 
          v-for="(task, index) in tasks" 
          :key="task.id"
          class="task-item"
          :class="{ 'last-task': index === tasks.length - 1 }"
        >
          <!-- 任务连接线 -->
          <div class="task-line" v-if="index < tasks.length - 1"></div>
          
          <!-- 任务节点 -->
          <div class="task-node">
            <div class="node-circle" :class="{ completed: task.completed }">
              <span v-if="task.completed" class="checkmark">✓</span>
            </div>
            <div class="node-label">{{ task.title }}</div>
          </div>

          <!-- 子任务列表 -->
          <div class="subtasks-container">
            <div 
              v-for="subtask in task.subtasks" 
              :key="subtask.id"
              class="subtask-item"
            >
              <div class="subtask-circle" :class="{ completed: subtask.completed }">
                <span v-if="subtask.completed" class="checkmark">✓</span>
              </div>
              <div class="subtask-content">
                <span class="subtask-title">{{ subtask.title }}</span>
                <span class="subtask-status" :class="{ completed: subtask.completed }">
                  {{ subtask.completed ? '已完成' : '进行中' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 任务数据
const tasks = ref([
  {
    id: 1,
    title: '基础能力提升',
    completed: true,
    subtasks: [
      { id: 11, title: '完成教学基础培训', completed: true },
      { id: 12, title: '通过教学能力测试', completed: true },
      { id: 13, title: '参与教学研讨会', completed: true },
      { id: 14, title: '提交教学反思报告', completed: false }
    ]
  },
  {
    id: 2,
    title: '专业技能发展',
    completed: true,
    subtasks: [
      { id: 21, title: '学习新技术工具', completed: true },
      { id: 22, title: '完成专业认证', completed: true },
      { id: 23, title: '参与行业交流', completed: false },
      { id: 24, title: '发表专业论文', completed: false }
    ]
  },
  {
    id: 3,
    title: 'AI智能胜任力',
    completed: false,
    subtasks: [
      { id: 31, title: '掌握AI教学工具', completed: true },
      { id: 32, title: '完成智能教学设计', completed: false },
      { id: 33, title: '参与AI教学实践', completed: false },
      { id: 34, title: '通过AI能力评估', completed: false }
    ]
  },
  {
    id: 4,
    title: '科研能力建设',
    completed: false,
    subtasks: [
      { id: 41, title: '申请科研项目', completed: false },
      { id: 42, title: '开展科研实验', completed: false },
      { id: 43, title: '撰写科研报告', completed: false },
      { id: 44, title: '申请专利或软著', completed: false }
    ]
  },
  {
    id: 5,
    title: '社会服务贡献',
    completed: false,
    subtasks: [
      { id: 51, title: '参与社会服务项目', completed: false },
      { id: 52, title: '提供专业咨询服务', completed: false },
      { id: 53, title: '参与公益活动', completed: false },
      { id: 54, title: '完成服务成果转化', completed: false }
    ]
  }
])

// 计算完成进度
const completedCount = computed(() => {
  return tasks.value.reduce((count, task) => {
    return count + task.subtasks.filter(subtask => subtask.completed).length
  }, 0)
})

const totalCount = computed(() => {
  return tasks.value.reduce((count, task) => {
    return count + task.subtasks.length
  }, 0)
})

const progressPercentage = computed(() => {
  return totalCount.value > 0 ? Math.round((completedCount.value / totalCount.value) * 100) : 0
})
</script>

<style scoped>
.todo-list-component {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.todo-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.progress-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-text {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.todo-container {
  overflow-x: auto;
  padding-bottom: 16px;
}

.task-chain {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 40px;
  min-width: max-content;
  padding: 20px 0;
}

.task-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
}

.task-line {
  position: absolute;
  top: 20px;
  left: 100%;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #8b5cf6, #e5e7eb);
  z-index: 1;
}

.task-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  z-index: 2;
  position: relative;
}

.node-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: white;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.node-circle.completed {
  background: #10b981;
  border-color: #10b981;
}

.checkmark {
  font-size: 14px;
  font-weight: 500;
}

.node-label {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  line-height: 1.4;
}

.subtasks-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.subtask-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.subtask-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.subtask-circle.completed {
  background: #10b981;
  border-color: #10b981;
}

.subtask-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.subtask-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
}

.subtask-status {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.subtask-status.completed {
  color: #10b981;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .task-chain {
    gap: 30px;
  }
  
  .task-item {
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .todo-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .progress-summary {
    width: 100%;
    justify-content: space-between;
  }
  
  .progress-bar {
    width: 150px;
  }
  
  .task-chain {
    gap: 20px;
  }
  
  .task-item {
    min-width: 160px;
  }
  
  .node-label {
    font-size: 14px;
  }
  
  .subtask-item {
    padding: 10px 12px;
  }
  
  .subtask-title {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .todo-list-component {
    padding: 16px;
  }
  
  .task-chain {
    gap: 16px;
  }
  
  .task-item {
    min-width: 140px;
  }
  
  .node-circle {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  
  .checkmark {
    font-size: 16px;
  }
  
  .node-label {
    font-size: 13px;
  }
}
</style>
