<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'

const router = useRouter()
const auth = useAuthStore()
const tasksStore = useTasksStore()

const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const submitting = ref(false)

async function handleRegister() {
  error.value = ''
  if (!email.value.trim() || !password.value || !confirm.value) {
    error.value = '请填写所有字段'
    return
  }
  if (password.value.length < 6) {
    error.value = '密码至少 6 位'
    return
  }
  if (password.value !== confirm.value) {
    error.value = '两次密码不一致'
    return
  }
  submitting.value = true
  try {
    await auth.signUp(email.value.trim(), password.value)
    // 注册成功后尝试迁移本地旧数据
    await tasksStore.migrateFromLocalStorage()
    router.replace('/')
  } catch (e: any) {
    error.value = e.message || '注册失败，请重试'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <span class="auth-icon">✨</span>
        <h1>注册</h1>
        <p>创建一个新账户，开始管理你的任务</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div v-if="error" class="auth-error">{{ error }}</div>

        <label class="field-label">邮箱</label>
        <input
          v-model="email"
          type="email"
          placeholder="your@email.com"
          class="form-input"
          autocomplete="email"
          :disabled="submitting"
        />

        <label class="field-label">密码</label>
        <input
          v-model="password"
          type="password"
          placeholder="至少 6 位"
          class="form-input"
          autocomplete="new-password"
          :disabled="submitting"
        />

        <label class="field-label">确认密码</label>
        <input
          v-model="confirm"
          type="password"
          placeholder="再次输入密码"
          class="form-input"
          autocomplete="new-password"
          :disabled="submitting"
        />

        <button type="submit" class="btn-auth" :disabled="submitting">
          {{ submitting ? '注册中...' : '🚀 注册' }}
        </button>
      </form>

      <p class="auth-switch">
        已有账户？<RouterLink to="/login">去登录 →</RouterLink>
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
