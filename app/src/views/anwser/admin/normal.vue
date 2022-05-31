<template lang="pug">
.anwser 
  el-card
    el-table(
      :data="manVsMachines", 
      border, 
      style="width: 100%"
      :row-class-name="tableRowClassName"
    )
      ElTableColumn(type="index" width="50")
      ElTableColumn(prop="authority", label="authority", width="250")
      ElTableColumn(prop="ata", label="ata", width="250")
      ElTableColumn(prop="count", label="count", width="120")
      ElTableColumn(prop="successCount", label="success", width="120")
      ElTableColumn(prop="errorCount", label="error", width="120")
      ElTableColumn(prop="status", label="status", width="120")
      ElTableColumn(fixed="right", label="Operations", width="120")
        template(#default="scope")
          el-button(size="small", @click="tapApprove(scope.row, scope.$index)" :disabled="scope.row.status != 1") {{ statusFilter(scope.row.status) }}
      
</template>
<script>
// import { ElMessage } from 'element-plus'

import timeFormat from '@/mixins/timeFormat'

import { 
  all,
  approveManVsMachine,
} from '@/solana/api/manVsMachine'

import EditAnwser from "@/components/post/EditAnwser.vue";
export default {
  name: 'anwser-normal',
  mixins: [timeFormat],
  components: {
    EditAnwser,
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
  async mounted() {
    this.getAll()
  },
  methods: {
    async getAll() {
      this.manVsMachines = await all()
    },
    async tapApprove(row, index) {
      if (this.$checkWallet()) {
        const m2m = await approveManVsMachine(row.publicKey, row.ata)
        this.manVsMachines[index] = m2m     
      }
    },
    statusFilter(val) {
      if (val == 0) {
        return '等待完成'
      } else if (val == 1) {
        return '状态审核'
      } else if (val == 2) {
        return '奖励已发放'
      } else if (val == 3) {
        return '挑战失败'
      } else {
        return '状态未知'
      }
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
