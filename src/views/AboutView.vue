<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const donateOpen = ref(false)

function escClose(e: KeyboardEvent) {
  if (e.key === 'Escape') donateOpen.value = false
}
onMounted(() => window.addEventListener('keydown', escClose))
onUnmounted(() => window.removeEventListener('keydown', escClose))
</script>

<template>
  <div class="about-page">
    <!-- ====== Hero ====== -->
    <section class="hero">
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
    </section>

    <!-- ====== 能干什么 ====== -->
    <section class="section">
      <h2 class="section-title">📦 它能干什么</h2>
      <div class="card-grid">
        <div class="card">
          <div class="card-icon">📋</div>
          <h3>任务管理</h3>
          <p>创建待办、进行中、已完成三列任务，一目了然掌握所有进度。</p>
        </div>
        <div class="card">
          <div class="card-icon">🔍</div>
          <h3>快速检索</h3>
          <p>支持关键词搜索和状态筛选，哪怕几十条任务也能秒定位。</p>
        </div>
        <div class="card">
          <div class="card-icon">☁️</div>
          <h3>云端同步</h3>
          <p>数据实时存入 Supabase 数据库，换电脑、换手机，登录即同步。</p>
        </div>
        <div class="card">
          <div class="card-icon">🔐</div>
          <h3>数据隔离</h3>
          <p>每个人独立账户，自己的任务只有自己看得见，安全可靠。</p>
        </div>
        <div class="card">
          <div class="card-icon">🛡️</div>
          <h3>管理员后台</h3>
          <p>团队管理者一键查看所有成员任务，合理分配工作，轻松掌控全局。</p>
        </div>
        <div class="card">
          <div class="card-icon">📱</div>
          <h3>手机也能用</h3>
          <p>响应式设计，自适应手机、平板、电脑，随时随地处理任务。</p>
        </div>
      </div>
    </section>

    <!-- ====== 解决什么痛点 ====== -->
    <section class="section section-alt">
      <h2 class="section-title">💡 它解决了哪些痛点</h2>
      <div class="pain-list">
        <div class="pain-item">
          <div class="pain-before">❌ 便签到处贴、记事本杂乱无章，找不到重点</div>
          <div class="pain-arrow">→</div>
          <div class="pain-after">✅ 三列看板分区管理，待办/进行中/已完成一眼看清</div>
        </div>
        <div class="pain-item">
          <div class="pain-before">❌ 换个设备任务就没了，数据只存在本地</div>
          <div class="pain-arrow">→</div>
          <div class="pain-after">✅ 云端存储，登录即同步，数据永不丢失</div>
        </div>
        <div class="pain-item">
          <div class="pain-before">❌ 团队之间任务互相看不到，沟通成本高</div>
          <div class="pain-arrow">→</div>
          <div class="pain-after">✅ 管理员后台统一查看，高效协调</div>
        </div>
        <div class="pain-item">
          <div class="pain-before">❌ 复杂软件需要学习，注册流程繁琐</div>
          <div class="pain-arrow">→</div>
          <div class="pain-after">✅ 输入名字即可开始，零学习成本</div>
        </div>
      </div>
    </section>

    <!-- ====== 感谢 + 捐赠 ====== -->
    <section class="section">
      <h2 class="section-title">🙏 感谢每一位用户</h2>
      <p class="thanks-text">
        感谢你使用智能任务看板！这个项目由个人独立开发维护，<br/>
        承诺<strong>永久免费</strong>，不插广告、不卖数据、不设付费墙。
      </p>
      <p class="thanks-text">
        如果它帮助了你，欢迎<strong>捐赠支持</strong> ❤️<br/>
        你的每一份支持都是我持续更新的动力！
      </p>

      <!-- 捐赠按钮 -->
      <button class="donate-btn" @click="donateOpen = true">
        <span class="donate-icon">☕</span>
        赞赏支持
      </button>
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
                <p class="modal-desc">
                  你的每一份心意都将用于服务器维护<br/>和新功能开发，感谢支持！
                </p>
                <div class="modal-tags">
                  <span>❤️ 微信</span>
                  <span>📱 扫码</span>
                  <span>☕ 赞赏</span>
                </div>
                <p class="modal-note">扫码即可赞赏，金额随意</p>
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
/* ========== 通用 ========== */
.about-page {
  max-width: 880px;
  margin: 0 auto;
}

.section {
  margin-bottom: 48px;
}
.section-alt {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 36px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
}

/* ========== Hero ========== */
.hero {
  text-align: center;
  margin-bottom: 52px;
  padding-top: 10px;
}
.hero-badge {
  display: inline-block;
  padding: 4px 16px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 20px;
  font-size: 0.78rem;
  color: var(--color-primary);
  margin-bottom: 18px;
  animation: fadeUp 0.6s ease;
}
.hero-title {
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 16px;
  animation: fadeUp 0.6s 0.1s ease both;
}
.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: 28px;
  animation: fadeUp 0.6s 0.2s ease both;
}
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  animation: fadeUp 0.6s 0.3s ease both;
}
.hstat {
  padding: 8px 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  transition: all 0.3s ease;
}
.hstat:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}
.hstat strong {
  display: block;
  color: var(--color-primary);
  font-size: 1.1rem;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ========== 功能卡片 ========== */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 24px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.3), 0 0 20px var(--color-primary-glow);
}
.card-icon { font-size: 2rem; margin-bottom: 12px; }
.card h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 8px; }
.card p {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* ========== 痛点 ========== */
.pain-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.pain-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(0,0,0,0.15);
  border-radius: 12px;
  transition: all 0.3s ease;
}
.pain-item:hover {
  background: rgba(99,102,241,0.06);
  border-color: var(--color-primary);
}
.pain-before {
  flex: 1;
  font-size: 0.85rem;
  opacity: 0.7;
  text-decoration: line-through;
  text-decoration-color: rgba(239,68,68,0.3);
}
.pain-arrow {
  font-size: 1.2rem;
  color: var(--color-primary);
  font-weight: 700;
}
.pain-after {
  flex: 1;
  font-size: 0.85rem;
  color: var(--color-success);
  font-weight: 500;
}

/* ========== 感谢 ========== */
.thanks-text {
  text-align: center;
  font-size: 0.92rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 12px;
}

.donate-btn {
  display: block;
  margin: 24px auto 0;
  padding: 14px 40px;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  border: none;
  border-radius: 30px;
  color: white;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.35s ease;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
}
.donate-btn:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 30px rgba(245, 158, 11, 0.5);
}
.donate-icon { font-size: 1.2rem; margin-right: 6px; }

/* ========== 捐赠弹窗 ========== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-card {
  position: relative;
  background: linear-gradient(145deg, #1e293b, #1a2332);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  box-shadow: 0 24px 70px rgba(0,0,0,0.5);
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
  background: rgba(0,0,0,0.3);
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1rem;
  z-index: 10;
  transition: all 0.2s ease;
}
.modal-close:hover { border-color: var(--color-danger); color: var(--color-danger); }
.modal-layout { display: flex; align-items: center; }
.modal-left {
  padding: 32px;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
}
.qr-frame {
  background: white;
  padding: 14px;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.3);
}
.qr-img { width: 180px; height: 180px; display: block; border-radius: 8px; }
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

/* ========== 弹窗动画 ========== */
.modal-enter-active { transition: opacity 0.25s ease; }
.modal-enter-active .modal-card { transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-leave-active .modal-card { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from { opacity: 0; }
.modal-enter-from .modal-card { transform: scale(0.8); opacity: 0; }
.modal-leave-to { opacity: 0; }
.modal-leave-to .modal-card { transform: scale(0.85); opacity: 0; }

/* ========== 页脚 ========== */
.footer {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid var(--color-border);
  margin-top: 16px;
}
.footer p { font-size: 0.8rem; color: var(--color-text-muted); }

/* ========== 响应式 ========== */
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
}
</style>
