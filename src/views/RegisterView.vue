<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import AppIcon from '@/components/AppIcon.vue'

const router = useRouter()
const auth = useAuthStore()
const tasksStore = useTasksStore()

const username = ref('')
const password = ref('')
const showPwd = ref(false)
const error = ref('')
const success = ref('')
const submitting = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''

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
  try {
    await auth.signUp(username.value.trim(), password.value)
    await tasksStore.migrateFromLocalStorage()
    success.value = '注册成功！'
    setTimeout(() => router.replace('/'), 500)
  } catch (e: any) {
    const msg = (e.message || '').toLowerCase()
    if (msg.includes('already') || msg.includes('exist') || msg.includes('taken')) {
      error.value = '该用户名已被注册'
    } else if (msg.includes('password')) {
      error.value = '密码不符合要求，至少需要6位'
    } else if (msg.includes('rate') || msg.includes('limit')) {
      error.value = '操作太频繁，请稍等几秒再试'
    } else if (msg.includes('network') || msg.includes('fetch')) {
      error.value = '网络错误，请检查网络连接后重试'
    } else {
      error.value = '注册失败：' + (e.message || '请重试')
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
        <AppIcon name="star" :size="40" class="auth-icon" />
        <h1>注册</h1>
        <p>起一个名字，设一个密码，马上开始</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div v-if="error" class="auth-error">{{ error }}</div>
        <div v-if="success" class="auth-success">{{ success }}</div>

        <label class="field-label">用户名</label>
        <input
          v-model="username"
          type="text"
          placeholder="随便起个名就行"
          class="form-input"
          autocomplete="username"
          :disabled="submitting"
        />

        <label class="field-label">密码（至少6位）</label>
        <div class="pwd-wrap">
          <input
            v-model="password"
            :type="showPwd ? 'text' : 'password'"
            placeholder="至少6位"
            class="form-input"
            autocomplete="new-password"
            :disabled="submitting"
          />
          <button type="button" class="pwd-toggle" @click="showPwd = !showPwd" tabindex="-1">
            <AppIcon :name="showPwd ? 'eye-off' : 'eye'" :size="18" />
          </button>
        </div>

        <button type="submit" class="btn-auth" :disabled="submitting">
          {{ submitting ? '注册中...' : '注册' }}
        </button>
      </form>

      <p class="auth-switch">
        已有账户？<RouterLink to="/login">去登录</RouterLink>
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
  border-radius: 14px;
  padding: 34px 30px;
}

.auth-header {
  text-align: center;
  margin-bottom: 26px;
}
.auth-icon { color: var(--color-primary); margin-bottom: 8px; }
.auth-header h1 { font-size: 1.3rem; font-weight: 700; margin-bottom: 4px; }
.auth-header p { font-size: 0.83rem; color: var(--color-text-muted); }

.auth-form { display: flex; flex-direction: column; gap: 12px; }

.auth-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--color-danger);
  font-size: 0.83rem;
}

.auth-success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--color-success);
  font-size: 0.83rem;
}

.field-label { font-size: 0.8rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: -8px; }

.form-input {
  width: 100%;
  padding: 10px 14px;
  background: #222;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-glow); }
.form-input:disabled { opacity: 0.5; }

.pwd-wrap { position: relative; }
.pwd-wrap .form-input { padding-right: 40px; }
.pwd-toggle {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.pwd-toggle:hover { color: var(--color-primary); background: rgba(13,148,136,0.1); }

.btn-auth {
  padding: 11px;
  background: var(--color-primary);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 2px;
}
.btn-auth:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-auth:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-switch {
  text-align: center;
  margin-top: 18px;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}
.auth-switch a {
  color: var(--color-primary);
  font-weight: 600;
}
.auth-switch a:hover { text-decoration: underline; }

@media (max-width: 480px) {
  .auth-card { padding: 24px 18px; }
}
</style>
