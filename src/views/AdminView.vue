<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { TaskStatus, TaskPriority, AdminUser } from '@/stores/tasks'

const store = useTasksStore()
const auth = useAuthStore()
const router = useRouter()

// ==================== 权限检查 ====================
onMounted(async () => {
  if (!auth.isAdmin) {
    router.replace('/')
    return
  }
  await store.adminFetchUsers()
})

// ==================== 新建任务表单 ====================
const newTitle = ref('')
const newDesc = ref('')
const newPriority = ref<TaskPriority>('mid')

// ==================== 看板列配置 ====================
const columns = [
  { key: 'todo' as TaskStatus, label: '📌 待办', color: '#f59e0b' },
  { key: 'doing' as TaskStatus, label: '🚀 进行中', color: '#6366f1' },
  { key: 'done' as TaskStatus, label: '✅ 已完成', color: '#22c55e' },
]

function getColumnTasks(status: TaskStatus) {
  return store.adminSelectedTasks.filter(t => t.status === status)
}

const selectedUser = computed(() =>
  store.adminUsers.find(u => u.uid === store.adminSelectedUserId)
)

// ==================== 操作 ====================
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

const priorityLabel: Record<string, string> = { low: '🟢 低', mid: '🟡 中', high: '🔴 高' }

// 统计
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
    <!-- 顶部标题栏 -->
    <div class="admin-topbar">
      <h1>🛡️ 管理员控制台</h1>
      <span class="admin-badge">管理员：{{ auth.displayName }}</span>
    </div>

    <div class="admin-layout">
      <!-- 左侧用户列表 -->
      <aside class="admin-sidebar">
        <div class="sidebar-header">
          <h3>👥 用户列表</h3>
          <span class="user-total">{{ store.adminUsers.length }} 人</span>
        </div>
        <div class="user-list">
          <button
            v-for="u in store.adminUsers"
            :key="u.uid"
            :class="['user-item', { active: u.uid === store.adminSelectedUserId }]"
            @click="selectUser(u.uid)"
          >
            <span class="user-avatar">👤</span>
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
            <span class="empty-icon">👈</span>
            <p>从左侧选择一个用户，查看其任务</p>
          </div>
        </template>
        <template v-else>
          <div class="content-header">
            <h2>📋 {{ selectedUser.uname }} 的任务</h2>
          </div>

          <!-- 统计条 -->
          <div class="mini-stats">
            <span>全部：<strong>{{ adminStats.total }}</strong></span>
            <span>待办：<strong>{{ adminStats.todo }}</strong></span>
            <span>进行中：<strong>{{ adminStats.doing }}</strong></span>
            <span>已完成：<strong>{{ adminStats.done }}</strong></span>
          </div>

          <!-- 三列看板 -->
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
                      <span class="task-priority">{{ priorityLabel[task.priority] }}</span>
                      <span class="task-time">{{ formatDate(task.created_at) }}</span>
                    </div>
                    <h4 class="task-title">{{ task.title }}</h4>
                    <p class="task-desc" v-if="task.desc">{{ task.desc }}</p>
                    <div class="task-actions">
                      <template v-if="task.status !== 'todo'">
                        <button class="btn-action btn-left" title="左移" @click="moveTask(task.id, task.status === 'doing' ? 'todo' : 'doing')">◀</button>
                      </template>
                      <button
                        v-if="task.status !== 'done'"
                        class="btn-action btn-done"
                        title="完成"
                        @click="moveTask(task.id, 'done')"
                      >✓</button>
                      <button class="btn-action btn-del" title="删除" @click="deleteTask(task.id)">✕</button>
                    </div>
                  </div>
                </TransitionGroup>
                <div v-if="getColumnTasks(col.key).length === 0" class="col-empty">
                  <span>📭 暂无任务</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 给该用户新建任务 -->
          <div class="add-task-card">
            <h3>✏️ 为 {{ selectedUser.uname }} 添加任务</h3>
            <form @submit.prevent="addTask" class="add-form">
              <input
                v-model="newTitle"
                type="text"
                placeholder="任务标题 *"
                class="form-input"
                maxlength="60"
              />
              <input
                v-model="newDesc"
                type="text"
                placeholder="任务描述（可选）"
                class="form-input"
                maxlength="200"
              />
              <div class="form-row">
                <select v-model="newPriority" class="form-select">
                  <option value="low">🟢 低优先级</option>
                  <option value="mid">🟡 中优先级</option>
                  <option value="high">🔴 高优先级</option>
                </select>
                <button type="submit" class="btn-add" :disabled="!newTitle.trim()">
                  ➕ 添加任务
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
.admin-page {
  max-width: 1300px;
  margin: 0 auto;
}

/* ========== 顶栏 ========== */
.admin-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.admin-topbar h1 {
  font-size: 1.4rem;
  font-weight: 700;
}
.admin-badge {
  padding: 4px 14px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  font-size: 0.8rem;
  color: var(--color-danger);
  font-weight: 500;
}

/* ========== 左右布局 ========== */
.admin-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
}

/* ========== 左侧用户列表 ========== */
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
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
}
.sidebar-header h3 {
  font-size: 0.9rem;
  font-weight: 600;
}
.user-total {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  background: var(--color-border);
  padding: 2px 8px;
  border-radius: 10px;
}

.user-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  text-align: left;
  font-size: 0.85rem;
  transition: var(--transition);
}
.user-item:hover {
  background: var(--color-surface-hover);
}
.user-item.active {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.user-avatar {
  font-size: 1.2rem;
}
.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.user-name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-date {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.user-empty {
  text-align: center;
  padding: 24px;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

/* ========== 右侧内容 ========== */
.admin-content {
  min-height: 400px;
}

.content-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--color-text-muted);
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}
.content-empty p {
  font-size: 0.95rem;
}

.content-header {
  margin-bottom: 16px;
}
.content-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
}

.mini-stats {
  display: flex;
  gap: 20px;
  padding: 10px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
.mini-stats strong {
  color: var(--color-primary);
}

/* ========== 看板三列 ========== */
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.board-col {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  min-height: 180px;
  display: flex;
  flex-direction: column;
}

.col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 2px solid var(--col-color);
  font-weight: 600;
  font-size: 0.85rem;
}

.col-count {
  background: var(--color-border);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.72rem;
  font-weight: 500;
}

.col-body {
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.col-empty {
  text-align: center;
  padding: 24px 12px;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

/* ========== 任务卡片 ========== */
.task-card {
  background: #1a2332;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px;
  transition: var(--transition);
}
.task-card:hover {
  border-color: var(--color-primary);
}
.task-card.priority-high { border-left: 3px solid var(--color-danger); }
.task-card.priority-mid { border-left: 3px solid var(--color-warn); }
.task-card.priority-low { border-left: 3px solid var(--color-success); }

.task-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.task-priority { font-size: 0.65rem; opacity: 0.8; }
.task-time { font-size: 0.68rem; color: var(--color-text-muted); }

.task-title {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.3;
}
.task-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.4;
  margin-bottom: 8px;
}
.task-actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.btn-action {
  width: 26px;
  height: 26px;
  border: 1px solid var(--color-border);
  border-radius: 5px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}
.btn-action:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.1);
}
.btn-done:hover {
  border-color: var(--color-success);
  color: var(--color-success);
  background: rgba(34, 197, 94, 0.1);
}
.btn-del:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

/* ========== 列表动画 ========== */
.task-list-enter-active { transition: all 0.3s ease; }
.task-list-leave-active { transition: all 0.2s ease; }
.task-list-enter-from { opacity: 0; transform: translateY(-8px) scale(0.96); }
.task-list-leave-to { opacity: 0; transform: translateX(20px); }
.task-list-move { transition: transform 0.3s ease; }

/* ========== 新建任务 ========== */
.add-task-card {
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  padding: 18px;
}
.add-task-card h3 { font-size: 0.9rem; margin-bottom: 12px; }
.add-form { display: flex; flex-direction: column; gap: 10px; }

.form-input {
  width: 100%;
  padding: 10px 14px;
  background: #1a2332;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.85rem;
  outline: none;
  transition: var(--transition);
}
.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-glow);
}

.form-row { display: flex; gap: 8px; align-items: center; }

.form-select {
  padding: 10px 12px;
  background: #1a2332;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.8rem;
  outline: none;
  cursor: pointer;
}

.btn-add {
  flex: 1;
  padding: 10px 20px;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.btn-add:hover:not(:disabled) { background: #4f46e5; box-shadow: var(--shadow-glow); }
.btn-add:disabled { opacity: 0.4; cursor: not-allowed; }

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }
  .admin-sidebar {
    max-height: 200px;
  }
  .board {
    grid-template-columns: 1fr;
  }
  .form-row {
    flex-direction: column;
  }
  .btn-add { width: 100%; }
}
</style>
