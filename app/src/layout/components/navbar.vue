<template lang="pug">
.navbar 
  .address {{ publicKey ? publicKey : 'plz connect wallet first' }}
  .wallet
    wallet-multi-button  
</template>
<script>
import { WalletMultiButton, useWallet } from 'solana-wallets-vue';
export default {
  name: 'app-navbar',
  components: {
    WalletMultiButton,
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
<style lang="stylus" scoped>
.navbar 
  height: 80px
  border-bottom: solid 1px #f2f2f2
  display: flex
  align-items: center
  padding 0 15px

.address
  flex 1
  font-size: 14px
.wallet
  min-width: 180px
  display: inline-flex
  justify-content: flex-end
</style>