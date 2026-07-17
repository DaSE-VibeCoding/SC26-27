# GrowMate - 陪伴成长型综合社区平台

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

GrowMate 是一个创新的陪伴成长型综合社区平台，结合了 AI 个人档案、多领域成长赋能和垂直陪伴社区功能，为用户提供全方位的成长支持。

## ✨ 核心特性

### 🎯 学习成长系统
- **四大专业模块**：技术学习、体能训练、营养搭配、心理健康
- **智能学习路径**：基于 AI 的个性化课程推荐
- **进度追踪**：可视化学习进度和成就系统
- **学习工具**：计时器、笔记、数据分析

### 🤖 AI 智能功能
- **AI 个人档案**：智能记录和分析成长轨迹
- **AI 陪伴聊天**：24/7 情绪支持和学习指导
- **智能推荐**：基于用户行为的内容推荐
- **语音交互**：自然语言对话体验

### 👥 社区互动
- **垂直社区**：不同领域的专业交流空间
- **成长日记**：记录感悟、复盘和人生经历
- **情绪打卡**：心理健康追踪和疏导
- **经验分享**：用户之间的知识交流

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0
- npm >= 8.0
- SQLite (开发环境) 或 PostgreSQL (生产环境)

### 安装和运行

```bash
# 1. 克隆项目
git clone https://github.com/JenniferJJiang/GrowMate.git
cd GrowMate

# 2. 安装依赖
npm install

# 3. 设置环境变量
cp apps/web/.env.example apps/web/.env
# 编辑 .env 文件配置数据库等信息

# 4. 初始化数据库
npm run db:generate
npm run db:push
npm run db:seed

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看应用。

### 测试账号
- 邮箱：demo@growmate.app
- 密码：demo123456

## 📁 项目结构

```
GrowMate/
├── apps/web/                 # Next.js 主应用
│   ├── src/
│   │   ├── app/             # App Router 页面
│   │   │   ├── (main)/     # 主要页面
│   │   │   │   ├── dashboard/    # 仪表板
│   │   │   │   ├── learn/        # 学习模块
│   │   │   │   ├── journal/       # 成长日记
│   │   │   │   ├── mood/         # 情绪打卡
│   │   │   │   ├── archive/      # AI档案
│   │   │   │   ├── ai/           # AI陪伴
│   │   │   │   └── community/   # 社区
│   │   │   ├── components/      # React 组件
│   │   │   │   ├── ui/          # 基础 UI 组件
│   │   │   │   └── ...         # 业务组件
│   │   │   ├── lib/           # 工具库和配置
│   │   │   └── types/         # TypeScript 类型定义
│   │   ├── prisma/           # 数据库 schema
│   │   └── public/          # 静态资源
│   ├── package.json
│   └── ...
├── docs/                   # 项目文档
│   ├── Agent.md           # Agent 操作指南
│   └── Docker.md          # Docker 部署文档
├── tools/                 # 工具脚本
└── README.md             # 项目说明
```

## 🛠️ 技术栈

### 前端
- **Next.js 15** - React 全栈框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Lucide React** - 现代化图标库
- **React Hook Form** - 表单处理

### 后端
- **Node.js** - JavaScript 运行时
- **Prisma** - 现代数据库 ORM
- **SQLite** - 开发环境数据库
- **PostgreSQL** - 生产环境数据库
- **JWT** - 身份认证
- **bcryptjs** - 密码加密

### AI/ML
- **OpenAI API** - AI 对话和内容生成
- **自然语言处理** - 情绪分析和内容理解

## 📖 文档

- [Agent 操作指南](./Agent.md) - 详细的 Agent 使用和开发指南
- [Docker 部署文档](./Docker.md) - 完整的容器化部署方案
- [API 文档](./docs/api.md) - REST API 接口说明
- [贡献指南](./docs/CONTRIBUTING.md) - 如何参与项目开发

## 🎯 功能模块

### 学习成长
- **技术学习**：Linux、Python、自动化、AI 入门课程
- **体能训练**：居家/户外训练、体态矫正、科学打卡
- **营养搭配**：饮食搭配、减脂增肌、健康作息指导
- **心理健康**：情绪疏导、认知调整、轻量心理监护

### AI 档案系统
- **智能记录**：自动分析用户行为和成长轨迹
- **个性化推荐**：基于用户画像的内容推荐
- **趋势分析**：成长数据可视化和趋势预测
- **目标设定**：SMART 目标设定和追踪

### 社区互动
- **成长日记**：分享感悟、复盘、人生经历
- **情绪心理**：纯情绪出口，倾诉压力与心事
- **运动体能**：训练打卡、健身经验、互相监督
- **技术学习**：编程、Linux、AI 自学交流与答疑

## 🔧 开发指南

### 添加新功能

1. **数据库设计**
   ```bash
   # 更新 Prisma schema
   npx prisma schema
   
   # 生成迁移文件
   npx prisma migrate dev
   ```

2. **前端组件**
   ```typescript
   # 在 src/components/ 目录下创建新组件
   # 遵循现有的命名约定和样式规范
   ```

3. **API 接口**
   ```typescript
   # 在 src/app/api/ 目录下创建新的路由
   # 使用 TypeScript 进行类型定义
   ```

### 代码规范

- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 组件使用函数式编程和 Hooks
- 使用 Tailwind CSS 进行样式开发

### 测试

```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# 端到端测试
npm run test:e2e
```

## 🚀 部署

### 本地部署
```bash
npm run build
npm run start
```

### Docker 部署
```bash
# 使用 Docker Compose
docker-compose up -d

# 或使用 Docker 单独部署
docker build -t growmate:latest .
docker run -d -p 3000:3000 growmate:latest
```

详细部署说明请参考 [Docker.md](./Docker.md)。

## 🤝 贡献

我们欢迎所有形式的贡献！请参考 [贡献指南](./docs/CONTRIBUTING.md)。

### 贡献方式
1. **报告问题**：在 GitHub Issues 中提交 bug 报告
2. **功能建议**：提出新功能或改进建议
3. **代码贡献**：提交 Pull Request
4. **文档改进**：完善项目文档
5. **测试贡献**：编写测试用例

## 📄 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户。

## 📞 联系我们

- **GitHub Issues**：[提交问题](https://github.com/JenniferJJiang/GrowMate/issues)
- **讨论**：[GitHub Discussions](https://github.com/JenniferJJiang/GrowMate/discussions)
- **邮件**：[项目维护者](mailto:contact@growmate.app)

---

*GrowMate · 伴成长 - 记录 · 识人 · 陪伴 · 成长*

*最后更新：2026年7月18日*