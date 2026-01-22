# 学生智慧成长空间 - API接口文档

## 文档说明

本文档描述了学生智慧成长空间系统的所有后端 API 接口。

**基础信息：**
- 基础URL: `/api`
- 请求格式: `application/json`
- 响应格式: `application/json`
- 字符编码: `UTF-8`

**通用响应格式：**
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

**状态码说明：**
- `200`: 请求成功
- `400`: 请求参数错误
- `401`: 未授权/未登录
- `403`: 无权限访问
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 目录

1. [用户认证模块](#1-用户认证模块)
2. [首页模块](#2-首页模块)
3. [学习中心模块](#3-学习中心模块)
4. [能力检测模块](#4-能力检测模块)
5. [就业指导模块](#5-就业指导模块)
6. [成长中心模块](#6-成长中心模块)
7. [个人中心模块](#7-个人中心模块)
8. [AI助手模块](#8-ai助手模块)

---

## 1. 用户认证模块

### 1.1 用户登录

**接口地址:** `POST /api/auth/login`

**请求参数:**
```json
{
  "username": "liqiming",
  "password": "123456",
  "rememberMe": false
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "liqiming",
      "realName": "李启明",
      "role": "student",
      "avatar": "/pic/student01.png",
      "email": "liqiming@example.com",
      "phone": "13800138000",
      "studentId": "20210001",
      "major": "计算机科学与技术",
      "grade": "2021级",
      "class": "计科1班"
    }
  }
}
```

### 1.2 用户注册

**接口地址:** `POST /api/auth/register`

**请求参数:**
```json
{
  "username": "string",
  "password": "string",
  "realName": "string",
  "email": "string",
  "phone": "string",
  "studentId": "string",
  "major": "string",
  "verificationCode": "string"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": 1
  }
}
```

### 1.3 用户登出

**接口地址:** `POST /api/auth/logout`

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "登出成功"
}
```

### 1.4 刷新Token

**接口地址:** `POST /api/auth/refresh`

**请求参数:**
```json
{
  "refreshToken": "string"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "token": "string",
    "refreshToken": "string"
  }
}
```

### 1.5 修改密码

**接口地址:** `PUT /api/auth/password`

**请求参数:**
```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "密码修改成功"
}
```

---

## 2. 首页模块

### 2.1 获取首页统计数据

**接口地址:** `GET /api/home/statistics`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "totalCourses": 8,
    "completedCourses": 3,
    "ongoingCourses": 5,
    "totalCredits": 120,
    "earnedCredits": 65,
    "gpa": 3.75,
    "attendance": 95.5
  }
}
```

### 2.2 获取课程表

**接口地址:** `GET /api/home/schedule`

**请求参数:**
- `weekNum`: 周次（可选，默认当前周）

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "currentWeek": 8,
    "semesterWeeks": 20,
    "courses": [
      {
        "id": 1,
        "name": "数据结构",
        "teacher": "张教授",
        "location": "教学楼A201",
        "dayOfWeek": 1,
        "startTime": "08:00",
        "endTime": "09:40",
        "periods": [1, 2],
        "color": "#4CAF50"
      }
    ]
  }
}
```

### 2.3 获取学期信息

**接口地址:** `GET /api/semester`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "semesterWeeks": 20,
    "semesterStart": "2025-03-01",
    "semesterEnd": "2025-07-15",
    "currentWeek": 8
  }
}
```

### 2.4 获取通知列表

**接口地址:** `GET /api/home/notifications`

**请求参数:**
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `type`: 通知类型（可选）

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 25,
    "list": [
      {
        "id": 1,
        "title": "作业提醒",
        "content": "数据结构作业截止日期临近",
        "type": "homework",
        "isRead": false,
        "createTime": "2025-12-18 10:30:00"
      }
    ]
  }
}
```

### 2.5 获取课程进度

**接口地址:** `GET /api/courses/progress`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "courseId": 1,
      "name": "数据结构",
      "percent": 35,
      "completedLessons": 7,
      "totalLessons": 20
    }
  ]
}
```

---

## 3. 学习中心模块

### 3.1 教学数据

#### 3.1.1 获取考勤记录

**接口地址:** `GET /api/teaching/attendance`

**请求参数:**
- `courseId`: 课程ID（可选）
- `startDate`: 开始日期（可选）
- `endDate`: 结束日期（可选）
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 100,
    "statistics": {
      "totalDays": 100,
      "present": 95,
      "late": 3,
      "absent": 2,
      "leave": 0,
      "attendanceRate": 95.5
    },
    "list": [
      {
        "id": 1,
        "courseId": 1,
        "courseName": "数据结构",
        "date": "2025-12-18",
        "status": "present",
        "checkInTime": "08:05:00",
        "remark": ""
      }
    ]
  }
}
```

#### 3.1.2 签到

**接口地址:** `POST /api/teaching/attendance/checkin`

**请求参数:**
```json
{
  "courseId": 1,
  "checkInCode": "ABC123"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "签到成功",
  "data": {
    "attendanceId": 1,
    "checkInTime": "2025-12-18 08:05:00",
    "status": "present"
  }
}
```

#### 3.1.3 获取作业列表

**接口地址:** `GET /api/teaching/homework`

**请求参数:**
- `courseId`: 课程ID（可选）
- `status`: 状态（pending/submitted/graded）
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 25,
    "list": [
      {
        "id": 1,
        "courseId": 1,
        "courseName": "数据结构",
        "title": "第三章练习题",
        "description": "完成教材第三章所有习题",
        "assignDate": "2025-12-10",
        "dueDate": "2025-12-20",
        "status": "submitted",
        "score": null,
        "maxScore": 100,
        "submitTime": "2025-12-18 10:30:00",
        "attachments": []
      }
    ]
  }
}
```

#### 3.1.4 提交作业

**接口地址:** `POST /api/teaching/homework/submit`

**请求参数:**
```json
{
  "homeworkId": 1,
  "content": "作业内容",
  "attachments": [
    {
      "fileName": "homework.pdf",
      "fileUrl": "/uploads/homework/xxx.pdf",
      "fileSize": 1024000
    }
  ]
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "作业提交成功",
  "data": {
    "submissionId": 1,
    "submitTime": "2025-12-18 10:30:00"
  }
}
```

#### 3.1.5 获取成绩列表

**接口地址:** `GET /api/teaching/grades`

**请求参数:**
- `courseId`: 课程ID（可选）
- `semester`: 学期（可选）

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "summary": {
      "gpa": 3.75,
      "totalCredits": 120,
      "earnedCredits": 65
    },
    "list": [
      {
        "id": 1,
        "courseId": 1,
        "courseName": "数据结构",
        "credit": 4,
        "usualScore": 85,
        "examScore": 88,
        "totalScore": 87,
        "gradePoint": 3.7,
        "semester": "2024-2025第一学期"
      }
    ]
  }
}
```

#### 3.1.6 获取课堂互动记录

**接口地址:** `GET /api/teaching/interaction`

**请求参数:**
- `courseId`: 课程ID（可选）
- `type`: 类型（question/answer/discussion）
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 50,
    "statistics": {
      "totalInteractions": 50,
      "questions": 20,
      "answers": 18,
      "discussions": 12
    },
    "list": [
      {
        "id": 1,
        "courseId": 1,
        "courseName": "数据结构",
        "type": "question",
        "content": "关于二叉树遍历的问题",
        "createTime": "2025-12-18 10:00:00",
        "replyCount": 2,
        "likeCount": 5
      }
    ]
  }
}
```

#### 3.1.7 获取工作量化数据

**接口地址:** `GET /api/teaching/workload`

**请求参数:**
- `startDate`: 开始日期
- `endDate`: 结束日期

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "totalHours": 120,
    "breakdown": [
      {
        "category": "课堂学习",
        "hours": 60,
        "percentage": 50
      },
      {
        "category": "作业完成",
        "hours": 30,
        "percentage": 25
      },
      {
        "category": "自主学习",
        "hours": 20,
        "percentage": 16.7
      },
      {
        "category": "项目实践",
        "hours": 10,
        "percentage": 8.3
      }
    ],
    "weeklyData": [
      {
        "week": 1,
        "hours": 15
      }
    ]
  }
}
```

### 3.2 资源数据

#### 3.2.1 获取课程列表

**接口地址:** `GET /api/resources/courses`

**请求参数:**
- `category`: 分类（可选）
- `keyword`: 关键词（可选）
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 50,
    "list": [
      {
        "id": 1,
        "name": "数据结构与算法",
        "teacher": "张教授",
        "category": "专业必修",
        "credit": 4,
        "totalHours": 64,
        "description": "课程描述",
        "coverImage": "/pic/course1.jpg",
        "rating": 4.8,
        "studentCount": 150,
        "materials": [
          {
            "id": 1,
            "name": "第一章课件",
            "type": "ppt",
            "url": "/resources/ppt1.pdf",
            "size": 2048000,
            "uploadTime": "2025-09-01"
          }
        ]
      }
    ]
  }
}
```

#### 3.2.2 获取课程详情

**接口地址:** `GET /api/resources/courses/{id}`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "数据结构与算法",
    "teacher": "张教授",
    "category": "专业必修",
    "credit": 4,
    "totalHours": 64,
    "description": "详细描述",
    "outline": "课程大纲",
    "objectives": ["目标1", "目标2"],
    "coverImage": "/pic/course1.jpg",
    "materials": [],
    "chapters": [
      {
        "id": 1,
        "title": "第一章 绪论",
        "order": 1,
        "lessons": [
          {
            "id": 1,
            "title": "1.1 数据结构的基本概念",
            "duration": 45,
            "videoUrl": "/videos/lesson1.mp4",
            "completed": true
          }
        ]
      }
    ]
  }
}
```

#### 3.2.3 课程评分

**接口地址:** `POST /api/resources/courses/{id}/rating`

**请求参数:**
```json
{
  "rating": 5,
  "comment": "课程很好"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "评分成功"
}
```

### 3.3 报告数据

#### 3.3.1 获取归档列表

**接口地址:** `GET /api/reports/archives`

**请求参数:**
- `type`: 类型（report/note/document）
- `keyword`: 关键词
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 30,
    "list": [
      {
        "id": 1,
        "title": "数据结构期末报告",
        "type": "report",
        "createTime": "2025-12-10",
        "updateTime": "2025-12-15",
        "fileUrl": "/archives/report1.pdf",
        "fileSize": 3072000,
        "tags": ["期末", "数据结构"]
      }
    ]
  }
}
```

#### 3.3.2 创建报告

**接口地址:** `POST /api/reports/archives`

**请求参数:**
```json
{
  "title": "报告标题",
  "type": "report",
  "content": "报告内容",
  "attachments": [],
  "tags": ["标签1"]
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1
  }
}
```

#### 3.3.3 获取笔记列表

**接口地址:** `GET /api/reports/notes`

**请求参数:**
- `courseId`: 课程ID（可选）
- `keyword`: 关键词
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 50,
    "list": [
      {
        "id": 1,
        "title": "数据结构-第三章笔记",
        "courseId": 1,
        "courseName": "数据结构",
        "content": "笔记内容摘要...",
        "createTime": "2025-12-18 10:00:00",
        "updateTime": "2025-12-18 11:00:00",
        "tags": ["树", "遍历"]
      }
    ]
  }
}
```

#### 3.3.4 创建/更新笔记

**接口地址:** `POST /api/reports/notes`

**请求参数:**
```json
{
  "id": null,
  "title": "笔记标题",
  "courseId": 1,
  "content": "笔记内容",
  "tags": ["标签"]
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "保存成功",
  "data": {
    "id": 1
  }
}
```

### 3.4 成就数据

#### 3.4.1 获取证书列表

**接口地址:** `GET /api/achievements/certificates`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "计算机二级证书",
      "issuingAuthority": "教育部考试中心",
      "obtainDate": "2024-06-15",
      "certificateNumber": "123456789",
      "validUntil": "2029-06-15",
      "imageUrl": "/certificates/cert1.jpg"
    }
  ]
}
```

#### 3.4.2 添加证书

**接口地址:** `POST /api/achievements/certificates`

**请求参数:**
```json
{
  "name": "证书名称",
  "issuingAuthority": "颁发机构",
  "obtainDate": "2024-06-15",
  "certificateNumber": "123456",
  "validUntil": "2029-06-15",
  "imageUrl": "/uploads/cert.jpg"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "id": 1
  }
}
```

#### 3.4.3 获取论文列表

**接口地址:** `GET /api/achievements/papers`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "title": "基于深度学习的图像识别研究",
      "authors": "李启明, 张三",
      "journal": "计算机学报",
      "publishDate": "2024-08-01",
      "volume": "45",
      "issue": "8",
      "pages": "1520-1530",
      "doi": "10.xxx/xxx",
      "type": "期刊论文",
      "status": "已发表"
    }
  ]
}
```

#### 3.4.4 获取专利列表

**接口地址:** `GET /api/achievements/patents`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "一种智能学习系统",
      "patentNumber": "CN202410001234.5",
      "type": "发明专利",
      "inventors": "李启明, 王教授",
      "applicationDate": "2024-01-15",
      "authorizationDate": "2024-10-20",
      "status": "已授权"
    }
  ]
}
```

#### 3.4.5 获取能力认证列表

**接口地址:** `GET /api/achievements/ability-certifications`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "Python高级开发认证",
      "issuingOrganization": "中国软件行业协会",
      "level": "高级",
      "obtainDate": "2024-09-10",
      "validUntil": "2027-09-10",
      "score": 95,
      "certificateUrl": "/certifications/cert1.pdf"
    }
  ]
}
```

### 3.5 评价数据

#### 3.5.1 获取学生评价列表

**接口地址:** `GET /api/evaluation/student-evaluation`

**请求参数:**
- `semester`: 学期（可选）
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 20,
    "summary": {
      "averageScore": 4.5,
      "totalEvaluations": 20
    },
    "list": [
      {
        "id": 1,
        "courseId": 1,
        "courseName": "数据结构",
        "teacherId": 1,
        "teacherName": "张教授",
        "semester": "2024-2025第一学期",
        "dimensions": [
          {
            "name": "教学态度",
            "score": 5
          },
          {
            "name": "教学内容",
            "score": 4.5
          },
          {
            "name": "教学方法",
            "score": 4.8
          }
        ],
        "overallScore": 4.7,
        "comment": "教学认真负责",
        "createTime": "2025-01-10"
      }
    ]
  }
}
```

#### 3.5.2 提交学生评价

**接口地址:** `POST /api/evaluation/student-evaluation`

**请求参数:**
```json
{
  "courseId": 1,
  "teacherId": 1,
  "semester": "2024-2025第一学期",
  "dimensions": [
    {
      "name": "教学态度",
      "score": 5
    }
  ],
  "overallScore": 4.7,
  "comment": "评价内容"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "评价提交成功"
}
```

#### 3.5.3 获取自我评价记录

**接口地址:** `GET /api/evaluation/self-evaluation`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "period": "2024-2025第一学期",
      "dimensions": [
        {
          "name": "学习态度",
          "score": 4.5,
          "description": "学习认真刻苦"
        },
        {
          "name": "专业能力",
          "score": 4.0,
          "description": "专业知识扎实"
        }
      ],
      "overallScore": 4.3,
      "strengths": "优势描述",
      "weaknesses": "不足描述",
      "improvements": "改进计划",
      "createTime": "2025-01-15"
    }
  ]
}
```

#### 3.5.4 创建自我评价

**接口地址:** `POST /api/evaluation/self-evaluation`

**请求参数:**
```json
{
  "period": "2024-2025第一学期",
  "dimensions": [],
  "overallScore": 4.3,
  "strengths": "优势",
  "weaknesses": "不足",
  "improvements": "改进"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "保存成功"
}
```

#### 3.5.5 获取数字素养评估

**接口地址:** `GET /api/evaluation/digital-literacy`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "overallScore": 85,
    "level": "良好",
    "dimensions": [
      {
        "name": "信息素养",
        "score": 88,
        "items": [
          {
            "name": "信息检索能力",
            "score": 90
          }
        ]
      },
      {
        "name": "数字工具使用",
        "score": 82,
        "items": []
      }
    ],
    "lastEvaluationTime": "2025-12-01"
  }
}
```

---

## 4. 能力检测模块

### 4.1 获取能力测试列表

**接口地址:** `GET /api/ability-test/tests`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "综合能力测试",
      "description": "测试描述",
      "duration": 60,
      "totalQuestions": 50,
      "type": "comprehensive",
      "difficulty": "medium",
      "isCompleted": false
    }
  ]
}
```

### 4.2 开始测试

**接口地址:** `POST /api/ability-test/tests/{id}/start`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "sessionId": "test-session-123",
    "questions": [
      {
        "id": 1,
        "type": "single_choice",
        "content": "题目内容",
        "options": [
          {
            "key": "A",
            "value": "选项A"
          }
        ],
        "score": 2
      }
    ],
    "startTime": "2025-12-18 10:00:00",
    "endTime": "2025-12-18 11:00:00"
  }
}
```

### 4.3 提交测试答案

**接口地址:** `POST /api/ability-test/tests/{id}/submit`

**请求参数:**
```json
{
  "sessionId": "test-session-123",
  "answers": [
    {
      "questionId": 1,
      "answer": "A"
    }
  ]
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "reportId": 1
  }
}
```

### 4.4 获取能力报告

**接口地址:** `GET /api/ability-test/reports/{id}`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "testId": 1,
    "testName": "综合能力测试",
    "totalScore": 85,
    "rank": "A",
    "completionTime": "2025-12-18 11:00:00",
    "dimensions": [
      {
        "name": "逻辑思维",
        "score": 88,
        "level": "优秀",
        "description": "逻辑思维能力较强"
      },
      {
        "name": "语言表达",
        "score": 82,
        "level": "良好",
        "description": "语言表达能力良好"
      }
    ],
    "strengths": ["逻辑清晰", "分析能力强"],
    "weaknesses": ["创新思维有待提高"],
    "suggestions": ["建议多参加创新实践活动"]
  }
}
```

### 4.5 获取能力图谱

**接口地址:** `GET /api/ability-test/ability-map`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "dimensions": [
      {
        "name": "专业能力",
        "score": 85,
        "children": [
          {
            "name": "编程能力",
            "score": 90
          },
          {
            "name": "算法能力",
            "score": 80
          }
        ]
      },
      {
        "name": "通用能力",
        "score": 78,
        "children": [
          {
            "name": "沟通能力",
            "score": 75
          },
          {
            "name": "团队协作",
            "score": 82
          }
        ]
      }
    ],
    "updateTime": "2025-12-18"
  }
}
```

### 4.6 获取能力光谱

**接口地址:** `GET /api/ability-test/ability-spectrum`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "spectrumData": [
      {
        "ability": "逻辑思维",
        "score": 88,
        "percentile": 85
      },
      {
        "ability": "创新能力",
        "score": 75,
        "percentile": 70
      }
    ],
    "historicalData": [
      {
        "date": "2025-09-01",
        "abilities": [
          {
            "name": "逻辑思维",
            "score": 80
          }
        ]
      }
    ]
  }
}
```

---

## 5. 就业指导模块

### 5.1 简历管理

#### 5.1.1 获取简历列表

**接口地址:** `GET /api/career/resumes`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "软件开发工程师简历",
      "isDefault": true,
      "createTime": "2025-10-01",
      "updateTime": "2025-12-15",
      "completeness": 85
    }
  ]
}
```

#### 5.1.2 获取简历详情

**接口地址:** `GET /api/career/resumes/{id}`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "basicInfo": {
      "name": "李启明",
      "gender": "男",
      "birth": "2003-05-15",
      "phone": "13800138000",
      "email": "liqiming@example.com",
      "location": "北京市海淀区",
      "photo": "/uploads/photo.jpg"
    },
    "education": [
      {
        "school": "北京大学",
        "major": "计算机科学与技术",
        "degree": "本科",
        "startDate": "2021-09",
        "endDate": "2025-06",
        "gpa": "3.75/4.0",
        "courses": ["数据结构", "算法设计"]
      }
    ],
    "workExperience": [
      {
        "company": "某科技公司",
        "position": "软件开发实习生",
        "startDate": "2024-06",
        "endDate": "2024-08",
        "description": "工作描述",
        "achievements": ["成就1"]
      }
    ],
    "projectExperience": [
      {
        "name": "项目名称",
        "role": "核心开发",
        "startDate": "2024-03",
        "endDate": "2024-06",
        "description": "项目描述",
        "technologies": ["Vue", "Node.js"]
      }
    ],
    "skills": [
      {
        "category": "编程语言",
        "items": ["Java", "Python", "JavaScript"]
      }
    ],
    "certificates": [],
    "honors": [],
    "selfEvaluation": "自我评价"
  }
}
```

#### 5.1.3 保存简历

**接口地址:** `POST /api/career/resumes`

**请求参数:**（同上述简历详情结构）

**响应示例:**
```json
{
  "code": 200,
  "message": "保存成功",
  "data": {
    "id": 1
  }
}
```

#### 5.1.4 简历诊断/分析

**接口地址:** `POST /api/career/resumes/analyze`

**请求参数:**
```json
{
  "resumeId": 1,
  "targetPosition": "软件开发工程师"
}
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "overallScore": 85,
    "overallComment": "简历质量较高，建议进一步优化关键词匹配度",
    "issues": [
      {
        "severity": "high",
        "text": "工作经历描述缺少量化数据"
      },
      {
        "severity": "medium",
        "text": "技能关键词与目标岗位匹配度偏低"
      }
    ],
    "dimensions": [
      {
        "name": "内容完整度",
        "score": 90,
        "comment": "简历内容较为完整",
        "tip": "建议补充项目经历"
      },
      {
        "name": "格式规范",
        "score": 88,
        "comment": "格式规范",
        "tip": ""
      },
      {
        "name": "关键词匹配",
        "score": 78,
        "comment": "关键词匹配度一般",
        "tip": "建议增加行业关键词"
      },
      {
        "name": "职业匹配度",
        "score": 85,
        "comment": "与目标职位匹配度较高",
        "tip": ""
      },
      {
        "name": "表达专业度",
        "score": 82,
        "comment": "表达较为专业",
        "tip": "建议使用更多专业术语"
      },
      {
        "name": "视觉呈现",
        "score": 80,
        "comment": "视觉呈现良好",
        "tip": "可考虑优化排版"
      }
    ],
    "suggestions": [
      "建议1",
      "建议2"
    ]
  }
}
```

#### 5.1.5 简历优化

**接口地址:** `POST /api/career/resumes/{id}/optimize`

**请求参数:**
```json
{
  "targetPosition": "软件开发工程师",
  "optimizationAreas": ["content", "format", "keywords"]
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "优化完成",
  "data": {
    "optimizedResumeUrl": "/downloads/resume-optimized.pdf",
    "changes": [
      "增加了10个行业关键词",
      "优化了工作经历描述",
      "调整了版式结构"
    ]
  }
}
```

### 5.2 简历模板

#### 5.2.1 获取模板列表

**接口地址:** `GET /api/career/resume-templates`

**请求参数:**
- `category`: 类别（技术类/商务类/设计类）
- `style`: 风格（简约/商务/创意）

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "简约技术风",
      "category": "技术类",
      "style": "简约",
      "thumbnailUrl": "/templates/thumb1.jpg",
      "previewUrl": "/templates/preview1.jpg",
      "downloadCount": 1250,
      "rating": 4.8
    }
  ]
}
```

#### 5.2.2 应用模板

**接口地址:** `POST /api/career/resumes/{id}/apply-template`

**请求参数:**
```json
{
  "templateId": 1
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "应用成功"
}
```

### 5.3 面试辅导

#### 5.3.1 获取面试题库

**接口地址:** `GET /api/career/interview-questions`

**请求参数:**
- `type`: 类型（technical/behavioral/comprehensive）
- `category`: 分类
- `difficulty`: 难度（easy/medium/hard）
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 500,
    "list": [
      {
        "id": 1,
        "type": "technical",
        "category": "算法",
        "difficulty": "medium",
        "question": "请实现一个二叉树的层序遍历",
        "answer": "参考答案...",
        "tips": ["提示1", "提示2"],
        "keyPoints": ["关键点1"]
      }
    ]
  }
}
```

#### 5.3.2 开始AI虚拟面试

**接口地址:** `POST /api/career/virtual-interview/start`

**请求参数:**
```json
{
  "position": "软件开发工程师",
  "interviewType": "technical",
  "difficulty": "medium"
}
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "sessionId": "interview-session-123",
    "startTime": "2025-12-18 10:00:00",
    "questions": []
  }
}
```

#### 5.3.3 提交面试回答

**接口地址:** `POST /api/career/virtual-interview/answer`

**请求参数:**
```json
{
  "sessionId": "interview-session-123",
  "questionId": 1,
  "answer": "回答内容",
  "audioUrl": "/uploads/answer.mp3"
}
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "feedback": {
      "score": 85,
      "strengths": ["回答完整", "逻辑清晰"],
      "improvements": ["可以补充更多细节"],
      "suggestions": "建议..."
    },
    "nextQuestion": {
      "id": 2,
      "question": "下一个问题..."
    }
  }
}
```

#### 5.3.4 结束面试并获取报告

**接口地址:** `POST /api/career/virtual-interview/{sessionId}/finish`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "reportId": 1,
    "overallScore": 82,
    "performanceByType": [
      {
        "type": "technical",
        "score": 85,
        "feedback": "技术能力较强"
      },
      {
        "type": "behavioral",
        "score": 78,
        "feedback": "行为面试表现良好"
      }
    ],
    "strengths": ["优势1"],
    "weaknesses": ["不足1"],
    "suggestions": ["建议1"]
  }
}
```

### 5.4 职位推荐

#### 5.4.1 获取推荐职位

**接口地址:** `GET /api/career/job-postings`

**请求参数:**
- `keyword`: 关键词
- `location`: 地区
- `salaryRange`: 薪资范围
- `experience`: 经验要求
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 200,
    "list": [
      {
        "id": 1,
        "title": "Java开发工程师",
        "company": "某科技公司",
        "companyLogo": "/logos/company1.png",
        "location": "北京",
        "salary": "15K-25K",
        "experience": "1-3年",
        "education": "本科",
        "type": "全职",
        "tags": ["五险一金", "弹性工作"],
        "description": "职位描述",
        "requirements": ["要求1", "要求2"],
        "publishTime": "2025-12-15",
        "matchScore": 85
      }
    ]
  }
}
```

#### 5.4.2 获取职位详情

**接口地址:** `GET /api/career/job-postings/{id}`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "Java开发工程师",
    "company": "某科技公司",
    "companyInfo": {
      "name": "某科技公司",
      "logo": "/logos/company1.png",
      "scale": "500-1000人",
      "industry": "互联网",
      "description": "公司介绍"
    },
    "location": "北京市海淀区",
    "salary": "15K-25K",
    "experience": "1-3年",
    "education": "本科",
    "type": "全职",
    "tags": ["五险一金", "弹性工作", "年度旅游"],
    "description": "详细职位描述",
    "requirements": ["要求1", "要求2"],
    "responsibilities": ["职责1", "职责2"],
    "benefits": ["福利1", "福利2"],
    "publishTime": "2025-12-15",
    "matchScore": 85,
    "matchReasons": ["原因1", "原因2"]
  }
}
```

#### 5.4.3 投递简历

**接口地址:** `POST /api/career/job-postings/{id}/apply`

**请求参数:**
```json
{
  "resumeId": 1,
  "coverLetter": "求职信"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "投递成功",
  "data": {
    "applicationId": 1
  }
}
```

#### 5.4.4 获取投递记录

**接口地址:** `GET /api/career/applications`

**请求参数:**
- `status`: 状态（pending/viewed/interviewed/offered/rejected）
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 15,
    "list": [
      {
        "id": 1,
        "jobId": 1,
        "jobTitle": "Java开发工程师",
        "company": "某科技公司",
        "applyTime": "2025-12-10",
        "status": "interviewed",
        "statusText": "已面试",
        "timeline": [
          {
            "status": "submitted",
            "statusText": "已投递",
            "time": "2025-12-10 10:00:00"
          },
          {
            "status": "viewed",
            "statusText": "已查看",
            "time": "2025-12-11 15:00:00"
          }
        ]
      }
    ]
  }
}
```

---

## 6. 成长中心模块

### 6.1 成长轨迹

#### 6.1.1 获取成长轨迹数据

**接口地址:** `GET /api/growth/tracking`

**请求参数:**
- `timeRange`: 时间范围（week/month/semester/year）

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "timeline": [
      {
        "id": 1,
        "date": "2025-12-18",
        "type": "achievement",
        "title": "完成数据结构课程",
        "description": "以优异成绩完成数据结构课程学习",
        "icon": "trophy",
        "data": {
          "score": 95,
          "rank": 5
        }
      },
      {
        "id": 2,
        "date": "2025-12-15",
        "type": "milestone",
        "title": "达成里程碑：初入佳境",
        "description": "学习时长超过200小时",
        "icon": "milestone"
      }
    ],
    "statistics": {
      "totalStudyHours": 250,
      "completedCourses": 8,
      "earnedBadges": 15,
      "achievedMilestones": 3
    }
  }
}
```

#### 6.1.2 添加成长记录

**接口地址:** `POST /api/growth/tracking/records`

**请求参数:**
```json
{
  "type": "note",
  "title": "学习心得",
  "content": "今天学习了...",
  "tags": ["学习", "反思"]
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "id": 1
  }
}
```

### 6.2 里程碑

#### 6.2.1 获取里程碑列表

**接口地址:** `GET /api/growth/milestones`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "title": "新手上路",
      "description": "完成首次登录并完善个人信息",
      "status": "completed",
      "completedTime": "2025-09-01",
      "progress": 100,
      "requirements": [
        {
          "description": "完成注册",
          "completed": true
        },
        {
          "description": "完善个人信息",
          "completed": true
        }
      ],
      "rewards": [
        {
          "type": "badge",
          "name": "新手徽章",
          "icon": "/badges/newbie.png"
        }
      ]
    },
    {
      "id": 2,
      "title": "学有所成",
      "description": "完成5门课程学习",
      "status": "in_progress",
      "progress": 60,
      "requirements": [
        {
          "description": "完成5门课程",
          "completed": false,
          "current": 3,
          "target": 5
        }
      ]
    }
  ]
}
```

#### 6.2.2 获取里程碑详情

**接口地址:** `GET /api/growth/milestones/{id}`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "新手上路",
    "description": "详细描述",
    "status": "completed",
    "completedTime": "2025-09-01",
    "progress": 100,
    "requirements": [],
    "rewards": [],
    "relatedAchievements": []
  }
}
```

### 6.3 徽章系统

#### 6.3.1 获取徽章列表

**接口地址:** `GET /api/growth/badges`

**请求参数:**
- `status`: 状态（earned/locked）
- `category`: 分类

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 50,
    "earned": 15,
    "list": [
      {
        "id": 1,
        "name": "学霸徽章",
        "description": "期末考试平均分90分以上",
        "icon": "/badges/scholar.png",
        "category": "学习成就",
        "rarity": "rare",
        "status": "earned",
        "earnedTime": "2025-01-15",
        "progress": 100,
        "requirements": "平均分≥90"
      },
      {
        "id": 2,
        "name": "勤奋徽章",
        "description": "连续学习30天",
        "icon": "/badges/diligent.png",
        "category": "学习习惯",
        "rarity": "common",
        "status": "locked",
        "progress": 60,
        "requirements": "连续学习天数≥30"
      }
    ]
  }
}
```

### 6.4 目标管理

#### 6.4.1 获取目标列表

**接口地址:** `GET /api/growth/goals`

**请求参数:**
- `status`: 状态（active/completed/abandoned）
- `type`: 类型（short_term/long_term）

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "title": "掌握Vue3框架",
      "description": "系统学习Vue3，完成实战项目",
      "type": "short_term",
      "status": "active",
      "progress": 65,
      "startDate": "2025-11-01",
      "targetDate": "2025-12-31",
      "priority": "high",
      "tasks": [
        {
          "id": 1,
          "title": "学习Vue3基础",
          "completed": true
        },
        {
          "id": 2,
          "title": "完成实战项目",
          "completed": false
        }
      ]
    }
  ]
}
```

#### 6.4.2 创建目标

**接口地址:** `POST /api/growth/goals`

**请求参数:**
```json
{
  "title": "目标标题",
  "description": "目标描述",
  "type": "short_term",
  "targetDate": "2025-12-31",
  "priority": "high",
  "tasks": [
    {
      "title": "任务1"
    }
  ]
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 1
  }
}
```

#### 6.4.3 更新目标

**接口地址:** `PUT /api/growth/goals/{id}`

**请求参数:**（同创建目标）

**响应示例:**
```json
{
  "code": 200,
  "message": "更新成功"
}
```

#### 6.4.4 更新任务状态

**接口地址:** `PUT /api/growth/goals/{goalId}/tasks/{taskId}`

**请求参数:**
```json
{
  "completed": true
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "更新成功"
}
```

### 6.5 评价中心

#### 6.5.1 获取综合评价数据

**接口地址:** `GET /api/growth/evaluation-center`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "overallRating": 4.5,
    "dimensions": [
      {
        "name": "学习能力",
        "score": 4.8,
        "trend": "up"
      },
      {
        "name": "专业技能",
        "score": 4.2,
        "trend": "stable"
      },
      {
        "name": "综合素质",
        "score": 4.5,
        "trend": "up"
      }
    ],
    "recentEvaluations": [
      {
        "id": 1,
        "type": "teacher",
        "evaluator": "张教授",
        "course": "数据结构",
        "score": 4.8,
        "comment": "学习认真",
        "time": "2025-12-15"
      }
    ],
    "statistics": {
      "totalEvaluations": 25,
      "averageScore": 4.5,
      "positiveRate": 92
    }
  }
}
```

---

## 7. 个人中心模块

### 7.1 基本信息

#### 7.1.1 获取个人信息

**接口地址:** `GET /api/profile/basic-info`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "liqiming",
    "realName": "李启明",
    "avatar": "/uploads/avatar.jpg",
    "gender": "男",
    "birth": "2003-05-15",
    "email": "liqiming@example.com",
    "phone": "13800138000",
    "studentId": "20210001",
    "major": "计算机科学与技术",
    "grade": "2021级",
    "class": "计科1班",
    "admissionDate": "2021-09-01",
    "expectedGraduationDate": "2025-06-30",
    "politicalStatus": "团员",
    "nativePlace": "北京市",
    "currentAddress": "北京市海淀区学院路",
    "emergencyContact": {
      "name": "李父",
      "relation": "父亲",
      "phone": "13900139000"
    }
  }
}
```

#### 7.1.2 更新个人信息

**接口地址:** `PUT /api/profile/basic-info`

**请求参数:**（同上述个人信息结构）

**响应示例:**
```json
{
  "code": 200,
  "message": "更新成功"
}
```

#### 7.1.3 上传头像

**接口地址:** `POST /api/profile/avatar`

**请求参数:**
- Content-Type: `multipart/form-data`
- `file`: 头像文件

**响应示例:**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "avatarUrl": "/uploads/avatars/xxx.jpg"
  }
}
```

### 7.2 账号设置

#### 7.2.1 修改邮箱

**接口地址:** `PUT /api/profile/email`

**请求参数:**
```json
{
  "newEmail": "newemail@example.com",
  "verificationCode": "123456"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "修改成功"
}
```

#### 7.2.2 修改手机号

**接口地址:** `PUT /api/profile/phone`

**请求参数:**
```json
{
  "newPhone": "13900000000",
  "verificationCode": "123456"
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "修改成功"
}
```

#### 7.2.3 隐私设置

**接口地址:** `PUT /api/profile/privacy-settings`

**请求参数:**
```json
{
  "showEmail": false,
  "showPhone": false,
  "showBirth": true,
  "allowSearch": true
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "设置成功"
}
```

### 7.3 学习统计

#### 7.3.1 获取学习统计数据

**接口地址:** `GET /api/profile/study-statistics`

**请求参数:**
- `timeRange`: 时间范围（week/month/semester/year）

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "totalStudyHours": 250,
    "averageDailyHours": 3.5,
    "completedCourses": 8,
    "ongoingCourses": 5,
    "completedHomework": 45,
    "averageScore": 87.5,
    "gpa": 3.75,
    "attendanceRate": 95.5,
    "chartData": {
      "studyHoursPerDay": [
        {
          "date": "2025-12-11",
          "hours": 4
        }
      ],
      "scoreDistribution": [
        {
          "range": "90-100",
          "count": 15
        }
      ]
    }
  }
}
```

---

## 8. AI助手模块

### 8.1 AI对话

#### 8.1.1 发送消息

**接口地址:** `POST /api/ai/chat`

**请求参数:**
```json
{
  "message": "请帮我解释一下快速排序算法",
  "context": {
    "courseId": 1,
    "lessonId": 5
  }
}
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "messageId": "msg-123",
    "reply": "快速排序是一种分治算法...",
    "suggestions": [
      "了解更多排序算法",
      "查看代码示例"
    ],
    "relatedResources": [
      {
        "type": "video",
        "title": "快速排序讲解视频",
        "url": "/videos/quicksort.mp4"
      }
    ]
  }
}
```

#### 8.1.2 获取对话历史

**接口地址:** `GET /api/ai/chat/history`

**请求参数:**
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 100,
    "list": [
      {
        "id": "msg-123",
        "role": "user",
        "content": "请帮我解释一下快速排序算法",
        "timestamp": "2025-12-18 10:00:00"
      },
      {
        "id": "msg-124",
        "role": "assistant",
        "content": "快速排序是...",
        "timestamp": "2025-12-18 10:00:05"
      }
    ]
  }
}
```

### 8.2 智能Agent

#### 8.2.1 获取Agent列表

**接口地址:** `GET /api/ai/agents`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "学习助手",
      "description": "帮助你制定学习计划和答疑解惑",
      "avatar": "/agents/study-assistant.png",
      "type": "study",
      "capabilities": ["学习计划", "答疑解惑", "资源推荐"],
      "isActive": true
    }
  ]
}
```

#### 8.2.2 与Agent交互

**接口地址:** `POST /api/ai/agents/{id}/interact`

**请求参数:**
```json
{
  "action": "create_study_plan",
  "params": {
    "subject": "数据结构",
    "duration": 30,
    "targetLevel": "intermediate"
  }
}
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "result": {
      "planId": 1,
      "plan": {
        "title": "30天数据结构学习计划",
        "weeks": []
      }
    }
  }
}
```

### 8.3 知识库

#### 8.3.1 搜索知识库

**接口地址:** `GET /api/ai/knowledge-base/search`

**请求参数:**
- `keyword`: 关键词
- `category`: 分类
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 50,
    "list": [
      {
        "id": 1,
        "title": "快速排序算法详解",
        "category": "算法",
        "summary": "摘要...",
        "content": "详细内容...",
        "tags": ["排序", "算法"],
        "relevance": 0.95,
        "createTime": "2025-10-01"
      }
    ]
  }
}
```

#### 8.3.2 获取知识详情

**接口地址:** `GET /api/ai/knowledge-base/{id}`

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "快速排序算法详解",
    "category": "算法",
    "content": "详细内容...",
    "tags": ["排序", "算法"],
    "relatedKnowledge": [],
    "createTime": "2025-10-01",
    "updateTime": "2025-11-15"
  }
}
```

### 8.4 工作流

#### 8.4.1 获取工作流列表

**接口地址:** `GET /api/ai/workflows`

**响应示例:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "作业辅导流程",
      "description": "自动分析作业要求，提供解题思路",
      "category": "学习辅助",
      "status": "active",
      "createTime": "2025-10-01",
      "useCount": 150
    }
  ]
}
```

#### 8.4.2 执行工作流

**接口地址:** `POST /api/ai/workflows/{id}/execute`

**请求参数:**
```json
{
  "inputs": {
    "homeworkContent": "请实现一个二叉树的遍历算法"
  }
}
```

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "executionId": "exec-123",
    "status": "completed",
    "outputs": {
      "analysis": "题目分析...",
      "solution": "解题思路...",
      "code": "示例代码..."
    }
  }
}
```

---

## 9. 文件上传

### 9.1 通用文件上传

**接口地址:** `POST /api/upload`

**请求参数:**
- Content-Type: `multipart/form-data`
- `file`: 文件
- `type`: 文件类型（avatar/document/image/video/audio）

**响应示例:**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "fileId": "file-123",
    "fileName": "document.pdf",
    "fileUrl": "/uploads/documents/xxx.pdf",
    "fileSize": 2048000,
    "mimeType": "application/pdf",
    "uploadTime": "2025-12-18 10:00:00"
  }
}
```

### 9.2 批量上传

**接口地址:** `POST /api/upload/batch`

**请求参数:**
- Content-Type: `multipart/form-data`
- `files[]`: 文件数组
- `type`: 文件类型

**响应示例:**
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "files": [
      {
        "fileId": "file-123",
        "fileName": "file1.pdf",
        "fileUrl": "/uploads/file1.pdf",
        "fileSize": 1024000
      }
    ],
    "successCount": 3,
    "failCount": 0
  }
}
```

---

## 10. 系统通知

### 10.1 获取通知列表

**接口地址:** `GET /api/notifications`

**请求参数:**
- `type`: 类型（system/homework/grade/achievement）
- `isRead`: 是否已读（true/false）
- `page`: 页码
- `pageSize`: 每页数量

**响应示例:**
```json
{
  "code": 200,
  "data": {
    "total": 50,
    "unreadCount": 5,
    "list": [
      {
        "id": 1,
        "type": "homework",
        "title": "作业提醒",
        "content": "数据结构作业截止日期临近",
        "isRead": false,
        "createTime": "2025-12-18 10:00:00",
        "relatedId": 1,
        "relatedType": "homework"
      }
    ]
  }
}
```

### 10.2 标记已读

**接口地址:** `PUT /api/notifications/{id}/read`

**响应示例:**
```json
{
  "code": 200,
  "message": "标记成功"
}
```

### 10.3 批量标记已读

**接口地址:** `PUT /api/notifications/read-all`

**请求参数:**
```json
{
  "notificationIds": [1, 2, 3]
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "标记成功"
}
```

---

## 附录

### A. 错误码说明

| 错误码 | 说明 |
|-------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/未登录 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 422 | 数据验证失败 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |
| 503 | 服务暂时不可用 |

### B. 数据类型说明

- `string`: 字符串
- `number`: 数字
- `boolean`: 布尔值
- `array`: 数组
- `object`: 对象
- `date`: 日期（格式：YYYY-MM-DD）
- `datetime`: 日期时间（格式：YYYY-MM-DD HH:mm:ss）

### C. 认证说明

所有需要认证的接口都需要在请求头中携带 Token：

```
Authorization: Bearer {token}
```

Token 有效期为 7 天，过期后需要重新登录或使用刷新Token获取新的Token。

### D. 分页说明

所有分页接口统一使用以下参数：
- `page`: 页码（从1开始）
- `pageSize`: 每页数量（默认10，最大100）

分页响应统一包含：
- `total`: 总记录数
- `list`: 数据列表

### E. 文件上传限制

- 单文件最大：50MB
- 批量上传最多：10个文件
- 支持格式：
  - 图片：jpg, jpeg, png, gif, webp
  - 文档：pdf, doc, docx, xls, xlsx, ppt, pptx
  - 视频：mp4, avi, mov
  - 音频：mp3, wav

---

**文档版本：** v1.0  
**更新日期：** 2025-12-18  
**维护者：** 开发团队

