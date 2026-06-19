<script setup lang="ts">
/**
 * 登录页
 * 输入用户名和密码，新用户自动注册
 * 极简设计，无多余元素
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppIcon from '@/components/icons/AppIcon.vue'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const showPwd = ref(false)
const error = ref('')
const statusText = ref('')
const submitting = ref(false)

async function handleSubmit() {
  error.value = ''
  statusText.value = ''
  if (!username.value.trim()) { error.value = '请输入用户名'; return }
  if (!password.value) { error.value = '请输入密码'; return }
  if (password.value.length < 6) { error.value = '密码至少需要6位'; return }

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
    if (!msg.includes('invalid') && !msg.includes('credential')) {
      error.value = '登录失败：' + (e.message || '请重试')
      submitting.value = false
      return
    }
  }

  // 自动注册
  try {
    statusText.value = '账户不存在，自动注册中...'
    await auth.signUp(name, pass)
    router.replace('/')
  } catch (e: any) {
    error.value = '注册失败：' + (e.message || '请重试')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <AppIcon name="clipboard" :size="36" class="auth-icon" />
        <h1>登录</h1>
        <p>输入用户名和密码，新用户自动注册</p>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="error" class="msg msg-err">{{ error }}</div>
        <div v-if="statusText" class="msg msg-info">{{ statusText }}</div>

        <label class="label">用户名</label>
        <input v-model="username" type="text" class="input" placeholder="输入你的用户名" autocomplete="username" :disabled="submitting" />

        <label class="label">密码（至少6位）</label>
        <div class="pwd-wrap">
          <input v-model="password" :type="showPwd ? 'text' : 'password'" class="input" placeholder="输入密码" autocomplete="current-password" :disabled="submitting" />
          <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
            <AppIcon :name="showPwd ? 'eye-off' : 'eye'" :size="18" />
          </button>
        </div>

        <button type="submit" class="btn" :disabled="submitting">
          {{ submitting ? statusText || '处理中...' : '登录 / 注册' }}
        </button>
      </form>

      <p class="hint">还没有账户？直接输入即可，自动为你注册</p>
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
  max-width: 380px;
  background: var(--bg-surface);
  border: 1px solid var(--bg-hover);
  border-radius: var(--radius-lg);
  padding: var(--space-xl) var(--space-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--space-lg);
}
.auth-icon { color: var(--accent); margin-bottom: var(--space-sm); }
.auth-header h1 { font-size: 1.25rem; font-weight: 700; margin-bottom: 4px; }
.auth-header p  { font-size: 0.8125rem; color: var(--text-secondary); }

.auth-form { display: flex; flex-direction: column; gap: 12px; }

.msg { padding: 8px 12px; border-radius: var(--radius-sm); font-size: 0.8125rem; }
.msg-err  { background: var(--red-muted);   color: var(--red);   border: 1px solid var(--red); }
.msg-info { background: var(--accent-muted); color: var(--accent); border: 1px solid var(--accent); }

.label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: -8px;
}
.input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--bg-hover);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  outline: none;
  transition: border-color var(--dur-fast) var(--ease-out);
}
.input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.input:disabled { opacity: 0.5; }

.pwd-wrap { position: relative; }
.pwd-wrap .input { padding-right: 40px; }
.pwd-toggle {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  color: var(--text-tertiary);
  transition: color var(--dur-fast) var(--ease-out);
}
.pwd-toggle:hover { color: var(--accent); }

.btn {
  height: 42px;
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius-sm);
  font-size: 0.9375rem;
  font-weight: 600;
  transition: background var(--dur-fast) var(--ease-out);
  margin-top: 2px;
}
.btn:hover:not(:disabled) { background: var(--accent-hover); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.hint {
  text-align: center;
  margin-top: var(--space-md);
  font-size: 0.8125rem;
  color: var(--text-tertiary);
}

@media (max-width: 480px) {
  .auth-card { padding: var(--space-lg); }
}
</style>
