<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/AppIcon.vue'

const visible = ref(false)
const tab = ref<'download' | 'contact'>('download')

const apkUrl = '/app-release.apk'
const apkQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=22c55e&data=${encodeURIComponent('https://vue3-kanban.pages.dev/app-release.apk')}`

function open(t: 'download' | 'contact' = 'download') {
  tab.value = t
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
  <!-- ========== 浮动按钮组 ========== -->
  <div class="float-group">
    <!-- 下载 App 按钮 -->
    <div class="float-item">
      <span class="float-text float-text-dl">
        <AppIcon name="download" :size="13" /> 下载 App
      </span>
      <button
        class="float-btn float-btn-dl"
        title="下载 Android App"
        @click="open('download')"
        aria-label="下载 App"
      >
        <AppIcon name="download" :size="22" />
      </button>
    </div>

    <!-- 联系开发者按钮 -->
    <div class="float-item">
      <span class="float-text float-text-ct">
        <AppIcon name="message" :size="13" /> 联系开发者
      </span>
      <button
        class="float-btn float-btn-ct"
        title="联系开发者"
        @click="open('contact')"
        aria-label="联系开发者"
      >
        <AppIcon name="message" :size="22" />
      </button>
    </div>
  </div>

  <!-- ========== 全屏弹窗 ========== -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="visible" class="lightbox-overlay" @click.self="close">
        <div class="lightbox-card">
          <button class="lightbox-close" @click="close" aria-label="关闭">
            <AppIcon name="x-circle" :size="20" />
          </button>

          <!-- 标签切换 -->
          <div class="modal-tabs">
            <button
              :class="['modal-tab', { active: tab === 'download' }]"
              @click="tab = 'download'"
            >
              <AppIcon name="download" :size="16" /> 下载 App
            </button>
            <button
              :class="['modal-tab', { active: tab === 'contact' }]"
              @click="tab = 'contact'"
            >
              <AppIcon name="message" :size="16" /> 联系开发者
            </button>
          </div>

          <!-- ===== 下载面板 ===== -->
          <div v-if="tab === 'download'" class="lightbox-inner">
            <div class="qr-section">
              <div class="qr-frame">
                <img
                  :src="apkQrUrl"
                  alt="扫描下载 App"
                  class="lightbox-img"
                  @error="($event.target as HTMLImageElement).style.display='none'"
                />
                <div class="qr-label">扫一扫下载</div>
              </div>
            </div>
            <div class="info-section">
              <AppIcon name="download" :size="36" class="info-icon dl-icon" />
              <h2>下载 Android App</h2>
              <p class="info-desc">
                扫码或点击下方按钮下载<br/>
                支持 Android 5.0+
              </p>
              <a :href="apkUrl" class="dl-btn" download>
                <AppIcon name="download" :size="18" /> 立即下载 APK
              </a>
              <p class="info-footer">版本 1.0 · 约 4.3MB</p>
            </div>
          </div>

          <!-- ===== 联系面板 ===== -->
          <div v-if="tab === 'contact'" class="lightbox-inner">
            <div class="qr-section">
              <div class="qr-frame">
                <img src="/qq-qrcode.png" alt="QQ 二维码" class="lightbox-img" />
              </div>
            </div>
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
/* ========== 浮动按钮组 ========== */
.float-group {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-end;
}

.float-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.float-text {
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.2);
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
  display: flex;
  align-items: center;
  gap: 4px;
}

.float-text-dl {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.25);
  color: var(--color-success);
}

.float-text-ct {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.2);
  color: var(--color-primary);
}

.float-item:hover .float-text {
  opacity: 1;
  transform: translateX(0);
}

.float-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
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
}

/* 下载按钮 */
.float-btn-dl {
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.3);
  color: var(--color-success);
  animation: pulse-dl 2s infinite;
}
.float-btn-dl:hover {
  border-color: var(--color-success);
  color: #fff;
  background: var(--color-success);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.3);
}

@keyframes pulse-dl {
  0%, 100% { box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15); }
  50% { box-shadow: 0 4px 24px rgba(34, 197, 94, 0.35); }
}

/* 联系按钮 */
.float-btn-ct {
  background: var(--color-surface);
  color: var(--color-text-muted);
}
.float-btn-ct:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  box-shadow: 0 6px 20px var(--color-primary-glow);
}

/* ========== 弹窗 ========== */
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

/* ========== 标签切换 ========== */
.modal-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.modal-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.modal-tab:hover {
  color: var(--color-text);
  background: rgba(255,255,255,0.03);
}
.modal-tab.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
  background: rgba(99, 102, 241, 0.06);
}

/* ========== 内容区 ========== */
.lightbox-inner {
  display: flex;
  align-items: stretch;
}

.qr-section {
  padding: 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
  gap: 12px;
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

.qr-label {
  text-align: center;
  font-size: 0.72rem;
  color: #666;
  margin-top: 4px;
  letter-spacing: 1px;
}

.info-section {
  padding: 36px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 220px;
}

.info-icon { color: var(--color-primary); margin-bottom: 10px; }
.dl-icon { color: var(--color-success); }

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

/* 下载按钮 */
.dl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: var(--color-success);
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
}
.dl-btn:hover {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.tag {
  padding: 3px 10px;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.18);
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
  .float-group { bottom: 16px; right: 16px; gap: 10px; }
  .float-btn { width: 42px; height: 42px; }
  .float-text { font-size: 0.7rem; padding: 4px 8px; }
  .lightbox-inner { flex-direction: column; }
  .qr-section { padding: 20px; }
  .lightbox-img { width: 150px; height: 150px; }
  .info-section { padding: 18px 22px; text-align: center; align-items: center; }
  .dl-btn { width: 100%; }
}

@media (max-width: 420px) {
  .float-text { display: none; }
}
</style>
