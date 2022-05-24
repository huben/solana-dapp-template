<template>
  <div class="counter">
    <div class="count">{{ counter ? counter.count : 'None' }}</div>
    <div class="btn-group">
      <button @click="tapInit">init</button>
      <button @click="tapIncrement">increment</button>
    </div>
  </div>
</template>

<script>

import { init, increment } from '../solana/api/counter'
export default {
  name: 'HelloWorld',
  props: {
  },
  data() {
    return {
      counter: null,
    }
  },
  components: {
  },
  methods: {
    async tapInit() {
      try { 
        this.counter = await init() 
      } catch(e) {
        alert(e)
      }
    },
    async tapIncrement() {
      try { 
        this.counter = await increment(this.counter.publicKey)
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
