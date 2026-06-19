/**
 * 应用入口
 * 初始化顺序：Pinia → Router → Auth Store → App mount
 * 全局样式按顺序加载：variables → base → transitions
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 全局样式
import '@/assets/styles/variables.css'
import '@/assets/styles/base.css'
import '@/assets/styles/transitions.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化认证状态
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
await auth.init()

app.mount('#app')
