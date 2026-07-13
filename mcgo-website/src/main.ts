import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { bootstrapTheme } from './composables/useTheme'

bootstrapTheme()
createApp(App).mount('#app')
