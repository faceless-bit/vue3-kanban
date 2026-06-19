<script setup lang="ts">
/**
 * 任务卡片
 * 显示标题、描述、优先级标签、创建时间
 * 底部操作按钮根据所在列动态变化：
 *   待办 → [移动到进行中] [删除]
 *   进行中 → [退回待办] [完成] [删除]
 *   已完成 → [退回进行中] [删除]
 */
import { computed } from 'vue'
import type { Task, TaskStatus } from '@/types'
import AppIcon from '@/components/icons/AppIcon.vue'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  move: [id: number, to: TaskStatus]
  delete: [id: number]
}>()

/** 优先级显示配置 */
const priorityCfg = computed(() => {
  const map = {
    high: { label: '高', cls: 'pri-high' },
    mid:  { label: '中', cls: 'pri-mid' },
    low:  { label: '低', cls: 'pri-low' },
  } as const
  const key = props.task.priority as keyof typeof map
  return map[key] ?? map.mid
})

/** 格式化时间 */
const timeStr = computed(() => {
  const d = new Date(props.task.created_at)
  if (isNaN(d.getTime())) return props.task.created_at
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
})
</script>

<template>
  <div class="card" :class="'border-' + task.priority">
    <!-- 顶部：优先级 + 时间 -->
    <div class="card-head">
      <span class="pri-tag" :class="priorityCfg.cls">{{ priorityCfg.label }}</span>
      <span class="card-time">{{ timeStr }}</span>
    </div>

    <!-- 标题 -->
    <h4 class="card-title">{{ task.title }}</h4>

    <!-- 描述 -->
    <p v-if="task.description" class="card-desc">{{ task.description }}</p>

    <!-- 操作按钮 -->
    <div class="card-actions">
      <!-- 待办 → 可移到进行中 -->
      <button
        v-if="task.status === 'todo'"
        class="act-btn act-forward"
        title="移到进行中"
        @click="emit('move', task.id, 'doing')"
      >
        <AppIcon name="chevron-right" :size="16" />
      </button>

      <!-- 进行中 → 左移到待办、右移到完成 -->
      <template v-if="task.status === 'doing'">
        <button class="act-btn act-back" title="退回待办" @click="emit('move', task.id, 'todo')">
          <AppIcon name="chevron-left" :size="16" />
        </button>
        <button class="act-btn act-done" title="标记完成" @click="emit('move', task.id, 'done')">
          <AppIcon name="check-circle" :size="16" />
        </button>
      </template>

      <!-- 已完成 → 退回进行中 -->
      <button
        v-if="task.status === 'done'"
        class="act-btn act-back"
        title="退回进行中"
        @click="emit('move', task.id, 'doing')"
      >
        <AppIcon name="chevron-left" :size="16" />
      </button>

      <!-- 删除（各列通用） -->
      <button class="act-btn act-del" title="删除" @click="emit('delete', task.id)">
        <AppIcon name="trash" :size="14" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-left: 3px solid var(--border-default);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}
.card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-sm);
}
/* 左边框颜色 */
.border-high { border-left-color: var(--red); }
.border-mid  { border-left-color: var(--amber); }
.border-low  { border-left-color: var(--green); }

/* 头部 */
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.pri-tag {
  font-size: 0.625rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}
.pri-high { color: var(--red);   background: var(--red-muted); }
.pri-mid  { color: var(--amber); background: var(--amber-muted); }
.pri-low  { color: var(--green); background: var(--green-muted); }
.card-time {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
}

/* 标题 */
.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.35;
  margin-bottom: 2px;
}
/* 描述 */
.card-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-bottom: 8px;
}

/* 操作 */
.card-actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
  margin-top: 8px;
}
.act-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  border: 1px solid transparent;
  transition: all var(--duration-fast) var(--ease-out);
}
.act-btn:hover {
  border-color: var(--border-hover);
  background: var(--bg-surface-hover);
}
.act-done:hover  { color: var(--green); border-color: var(--green); background: var(--green-muted); }
.act-del:hover   { color: var(--red);   border-color: var(--red);   background: var(--red-muted); }
.act-forward:hover,
.act-back:hover  { color: var(--accent); border-color: var(--accent); background: var(--accent-muted); }
</style>
