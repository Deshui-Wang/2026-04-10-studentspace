<template>
  <div class="attendance-page">
    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>学期：</label>
          <el-select 
            v-model="filters.semester" 
            placeholder="全部学期" 
            clearable 
            @change="handleFilterChange"
            class="semester-select"
          >
            <el-option label="全部学期" value="" />
            <el-option v-for="semester in semesterList" :key="semester" :label="semester" :value="semester" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>学科：</label>
          <el-select 
            v-model="filters.subject" 
            placeholder="全部学科" 
            clearable 
            @change="handleFilterChange"
            class="subject-select"
          >
            <el-option label="全部学科" value="" />
            <el-option v-for="subject in subjectList" :key="subject" :label="subject" :value="subject" />
          </el-select>
        </div>
        
        <div class="filter-group">
          <label>课程：</label>
          <el-select 
            v-model="filters.course" 
            placeholder="全部课程" 
            clearable 
            @change="handleFilterChange"
            class="course-select"
          >
            <el-option label="全部课程" value="" />
            <el-option v-for="course in courseList" :key="course" :label="course" :value="course" />
          </el-select>
        </div>
        
        <div class="filter-group">
        </div>
      </div>
    </div>

    <!-- 数据列表 -->
    <div class="table-section">
      <el-table 
        :data="paginatedAttendance" 
        style="width: 100%"
        :default-sort="{ prop: 'classTime', order: 'descending' }"
        :header-cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        :cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        border
        stripe
      >
        <el-table-column prop="semester" label="学期" align="center" />
        <el-table-column prop="subject" label="学科" align="center" />
        <el-table-column prop="course" label="课程" align="center" />
        <el-table-column prop="classTime" label="上课时间" align="center" />
        <el-table-column prop="signInTime" label="签到时间" align="center" />
        <el-table-column prop="attendanceStatus" label="出勤状态" align="center">
          <template #default="{ row }">
            <el-tag :type="getAttendanceStatusType(row.attendanceStatus)">
              {{ row.attendanceStatus }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 15, 20, 50, 100]"
          :total="filteredAttendance.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 出勤详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      title="出勤详情"
      width="600px"
      :before-close="closeDetailDialog"
    >
      <el-table 
        :data="currentDetailList" 
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        :cell-style="{ textAlign: 'center', padding: '12px 8px' }"
        border
      >
        <el-table-column prop="studentName" label="学生姓名" align="center" />
        <el-table-column prop="attendanceStatus" label="出勤状态" align="center">
          <template #default="{ row }">
            <el-tag :type="getAttendanceStatusType(row.attendanceStatus)">
              {{ row.attendanceStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="signInTime" label="签到时间" align="center" />
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDetailDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// 响应式数据
const filters = ref({
  semester: '',
  subject: '',
  course: ''
})

const currentPage = ref(1)
const pageSize = ref(15)
const showDetailDialog = ref(false)
const currentDetailList = ref([])

// 模拟数据
const semesterList = ['2024春季学期', '2024秋季学期', '2025春季学期']
const subjectList = ['数学', '计算机科学', '软件工程', '数据科学']
const courseList = ['高等数学', '线性代数', '数据结构', '算法设计', '数据库原理']

// 生成模拟出勤数据
const generateAttendanceData = () => {
  const data = []
  const studentNames = [
    '王小明', '李小红', '张伟', '刘敏', '陈强', '杨丽', '赵磊', '黄娟', '周杰', '吴雪',
    '徐涛', '孙静', '马超', '朱琳', '胡军', '郭芳', '何勇', '罗娜', '高飞', '梁燕',
    '宋波', '唐丽', '韩磊', '冯雪', '邓强', '曹敏', '彭丽', '蒋涛', '薛静', '方超',
    '石琳', '姜军', '戴芳', '夏勇', '钟娜', '汪飞', '田燕', '任波', '白丽', '崔磊',
    '史雪', '龙强', '段敏', '侯丽', '江涛', '钱静', '汤超', '尹琳', '黎军', '易芳'
  ]
  
  const attendanceStatuses = ['正常', '迟到', '早退', '请假', '缺勤']
  const classTimes = ['08:00-09:40', '10:00-11:40', '14:00-15:40', '16:00-17:40', '19:00-20:40']
  
  let id = 1
  const startDate = new Date('2024-01-01')
  
  // 生成50条数据
  for (let i = 0; i < 50; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i * 2) // 每2天生成一条数据
    
    semesterList.forEach(semester => {
      subjectList.forEach(subject => {
        courseList.forEach(course => {
          const classTime = classTimes[Math.floor(Math.random() * classTimes.length)]
          const attendanceStatus = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)]
          
          // 生成签到时间（根据出勤状态）
          let signInTime = ''
          if (attendanceStatus === '正常') {
            const baseTime = new Date(currentDate)
            baseTime.setHours(parseInt(classTime.split(':')[0]), parseInt(classTime.split(':')[1].split('-')[0]), 0)
            signInTime = baseTime.toISOString().slice(0, 16).replace('T', ' ')
          } else if (attendanceStatus === '迟到') {
            const baseTime = new Date(currentDate)
            baseTime.setHours(parseInt(classTime.split(':')[0]), parseInt(classTime.split(':')[1].split('-')[0]) + 10, 0)
            signInTime = baseTime.toISOString().slice(0, 16).replace('T', ' ')
          } else if (attendanceStatus === '早退') {
            const baseTime = new Date(currentDate)
            baseTime.setHours(parseInt(classTime.split(':')[0]), parseInt(classTime.split(':')[1].split('-')[0]) + 30, 0)
            signInTime = baseTime.toISOString().slice(0, 16).replace('T', ' ')
          }
          
          // 生成学生详情列表
          const studentDetails = []
          const studentCount = Math.floor(Math.random() * 5) + 3 // 3-7个学生
          const selectedStudents = [...studentNames].sort(() => 0.5 - Math.random()).slice(0, studentCount)
          
          selectedStudents.forEach(name => {
            const studentStatus = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)]
            let studentSignInTime = ''
            if (studentStatus === '正常') {
              const baseTime = new Date(currentDate)
              baseTime.setHours(parseInt(classTime.split(':')[0]), parseInt(classTime.split(':')[1].split('-')[0]), 0)
              studentSignInTime = baseTime.toISOString().slice(0, 16).replace('T', ' ')
            } else if (studentStatus === '迟到') {
              const baseTime = new Date(currentDate)
              baseTime.setHours(parseInt(classTime.split(':')[0]), parseInt(classTime.split(':')[1].split('-')[0]) + 10, 0)
              studentSignInTime = baseTime.toISOString().slice(0, 16).replace('T', ' ')
            } else if (studentStatus === '早退') {
              const baseTime = new Date(currentDate)
              baseTime.setHours(parseInt(classTime.split(':')[0]), parseInt(classTime.split(':')[1].split('-')[0]) + 30, 0)
              studentSignInTime = baseTime.toISOString().slice(0, 16).replace('T', ' ')
            }
            
            studentDetails.push({
              studentName: name,
              attendanceStatus: studentStatus,
              signInTime: studentSignInTime
            })
          })
          
          data.push({
            id: id++,
            semester: semester,
            subject: subject,
            course: course,
            classTime: `${currentDate.toISOString().split('T')[0]} ${classTime}`,
            signInTime: signInTime,
            attendanceStatus: attendanceStatus,
            studentDetails: studentDetails
          })
        })
      })
    })
  }
  
  return data.sort((a, b) => new Date(b.classTime) - new Date(a.classTime))
}

const attendanceData = ref(generateAttendanceData())

// 筛选后的数据
const filteredAttendance = computed(() => {
  let result = attendanceData.value

  // 按学期筛选
  if (filters.value.semester) {
    result = result.filter(item => item.semester === filters.value.semester)
  }

  // 按学科筛选
  if (filters.value.subject) {
    result = result.filter(item => item.subject === filters.value.subject)
  }

  // 按课程筛选
  if (filters.value.course) {
    result = result.filter(item => item.course === filters.value.course)
  }

  return result
})

// 分页后的数据
const paginatedAttendance = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAttendance.value.slice(start, end)
})

// 方法
const handleFilterChange = () => {
  currentPage.value = 1
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const showDetailList = (row) => {
  currentDetailList.value = row.studentDetails
  showDetailDialog.value = true
}

const closeDetailDialog = () => {
  showDetailDialog.value = false
  currentDetailList.value = []
}

const getAttendanceStatusType = (status) => {
  switch (status) {
    case '正常': return 'success'
    case '迟到': return 'warning'
    case '早退': return 'warning'
    case '请假': return 'info'
    case '缺勤': return 'danger'
    default: return ''
  }
}

const exportData = () => {
  // 导出功能实现
  console.log('导出出勤数据')
}

onMounted(() => {
  // 组件挂载后的初始化
})
</script>

<style scoped>
.attendance-page {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.semester-select,
.subject-select,
.course-select {
  width: 180px;
}

.export-btn {
  margin-left: 10px;
}

.table-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 出勤状态样式 */
.attendance-status {
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    width: 100%;
    justify-content: space-between;
  }
  
  .semester-select,
  .subject-select,
  .course-select {
    width: 200px;
  }
}
</style>
