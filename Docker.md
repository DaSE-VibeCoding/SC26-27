# Docker Documentation

## 项目容器化说明

本文档提供了 GrowMate 项目的完整 Docker 容器化方案，确保不同环境下的部署一致性和便捷性。

## 快速开始

### 1. 环境要求

- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 18.0 (用于本地开发)

### 2. 一键启动

```bash
# 克隆项目
git clone https://github.com/JenniferJJiang/GrowMate.git
cd GrowMate

# 使用 Docker Compose 启动
docker-compose up -d
```

应用将在 http://localhost:3000 上运行。

## 详细部署说明

### 方案一：Docker Compose（推荐）

#### 1. 编写 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./dev.db
      - JWT_SECRET=your-jwt-secret-key
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    restart: unless-stopped

  # 开发环境服务
  app-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./dev.db
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev
    profiles:
      - dev
```

#### 2. 生产环境 Dockerfile

```dockerfile
# 多阶段构建
FROM node:18-alpine AS deps
WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/web/prisma ./apps/web/prisma/

# 安装依赖
RUN npm ci --only=production

# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 复制依赖
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# 安装所有依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产环境
FROM node:18-alpine AS runner
WORKDIR /app

# 创建用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/prisma ./prisma

# 设置权限
RUN chown -R nextjs:nodejs /app
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 启动应用
CMD ["node", "server.js"]
```

#### 3. 开发环境 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 开发模式启动
CMD ["npm", "run", "dev"]
```

### 方案二：单独 Docker 容器

#### 1. 构建镜像

```bash
# 构建生产镜像
docker build -t growmate:latest .

# 构建开发镜像
docker build -f Dockerfile.dev -t growmate:dev .
```

#### 2. 运行容器

```bash
# 生产环境运行
docker run -d \
  --name growmate \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=file:./dev.db \
  -v $(pwd)/data:/app/data \
  growmate:latest

# 开发环境运行
docker run -it \
  --name growmate-dev \
  -p 3000:3000 \
  -e NODE_ENV=development \
  -v $(pwd):/app \
  growmate:dev
```

## 环境变量配置

### 必需变量

```bash
# 数据库配置
DATABASE_URL=file:./dev.db  # SQLite 开发环境
# 生产环境使用 PostgreSQL:
# DATABASE_URL=postgresql://username:password@localhost:5432/growmate

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 应用配置
NODE_ENV=development
PORT=3000
```

### 可选变量

```bash
# 邮件服务
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 文件上传
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

## 数据持久化

### 1. 数据卷管理

```bash
# 创建数据卷
docker volume create growmate-data
docker volume create growmate-uploads

# 使用数据卷运行
docker run -d \
  --name growmate \
  -v growmate-data:/app/data \
  -v growmate-uploads:/app/uploads \
  growmate:latest
```

### 2. 数据备份

```bash
# 备份数据库
docker exec growmate sh -c 'sqlite3 /app/data/dev.db ".backup backup.sql"'

# 复制备份文件
docker cp growmate:/app/backup.sql ./backup/
```

## 开发工作流

### 1. 本地开发 + Docker

```bash
# 启动数据库服务
docker-compose up -d postgres

# 本地开发应用
npm run dev
```

### 2. Docker 开发环境

```bash
# 使用开发镜像
docker-compose --profile dev up app-dev

# 实时查看日志
docker-compose logs -f app-dev
```

### 3. 测试环境

```bash
# 构建测试镜像
docker build -f Dockerfile.test -t growmate:test .

# 运行测试
docker run --rm growmate:test
```

## 监控和日志

### 1. 日志管理

```bash
# 查看实时日志
docker-compose logs -f app

# 查看特定服务日志
docker logs growmate

# 导出日志
docker logs growmate > app.log
```

### 2. 健康检查

```yaml
# 在 docker-compose.yml 中添加健康检查
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 生产部署

### 1. 使用 Docker Compose 部署

```bash
# 生产环境部署
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 查看服务状态
docker-compose ps
```

### 2. 使用 Docker Swarm

```bash
# 初始化 Swarm
docker swarm init

# 部署服务
docker stack deploy -c docker-compose.yml growmate
```

### 3. 使用 Kubernetes

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: growmate
spec:
  replicas: 3
  selector:
    matchLabels:
      app: growmate
  template:
    metadata:
      labels:
        app: growmate
    spec:
      containers:
      - name: growmate
        image: growmate:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: growmate-secret
              key: database-url
```

## 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3000
   
   # 使用不同端口
   docker run -p 3001:3000 growmate:latest
   ```

2. **权限问题**
   ```bash
   # 修复文件权限
   docker exec growmate chown -R nextjs:nodejs /app
   ```

3. **内存不足**
   ```bash
   # 限制内存使用
   docker run -m 512m growmate:latest
   ```

### 调试技巧

```bash
# 进入容器调试
docker exec -it growmate sh

# 查看容器资源使用
docker stats growmate

# 清理未使用的镜像
docker system prune
```

## 安全考虑

1. **使用非 root 用户运行容器**
2. **定期更新基础镜像**
3. **使用 secrets 管理敏感信息**
4. **启用镜像扫描**
5. **限制容器资源使用**

## 性能优化

1. **多阶段构建** 减少镜像大小
2. **使用缓存层** 优化构建速度
3. **负载均衡** 使用多个实例
4. **资源限制** 防止资源滥用

---

*最后更新：2026年7月18日*

## 相关链接

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Next.js Docker 部署指南](https://nextjs.org/docs/pages/api-reference/next-config-js/output)