<template lang="pug">
.question 
  el-card
    el-button(@click='tapCreateQuestion') create question
    span(style="width: 15px; display: inline-block;")
    el-select(
      v-model="status"
      placeholder="Filter Status" 
      )
      el-option(
        v-for="item in statusArray"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      )
  
  div(style="height: 15px;")

  el-table(:data="questions", stripe, border, style="width: 100%")
    ElTableColumn(type="index" width="50")
    ElTableColumn(prop="publicKey", label="publicKey", width="160")
    ElTableColumn(prop="authority", label="authority", width="160")
    ElTableColumn(prop="desc", label="desc", width="260")
    ElTableColumn(prop="option", label="option", width="260")
      template(#default="scope")
        div {{ `[${scope.row.option1}, ${scope.row.option1}]` }}
    ElTableColumn(prop="status", label="status", width="100")
      template(#default="scope")
        div {{ statusFilter(scope.row.status) }}
    ElTableColumn(prop="authorityAta", label="authorityAta", width="160")
    ElTableColumn(prop="timestamp", label="timestamp", width="180")
      template(#default="scope")
        div {{ timeFormat(scope.row.timestamp) }}
    ElTableColumn(fixed="right", label="Operations", width="300")
      template(#default="scope")
        el-button(size="small", @click="tapApprove(scope.row, scope.$index)" ) approve
        el-button(size="small", @click="tapReject(scope.row, scope.$index)" ) reject
  
  div(style="height: 15px;")
  
  el-pagination(
    background 
    layout="prev, pager, next"
    v-model:current-page='page'
    :total="totalNum"
    @current-change="getQuestions"
  )

  el-dialog(v-model="showInputDialog", title="Create Post")
    edit-question(ref="editquestion")
    template(#footer)
      span(class="dialog-footer")
        el-button(@click="showInputDialog = false") Cancel
        el-button(type="primary" @click="tapDialogConfirm") Confirm
</template>
<script>
import { ElMessage } from 'element-plus'

import timeFormat from '@/mixins/timeFormat'
import { 
  fetchQuestionTotalNum,
  getQuestions,
  createQuestion,
  approveQuestion,
  rejectQuestion,
} from '../solana/api/question'
import EditQuestion from "@/components/post/EditQuestion.vue";
import { statusFilter as fetchStatusFilter } from '../solana/model/question'
export default {
  name: 'question-index',
  mixins: [timeFormat],
  components: {
    EditQuestion
  },
  data() {
    return {
      status: -1,
      statusArray: [
        { name: '全部', value: -1 },
        { name: '待审核', value: 0 },
        { name: '审核成功', value: 1 },
        { name: '审核失败', value: 2 },
      ],
      filters: [],

      page: 1,
      totalNum: 0,
      questions: [],

      showInputDialog: false,
    }
  },
  watch: {
    status(val) {
      if (val == -1) {
        this.filters = []
      } else {
        this.filters = [fetchStatusFilter(val)]
      }
      this.getQuestions(1)
    }
  },
  async mounted() {
    this.totalNum = await fetchQuestionTotalNum()
    this.getQuestions(1)
  },
  methods: {
    async getQuestions(page) {
      this.page = page
      this.questions = await getQuestions(this.page, this.filters)
    },
    async tapCreateQuestion() {
      this.showInputDialog = true
    },
    async tapDialogConfirm() {
      this.showInputDialog = false;
      const { desc, option1, option2, right } = this.$refs.editquestion.getValues();
      if (this.$checkWallet()) {
        try {
          await createQuestion(desc, option1, option2, right)
          this.$refs.editquestion.clear()
          this.getQuestions()
        } catch (error) {
          ElMessage.error(error.message)
        }
      }
    },
    async tapApprove(question, index) {
      console.log(question, index)
      if (this.$checkWallet()) {
        try {
          question = await approveQuestion(question.publicKey, question.authorityAta)
          this.questions[index] = question
        } catch (error) {
          ElMessage.error(error.message)
        }
      }
    },
    async tapReject(question, index) {
      console.log(question, index)
      if (this.$checkWallet()) {
        try {
          question = await rejectQuestion(question.publicKey)
          this.questions[index] = question
        } catch (error) {
          ElMessage.error(error.message)
        }
      }
    },
    statusFilter(val) {
      if (val == 0) {
        return `待审核:${val}`
      } else if (val == 1) {
        return `审核成功:${val}`
      } else if (val == 2) {
        return `审核失败:${val}`
      } else {
        return `状态未知:${val}`
      }
      
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>