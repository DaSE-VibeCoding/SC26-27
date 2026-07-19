# API 一览（MVP）

## Auth

- `POST /api/auth/register` { email, password, displayName }
- `POST /api/auth/login` { email, password }
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Journal

- `GET /api/journal`
- `POST /api/journal` { title, content, mood?, tags?, isPrivate? }

## Mood

- `GET /api/mood`
- `POST /api/mood` { score, energy?, stress?, note? }

## AI

- `GET /api/ai/profile`
- `POST /api/ai/profile` 刷新画像
- `POST /api/ai/chat` { message }

## Community

- `GET /api/posts?community=slug`
- `POST /api/posts` { communitySlug, title, content, isAnonymous? }

## Courses

- `GET /api/courses` — 返回所有课程模块及课程，含 `lessons`（课时数组，每课时含 `content`/`codeExamples`/`exercises`）和用户进度 `progress`（`status`/`notes`/`studyTime`）
- `POST /api/courses` — 更新课程进度

  | 字段 | 类型 | 必填 | 说明 |
  |------|------|------|------|
  | `courseId` | string | 是 | 课程 ID |
  | `status` | string | 否 | `not_started` / `in_progress` / `completed` |
  | `notes` | string | 否 | 学习笔记内容 |
  | `studyTime` | number | 否 | 累计学习时长（秒） |

### 课程数据结构

```json
{
  "id": "course_id",
  "title": "Linux 基础入门",
  "summary": "学习 Linux 操作系统的基本概念和常用命令",
  "level": "beginner",
  "durationMin": 45,
  "lessons": [
    {
      "title": "第一课：Linux 系统概述与文件操作",
      "content": "理论知识内容...",
      "codeExamples": [
        { "title": "文件与目录操作", "description": "...", "code": "..." }
      ],
      "exercises": [
        { "question": "...", "hint": "...", "answer": "..." }
      ]
    }
  ],
  "order": 1,
  "progress": {
    "status": "not_started",
    "notes": "",
    "studyTime": 0
  }
}
```
