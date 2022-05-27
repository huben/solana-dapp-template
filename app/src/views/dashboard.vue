<template lang="pug">
.dashboard  
  el-card
    template(#header)
      .card-header
        span SOL
    div
      el-row(:gutter="15")
        el-col(:span="4")
          el-input(v-model="amount")
        el-button(@click="tapAirdrop") airdrop
        el-col(:span="12") 
          el-input(v-model="address")
        el-button(@click="tapTransferSol") transfer sol
</template>
<script>
import { ElMessage } from "element-plus";

import {
  airdrop,
  transfer as transferSol
} from '../solana/api/sol'
import { isWalletConnected } from "../solana/initWallet";
export default {
  name: 'dash-board',
  data() {
    return {
      amount: 100,
      address: 'GxdeFNqgmEwDssu8FSwhr7xrzM8JVTUkGSHM9ManYUG8',

    }
  },  
  methods: {
    async tapAirdrop() {
      if (!isWalletConnected()) {
        return ElMessage.error('plz connect wallet first')
      }
      try {
        await airdrop(this.amount);
        this.$store.dispatch('refreshBalance')
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
    async tapTransferSol() {
      if (!isWalletConnected()) {
        return ElMessage.error('plz connect wallet first')
      }
      try {
        await transferSol(this.address, this.amount);
        this.$store.dispatch('refreshBalance')
      } catch (error) {
        console.error(error)
        ElMessage.error(error.message)
      }
    },
  }
}
</script>
<style lang="stylus" scoped>
</style>