import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// Import 'element-plus'
import ElementPlus from 'element-plus'
import './assets/style/element-variables.scss'

// Internationalization (i18n)
import i18n from '@/i18n'

// Global registration: element-plus/icons-vue
import * as ICONS from '@element-plus/icons-vue'
Object.entries(ICONS).forEach(([key, component]) => {
  // app.component(key === 'PieChart' ? 'PieChartIcon' : key, component)
  app.component(key, component)
})

// Import the routing
import router from './router'

// Import 'pinia'
import pinia from './pinia'

// Permission control
import './permission'

// Import the SVG icon registration script
import 'vite-plugin-svg-icons/register'

// Register global components
import * as Components from './global-components'
Object.entries(Components).forEach(([key, component]) => {
  app.component(key, component)
})

// Register custom directives
import * as Directives from '@/directive'
Object.values(Directives).forEach(fn => fn(app))

// Error log
import useErrorHandler from './error-log'
useErrorHandler(app)

app
  .use(i18n)
  .use(ElementPlus)
  .use(pinia)
  .use(router)
  .mount('#app')
