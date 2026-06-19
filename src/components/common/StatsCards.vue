<script setup lang="ts">
/**
 * 四维统计卡片：全部 / 待办 / 进行中 / 已完成
 */
import type { TaskStats } from '@/types'

defineProps<{
  stats: TaskStats
}>()
</script>

<template>
  <div class="stats-grid">
    <div class="stat">
      <div class="stat-num">{{ stats.total }}</div>
      <div class="stat-label">全部</div>
    </div>
    <div class="stat stat-todo">
      <div class="stat-num">{{ stats.todo }}</div>
      <div class="stat-label">待办</div>
    </div>
    <div class="stat stat-doing">
      <div class="stat-num">{{ stats.doing }}</div>
      <div class="stat-label">进行中</div>
    </div>
    <div class="stat stat-done">
      <div class="stat-num">{{ stats.done }}</div>
      <div class="stat-label">已完成</div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.stat {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: center;
  transition: border-color var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}
.stat:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}
.stat-num {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}
.stat-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
