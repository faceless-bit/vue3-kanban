<script setup lang="ts">
/**
 * 新建任务 — Linear 极简：单行输入，focus 展开
 */
import { ref } from 'vue'
import type { TaskPriority } from '@/types'

const props = defineProps<{ loading?: boolean; error?: string }>()
const emit = defineEmits<{ submit: [t: string, d: string, p: TaskPriority] }>()

const title = ref('')
const desc = ref('')
const priority = ref<TaskPriority>('mid')
const open = ref(false)

function submit() {
  const t = title.value.trim()
  if (!t) return
  emit('submit', t, desc.value.trim(), priority.value)
  title.value = ''; desc.value = ''; priority.value = 'mid'; open.value = false
}
</script>

<template>
  <div class="form" :class="{ on: open }">
    <div class="main">
      <svg class="plus" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      <input v-model="title" type="text" class="input" placeholder="新建任务" maxlength="60" :disabled="props.loading"
        @focus="open=true" @keydown.enter="submit" />
    </div>
    <Transition name="fade">
      <div v-if="open" class="extra">
        <input v-model="desc" type="text" class="desc-input" placeholder="描述（可选）" maxlength="200" />
        <div class="row">
          <select v-model="priority" class="sel">
            <option value="low">低</option>
            <option value="mid">中</option>
            <option value="high">高</option>
          </select>
          <button class="btn" :disabled="!title.trim()||props.loading" @click="submit">
            {{ props.loading ? '...' : '添加' }}
          </button>
        </div>
      </div>
    </Transition>
    <div v-if="props.error" class="err">{{ props.error }}</div>
  </div>
</template>

<style scoped>
.form {
  margin-top: var(--space-lg);
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
  transition: background var(--dur-fast);
}
.form.on { background: var(--bg-hover); }
.main {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
}
.plus { color: var(--text-tertiary); flex-shrink: 0; }
.input {
  flex: 1;
  font-size: 0.8125rem;
  color: var(--text-primary);
  background: transparent;
}
.input::placeholder { color: var(--text-tertiary); }

.extra { padding: 0 12px 10px; display: flex; flex-direction: column; gap: 6px; }
.desc-input {
  padding: 6px 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--bg-active);
}
.desc-input::placeholder { color: var(--text-tertiary); }
.row { display: flex; gap: 8px; align-items: center; }
.sel {
  padding: 4px 8px;
  background: var(--bg-active);
  border-radius: var(--radius-xs);
  font-size: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
}
.btn {
  flex: 1;
  padding: 5px 0;
  text-align: center;
  background: var(--accent);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-xs);
  transition: background var(--dur-fast);
}
.btn:hover:not(:disabled) { background: var(--accent-hover); }
.btn:disabled { opacity: 0.35; cursor: not-allowed; }

.err {
  padding: 6px 12px;
  font-size: 0.75rem;
  color: var(--red);
  border-top: 1px solid var(--red);
}

@media (max-width: 640px) {
  .row { flex-direction: column; }
  .btn { width: 100%; }
}
</style>
