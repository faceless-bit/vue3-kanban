<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)
const statusText = ref('')

async function handleLogin() {
  error.value = ''
  statusText.value = ''
  if (!username.value.trim()) {
    error.value = '请输入用户名'
    return
  }
  if (!password.value) {
    error.value = '请输入密码'
    return
  }
  if (password.value.length < 6) {
    error.value = '密码至少需要6位'
    return
  }

  submitting.value = true
  const name = username.value.trim()
  const pass = password.value

  // 先尝试登录
  try {
    statusText.value = '登录中...'
    await auth.signIn(name, pass)
    router.replace('/')
    return
  } catch (e: any) {
    const msg = (e.message || '').toLowerCase()
    // 如果不是"用户名或密码错误"，说明是其他问题，直接报错
    if (!msg.includes('invalid') && !msg.includes('credential') && !msg.includes('wrong')) {
      if (msg.includes('rate') || msg.includes('limit')) {
        error.value = '操作太频繁，请稍等几秒再试'
      } else if (msg.includes('network') || msg.includes('fetch')) {
        error.value = '网络错误，请检查网络连接后重试'
      } else {
        error.value = '登录失败：' + (e.message || '请重试')
      }
      submitting.value = false
      return
    }
  }

  // 登录失败 → 自动注册
  try {
    statusText.value = '账户不存在，自动注册中...'
    await auth.signUp(name, pass)
    router.replace('/')
  } catch (e: any) {
    console.error('自动注册失败:', e)
    error.value = '自动注册失败：' + (e.message || '请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <span class="auth-icon">📋</span>
        <h1>登录</h1>
        <p>输入用户名和密码，新用户自动注册</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div v-if="error" class="auth-error">{{ error }}</div>
        <div v-if="statusText" class="auth-status">{{ statusText }}</div>

        <label class="field-label">用户名</label>
        <input
          v-model="username"
          type="text"
          placeholder="输入你的用户名"
          class="form-input"
          autocomplete="username"
          :disabled="submitting"
        />

        <label class="field-label">密码（至少6位）</label>
        <input
          v-model="password"
          type="password"
          placeholder="输入密码"
          class="form-input"
          autocomplete="current-password"
          :disabled="submitting"
        />

        <button type="submit" class="btn-auth" :disabled="submitting">
          {{ submitting ? statusText || '处理中...' : '🔐 登录 / 自动注册' }}
        </button>
      </form>

      <p class="auth-switch">
        还没有账户？直接输入即可，自动为你注册
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 36px 32px;
}

.auth-header {
  text-align: center;
  margin-bottom: 28px;
}
.auth-icon { font-size: 2.5rem; display: block; margin-bottom: 8px; }
.auth-header h1 { font-size: 1.4rem; font-weight: 700; margin-bottom: 6px; }
.auth-header p { font-size: 0.85rem; color: var(--color-text-muted); }

.auth-form { display: flex; flex-direction: column; gap: 14px; }

.auth-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--color-danger);
  font-size: 0.85rem;
}

.auth-status {
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--color-primary);
  font-size: 0.85rem;
}

.field-label { font-size: 0.82rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: -8px; }

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #1a2332;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-glow); }
.form-input:disabled { opacity: 0.5; }

.btn-auth {
  padding: 12px;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, box-shadow 0.2s ease;
  margin-top: 4px;
}
.btn-auth:hover:not(:disabled) { background: #4f46e5; box-shadow: 0 0 20px var(--color-primary-glow); }
.btn-auth:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-switch {
  text-align: center;
  margin-top: 20px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

@media (max-width: 480px) {
  .auth-card { padding: 24px 20px; }
}
</style>
