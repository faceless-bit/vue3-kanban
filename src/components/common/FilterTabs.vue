<script setup lang="ts">
/**
 * 筛选标签 — Linear 风格：透明底 + 文字高亮
 */
import type { TaskStatus } from '@/types'
import { FILTER_OPTIONS } from '@/composables/useSearch'

defineProps<{ active: TaskStatus | 'all' }>()
const emit = defineEmits<{ change: [v: TaskStatus | 'all'] }>()
</script>

<template>
  <div class="row">
    <button
      v-for="o in FILTER_OPTIONS" :key="o.key"
      :class="['tab', { on: active === o.key }]"
      @click="emit('change', o.key)"
    >{{ o.label }}</button>
  </div>
</template>

<style scoped>
.row { display: flex; gap: 2px; }
.tab {
  padding: 5px 10px;
  border-radius: var(--radius-xs);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all var(--dur-fast) var(--ease-out);
}
.tab:hover { color: var(--text-primary); background: var(--bg-hover); }
.tab.on { color: var(--accent); background: var(--accent-muted); }
</style>
