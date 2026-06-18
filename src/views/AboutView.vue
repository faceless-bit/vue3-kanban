<script setup lang="ts">
const features = [
  { icon: '⚡', title: 'Vue 3 + Vite', desc: '基于 Vue 3 Composition API 构建，使用 Vite 极速开发服务器，HMR 热更新毫秒级响应。' },
  { icon: '🧩', title: 'TypeScript', desc: '全面 TypeScript 支持，类型安全，智能提示，让代码更健壮。' },
  { icon: '🗂️', title: 'Pinia 状态管理', desc: '轻量级、类型友好的状态管理方案，替代 Vuex 的新一代选择。' },
  { icon: '🛤️', title: 'Vue Router 5', desc: '官方路由方案，支持懒加载、动态路由、导航守卫。' },
  { icon: '🧪', title: 'Vitest 单元测试', desc: '与 Vite 深度集成的单元测试框架，运行飞快。' },
  { icon: '💾', title: 'LocalStorage 持久化', desc: '任务数据自动保存在浏览器中，刷新不丢失。' },
]
</script>

<template>
  <div class="about-page">
    <div class="about-hero">
      <h1>📋 智能任务看板</h1>
      <p class="hero-sub">基于 Vue 3 生态构建的现代化任务管理工具</p>
      <div class="badge-row">
        <span class="badge">Vue 3.5</span>
        <span class="badge">TypeScript 6</span>
        <span class="badge">Vite 8</span>
        <span class="badge">Pinia 3</span>
        <span class="badge">Router 5</span>
      </div>
    </div>

    <div class="features-grid">
      <div v-for="f in features" :key="f.title" class="feature-card">
        <div class="feature-icon">{{ f.icon }}</div>
        <h3>{{ f.title }}</h3>
        <p>{{ f.desc }}</p>
      </div>
    </div>

    <div class="tech-note">
      <p>💡 本项目在 <code>vue3-app</code> 目录下，使用 <strong>VS Code 便携版</strong> 进行开发。在终端运行 <code>npm run dev</code> 即可启动。</p>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
}

.about-hero {
  text-align: center;
  margin-bottom: 40px;
}

.about-hero h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, var(--color-primary), #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  color: var(--color-text-muted);
  font-size: 1rem;
  margin-bottom: 20px;
}

.badge-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 14px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 16px;
  font-size: 0.8rem;
  color: var(--color-primary);
  font-weight: 500;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.feature-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 20px;
  transition: var(--transition);
}
.feature-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: var(--shadow-card);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.feature-card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.tech-note {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 16px 20px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.tech-note code {
  background: #1a2332;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  .about-hero h1 {
    font-size: 1.6rem;
  }
}
</style>
