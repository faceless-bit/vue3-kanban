<script setup lang="ts">
/**
 * 任务卡片 — Linear 风格
 * 胶囊优先级标签 / Hover 上浮 / 精致阴影
 * 按钮逻辑：
 *   待办 → [移入进行中] [删除]
 *   进行中 → [退回待办] [完成] [删除]
 *   已完成 → [退回进行中] [删除]
 */
import { computed } from 'vue'
import type { Task, TaskStatus } from '@/types'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  move: [id: number, to: TaskStatus]
  delete: [id: number]
}>()

/** 优先级配置 */
const tag = computed(() => {
  const m = { high: { label: '高', cls: 'pri-high' }, mid: { label: '中', cls: 'pri-mid' }, low: { label: '低', cls: 'pri-low' } }
  return m[props.task.priority] || m.mid
})

/** 格式化时间 */
const timeStr = computed(() => {
  const d = new Date(props.task.created_at)
  if (isNaN(d.getTime())) return props.task.created_at
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 3600000) return `${Math.floor(diff/60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff/3600000)} 小时前`
  return `${d.getMonth()+1}/${d.getDate()}`
})
</script>

<template>
  <div class="card">
    <!-- 头部 -->
    <div class="card-head">
      <span class="tag" :class="tag.cls">{{ tag.label }}</span>
      <span class="time">{{ timeStr }}</span>
    </div>

    <!-- 标题 -->
    <p class="title">{{ task.title }}</p>

    <!-- 描述 -->
    <p v-if="task.description" class="desc">{{ task.description }}</p>

    <!-- 操作按钮 -->
    <div class="actions">
      <!-- 待办：→ 移到进行中 -->
      <button v-if="task.status === 'todo'" class="btn forward" title="移到进行中" @click="emit('move', task.id, 'doing')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>

      <!-- 进行中：← 退回, ✓ 完成 -->
      <template v-if="task.status === 'doing'">
        <button class="btn back" title="退回待办" @click="emit('move', task.id, 'todo')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="btn done" title="完成" @click="emit('move', task.id, 'done')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </template>

      <!-- 已完成：← 退回 -->
      <button v-if="task.status === 'done'" class="btn back" title="退回进行中" @click="emit('move', task.id, 'doing')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      <!-- 删除 -->
      <button class="btn del" title="删除" @click="emit('delete', task.id)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 12px 14px;
  transition: all var(--duration-normal) var(--ease-out);
  position: relative;
}
.card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-hover);
}

/* 头部 */
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
/* 胶囊标签 */
.tag {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  letter-spacing: 0.02em;
}
.pri-high { color: var(--red);   background: var(--red-muted); }
.pri-mid  { color: var(--amber); background: var(--amber-muted); }
.pri-low  { color: var(--green); background: var(--green-muted); }

.time {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

/* 标题 */
.title {
  font-size: 0.875rem;
  font-weight: 550;
  line-height: 1.35;
  color: var(--text-primary);
  margin-bottom: 2px;
}

/* 描述 */
.desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-top: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--border-subtle);
}

.btn {
  width: 26px;
  height: 26px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  transition: all var(--duration-fast) var(--ease-out);
}
.btn:hover { background: var(--bg-surface-hover); color: var(--text-primary); }
.forward:hover { color: var(--accent); background: var(--accent-muted); }
.back:hover    { color: var(--amber); background: var(--amber-muted); }
.done:hover    { color: var(--green); background: var(--green-muted); }
.del:hover     { color: var(--red);   background: var(--red-muted); }
</style>
