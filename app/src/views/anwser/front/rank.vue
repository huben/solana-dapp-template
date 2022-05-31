<template lang="pug">
.anwser 
  .fix
    navbar
  div(style="height: 80px")
  el-card
    el-card
      template(#header)
        el-row(:gutter="15")
          el-col(:span="4")
            el-input(v-model="amount")
          el-button(@click="tapAirdrop") airdrop
      div(style="padding-left: 10px")
        el-row(:gutter="15")
          el-button(@click="getAccount") account detail
          el-col(:span="4")
            el-input(v-model="amountWrap")
          el-button(@click="tapWrappedSOL") wrap sol
          el-button(@click="tapUnwrap") unwrap sol

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
      
    div(style="height: 15px;")

    el-menu(
      mode="horizontal"
      default-active="1"
      )
      el-menu-item(index="1" @click="tapMenu('/anwser/rank/newbie')") 新手区
      el-menu-item(index="2" @click="tapMenu('/anwser/rank/normal')") 人机对战
      el-menu-item(index="3" @click="tapMenu('/anwser/rank/knowbie')") 大乐斗

    <router-view></router-view>

</template>
<script>
import { ElMessage } from 'element-plus'

import { useWallet } from 'solana-wallets-vue';
import timeFormat from '@/mixins/timeFormat'
import sol from "@/mixins/sol";
import bus from '@/bus'

import {
  airdrop,
  getAtAAccountInfo,
  wrappedSOL,
  unwrapSOL,
} from '@/solana/api/sol'

import navbar from '@/layout/components/navbar.vue'

export default {
  name: 'anwser-rank',
  mixins: [timeFormat, sol],
  components: {
    navbar,
  },
  setup() {
    const { publicKey } = useWallet()
    return {
      publicKey, 
    }
  },
  data() {
    return {
      amount: 1,
      amountWrap: 2,
      account: null,
      
    }
  },
  mounted() {
    bus.$on('refreshAccount', () => {
      this.getAccount()
    })
  },
  methods: {
    async tapMenu(path) {
      this.$router.replace(path)
    },
    async tapAirdrop() {
      if (this.$checkWallet()) {
        try {
          await airdrop(this.amount);
          this.$store.dispatch('refreshBalance')
        } catch (error) {
          console.error(error)
          ElMessage.error(error.message)
        }
      }
    },
    async getAccount() {
      if (this.$checkWallet()) {
        this.account = await getAtAAccountInfo()
      }
    },
    async tapWrappedSOL() {
      if (this.$checkWallet()) {
        await wrappedSOL(this.amountWrap)
        this.$store.dispatch('refreshBalance')
        this.getAccount()
      }
    },
    async tapUnwrap() {
      if (this.$checkWallet()) {
        await unwrapSOL()
        this.$store.dispatch('refreshBalance')
        this.getAccount()
      }
    },
  }
}
</script>
<style lang="stylus" scoped>
.fix
  position fixed
  top 0
  right 0
  left 0
  background #ffffff
  z-index 1
</style>