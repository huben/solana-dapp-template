import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import initWallet from './solana/initWallet'
import router from './router'
import store from './store'

const app = createApp(App)

initWallet(app)
app.use(router)
app.use(store)
app.use(ElementPlus)

app.mount('#app')
