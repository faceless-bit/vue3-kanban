# 智能任务看板

基于 **Vue 3 + TypeScript + Supabase** 构建的多用户云端任务管理工具。支持账户隔离、三列看板、实时统计、PWA 安装、Android APK，开箱即用。

> 🌐 在线体验：[vue3-kanban.pages.dev](https://vue3-kanban.pages.dev)

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 👤 账户系统 | 用户名注册/登录，Supabase Auth 鉴权，会话持久化 |
| 📋 三列看板 | 待办 → 进行中 → 已完成，按钮自由流转 |
| 🔴🟡🟢 优先级 | 高 / 中 / 低 三级，卡片左侧色条标识 |
| 📊 统计面板 | 四维统计卡片 + 进度条，看板数据一目了然 |
| 🔍 搜索筛选 | 标题/描述关键词搜索，按状态标签页过滤 |
| ☁️ 云端存储 | Supabase PostgreSQL 持久化，多设备数据同步 |
| 🔒 数据隔离 | Row Level Security 行级安全，用户数据互不干扰 |
| 🌙 暗色主题 | 深色科技风 UI，护眼暗色模式 |
| 📱 响应式 | 适配手机、平板、桌面三端 |
| ✨ 动画过渡 | 页面切换淡入淡出，卡片进出弹性动画 |
| 🛡️ 管理后台 | 管理员查看/管理所有用户任务 |
| 📲 PWA | 浏览器一键安装到桌面，离线可用 |
| 🤖 Android App | Capacitor 打包原生 APK，下载即装 |

## 🛠 技术栈

| 层次 | 技术 |
|------|------|
| 框架 | Vue 3.5 (Composition API) |
| 语言 | TypeScript |
| 构建 | Vite 8 |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 5 |
| 后端 | Supabase (Auth + PostgreSQL + RLS) |
| 移动端 | Capacitor (Android WebView) |
| PWA | vite-plugin-pwa + Workbox |
| 部署 | Cloudflare Pages |

## 🚀 快速开始

### 1. 创建 Supabase 项目

1. 前往 [supabase.com/dashboard](https://supabase.com/dashboard) 注册/登录
2. 点击 **New Project**，填写项目名称，设置数据库密码
3. 进入 **Settings > API**，复制 **Project URL** 和 **anon public key**

### 2. 创建数据库表

在 Supabase Dashboard 中打开 **SQL Editor**，执行：

```sql
-- 任务表
CREATE TABLE tasks (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT DEFAULT '',
  status      TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  priority    TEXT DEFAULT 'mid' CHECK (priority IN ('low', 'mid', 'high')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 行级安全
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

-- 管理员函数
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

CREATE OR REPLACE FUNCTION admin_update_task(
  task_id BIGINT, new_title TEXT, new_desc TEXT,
  new_status TEXT, new_priority TEXT
) RETURNS void
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  UPDATE tasks SET title = new_title, description = new_desc, status = new_status, priority = new_priority WHERE id = task_id;
END;
$$;

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
```

### 3. 配置并启动

```bash
git clone https://github.com/faceless-bit/vue3-kanban.git
cd vue3-kanban

# 安装依赖
npm install

# 创建 .env 文件，填入 Supabase 配置
cp .env.example .env
```

编辑 `.env`：
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

```bash
# 启动开发服务器
npm run dev
```

访问 `http://localhost:5173`，注册账户即可使用。

## 📱 构建 Android APK

```bash
# 1. 构建前端
npm run build-only

# 2. 同步到 Capacitor
npx cap sync android

# 3. 构建 APK（需要 JDK 21 + Android SDK 35）
cd android
export JAVA_HOME="/path/to/jdk-21"
./gradlew assembleDebug

# APK 输出：android/app/build/outputs/apk/debug/app-debug.apk
```

## 🌐 部署

项目已部署在 **Cloudflare Pages**：[vue3-kanban.pages.dev](https://vue3-kanban.pages.dev)

也支持部署到任何静态托管：

| 平台 | 构建命令 | 输出目录 |
|------|---------|---------|
| Cloudflare Pages | `npm run build` | `dist` |
| Vercel | `npm run build` | `dist` |
| Netlify | `npm run build` | `dist` |
| GitHub Pages | `npm run build` | `dist` |

记得在部署平台配置环境变量 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`。

## 📁 项目结构

```
src/
├── lib/
│   └── supabase.ts              # Supabase 客户端
├── stores/
│   ├── auth.ts                  # 认证状态（登录/注册/登出）
│   └── tasks.ts                 # 任务 CRUD + 统计 + 管理员操作
├── components/
│   ├── AppIcon.vue              # SVG 图标组件（30+ 图标）
│   └── FloatingQR.vue           # 右下角浮动联系名片
├── views/
│   ├── HomeView.vue             # 看板主页（统计+三列+搜索+新建）
│   ├── LoginView.vue            # 登录页（新用户自动注册）
│   ├── RegisterView.vue         # 注册页
│   ├── AdminView.vue            # 管理后台
│   └── AboutView.vue            # 关于页
├── router/
│   └── index.ts                 # 路由配置 + 认证守卫
├── App.vue                      # 根组件（顶栏+导航+布局）
└── main.ts                      # 入口
```

## 📄 License

MIT © 2026

---

Built with [Claude Code](https://claude.com/claude-code)
