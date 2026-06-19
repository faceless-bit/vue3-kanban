<script setup lang="ts">
/**
 * 顶部导航栏
 * 包含 Logo、导航链接、主题切换、用户菜单
 */
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import AppIcon from '@/components/icons/AppIcon.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'

const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()

async function handleLogout() {
  await auth.signOut()
  router.push('/login')
}
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <!-- 左侧：Logo -->
      <RouterLink to="/" class="brand">
        <AppIcon name="clipboard" :size="20" />
        <span class="brand-text">任务看板</span>
      </RouterLink>

      <!-- 中间：导航 -->
      <nav class="nav">
        <RouterLink to="/" class="nav-link" active-class="active">
          <AppIcon name="chart" :size="16" />
          <span>看板</span>
        </RouterLink>
        <RouterLink to="/stats" class="nav-link" active-class="active">
          <AppIcon name="trending" :size="16" />
          <span>统计</span>
        </RouterLink>
        <RouterLink to="/about" class="nav-link" active-class="active">
          <AppIcon name="info" :size="16" />
          <span>关于</span>
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="nav-link" active-class="active">
          <AppIcon name="shield" :size="16" />
          <span>管理</span>
        </RouterLink>
      </nav>

      <!-- 右侧：主题 + 用户 -->
      <div class="header-right">
        <ThemeToggle />

        <template v-if="auth.user">
          <span class="user-name">
            <AppIcon name="user" :size="14" />
            {{ auth.displayName }}
          </span>
          <button class="logout-btn" @click="handleLogout">退出</button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-default);
}
.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 品牌 */
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  transition: color var(--duration-fast) var(--ease-out);
}
.brand:hover { color: var(--accent); }

/* 导航 */
.nav { display: flex; gap: 2px; }
.nav-link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}
.nav-link:hover { color: var(--text-primary); background: var(--bg-surface-hover); }
.nav-link.active { color: var(--accent); background: var(--accent-muted); }

/* 右侧 */
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-name {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.logout-btn {
  padding: 4px 10px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}
.logout-btn:hover {
  border-color: var(--red);
  color: var(--red);
}

@media (max-width: 640px) {
  .brand-text { display: none; }
  .nav-link span { display: none; }
  .header-inner { padding: 0 var(--space-md); }
}
</style>
