<template lang="pug">
.post 
  el-button(type="primary", @click="tapCreate") Create

  div(style="height: 15px")

  el-table(:data="posts", stripe, border, style="width: 100%")
    ElTableColumn(prop="publicKey", label="publicKey", width="250")
    ElTableColumn(prop="authority", label="authority", width="250")
    ElTableColumn(prop="topic", label="topic", width="180")
    ElTableColumn(prop="desc", label="desc", width="180")
    ElTableColumn(prop="accountType", label="accountType", width="150")
    ElTableColumn(prop="timestamp", label="timestamp", width="180")
      template(#default="scope")
        div {{ timeFormat(scope.row.timestamp) }}
    ElTableColumn(
      fixed="right" 
      label="Operations" 
      width="150")
      template(#default="scope")
        el-button(size="small" @click="tapEdit(scope.row, scope.$index)") Edit
        el-button(size="small" @click="tapDelete(scope.row, scope.$index)") Delete

  el-dialog(v-model="showInputDialog", title="Create Post")
    edit-post(:post="inputPost" ref="editpost")
    template(#footer)
      span(class="dialog-footer")
        el-button(@click="showInputDialog = false") Cancel
        el-button(type="primary" @click="tapDialogConfirm") Confirm

</template>
<script>
import { ElMessage, ElMessageBox } from "element-plus";

import { createPost, updatePost, deletePost, fetchAccounts } from "../solana/api/post";
import timeFormat from "@/mixins/timeFormat";
import EditPost from "@/components/post/EditPost.vue";
export default {
  name: "post-page",
  mixins: [timeFormat],
  data() {
    return {
      posts: [],
      showInputDialog: false,
      inputPost: null,
      inputIndex: -1,
    };
  },
  mounted() {
    this.tapAll();
  },
  methods: {
    async tapCreate() {
      this.showInputDialog = true;
    },
    async tapDelete(row, index) {
      
      try {
        await ElMessageBox.confirm('即将删除此条 POST', '提示')
        await deletePost(row.publicKey);
        this.posts.splice(index, 1);
      } catch (e) {
        if (e.message)
          ElMessage.error(e.message);
      }
      
    },
    tapEdit(row, index) {
      this.inputIndex = index
      this.showInputDialog = true;
      this.$nextTick(() => {
        this.inputPost = row;
      })
    },
    async tapDialogConfirm() {
      this.showInputDialog = false;
      const { topic, desc } = this.$refs.editpost.getValues();
      if (this.inputPost) {
        this.updatePost(this.inputPost.publicKey, topic, desc)
      } else {
        this.createPost(topic, desc)
      }
      this.clearEditPost()
    },
    async createPost(topic, desc) {
      try {
        const post = await createPost(topic, desc);
        this.posts.splice(0, 0, post);
      } catch (e) {
        ElMessage.error(e.message);
      }
    },
    async updatePost(publicKey, topic, desc) {
      console.log(topic, desc)
      try {
        const post = await updatePost(publicKey, topic, desc);
        console.log(post)
        this.posts[this.inputIndex] = post
      } catch (e) {
        ElMessage.error(e.message);
      }
    },
    clearEditPost() {
      this.inputPost = null;
      this.$refs.editpost.clear();
    },
    async tapAll() {
      this.posts = await fetchAccounts();
    },
  },
  components: { EditPost },
};
</script>
<style lang="stylus" scoped></style>