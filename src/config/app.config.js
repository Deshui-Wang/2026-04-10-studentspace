export default {
  apiBase: '',
  endpoints: {
    semesterMeta: '/api/semester',
    courseProgress: '/api/courses/progress'
  },
  defaults: {
    semesterWeeks: 20,
    semesterStart: '2025-03-01',
    semesterEnd: '2025-07-15',
    courseProgress: [
      { name: '数据结构', percent: 35 },
      { name: '计算机网络', percent: 62 },
      { name: '教育学导论', percent: 48 },
      { name: 'UI设计基础', percent: 80 }
    ]
  }
} 