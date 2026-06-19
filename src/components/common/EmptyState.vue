<script setup lang="ts">
/**
 * 空状态占位符
 * @param icon 图标名称
 * @param text 提示文字
 */
import AppIcon from '@/components/icons/AppIcon.vue'
import type { IconName } from '@/types'

defineProps<{
  icon?: IconName
  text?: string
}>()
</script>

<template>
  <div class="empty">
    <AppIcon v-if="icon" :name="icon" :size="28" class="empty-icon" />
    <p>{{ text || '暂无数据' }}</p>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-xl) var(--space-md);
  color: var(--text-tertiary);
  font-size: 0.875rem;
}
.empty-icon { opacity: 0.35; }
</style>
