# Agent Documentation

## 项目概述

GrowMate 是一个陪伴成长型综合社区平台，集成了 AI 个人档案、多领域成长赋能和垂直陪伴社区功能。该项目采用 Next.js + TypeScript + Prisma + SQLite 技术栈。

## Agent 操作指南

### 1. 环境准备

```bash
# 克隆仓库
git clone https://github.com/JenniferJJiang/GrowMate.git
cd GrowMate

# 安装依赖
npm install

# 设置环境变量
cp apps/web/.env.example apps/web/.env
# 编辑 .env 文件，配置数据库等信息
```

### 2. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库 schema
npm run db:push

# 填充初始数据
npm run db:seed
```

### 3. 开发环境启动

```bash
# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看应用。

### 4. 项目结构

```
GrowMate/
├── apps/web/                 # Next.js 应用
│   ├── src/
│   │   ├── app/             # App Router 页面
│   │   ├── components/      # React 组件
│   │   ├── lib/            # 工具库和配置
│   │   └── ...
│   ├── prisma/             # 数据库 schema
│   └── ...
├── docs/                   # 项目文档
├── tools/                  # 工具脚本
└── ...
```

### 5. 核心功能模块

#### 学习模块 (`/learn`)
- **技术学习** - Linux/Python/自动化/AI 入门课程
- **体能训练** - 居家/户外训练、体态矫正
- **营养搭配** - 饮食搭配、健康饮食指导
- **心理健康** - 情绪疏导、认知调整

#### 主要功能
- 📊 学习进度追踪
- 🎯 个性化学习建议
- 🏆 成就系统
- 📝 学习笔记
- ⏱️ 学习计时器
- 📈 数据分析

### 6. 开发指南

#### 添加新课程模块

1. 在 `prisma/schema.prisma` 中添加新的课程模块
2. 在 `src/lib/utils.ts` 中添加模块元数据
3. 创建对应的页面组件
4. 更新导航配置

#### 添加新功能组件

1. 在 `src/components/` 目录下创建新组件
2. 遵循现有的命名约定和样式规范
3. 使用 Tailwind CSS 进行样式设计
4. 确保组件是客户端或服务端组件的正确类型

#### 数据库操作

```bash
# 查看数据库
npm run db:studio

# 重新生成数据库
npm run db:generate && npm run db:push
```

### 7. 部署说明

#### 本地部署
```bash
npm run build
npm run start
```

#### Docker 部署（详见 Docker.md）

### 8. 测试账号

- 邮箱：demo@growmate.app
- 密码：demo123456

### 9. 常见问题

#### Q: 如何添加新的课程内容？
A: 在数据库中添加新的课程记录，或通过管理界面（如果有的话）添加。

#### Q: 如何修改主题样式？
A: 修改 `src/app/globals.css` 文件中的 CSS 变量和样式定义。

#### Q: 如何扩展认证系统？
A: 在 `src/lib/auth.ts` 中添加新的认证方法，更新相关组件。

### 10. 开发最佳实践

- 使用 TypeScript 进行类型安全开发
- 遵循 React 18 的最佳实践
- 使用 Prisma 进行数据库操作
- 保持组件的单一职责原则
- 使用 Tailwind CSS 进行样式开发
- 编写清晰的代码注释

### 11. 联系方式

如有问题，请通过 GitHub Issues 联系项目维护者。

---

*最后更新：2026年7月18日*