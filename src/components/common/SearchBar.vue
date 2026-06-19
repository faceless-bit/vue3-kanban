<script setup lang="ts">
/**
 * 搜索框 — Linear 风格：透明底 + 底部细线
 */
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="wrap">
    <svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    <input v-model="model" type="text" class="input" placeholder="搜索..." maxlength="80" />
  </div>
</template>

<style scoped>
.wrap {
  position: relative;
  flex: 1;
  min-width: 160px;
  max-width: 240px;
}
.icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
}
.input {
  width: 100%;
  height: 32px;
  padding: 0 0 0 22px;
  font-size: 0.8125rem;
  color: var(--text-primary);
  border-bottom: 1px solid var(--bg-hover);
  transition: border-color var(--dur-fast) var(--ease-out);
}
.input::placeholder { color: var(--text-tertiary); }
.input:focus { border-bottom-color: var(--accent); }
</style>
