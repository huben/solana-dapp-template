<template lang="pug">
.layout
  sidebar
  .contanier
    navbar.navbar
    appmain.main
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
  z-index: 200
.contanier
  margin-left: 200px
  .navbar
    position: fixed;
    left: 200px
    right: 0
    top 0
    z-index: 100
    background: #ffffff
  .main
    margin-top 80px
    z-index: 10
</style>