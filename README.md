# GrowMate

DaSE 2026 暑期学校 **SC26-27** 小组项目。

陪你成长型综合社区平台：学习成长系统 + AI 个人档案/陪伴聊天 + 垂直社区与日记情绪记录。

## 功能概览

- **学习成长**：健身 / 营养 / 技术 / 心理四大模块；技术课程按课时组织（理论 + 代码 + 练习），进度与笔记持久化
- **AI 能力**：个人档案分析、陪伴式对话、智能推荐
- **社区与记录**：社区发帖、成长日记、情绪打卡
- **附加原型**：`GrowMate-upload-package/` 内含 AI 多层标签日记网页端原型（Flask）

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | Next.js 15 · TypeScript · Tailwind CSS |
| 后端 | Next.js Route Handlers · Prisma · SQLite |
| AI | OpenAI 兼容 API（可选） |

## 快速开始

环境要求：Node.js 18+

```bash
# 安装依赖、生成 Prisma Client、推送数据库结构并写入演示数据
npm run setup

# 启动开发服务器
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)

演示账号：

- 邮箱：`demo@growmate.app`
- 密码：`demo123456`

首次运行前可复制环境变量模板：

```bash
copy apps\web\.env.example apps\web\.env
```

默认 `DATABASE_URL=file:./dev.db`。如需 AI 功能，在 `.env` 中配置 `OPENAI_API_KEY`（及可选 `OPENAI_BASE_URL`）。

## 常用命令

```bash
npm run dev          # 开发
npm run build        # 构建
npm run start        # 生产启动
npm run db:generate  # Prisma generate
npm run db:push      # 同步数据库结构
npm run db:seed      # 种子数据
```

## 仓库结构

```text
GrowMate/
├── apps/web/                 # 主应用（Next.js）
├── docs/                     # 用户手册、API、部署等文档
├── GrowMate-upload-package/  # AI 日记网页端独立原型
├── package.json              # monorepo 根脚本
└── SKILL.md                  # 一句话自我画像 Skill 说明
```

## 文档

- [用户手册与测试指南](./docs/USER_MANUAL.md)
- [API 文档](./docs/API.md)
- [部署指南](./docs/DEPLOYMENT.md)
- [贡献指南](./docs/CONTRIBUTING.md)

## 相关链接

- 课程小组仓库：https://github.com/DaSE-VibeCoding/SC26-27
- 开发仓库：https://github.com/Hughpig/GrowMate

## 许可证

见 [LICENSE](./LICENSE)。
