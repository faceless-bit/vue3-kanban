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
  <!-- 浮动按钮 + 文字 -->
  <div class="float-area">
    <span class="float-text">感谢开发者 👨‍💻</span>
    <button
      class="float-btn"
      title="联系开发者"
      @click="open"
      aria-label="查看联系方式"
    >
      <img
        src="/qq-qrcode.png"
        alt="QQ QR Code"
        class="float-avatar"
      />
    </button>
  </div>

  <!-- 全屏灯箱 -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="visible" class="lightbox-overlay" @click.self="close">
        <div class="lightbox-card">
          <button class="lightbox-close" @click="close" aria-label="关闭">✕</button>

          <div class="lightbox-inner">
            <!-- 左侧：二维码 -->
            <div class="qr-section">
              <div class="qr-frame">
                <img src="/qq-qrcode.png" alt="QQ 二维码" class="lightbox-img" />
              </div>
            </div>

            <!-- 右侧：信息 -->
            <div class="info-section">
              <div class="info-icon">👨‍💻</div>
              <h2>联系开发者</h2>
              <p class="info-desc">感谢使用智能任务看板！<br/>扫码添加开发者 QQ 好友</p>
              <div class="info-tags">
                <span class="tag">💬 技术交流</span>
                <span class="tag">🐛 问题反馈</span>
                <span class="tag">💡 功能建议</span>
              </div>
              <p class="info-footer">📱 扫描二维码联系我</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ========== 浮动区域 ========== */
.float-area {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 999;
  display: flex;
  align-items: center;
  gap: 10px;
}

.float-text {
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.25);
  color: var(--color-primary);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
  pointer-events: none;
}
.float-area:hover .float-text {
  opacity: 1;
  transform: translateX(0);
}

.float-btn {
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
  flex-shrink: 0;
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

/* ========== 灯箱遮罩 ========== */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.lightbox-card {
  position: relative;
  background: linear-gradient(145deg, #1e293b 0%, #1a2332 100%);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(99, 102, 241, 0.1);
  max-width: 90vw;
  overflow: hidden;
}

.lightbox-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.lightbox-close:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.15);
}

/* ========== 左右分栏 ========== */
.lightbox-inner {
  display: flex;
  align-items: stretch;
}

.qr-section {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.qr-frame {
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.lightbox-img {
  width: 220px;
  height: 220px;
  display: block;
  border-radius: 8px;
}

.info-section {
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 240px;
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.info-section h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 16px;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  padding: 4px 12px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 16px;
  font-size: 0.78rem;
  color: var(--color-primary);
}

.info-footer {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

/* ========== 动画 ========== */
.lightbox-enter-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-active .lightbox-card {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
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
  .float-area {
    bottom: 16px;
    right: 16px;
  }
  .float-btn {
    width: 48px;
    height: 48px;
  }
  .float-text {
    font-size: 0.7rem;
    padding: 4px 10px;
  }

  .lightbox-inner {
    flex-direction: column;
  }
  .qr-section {
    padding: 24px;
  }
  .lightbox-img {
    width: 160px;
    height: 160px;
  }
  .info-section {
    padding: 20px 24px;
    text-align: center;
    align-items: center;
  }
  .info-section h2 {
    font-size: 1.2rem;
  }
}

@media (max-width: 420px) {
  .float-text {
    display: none;
  }
}
</style>
