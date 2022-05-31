<template lang="pug">
.anwser 
  el-card
    template(#header)
      el-row(:gutter="15")
        el-col(:span="4")
          el-input(v-model="amount")
        el-button(@click='tapCreate' type='primary') 创建Hunt
    el-table(
      :data="hunts", 
      border, 
      style="width: 100%"
      :row-class-name="tableRowClassName"
    )
      ElTableColumn(type="index" width="50")
      ElTableColumn(prop="publicKey", label="publicKey", width="230")
      ElTableColumn(prop="amount", label="amount", width="60")
      ElTableColumn(prop="builder", label="builder", width="500")
        template(#default="scope")
          div {{ scope.row.builder }}
          div {{ scope.row.parter }}
      ElTableColumn(prop="count", label="count", width="200")
        template(#default="scope")
          div {{ scope.row.builder }}
          div {{ scope.row.parter }}
      ElTableColumn(prop="winer", label="winer", width="120")
      ElTableColumn(prop="status", label="status", width="120")
        template(#default="scope")
          div {{ statusFilter(scope.row.status) }}
      ElTableColumn(fixed="right", label="Operations", width="150")
        template(#default="scope")
          el-button(size="small", @click="tapJoin(scope.row, scope.$index)" :disabled="scope.row.status != 0") 加入
          el-button(size="small", @click="tapAnwser(scope.row, scope.$index)" :disabled="scope.row.status == 1") 去答题
  el-dialog(v-model="showInputDialog", :title="`当前进度 ${doingCount} / ${currentItem ? currentItem.mount : 0 }`")
    edit-anwser(ref="editanwser" :question='question')
    template(#footer)
      span(class="dialog-footer")
        el-button(@click="showInputDialog = false") Cancel
        el-button(type="primary" @click="tapDialogConfirm") {{ doingCount == currentItem.mount ? "Finish": "Next" }}   
</template>
<script>
import { ElMessage } from 'element-plus'

import timeFormat from '@/mixins/timeFormat'
import { 
  all,
  createHunt,
  joinHunt,
} from '@/solana/api/hunt'
import {
  fetchQuestion,
  randomQuestion,
  randomQsAccounts
} from '@/solana/api/question'

import EditAnwser from "@/components/post/EditAnwser.vue";
import bus from '@/bus'
export default {
  name: 'anwser-knowbie',
  mixins: [timeFormat],
  components: {
    EditAnwser,
  },
  data() {
    return {
      amount: 10,
      hunts: [],

      showInputDialog: false,
      currentItem: null,
      doingCount: 0,
      question: {},
    }
  },
  computed: {
  },
  async mounted() {
    this.getAll()
  },
  methods: {
    async refreshAccount() {
      if (this.$checkWallet()) {
        bus.$emit('refreshAccount')
      }
    },
    async getAll() {
      this.hunts = await all()
    },
    async getPlayers() {
      for (let i = 0; i < this.hunts.length; i ++) {
        //
      }
      this.hunts
    },
    async tapCreate() {
      if (this.$checkWallet()) {
        const qsAccouts = await randomQsAccounts(10)
        await createHunt(qsAccouts, this.amount)
        this.getAll()
        this.refreshAccount()
      }
    },
    async tapDialogConfirm() {
      if (this.$checkWallet()) {
        if (this.doingCount == (this.currentItem.count + 1)) {
          this.doingCount = 0
          this.showInputDialog = false;
        }
        try {
          if (!this.question.publicKey) {
            await this.randomQuestion()
          } else {
            const { anwser } = this.$refs.editanwser.getValues();
            if (anwser != 1 && anwser != 2) {
              ElMessage.error('请选择答案')
              return 
            }

            // await anwserHunt(this.currentItem.publicKey, this.question.publicKey, anwser)
          
            this.$refs.editanwser.clear()
            this.question = {}
            this.doingCount = this.doingCount + 1
            this.tapDialogConfirm()
            this.getAll()
            this.refreshAccount()
          }
        } catch (error) {
          ElMessage.error(error.message)
        }
      }
    },
    async randomQuestion() {
      const questionPubkey = await randomQuestion()
      this.question = await fetchQuestion(questionPubkey)
      console.log(this.question)
    },
    async tapJoin(hunt) {
      if (this.$checkWallet()) {
        const player = await joinHunt(hunt.publicKey)
        console.log(player)
      }
    },
    tapAnwser(row) {
      if (this.$checkWallet()) {
        this.currentItem = row
        this.doingCount = row.successCount + row.errorCount + 1
        this.showInputDialog = true
        this.randomQuestion()
      }
    },
    tableRowClassName({ row }) {
      if (row.authority 
          && this.publicKey 
          && (row.authority.toString() == this.publicKey.toString())
      ) {
        return 'warning-row'
      } 
      return ''
    },
    statusFilter(val) {
      if (val == 0) {
        return '已创建'
      } else if (val == 1) {
        return '匹配完成'
      } else if (val == 2) {
        return '已完成'
      } else if (val == 3) {
        return '已发奖'
      }
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
