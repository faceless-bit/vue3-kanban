<script setup lang="ts">
/**
 * 统计行 — Linear 风格
 * 大数字 / 无边框 / 背景色层次区分 / hover 微亮
 */
import type { TaskStats } from '@/types'

defineProps<{ stats: TaskStats }>()
</script>

<template>
  <div class="row">
    <div class="item"><span class="num">{{ stats.total }}</span><span class="lbl">全部任务</span></div>
    <div class="item"><span class="num">{{ stats.todo }}</span><span class="lbl">待办</span></div>
    <div class="item"><span class="num">{{ stats.doing }}</span><span class="lbl">进行中</span></div>
    <div class="item"><span class="num">{{ stats.done }}</span><span class="lbl">已完成</span></div>
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--bg-hover);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--space-xl);
}
.item {
  background: var(--bg-surface);
  padding: 18px 20px;
  transition: background var(--dur-fast) var(--ease-out);
}
.item:hover { background: var(--bg-active); }
.num {
  display: block;
  font-size: 1.75rem;
  font-weight: 650;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}
.lbl {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 2px;
}
@media (max-width: 640px) {
  .row { grid-template-columns: repeat(2, 1fr); }
  .item { padding: 14px 16px; }
  .num { font-size: 1.4rem; }
}
</style>
