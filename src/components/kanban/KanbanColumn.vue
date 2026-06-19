<script setup lang="ts">
/**
 * 看板单列
 * 包含列标题（名称 + 数量徽标）、任务卡片列表、空状态
 */
import type { Task, TaskStatus, ColumnConfig } from '@/types'
import TaskCard from './TaskCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'

defineProps<{
  col: ColumnConfig
  tasks: Task[]
}>()

const emit = defineEmits<{
  move: [id: number, to: TaskStatus]
  delete: [id: number]
}>()
</script>

<template>
  <div class="col">
    <!-- 列头 -->
    <div class="col-head">
      <span class="col-label">{{ col.label }}</span>
      <span class="col-badge">{{ tasks.length }}</span>
    </div>

    <!-- 卡片列表 -->
    <div class="col-body">
      <TransitionGroup name="list">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @move="(id: number, to: TaskStatus) => emit('move', id, to)"
          @delete="(id: number) => emit('delete', id)"
        />
      </TransitionGroup>

      <EmptyState v-if="tasks.length === 0" icon="inbox" text="暂无任务" />
    </div>
  </div>
</template>

<style scoped>
.col {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  min-height: 240px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 列头 */
.col-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-default);
}
.col-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}
.col-badge {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--bg-surface-hover);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

/* 卡片区域 */
.col-body {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: calc(100vh - 420px);
}
</style>
