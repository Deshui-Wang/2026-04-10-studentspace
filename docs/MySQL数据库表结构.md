# 学生智慧成长空间 - MySQL数据库表结构

## 文档说明

本文档描述了学生智慧成长空间系统的MySQL数据库表结构设计。

**数据库信息：**
- 数据库名称：`student_space`
- 字符集：`utf8mb4`
- 排序规则：`utf8mb4_unicode_ci`
- 引擎：`InnoDB`

**命名规范：**
- 表名：小写字母，单词间用下划线分隔
- 字段名：小写字母，单词间用下划线分隔
- 主键：统一使用 `id`
- 时间字段：`created_at`, `updated_at`, `deleted_at`

**通用字段说明：**
- `id`: BIGINT UNSIGNED, 主键，自增
- `created_at`: TIMESTAMP, 创建时间
- `updated_at`: TIMESTAMP, 更新时间
- `deleted_at`: TIMESTAMP, 软删除时间（可为NULL）

---

## 目录

1. [用户认证相关表](#1-用户认证相关表)
2. [教学数据相关表](#2-教学数据相关表)
3. [资源数据相关表](#3-资源数据相关表)
4. [报告数据相关表](#4-报告数据相关表)
5. [成就数据相关表](#5-成就数据相关表)
6. [评价数据相关表](#6-评价数据相关表)
7. [能力检测相关表](#7-能力检测相关表)
8. [就业指导相关表](#8-就业指导相关表)
9. [成长中心相关表](#9-成长中心相关表)
10. [AI助手相关表](#10-ai助手相关表)
11. [系统相关表](#11-系统相关表)

---

## 1. 用户认证相关表

### 1.1 users - 用户表

```sql
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  `real_name` VARCHAR(50) NOT NULL COMMENT '真实姓名',
  `role` ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student' COMMENT '角色',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `student_id` VARCHAR(20) DEFAULT NULL COMMENT '学号',
  `major` VARCHAR(100) DEFAULT NULL COMMENT '专业',
  `grade` VARCHAR(20) DEFAULT NULL COMMENT '年级',
  `class` VARCHAR(50) DEFAULT NULL COMMENT '班级',
  `gender` ENUM('male', 'female', 'other') DEFAULT NULL COMMENT '性别',
  `birth` DATE DEFAULT NULL COMMENT '出生日期',
  `admission_date` DATE DEFAULT NULL COMMENT '入学日期',
  `expected_graduation_date` DATE DEFAULT NULL COMMENT '预计毕业日期',
  `political_status` VARCHAR(20) DEFAULT NULL COMMENT '政治面貌',
  `native_place` VARCHAR(100) DEFAULT NULL COMMENT '籍贯',
  `current_address` VARCHAR(255) DEFAULT NULL COMMENT '当前地址',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
  `last_login_time` TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_student_id` (`student_id`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

### 1.2 user_emergency_contacts - 用户紧急联系人表

```sql
CREATE TABLE `user_emergency_contacts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '联系人ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '联系人姓名',
  `relation` VARCHAR(20) NOT NULL COMMENT '关系',
  `phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_emergency_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户紧急联系人表';
```

### 1.3 user_tokens - 用户令牌表

```sql
CREATE TABLE `user_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '令牌ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `token` VARCHAR(500) NOT NULL COMMENT '访问令牌',
  `refresh_token` VARCHAR(500) DEFAULT NULL COMMENT '刷新令牌',
  `token_type` VARCHAR(20) NOT NULL DEFAULT 'Bearer' COMMENT '令牌类型',
  `expires_at` TIMESTAMP NOT NULL COMMENT '过期时间',
  `ip_address` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(255) DEFAULT NULL COMMENT '用户代理',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_token` (`token`(255)),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `fk_token_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户令牌表';
```

### 1.4 user_privacy_settings - 用户隐私设置表

```sql
CREATE TABLE `user_privacy_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '设置ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `show_email` TINYINT NOT NULL DEFAULT 0 COMMENT '是否显示邮箱',
  `show_phone` TINYINT NOT NULL DEFAULT 0 COMMENT '是否显示手机号',
  `show_birth` TINYINT NOT NULL DEFAULT 1 COMMENT '是否显示生日',
  `allow_search` TINYINT NOT NULL DEFAULT 1 COMMENT '是否允许搜索',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  CONSTRAINT `fk_privacy_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户隐私设置表';
```

---

## 2. 教学数据相关表

### 2.1 courses - 课程表

```sql
CREATE TABLE `courses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '课程ID',
  `code` VARCHAR(50) NOT NULL COMMENT '课程代码',
  `name` VARCHAR(100) NOT NULL COMMENT '课程名称',
  `category` VARCHAR(50) NOT NULL COMMENT '课程类别',
  `credit` DECIMAL(3,1) NOT NULL COMMENT '学分',
  `total_hours` INT NOT NULL COMMENT '总学时',
  `theory_hours` INT DEFAULT 0 COMMENT '理论学时',
  `practice_hours` INT DEFAULT 0 COMMENT '实践学时',
  `description` TEXT COMMENT '课程描述',
  `outline` TEXT COMMENT '课程大纲',
  `objectives` JSON COMMENT '教学目标',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图片',
  `teacher_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '授课教师ID',
  `semester` VARCHAR(50) NOT NULL COMMENT '学期',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-进行中，2-已结束',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code_semester` (`code`, `semester`),
  KEY `idx_name` (`name`),
  KEY `idx_category` (`category`),
  KEY `idx_teacher_id` (`teacher_id`),
  KEY `idx_semester` (`semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';
```

### 2.2 course_enrollments - 选课记录表

```sql
CREATE TABLE `course_enrollments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '选课ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '学生ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `enrollment_date` DATE NOT NULL COMMENT '选课日期',
  `status` ENUM('enrolled', 'dropped', 'completed') NOT NULL DEFAULT 'enrolled' COMMENT '状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_course` (`user_id`, `course_id`),
  KEY `idx_course_id` (`course_id`),
  CONSTRAINT `fk_enrollment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='选课记录表';
```

### 2.3 course_schedules - 课程表

```sql
CREATE TABLE `course_schedules` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '课表ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `day_of_week` TINYINT NOT NULL COMMENT '星期几(1-7)',
  `start_time` TIME NOT NULL COMMENT '开始时间',
  `end_time` TIME NOT NULL COMMENT '结束时间',
  `periods` JSON NOT NULL COMMENT '节次',
  `location` VARCHAR(100) NOT NULL COMMENT '上课地点',
  `week_range` VARCHAR(50) NOT NULL COMMENT '周次范围',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_day_of_week` (`day_of_week`),
  CONSTRAINT `fk_schedule_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';
```

### 2.4 attendance_records - 考勤记录表

```sql
CREATE TABLE `attendance_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '考勤ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '学生ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `attendance_date` DATE NOT NULL COMMENT '考勤日期',
  `status` ENUM('present', 'late', 'absent', 'leave') NOT NULL COMMENT '考勤状态',
  `check_in_time` TIME DEFAULT NULL COMMENT '签到时间',
  `check_in_code` VARCHAR(20) DEFAULT NULL COMMENT '签到码',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_course_date` (`user_id`, `course_id`, `attendance_date`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_attendance_date` (`attendance_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_attendance_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_attendance_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='考勤记录表';
```

### 2.5 homework - 作业表

```sql
CREATE TABLE `homework` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '作业ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `title` VARCHAR(200) NOT NULL COMMENT '作业标题',
  `description` TEXT COMMENT '作业描述',
  `assign_date` DATE NOT NULL COMMENT '布置日期',
  `due_date` DATE NOT NULL COMMENT '截止日期',
  `max_score` INT NOT NULL DEFAULT 100 COMMENT '满分',
  `requirements` TEXT COMMENT '作业要求',
  `attachments` JSON DEFAULT NULL COMMENT '附件',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-进行中，2-已结束',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_due_date` (`due_date`),
  CONSTRAINT `fk_homework_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作业表';
```

### 2.6 homework_submissions - 作业提交表

```sql
CREATE TABLE `homework_submissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '提交ID',
  `homework_id` BIGINT UNSIGNED NOT NULL COMMENT '作业ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '学生ID',
  `content` TEXT COMMENT '作业内容',
  `attachments` JSON DEFAULT NULL COMMENT '附件',
  `submit_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  `score` DECIMAL(5,2) DEFAULT NULL COMMENT '得分',
  `feedback` TEXT DEFAULT NULL COMMENT '批改反馈',
  `graded_at` TIMESTAMP NULL DEFAULT NULL COMMENT '批改时间',
  `graded_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '批改教师ID',
  `status` ENUM('pending', 'submitted', 'graded') NOT NULL DEFAULT 'submitted' COMMENT '状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_homework_user` (`homework_id`, `user_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_submission_homework` FOREIGN KEY (`homework_id`) REFERENCES `homework` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_submission_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作业提交表';
```

### 2.7 grades - 成绩表

```sql
CREATE TABLE `grades` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '成绩ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '学生ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `semester` VARCHAR(50) NOT NULL COMMENT '学期',
  `usual_score` DECIMAL(5,2) DEFAULT NULL COMMENT '平时成绩',
  `exam_score` DECIMAL(5,2) DEFAULT NULL COMMENT '考试成绩',
  `total_score` DECIMAL(5,2) NOT NULL COMMENT '总成绩',
  `grade_point` DECIMAL(3,2) DEFAULT NULL COMMENT '绩点',
  `rank` INT DEFAULT NULL COMMENT '排名',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_course_semester` (`user_id`, `course_id`, `semester`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_semester` (`semester`),
  CONSTRAINT `fk_grade_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_grade_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='成绩表';
```

### 2.8 classroom_interactions - 课堂互动表

```sql
CREATE TABLE `classroom_interactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '互动ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '学生ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `type` ENUM('question', 'answer', 'discussion', 'comment') NOT NULL COMMENT '类型',
  `content` TEXT NOT NULL COMMENT '内容',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父级ID（用于回复）',
  `like_count` INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  `reply_count` INT NOT NULL DEFAULT 0 COMMENT '回复数',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_type` (`type`),
  KEY `idx_parent_id` (`parent_id`),
  CONSTRAINT `fk_interaction_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_interaction_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课堂互动表';
```

### 2.9 workload_records - 工作量化记录表

```sql
CREATE TABLE `workload_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '学生ID',
  `category` VARCHAR(50) NOT NULL COMMENT '类别',
  `date` DATE NOT NULL COMMENT '日期',
  `hours` DECIMAL(5,2) NOT NULL COMMENT '时长（小时）',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '描述',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_date` (`date`),
  KEY `idx_category` (`category`),
  CONSTRAINT `fk_workload_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工作量化记录表';
```

---

## 3. 资源数据相关表

### 3.1 course_materials - 课程资料表

```sql
CREATE TABLE `course_materials` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '资料ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `name` VARCHAR(200) NOT NULL COMMENT '资料名称',
  `type` ENUM('ppt', 'pdf', 'video', 'audio', 'document', 'other') NOT NULL COMMENT '类型',
  `file_url` VARCHAR(500) NOT NULL COMMENT '文件URL',
  `file_size` BIGINT NOT NULL COMMENT '文件大小（字节）',
  `download_count` INT NOT NULL DEFAULT 0 COMMENT '下载次数',
  `description` TEXT COMMENT '描述',
  `uploaded_by` BIGINT UNSIGNED NOT NULL COMMENT '上传者ID',
  `upload_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_type` (`type`),
  CONSTRAINT `fk_material_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程资料表';
```

### 3.2 course_chapters - 课程章节表

```sql
CREATE TABLE `course_chapters` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '章节ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `title` VARCHAR(200) NOT NULL COMMENT '章节标题',
  `order_num` INT NOT NULL COMMENT '排序号',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_order` (`order_num`),
  CONSTRAINT `fk_chapter_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程章节表';
```

### 3.3 course_lessons - 课程小节表

```sql
CREATE TABLE `course_lessons` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '小节ID',
  `chapter_id` BIGINT UNSIGNED NOT NULL COMMENT '章节ID',
  `title` VARCHAR(200) NOT NULL COMMENT '小节标题',
  `duration` INT DEFAULT NULL COMMENT '时长（分钟）',
  `video_url` VARCHAR(500) DEFAULT NULL COMMENT '视频URL',
  `content` TEXT COMMENT '内容',
  `order_num` INT NOT NULL COMMENT '排序号',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_chapter_id` (`chapter_id`),
  KEY `idx_order` (`order_num`),
  CONSTRAINT `fk_lesson_chapter` FOREIGN KEY (`chapter_id`) REFERENCES `course_chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程小节表';
```

### 3.4 course_progress - 课程进度表

```sql
CREATE TABLE `course_progress` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '进度ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '学生ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `lesson_id` BIGINT UNSIGNED NOT NULL COMMENT '小节ID',
  `completed` TINYINT NOT NULL DEFAULT 0 COMMENT '是否完成',
  `progress_percent` INT NOT NULL DEFAULT 0 COMMENT '完成百分比',
  `last_position` INT DEFAULT NULL COMMENT '最后播放位置（秒）',
  `completed_at` TIMESTAMP NULL DEFAULT NULL COMMENT '完成时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_lesson` (`user_id`, `lesson_id`),
  KEY `idx_course_id` (`course_id`),
  CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_progress_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_progress_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `course_lessons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程进度表';
```

### 3.5 course_ratings - 课程评分表

```sql
CREATE TABLE `course_ratings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评分ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '学生ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `rating` TINYINT NOT NULL COMMENT '评分（1-5）',
  `comment` TEXT COMMENT '评价',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_course` (`user_id`, `course_id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_rating` (`rating`),
  CONSTRAINT `fk_rating_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rating_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程评分表';
```

---

## 4. 报告数据相关表

### 4.1 archives - 归档文件表

```sql
CREATE TABLE `archives` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '归档ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `type` ENUM('report', 'note', 'document') NOT NULL COMMENT '类型',
  `content` LONGTEXT COMMENT '内容',
  `file_url` VARCHAR(500) DEFAULT NULL COMMENT '文件URL',
  `file_size` BIGINT DEFAULT NULL COMMENT '文件大小（字节）',
  `tags` JSON DEFAULT NULL COMMENT '标签',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_archive_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='归档文件表';
```

### 4.2 notes - 笔记表

```sql
CREATE TABLE `notes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '笔记ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `course_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联课程ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content` LONGTEXT NOT NULL COMMENT '内容',
  `tags` JSON DEFAULT NULL COMMENT '标签',
  `is_public` TINYINT NOT NULL DEFAULT 0 COMMENT '是否公开',
  `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `like_count` INT NOT NULL DEFAULT 0 COMMENT '点赞次数',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_course_id` (`course_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_note_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='笔记表';
```

---

## 5. 成就数据相关表

### 5.1 certificates - 证书表

```sql
CREATE TABLE `certificates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '证书ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `name` VARCHAR(200) NOT NULL COMMENT '证书名称',
  `issuing_authority` VARCHAR(200) NOT NULL COMMENT '颁发机构',
  `certificate_number` VARCHAR(100) DEFAULT NULL COMMENT '证书编号',
  `obtain_date` DATE NOT NULL COMMENT '获得日期',
  `valid_until` DATE DEFAULT NULL COMMENT '有效期至',
  `image_url` VARCHAR(500) DEFAULT NULL COMMENT '证书图片',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_obtain_date` (`obtain_date`),
  CONSTRAINT `fk_certificate_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='证书表';
```

### 5.2 papers - 论文表

```sql
CREATE TABLE `papers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '论文ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `title` VARCHAR(500) NOT NULL COMMENT '论文标题',
  `authors` VARCHAR(500) NOT NULL COMMENT '作者',
  `journal` VARCHAR(200) NOT NULL COMMENT '期刊/会议名称',
  `publish_date` DATE NOT NULL COMMENT '发表日期',
  `volume` VARCHAR(50) DEFAULT NULL COMMENT '卷号',
  `issue` VARCHAR(50) DEFAULT NULL COMMENT '期号',
  `pages` VARCHAR(50) DEFAULT NULL COMMENT '页码',
  `doi` VARCHAR(200) DEFAULT NULL COMMENT 'DOI',
  `type` ENUM('journal', 'conference', 'other') NOT NULL COMMENT '类型',
  `status` ENUM('published', 'accepted', 'submitted', 'draft') NOT NULL COMMENT '状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_publish_date` (`publish_date`),
  KEY `idx_type` (`type`),
  CONSTRAINT `fk_paper_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='论文表';
```

### 5.3 patents - 专利表

```sql
CREATE TABLE `patents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '专利ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `name` VARCHAR(500) NOT NULL COMMENT '专利名称',
  `patent_number` VARCHAR(100) NOT NULL COMMENT '专利号',
  `type` ENUM('invention', 'utility_model', 'design') NOT NULL COMMENT '专利类型',
  `inventors` VARCHAR(500) NOT NULL COMMENT '发明人',
  `application_date` DATE NOT NULL COMMENT '申请日期',
  `authorization_date` DATE DEFAULT NULL COMMENT '授权日期',
  `status` ENUM('authorized', 'pending', 'rejected') NOT NULL COMMENT '状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_patent_number` (`patent_number`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  CONSTRAINT `fk_patent_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专利表';
```

### 5.4 ability_certifications - 能力认证表

```sql
CREATE TABLE `ability_certifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '认证ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `name` VARCHAR(200) NOT NULL COMMENT '认证名称',
  `issuing_organization` VARCHAR(200) NOT NULL COMMENT '颁发机构',
  `level` VARCHAR(50) DEFAULT NULL COMMENT '等级',
  `obtain_date` DATE NOT NULL COMMENT '获得日期',
  `valid_until` DATE DEFAULT NULL COMMENT '有效期至',
  `score` INT DEFAULT NULL COMMENT '分数',
  `certificate_url` VARCHAR(500) DEFAULT NULL COMMENT '证书文件',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_obtain_date` (`obtain_date`),
  CONSTRAINT `fk_ability_cert_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='能力认证表';
```

### 5.5 honors - 荣誉奖项表

```sql
CREATE TABLE `honors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '荣誉ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `name` VARCHAR(200) NOT NULL COMMENT '荣誉名称',
  `level` ENUM('national', 'provincial', 'municipal', 'school', 'other') NOT NULL COMMENT '级别',
  `issuing_authority` VARCHAR(200) NOT NULL COMMENT '颁发机构',
  `obtain_date` DATE NOT NULL COMMENT '获得日期',
  `description` TEXT COMMENT '描述',
  `certificate_url` VARCHAR(500) DEFAULT NULL COMMENT '证书文件',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_level` (`level`),
  KEY `idx_obtain_date` (`obtain_date`),
  CONSTRAINT `fk_honor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='荣誉奖项表';
```

---

## 6. 评价数据相关表

### 6.1 student_evaluations - 学生评价（评教）表

```sql
CREATE TABLE `student_evaluations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '评价学生ID',
  `course_id` BIGINT UNSIGNED NOT NULL COMMENT '课程ID',
  `teacher_id` BIGINT UNSIGNED NOT NULL COMMENT '被评价教师ID',
  `semester` VARCHAR(50) NOT NULL COMMENT '学期',
  `dimensions` JSON NOT NULL COMMENT '评价维度及分数',
  `overall_score` DECIMAL(3,2) NOT NULL COMMENT '总分',
  `comment` TEXT COMMENT '评价内容',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_course_semester` (`user_id`, `course_id`, `semester`),
  KEY `idx_teacher_id` (`teacher_id`),
  KEY `idx_semester` (`semester`),
  CONSTRAINT `fk_stu_eval_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_stu_eval_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学生评价表';
```

### 6.2 self_evaluations - 自我评价表

```sql
CREATE TABLE `self_evaluations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `period` VARCHAR(50) NOT NULL COMMENT '评价周期',
  `dimensions` JSON NOT NULL COMMENT '评价维度及分数',
  `overall_score` DECIMAL(3,2) NOT NULL COMMENT '总分',
  `strengths` TEXT COMMENT '优势',
  `weaknesses` TEXT COMMENT '不足',
  `improvements` TEXT COMMENT '改进计划',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_period` (`period`),
  CONSTRAINT `fk_self_eval_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='自我评价表';
```

### 6.3 digital_literacy_assessments - 数字素养评估表

```sql
CREATE TABLE `digital_literacy_assessments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评估ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `overall_score` INT NOT NULL COMMENT '总分',
  `level` VARCHAR(20) NOT NULL COMMENT '等级',
  `dimensions` JSON NOT NULL COMMENT '评估维度',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_digital_literacy_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数字素养评估表';
```

---

## 7. 能力检测相关表

### 7.1 ability_tests - 能力测试表

```sql
CREATE TABLE `ability_tests` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '测试ID',
  `name` VARCHAR(200) NOT NULL COMMENT '测试名称',
  `description` TEXT COMMENT '测试描述',
  `type` ENUM('comprehensive', 'professional', 'general') NOT NULL COMMENT '测试类型',
  `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL COMMENT '难度',
  `duration` INT NOT NULL COMMENT '时长（分钟）',
  `total_questions` INT NOT NULL COMMENT '题目总数',
  `total_score` INT NOT NULL DEFAULT 100 COMMENT '总分',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-启用，0-禁用',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_difficulty` (`difficulty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='能力测试表';
```

### 7.2 ability_test_questions - 能力测试题目表

```sql
CREATE TABLE `ability_test_questions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '题目ID',
  `test_id` BIGINT UNSIGNED NOT NULL COMMENT '测试ID',
  `type` ENUM('single_choice', 'multiple_choice', 'true_false', 'subjective') NOT NULL COMMENT '题型',
  `content` TEXT NOT NULL COMMENT '题目内容',
  `options` JSON DEFAULT NULL COMMENT '选项',
  `correct_answer` TEXT DEFAULT NULL COMMENT '正确答案',
  `score` INT NOT NULL COMMENT '分值',
  `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL COMMENT '难度',
  `dimension` VARCHAR(50) DEFAULT NULL COMMENT '能力维度',
  `order_num` INT NOT NULL COMMENT '排序号',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_test_id` (`test_id`),
  KEY `idx_dimension` (`dimension`),
  CONSTRAINT `fk_question_test` FOREIGN KEY (`test_id`) REFERENCES `ability_tests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='能力测试题目表';
```

### 7.3 ability_test_sessions - 测试会话表

```sql
CREATE TABLE `ability_test_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  `session_id` VARCHAR(100) NOT NULL COMMENT '会话标识',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `test_id` BIGINT UNSIGNED NOT NULL COMMENT '测试ID',
  `start_time` TIMESTAMP NOT NULL COMMENT '开始时间',
  `end_time` TIMESTAMP NULL DEFAULT NULL COMMENT '结束时间',
  `status` ENUM('in_progress', 'completed', 'expired') NOT NULL DEFAULT 'in_progress' COMMENT '状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_id` (`session_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_test_id` (`test_id`),
  CONSTRAINT `fk_session_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_session_test` FOREIGN KEY (`test_id`) REFERENCES `ability_tests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='测试会话表';
```

### 7.4 ability_test_answers - 测试答案表

```sql
CREATE TABLE `ability_test_answers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '答案ID',
  `session_id` BIGINT UNSIGNED NOT NULL COMMENT '会话ID',
  `question_id` BIGINT UNSIGNED NOT NULL COMMENT '题目ID',
  `answer` TEXT NOT NULL COMMENT '用户答案',
  `is_correct` TINYINT DEFAULT NULL COMMENT '是否正确',
  `score` INT DEFAULT NULL COMMENT '得分',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_question` (`session_id`, `question_id`),
  KEY `idx_question_id` (`question_id`),
  CONSTRAINT `fk_answer_session` FOREIGN KEY (`session_id`) REFERENCES `ability_test_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_answer_question` FOREIGN KEY (`question_id`) REFERENCES `ability_test_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='测试答案表';
```

### 7.5 ability_test_reports - 能力测试报告表

```sql
CREATE TABLE `ability_test_reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '报告ID',
  `session_id` BIGINT UNSIGNED NOT NULL COMMENT '会话ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `test_id` BIGINT UNSIGNED NOT NULL COMMENT '测试ID',
  `total_score` INT NOT NULL COMMENT '总分',
  `rank` VARCHAR(10) NOT NULL COMMENT '等级',
  `dimensions` JSON NOT NULL COMMENT '维度得分',
  `strengths` JSON DEFAULT NULL COMMENT '优势',
  `weaknesses` JSON DEFAULT NULL COMMENT '劣势',
  `suggestions` JSON DEFAULT NULL COMMENT '建议',
  `completion_time` TIMESTAMP NOT NULL COMMENT '完成时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_id` (`session_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_test_id` (`test_id`),
  CONSTRAINT `fk_report_session` FOREIGN KEY (`session_id`) REFERENCES `ability_test_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_report_test` FOREIGN KEY (`test_id`) REFERENCES `ability_tests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='能力测试报告表';
```

### 7.6 ability_maps - 能力图谱表

```sql
CREATE TABLE `ability_maps` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图谱ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `dimensions` JSON NOT NULL COMMENT '能力维度数据',
  `update_time` TIMESTAMP NOT NULL COMMENT '更新时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`),
  CONSTRAINT `fk_ability_map_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='能力图谱表';
```

---

## 8. 就业指导相关表

### 8.1 resumes - 简历表

```sql
CREATE TABLE `resumes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '简历ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `name` VARCHAR(100) NOT NULL COMMENT '简历名称',
  `is_default` TINYINT NOT NULL DEFAULT 0 COMMENT '是否默认简历',
  `basic_info` JSON NOT NULL COMMENT '基本信息',
  `education` JSON DEFAULT NULL COMMENT '教育经历',
  `work_experience` JSON DEFAULT NULL COMMENT '工作经历',
  `project_experience` JSON DEFAULT NULL COMMENT '项目经历',
  `skills` JSON DEFAULT NULL COMMENT '技能',
  `certificates` JSON DEFAULT NULL COMMENT '证书',
  `honors` JSON DEFAULT NULL COMMENT '荣誉',
  `self_evaluation` TEXT COMMENT '自我评价',
  `completeness` INT NOT NULL DEFAULT 0 COMMENT '完整度',
  `template_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '使用的模板ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_resume_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='简历表';
```

### 8.2 resume_templates - 简历模板表

```sql
CREATE TABLE `resume_templates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '模板ID',
  `name` VARCHAR(100) NOT NULL COMMENT '模板名称',
  `category` VARCHAR(50) NOT NULL COMMENT '类别',
  `style` VARCHAR(50) NOT NULL COMMENT '风格',
  `thumbnail_url` VARCHAR(500) NOT NULL COMMENT '缩略图',
  `preview_url` VARCHAR(500) NOT NULL COMMENT '预览图',
  `template_file` VARCHAR(500) NOT NULL COMMENT '模板文件',
  `download_count` INT NOT NULL DEFAULT 0 COMMENT '下载次数',
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 5.00 COMMENT '评分',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_style` (`style`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='简历模板表';
```

### 8.3 resume_analyses - 简历分析记录表

```sql
CREATE TABLE `resume_analyses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分析ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `resume_id` BIGINT UNSIGNED NOT NULL COMMENT '简历ID',
  `target_position` VARCHAR(100) DEFAULT NULL COMMENT '目标职位',
  `overall_score` INT NOT NULL COMMENT '总分',
  `overall_comment` TEXT COMMENT '总体评价',
  `issues` JSON DEFAULT NULL COMMENT '问题清单',
  `dimensions` JSON NOT NULL COMMENT '各维度分析',
  `suggestions` JSON DEFAULT NULL COMMENT '优化建议',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_resume_id` (`resume_id`),
  CONSTRAINT `fk_analysis_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_analysis_resume` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='简历分析记录表';
```

### 8.4 interview_questions - 面试题库表

```sql
CREATE TABLE `interview_questions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '题目ID',
  `type` ENUM('technical', 'behavioral', 'comprehensive', 'stress') NOT NULL COMMENT '类型',
  `category` VARCHAR(50) NOT NULL COMMENT '分类',
  `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL COMMENT '难度',
  `question` TEXT NOT NULL COMMENT '问题',
  `answer` TEXT DEFAULT NULL COMMENT '参考答案',
  `tips` JSON DEFAULT NULL COMMENT '提示',
  `key_points` JSON DEFAULT NULL COMMENT '关键点',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_category` (`category`),
  KEY `idx_difficulty` (`difficulty`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='面试题库表';
```

### 8.5 virtual_interview_sessions - 虚拟面试会话表

```sql
CREATE TABLE `virtual_interview_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  `session_id` VARCHAR(100) NOT NULL COMMENT '会话标识',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `position` VARCHAR(100) NOT NULL COMMENT '职位',
  `interview_type` VARCHAR(50) NOT NULL COMMENT '面试类型',
  `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL COMMENT '难度',
  `start_time` TIMESTAMP NOT NULL COMMENT '开始时间',
  `end_time` TIMESTAMP NULL DEFAULT NULL COMMENT '结束时间',
  `status` ENUM('in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'in_progress' COMMENT '状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_id` (`session_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_interview_session_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='虚拟面试会话表';
```

### 8.6 virtual_interview_answers - 虚拟面试答案表

```sql
CREATE TABLE `virtual_interview_answers` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '答案ID',
  `session_id` BIGINT UNSIGNED NOT NULL COMMENT '会话ID',
  `question_id` BIGINT UNSIGNED NOT NULL COMMENT '题目ID',
  `answer` TEXT NOT NULL COMMENT '答案',
  `audio_url` VARCHAR(500) DEFAULT NULL COMMENT '语音答案URL',
  `score` INT DEFAULT NULL COMMENT '得分',
  `feedback` JSON DEFAULT NULL COMMENT '反馈',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_question_id` (`question_id`),
  CONSTRAINT `fk_interview_answer_session` FOREIGN KEY (`session_id`) REFERENCES `virtual_interview_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_interview_answer_question` FOREIGN KEY (`question_id`) REFERENCES `interview_questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='虚拟面试答案表';
```

### 8.7 virtual_interview_reports - 虚拟面试报告表

```sql
CREATE TABLE `virtual_interview_reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '报告ID',
  `session_id` BIGINT UNSIGNED NOT NULL COMMENT '会话ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `overall_score` INT NOT NULL COMMENT '总分',
  `performance_by_type` JSON NOT NULL COMMENT '各类型表现',
  `strengths` JSON DEFAULT NULL COMMENT '优势',
  `weaknesses` JSON DEFAULT NULL COMMENT '劣势',
  `suggestions` JSON DEFAULT NULL COMMENT '建议',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_session_id` (`session_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_interview_report_session` FOREIGN KEY (`session_id`) REFERENCES `virtual_interview_sessions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_interview_report_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='虚拟面试报告表';
```

### 8.8 job_postings - 职位信息表

```sql
CREATE TABLE `job_postings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '职位ID',
  `title` VARCHAR(200) NOT NULL COMMENT '职位标题',
  `company_id` BIGINT UNSIGNED NOT NULL COMMENT '公司ID',
  `location` VARCHAR(100) NOT NULL COMMENT '工作地点',
  `salary` VARCHAR(50) DEFAULT NULL COMMENT '薪资范围',
  `experience` VARCHAR(50) DEFAULT NULL COMMENT '经验要求',
  `education` VARCHAR(50) DEFAULT NULL COMMENT '学历要求',
  `type` ENUM('full_time', 'part_time', 'internship', 'contract') NOT NULL COMMENT '工作类型',
  `tags` JSON DEFAULT NULL COMMENT '标签',
  `description` TEXT NOT NULL COMMENT '职位描述',
  `requirements` JSON NOT NULL COMMENT '任职要求',
  `responsibilities` JSON NOT NULL COMMENT '工作职责',
  `benefits` JSON DEFAULT NULL COMMENT '福利待遇',
  `publish_time` TIMESTAMP NOT NULL COMMENT '发布时间',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态：1-招聘中，0-已关闭',
  `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `application_count` INT NOT NULL DEFAULT 0 COMMENT '申请人数',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_company_id` (`company_id`),
  KEY `idx_location` (`location`),
  KEY `idx_type` (`type`),
  KEY `idx_publish_time` (`publish_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='职位信息表';
```

### 8.9 companies - 公司信息表

```sql
CREATE TABLE `companies` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '公司ID',
  `name` VARCHAR(200) NOT NULL COMMENT '公司名称',
  `logo` VARCHAR(500) DEFAULT NULL COMMENT '公司Logo',
  `scale` VARCHAR(50) DEFAULT NULL COMMENT '公司规模',
  `industry` VARCHAR(100) DEFAULT NULL COMMENT '所属行业',
  `description` TEXT COMMENT '公司介绍',
  `website` VARCHAR(200) DEFAULT NULL COMMENT '公司网站',
  `address` VARCHAR(255) DEFAULT NULL COMMENT '公司地址',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`),
  KEY `idx_industry` (`industry`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='公司信息表';
```

### 8.10 job_applications - 职位申请表

```sql
CREATE TABLE `job_applications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `job_id` BIGINT UNSIGNED NOT NULL COMMENT '职位ID',
  `resume_id` BIGINT UNSIGNED NOT NULL COMMENT '简历ID',
  `cover_letter` TEXT COMMENT '求职信',
  `apply_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  `status` ENUM('pending', 'viewed', 'interviewed', 'offered', 'rejected', 'accepted', 'declined') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `timeline` JSON DEFAULT NULL COMMENT '进度时间轴',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_job` (`user_id`, `job_id`),
  KEY `idx_job_id` (`job_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_application_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_application_job` FOREIGN KEY (`job_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_application_resume` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='职位申请表';
```

---

## 9. 成长中心相关表

### 9.1 growth_records - 成长记录表

```sql
CREATE TABLE `growth_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `date` DATE NOT NULL COMMENT '日期',
  `type` VARCHAR(50) NOT NULL COMMENT '类型',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `description` TEXT COMMENT '描述',
  `icon` VARCHAR(50) DEFAULT NULL COMMENT '图标',
  `data` JSON DEFAULT NULL COMMENT '附加数据',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_date` (`date`),
  KEY `idx_type` (`type`),
  CONSTRAINT `fk_growth_record_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='成长记录表';
```

### 9.2 milestones - 里程碑表

```sql
CREATE TABLE `milestones` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '里程碑ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `description` TEXT NOT NULL COMMENT '描述',
  `requirements` JSON NOT NULL COMMENT '达成要求',
  `rewards` JSON DEFAULT NULL COMMENT '奖励',
  `order_num` INT NOT NULL COMMENT '排序号',
  `icon` VARCHAR(500) DEFAULT NULL COMMENT '图标',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order` (`order_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='里程碑表';
```

### 9.3 user_milestones - 用户里程碑表

```sql
CREATE TABLE `user_milestones` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `milestone_id` BIGINT UNSIGNED NOT NULL COMMENT '里程碑ID',
  `status` ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `progress` INT NOT NULL DEFAULT 0 COMMENT '进度百分比',
  `completed_time` TIMESTAMP NULL DEFAULT NULL COMMENT '完成时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_milestone` (`user_id`, `milestone_id`),
  KEY `idx_milestone_id` (`milestone_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_user_milestone_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_milestone_milestone` FOREIGN KEY (`milestone_id`) REFERENCES `milestones` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户里程碑表';
```

### 9.4 badges - 徽章表

```sql
CREATE TABLE `badges` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '徽章ID',
  `name` VARCHAR(100) NOT NULL COMMENT '徽章名称',
  `description` TEXT NOT NULL COMMENT '描述',
  `icon` VARCHAR(500) NOT NULL COMMENT '图标',
  `category` VARCHAR(50) NOT NULL COMMENT '类别',
  `rarity` ENUM('common', 'rare', 'epic', 'legendary') NOT NULL DEFAULT 'common' COMMENT '稀有度',
  `requirements` TEXT NOT NULL COMMENT '获得条件',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_rarity` (`rarity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='徽章表';
```

### 9.5 user_badges - 用户徽章表

```sql
CREATE TABLE `user_badges` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `badge_id` BIGINT UNSIGNED NOT NULL COMMENT '徽章ID',
  `earned_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '获得时间',
  `progress` INT NOT NULL DEFAULT 0 COMMENT '进度百分比',
  `status` ENUM('earned', 'locked') NOT NULL DEFAULT 'locked' COMMENT '状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_badge` (`user_id`, `badge_id`),
  KEY `idx_badge_id` (`badge_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_user_badge_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_badge_badge` FOREIGN KEY (`badge_id`) REFERENCES `badges` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户徽章表';
```

### 9.6 goals - 目标表

```sql
CREATE TABLE `goals` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '目标ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `title` VARCHAR(200) NOT NULL COMMENT '目标标题',
  `description` TEXT COMMENT '目标描述',
  `type` ENUM('short_term', 'long_term') NOT NULL COMMENT '类型',
  `status` ENUM('active', 'completed', 'abandoned') NOT NULL DEFAULT 'active' COMMENT '状态',
  `progress` INT NOT NULL DEFAULT 0 COMMENT '进度百分比',
  `start_date` DATE NOT NULL COMMENT '开始日期',
  `target_date` DATE NOT NULL COMMENT '目标日期',
  `completed_date` DATE DEFAULT NULL COMMENT '完成日期',
  `priority` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium' COMMENT '优先级',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`),
  CONSTRAINT `fk_goal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='目标表';
```

### 9.7 goal_tasks - 目标任务表

```sql
CREATE TABLE `goal_tasks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `goal_id` BIGINT UNSIGNED NOT NULL COMMENT '目标ID',
  `title` VARCHAR(200) NOT NULL COMMENT '任务标题',
  `completed` TINYINT NOT NULL DEFAULT 0 COMMENT '是否完成',
  `completed_date` DATE DEFAULT NULL COMMENT '完成日期',
  `order_num` INT NOT NULL COMMENT '排序号',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_goal_id` (`goal_id`),
  KEY `idx_order` (`order_num`),
  CONSTRAINT `fk_task_goal` FOREIGN KEY (`goal_id`) REFERENCES `goals` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='目标任务表';
```

---

## 10. AI助手相关表

### 10.1 ai_chat_messages - AI聊天消息表

```sql
CREATE TABLE `ai_chat_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `message_id` VARCHAR(100) NOT NULL COMMENT '消息标识',
  `role` ENUM('user', 'assistant', 'system') NOT NULL COMMENT '角色',
  `content` TEXT NOT NULL COMMENT '消息内容',
  `context` JSON DEFAULT NULL COMMENT '上下文信息',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_message_id` (`message_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_chat_message_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI聊天消息表';
```

### 10.2 ai_agents - AI智能体表

```sql
CREATE TABLE `ai_agents` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'AgentID',
  `name` VARCHAR(100) NOT NULL COMMENT 'Agent名称',
  `description` TEXT NOT NULL COMMENT '描述',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像',
  `type` VARCHAR(50) NOT NULL COMMENT '类型',
  `capabilities` JSON NOT NULL COMMENT '能力列表',
  `is_active` TINYINT NOT NULL DEFAULT 1 COMMENT '是否启用',
  `config` JSON DEFAULT NULL COMMENT '配置信息',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI智能体表';
```

### 10.3 knowledge_base - 知识库表

```sql
CREATE TABLE `knowledge_base` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '知识ID',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `category` VARCHAR(50) NOT NULL COMMENT '类别',
  `summary` TEXT COMMENT '摘要',
  `content` LONGTEXT NOT NULL COMMENT '内容',
  `tags` JSON DEFAULT NULL COMMENT '标签',
  `relevance_score` DECIMAL(5,4) DEFAULT NULL COMMENT '相关性分数',
  `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_created_at` (`created_at`),
  FULLTEXT KEY `ft_title_content` (`title`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识库表';
```

### 10.4 workflows - 工作流表

```sql
CREATE TABLE `workflows` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '工作流ID',
  `name` VARCHAR(200) NOT NULL COMMENT '工作流名称',
  `description` TEXT COMMENT '描述',
  `category` VARCHAR(50) NOT NULL COMMENT '类别',
  `status` ENUM('active', 'inactive', 'draft') NOT NULL DEFAULT 'active' COMMENT '状态',
  `definition` JSON NOT NULL COMMENT '工作流定义',
  `use_count` INT NOT NULL DEFAULT 0 COMMENT '使用次数',
  `created_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '创建者ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工作流表';
```

### 10.5 workflow_executions - 工作流执行记录表

```sql
CREATE TABLE `workflow_executions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '执行ID',
  `execution_id` VARCHAR(100) NOT NULL COMMENT '执行标识',
  `workflow_id` BIGINT UNSIGNED NOT NULL COMMENT '工作流ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `inputs` JSON NOT NULL COMMENT '输入参数',
  `outputs` JSON DEFAULT NULL COMMENT '输出结果',
  `status` ENUM('running', 'completed', 'failed', 'cancelled') NOT NULL DEFAULT 'running' COMMENT '状态',
  `error_message` TEXT DEFAULT NULL COMMENT '错误信息',
  `start_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开始时间',
  `end_time` TIMESTAMP NULL DEFAULT NULL COMMENT '结束时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_execution_id` (`execution_id`),
  KEY `idx_workflow_id` (`workflow_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_execution_workflow` FOREIGN KEY (`workflow_id`) REFERENCES `workflows` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_execution_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='工作流执行记录表';
```

---

## 11. 系统相关表

### 11.1 notifications - 通知表

```sql
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `type` VARCHAR(50) NOT NULL COMMENT '通知类型',
  `title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '内容',
  `is_read` TINYINT NOT NULL DEFAULT 0 COMMENT '是否已读',
  `related_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联ID',
  `related_type` VARCHAR(50) DEFAULT NULL COMMENT '关联类型',
  `data` JSON DEFAULT NULL COMMENT '附加数据',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';
```

### 11.2 files - 文件表

```sql
CREATE TABLE `files` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文件ID',
  `file_id` VARCHAR(100) NOT NULL COMMENT '文件标识',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '上传用户ID',
  `file_name` VARCHAR(255) NOT NULL COMMENT '文件名',
  `file_url` VARCHAR(500) NOT NULL COMMENT '文件URL',
  `file_size` BIGINT NOT NULL COMMENT '文件大小（字节）',
  `mime_type` VARCHAR(100) NOT NULL COMMENT 'MIME类型',
  `type` VARCHAR(50) NOT NULL COMMENT '文件类型',
  `storage_path` VARCHAR(500) NOT NULL COMMENT '存储路径',
  `md5` VARCHAR(32) DEFAULT NULL COMMENT 'MD5值',
  `upload_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_file_id` (`file_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_md5` (`md5`),
  CONSTRAINT `fk_file_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文件表';
```

### 11.3 system_logs - 系统日志表

```sql
CREATE TABLE `system_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '用户ID',
  `action` VARCHAR(100) NOT NULL COMMENT '操作',
  `module` VARCHAR(50) NOT NULL COMMENT '模块',
  `ip_address` VARCHAR(50) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(255) DEFAULT NULL COMMENT '用户代理',
  `request_method` VARCHAR(10) DEFAULT NULL COMMENT '请求方法',
  `request_url` VARCHAR(500) DEFAULT NULL COMMENT '请求URL',
  `request_params` JSON DEFAULT NULL COMMENT '请求参数',
  `response_status` INT DEFAULT NULL COMMENT '响应状态码',
  `error_message` TEXT DEFAULT NULL COMMENT '错误信息',
  `execution_time` INT DEFAULT NULL COMMENT '执行时间（毫秒）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_module` (`module`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统日志表';
```

### 11.4 system_settings - 系统设置表

```sql
CREATE TABLE `system_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '设置ID',
  `key` VARCHAR(100) NOT NULL COMMENT '设置键',
  `value` TEXT NOT NULL COMMENT '设置值',
  `type` VARCHAR(50) NOT NULL COMMENT '类型',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '描述',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统设置表';
```

### 11.5 semesters - 学期表

```sql
CREATE TABLE `semesters` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '学期ID',
  `name` VARCHAR(100) NOT NULL COMMENT '学期名称',
  `start_date` DATE NOT NULL COMMENT '开始日期',
  `end_date` DATE NOT NULL COMMENT '结束日期',
  `weeks` INT NOT NULL COMMENT '周数',
  `is_current` TINYINT NOT NULL DEFAULT 0 COMMENT '是否当前学期',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  KEY `idx_is_current` (`is_current`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学期表';
```

---

## 附录

### A. 数据字典

#### 用户角色说明
- `student`: 学生
- `teacher`: 教师
- `admin`: 管理员

#### 考勤状态说明
- `present`: 出勤
- `late`: 迟到
- `absent`: 缺勤
- `leave`: 请假

#### 作业状态说明
- `pending`: 待提交
- `submitted`: 已提交
- `graded`: 已批改

#### 课程状态说明
- `enrolled`: 已选课
- `dropped`: 已退课
- `completed`: 已完成

### B. 索引说明

1. **主键索引**: 所有表都使用自增的 `id` 作为主键
2. **唯一索引**: 用于保证数据唯一性（如用户名、学号等）
3. **普通索引**: 用于提高查询性能（如外键、状态字段、日期字段等）
4. **全文索引**: 用于全文搜索（如知识库内容）

### C. 外键约束说明

所有外键约束均设置为 `ON DELETE CASCADE`，即主表记录删除时，关联的从表记录也会被删除。这确保了数据的一致性，但在实际使用中需要谨慎删除操作。

### D. JSON字段说明

项目中大量使用了 JSON 类型字段来存储灵活的、结构化的数据，如：
- 课程章节的 `periods`（节次）
- 简历的各个模块（教育经历、工作经历等）
- 能力维度数据
- 评价维度数据
- 通知的附加数据

使用 JSON 类型的优势：
1. 灵活性高，易于扩展
2. 避免过多关联表
3. 查询效率较高

### E. 软删除说明

重要的数据表（如用户、课程、作业、简历等）都实现了软删除功能，通过 `deleted_at` 字段标记删除时间。软删除的数据可以被恢复，提高了数据的安全性。

### F. 时间戳说明

所有表都包含以下时间字段：
- `created_at`: 记录创建时间，默认为当前时间
- `updated_at`: 记录更新时间，自动更新为当前时间
- `deleted_at`: 软删除时间（可选）

### G. 字符集说明

数据库统一使用 `utf8mb4` 字符集和 `utf8mb4_unicode_ci` 排序规则，以支持：
1. 完整的 Unicode 字符集（包括 Emoji）
2. 正确的中文排序
3. 多语言支持

---

**文档版本：** v1.0  
**更新日期：** 2025-12-18  
**维护者：** 开发团队  
**备注：** 本文档描述的是数据库表结构设计，实际开发中可能需要根据具体需求进行调整。
