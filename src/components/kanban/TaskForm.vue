<script setup lang="ts">
/**
 * 新建任务表单 — 精致极简风格
 */
import { ref } from 'vue'
import type { TaskPriority } from '@/types'

const props = defineProps<{ loading?: boolean; error?: string }>()
const emit = defineEmits<{ submit: [title: string, desc: string, priority: TaskPriority] }>()

const title = ref('')
const desc = ref('')
const priority = ref<TaskPriority>('mid')
const focused = ref(false)

function onSubmit() {
  const t = title.value.trim()
  if (!t) return
  emit('submit', t, desc.value.trim(), priority.value)
  title.value = ''; desc.value = ''; priority.value = 'mid'; focused.value = false
}
</script>

<template>
  <div class="form-card" :class="{ focused }">
    <div class="form-inner">
      <!-- 标题输入 -->
      <input
        v-model="title" type="text"
        class="input title-input"
        placeholder="添加新任务..."
        maxlength="60"
        :disabled="props.loading"
        @focus="focused = true"
        @keydown.enter.prevent="onSubmit"
      />

      <!-- 展开区 -->
      <Transition name="slide-up">
        <div v-if="focused" class="expand">
          <input
            v-model="desc" type="text"
            class="input desc-input"
            placeholder="描述（可选）"
            maxlength="200"
            :disabled="props.loading"
          />
          <div class="bottom-row">
            <select v-model="priority" class="select" :disabled="props.loading">
              <option value="low">低优先级</option>
              <option value="mid">中优先级</option>
              <option value="high">高优先级</option>
            </select>
            <button type="button" class="submit-btn" :disabled="!title.trim() || props.loading" @click="onSubmit">
              {{ props.loading ? '添加中...' : '添加任务' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- 错误提示 -->
    <div v-if="props.error" class="error">{{ props.error }}</div>
  </div>
</template>

<style scoped>
.form-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  margin-top: 18px;
  transition: all var(--duration-normal) var(--ease-out);
}
.form-card.focused { border-color: var(--border-hover); box-shadow: var(--shadow-sm); }
.form-inner { padding: 12px 14px; }

/* 输入 */
.input {
  width: 100%;
  padding: 8px 0;
  color: var(--text-primary);
  font-size: 0.875rem;
  background: transparent;
}
.input::placeholder { color: var(--text-tertiary); }

/* 展开 */
.expand { margin-top: 8px; display: flex; flex-direction: column; gap: 8px; }
.desc-input { font-size: 0.8125rem; border-top: 1px solid var(--border-subtle); padding-top: 8px; }

.bottom-row { display: flex; gap: 8px; align-items: center; }
.select {
  padding: 6px 10px;
  background: var(--bg-surface-hover);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
}
.submit-btn {
  flex: 1;
  padding: 7px 16px;
  background: var(--accent);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  transition: all var(--duration-fast) var(--ease-out);
}
.submit-btn:hover:not(:disabled) { background: var(--accent-hover); }
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.error {
  padding: 8px 14px;
  background: var(--red-muted);
  color: var(--red);
  font-size: 0.8125rem;
  border-top: 1px solid var(--red);
}

@media (max-width: 640px) {
  .bottom-row { flex-direction: column; }
  .submit-btn { width: 100%; }
}
</style>
