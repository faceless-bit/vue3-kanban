<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import type { TaskStatus, TaskPriority } from '@/stores/tasks'

const store = useTasksStore()

// ==================== 本地搜索/筛选状态 ====================
const newTitle = ref('')
const newDesc = ref('')
const newPriority = ref<TaskPriority>('mid')
const filterStatus = ref<TaskStatus | 'all'>('all')
const searchQuery = ref('')
const adding = ref(false)
const addError = ref('')

// ==================== 初始化 ====================
onMounted(async () => {
  await store.fetchTasks()
})

// ==================== 看板列配置 ====================
const columns = [
  { key: 'todo' as TaskStatus, label: '📌 待办', color: '#f59e0b' },
  { key: 'doing' as TaskStatus, label: '🚀 进行中', color: '#6366f1' },
  { key: 'done' as TaskStatus, label: '✅ 已完成', color: '#22c55e' },
]

// ==================== 过滤 ====================
const filteredTasks = computed(() => {
  let list = store.tasks
  if (filterStatus.value !== 'all') {
    list = list.filter(t => t.status === filterStatus.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
  }
  return list
})

function getColumnTasks(status: TaskStatus) {
  return filteredTasks.value.filter(t => t.status === status)
}

// ==================== 操作 ====================
async function addTask() {
  addError.value = ''
  const title = newTitle.value.trim()
  if (!title) return
  adding.value = true
  try {
    const result = await store.addTask(title, newDesc.value.trim(), newPriority.value)
    if (result) {
      newTitle.value = ''
      newDesc.value = ''
      newPriority.value = 'mid'
    } else {
      addError.value = '添加失败，请检查网络后重试'
    }
  } catch (e: any) {
    addError.value = '添加失败：' + (e.message || '未知错误')
    console.error('添加任务失败:', e)
  } finally {
    adding.value = false
  }
}

function moveTask(id: number, to: TaskStatus) {
  store.moveTask(id, to)
}

function deleteTask(id: number) {
  store.deleteTask(id)
}

function formatDate(ts: string) {
  // created_at 是 ISO 时间字符串
  const d = new Date(ts)
  if (isNaN(d.getTime())) return ts
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const priorityLabel: Record<string, string> = { low: '🟢 低', mid: '🟡 中', high: '🔴 高' }
</script>

<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-num">{{ store.stats.total }}</div>
        <div class="stat-label">全部任务</div>
      </div>
      <div class="stat-card stat-todo">
        <div class="stat-num">{{ store.stats.todo }}</div>
        <div class="stat-label">待办</div>
      </div>
      <div class="stat-card stat-doing">
        <div class="stat-num">{{ store.stats.doing }}</div>
        <div class="stat-label">进行中</div>
      </div>
      <div class="stat-card stat-done">
        <div class="stat-num">{{ store.stats.done }}</div>
        <div class="stat-label">已完成</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar-wrap">
      <div class="progress-info">
        <span>📈 完成进度</span>
        <span>{{ store.progressPercent }}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: store.progressPercent + '%' }"></div>
      </div>
    </div>

    <!-- 搜索 & 筛选 -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索任务..."
          class="search-input"
        />
      </div>
      <div class="filter-tabs">
        <button
          v-for="f in [{ k: 'all', l: '全部' }, { k: 'todo', l: '待办' }, { k: 'doing', l: '进行中' }, { k: 'done', l: '已完成' }]"
          :key="f.k"
          :class="['filter-btn', { active: filterStatus === f.k }]"
          @click="filterStatus = f.k as any"
        >
          {{ f.l }}
        </button>
      </div>
    </div>

    <!-- 加载中 -->
    <div v-if="store.loading" class="loading-state">
      <span class="loading-spinner">⏳</span>
      <p>加载任务中...</p>
    </div>

    <!-- 三列看板 -->
    <div v-else class="board">
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
              <p class="task-desc" v-if="task.description">{{ task.description }}</p>
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

    <!-- 新建任务 -->
    <div class="add-task-card">
      <h3>✏️ 新建任务</h3>
      <div v-if="addError" class="add-error">{{ addError }}</div>
      <form @submit.prevent="addTask" class="add-form">
        <input
          v-model="newTitle"
          type="text"
          placeholder="任务标题 *"
          class="form-input"
          maxlength="60"
          :disabled="adding"
        />
        <input
          v-model="newDesc"
          type="text"
          placeholder="任务描述（可选）"
          class="form-input"
          maxlength="200"
          :disabled="adding"
        />
        <div class="form-row">
          <select v-model="newPriority" class="form-select" :disabled="adding">
            <option value="low">🟢 低优先级</option>
            <option value="mid">🟡 中优先级</option>
            <option value="high">🔴 高优先级</option>
          </select>
          <button type="submit" class="btn-add" :disabled="!newTitle.trim() || adding">
            {{ adding ? '⏳ 添加中...' : '➕ 添加任务' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* ========== 统计卡片 ========== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 20px;
  text-align: center;
  transition: var(--transition);
}
.stat-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.stat-num {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  margin-top: 4px;
}

/* ========== 进度条 ========== */
.progress-bar-wrap {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin-bottom: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 10px;
}

.progress-track {
  height: 8px;
  background: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), #a855f7, var(--color-success));
  border-radius: 4px;
  transition: width 0.6s ease;
}

/* ========== 加载状态 ========== */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-muted);
}
.loading-spinner {
  font-size: 2rem;
  display: block;
  margin-bottom: 10px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.loading-state p {
  font-size: 0.9rem;
}

/* ========== 工具栏 ========== */
.toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.9rem;
  outline: none;
  transition: var(--transition);
}
.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-glow);
}

.filter-tabs {
  display: flex;
  gap: 4px;
  background: var(--color-surface);
  border-radius: 8px;
  padding: 4px;
}

.filter-btn {
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: var(--transition);
}
.filter-btn:hover {
  color: var(--color-text);
}
.filter-btn.active {
  background: var(--color-primary);
  color: white;
}

/* ========== 看板三列 ========== */
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.board-col {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.col-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 2px solid var(--col-color);
  font-weight: 600;
  font-size: 0.95rem;
}

.col-count {
  background: var(--color-border);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.col-body {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.col-empty {
  text-align: center;
  padding: 32px 16px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

/* ========== 任务卡片 ========== */
.task-card {
  background: #1a2332;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 14px;
  transition: var(--transition);
  position: relative;
}
.task-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-card);
}
.task-card.priority-high {
  border-left: 3px solid var(--color-danger);
}
.task-card.priority-mid {
  border-left: 3px solid var(--color-warn);
}
.task-card.priority-low {
  border-left: 3px solid var(--color-success);
}

.task-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-priority {
  font-size: 0.7rem;
  opacity: 0.8;
}

.task-time {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.task-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.3;
}

.task-desc {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.4;
  margin-bottom: 10px;
}

.task-actions {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
}

.btn-action {
  width: 30px;
  height: 30px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.85rem;
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
.task-list-enter-active {
  transition: all 0.3s ease;
}
.task-list-leave-active {
  transition: all 0.2s ease;
}
.task-list-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.task-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.task-list-move {
  transition: transform 0.3s ease;
}

/* ========== 新建任务 ========== */
.add-task-card {
  background: var(--color-surface);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  padding: 24px;
}

.add-task-card h3 {
  font-size: 1.05rem;
  margin-bottom: 16px;
}

.add-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--color-danger);
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #1a2332;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.9rem;
  outline: none;
  transition: var(--transition);
}
.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-glow);
}

.form-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.form-select {
  padding: 10px 14px;
  background: #1a2332;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
}

.btn-add {
  flex: 1;
  padding: 11px 24px;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.btn-add:hover:not(:disabled) {
  background: #4f46e5;
  box-shadow: var(--shadow-glow);
}
.btn-add:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .board {
    grid-template-columns: 1fr;
  }
  .toolbar {
    flex-direction: column;
  }
  .form-row {
    flex-direction: column;
  }
  .btn-add {
    width: 100%;
  }
}
</style>
