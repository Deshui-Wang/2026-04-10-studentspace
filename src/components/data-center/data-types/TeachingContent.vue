<template>
  <div class="content-section">
    <div class="content-tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'workload' }"
        @click="$emit('sub-tab-change', 'workload')"
      >
        日历
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'assignments' }"
        @click="$emit('sub-tab-change', 'assignments')"
      >
        作业
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'grades' }"
        @click="$emit('sub-tab-change', 'grades')"
      >
        成绩
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'attendance' }"
        @click="$emit('sub-tab-change', 'attendance')"
      >
        出勤
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeSubTab === 'interaction' }"
        @click="$emit('sub-tab-change', 'interaction')"
      >
        课堂互动
      </div>
    </div>
    
    <!-- 内容展示区域 -->
    <div class="content-area">
      <!-- 教学数据-工作量页面 -->
      <WorkloadQuantification v-if="activeSubTab === 'workload'" />
      
      <!-- 教学数据-作业页面 -->
      <HomeworkManagement v-if="activeSubTab === 'assignments'" />

      <!-- 教学数据-成绩页面 -->
      <GradeManagement v-if="activeSubTab === 'grades'" />
      
      <!-- 教学数据-出勤页面 -->
      <Attendance v-if="activeSubTab === 'attendance'" />
      
      <!-- 教学数据-课堂互动页面 -->
      <ClassroomInteraction v-if="activeSubTab === 'interaction'" />

    </div>
  </div>
</template>

<script setup>
import WorkloadQuantification from '@/components/data-center/teaching-data/WorkloadQuantification.vue'
import HomeworkManagement from '@/components/data-center/teaching-data/HomeworkManagement.vue'
import GradeManagement from '@/components/data-center/teaching-data/GradeManagement.vue'
import Attendance from '@/components/data-center/teaching-data/Attendance.vue'
import ClassroomInteraction from '@/components/data-center/teaching-data/ClassroomInteraction.vue'

defineProps({
  activeSubTab: {
    type: String,
    default: 'workload'
  }
})

const emit = defineEmits(['sub-tab-change'])

// 处理从班级管理跳转到学生管理
const handleNavigateToStudent = (studentData) => {
  console.log('跳转到学生管理，传递的数据:', studentData)
  emit('sub-tab-change', 'students')
}

// 处理从班级管理跳转到作业管理
const handleNavigateToHomework = (homeworkData) => {
  console.log('跳转到作业管理，传递的数据:', homeworkData)
  emit('sub-tab-change', 'assignments')
}

// 处理从班级管理跳转到成绩管理
const handleNavigateToGrade = (gradeData) => {
  console.log('跳转到成绩管理，传递的数据:', gradeData)
  emit('sub-tab-change', 'grades')
}

// 处理从班级管理跳转到出勤管理
const handleNavigateToAttendance = (attendanceData) => {
  console.log('跳转到出勤管理，传递的数据:', attendanceData)
  emit('sub-tab-change', 'attendance')
}

// 处理从班级管理跳转到课堂互动
const handleNavigateToInteraction = (interactionData) => {
  console.log('跳转到课堂互动，传递的数据:', interactionData)
  emit('sub-tab-change', 'interaction')
}
</script>

<style scoped>
/* 内容区域 */
.content-section {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.content-tabs {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
}

.tab-item {
  padding: 16px 24px;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
}

.tab-item:hover {
  color: #3b82f6;
  background: #f1f5f9;
}

.tab-item.active {
  color: #3b82f6;
  background: white;
  border-bottom-color: #3b82f6;
}

.content-area {
  min-height: 600px;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-tabs {
    flex-wrap: wrap;
  }
  
  .tab-item {
    padding: 12px 16px;
    font-size: 14px;
  }
}
</style>
