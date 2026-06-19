<script setup lang="ts">
/**
 * 根组件
 * 引入全局样式 + 顶部导航 + 路由视图
 */
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  padding: var(--space-lg) var(--space-lg);
  width: 100%;
}
</style>
