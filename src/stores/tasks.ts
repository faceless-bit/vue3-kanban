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

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)

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

  // ==================== 数据获取 ====================
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

  // ==================== CRUD ====================
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

  // ==================== 数据迁移 ====================
  /** 将 localStorage 中的旧数据迁移到 Supabase */
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
  }
})
