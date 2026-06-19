/**
 * 数字递增动画 composable
 * 从 0 平滑递增到目标值
 */
import { ref, watch, onMounted, type Ref } from 'vue'

export function useCountUp(target: Ref<number>, duration = 800) {
  const display = ref(0)

  let raf = 0
  let start = 0
  let from = 0
  let to = 0

  function animate(timestamp: number) {
    if (!start) start = timestamp
    const elapsed = timestamp - start
    const progress = Math.min(elapsed / duration, 1)
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3)
    display.value = Math.round(from + (to - from) * eased)
    if (progress < 1) {
      raf = requestAnimationFrame(animate)
    }
  }

  function run() {
    cancelAnimationFrame(raf)
    from = display.value
    to = target.value
    start = 0
    raf = requestAnimationFrame(animate)
  }

  watch(target, () => run())
  onMounted(() => { display.value = target.value })

  return { display }
}
