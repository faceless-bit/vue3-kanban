<script setup lang="ts">
/**
 * 四维统计卡片 — Linear 风格
 * 大数字 + 图标 + Hover 悬浮 + 数字递增动画
 */
import { computed } from 'vue'
import type { TaskStats } from '@/types'
import { useCountUp } from '@/composables/useCountUp'

const props = defineProps<{ stats: TaskStats }>()

/** 完成率用于进度环 */
const donePercent = computed(() =>
  props.stats.total === 0 ? 0 : Math.round((props.stats.done / props.stats.total) * 100)
)
</script>

<template>
  <div class="stats-grid">
    <!-- 全部 -->
    <div class="stat">
      <div class="stat-icon s-all">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg>
      </div>
      <div class="stat-num">{{ stats.total }}</div>
      <div class="stat-label">全部任务</div>
    </div>

    <!-- 待办 -->
    <div class="stat s-todo">
      <div class="stat-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div class="stat-num">{{ stats.todo }}</div>
      <div class="stat-label">待办</div>
    </div>

    <!-- 进行中 -->
    <div class="stat s-doing">
      <div class="stat-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <div class="stat-num">{{ stats.doing }}</div>
      <div class="stat-label">进行中</div>
    </div>

    <!-- 已完成 + 进度环 -->
    <div class="stat s-done">
      <div class="stat-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
      </div>
      <div class="stat-num">{{ stats.done }}</div>
      <div class="stat-label">
        已完成
        <span class="done-pct">{{ donePercent }}%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat {
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  transition: all var(--duration-normal) var(--ease-out);
  overflow: hidden;
}
.stat::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
  pointer-events: none;
}
.stat:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-hover);
}
.stat:hover::after {
  opacity: 1;
}

/* 左侧彩色竖线（hover 时显示） */
.stat::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--accent);
  opacity: 0;
  transform: scaleY(0.6);
  transition: all var(--duration-normal) var(--ease-out);
}
.stat:hover::before { opacity: 1; transform: scaleY(1); }
.s-todo::before { background: var(--amber); }
.s-doing::before { background: var(--accent); }
.s-done::before  { background: var(--green); }

/* 图标 */
.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  color: var(--accent);
  background: var(--accent-muted);
  transition: transform var(--duration-normal) var(--ease-out);
}
.stat:hover .stat-icon { transform: scale(1.08); }
.s-todo .stat-icon  { color: var(--amber); background: var(--amber-muted); }
.s-doing .stat-icon { color: var(--accent); background: var(--accent-muted); }
.s-done .stat-icon  { color: var(--green);  background: var(--green-muted); }

/* 数字 */
.stat-num {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

/* 标签 */
.stat-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.done-pct {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--green);
  background: var(--green-muted);
  padding: 1px 7px;
  border-radius: var(--radius-full);
}

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .stat { padding: 14px; }
  .stat-num { font-size: 1.5rem; }
}
</style>
