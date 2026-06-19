<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="shell">
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
.shell { min-height: 100vh; display: flex; flex-direction: column; }
.main { flex: 1; padding: var(--space-xl) var(--space-lg); width: 100%; }
@media (max-width: 640px) {
  .main { padding: var(--space-md); }
}
</style>
