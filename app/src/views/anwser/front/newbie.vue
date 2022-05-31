<template lang="pug">
.anwser 
  el-card
    template(#header)
      el-button(@click='tapCreateAnwser' type='primary') 开始答题
      el-button(@click='getAll') 刷新排行榜
    el-table(
        :data="groupByAuthorityAnwsers", 
        border, 
        style="width: 100%"
        :row-class-name="tableRowClassName"
      )
        ElTableColumn(type="index" width="50")
        ElTableColumn(prop="authority", label="authority", width="500")
        ElTableColumn(prop="答对待发奖励", label="答对待发奖励", width="120")
          template(#default="scope")
            div {{ scope.row.rights.length }}
        ElTableColumn(prop="已发奖励", label="已发奖励", width="120")
          template(#default="scope")
            div {{ scope.row.rewards.length }}
        ElTableColumn(prop="累计答对", label="累计答对", width="120")
          template(#default="scope")
            div {{ scope.row.rights.length + scope.row.rewards.length }}
        ElTableColumn(prop="累计答错", label="累计答错", width="120")
          template(#default="scope")
            div {{ scope.row.errors.length }}
      
  el-dialog(v-model="showInputDialog", title="Create Anwser")
    edit-anwser(ref="editanwser" :question='question')
    template(#footer)
      span(class="dialog-footer")
        el-button(@click="showInputDialog = false") Cancel
        el-button(type="primary" @click="tapDialogConfirm") Confirm
</template>
<script>
import { ElMessage } from 'element-plus'

import timeFormat from '@/mixins/timeFormat'

import { 
  all,
  createAnwser,
  approveAnwser,
} from '@/solana/api/anwser'
import {
  fetchQuestion,
  randomQuestion,
} from '@/solana/api/question'

import EditAnwser from "@/components/post/EditAnwser.vue";
import { statusFilter as fetchStatusFilter } from '@/solana/model/anwser'
import bus from '@/bus'
export default {
  name: 'anwser-newbie',
  mixins: [timeFormat],
  components: {
    EditAnwser,
  },
  data() {
    return {
      account: null,
      
      rightFilters: [fetchStatusFilter(1)],
      errorFilters: [fetchStatusFilter(2)],
      rewardFilter: [fetchStatusFilter(3)],

      anwsers: [],

      showInputDialog: false,

      question: null,
    }
  },
  computed: {
    groupByAuthorityAnwsers() {
      const group = []
      this.anwsers.forEach(anwser => {
        let inGroup = false
        group.forEach(g => {
          if (g.authority == anwser.authority.toString()) {
            inGroup = true
            if (anwser.status == 1) {
              g.rights.push(anwser)
            } else if (anwser.status == 2) {
              g.errors.push(anwser)
            } else if (anwser.status == 3) {
              g.rewards.push(anwser)
            }
          } 
        })
        if (!inGroup) {
          let rights = []
          let errors = []
          let rewards = []
          if (anwser.status == 1) {
            rights = [ anwser ]
          } else if (anwser.status == 2) {
            errors = [ anwser ]
          } else if (anwser.status == 3) {
            rewards = [ anwser ]
          }
          group.push({
            authority: anwser.authority.toString(),
            rights,
            errors,
            rewards,
          })
        }
      })
      group.sort((a, b) => {
        return (b.rights.length + b.rewards.length) - (a.rights.length + a.rewards.length )
      })
      return group
    }
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
      //use no filter much better
      Promise.all([all(this.rightFilters), all(this.errorFilters), all(this.rewardFilter)])
      .then(([rights, errors, rewards]) => {
        this.anwsers = [ ...rights, ...errors, ...rewards]
      })
      console.log(this.anwsers)
    },
    async tapCreateAnwser() {
      const questionPubkey = await randomQuestion()
      console.log(questionPubkey.toString())
      this.question = await fetchQuestion(questionPubkey)
      this.showInputDialog = true
    },
    async tapDialogConfirm() {
      if (this.$checkWallet()) {
        try {
          const { anwser } = this.$refs.editanwser.getValues();
          if (anwser != 1 && anwser != 2) {
            ElMessage.error('请选择答案')
            return 
          }
          this.showInputDialog = false;
          await createAnwser(this.question.publicKey, anwser)
          this.$refs.editanwser.clear()
          this.getAll()
          this.refreshAccount()
        } catch (error) {
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
    },
    tableRowClassName({ row }) {
      console.log(this.publicKey)
      if (row.authority == this.publicKey) {
        return 'warning-row'
      } 
      return ''
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
<style lang="stylus">
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-danger);
}
</style>