<template lang="pug">
.edit 
  el-form(label-width="60px") 
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
        maxlength="12"
      )
    el-form-item(
      label="option"
    )
      el-input(
        v-model="option1"
        :rows="1"
        placeholder="Please input option1"
        show-word-limit
        maxlength="5"
      )
      el-input(
        v-model="option2"
        :rows="1"
        placeholder="Please input option2"
        show-word-limit
        maxlength="5"
      )
    el-form-item(
      label="option"
    )
      el-radio-group(v-model="right")
        el-radio(label="1") {{ option1 }}
        el-radio(:label="2") {{ option2 }}

      
</template>
<script>
export default {
  data() {
    return {
      desc: '',
      option1: '',
      option2: '',
      right: -1,
    }
  },
  methods: {
    getValues() {
      return {
        desc: this.desc,
        option1: this.option1,
        option2: this.option2,
        right: this.right
      }
    },
    clear() {
      this.desc = ''
      this.option1 = ''
      this.option2 = ''
      this.right = '-1'
    }
  }  
}
</script>