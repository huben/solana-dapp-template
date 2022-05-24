<template lang="pug">
.layout
  sidebar
  .contanier
    navbar
    appmain
</template>
<script>
import sidebar from './components/sidebar'
import navbar from './components/navbar'
import appmain from './components/appmain'
export default {
  name: 'layout-index',
  components: {
    sidebar,
    navbar,
    appmain,
  }
}
</script>
<style lang="stylus" scoped>
.layout
.siderbar
  background: #ffffff
.contanier
  margin-left: 200px
</style>