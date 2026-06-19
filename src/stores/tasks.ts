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
  description: string
  status: TaskStatus
  priority: TaskPriority
  created_at: string
}

export interface AdminUser {
  uid: string
  uname: string
  ucreated_at: string
}

function demoTasks(userId: string) {
  return [
    { user_id: userId, title: '欢迎使用任务看板', description: '点击按钮将任务在不同列之间移动，试试看吧！', status: 'todo' as TaskStatus, priority: 'mid' as TaskPriority },
    { user_id: userId, title: '创建你的第一个任务', description: '在底部表单输入标题和描述，点击添加即可创建新任务。', status: 'todo' as TaskStatus, priority: 'high' as TaskPriority },
    { user_id: userId, title: '正在进行的任务示例', description: '这个任务正在进行中，完成后点击完成按钮移到已完成列。', status: 'doing' as TaskStatus, priority: 'high' as TaskPriority },
    { user_id: userId, title: '试试搜索和筛选功能', description: '顶部工具栏可以按关键词搜索，也可以按状态筛选任务。', status: 'doing' as TaskStatus, priority: 'mid' as TaskPriority },
    { user_id: userId, title: '这是一个已完成的任务', description: '点击完成按钮后，任务会出现在这一列。数据自动保存到云端。', status: 'done' as TaskStatus, priority: 'low' as TaskPriority },
  ]
}

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const adminUsers = ref<AdminUser[]>([])
  const adminSelectedUserId = ref<string | null>(null)
  const adminSelectedTasks = ref<Task[]>([])

  // -- localStorage helpers (无登录时的回退) --
  const LS_KEY = 'demo-tasks'
  let demoIdCounter = 1

  function loadFromLocal(): Task[] {
    try {
      const raw = localStorage.getItem(LS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  }
  function saveToLocal(list: Task[]) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)) } catch {}
  }

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

  async function fetchTasks() {
    const auth = useAuthStore()
    // 无登录：localStorage 模式
    if (!auth.user) {
      loading.value = true
      let local = loadFromLocal()
      if (local.length === 0) {
        // 填入演示数据
        local = demoTasks('demo').map((t, i) => ({ ...t, id: i + 1 } as Task))
        demoIdCounter = local.length + 1
        saveToLocal(local)
      } else {
        demoIdCounter = Math.max(...local.map(t => t.id), 0) + 1
      }
      tasks.value = local
      loading.value = false
      return
    }

    loading.value = true
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('获取任务失败:', error.message)
    } else if (data) {
      if (data.length === 0) {
        const seed = demoTasks(auth.user.id)
        const { data: inserted, error: insertErr } = await supabase
          .from('tasks')
          .insert(seed)
          .select('*')
          .order('created_at', { ascending: false })
        if (insertErr) {
          console.error('演示任务插入失败:', insertErr.message)
        }
        tasks.value = inserted || []
      } else {
        tasks.value = data
      }
    }
    loading.value = false
  }

  async function addTask(title: string, description: string, priority: TaskPriority = 'mid') {
    const auth = useAuthStore()
    // 无登录：localStorage 模式
    if (!auth.user) {
      const task: Task = {
        id: demoIdCounter++,
        user_id: 'demo',
        title,
        description,
        status: 'todo',
        priority,
        created_at: new Date().toISOString(),
      }
      tasks.value.unshift(task)
      saveToLocal(tasks.value)
      return task
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: auth.user.id,
        title,
        description,
        status: 'todo',
        priority,
      })
      .select()
      .single()

    if (error) {
      console.error('添加任务数据库错误:', error.message, error.code)
      throw new Error('添加失败：' + error.message)
    }
    if (data) {
      tasks.value.unshift(data)
    }
    return data
  }

  async function moveTask(id: number, to: TaskStatus) {
    const auth = useAuthStore()
    if (!auth.user) {
      const task = tasks.value.find(t => t.id === id)
      if (task) { task.status = to; saveToLocal(tasks.value) }
      return
    }

    const { error } = await supabase
      .from('tasks')
      .update({ status: to })
      .eq('id', id)

    if (error) {
      console.error('移动任务失败:', error.message)
      throw new Error('移动失败：' + error.message)
    }
    const task = tasks.value.find(t => t.id === id)
    if (task) task.status = to
  }

  async function deleteTask(id: number) {
    const auth = useAuthStore()
    if (!auth.user) {
      tasks.value = tasks.value.filter(t => t.id !== id)
      saveToLocal(tasks.value)
      return
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('删除任务失败:', error.message)
      throw new Error('删除失败：' + error.message)
    }
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  // ==================== 管理员 ====================
  async function adminFetchUsers() {
    const { data, error } = await supabase.rpc('admin_list_users')
    if (error) {
      console.error('获取用户列表失败:', error.message)
      return
    }
    if (data) adminUsers.value = data
  }

  async function adminSelectUser(userId: string) {
    adminSelectedUserId.value = userId
    const { data, error } = await supabase.rpc('admin_get_user_tasks', { target_user_id: userId })
    if (error) {
      console.error('获取用户任务失败:', error.message)
      return
    }
    if (data) adminSelectedTasks.value = data
  }

  async function adminMoveTask(taskId: number, to: TaskStatus) {
    const task = adminSelectedTasks.value.find(t => t.id === taskId)
    if (!task) return
    const { error } = await supabase.rpc('admin_update_task', {
      task_id: taskId, new_title: task.title, new_desc: task.description,
      new_status: to, new_priority: task.priority,
    })
    if (error) {
      console.error('管理员移动任务失败:', error.message)
      return
    }
    task.status = to
  }

  async function adminDeleteTask(taskId: number) {
    const { error } = await supabase.rpc('admin_delete_task', { task_id: taskId })
    if (error) {
      console.error('管理员删除任务失败:', error.message)
      return
    }
    adminSelectedTasks.value = adminSelectedTasks.value.filter(t => t.id !== taskId)
  }

  async function adminAddTask(title: string, description: string, priority: TaskPriority = 'mid') {
    if (!adminSelectedUserId.value) return null
    const { data, error } = await supabase
      .from('tasks')
      .insert({ user_id: adminSelectedUserId.value, title, description, status: 'todo', priority })
      .select().single()
    if (error) {
      console.error('管理员添加任务失败:', error.message)
      return null
    }
    if (data) adminSelectedTasks.value.unshift(data)
    return data
  }

  async function migrateFromLocalStorage() {
    const auth = useAuthStore()
    if (!auth.user) return
    try {
      const raw = localStorage.getItem('vue3-tasks')
      if (!raw) return
      const localTasks: Array<{ title: string; desc: string; status: TaskStatus; priority: TaskPriority; createdAt: number }> = JSON.parse(raw)
      if (localTasks.length === 0) return
      const toInsert = localTasks.map(t => ({
        user_id: auth.user!.id,
        title: t.title,
        description: t.desc || '',
        status: t.status,
        priority: t.priority || 'mid',
      }))
      await supabase.from('tasks').insert(toInsert)
      localStorage.removeItem('vue3-tasks')
      await fetchTasks()
    } catch {}
  }

  return {
    tasks, loading, todoTasks, doingTasks, doneTasks, stats, progressPercent,
    fetchTasks, addTask, moveTask, deleteTask, migrateFromLocalStorage,
    adminUsers, adminSelectedUserId, adminSelectedTasks,
    adminFetchUsers, adminSelectUser, adminMoveTask, adminDeleteTask, adminAddTask,
  }
})
