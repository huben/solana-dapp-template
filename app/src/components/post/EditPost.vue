<template lang="pug">
.edit 
  el-form-item(
    label="topic"
  )
    el-input(
      v-model="topic"
      :rows="1"
      placeholder="Please input topic"
      show-word-limit
      maxlength="10"
    )
  el-form-item(
    label="desc"
  )
    el-input(
      label="desc"
      v-model="desc"
      :rows="3"
      type="textarea"
      placeholder="Please input desc"
      show-word-limit
      maxlength="140"
    )
</template>
<script>
export default {
  props: {
    post: {
      type: Object
    }
  },
  data() {
    return {
      topic: '',
      desc: ''
    }
  },
  watch: {
    post(val) {
      if (val) {
        this.topic = val.topic
        this.desc = val.desc
      } else {
        this.topic = ''
        this.desc = ''
      }
    } 
  },
  methods: {
    getValues() {
      return {
        topic: this.topic,
        desc: this.desc
      }
    },
    clear() {
      this.topic = ''
      this.desc = ''
    }
  }  
}
</script>