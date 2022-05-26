<template lang="pug">
.navbar 
  .address {{ publicKey ? publicKey : 'plz connect wallet first' }} 
    .balance {{ lamports2sol(balance) }}
  .wallet
    wallet-multi-button  
</template>
<script>
import { WalletMultiButton, useWallet } from 'solana-wallets-vue';
import sol from '@/mixins/sol'
export default {
  name: 'app-navbar',
  mixins: [sol],
  components: {
    WalletMultiButton,
  },
  computed: {
    balance() {
      return this.$store.getters.balance
    }
  },
  watch: {
    connected(val) {
      if (val) {
        this.$store.dispatch('refreshBalance')
      }
    }
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