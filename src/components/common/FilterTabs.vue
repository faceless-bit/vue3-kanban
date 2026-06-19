<script setup lang="ts">
/**
 * 状态筛选标签组
 * 选中项高亮，点击切换
 */
import type { TaskStatus } from '@/types'
import { FILTER_OPTIONS } from '@/composables/useSearch'

defineProps<{
  active: TaskStatus | 'all'
}>()

const emit = defineEmits<{
  change: [value: TaskStatus | 'all']
}>()
</script>

<template>
  <div class="tabs">
    <button
      v-for="opt in FILTER_OPTIONS"
      :key="opt.key"
      :class="['tab', { active: active === opt.key }]"
      @click="emit('change', opt.key)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 2px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 3px;
}
.tab {
  padding: 5px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}
.tab:hover { color: var(--text-primary); }
.tab.active {
  background: var(--accent);
  color: #ffffff;
}
</style>
