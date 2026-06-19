<script setup lang="ts">
/**
 * 关于页面
 * 项目介绍、功能特性、联系方式、支持入口
 */
import { ref } from 'vue'
import AppIcon from '@/components/icons/AppIcon.vue'
import Modal from '@/components/common/Modal.vue'

const donateOpen = ref(false)

const features = [
  { icon: 'clipboard' as const, title: '任务管理', desc: '三列看板，待办/进行中/已完成一目了然。' },
  { icon: 'search' as const,   title: '快速检索', desc: '关键词搜索和状态筛选，快速定位任务。' },
  { icon: 'cloud' as const,    title: '云端同步', desc: '数据实时存入数据库，换设备登录即同步。' },
  { icon: 'lock' as const,     title: '数据安全', desc: '独立账户，行级安全策略，数据隔离保护。' },
  { icon: 'zap' as const,      title: '极简体验', desc: '零学习成本，页面秒开，操作流畅。' },
  { icon: 'phone' as const,    title: '多端适配', desc: '响应式设计，适配手机、平板、桌面。' },
]

const painPoints = [
  { before: '便签贴得到处都是，记事本杂乱无章', after: '三列看板分区管理，进度一眼看清' },
  { before: '换个设备任务就没了，数据只存本地', after: '云端存储，登录即同步，数据不会丢' },
  { before: '复杂工具需要学习，注册流程繁琐', after: '输入名字即可开始，零学习成本' },
]
</script>

<template>
  <div class="about">
    <!-- ====== Hero ====== -->
    <section class="hero">
      <h1 class="hero-title">任务看板</h1>
      <p class="hero-sub">
        一个简洁、安全、跨设备的云端任务管理工具。<br />
        专为个人和小团队设计。
      </p>
      <div class="hero-tags">
        <span>3列看板</span>
        <span>云端同步</span>
        <span>简单易用</span>
        <span>永久免费</span>
      </div>
    </section>

    <!-- ====== 功能特性 ====== -->
    <section class="block">
      <h2 class="block-title">功能特性</h2>
      <div class="grid-3">
        <div class="feat-card" v-for="f in features" :key="f.title">
          <AppIcon :name="f.icon" :size="28" class="feat-icon" />
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ====== 痛点解决 ====== -->
    <section class="block alt">
      <h2 class="block-title">解决什么问题</h2>
      <div class="pain-list">
        <div class="pain-row" v-for="p in painPoints" :key="p.before">
          <span class="pain-before">{{ p.before }}</span>
          <AppIcon name="arrow-right" :size="18" class="pain-arrow" />
          <span class="pain-after">{{ p.after }}</span>
        </div>
      </div>
    </section>

    <!-- ====== 联系 ====== -->
    <section class="block">
      <h2 class="block-title">联系开发者</h2>
      <div class="contact-row">
        <div class="qr-box">
          <img src="/qq-qrcode.png" alt="QQ二维码" />
        </div>
        <div class="contact-info">
          <h3>有问题或建议？</h3>
          <p>扫码添加开发者 QQ 好友</p>
        </div>
      </div>
    </section>

    <!-- ====== 支持 ====== -->
    <section class="cta">
      <h2>感谢使用</h2>
      <p>本项目由个人开发维护，承诺永久免费。如果它帮到了你，欢迎支持后续开发。</p>
      <button class="cta-btn" @click="donateOpen = true">支持开发者</button>
    </section>

    <!-- 弹窗 -->
    <Modal :visible="donateOpen" @close="donateOpen = false" max-width="420px">
      <div class="donate-modal">
        <div class="donate-left">
          <div class="qr-wrap">
            <img src="/donate.png" alt="收款码" />
          </div>
        </div>
        <div class="donate-right">
          <h3>支持开发者</h3>
          <p>微信扫码，金额随意，感谢支持！</p>
        </div>
      </div>
    </Modal>

    <footer class="footer">
      <p>任务看板 &copy; 2026</p>
    </footer>
  </div>
</template>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

/* Hero */
.hero {
  text-align: center;
  padding: var(--space-xl) 0 var(--space-2xl);
}
.hero-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: var(--space-md);
}
.hero-sub {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}
.hero-tags {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}
.hero-tags span {
  padding: 6px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* Section */
.block {
  margin-bottom: var(--space-2xl);
}
.block.alt {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}
.block-title {
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--space-lg);
}

/* 功能卡片 */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}
.feat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  transition: border-color var(--duration-fast) var(--ease-out);
}
.feat-card:hover {
  border-color: var(--accent);
}
.feat-icon {
  color: var(--accent);
  margin-bottom: var(--space-sm);
}
.feat-card h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 4px;
}
.feat-card p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.55;
}

/* 痛点 */
.pain-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
.pain-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast) var(--ease-out);
}
.pain-row:hover {
  background: var(--accent-muted);
}
.pain-before { flex: 1; font-size: 0.875rem; color: var(--text-secondary); }
.pain-arrow  { color: var(--accent); flex-shrink: 0; }
.pain-after  { flex: 1; font-size: 0.875rem; color: var(--text-primary); font-weight: 500; }

/* 联系 */
.contact-row {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}
.qr-box img {
  width: 110px;
  height: 110px;
  border-radius: var(--radius-sm);
  background: #fff;
  padding: 8px;
}
.contact-info h3 { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
.contact-info p  { font-size: 0.875rem; color: var(--text-secondary); }

/* CTA */
.cta {
  text-align: center;
  padding: var(--space-xl);
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
}
.cta h2 { font-size: 1.2rem; font-weight: 700; margin-bottom: var(--space-sm); }
.cta p  { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: var(--space-lg); }
.cta-btn {
  display: inline-block;
  padding: 10px 28px;
  background: var(--accent);
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
  transition: background var(--duration-fast) var(--ease-out);
}
.cta-btn:hover { background: var(--accent-hover); }

/* 弹窗 */
.donate-modal { display: flex; align-items: center; }
.donate-left {
  padding: var(--space-lg);
  background: var(--bg-surface);
  display: flex;
  align-items: center;
}
.qr-wrap {
  background: #fff;
  padding: 12px;
  border-radius: var(--radius-sm);
}
.qr-wrap img { width: 140px; height: 140px; }
.donate-right { padding: var(--space-lg); }
.donate-right h3 { font-size: 1.05rem; font-weight: 700; margin-bottom: 6px; }
.donate-right p  { font-size: 0.8125rem; color: var(--text-secondary); }

.footer {
  text-align: center;
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--border-default);
  margin-top: var(--space-lg);
}
.footer p { font-size: 0.8125rem; color: var(--text-tertiary); }

@media (max-width: 640px) {
  .hero-title { font-size: 1.5rem; }
  .grid-3 { grid-template-columns: 1fr; }
  .pain-row { flex-direction: column; text-align: center; gap: var(--space-xs); }
  .pain-arrow { transform: rotate(90deg); }
  .contact-row { flex-direction: column; text-align: center; }
  .donate-modal { flex-direction: column; }
}
</style>
