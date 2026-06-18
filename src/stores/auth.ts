import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

/** 把 username 转为 Supabase 登录用的虚拟邮箱 */
function emailFrom(username: string): string {
  return username.trim().toLowerCase() + '@kanban.local'
}

/** 从 Supabase email 反推显示用的用户名 */
export function usernameFrom(email: string): string {
  return email.replace('@kanban.local', '')
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)
  const isAdmin = ref(false)

  const displayName = computed(() => {
    if (!user.value?.email) return ''
    return usernameFrom(user.value.email)
  })

  /** 初始化：恢复 session 并监听状态变化 */
  async function init() {
    try {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value = data.session?.user ?? null
      if (user.value) {
        await checkAdmin()
      }
    } catch {
      // 未配置 Supabase 或网络错误时静默失败
    } finally {
      loading.value = false
    }

    // 监听登录/登出变化
    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
      if (newSession?.user) {
        await checkAdmin()
      } else {
        isAdmin.value = false
      }
    })
  }

  /** 检查当前用户是否为管理员 */
  async function checkAdmin() {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.value?.id)
        .single()
      isAdmin.value = data?.is_admin ?? false
    } catch {
      isAdmin.value = false
    }
  }

  /** 注册（username + password） */
  async function signUp(username: string, password: string) {
    const email = emailFrom(username)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    })
    if (error) throw error

    // 注册成功后创建 profile
    if (data.user) {
      const isAdminUser = username.trim() === '胡伟建'
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        username: username.trim(),
        is_admin: isAdminUser,
      })
      isAdmin.value = isAdminUser
    }
    return data
  }

  /** 登录（username + password） */
  async function signIn(username: string, password: string) {
    const email = emailFrom(username)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    await checkAdmin()
    return data
  }

  /** 登出 */
  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    session.value = null
    isAdmin.value = false
  }

  const isLoggedIn = () => !!user.value

  return { user, session, loading, isAdmin, displayName, init, signUp, signIn, signOut, isLoggedIn }
})
