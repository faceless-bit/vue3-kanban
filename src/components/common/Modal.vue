<script setup lang="ts">
/**
 * 通用弹窗组件
 * 点击遮罩或按 Esc 关闭，内容区支持 slot
 */
import { onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'

const props = defineProps<{
  visible: boolean
  maxWidth?: string
}>()

const emit = defineEmits<{
  close: []
}>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.visible) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="scale">
      <div v-if="visible" class="overlay" @click.self="emit('close')">
        <div class="modal" :style="{ maxWidth: maxWidth || '480px' }">
          <button class="close-btn" @click="emit('close')" aria-label="关闭">
            <AppIcon name="x-circle" :size="20" />
          </button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}
.modal {
  position: relative;
  width: 100%;
  background: var(--bg-elevated);
  border: 1px solid var(--bg-hover);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  z-index: 1;
  transition: all var(--dur-fast) var(--ease-out);
}
.close-btn:hover {
  color: var(--red);
  background: var(--red-muted);
}
</style>
