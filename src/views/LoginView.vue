<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function handleLogin() {
  error.value = ''
  if (!username.value.trim() && !password.value) {
    error.value = '请输入用户名和密码'
    return
  }
  if (!username.value.trim()) {
    error.value = '请输入用户名'
    return
  }
  if (!password.value) {
    error.value = '请输入密码'
    return
  }
  submitting.value = true
  try {
    await auth.signIn(username.value.trim(), password.value)
    router.replace('/')
  } catch (e: any) {
    const msg = e.message || ''
    if (msg.includes('Invalid') || msg.includes('invalid') || msg.includes('credentials')) {
      error.value = '用户名或密码错误，请检查后重试'
    } else if (msg.includes('email') && msg.includes('confirm')) {
      error.value = '邮箱未验证，请先验证邮箱'
    } else if (msg.includes('rate')) {
      error.value = '操作太频繁，请稍后再试'
    } else {
      error.value = e.message || '登录失败，请重试'
    }
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
        <p>欢迎回来，输入用户名和密码即可</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div v-if="error" class="auth-error">{{ error }}</div>

        <label class="field-label">用户名</label>
        <input
          v-model="username"
          type="text"
          placeholder="输入你的用户名"
          class="form-input"
          autocomplete="username"
          :disabled="submitting"
        />

        <label class="field-label">密码</label>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="form-input"
          autocomplete="current-password"
          :disabled="submitting"
        />

        <button type="submit" class="btn-auth" :disabled="submitting">
          {{ submitting ? '登录中...' : '🔐 登录' }}
        </button>
      </form>

      <p class="auth-switch">
        还没有账户？<RouterLink to="/register">立即注册 →</RouterLink>
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
.auth-header h1 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 6px;
}
.auth-header p {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--color-danger);
  font-size: 0.85rem;
}

.field-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: -8px;
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
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-glow);
}
.form-input:disabled {
  opacity: 0.5;
}

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
.btn-auth:hover:not(:disabled) {
  background: #4f46e5;
  box-shadow: 0 0 20px var(--color-primary-glow);
}
.btn-auth:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-switch {
  text-align: center;
  margin-top: 20px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
.auth-switch a {
  color: var(--color-primary);
  font-weight: 600;
}
.auth-switch a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px 20px;
  }
}
</style>
