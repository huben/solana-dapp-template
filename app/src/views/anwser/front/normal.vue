<template lang="pug">
.anwser 
  el-card
    template(#header)
      el-row(:gutter="15")
        el-col(:span="4")
          el-input(v-model="count")
        el-button(@click='tapManVsMachine' type='primary') 开始对战
        el-button(@click='getAll') 刷新
    el-table(
      :data="manVsMachines", 
      border, 
      style="width: 100%"
      :row-class-name="tableRowClassName"
    )
      ElTableColumn(type="index" width="50")
      ElTableColumn(prop="authority", label="authority", width="500")
      ElTableColumn(prop="count", label="count", width="120")
      ElTableColumn(prop="successCount", label="success", width="120")
      ElTableColumn(prop="errorCount", label="error", width="120")
      ElTableColumn(prop="status", label="status", width="120")
        template(#default="scope")
          div {{ statusFilter(scope.row.status) }}
      
      ElTableColumn(fixed="right", label="Operations", width="300")
        template(#default="scope")
          el-button(size="small", @click="tapAnwser(scope.row, scope.$index)" :disabled="scope.row.count == (scope.row.successCount + scope.row.errorCount)") 继续答
      
  el-dialog(v-model="showInputDialog", :title="`当前进度 ${doingCount} / ${currentItem ? currentItem.count : 0 }`")
    edit-anwser(ref="editanwser" :question='question')
    template(#footer)
      span(class="dialog-footer")
        el-button(@click="showInputDialog = false") Cancel
        el-button(type="primary" @click="tapDialogConfirm") {{ doingCount == 5 ? "Finish": "Next" }}
</template>
<script>
import { ElMessage } from 'element-plus'
import { useWallet } from 'solana-wallets-vue';

import timeFormat from '@/mixins/timeFormat'

import { 
  all,
  createManVsMachine,
  anwserManVsMachine,
} from '@/solana/api/manVsMachine'
import {
  fetchQuestion,
  randomQuestion,
} from '@/solana/api/question'

import EditAnwser from "@/components/post/EditAnwser.vue";
import bus from '@/bus'
export default {
  name: 'anwser-normal',
  mixins: [timeFormat],
  components: {
    EditAnwser,
  },
  setup() {
    const { publicKey } = useWallet()
    return {
      publicKey, 
    }
  },
  data() {
    return {
      count: 2,

      currentItem: null,
      doingCount: 0,
      
      manVsMachines: [],
      showInputDialog: false,
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
      this.manVsMachines = await all()
    },
    async tapManVsMachine() {
      if (this.$checkWallet()) {
        this.currentItem = await createManVsMachine(this.count)
        this.refreshAccount()
        this.showInputDialog = true
        this.doingCount = 1
        this.randomQuestion()
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

            await anwserManVsMachine(this.currentItem.publicKey, this.question.publicKey, anwser)
          
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
    tapAnwser(row) {
      if (this.$checkWallet()) {
        this.currentItem = row
        this.doingCount = row.successCount + row.errorCount + 1
        this.showInputDialog = true
        this.randomQuestion()
      }
    },
    statusFilter(val) {
      if (val == 0) {
        return '已创建'
      } else if (val == 1) {
        return '已完成'
      } else if (val == 2) {
        return '已发奖'
      } else if (val == 3) {
        return '失败'
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
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
