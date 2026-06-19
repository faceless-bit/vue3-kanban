<script setup lang="ts">
/**
 * 进度条 — 极简版
 */
defineProps<{ percent: number }>()
</script>

<template>
  <div class="wrap">
    <div class="track">
      <div class="fill" :style="{ width: percent + '%' }"></div>
    </div>
    <span class="pct">{{ percent }}%</span>
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 0 var(--space-md);
}
.track {
  flex: 1;
  height: 3px;
  background: var(--bg-hover);
  border-radius: 2px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.5s var(--ease-out);
}
.pct {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  min-width: 32px;
  text-align: right;
}
</style>
