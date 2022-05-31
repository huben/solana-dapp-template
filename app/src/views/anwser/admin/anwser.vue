<template lang="pug">
.anwser 
  el-card
    el-button(@click='tapCreateAnwser') test new anwser
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

  el-table(:data="anwsers", stripe, border, style="width: 100%")
    ElTableColumn(type="index" width="50")
    ElTableColumn(prop="publicKey", label="publicKey", width="160")
    ElTableColumn(prop="authority", label="authority", width="160")
    ElTableColumn(prop="ata", label="ata", width="160")
    ElTableColumn(prop="question", label="question", width="260")
    ElTableColumn(prop="status", label="status", width="120")
      template(#default="scope")
        div {{ statusFilter(scope.row.status) }}
    ElTableColumn(prop="timestamp", label="timestamp", width="180")
      template(#default="scope")
        div {{ timeFormat(scope.row.timestamp) }}
    ElTableColumn(fixed="right", label="Operations", width="120")
      template(#default="scope")
        el-button(size="small", @click="tapApprove(scope.row, scope.$index)" ) approve
  
  div(style="height: 15px;")
  
  el-pagination(
    background 
    layout="prev, pager, next"
    v-model:current-page='page'
    :total="totalNum"
    @current-change="getAnwsers"
  )

</template>
<script>
import { ElMessage } from 'element-plus'
import { web3 } from '@project-serum/anchor'

import timeFormat from '@/mixins/timeFormat'
import { 
  fetchAnwserTotalNum,
  getAnwsers,
  createAnwser,
  approveAnwser,
} from '@/solana/api/anwser'
import {
  fetchQuestion
} from '@/solana/api/question'
import EditAnwser from "@/components/post/EditAnwser.vue";
import { statusFilter as fetchStatusFilter } from '@/solana/model/anwser'
export default {
  name: 'anwser-index',
  mixins: [timeFormat],
  components: {
    EditAnwser
  },
  data() {
    return {
      status: -1,
      statusArray: [
        { name: '全部', value: -1 },
        { name: '回答正确', value: 1 },
        { name: '回答失败', value: 2 },
        { name: '奖励已发放', value: 3 },
      ],
      filters: [],

      page: 1,
      totalNum: 0,
      anwsers: [],

      question: null,
    }
  },
  watch: {
    status(val) {
      if (val == -1) {
        this.filters = []
      } else {
        this.filters = [fetchStatusFilter(val)]
      }
      this.getAnwsers(1)
    }
  },
  async mounted() {
    this.totalNum = await fetchAnwserTotalNum()
    this.getAnwsers(1)
  },
  methods: {
    async getAnwsers(page) {
      console.log(page)
      this.page = page
      this.anwsers = await getAnwsers(this.page, this.filters)
      console.log(this.anwsers)
    },
    async tapCreateAnwser() {
      if (this.$checkWallet()) {
        try {
          const questionPubkey = new web3.PublicKey('7N6a7Ean7w54McezN1CUcLL6KLTt5zpL9CrcUuUucsRM')
          this.question = await fetchQuestion(questionPubkey)
          await createAnwser(this.question.publicKey, 1)
          this.getAnwsers(1)
        } catch (error) {
          console.log(error)
          ElMessage.error(error.message)
        }
      }
    },
    async tapApprove(anwser, index) {
      console.log(anwser, index)
      if (this.$checkWallet()) {
        try {
          anwser = await approveAnwser(anwser.publicKey, anwser.ata)
          this.anwsers[index] = anwser
        } catch (error) {
          ElMessage.error(error.message)
        }
      }
    },
    statusFilter(val) {
      if (val == 1) {
        return `回答正确:${val}`
      } else if (val == 2) {
        return `回答错误:${val}`
      } else if (val == 3) {
        return `奖励已发放:${val}`
      } else {
        return `状态未知:${val}`
      }
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>