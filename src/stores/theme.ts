/**
 * 主题状态管理
 * 支持深色 / 浅色切换，持久化到 localStorage
 */
import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import type { ThemeMode } from '@/types'

const STORAGE_KEY = 'app-theme'

/** 从 localStorage 读取用户偏好，默认深色 */
function getInitial(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  // 读取系统偏好
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(getInitial())

  /** 切换主题 */
  function toggle() {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }

  /** 设置指定主题 */
  function set(m: ThemeMode) {
    mode.value = m
  }

  // 同步到 DOM 和 localStorage
  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', mode.value)
    try { localStorage.setItem(STORAGE_KEY, mode.value) } catch {}
  })

  return { mode, toggle, set }
})
