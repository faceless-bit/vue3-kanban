<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/AppIcon.vue'

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
  <div class="float-area">
    <span class="float-text">联系开发者</span>
    <button
      class="float-btn"
      title="联系开发者"
      @click="open"
      aria-label="查看联系方式"
    >
      <AppIcon name="message" :size="22" />
    </button>
  </div>

  <!-- 全屏灯箱 -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="visible" class="lightbox-overlay" @click.self="close">
        <div class="lightbox-card">
          <button class="lightbox-close" @click="close" aria-label="关闭">
            <AppIcon name="x-circle" :size="20" />
          </button>

          <div class="lightbox-inner">
            <!-- 左侧：二维码 -->
            <div class="qr-section">
              <div class="qr-frame">
                <img src="/qq-qrcode.png" alt="QQ 二维码" class="lightbox-img" />
              </div>
            </div>

            <!-- 右侧：信息 -->
            <div class="info-section">
              <AppIcon name="code" :size="36" class="info-icon" />
              <h2>联系开发者</h2>
              <p class="info-desc">感谢使用任务看板！<br/>扫码添加开发者 QQ 好友</p>
              <div class="info-tags">
                <span class="tag">技术交流</span>
                <span class="tag">问题反馈</span>
                <span class="tag">功能建议</span>
              </div>
              <p class="info-footer">扫描二维码联系我</p>
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
  background: rgba(13, 148, 136, 0.12);
  border: 1px solid rgba(13, 148, 136, 0.2);
  color: var(--color-primary);
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 0.76rem;
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
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}
.float-btn:hover {
  transform: scale(1.1);
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 0 6px 20px var(--color-primary-glow);
}

/* ========== 灯箱遮罩 ========== */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.78);
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  max-width: 90vw;
  overflow: hidden;
}

.lightbox-close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 10;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.35);
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.lightbox-close:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

/* ========== 左右分栏 ========== */
.lightbox-inner {
  display: flex;
  align-items: stretch;
}

.qr-section {
  padding: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
}

.qr-frame {
  padding: 14px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
}

.lightbox-img {
  width: 200px;
  height: 200px;
  display: block;
  border-radius: 6px;
}

.info-section {
  padding: 36px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 220px;
}

.info-icon { color: var(--color-primary); margin-bottom: 10px; }

.info-section h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--color-text);
}

.info-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 14px;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tag {
  padding: 3px 10px;
  background: rgba(13, 148, 136, 0.08);
  border: 1px solid rgba(13, 148, 136, 0.18);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--color-primary);
}

.info-footer {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

/* ========== 动画 ========== */
.lightbox-enter-active { transition: opacity 0.25s ease; }
.lightbox-enter-active .lightbox-card {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-leave-active .lightbox-card { transition: transform 0.2s ease, opacity 0.2s ease; }
.lightbox-enter-from { opacity: 0; }
.lightbox-enter-from .lightbox-card { transform: scale(0.75); opacity: 0; }
.lightbox-leave-to { opacity: 0; }
.lightbox-leave-to .lightbox-card { transform: scale(0.85); opacity: 0; }

/* ========== 响应式 ========== */
@media (max-width: 640px) {
  .float-area { bottom: 16px; right: 16px; }
  .float-btn { width: 42px; height: 42px; }
  .float-text { font-size: 0.7rem; padding: 4px 8px; }
  .lightbox-inner { flex-direction: column; }
  .qr-section { padding: 20px; }
  .lightbox-img { width: 150px; height: 150px; }
  .info-section { padding: 18px 22px; text-align: center; align-items: center; }
}
@media (max-width: 420px) {
  .float-text { display: none; }
}
</style>
