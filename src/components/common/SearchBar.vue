<script setup lang="ts">
/**
 * 搜索输入框，带搜索图标
 * v-model 绑定搜索关键词
 */
import AppIcon from '@/components/icons/AppIcon.vue'

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="search-wrap">
    <AppIcon name="search" :size="16" class="search-icon" />
    <input
      v-model="model"
      type="text"
      class="search-input"
      placeholder="搜索任务..."
      maxlength="80"
    />
  </div>
</template>

<style scoped>
.search-wrap {
  position: relative;
  flex: 1;
  min-width: 180px;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
}
.search-input {
  width: 100%;
  height: 38px;
  padding: 0 14px 0 36px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}
.search-input::placeholder { color: var(--text-tertiary); }
.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
</style>
