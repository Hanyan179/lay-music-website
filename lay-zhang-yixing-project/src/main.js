import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router/index.ts'
import './style.css'

// 全局修复 Three.js DevTools 错误
if (typeof window !== 'undefined') {
  window.__THREE_DEVTOOLS__ = window.__THREE_DEVTOOLS__ || {
    dispatchEvent: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  }
}

const app = createApp(App)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app') 