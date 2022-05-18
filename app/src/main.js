import { createApp } from 'vue'

import App from './App.vue'
import wallet from './solana/wallet'

const app = createApp(App)

wallet(app)

app.mount('#app')
