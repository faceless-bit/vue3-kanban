import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.pages.vue3kanban',
  appName: '智能任务看板',
  webDir: 'dist',
  server: {
    // 加载在线版本，网站更新 = App 自动更新
    url: 'https://vue3-kanban.pages.dev',
    cleartext: false,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
