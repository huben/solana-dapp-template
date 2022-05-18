<template>
<div>
  <div>
    <wallet-multi-button></wallet-multi-button>
  </div>

  <!-- <div v-show="connected"> -->
  <div>
    <div>Address: {{ publicKey }}</div>
    <Counter></Counter>
  </div>
  
</div>
</template>

<script>
import Counter from './components/Counter.vue'
import { WalletMultiButton, useWallet } from 'solana-wallets-vue';
export default {
  name: 'App',
  components: {
    WalletMultiButton,
    Counter,
  },
  setup() {
    const { publicKey, connected } = useWallet()
    return {
      publicKey, 
      connected,
    }
  },
}
</script>

<style>

</style>
