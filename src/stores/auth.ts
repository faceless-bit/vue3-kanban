import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

/** 把 username 转为纯英文数字的虚拟邮箱（绕过 Supabase 邮箱格式验证） */
function emailFrom(username: string): string {
  // 对用户名做简单哈希，生成合法 ASCII 邮箱地址
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = ((hash << 5) - hash) + username.charCodeAt(i)
    hash |= 0
  }
  return 'u' + Math.abs(hash).toString(36) + '@kb.test'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)

  /** 显示名：优先从注册时存的 metadata 读取 */
  const displayName = computed(() => {
    if (user.value?.user_metadata?.username) {
      return user.value.user_metadata.username as string
    }
    return ''
  })

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

    supabase.auth.onAuthStateChange(async (_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user ?? null
    })
  }

  /** 注册 */
  async function signUp(username: string, password: string) {
    const email = emailFrom(username)
    console.log('signUp: 准备注册, username=', username, 'email=', email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.trim() },
      },
    })
    if (error) {
      console.error('signUp 失败:', error.message, error.code, error)
      throw error
    }
    console.log('signUp 成功:', data.user?.id)

    if (data.user) {
      // profiles 异步写入，不阻塞登录
      supabase.from('profiles').upsert({
        user_id: data.user.id,
        username: username.trim(),
      }, { onConflict: 'user_id' }).then(() => {}, () => {})
    }
    return data
  }

  /** 登录 */
  async function signIn(username: string, password: string) {
    const email = emailFrom(username)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    // 确保 profile 存在（修复旧数据）
    supabase.from('profiles').upsert({
      user_id: data.user!.id,
      username: username.trim(),
    }, { onConflict: 'user_id' }).then(() => {}, () => {})
    return data
  }

  /** 登出 */
  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    session.value = null
  }

  const isLoggedIn = () => !!user.value

  return { user, session, loading, displayName, init, signUp, signIn, signOut, isLoggedIn }
})
