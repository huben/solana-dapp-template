<template lang="pug">
.counter 
  el-card
    template(#header)
      .card-header
        span Mint
        el-form(v-if="mint" label-width="120px")
          <el-form-item label="publicKey">
            <el-input v-model="mint.publicKey" disabled />
          </el-form-item>
          <el-form-item label="mintAuthority">
            <el-input v-model="mint.mintAuthority" disabled />
          </el-form-item>
          <el-form-item label="supply">
            <el-input v-model="mint.supply" disabled />
          </el-form-item>
          <el-form-item label="decimals">
            <el-input v-model="mint.decimals" disabled />
          </el-form-item>
    //- div
    //-   el-button(@click="tapInit") init
    //-   el-button(@click="tapCreateAccount") NewAccount
      //- el-button(@click="tapFetchAll") all

  div(style="height: 15px")

  el-table(:data="accounts", stripe, border, style="width: 100%")
    ElTableColumn(prop="publicKey", label="publicKey", width="250")
    ElTableColumn(prop="owner", label="owner", width="250")
    ElTableColumn(prop="amount", label="amount", width="150")
    ElTableColumn(prop="mint", label="mint", width="80")
    ElTableColumn(prop="address", label="address", width="180")
    ElTableColumn(fixed="right", label="Operations", width="300")
      template(#default="scope")
        el-button(size="small", @click="tapMintTo(scope.row, scope.$index, (scope.$index + 1) * 1000)") mint {{ (scope.$index + 1) * 1000 }}
        el-button(size="small", @click="tapTransfer(scope.row, scope.$index, (scope.$index + 1) * 100)") tranfer {{ (scope.$index + 1) * 100 }}
        el-button(size="small", @click="tapBurn(scope.row, scope.$index, (scope.$index + 1) * 1)") burn {{ (scope.$index + 1) * 1 }}
</template>

<script>
import { ElMessage } from "element-plus";
import { web3 } from "@project-serum/anchor";

import timeFormat from "@/mixins/timeFormat";
import {
  createMint,
  getMintInfo,
  mintTo,
  transfer,
  burn,
  createTokenAccount,
  getAccountInfo,
  getOwnedTokenAccounts,
} from "../solana/api/token";
import { isWalletConnected } from "../solana/initWallet";

export default {
  name: "couter-page",
  mixins: [timeFormat],
  props: {},
  data() {
    return {
      mint: null,
      accounts: [],
    };
  },
  async mounted() {
    this.getMint();
    this.getAccounts();
  },
  methods: {
    async getMint() {
      const mintPublicKey = new web3.PublicKey(
        "Bma6cfcXV7qQuTnFCpLwKhBC3aDsfVBFKYfoQ1Bwu9br"
      );
      this.mint = await getMintInfo(mintPublicKey);
    },
    async getAccounts() {
      const accounts = [
        "F8fX3Qn9DCDBa4yJXCvA9HQ7uEfVtX2PA6Yhsyqv3LZ",
        "8Eu4HMam3xN62zWxe5HFHpnRCJqEfsFNGRBYWPk5NQcG",
        "GoedZxiPbMkc845oQHk7UUQAtBKBGNm58Hufom6UpMqZ",
      ];
      const p = accounts
        .map((key) => {
          return new web3.PublicKey(key);
        })
        .map((publicKey) => {
          return getAccountInfo(publicKey);
        });
      Promise.all(p).then((res) => {
        this.accounts.push(...res);
      });
    },
    async tapInit() {
      if (!isWalletConnected()) {
        ElMessage.error("plz connect wallet first");
        return;
      }
      try {
        this.mint = await createMint();
      } catch (e) {
        console.error(e);
        ElMessage.error(e.message);
      }
    },
    async tapMintTo(tokenAccount, i, amount) {
      if (!isWalletConnected()) {
        return ElMessage.error('plz connect wallet first')
      }
      try {
        const account = await mintTo(this.mint.publicKey, tokenAccount.publicKey, amount);
        this.accounts[i] = account;
        this.getMint();
      } catch (error) {
        ElMessage.error(error.message)
      }
    },
    async tapTransfer(tokenAccount, i, amount) {
      if (!isWalletConnected()) {
        return ElMessage.error('plz connect wallet first')
      }
      try {
        const next = (i + 1) % this.accounts.length
        const nextAccount = this.accounts[next]
        const accounts = await transfer(this.mint.publicKey, tokenAccount.publicKey, nextAccount.publicKey, amount);
        
        this.accounts[i] = accounts[0]
        this.accounts[next] = accounts[1]
        
        this.getMint();
      } catch (error) {
        ElMessage.error(error.message)
      }
    },
    async tapBurn(tokenAccount, i, amount) {
      if (!isWalletConnected()) {
        return ElMessage.error('plz connect wallet first')
      }
      try {
        const account = await burn(this.mint.publicKey, tokenAccount.publicKey, amount);
        this.accounts[i] = account;

        this.getMint();
      } catch (error) {
        ElMessage.error(error.message)
      }
    },
    async tapCreateAccount() {
      try {
        const tokenAccount = await createTokenAccount(this.mint.publicKey);
        this.accounts.push(tokenAccount);
        console.log(this.accounts);
      } catch (e) {
        ElMessage.error(e.message);
      }
    },
    async tapFetchAll() {
      // if (this.mint) {
      await getOwnedTokenAccounts();
      return;
      // }
    },
  },
};
</script>

<style scoped>
</style>
