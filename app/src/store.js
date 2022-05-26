import { createStore } from 'vuex'
import { useWallet } from 'solana-wallets-vue';

import { useAnchor } from '@/solana/useAnchor';

export default createStore({
  state() {
    return {
      balance: null
    }
  },
  getters: {
    balance: (state) => {
      return state.balance
    }
  },
  mutations: {
    balance(state, payload) {
      state.balance = payload
    }
  },
  actions: {
    async refreshBalance({ commit }) {
      const { wallet, connected } = useWallet()
      const { connection } = useAnchor()
      if (connected) {
        let balance = await connection.getBalance(wallet.value.publicKey);
        commit('balance', balance)
      }
    }
  }
})