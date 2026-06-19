<script setup lang="ts">
/**
 * 深色/浅色主题切换按钮
 * 点击即切换，图标为太阳/月亮
 */
import { useThemeStore } from '@/stores/theme'
import AppIcon from '@/components/icons/AppIcon.vue'

const theme = useThemeStore()
</script>

<template>
  <button
    class="theme-btn"
    :title="theme.mode === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
    @click="theme.toggle()"
    aria-label="切换主题"
  >
    <AppIcon :name="theme.mode === 'dark' ? 'sun' : 'moon'" :size="18" />
  </button>
</template>

<style scoped>
.theme-btn {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: color var(--dur-fast) var(--ease-out),
              background var(--dur-fast) var(--ease-out);
}
.theme-btn:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}
</style>
