<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { TaskStatus, TaskPriority } from '@/stores/tasks'
import AppIcon from '@/components/AppIcon.vue'

const store = useTasksStore()
const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (!auth.isAdmin) {
    router.replace('/')
    return
  }
  await store.adminFetchUsers()
})

const newTitle = ref('')
const newDesc = ref('')
const newPriority = ref<TaskPriority>('mid')

const columns = [
  { key: 'todo' as TaskStatus, label: '待办', color: '#f59e0b' },
  { key: 'doing' as TaskStatus, label: '进行中', color: '#6366f1' },
  { key: 'done' as TaskStatus, label: '已完成', color: '#22c55e' },
]

function getColumnTasks(status: TaskStatus) {
  return store.adminSelectedTasks.filter(t => t.status === status)
}

const selectedUser = computed(() =>
  store.adminUsers.find(u => u.uid === store.adminSelectedUserId)
)

async function selectUser(userId: string) {
  await store.adminSelectUser(userId)
}

async function addTask() {
  const title = newTitle.value.trim()
  if (!title) return
  await store.adminAddTask(title, newDesc.value.trim(), newPriority.value)
  newTitle.value = ''
  newDesc.value = ''
  newPriority.value = 'mid'
}

function moveTask(id: number, to: TaskStatus) {
  store.adminMoveTask(id, to)
}

function deleteTask(id: number) {
  store.adminDeleteTask(id)
}

function formatDate(ts: string) {
  const d = new Date(ts)
  if (isNaN(d.getTime())) return ts
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const priorityLabel: Record<string, string> = { low: '低', mid: '中', high: '高' }

const adminStats = computed(() => {
  const tasks = store.adminSelectedTasks
  return {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    doing: tasks.filter(t => t.status === 'doing').length,
    done: tasks.filter(t => t.status === 'done').length,
  }
})
</script>

<template>
  <div class="admin-page">
    <div class="admin-topbar">
      <h1><AppIcon name="shield" :size="22" class="topbar-icon" /> 管理员控制台</h1>
      <span class="admin-badge">管理员：{{ auth.displayName }}</span>
    </div>

    <div class="admin-layout">
      <!-- 左侧用户列表 -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <h3><AppIcon name="user" :size="15" /> 用户列表</h3>
          <span class="user-total">{{ store.adminUsers.length }} 人</span>
        </div>
        <div class="user-list">
          <button
            v-for="u in store.adminUsers"
            :key="u.uid"
            :class="['user-item', { active: u.uid === store.adminSelectedUserId }]"
            @click="selectUser(u.uid)"
          >
            <AppIcon name="user" :size="18" class="user-avatar" />
            <div class="user-info">
              <span class="user-name">{{ u.uname }}</span>
              <span class="user-date">{{ formatDate(u.ucreated_at) }}</span>
            </div>
          </button>
          <div v-if="store.adminUsers.length === 0" class="user-empty">
            暂无用户
          </div>
        </div>
      </aside>

      <!-- 右侧任务看板 -->
      <section class="admin-content">
        <template v-if="!selectedUser">
          <div class="content-empty">
            <AppIcon name="chevron-left" :size="36" class="empty-arrow" />
            <p>从左侧选择一个用户，查看其任务</p>
          </div>
        </template>
        <template v-else>
          <div class="content-header">
            <h2>{{ selectedUser.uname }} 的任务</h2>
          </div>

          <div class="mini-stats">
            <span>全部：<strong>{{ adminStats.total }}</strong></span>
            <span>待办：<strong>{{ adminStats.todo }}</strong></span>
            <span>进行中：<strong>{{ adminStats.doing }}</strong></span>
            <span>已完成：<strong>{{ adminStats.done }}</strong></span>
          </div>

          <div class="board">
            <div
              v-for="col in columns"
              :key="col.key"
              class="board-col"
              :style="{ '--col-color': col.color }"
            >
              <div class="col-header">
                <span>{{ col.label }}</span>
                <span class="col-count">{{ getColumnTasks(col.key).length }}</span>
              </div>
              <div class="col-body">
                <TransitionGroup name="task-list">
                  <div
                    v-for="task in getColumnTasks(col.key)"
                    :key="task.id"
                    class="task-card"
                    :class="'priority-' + task.priority"
                  >
                    <div class="task-head">
                      <span class="task-priority" :class="'pri-' + task.priority">{{ priorityLabel[task.priority] }}</span>
                      <span class="task-time">{{ formatDate(task.created_at) }}</span>
                    </div>
                    <h4 class="task-title">{{ task.title }}</h4>
                    <p class="task-desc" v-if="task.description">{{ task.description }}</p>
                    <div class="task-actions">
                      <!-- 待办 → 进行中 -->
                      <button
                        v-if="task.status === 'todo'"
                        class="btn-action btn-start"
                        title="开始进行"
                        @click="moveTask(task.id, 'doing')"
                      >
                        <AppIcon name="play" :size="12" />
                      </button>
                      <!-- 进行中 ← 待办 -->
                      <button
                        v-if="task.status === 'doing'"
                        class="btn-action btn-left"
                        title="退回待办"
                        @click="moveTask(task.id, 'todo')"
                      >
                        <AppIcon name="chevron-left" :size="14" />
                      </button>
                      <!-- 进行中 → 已完成 -->
                      <button
                        v-if="task.status === 'doing'"
                        class="btn-action btn-done"
                        title="完成"
                        @click="moveTask(task.id, 'done')"
                      >
                        <AppIcon name="check-circle" :size="14" />
                      </button>
                      <!-- 已完成 ← 进行中 -->
                      <button
                        v-if="task.status === 'done'"
                        class="btn-action btn-left"
                        title="退回进行中"
                        @click="moveTask(task.id, 'doing')"
                      >
                        <AppIcon name="chevron-left" :size="14" />
                      </button>
                      <button class="btn-action btn-del" title="删除" @click="deleteTask(task.id)">
                        <AppIcon name="x-circle" :size="14" />
                      </button>
                    </div>
                  </div>
                </TransitionGroup>
                <div v-if="getColumnTasks(col.key).length === 0" class="col-empty">
                  <span>暂无任务</span>
                </div>
              </div>
            </div>
          </div>

          <div class="add-task-card">
            <h3>为 {{ selectedUser.uname }} 添加任务</h3>
            <form @submit.prevent="addTask" class="add-form">
              <input v-model="newTitle" type="text" placeholder="任务标题 *" class="form-input" maxlength="60" />
              <input v-model="newDesc" type="text" placeholder="任务描述（可选）" class="form-input" maxlength="200" />
              <div class="form-row">
                <select v-model="newPriority" class="form-select">
                  <option value="low">低优先级</option>
                  <option value="mid">中优先级</option>
                  <option value="high">高优先级</option>
                </select>
                <button type="submit" class="btn-add" :disabled="!newTitle.trim()">
                  添加任务
                </button>
              </div>
            </form>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-page { max-width: 1300px; margin: 0 auto; }

.admin-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.admin-topbar h1 { font-size: 1.3rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.topbar-icon { color: var(--color-primary); }
.admin-badge {
  padding: 4px 12px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 14px;
  font-size: 0.78rem;
  color: var(--color-danger);
  font-weight: 500;
}

.admin-layout { display: grid; grid-template-columns: 240px 1fr; gap: 18px; }

/* ========== 左侧 ========== */
.admin-sidebar {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  max-height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
}
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
}
.sidebar-header h3 { font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.user-total {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  background: var(--color-border);
  padding: 2px 8px;
  border-radius: 10px;
}
.user-list { flex: 1; overflow-y: auto; padding: 6px; }
.user-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  text-align: left;
  font-size: 0.82rem;
  transition: var(--transition);
}
.user-item:hover { background: var(--color-surface-hover); }
.user-item.active {
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.25);
}
.user-avatar { color: var(--color-text-muted); flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; min-width: 0; }
.user-name { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-date { font-size: 0.68rem; color: var(--color-text-muted); }
.user-empty { text-align: center; padding: 24px; color: var(--color-text-muted); font-size: 0.82rem; }

/* ========== 右侧 ========== */
.admin-content { min-height: 400px; }
.content-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--color-text-muted);
}
.empty-arrow { opacity: 0.4; margin-bottom: 10px; }
.content-empty p { font-size: 0.9rem; }
.content-header { margin-bottom: 14px; }
.content-header h2 { font-size: 1.05rem; font-weight: 600; }

.mini-stats {
  display: flex;
  gap: 18px;
  padding: 8px 14px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}
.mini-stats strong { color: var(--color-primary); }

/* ========== 看板 ========== */
.board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; }
.board-col {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  min-height: 160px;
  display: flex;
  flex-direction: column;
}
.col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 2px solid var(--col-color);
  font-weight: 600;
  font-size: 0.82rem;
}
.col-count {
  background: var(--color-border);
  padding: 1px 7px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
}
.col-body { padding: 8px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
.col-empty { text-align: center; padding: 20px 10px; color: var(--color-text-muted); font-size: 0.78rem; }

.task-card {
  background: var(--color-input);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 8px 10px;
  transition: var(--transition);
}
.task-card:hover { border-color: var(--color-primary); }
.task-card.priority-high { border-left: 3px solid var(--color-danger); }
.task-card.priority-mid { border-left: 3px solid var(--color-warn); }
.task-card.priority-low { border-left: 3px solid var(--color-success); }
.task-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.task-priority { font-size: 0.62rem; padding: 1px 5px; border-radius: 3px; font-weight: 500; }
.pri-high { background: rgba(239,68,68,0.15); color: #ef4444; }
.pri-mid  { background: rgba(245,158,11,0.15); color: #f59e0b; }
.pri-low  { background: rgba(34,197,94,0.15); color: #22c55e; }
.task-time { font-size: 0.65rem; color: var(--color-text-muted); }
.task-title { font-size: 0.82rem; font-weight: 600; margin-bottom: 3px; line-height: 1.3; }
.task-desc { font-size: 0.72rem; color: var(--color-text-muted); line-height: 1.4; margin-bottom: 6px; }
.task-actions { display: flex; gap: 3px; justify-content: flex-end; }

.btn-action {
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  padding: 0;
}
.btn-action:hover { border-color: var(--color-primary); color: var(--color-primary); background: var(--color-primary-glow); }
.btn-start:hover {
  border-color: var(--color-primary);
  color: #fff;
  background: var(--color-primary);
}
.btn-done:hover { border-color: var(--color-success); color: var(--color-success); background: rgba(34,197,94,0.1); }
.btn-del:hover { border-color: var(--color-danger); color: var(--color-danger); background: rgba(239,68,68,0.1); }

.task-list-enter-active { transition: all 0.3s ease; }
.task-list-leave-active { transition: all 0.2s ease; }
.task-list-enter-from { opacity: 0; transform: translateY(-6px) scale(0.97); }
.task-list-leave-to { opacity: 0; transform: translateX(16px); }
.task-list-move { transition: transform 0.3s ease; }

/* ========== 新建任务 ========== */
.add-task-card {
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  padding: 16px;
}
.add-task-card h3 { font-size: 0.85rem; margin-bottom: 10px; }
.add-form { display: flex; flex-direction: column; gap: 8px; }
.form-input {
  width: 100%;
  padding: 8px 12px;
  background: var(--color-input);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 0.82rem;
  outline: none;
  transition: var(--transition);
}
.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-glow); }
.form-row { display: flex; gap: 8px; align-items: center; }
.form-select {
  padding: 8px 10px;
  background: var(--color-input);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 0.78rem;
  outline: none;
  cursor: pointer;
}
.btn-add {
  flex: 1;
  padding: 9px 16px;
  background: var(--color-primary);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.btn-add:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-add:disabled { opacity: 0.4; cursor: not-allowed; }

@media (max-width: 768px) {
  .admin-layout { grid-template-columns: 1fr; }
  .admin-sidebar { max-height: 180px; }
  .board { grid-template-columns: 1fr; }
  .form-row { flex-direction: column; }
  .btn-add { width: 100%; }
}
</style>
