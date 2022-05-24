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
</style>
