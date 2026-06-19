<script setup lang="ts">
/**
 * 任务卡片 — Linear 极简风格
 * 无边框 / 操作按钮 hover 显示 / 优先级小圆点
 */
import { computed, ref } from 'vue'
import type { Task, TaskStatus } from '@/types'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
  move: [id: number, to: TaskStatus]
  delete: [id: number]
}>()

const hovering = ref(false)

const dot = computed(() => ({ high: 'var(--red)', mid: 'var(--amber)', low: 'var(--green)' }[props.task.priority]))

const timeStr = computed(() => {
  const d = new Date(props.task.created_at)
  if (isNaN(d.getTime())) return ''
  const diff = Date.now() - d.getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
  return `${d.getMonth() + 1}/${d.getDate()}`
})
</script>

<template>
  <div
    class="card"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="top">
      <span class="dot" :style="{ background: dot }"></span>
      <span class="title">{{ task.title }}</span>
      <span class="time">{{ timeStr }}</span>
    </div>
    <p v-if="task.description" class="desc">{{ task.description }}</p>
    <div v-if="hovering" class="acts">
      <button v-if="task.status==='todo'" class="act" title="进行中" @click="emit('move',task.id,'doing')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <template v-if="task.status==='doing'">
        <button class="act" title="退回" @click="emit('move',task.id,'todo')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="act" title="完成" @click="emit('move',task.id,'done')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </template>
      <button v-if="task.status==='done'" class="act" title="退回" @click="emit('move',task.id,'doing')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button class="act del" title="删除" @click="emit('delete',task.id)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 10px 12px;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  transition: background var(--dur-fast) var(--ease-out);
}
.card:hover { background: var(--bg-hover); }

.top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.title {
  flex: 1;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.time {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-top: 3px;
  padding-left: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.acts {
  display: flex;
  gap: 2px;
  justify-content: flex-end;
  margin-top: 6px;
  padding-top: 6px;
}
.act {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  transition: all var(--dur-fast) var(--ease-out);
}
.act:hover { color: var(--text-primary); background: var(--bg-active); }
.del:hover { color: var(--red); }
</style>
