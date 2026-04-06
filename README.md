# 网页版贪吃蛇游戏 (snake-game)

一款基于 React + Supabase 开发的、具有霓虹美学风格的现代网页版贪吃蛇游戏。

## 核心功能

- **沉浸式游戏体验**：霓虹光感界面，平滑的蛇体移动逻辑。
- **用户系统**：
  - **身份验证**：注册与登录功能，支持测试模式（IS_TEST_MODE）无缝预览。
  - **个人中心**：查看历史得分与个人成就。
- **全局排行榜**：实时拉取 Supabase 数据库中的最高分数据，展示顶尖玩家排名。
- **现代化架构**：
  - 使用 React Router 实现多页面无缝导航。
  - 路由守卫机制，确保非登录用户无法访问受保护页面。
  - 响应式布局，适配多种显示终端。

## 技术选型

- **前端框架**：React 19, Vite 8
- **后端服务**：Supabase (身份验证, 实时数据库)
- **状态管理**：React Context API
- **路由方案**：React Router 7
- **语言**：TypeScript

## 环境配置

运行前请确保在项目根目录（或对应环境变量文件中）配置了 Supabase 相关信息：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 运行与部署

### 开发服务器
```bash
npm install
npm run dev
```

### 构建与预览
```bash
npm run build
npm run preview
```

## 核心文件结构

```text
src/
├── components/      # UI 组件（Layout, Navigation 等）
├── contexts/        # 状态管理（如 AuthContext）
├── pages/           # 页面级组件（Game, Login, Leaderboard）
├── lib/             # 工具类与第三方集成（如 supabase 客户端）
└── App.tsx          # 路由与应用入口
```

## 开发遵循
本项目严格遵守 `GEMINI.md` 定义的工程规则，确保组件职责单一、逻辑与展示分离、以及高度的安全性。
