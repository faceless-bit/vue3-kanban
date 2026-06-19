<script setup lang="ts">
/**
 * 顶部导航 — Linear 极简风格
 * 细线分隔 / 小号字 / 一个主题按钮
 */
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const auth = useAuthStore()
const theme = useThemeStore()
</script>

<template>
  <header class="hdr">
    <div class="inner">
      <RouterLink to="/" class="logo">任务看板</RouterLink>
      <nav class="nav">
        <RouterLink to="/" class="link" active-class="on">看板</RouterLink>
        <RouterLink to="/stats" class="link" active-class="on">统计</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="link" active-class="on">管理</RouterLink>
      </nav>
      <div class="right">
        <button class="tbtn" :title="theme.mode==='dark'?'浅色':'深色'" @click="theme.toggle()">
          <svg v-if="theme.mode==='dark'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/></svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <span v-if="auth.user" class="user">{{ auth.displayName }}</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-root);
  border-bottom: 1px solid var(--bg-hover);
}
.inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  height: 48px;
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}
.logo {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}
.nav { display: flex; gap: 2px; flex: 1; }
.link {
  padding: 4px 10px;
  border-radius: var(--radius-xs);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--dur-fast);
}
.link:hover { color: var(--text-primary); background: var(--bg-hover); }
.link.on { color: var(--accent); }
.right { display: flex; align-items: center; gap: 12px; }
.tbtn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all var(--dur-fast);
}
.tbtn:hover { color: var(--text-primary); background: var(--bg-hover); }
.user { font-size: 0.75rem; color: var(--text-secondary); }
@media (max-width: 640px) {
  .inner { padding: 0 var(--space-md); }
}
</style>
