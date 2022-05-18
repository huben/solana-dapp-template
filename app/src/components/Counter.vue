<template>
  <div class="counter">
    <div class="count">{{ count }}</div>
    <div class="btn-group">
      <button @click="tapInit">init</button>
      <button @click="tapIncrement">increment</button>
    </div>
  </div>
</template>

<script>

import { fetchAccount, init, increment } from '../solana/api'
export default {
  name: 'HelloWorld',
  props: {
  },
  data() {
    return {
      count: 'null',
    }
  },
  components: {
  },
  methods: {
    async tapInit() {
      try { 
        await init() 
        await this.fetchAccount()
      } catch(e) {
        alert(e)
      }
    },
    async fetchAccount() {
      try { 
        const account = await fetchAccount() 
        this.count = account.count.toString()
      } catch(e) {
        alert(e)
      }
    }, 
    async tapIncrement() {
      try { 
        await increment()
        await this.fetchAccount() 
      } catch(e) {
        alert(e)
      }
    },

  }
}
</script>

<style scoped>
.counter {
  width: 300px;
  padding: 15px;
}
.count {
  text-align: center;
  font-size: 20px;
}
.btn-group {
  display: flex;
  justify-content: space-between;
}
.btn-group > button{
  flex: 1;
  padding: 10px
}
</style>
