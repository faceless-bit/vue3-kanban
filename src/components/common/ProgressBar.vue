<script setup lang="ts">
/**
 * 完成进度条
 * @param percent 0-100 的百分比值
 */
defineProps<{
  percent: number
}>()
</script>

<template>
  <div class="progress-wrap">
    <div class="progress-info">
      <span>完成进度</span>
      <span class="progress-pct">{{ percent }}%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: percent + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.progress-wrap {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 14px var(--space-md);
  margin-bottom: var(--space-lg);
}
.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}
.progress-pct {
  font-weight: 600;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.progress-track {
  height: 5px;
  background: var(--border-default);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 3px;
  transition: width 0.6s var(--ease-out);
  min-width: 0;
}
</style>
