<template>
  <div class="resume-container">
    <!-- 顶部操作按钮 -->
    <div class="resume-actions">
      <button class="action-btn add-module-btn" @click="showModuleDialog = true">
        <i class="icon-add"></i>
        添加模块
      </button>
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
        <div class="meta">大三在读｜智慧健康养老服务与管理专业｜北京劳动保障职业学院（2023 级，预计 2026 年毕业）</div>
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
        <span class="chip">养老机构管理</span>
        <span class="chip">健康管理师</span>
        <span class="chip">社区养老服务</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">教育背景</div>
      <ul class="items">
        <li>
          <div class="row">
            <span>北京劳动保障职业学院 · 智慧健康养老服务与管理专业</span>
            <span>2023.09 - 2026.06（专科）</span>
          </div>
          <div class="row minor">专科（三年制）大三在读 · GPA：3.7/4.0 · 专业前10% · 校级一等奖学金</div>
        </li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">项目经历</div>
      <ul class="items">
        <li>
          <div class="row">
            <span>智慧养老社区服务平台（课程项目）</span>
            <span>2026.01 - 2026.02</span>
          </div>
          <div class="bullets">
            <div>在指导老师带领下参与社区养老服务需求调研与方案设计，协助完成 200+ 户老年人健康档案的整理与录入。</div>
            <div>配合团队完成智慧健康监测功能的方案设计与流程梳理，熟悉常用智能设备在养老场景中的应用。</div>
            <div>参与策划并协助执行健康知识讲座、文娱活动等社区服务活动，提升老年人参与度与满意度。</div>
          </div>
          <div class="tags">
            <span>健康管理</span><span>社区服务</span><span>活动策划</span><span>档案管理</span><span>智慧养老</span>
          </div>
        </li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">实习与实践</div>
      <ul class="items">
        <li>
          <div class="row">
            <span>北京市朝阳区某养老机构 · 养老服务实践（校外实习）</span>
            <span>2026.01 - 2026.02</span>
          </div>
          <div class="bullets">
            <div>在带教老师指导下协助开展日常照护服务，参与 30+ 位老人的生活照料、基础健康监测和简单康复训练。</div>
            <div>协助整理老年人健康档案，参与了解个性化照护计划制定流程，初步熟悉老年人综合评估要点。</div>
            <div>协助组织文娱活动、生日会、健康小讲堂等，提高老人日常陪伴感和活动参与度。</div>
          </div>
        </li>
      </ul>
    </div>

    <div class="section">
      <div class="section-title">荣誉奖项</div>
      <div class="chips">
        <span class="chip">全国职业院校技能大赛养老服务赛项三等奖</span>
        <span class="chip">北京市养老服务技能竞赛二等奖</span>
        <span class="chip">校级一等奖学金</span>
        <span class="chip">优秀学生干部</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">技能特长</div>
      <div class="tags">
        <span>老年人健康评估</span><span>护理技能</span><span>活动策划与组织</span><span>沟通协调能力</span><span>档案管理</span><span>智慧养老设备操作</span>
      </div>
    </div>

    <!-- 动态添加的模块 -->
    <div v-for="(module, index) in addedModules" :key="module.id" class="section dynamic-section">
      <div class="section-header-with-actions">
        <div class="section-title">{{ module.title }}</div>
        <div class="section-actions">
          <button class="icon-btn edit-module-btn" @click="editModule(index)" title="编辑">
            <i class="icon-edit-small"></i>
          </button>
          <button class="icon-btn delete-module-btn" @click="deleteModule(index)" title="删除">
            <i class="icon-delete"></i>
          </button>
        </div>
      </div>
      <!-- 实习经历 -->
      <div v-if="module.type === 'work'">
        <ul v-if="module.data && module.data.length > 0" class="items">
          <li v-for="(item, idx) in module.data" :key="idx">
            <div class="row">
              <span>{{ item.company }}</span>
              <span>{{ item.period }}</span>
            </div>
            <div class="row minor">{{ item.position }}</div>
            <div v-if="item.description" class="bullets">
              <div>{{ item.description }}</div>
            </div>
          </li>
        </ul>
        <div v-else class="empty-module">暂无实习经历，点击编辑添加</div>
      </div>

      <!-- 证书资质 -->
      <div v-else-if="module.type === 'certificate'">
        <div v-if="module.data && module.data.length > 0" class="chips">
          <span v-for="(item, idx) in module.data" :key="idx" class="chip">{{ typeof item === 'string' ? item : item.name || item }}</span>
        </div>
        <div v-else class="empty-module">暂无证书，点击编辑添加</div>
      </div>

      <!-- 语言能力 -->
      <div v-else-if="module.type === 'language'">
        <ul v-if="module.data && module.data.length > 0" class="items">
          <li v-for="(item, idx) in module.data" :key="idx">
            <div class="row">
              <span>{{ item.language }}</span>
              <span>{{ item.level }}</span>
            </div>
          </li>
        </ul>
        <div v-else class="empty-module">暂无语言能力信息，点击编辑添加</div>
      </div>

      <!-- 兴趣爱好 -->
      <div v-else-if="module.type === 'hobby'">
        <div v-if="module.data && module.data.length > 0" class="chips">
          <span v-for="(item, idx) in module.data" :key="idx" class="chip">{{ typeof item === 'string' ? item : item.name || item }}</span>
        </div>
        <div v-else class="empty-module">暂无兴趣爱好，点击编辑添加</div>
      </div>

      <!-- 自我评价 -->
      <div v-else-if="module.type === 'self-evaluation'">
        <div v-if="module.data" class="self-evaluation-content">{{ module.data }}</div>
        <div v-else class="empty-module">暂无自我评价，点击编辑添加</div>
      </div>

      <!-- 社会活动 -->
      <div v-else-if="module.type === 'social-activity'">
        <ul v-if="module.data && module.data.length > 0" class="items">
          <li v-for="(item, idx) in module.data" :key="idx">
            <div class="row">
              <span>{{ item.name }}</span>
              <span>{{ item.period }}</span>
            </div>
            <div v-if="item.description" class="bullets">
              <div>{{ item.description }}</div>
            </div>
          </li>
        </ul>
        <div v-else class="empty-module">暂无社会活动，点击编辑添加</div>
      </div>

      <!-- 科研成果 -->
      <div v-else-if="module.type === 'research'">
        <ul v-if="module.data && module.data.length > 0" class="items">
          <li v-for="(item, idx) in module.data" :key="idx">
            <div class="row">
              <span>{{ item.title }}</span>
              <span>{{ item.period }}</span>
            </div>
            <div v-if="item.description" class="bullets">
              <div>{{ item.description }}</div>
            </div>
          </li>
        </ul>
        <div v-else class="empty-module">暂无科研成果，点击编辑添加</div>
      </div>

      <!-- 培训经历 -->
      <div v-else-if="module.type === 'training'">
        <ul v-if="module.data && module.data.length > 0" class="items">
          <li v-for="(item, idx) in module.data" :key="idx">
            <div class="row">
              <span>{{ item.name }}</span>
              <span>{{ item.period }}</span>
            </div>
            <div v-if="item.description" class="bullets">
              <div>{{ item.description }}</div>
            </div>
          </li>
        </ul>
        <div v-else class="empty-module">暂无培训经历，点击编辑添加</div>
      </div>
    </div>

    <!-- 模块选择对话框 -->
    <el-dialog
      v-model="showModuleDialog"
      title="选择要添加的模块"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="module-selector">
        <div
          v-for="module in availableModules"
          :key="module.type"
          class="module-option"
          :class="{ disabled: isModuleAdded(module.type) }"
          @click="selectModule(module)"
        >
          <div class="module-icon">{{ module.icon }}</div>
          <div class="module-info">
            <div class="module-name">{{ module.name }}</div>
            <div class="module-desc">{{ module.description }}</div>
          </div>
          <div v-if="isModuleAdded(module.type)" class="module-added-badge">已添加</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showModuleDialog = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- 模块编辑对话框 -->
    <el-dialog
      v-model="showEditDialog"
      :title="`编辑${currentEditingModule?.title || ''}`"
      width="700px"
      :close-on-click-modal="false"
    >
      <div v-if="currentEditingModule" class="module-editor">
        <!-- 实习经历编辑器 -->
        <div v-if="currentEditingModule.type === 'work'" class="module-editor-content">
          <div v-for="(item, index) in editingData" :key="index" class="editor-item">
            <el-input v-model="item.company" placeholder="公司名称" style="margin-bottom: 10px" />
            <el-input v-model="item.position" placeholder="职位" style="margin-bottom: 10px" />
            <el-input v-model="item.period" placeholder="工作时间（如：2024.01 - 2024.12）" style="margin-bottom: 10px" />
            <el-input v-model="item.description" type="textarea" :rows="3" placeholder="工作描述" style="margin-bottom: 10px" />
            <el-button type="danger" size="small" @click="removeEditingItem(index)">删除</el-button>
          </div>
          <el-button type="primary" @click="addEditingItem('work')" style="margin-top: 10px">+ 添加实习经历</el-button>
        </div>

        <!-- 证书资质编辑器 -->
        <div v-else-if="currentEditingModule.type === 'certificate'" class="module-editor-content">
          <div v-for="(item, index) in editingData" :key="index" class="editor-item" style="display: flex; align-items: center; margin-bottom: 10px">
            <span style="flex: 1">{{ typeof item === 'string' ? item : item.name || item }}</span>
            <el-button type="danger" size="small" @click="removeEditingItem(index)">删除</el-button>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 10px">
            <el-input v-model="newEditingItem" placeholder="输入证书名称" style="flex: 1" />
            <el-button type="primary" @click="addEditingItem('certificate')">添加</el-button>
          </div>
        </div>

        <!-- 语言能力编辑器 -->
        <div v-else-if="currentEditingModule.type === 'language'" class="module-editor-content">
          <div v-for="(item, index) in editingData" :key="index" class="editor-item">
            <el-input v-model="item.language" placeholder="语言名称" style="margin-bottom: 10px" />
            <el-input v-model="item.level" placeholder="水平（如：CET-6、雅思7.0）" style="margin-bottom: 10px" />
            <el-button type="danger" size="small" @click="removeEditingItem(index)">删除</el-button>
          </div>
          <el-button type="primary" @click="addEditingItem('language')" style="margin-top: 10px">+ 添加语言</el-button>
        </div>

        <!-- 兴趣爱好编辑器 -->
        <div v-else-if="currentEditingModule.type === 'hobby'" class="module-editor-content">
          <div v-for="(item, index) in editingData" :key="index" class="editor-item" style="display: flex; align-items: center; margin-bottom: 10px">
            <span style="flex: 1">{{ typeof item === 'string' ? item : item.name || item }}</span>
            <el-button type="danger" size="small" @click="removeEditingItem(index)">删除</el-button>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 10px">
            <el-input v-model="newEditingItem" placeholder="输入兴趣爱好" style="flex: 1" />
            <el-button type="primary" @click="addEditingItem('hobby')">添加</el-button>
          </div>
        </div>

        <!-- 自我评价编辑器 -->
        <div v-else-if="currentEditingModule.type === 'self-evaluation'" class="module-editor-content">
          <el-input v-model="editingData" type="textarea" :rows="8" placeholder="请输入自我评价内容" />
        </div>

        <!-- 社会活动编辑器 -->
        <div v-else-if="currentEditingModule.type === 'social-activity'" class="module-editor-content">
          <div v-for="(item, index) in editingData" :key="index" class="editor-item">
            <el-input v-model="item.name" placeholder="活动名称" style="margin-bottom: 10px" />
            <el-input v-model="item.period" placeholder="活动时间" style="margin-bottom: 10px" />
            <el-input v-model="item.description" type="textarea" :rows="3" placeholder="活动描述" style="margin-bottom: 10px" />
            <el-button type="danger" size="small" @click="removeEditingItem(index)">删除</el-button>
          </div>
          <el-button type="primary" @click="addEditingItem('social-activity')" style="margin-top: 10px">+ 添加活动</el-button>
        </div>

        <!-- 科研成果编辑器 -->
        <div v-else-if="currentEditingModule.type === 'research'" class="module-editor-content">
          <div v-for="(item, index) in editingData" :key="index" class="editor-item">
            <el-input v-model="item.title" placeholder="成果标题" style="margin-bottom: 10px" />
            <el-input v-model="item.period" placeholder="时间" style="margin-bottom: 10px" />
            <el-input v-model="item.description" type="textarea" :rows="3" placeholder="成果描述" style="margin-bottom: 10px" />
            <el-button type="danger" size="small" @click="removeEditingItem(index)">删除</el-button>
          </div>
          <el-button type="primary" @click="addEditingItem('research')" style="margin-top: 10px">+ 添加成果</el-button>
        </div>

        <!-- 培训经历编辑器 -->
        <div v-else-if="currentEditingModule.type === 'training'" class="module-editor-content">
          <div v-for="(item, index) in editingData" :key="index" class="editor-item">
            <el-input v-model="item.name" placeholder="培训名称" style="margin-bottom: 10px" />
            <el-input v-model="item.period" placeholder="培训时间" style="margin-bottom: 10px" />
            <el-input v-model="item.description" type="textarea" :rows="3" placeholder="培训内容" style="margin-bottom: 10px" />
            <el-button type="danger" size="small" @click="removeEditingItem(index)">删除</el-button>
          </div>
          <el-button type="primary" @click="addEditingItem('training')" style="margin-top: 10px">+ 添加培训</el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="saveModuleEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { ElDialog, ElButton, ElMessage } from 'element-plus'

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

// 模块管理
const showModuleDialog = ref(false)
const showEditDialog = ref(false)
const editingModuleIndex = ref(-1)
const addedModules = ref([])
const editingData = ref(null)
const newEditingItem = ref('')

// 可用的模块列表
const availableModules = [
  {
    type: 'work',
    name: '实习经历',
    description: '添加实习经历信息',
    icon: '💼',
    title: '实习经历'
  },
  {
    type: 'certificate',
    name: '证书资质',
    description: '添加获得的证书和资质',
    icon: '📜',
    title: '证书资质'
  },
  {
    type: 'language',
    name: '语言能力',
    description: '添加语言能力信息',
    icon: '🌐',
    title: '语言能力'
  },
  {
    type: 'hobby',
    name: '兴趣爱好',
    description: '添加兴趣爱好',
    icon: '🎨',
    title: '兴趣爱好'
  },
  {
    type: 'self-evaluation',
    name: '自我评价',
    description: '添加自我评价内容',
    icon: '✨',
    title: '自我评价'
  },
  {
    type: 'social-activity',
    name: '社会活动',
    description: '添加社会活动经历',
    icon: '🤝',
    title: '社会活动'
  },
  {
    type: 'training',
    name: '培训经历',
    description: '添加培训和学习经历',
    icon: '📚',
    title: '培训经历'
  }
]

// 检查模块是否已添加
const isModuleAdded = (type) => {
  return addedModules.value.some(m => m.type === type)
}

// 选择模块
const selectModule = (module) => {
  if (isModuleAdded(module.type)) {
    ElMessage.warning('该模块已添加，请勿重复添加')
    return
  }

  const newModule = {
    id: Date.now() + Math.random(),
    type: module.type,
    title: module.title,
    data: getDefaultModuleData(module.type)
  }

  addedModules.value.push(newModule)
  ElMessage.success(`已添加"${module.name}"模块`)
  showModuleDialog.value = false
}

// 获取模块的默认数据
const getDefaultModuleData = (type) => {
  const defaults = {
    'work': [],
    'certificate': [],
    'language': [],
    'hobby': [],
    'self-evaluation': '',
    'social-activity': [],
    'research': [],
    'training': []
  }
  return defaults[type] || []
}


// 编辑模块
const editModule = (index) => {
  editingModuleIndex.value = index
  const module = addedModules.value[index]
  if (module) {
    // 深拷贝数据用于编辑
    if (Array.isArray(module.data)) {
      editingData.value = JSON.parse(JSON.stringify(module.data))
    } else {
      editingData.value = module.data
    }
    newEditingItem.value = ''
    showEditDialog.value = true
  }
}

// 添加编辑项
const addEditingItem = (type) => {
  if (!editingData.value) {
    editingData.value = []
  }
  
  if (type === 'certificate' || type === 'hobby') {
    if (newEditingItem.value.trim()) {
      if (Array.isArray(editingData.value)) {
        editingData.value.push(newEditingItem.value.trim())
      } else {
        editingData.value = [newEditingItem.value.trim()]
      }
      newEditingItem.value = ''
    }
  } else if (type === 'work') {
    if (Array.isArray(editingData.value)) {
      editingData.value.push({ company: '', position: '', period: '', description: '' })
    } else {
      editingData.value = [{ company: '', position: '', period: '', description: '' }]
    }
  } else if (type === 'language') {
    if (Array.isArray(editingData.value)) {
      editingData.value.push({ language: '', level: '' })
    } else {
      editingData.value = [{ language: '', level: '' }]
    }
  } else if (type === 'social-activity') {
    if (Array.isArray(editingData.value)) {
      editingData.value.push({ name: '', period: '', description: '' })
    } else {
      editingData.value = [{ name: '', period: '', description: '' }]
    }
  } else if (type === 'research') {
    if (Array.isArray(editingData.value)) {
      editingData.value.push({ title: '', period: '', description: '' })
    } else {
      editingData.value = [{ title: '', period: '', description: '' }]
    }
  } else if (type === 'training') {
    if (Array.isArray(editingData.value)) {
      editingData.value.push({ name: '', period: '', description: '' })
    } else {
      editingData.value = [{ name: '', period: '', description: '' }]
    }
  }
}

// 删除编辑项
const removeEditingItem = (index) => {
  if (Array.isArray(editingData.value)) {
    editingData.value.splice(index, 1)
  }
}

// 保存模块编辑
const saveModuleEdit = () => {
  if (editingModuleIndex.value >= 0 && editingData.value !== null) {
    addedModules.value[editingModuleIndex.value].data = editingData.value
    ElMessage.success('保存成功')
  }
  showEditDialog.value = false
  editingModuleIndex.value = -1
  editingData.value = null
  newEditingItem.value = ''
}

// 更新模块
const updateModule = (index, data) => {
  if (addedModules.value[index]) {
    addedModules.value[index].data = data
  }
}

// 删除模块
const deleteModule = (index) => {
  const module = addedModules.value[index]
  if (confirm(`确定要删除"${module.title}"模块吗？`)) {
    addedModules.value.splice(index, 1)
    ElMessage.success('已删除模块')
  }
}

// 当前正在编辑的模块
const currentEditingModule = computed(() => {
  if (editingModuleIndex.value >= 0 && addedModules.value[editingModuleIndex.value]) {
    return addedModules.value[editingModuleIndex.value]
  }
  return null
})
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
.icon-add::before { content: "➕"; }
.icon-edit::before { content: "✏️"; }
.icon-refresh::before { content: "🔄"; }
.icon-download::before { content: "⬇️"; }
.icon-edit-small::before { content: "✏️"; font-size: 12px; }
.icon-delete::before { content: "🗑️"; font-size: 12px; }

/* 添加模块按钮样式 */
.add-module-btn {
  background: #667eea;
  color: #fff;
  border: 1px solid #667eea;
}

.add-module-btn:hover {
  background: #5568d3;
  border-color: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

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

/* 动态模块样式 */
.dynamic-section {
  position: relative;
}

.section-header-with-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.icon-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.edit-module-btn:hover {
  background: #e3f2fd;
  border-color: #90caf9;
  color: #1976d2;
}

.delete-module-btn:hover {
  background: #ffebee;
  border-color: #ef9a9a;
  color: #c62828;
}

.empty-module {
  padding: 40px 20px;
  text-align: center;
  color: #9e9e9e;
  font-size: 14px;
  background: #fafafa;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
}

.self-evaluation-content {
  padding: 16px;
  background: #fafbfc;
  border-radius: 8px;
  line-height: 1.8;
  color: #4a5568;
  white-space: pre-wrap;
}

/* 模块选择对话框样式 */
.module-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-height: 500px;
  overflow-y: auto;
  padding: 8px;
}

.module-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
  position: relative;
}

.module-option:hover:not(.disabled) {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.module-option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

.module-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.module-info {
  flex: 1;
  min-width: 0;
}

.module-name {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.module-desc {
  font-size: 13px;
  color: #718096;
}

.module-added-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background: #c8e6c9;
  color: #2e7d32;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* 模块编辑器样式 */
.module-editor-content {
  padding: 8px 0;
}

.editor-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e9ecef;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .module-selector {
    grid-template-columns: 1fr;
  }
  
  .section-header-with-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .section-actions {
    align-self: flex-end;
  }
}
</style>


