import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'

export type TaskStatus = 'todo' | 'doing' | 'done'
export type TaskPriority = 'low' | 'mid' | 'high'

export interface Task {
  id: number
  user_id: string
  title: string
  desc: string
  status: TaskStatus
  priority: TaskPriority
  created_at: string
}

export interface AdminUser {
  uid: string
  uname: string
  ucreated_at: string
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)

  // ==================== 管理员状态 ====================
  const adminUsers = ref<AdminUser[]>([])
  const adminSelectedUserId = ref<string | null>(null)
  const adminSelectedTasks = ref<Task[]>([])

  // ==================== 计算属性 ====================
  const todoTasks = computed(() => tasks.value.filter(t => t.status === 'todo'))
  const doingTasks = computed(() => tasks.value.filter(t => t.status === 'doing'))
  const doneTasks = computed(() => tasks.value.filter(t => t.status === 'done'))

  const stats = computed(() => ({
    total: tasks.value.length,
    todo: todoTasks.value.length,
    doing: doingTasks.value.length,
    done: doneTasks.value.length,
  }))

  const progressPercent = computed(() => {
    if (stats.value.total === 0) return 0
    return Math.round((stats.value.done / stats.value.total) * 100)
  })

  // ==================== 普通用户：任务 CRUD ====================
  async function fetchTasks() {
    const auth = useAuthStore()
    if (!auth.user) return

    loading.value = true
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      tasks.value = data
    }
    loading.value = false
  }

  async function addTask(title: string, desc: string, priority: TaskPriority = 'mid') {
    const auth = useAuthStore()
    if (!auth.user) return null

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: auth.user.id,
        title,
        desc,
        status: 'todo',
        priority,
      })
      .select()
      .single()

    if (!error && data) {
      tasks.value.unshift(data)
    }
    return data
  }

  async function moveTask(id: number, to: TaskStatus) {
    const { error } = await supabase
      .from('tasks')
      .update({ status: to })
      .eq('id', id)

    if (!error) {
      const task = tasks.value.find(t => t.id === id)
      if (task) task.status = to
    }
  }

  async function deleteTask(id: number) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (!error) {
      tasks.value = tasks.value.filter(t => t.id !== id)
    }
  }

  // ==================== 管理员：查看所有用户 ====================
  async function adminFetchUsers() {
    const { data, error } = await supabase.rpc('admin_list_users')
    if (!error && data) {
      adminUsers.value = data
    }
  }

  // ==================== 管理员：查看/修改指定用户任务 ====================
  async function adminSelectUser(userId: string) {
    adminSelectedUserId.value = userId
    const { data, error } = await supabase.rpc('admin_get_user_tasks', {
      target_user_id: userId,
    })
    if (!error && data) {
      adminSelectedTasks.value = data
    }
  }

  async function adminMoveTask(taskId: number, to: TaskStatus) {
    const task = adminSelectedTasks.value.find(t => t.id === taskId)
    if (!task) return

    const { error } = await supabase.rpc('admin_update_task', {
      task_id: taskId,
      new_title: task.title,
      new_desc: task.desc,
      new_status: to,
      new_priority: task.priority,
    })
    if (!error) {
      task.status = to
    }
  }

  async function adminDeleteTask(taskId: number) {
    const { error } = await supabase.rpc('admin_delete_task', { task_id: taskId })
    if (!error) {
      adminSelectedTasks.value = adminSelectedTasks.value.filter(t => t.id !== taskId)
    }
  }

  async function adminAddTask(title: string, desc: string, priority: TaskPriority = 'mid') {
    if (!adminSelectedUserId.value) return null

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: adminSelectedUserId.value,
        title,
        desc,
        status: 'todo',
        priority,
      })
      .select()
      .single()

    if (!error && data) {
      adminSelectedTasks.value.unshift(data)
    }
    return data
  }

  // ==================== 数据迁移 ====================
  async function migrateFromLocalStorage() {
    const auth = useAuthStore()
    if (!auth.user) return

    try {
      const raw = localStorage.getItem('vue3-tasks')
      if (!raw) return

      const localTasks: Array<{
        title: string
        desc: string
        status: TaskStatus
        priority: TaskPriority
        createdAt: number
      }> = JSON.parse(raw)

      if (localTasks.length === 0) return

      const toInsert = localTasks.map(t => ({
        user_id: auth.user!.id,
        title: t.title,
        desc: t.desc || '',
        status: t.status,
        priority: t.priority || 'mid',
      }))

      await supabase.from('tasks').insert(toInsert)
      localStorage.removeItem('vue3-tasks')
      await fetchTasks()
    } catch {
      // 迁移失败静默处理
    }
  }

  return {
    tasks, loading, todoTasks, doingTasks, doneTasks, stats, progressPercent,
    fetchTasks, addTask, moveTask, deleteTask, migrateFromLocalStorage,
    adminUsers, adminSelectedUserId, adminSelectedTasks,
    adminFetchUsers, adminSelectUser, adminMoveTask, adminDeleteTask, adminAddTask,
  }
})
