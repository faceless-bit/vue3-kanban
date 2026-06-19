<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppIcon from '@/components/AppIcon.vue'

const donateOpen = ref(false)
const visibleSections = ref<Set<string>>(new Set())

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
      <div class="hero-badge">
        <AppIcon name="diamond" :size="14" /> 轻量云端任务管理
      </div>
      <h1 class="hero-title">任务看板</h1>
      <p class="hero-sub">
        一个简洁、安全、跨设备的云端任务管理工具。<br/>
        专为个人和小团队设计，让每件事都有条不紊。
      </p>
      <div class="hero-stats">
        <div class="hstat"><strong>3列</strong>看板</div>
        <div class="hstat"><strong>云端</strong>同步</div>
        <div class="hstat"><strong>简单</strong>易用</div>
        <div class="hstat"><strong>免费</strong>使用</div>
      </div>
    </section>

    <!-- ====== 功能特性 ====== -->
    <section class="section" data-section="features" :class="{ visible: isVisible('features') }">
      <h2 class="section-title">功能特性</h2>
      <div class="card-grid">
        <div class="card" v-for="(item, i) in [
          { icon:'clipboard', title:'任务管理', desc:'创建待办、进行中、已完成三列任务，进度一目了然。' },
          { icon:'search', title:'快速检索', desc:'支持关键词搜索和状态筛选，快速定位任务。' },
          { icon:'cloud', title:'云端同步', desc:'数据实时存入数据库，换设备登录即同步。' },
          { icon:'lock', title:'数据隔离', desc:'独立账户，行级安全策略，你的数据只有你能看。' },
          { icon:'zap', title:'极速体验', desc:'零学习成本，页面秒开，操作流畅。' },
          { icon:'phone', title:'手机可用', desc:'响应式设计，适配手机、平板、桌面三端。' },
        ]" :key="item.title" :style="{ transitionDelay: (i * 0.08) + 's' }">
          <div class="card-icon"><AppIcon :name="item.icon" :size="32" /></div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ====== 解决什么问题 ====== -->
    <section class="section section-alt" data-section="pain" :class="{ visible: isVisible('pain') }">
      <h2 class="section-title">解决什么问题</h2>
      <div class="pain-list">
        <div class="pain-item" v-for="(item, i) in [
          { before:'便签贴得满桌都是，记事本杂乱无章', after:'三列看板分区管理，待办/进行中/已完成一眼看清' },
          { before:'换个设备任务就没了，数据只存本地', after:'云端存储，登录即同步，数据不会丢' },
          { before:'复杂工具需要学习，注册流程繁琐', after:'输入名字即可开始，零学习成本' },
        ]" :key="item.before" :style="{ transitionDelay: (i * 0.12) + 's' }">
          <div class="pain-before">{{ item.before }}</div>
          <div class="pain-arrow">
            <AppIcon name="arrow-right" :size="18" />
          </div>
          <div class="pain-after">{{ item.after }}</div>
        </div>
      </div>
    </section>

    <!-- ====== 联系开发者 ====== -->
    <section class="section" data-section="contact" :class="{ visible: isVisible('contact') }">
      <h2 class="section-title">联系开发者</h2>
      <div class="contact-card">
        <div class="contact-qr">
          <img src="/qq-qrcode.png" alt="QQ二维码" class="contact-qr-img" />
        </div>
        <div class="contact-info">
          <h3>有问题或建议？</h3>
          <p>扫码添加开发者 QQ 好友，直接反馈</p>
          <div class="contact-tags">
            <span>问题反馈</span>
            <span>功能建议</span>
            <span>技术交流</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== 支持 ====== -->
    <section class="section donate-section" data-section="donate" :class="{ visible: isVisible('donate') }">
      <div class="donate-inner">
        <div class="thanks-block">
          <h2>感谢使用</h2>
          <p>
            本项目由个人开发维护，承诺<strong>永久免费</strong>。<br/>
            如果它帮到了你，欢迎支持后续开发。
          </p>
        </div>
        <button class="donate-btn" @click="donateOpen = true">
          支持开发者
        </button>
      </div>
    </section>

    <!-- ====== 弹窗 ====== -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="donateOpen" class="modal-overlay" @click.self="donateOpen = false">
          <div class="modal-card">
            <button class="modal-close" @click="donateOpen = false">
              <AppIcon name="x-circle" :size="20" />
            </button>
            <div class="modal-layout">
              <div class="modal-left">
                <div class="qr-frame">
                  <img src="/donate.png" alt="收款码" class="qr-img" />
                </div>
              </div>
              <div class="modal-right">
                <h2>支持开发者</h2>
                <p class="modal-desc">你的每一份支持都将用于项目维护和改进，感谢！</p>
                <p class="modal-note">微信扫码，金额随意</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ====== 页脚 ====== -->
    <footer class="footer">
      <p>任务看板 &copy; 2026</p>
    </footer>
  </div>
</template>

<style scoped>
.about-page { max-width: 880px; margin: 0 auto; }

[data-section] {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
[data-section].visible { opacity: 1; transform: translateY(0); }

[data-section="hero"] { opacity: 1; transform: none; }
[data-section="hero"].visible .hero-badge  { animation: fadeUp 0.6s ease both; }
[data-section="hero"].visible .hero-title  { animation: fadeUp 0.6s 0.1s ease both; }
[data-section="hero"].visible .hero-sub    { animation: fadeUp 0.6s 0.2s ease both; }
[data-section="hero"].visible .hero-stats  { animation: fadeUp 0.6s 0.3s ease both; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.section { margin-bottom: 48px; }
.section-alt {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 36px 32px;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
}

/* ====== Hero ====== */
.hero { text-align: center; margin-bottom: 48px; padding-top: 12px; }
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 16px;
  background: rgba(13,148,136,0.1);
  border: 1px solid rgba(13,148,136,0.2);
  border-radius: 16px;
  font-size: 0.76rem;
  color: var(--color-primary);
  margin-bottom: 16px;
}
.hero-title { font-size: 2.4rem; font-weight: 800; margin-bottom: 14px; color: var(--color-text); }
.hero-sub { font-size: 0.95rem; color: var(--color-text-muted); line-height: 1.8; margin-bottom: 24px; }
.hero-stats { display: flex; justify-content: center; gap: 16px; }
.hstat {
  padding: 8px 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.82rem;
  color: var(--color-text-muted);
  transition: all 0.3s ease;
}
.hstat:hover { border-color: var(--color-primary); transform: translateY(-2px); }
.hstat strong { display: block; color: var(--color-primary); font-size: 1.1rem; }

/* ====== 功能卡片 ====== */
.card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px 20px;
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateY(20px);
}
[data-section="features"].visible .card { opacity: 1; transform: translateY(0); }
.card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 28px rgba(0,0,0,0.3);
}
.card-icon { color: var(--color-primary); margin-bottom: 10px; transition: transform 0.3s ease; }
.card:hover .card-icon { transform: scale(1.1); }
.card h3 { font-size: 0.94rem; font-weight: 700; margin-bottom: 6px; }
.card p { font-size: 0.8rem; color: var(--color-text-muted); line-height: 1.6; }

/* ====== 痛点列表 ====== */
.pain-list { display: flex; flex-direction: column; gap: 10px; }
.pain-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(0,0,0,0.12);
  border: 1px solid transparent;
  border-radius: 12px;
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateX(-20px);
}
[data-section="pain"].visible .pain-item { opacity: 1; transform: translateX(0); }
.pain-item:hover { background: rgba(13,148,136,0.05); border-color: rgba(13,148,136,0.15); }
.pain-before { flex: 1; font-size: 0.83rem; color: var(--color-text-muted); }
.pain-arrow { color: var(--color-primary); flex-shrink: 0; }
.pain-after { flex: 1; font-size: 0.83rem; color: var(--color-text); font-weight: 500; }

/* ====== 联系卡片 ====== */
.contact-card {
  display: flex;
  align-items: center;
  gap: 24px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 24px 28px;
  transition: var(--transition);
}
.contact-card:hover { border-color: var(--color-primary); }
.contact-qr-img {
  width: 120px;
  height: 120px;
  border-radius: 10px;
  display: block;
  background: #fff;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.contact-info h3 { font-size: 1rem; font-weight: 700; margin-bottom: 6px; }
.contact-info p { font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 10px; }
.contact-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.contact-tags span {
  padding: 3px 10px;
  background: rgba(13,148,136,0.08);
  border: 1px solid rgba(13,148,136,0.18);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--color-primary);
}

@media (max-width: 480px) { .contact-card { flex-direction: column; text-align: center; } }

/* ====== 支持区域 ====== */
.donate-section { text-align: center; }
.donate-inner {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 40px 28px;
  transition: var(--transition);
}
.donate-inner:hover { border-color: var(--color-primary); }
.thanks-block h2 { font-size: 1.2rem; font-weight: 700; margin-bottom: 10px; }
.thanks-block p { font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.8; }

.donate-btn {
  display: inline-flex;
  margin-top: 20px;
  padding: 12px 36px;
  background: var(--color-primary);
  border: none;
  border-radius: 24px;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.donate-btn:hover { background: var(--color-primary-hover); transform: translateY(-2px); box-shadow: 0 8px 24px var(--color-primary-glow); }

/* ====== 弹窗 ====== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  overflow: hidden;
  max-width: 520px;
  width: 100%;
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: rgba(0,0,0,0.3);
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: var(--transition);
}
.modal-close:hover { border-color: var(--color-danger); color: var(--color-danger); }
.modal-layout { display: flex; align-items: center; }
.modal-left { padding: 28px; background: rgba(0,0,0,0.12); display: flex; align-items: center; }
.qr-frame { background: #fff; padding: 14px; border-radius: 14px; box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
.qr-img { width: 160px; height: 160px; display: block; border-radius: 8px; }
.modal-right { padding: 24px; flex: 1; }
.modal-right h2 { font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; color: var(--color-text); }
.modal-desc { font-size: 0.82rem; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 8px; }
.modal-note { font-size: 0.78rem; color: var(--color-text-muted); }

.modal-enter-active { transition: opacity 0.25s ease; }
.modal-enter-active .modal-card { transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease; }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-leave-active .modal-card { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from { opacity: 0; }
.modal-enter-from .modal-card { transform: scale(0.8); opacity: 0; }
.modal-leave-to { opacity: 0; }
.modal-leave-to .modal-card { transform: scale(0.85); opacity: 0; }

/* ====== 页脚 ====== */
.footer { text-align: center; padding: 16px 0; border-top: 1px solid var(--color-border); margin-top: 4px; }
.footer p { font-size: 0.78rem; color: var(--color-text-muted); }

@media (max-width: 640px) {
  .hero-title { font-size: 1.6rem; }
  .hero-stats { flex-wrap: wrap; gap: 8px; }
  .card-grid { grid-template-columns: 1fr; }
  .section-alt { padding: 20px; }
  .pain-item { flex-direction: column; text-align: center; gap: 4px; }
  .pain-arrow { transform: rotate(90deg); }
  .modal-layout { flex-direction: column; }
  .modal-left { padding: 16px; }
  .qr-img { width: 120px; height: 120px; }
  .modal-right { padding: 14px 18px; text-align: center; }
}
</style>
