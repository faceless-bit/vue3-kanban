<script setup lang="ts">
/**
 * 看板容器
 * 组合三个 KanbanColumn + 搜索/筛选/统计/进度条
 * 列配置：
 *   待办 → 进行中 → 已完成
 */
import { ref, computed, onMounted } from 'vue'
import type { TaskStatus, TaskPriority } from '@/types'
import { useTasksStore } from '@/stores/tasks'
import { useSearch } from '@/composables/useSearch'
import StatsCards from '@/components/common/StatsCards.vue'
import ProgressBar from '@/components/common/ProgressBar.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import FilterTabs from '@/components/common/FilterTabs.vue'
import KanbanColumn from './KanbanColumn.vue'
import TaskForm from './TaskForm.vue'

const store = useTasksStore()
const { query, status, results: filteredTasks } = useSearch(
  computed(() => store.tasks)
)

/** 列配置 */
const columns = [
  { key: 'todo' as TaskStatus, label: '待办' },
  { key: 'doing' as TaskStatus, label: '进行中' },
  { key: 'done' as TaskStatus, label: '已完成' },
]

/** 按列筛选任务 */
function columnTasks(colKey: TaskStatus) {
  return filteredTasks.value.filter(t => t.status === colKey)
}

// 初始化
onMounted(() => store.fetchTasks())

// 操作
const addError = ref('')
const adding = ref(false)

async function handleAdd(title: string, desc: string, priority: TaskPriority) {
  addError.value = ''
  adding.value = true
  try {
    await store.addTask(title, desc, priority)
  } catch (e: any) {
    addError.value = e.message || '添加失败'
  } finally {
    adding.value = false
  }
}

async function handleMove(id: number, to: TaskStatus) {
  try { await store.moveTask(id, to) } catch {}
}

async function handleDelete(id: number) {
  try { await store.deleteTask(id) } catch {}
}
</script>

<template>
  <div class="board-shell">
    <!-- 统计卡片 -->
    <StatsCards :stats="store.stats" />

    <!-- 进度条 -->
    <ProgressBar :percent="store.progressPercent" />

    <!-- 搜索 & 筛选 -->
    <div class="toolbar">
      <SearchBar v-model="query" />
      <FilterTabs :active="status" @change="status = $event" />
    </div>

    <!-- 加载中 -->
    <div v-if="store.loading" class="loading">加载中...</div>

    <!-- 三列看板 -->
    <div v-else class="board">
      <KanbanColumn
        v-for="col in columns"
        :key="col.key"
        :col="col"
        :tasks="columnTasks(col.key)"
        @move="handleMove"
        @delete="handleDelete"
      />
    </div>

    <!-- 新建任务 -->
    <TaskForm
      :loading="adding"
      :error="addError"
      @submit="handleAdd"
    />
  </div>
</template>

<style scoped>
.board-shell {
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.loading {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-tertiary);
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

@media (max-width: 768px) {
  .board { grid-template-columns: 1fr; }
}
</style>
