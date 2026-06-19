<script setup lang="ts">
/**
 * 管理员控制台
 * 左侧用户列表 + 右侧该用户的任务看板
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import type { TaskStatus, TaskPriority } from '@/types'
import AppIcon from '@/components/icons/AppIcon.vue'
import StatsCards from '@/components/common/StatsCards.vue'
import KanbanColumn from '@/components/kanban/KanbanColumn.vue'
import TaskForm from '@/components/kanban/TaskForm.vue'

const store = useTasksStore()
const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (!auth.isAdmin) { router.replace('/'); return }
  await store.adminFetchUsers()
})

/** 看板列 */
const columns = [
  { key: 'todo' as TaskStatus, label: '待办' },
  { key: 'doing' as TaskStatus, label: '进行中' },
  { key: 'done' as TaskStatus, label: '已完成' },
]

function columnTasks(key: TaskStatus) {
  return store.adminSelectedTasks.filter(t => t.status === key)
}

const selectedUser = computed(() =>
  store.adminUsers.find(u => u.uid === store.adminSelectedUserId)
)

const adminStats = computed(() => {
  const t = store.adminSelectedTasks
  return { total: t.length, todo: t.filter(x => x.status === 'todo').length, doing: t.filter(x => x.status === 'doing').length, done: t.filter(x => x.status === 'done').length }
})

async function handleAdd(title: string, desc: string, priority: TaskPriority) {
  await store.adminAddTask(title, desc, priority)
}

async function handleMove(id: number, to: TaskStatus) {
  await store.adminMoveTask(id, to)
}

async function handleDelete(id: number) {
  await store.adminDeleteTask(id)
}

function formatDate(ts: string) {
  const d = new Date(ts)
  if (isNaN(d.getTime())) return ts
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <div class="admin-page">
    <!-- 顶栏 -->
    <div class="admin-top">
      <h1><AppIcon name="shield" :size="20" /> 管理员控制台</h1>
      <span class="badge">管理员：{{ auth.displayName }}</span>
    </div>

    <div class="admin-grid">
      <!-- 左侧：用户列表 -->
      <aside class="sidebar">
        <div class="sidebar-head">
          <h3><AppIcon name="user" :size="15" /> 用户</h3>
          <span class="count">{{ store.adminUsers.length }}</span>
        </div>
        <div class="user-list">
          <button
            v-for="u in store.adminUsers" :key="u.uid"
            :class="['user-row', { active: u.uid === store.adminSelectedUserId }]"
            @click="store.adminSelectUser(u.uid)"
          >
            <AppIcon name="user" :size="16" />
            <div class="user-meta">
              <span class="uname">{{ u.uname }}</span>
              <span class="udate">{{ formatDate(u.ucreated_at) }}</span>
            </div>
          </button>
          <p v-if="store.adminUsers.length === 0" class="empty">暂无用户</p>
        </div>
      </aside>

      <!-- 右侧：任务看板 -->
      <section class="content">
        <template v-if="!selectedUser">
          <div class="placeholder">
            <AppIcon name="chevron-left" :size="32" class="ph-icon" />
            <p>从左侧选择一个用户，查看其任务</p>
          </div>
        </template>
        <template v-else>
          <h2 class="content-title">{{ selectedUser.uname }} 的任务</h2>
          <div class="mini-stats">
            <span>全部 <strong>{{ adminStats.total }}</strong></span>
            <span>待办 <strong>{{ adminStats.todo }}</strong></span>
            <span>进行中 <strong>{{ adminStats.doing }}</strong></span>
            <span>已完成 <strong>{{ adminStats.done }}</strong></span>
          </div>

          <div class="board">
            <KanbanColumn
              v-for="col in columns" :key="col.key"
              :col="col" :tasks="columnTasks(col.key)"
              @move="handleMove" @delete="handleDelete"
            />
          </div>

          <TaskForm @submit="handleAdd" />
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-page { max-width: 1300px; margin: 0 auto; }
.admin-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}
.admin-top h1 { font-size: 1.25rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.badge {
  padding: 4px 12px;
  border: 1px solid var(--red);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  color: var(--red);
}

.admin-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-lg);
}

/* 侧边栏 */
.sidebar {
  background: var(--bg-surface);
  border: 1px solid var(--bg-hover);
  border-radius: var(--radius-md);
  overflow: hidden;
  max-height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
}
.sidebar-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid var(--bg-hover);
  font-size: 0.8125rem;
  font-weight: 600;
}
.count {
  font-size: 0.75rem;
  background: var(--bg-hover);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}
.user-list { flex: 1; overflow-y: auto; padding: 6px; }
.user-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  text-align: left;
  color: var(--text-secondary);
  transition: all var(--dur-fast) var(--ease-out);
}
.user-row:hover { background: var(--bg-hover); }
.user-row.active { color: var(--accent); background: var(--accent-muted); }
.user-meta { display: flex; flex-direction: column; min-width: 0; }
.uname { font-weight: 600; color: var(--text-primary); }
.udate { font-size: 0.6875rem; color: var(--text-tertiary); }
.empty { text-align: center; padding: var(--space-lg); color: var(--text-tertiary); font-size: 0.8125rem; }

/* 内容 */
.content { min-height: 400px; }
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-tertiary);
  gap: var(--space-sm);
}
.ph-icon { opacity: 0.3; }
.content-title { font-size: 1rem; font-weight: 600; margin-bottom: var(--space-md); }

.mini-stats {
  display: flex;
  gap: var(--space-md);
  padding: 8px 14px;
  background: var(--bg-surface);
  border: 1px solid var(--bg-hover);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-md);
  font-size: 0.8125rem;
  color: var(--text-secondary);
}
.mini-stats strong { color: var(--accent); }

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

@media (max-width: 768px) {
  .admin-grid { grid-template-columns: 1fr; }
  .sidebar { max-height: 180px; }
  .board { grid-template-columns: 1fr; }
}
</style>
