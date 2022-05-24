<template lang="pug">
.sidebar
  el-menu.menu(
    mode='vertical' 
    @select="onSelect"
    :default-active="defaultActive"
    )
    el-menu-item(
      v-for="(m, i) in menus" 
      :index="m.path + '/' + m.children[0].path"
      @click="tapMenuItem(m)"
    )  {{ m.meta.title }}
</template>
<script>
import { ref } from 'vue'

import { routes } from '@/router'
export default {
  name: 'app-sidebar',
  setup() {
    const menus = ref(routes)
    const onSelect = (key, keyPath) => {
      console.log(key, keyPath)
    }
    return {
      menus,
      onSelect
    }
  },
  computed: {
    defaultActive() {
      const route = this.$route
      const { path } = route
      console.log(path)
      return path
    }
  },
  methods: {
    tapMenuItem(m) {
      this.$router.push({ path: m.path })
    }
  }
}
</script>
<style lang="stylus" scoped>
.sidebar 
  background: #f5f5f5
  width: 200px;
  min-height: 100vh;
  overflow: hidden;
  position: fixed
  top: 0
  left: 0
  .menu
    width: 200px;
</style>