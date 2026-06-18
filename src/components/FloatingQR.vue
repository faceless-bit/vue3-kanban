<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function open() {
  visible.value = true
  document.body.style.overflow = 'hidden'
}

function close() {
  visible.value = false
  document.body.style.overflow = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- 浮动按钮 -->
  <button
    class="float-btn"
    title="联系我"
    @click="open"
    aria-label="查看联系方式"
  >
    <img
      src="/qq-qrcode.png"
      alt="QQ QR Code"
      class="float-avatar"
    />
    <span class="float-tooltip">联系我</span>
  </button>

  <!-- 全屏灯箱 -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="visible" class="lightbox-overlay" @click.self="close">
        <div class="lightbox-card">
          <button class="lightbox-close" @click="close" aria-label="关闭">✕</button>
          <img
            src="/qq-qrcode.png"
            alt="QQ QR Code 大图"
            class="lightbox-img"
          />
          <p class="lightbox-hint">📱 扫描二维码联系我</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ========== 浮动按钮 ========== */
.float-btn {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 999;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
.float-btn:hover {
  transform: scale(1.12);
  border-color: var(--color-primary);
  box-shadow: 0 6px 24px var(--color-primary-glow), 0 0 0 4px rgba(99, 102, 241, 0.15);
}

.float-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.float-tooltip {
  position: absolute;
  right: 64px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.float-btn:hover .float-tooltip {
  opacity: 1;
}

/* ========== 灯箱遮罩 ========== */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.lightbox-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-img {
  width: auto;
  height: auto;
  max-width: min(360px, 70vw);
  max-height: min(360px, 70vh);
  border-radius: 12px;
  display: block;
}

.lightbox-hint {
  margin-top: 16px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.lightbox-close {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.lightbox-close:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

/* ========== 动画 ========== */
.lightbox-enter-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-active .lightbox-card {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-leave-active .lightbox-card {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.lightbox-enter-from {
  opacity: 0;
}
.lightbox-enter-from .lightbox-card {
  transform: scale(0.7);
  opacity: 0;
}
.lightbox-leave-to {
  opacity: 0;
}
.lightbox-leave-to .lightbox-card {
  transform: scale(0.85);
  opacity: 0;
}

/* ========== 响应式 ========== */
@media (max-width: 640px) {
  .float-btn {
    bottom: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
  .lightbox-card {
    padding: 20px;
  }
  .lightbox-img {
    max-width: 75vw;
    max-height: 60vh;
  }
}
</style>
