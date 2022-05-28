import { createApp } from 'vue'
import ElementPlus, { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import initWallet, { isWalletConnected } from './solana/initWallet'
import router from './router'
import store from './store'

const app = createApp(App)

initWallet(app)
app.use(router)
app.use(store)
app.use(ElementPlus)

app.config.globalProperties.$checkWallet = () => {
  if (!isWalletConnected()) {
    ElMessage.error('plz connect wallet first')
    return false
  } else {
    return true
  }
}

app.mount('#app')
