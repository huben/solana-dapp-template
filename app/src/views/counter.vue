<template lang="pug">
.counter 
  el-card
    template(#header)
      .card-header
        span Counter
        el-button(class="button" text) {{ counter ? counter.count : 'there is none cunter, plz init first' }}
    div
      el-button(@click="tapInit") init
      el-button(@click="tapIncrement") increment
      el-button(@click="tapFetchAll") all

  el-table(
    :data="counters" 
    stripe border 
    style="width: 100%")
    
    ElTableColumn(prop="publicKey" label="publicKey" width="250")
    ElTableColumn(prop="authority" label="authority" width="250")
    ElTableColumn(prop="count" label="count" width="80")
    ElTableColumn(prop="accountType" label="accountType" width="150")
    ElTableColumn(prop="timestamp" label="timestamp" width="180")
      template(#default="scope")
        div {{ timeFormat(scope.row.timestamp) }}

</template>

<script>
import { ElMessage } from 'element-plus'

import timeFormat from '@/mixins/timeFormat'
import { init, increment, fetchAccounts } from '../solana/api/counter'
import { isWalletConnected } from '../solana/initWallet'
export default {
  name: 'couter-page',
  mixins: [ timeFormat ],
  props: {
  },
  data() {
    return {
      counter: null,
      counters: [
      ],
    }
  },
  computed: {
  },
  components: {
  },
  mounted() {
  },
  methods: {
    async tapInit() {
      if (!isWalletConnected()) {
        ElMessage.error('plz connect wallet first')
        return 
      }
      try { 
        this.counter = await init() 
      } catch(e) {
        alert(e)
      }
    },
    async tapIncrement() {
      if (!this.counter) {
        ElMessage.error('plz init counter first')
        return 
      }
      try { 
        this.counter = await increment(this.counter.publicKey)
      } catch(e) {
        ElMessage.error(e.message)
      }
    },
    async tapFetchAll() {
      this.counters = await fetchAccounts()
      console.log(this.counters)
    }

  }
}
</script>

<style scoped>
</style>
