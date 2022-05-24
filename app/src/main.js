import { createApp } from 'vue'

import App from './App.vue'
import initWallet from './solana/initWallet'

const app = createApp(App)

initWallet(app)

app.mount('#app')
