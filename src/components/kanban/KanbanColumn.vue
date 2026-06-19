<script setup lang="ts">
/**
 * 看板列 — 带彩色列头 + 图标 + 数量徽章
 */
import type { Task, TaskStatus, ColumnConfig } from '@/types'
import TaskCard from './TaskCard.vue'

defineProps<{ col: ColumnConfig; tasks: Task[] }>()
const emit = defineEmits<{
  move: [id: number, to: TaskStatus]
  delete: [id: number]
}>()

function onMove(id: number, to: TaskStatus) { emit('move', id, to) }
function onDelete(id: number) { emit('delete', id) }
</script>

<template>
  <div class="col" :class="'col-' + col.key">
    <!-- 列头 -->
    <div class="col-head">
      <div class="head-left">
        <!-- 图标 -->
        <span class="head-icon">
          <svg v-if="col.key === 'todo'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <svg v-else-if="col.key === 'doing'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        </span>
        <span class="head-label">{{ col.label }}</span>
      </div>
      <span class="head-badge">{{ tasks.length }}</span>
    </div>

    <!-- 卡片区 -->
    <div class="col-body">
      <TransitionGroup name="list">
        <TaskCard
          v-for="task in tasks" :key="task.id" :task="task"
          @move="onMove" @delete="onDelete"
        />
      </TransitionGroup>

      <div v-if="tasks.length === 0" class="empty">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.25">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
        </svg>
        <span>暂无任务</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.col {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  min-height: 260px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: border-color var(--duration-normal) var(--ease-out);
}
.col:hover { border-color: var(--border-hover); }

/* 列头 */
.col-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-subtle);
}
.head-left { display: flex; align-items: center; gap: 8px; }
.head-icon {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}
.col-todo  .head-icon { color: var(--amber); background: var(--amber-muted); }
.col-doing .head-icon { color: var(--accent); background: var(--accent-muted); }
.col-done  .head-icon { color: var(--green);  background: var(--green-muted); }

.head-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}
.head-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-surface-hover);
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 卡片区 */
.col-body {
  padding: 10px 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 空状态 */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 28px 10px;
  color: var(--text-tertiary);
  font-size: 0.8125rem;
}
</style>
