<template lang="pug">
.counter 
  el-card
    template(#header)
      .card-header
        el-row(:gutter="15")
          el-col(:span="10") 
            el-select(
              v-model="mint"
              placeholder="Select Mint" 
              value-key="publicKey"
              )
              el-option(
                v-for="item in mints"
                :key="item.publicKey"
                :label="item.publicKey"
                :value="item"
              )
            el-button(@click="getMints") all mint
          el-col(:span="10") 
            el-input(v-model="inputMintPublicKey")
          el-button(@click="tapGetMint") get mint

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
    div
      el-button(@click="tapInit") new mint
      el-button(@click="tapCreateAccount") NewAccount
      el-button(@click="tapFetchAll") all accounts

  div(style="height: 15px")

  el-table(:data="accounts", stripe, border, style="width: 100%")
    ElTableColumn(type="index" width="50")
    ElTableColumn(prop="publicKey", label="publicKey", width="250")
    ElTableColumn(prop="owner", label="owner", width="250")
    ElTableColumn(prop="amount", label="amount", width="150")
    ElTableColumn(prop="mint", label="mint", width="80")
    ElTableColumn(prop="address", label="address", width="180")
    ElTableColumn(fixed="right", label="Operations", width="300")
      template(#default="scope")
        el-button(size="small", @click="tapMintTo(scope.row, scope.$index, (scope.$index + 1) * 1000)" :disabled="mint.mintAuthority.toString() != scope.row.owner.toString()") mint {{ (scope.$index + 1) * 1000 }}
        el-button(size="small", @click="tapTransfer(scope.row, scope.$index, (scope.$index + 1) * 10)") tranfer {{ (scope.$index + 1) * 10 }}
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
  getMints,
  getOwnedTokenAccounts,
} from "../solana/api/token";


import { isWalletConnected } from "../solana/initWallet";
import { useWallet } from 'solana-wallets-vue';

export default {
  name: "couter-page",
  mixins: [timeFormat],
  props: {},
  setup() {
    const { publicKey } = useWallet();
    return {
      walletPublicKey: publicKey
    }
  },
  data() {
    return {
      
      inputMintPublicKey: 'Bma6cfcXV7qQuTnFCpLwKhBC3aDsfVBFKYfoQ1Bwu9br',
      mint: null,
      mints: [],
      accounts: [],
    };
  },
  async mounted() {
  },
  watch: {
    mint() {
      this.tapFetchAll()
    },
  },
  methods: {
    
    tapGetMint() {
      this.mint = {
        publicKey: new web3.PublicKey(this.inputMintPublicKey)
      }
      this.getMint()
    },
    async getMints() {
      if (!isWalletConnected()) {
        ElMessage.error("plz connect wallet first");
        return;
      }

      this.mints = await getMints()
      console.log(this.mints)
    },
    async getMint() {
      this.mint = await getMintInfo(this.mint.publicKey);
    },
    async getAccounts() {
      const accounts = [
        "HiV76JSFc6DbbbAC48cDkABJVhm6WAMieYv2ainbRiJP",
        "2GJPP3if3cindJoaQQqRbVHQGkLi99AEs3ViBffBHBeb",
        "H8NRLgYfi9UHV1FnBtaA6c5kjXdKFHLBghcHqVepF8z5",
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
      console.log('onchange', this.mint)
      if (!isWalletConnected()) {
        return ElMessage.error('plz connect wallet first')
      }
      if (this.mint) {
        this.accounts = await getOwnedTokenAccounts(this.mint.publicKey);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.card-header > span
  margin-right: 10px
</style>
