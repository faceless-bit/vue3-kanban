import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)

  /** 初始化：恢复 session 并监听状态变化 */
  async function init() {
    try {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value = data.session?.user ?? null
    } catch {
      // 未配置 Supabase 或网络错误时静默失败
    } finally {
      loading.value = false
    }

    // 监听登录/登出变化
    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
    })
  }

  /** 注册 */
  async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  /** 登录 */
  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  /** 登出 */
  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    session.value = null
  }

  const isLoggedIn = () => !!user.value

  return { user, session, loading, init, signUp, signIn, signOut, isLoggedIn }
})
