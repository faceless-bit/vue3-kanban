<script setup lang="ts">
/**
 * 完成进度条 — 渐变填充 + 百分比动画
 */
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{ percent: number }>()
const display = ref(0)

watch(() => props.percent, (v) => {
  let s = 0; const d = 500
  const from = display.value
  const animate = (t: number) => { if(!s) s=t; const p=Math.min((t-s)/d,1); display.value=Math.round(from+(v-from)*(1-(1-p)**3)); if(p<1) requestAnimationFrame(animate) }
  requestAnimationFrame(animate)
}, { immediate: true })
</script>

<template>
  <div class="wrap">
    <div class="top">
      <span class="label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        完成进度
      </span>
      <span class="val">{{ display }}%</span>
    </div>
    <div class="track">
      <div class="fill" :style="{ width: display + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 14px 18px;
  margin-bottom: 18px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}
.val {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.track {
  height: 5px;
  background: var(--bg-surface-hover);
  border-radius: 3px;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-hover));
  border-radius: 3px;
  transition: width 0.5s var(--ease-out);
  min-width: 0;
}
</style>
