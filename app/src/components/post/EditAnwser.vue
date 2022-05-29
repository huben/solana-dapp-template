<template lang="pug">
.edit 
  el-form(label-width="60px") 
    el-form-item(
      label="desc"
    )
      el-input(
        label="desc"
        v-model="question.desc"
        :rows="3"
        type="textarea"
        disabled
      )
    el-form-item(
      label="option"
    )
      el-input(
        v-model="question.option1"
        :rows="1"
        disabled
      )
      el-input(
        v-model="question.option2"
        :rows="1"
        disabled
      )
    el-form-item(
      label="anwser"
    )
      el-radio-group(v-model="anwser")
        el-radio(:label="1") {{ question.option1 }}
        el-radio(:label="2") {{ question.option2 }}

      
</template>
<script>
export default {
  props: {
    question: Object
  },
  data() {
    return {
      anwser: -1,
    }
  },
  watch: {

  },
  methods: {
    getValues() {
      return {
        anwser: this.anwser
      }
    },
    clear() {
      this.anwser = '-1'
    }
  }  
}
</script>