<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppIcon from '@/components/AppIcon.vue'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await auth.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <RouterLink to="/" class="brand">
          <span class="brand-icon"><AppIcon name="clipboard" :size="24" /></span>
          <span class="brand-text">智能任务看板</span>
        </RouterLink>
        <nav class="main-nav">
          <RouterLink to="/" class="nav-link">
            <span class="nav-icon"><AppIcon name="chart" :size="18" /></span>
            看板
          </RouterLink>
          <RouterLink to="/about" class="nav-link">
            <span class="nav-icon"><AppIcon name="info" :size="18" /></span>
            关于
          </RouterLink>
        </nav>

        <div v-if="auth.user" class="user-menu">
          <span class="user-name" :title="auth.displayName">
            <AppIcon name="user" :size="14" /> {{ auth.displayName }}
          </span>
          <button class="btn-logout" @click="handleLogout" title="退出登录">
            退出
          </button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style>
/* ========== 全局变量 ========== */
:root {
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-surface-hover: #334155;
  --color-input: #0f172a;
  --color-border: #334155;
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-primary-glow: rgba(99, 102, 241, 0.2);
  --color-text: #e2e8f0;
  --color-text-muted: #94a3b8;
  --color-success: #22c55e;
  --color-warn: #f59e0b;
  --color-danger: #ef4444;
  --radius: 12px;
  --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 20px var(--color-primary-glow);
  --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 性能优化 */
img { content-visibility: auto; }
.card, .task-card, .board-col, [data-section] { will-change: transform, opacity; }

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

#app {
  min-height: 100vh;
}

a {
  text-decoration: none;
  color: inherit;
}

/* ========== 页面切换动画 ========== */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ========== 布局 ========== */
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(30, 41, 59, 0.85);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  transition: var(--transition);
}
.brand:hover { color: var(--color-primary); }
.brand-icon {
  display: flex;
  align-items: center;
  color: var(--color-primary);
}

.main-nav { display: flex; gap: 4px; }

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: var(--transition);
}
.nav-link:hover {
  color: var(--color-text);
  background: var(--color-surface-hover);
}
.nav-link.router-link-exact-active {
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
}
.nav-icon {
  display: flex;
  align-items: center;
}
/* ========== 用户菜单 ========== */
.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-size: 0.82rem;
  color: var(--color-text);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-logout {
  padding: 6px 14px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);
}
.btn-logout:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.08);
}

.app-main {
  flex: 1;
  padding: 32px 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 640px) {
  .header-inner {
    height: 56px;
    padding: 0 16px;
  }
  .brand-text { display: none; }
  .app-main { padding: 16px 12px; }
  .user-name { max-width: 100px; font-size: 0.75rem; }
  .btn-logout { padding: 4px 10px; font-size: 0.72rem; }
}
</style>
