<script setup lang="ts">
/**
 * 看板列 — 极简列头
 * 仅文字 + 计数，无彩色装饰
 */
import type { Task, TaskStatus, ColumnConfig } from '@/types'
import TaskCard from './TaskCard.vue'

defineProps<{ col: ColumnConfig; tasks: Task[] }>()
const emit = defineEmits<{
  move: [id: number, to: TaskStatus]
  delete: [id: number]
}>()
</script>

<template>
  <div class="col">
    <div class="head">
      <span class="label">{{ col.label }}</span>
      <span class="badge">{{ tasks.length }}</span>
    </div>
    <div class="body">
      <TransitionGroup name="list">
        <TaskCard
          v-for="t in tasks" :key="t.id" :task="t"
          @move="(id,to) => emit('move',id,to)"
          @delete="(id) => emit('delete',id)"
        />
      </TransitionGroup>
      <div v-if="tasks.length===0" class="empty">—</div>
    </div>
  </div>
</template>

<style scoped>
.col {
  background: var(--bg-inset);
  border-radius: var(--radius-md);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 10px;
}
.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.badge {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--text-tertiary);
  min-width: 20px;
  text-align: center;
}

.body {
  padding: 0 8px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.empty {
  text-align: center;
  padding: 32px 10px;
  color: var(--text-tertiary);
  font-size: 0.75rem;
}
</style>
