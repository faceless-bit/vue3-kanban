<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const donateOpen = ref(false)
const visibleSections = ref<Set<string>>(new Set())

// Intersection Observer：滚动到才播放动画
let observer: IntersectionObserver | null = null
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-section')
          if (id) visibleSections.value.add(id)
        }
      })
    },
    { threshold: 0.15 }
  )
  document.querySelectorAll('[data-section]').forEach(el => observer!.observe(el))
})
onUnmounted(() => observer?.disconnect())

function isVisible(id: string) {
  // 初始一次性全部可见（兼容没有 observer 的情况）
  return visibleSections.value.size === 0 || visibleSections.value.has(id)
}

function escClose(e: KeyboardEvent) {
  if (e.key === 'Escape') donateOpen.value = false
}
onMounted(() => window.addEventListener('keydown', escClose))
onUnmounted(() => window.removeEventListener('keydown', escClose))
</script>

<template>
  <div class="about-page">
    <!-- ====== Hero ====== -->
    <section class="hero" data-section="hero" :class="{ visible: isVisible('hero') }">
      <div class="hero-badge">🔷 Vue 3 + Supabase 全栈应用</div>
      <h1 class="hero-title">
        <span class="gradient-text">智能任务看板</span>
      </h1>
      <p class="hero-sub">
        一款轻量、安全、跨设备的云端任务管理工具。<br/>
        专为个人和小团队打造，让每一件事都有条不紊。
      </p>
      <div class="hero-stats">
        <div class="hstat"><strong>3列</strong>看板</div>
        <div class="hstat"><strong>云端</strong>同步</div>
        <div class="hstat"><strong>管理员</strong>后台</div>
        <div class="hstat"><strong>免费</strong>使用</div>
      </div>
      <div class="scroll-hint">
        <span>向下滚动探索</span>
        <div class="scroll-arrow">↓</div>
      </div>
    </section>

    <!-- ====== 能干什么 ====== -->
    <section class="section" data-section="features" :class="{ visible: isVisible('features') }">
      <h2 class="section-title">
        <span class="title-line"></span>
        📦 它能干什么
        <span class="title-line"></span>
      </h2>
      <div class="card-grid">
        <div class="card" v-for="(item, i) in [
          { icon:'📋', title:'任务管理', desc:'创建待办、进行中、已完成三列任务，一目了然掌握所有进度。' },
          { icon:'🔍', title:'快速检索', desc:'支持关键词搜索和状态筛选，哪怕几十条任务也能秒定位。' },
          { icon:'☁️', title:'云端同步', desc:'数据实时存入数据库，换电脑、换手机，登录即同步。' },
          { icon:'🔐', title:'数据隔离', desc:'每个人独立账户，自己的任务只有自己看得见，安全可靠。' },
          { icon:'🛡️', title:'管理员后台', desc:'团队管理者一键查看所有成员任务，轻松掌控全局。' },
          { icon:'📱', title:'手机也能用', desc:'响应式设计，自适应手机、平板、电脑，随时随地处理。' },
        ]" :key="item.title" :style="{ transitionDelay: (i * 0.08) + 's' }">
          <div class="card-icon">{{ item.icon }}</div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ====== 解决什么痛点 ====== -->
    <section class="section section-alt" data-section="pain" :class="{ visible: isVisible('pain') }">
      <h2 class="section-title">💡 它解决了哪些痛点</h2>
      <div class="pain-list">
        <div class="pain-item" v-for="(item, i) in [
          { before:'便签到处贴、记事本杂乱无章，找不到重点', after:'三列看板分区管理，待办/进行中/已完成一眼看清' },
          { before:'换个设备任务就没了，数据只存在本地', after:'云端存储，登录即同步，数据永不丢失' },
          { before:'团队之间任务互相看不到，沟通成本高', after:'管理员后台统一查看，高效协调' },
          { before:'复杂软件需要学习，注册流程繁琐', after:'输入名字即可开始，零学习成本' },
        ]" :key="item.before" :style="{ transitionDelay: (i * 0.12) + 's' }">
          <div class="pain-before">❌ {{ item.before }}</div>
          <div class="pain-arrow">→</div>
          <div class="pain-after">✅ {{ item.after }}</div>
        </div>
      </div>
    </section>

    <!-- ====== 感谢 + 捐赠 ====== -->
    <section class="section donate-section" data-section="donate" :class="{ visible: isVisible('donate') }">
      <div class="donate-inner">
        <div class="thanks-block">
          <h2>🙏 感谢每一位用户</h2>
          <p>
            感谢你使用智能任务看板！本项目由个人独立开发维护，<br/>
            承诺<strong>永久免费</strong>，不插广告、不卖数据、不设付费墙。
          </p>
          <p>
            如果它帮助了你，欢迎<strong>赞赏支持</strong> ❤️<br/>
            你的每一份支持都是我持续更新的动力！
          </p>
        </div>
        <button class="donate-btn" @click="donateOpen = true">
          <span class="btn-glow"></span>
          <span class="btn-content">☕ 赞赏支持开发者</span>
        </button>
      </div>
    </section>

    <!-- ====== 捐赠弹窗 ====== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="donateOpen" class="modal-overlay" @click.self="donateOpen = false">
          <div class="modal-card">
            <button class="modal-close" @click="donateOpen = false">✕</button>
            <div class="modal-layout">
              <div class="modal-left">
                <div class="qr-frame">
                  <img src="/donate.png" alt="收款码" class="qr-img" />
                </div>
              </div>
              <div class="modal-right">
                <h2>☕ 请开发者喝杯咖啡</h2>
                <p class="modal-desc">你的每一份心意都将用于服务器维护和新功能开发，感谢支持！</p>
                <div class="modal-tags">
                  <span>❤️ 微信</span>
                  <span>📱 扫码</span>
                  <span>☕ 赞赏</span>
                </div>
                <p class="modal-note">扫码即可赞赏，金额随意 ❤️</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ====== 页脚 ====== -->
    <footer class="footer">
      <p>智能任务看板 © 2026 —— 为效率而生，为简单而做</p>
    </footer>
  </div>
</template>

<style scoped>
.about-page { max-width: 880px; margin: 0 auto; }

/* ====== 滚动触发 ====== */
[data-section] {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
[data-section].visible {
  opacity: 1;
  transform: translateY(0);
}
/* hero 特殊动画 */
[data-section="hero"] {
  opacity: 1;
  transform: none;
}
[data-section="hero"].visible .hero-badge { animation: fadeUp 0.6s ease both; }
[data-section="hero"].visible .hero-title { animation: fadeUp 0.6s 0.1s ease both; }
[data-section="hero"].visible .hero-sub   { animation: fadeUp 0.6s 0.2s ease both; }
[data-section="hero"].visible .hero-stats { animation: fadeUp 0.6s 0.35s ease both; }
[data-section="hero"].visible .scroll-hint { animation: fadeUp 0.6s 0.5s ease both; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ====== Section ====== */
.section { margin-bottom: 52px; }
.section-alt {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 40px 36px;
}
.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 28px;
  text-align: center;
}
.title-line {
  display: inline-block;
  width: 36px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-primary));
  border-radius: 2px;
}
.title-line:last-child {
  background: linear-gradient(90deg, var(--color-primary), transparent);
}

/* ====== Hero ====== */
.hero {
  text-align: center;
  margin-bottom: 52px;
  padding-top: 16px;
}
.hero-badge {
  display: inline-block;
  padding: 5px 18px;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.25);
  border-radius: 20px;
  font-size: 0.78rem;
  color: var(--color-primary);
  margin-bottom: 18px;
}
.hero-title { font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; opacity: 0; }
.gradient-text {
  background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub { font-size: 1rem; color: var(--color-text-muted); line-height: 1.8; margin-bottom: 28px; opacity: 0; }
.hero-stats { display: flex; justify-content: center; gap: 20px; opacity: 0; }
.hstat {
  padding: 10px 22px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  transition: all 0.3s ease;
}
.hstat:hover { border-color: var(--color-primary); transform: translateY(-3px); box-shadow: 0 8px 20px var(--color-primary-glow); }
.hstat strong { display: block; color: var(--color-primary); font-size: 1.15rem; }

.scroll-hint {
  margin-top: 36px;
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}
.scroll-arrow {
  animation: bounce 1.5s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* ====== 功能卡片 ====== */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 26px 22px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(24px);
}
[data-section="features"].visible .card {
  opacity: 1;
  transform: translateY(0);
}
.card:hover {
  border-color: var(--color-primary);
  transform: translateY(-6px) !important;
  box-shadow: 0 16px 36px rgba(0,0,0,0.35), 0 0 24px var(--color-primary-glow);
}
.card-icon { font-size: 2.2rem; margin-bottom: 14px; transition: transform 0.3s ease; }
.card:hover .card-icon { transform: scale(1.15); }
.card h3 { font-size: 0.97rem; font-weight: 700; margin-bottom: 8px; }
.card p { font-size: 0.83rem; color: var(--color-text-muted); line-height: 1.6; }

/* ====== 痛点列表 ====== */
.pain-list { display: flex; flex-direction: column; gap: 12px; }
.pain-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: rgba(0,0,0,0.15);
  border: 1px solid transparent;
  border-radius: 14px;
  transition: all 0.5s ease;
  opacity: 0;
  transform: translateX(-24px);
}
[data-section="pain"].visible .pain-item {
  opacity: 1;
  transform: translateX(0);
}
.pain-item:hover {
  background: rgba(99,102,241,0.06);
  border-color: rgba(99,102,241,0.2);
}
.pain-before { flex: 1; font-size: 0.87rem; opacity: 0.65; }
.pain-arrow { font-size: 1.3rem; color: var(--color-primary); font-weight: 700; }
.pain-after { flex: 1; font-size: 0.87rem; color: var(--color-success); font-weight: 500; }

/* ====== 捐赠区域 ====== */
.donate-section { text-align: center; }
.donate-inner {
  background: linear-gradient(135deg, rgba(245,158,11,0.06), rgba(239,68,68,0.06));
  border: 1px solid rgba(245,158,11,0.15);
  border-radius: 24px;
  padding: 44px 32px;
  transition: all 0.5s ease;
}
.donate-inner:hover { border-color: rgba(245,158,11,0.35); }
.thanks-block h2 { font-size: 1.3rem; font-weight: 700; margin-bottom: 14px; }
.thanks-block p { font-size: 0.92rem; color: var(--color-text-muted); line-height: 1.9; margin-bottom: 8px; }

.donate-btn {
  position: relative;
  display: inline-flex;
  margin-top: 24px;
  padding: 14px 44px;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  border: none;
  border-radius: 32px;
  color: white;
  font-size: 1.07rem;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 6px 28px rgba(245,158,11,0.35);
}
.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #f59e0b, #fbbf24, #ef4444);
  opacity: 0;
  transition: opacity 0.4s ease;
}
.donate-btn:hover {
  transform: translateY(-4px) scale(1.04);
  box-shadow: 0 12px 40px rgba(245,158,11,0.55);
}
.donate-btn:hover .btn-glow { opacity: 1; }
.donate-btn:active { transform: scale(0.97); }
.btn-content { position: relative; z-index: 1; }

/* ====== 捐赠弹窗 ====== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0,0,0,0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-card {
  position: relative;
  background: linear-gradient(145deg, #1e293b, #1a2332);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 24px;
  box-shadow: 0 28px 80px rgba(0,0,0,0.55);
  overflow: hidden;
  max-width: 600px;
  width: 100%;
}
.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: rgba(0,0,0,0.35);
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1rem;
  z-index: 1;
  transition: all 0.2s ease;
}
.modal-close:hover { border-color: var(--color-danger); color: var(--color-danger); }
.modal-layout { display: flex; align-items: center; }
.modal-left { padding: 36px; background: rgba(0,0,0,0.15); display: flex; align-items: center; }
.qr-frame { background: white; padding: 16px; border-radius: 16px; box-shadow: 0 8px 28px rgba(0,0,0,0.3); }
.qr-img { width: 190px; height: 190px; display: block; border-radius: 10px; }
.modal-right { padding: 32px 28px; flex: 1; }
.modal-right h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.modal-desc { font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.7; margin-bottom: 14px; }
.modal-tags { display: flex; gap: 8px; margin-bottom: 16px; }
.modal-tags span {
  padding: 4px 12px;
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.25);
  border-radius: 16px;
  font-size: 0.75rem;
  color: #f59e0b;
}
.modal-note { font-size: 0.8rem; color: var(--color-text-muted); }

/* ====== 弹窗动画 ====== */
.modal-enter-active { transition: opacity 0.3s ease; }
.modal-enter-active .modal-card { transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-leave-active .modal-card { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from { opacity: 0; }
.modal-enter-from .modal-card { transform: scale(0.75); opacity: 0; }
.modal-leave-to { opacity: 0; }
.modal-leave-to .modal-card { transform: scale(0.85); opacity: 0; }

/* ====== 页脚 ====== */
.footer { text-align: center; padding: 20px 0; border-top: 1px solid var(--color-border); margin-top: 8px; }
.footer p { font-size: 0.8rem; color: var(--color-text-muted); }

/* ====== 响应式 ====== */
@media (max-width: 640px) {
  .hero-title { font-size: 1.6rem; }
  .hero-stats { flex-wrap: wrap; gap: 10px; }
  .card-grid { grid-template-columns: 1fr; }
  .section-alt { padding: 20px; }
  .pain-item { flex-direction: column; text-align: center; gap: 6px; }
  .pain-arrow { transform: rotate(90deg); }
  .modal-layout { flex-direction: column; }
  .modal-left { padding: 20px; }
  .qr-img { width: 140px; height: 140px; }
  .modal-right { padding: 16px 20px; text-align: center; }
  .section-title { font-size: 1.1rem; }
  .title-line { width: 20px; }
}
</style>
