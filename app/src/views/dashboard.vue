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
  div(style="height: 15px")
  el-card
    template(#header)
      .card-header
        span Wrapped SOL

        el-button(@click="getAccount") account detail
    div
      el-row(:gutter="15")
        el-col(:span="4") 
          el-input(v-model="amount")
        el-button(@click="tapWrappedSOL") wrapped sol
        el-button(@click="tapUnwrap") unwrap
    div(style="height: 15px")
    el-form(v-if="account" label-width="120px")
      <el-form-item label="publicKey">
        <el-input v-model="account.publicKey" disabled />
      </el-form-item>
      <el-form-item label="amount">
        div.el-input__wrapper.el-input.is-disabled
          .el-input__inner {{ lamports2sol(account.amount) }}
      </el-form-item>
      <el-form-item label="owner">
        <el-input v-model="account.owner" disabled />
      </el-form-item>
      <el-form-item label="mint">
        <el-input v-model="account.mint" disabled />
      </el-form-item>
</template>
<script>
import { ElMessage } from "element-plus";

import {
  airdrop,
  transfer as transferSol,

  getAtAAccountInfo,
  wrappedSOL,
  unwrapSOL,
} from '../solana/api/sol'
import { isWalletConnected } from "../solana/initWallet";
import sol from "@/mixins/sol";
export default {
  name: 'dash-board',
  mixins: [sol],
  data() {
    return {
      amount: 100,
      address: 'GxdeFNqgmEwDssu8FSwhr7xrzM8JVTUkGSHM9ManYUG8',

      account: null
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
    async getAccount() {
      this.account = await getAtAAccountInfo()
      console.log(this.account)
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
    async tapWrappedSOL() {
      await wrappedSOL(this.amount)
      this.$store.dispatch('refreshBalance')
      this.getAccount()
    },
    async tapUnwrap() {
      await unwrapSOL()
      this.$store.dispatch('refreshBalance')
      this.getAccount()
    }
  }
}
</script>
<style lang="stylus" scoped>
.card-header > span
  margin-right: 15px
</style>