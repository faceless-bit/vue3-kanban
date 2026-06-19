<script setup lang="ts">
/**
 * 新建任务表单
 * 包含标题、描述、优先级选择、提交按钮
 * @param loading 是否正在提交中
 */
import { ref } from 'vue'
import type { TaskPriority } from '@/types'
import AppIcon from '@/components/icons/AppIcon.vue'

const props = defineProps<{
  loading?: boolean
  error?: string
}>()

const emit = defineEmits<{
  submit: [title: string, desc: string, priority: TaskPriority]
}>()

const title = ref('')
const desc = ref('')
const priority = ref<TaskPriority>('mid')

/** 提交表单 */
function onSubmit() {
  const t = title.value.trim()
  if (!t) return
  emit('submit', t, desc.value.trim(), priority.value)
  // 成功后清空
  title.value = ''
  desc.value = ''
  priority.value = 'mid'
}
</script>

<template>
  <div class="form-card">
    <h3 class="form-title">
      <AppIcon name="plus" :size="16" />
      新建任务
    </h3>

    <!-- 错误提示 -->
    <div v-if="props.error" class="form-error">{{ props.error }}</div>

    <form @submit.prevent="onSubmit" class="form-body">
      <input
        v-model="title"
        type="text"
        class="input"
        placeholder="任务标题 *"
        maxlength="60"
        :disabled="props.loading"
      />
      <input
        v-model="desc"
        type="text"
        class="input"
        placeholder="描述（可选）"
        maxlength="200"
        :disabled="props.loading"
      />
      <div class="form-row">
        <select v-model="priority" class="select" :disabled="props.loading">
          <option value="low">低优先级</option>
          <option value="mid">中优先级</option>
          <option value="high">高优先级</option>
        </select>
        <button type="submit" class="submit-btn" :disabled="!title.trim() || props.loading">
          {{ props.loading ? '添加中...' : '添加' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-card {
  background: var(--bg-surface);
  border: 1px dashed var(--border-hover);
  border-radius: var(--radius-md);
  padding: 20px;
  margin-top: var(--space-lg);
}
.form-title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
}
.form-error {
  background: var(--red-muted);
  border: 1px solid var(--red);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  color: var(--red);
  font-size: 0.8125rem;
  margin-bottom: 10px;
}
.form-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.input {
  width: 100%;
  height: 38px;
  padding: 0 14px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-out);
}
.input::placeholder { color: var(--text-tertiary); }
.input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.input:disabled { opacity: 0.5; }

.form-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.select {
  height: 38px;
  padding: 0 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  outline: none;
  cursor: pointer;
}
.submit-btn {
  flex: 1;
  height: 38px;
  background: var(--accent);
  color: #ffffff;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  transition: background var(--duration-fast) var(--ease-out),
              opacity var(--duration-fast) var(--ease-out);
}
.submit-btn:hover:not(:disabled) { background: var(--accent-hover); }
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

@media (max-width: 640px) {
  .form-row { flex-direction: column; }
  .submit-btn { width: 100%; }
}
</style>
