# 📋 智能任务看板

基于 **Vue 3 + TypeScript + Supabase** 构建的多用户任务管理工具。支持账户隔离、三列看板、实时统计，开箱即用。

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🔐 账户系统 | 邮箱注册/登录，Supabase Auth 鉴权，会话持久化 |
| 📊 三列看板 | 待办 → 进行中 → 已完成，按钮自由流转 |
| 🏷️ 优先级 | 高🔴 / 中🟡 / 低🟢 三级，卡片左侧色条标识 |
| 📈 统计面板 | 四维统计卡片 + 渐变进度条，看板数据一目了然 |
| 🔍 搜索筛选 | 标题/描述关键词搜索，按状态标签页过滤 |
| 💾 云端存储 | Supabase PostgreSQL 持久化，多设备数据同步 |
| 🔒 数据隔离 | Row Level Security 行级安全，用户数据互不干扰 |
| 🎨 暗色主题 | 深蓝灰科技风 UI，护眼暗色模式 |
| 📱 响应式 | 适配手机、平板、桌面三端 |
| ✨ 动画 | 页面切换淡入淡出，卡片进出弹性动画 |
| 📷 联系名片 | 右下角浮动二维码，点击灯箱放大 |

## 🛠 技术栈

| 层次 | 技术 |
|------|------|
| 框架 | Vue 3.5 (Composition API + `<script setup>`) |
| 语言 | TypeScript 6 |
| 构建 | Vite 8 |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 5 |
| 后端 | Supabase (Auth + PostgreSQL + RLS) |
| 测试 | Vitest 4 |
| 部署 | Vercel (推荐) / Netlify / 任意静态托管 |

## 🚀 快速开始

### 1. 创建 Supabase 项目

1. 前往 [supabase.com/dashboard](https://supabase.com/dashboard) 注册/登录
2. 点击 **New Project**，填写项目名称，设置数据库密码
3. 等待项目创建完成后，进入 **Settings > API**
4. 复制 **Project URL** 和 **anon public key**

### 2. 创建数据库表

在 Supabase Dashboard 中打开 **SQL Editor**，执行以下 SQL：

```sql
-- 任务表
CREATE TABLE tasks (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  desc       TEXT DEFAULT '',
  status     TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  priority   TEXT DEFAULT 'mid' CHECK (priority IN ('low', 'mid', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 行级安全：用户只能操作自己的任务
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_own_tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 用户资料表
CREATE TABLE profiles (
  id         BIGSERIAL PRIMARY KEY,
  user_id    UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username   TEXT NOT NULL,
  is_admin   BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own_profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 管理员函数：获取所有用户
CREATE OR REPLACE FUNCTION admin_list_users()
RETURNS TABLE(uid UUID, uname TEXT, ucreated_at TIMESTAMPTZ)
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY SELECT p.user_id, p.username, p.created_at FROM profiles p ORDER BY p.created_at DESC;
END;
$$;

-- 管理员函数：获取指定用户的任务
CREATE OR REPLACE FUNCTION admin_get_user_tasks(target_user_id UUID)
RETURNS SETOF tasks
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  RETURN QUERY SELECT * FROM tasks WHERE user_id = target_user_id ORDER BY created_at DESC;
END;
$$;

-- 管理员函数：更新任意任务
CREATE OR REPLACE FUNCTION admin_update_task(
  task_id     BIGINT,
  new_title   TEXT,
  new_desc    TEXT,
  new_status  TEXT,
  new_priority TEXT
) RETURNS void
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE tasks SET title = new_title, "desc" = new_desc, status = new_status, priority = new_priority WHERE id = task_id;
END;
$$;

-- 管理员函数：删除任意任务
CREATE OR REPLACE FUNCTION admin_delete_task(task_id BIGINT)
RETURNS void
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  DELETE FROM tasks WHERE id = task_id;
END;
$$;

-- 关闭邮箱验证（让用户名注册立即可用，无需验证邮箱）
-- 在 Supabase Dashboard > Authentication > Settings 中：
-- 把 "Confirm email" 关掉 / 或保持开启但用户无需验证也能登录
```

### 3. 配置环境变量

```bash
git clone <your-repo-url> smart-kanban
cd smart-kanban

# 复制环境变量模板
cp .env.example .env
```

编辑 `.env` 文件：
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. 启动开发服务器

```bash
npm install
npm run dev
```

访问 `http://localhost:5173`，注册账户即可使用。

## 📦 部署

### Vercel (推荐)

1. 将项目推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)，导入 GitHub 仓库
3. 构建设置：
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. 在 **Environment Variables** 中添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. 点击 Deploy

部署完成后，在 Supabase Dashboard **Authentication > URL Configuration** 中将 Site URL 设置为你的 Vercel 域名。

### 其他平台

本项目是纯前端 SPA，`npm run build` 后 `dist/` 目录可部署到任何静态托管服务（Netlify、GitHub Pages、Cloudflare Pages 等）。

## 📁 项目结构

```
src/
├── lib/
│   └── supabase.ts          # Supabase 客户端单例
├── stores/
│   ├── auth.ts              # 认证状态（登录/注册/登出/session）
│   └── tasks.ts             # 任务 CRUD + 统计 + 数据迁移
├── components/
│   └── FloatingQR.vue       # 右下角浮动二维码名片
├── views/
│   ├── HomeView.vue         # 🔥 看板主页（统计+三列+搜索+新建）
│   ├── LoginView.vue        # 登录页
│   ├── RegisterView.vue     # 注册页
│   └── AboutView.vue        # 关于页
├── router/
│   └── index.ts             # 路由配置 + 认证守卫
├── App.vue                  # 根组件（顶栏+用户菜单+布局）
└── main.ts                  # 入口（初始化 Pinia + Auth + Router）
```

## 🔧 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 (HMR) |
| `npm run build` | 类型检查 + 生产构建 |
| `npm run preview` | 预览生产构建 |
| `npm run test:unit` | 运行单元测试 |

## 📝 License

MIT

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
