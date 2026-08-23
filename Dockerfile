# 李泽延 · AI 产品经理 个人网站 — 全栈构建镜像
# 前端 (React/Vite) + 后端 (Hono + tRPC) + Drizzle ORM
# 构建: docker build -t lzy-portfolio .
# 运行: docker run -p 3000:3000 --env-file .env lzy-portfolio

FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/db ./db
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/contracts ./contracts
EXPOSE 3000
# 首次启动前执行: npm run db:push (或 db:migrate) 同步数据库表结构
CMD ["npm", "start"]
