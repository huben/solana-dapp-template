import { web3 } from '@project-serum/anchor'

import { useAnchor } from '../useAnchor'
import { Counter } from '../model/counter'

export const init = async () => {
  const { wallet, program } = useAnchor()

  const newAccount = web3.Keypair.generate()

  await program.value.rpc.init({
    accounts: {
      counterAccount: newAccount.publicKey,
      signer: wallet.value.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [newAccount]
  })
  const counterAccount = await fetchAccount(newAccount.publicKey)
  return new Counter(newAccount.publicKey, counterAccount)
}

export const increment = async (publicKey) => {
  const { program } = useAnchor()
  await program.value.rpc.increment({
    accounts: {
      counterAccount: publicKey
    }
  })
  const counterAccount = await fetchAccount(publicKey)
  return new Counter(publicKey, counterAccount)
}

export const fetchAccount = async (publicKey) => {
  const { program } = useAnchor()
  return await program.value.account.counterAccount.fetch(publicKey)
}

export const fetchAccounts = async () => {
  const { program } = useAnchor()
  const conuters = await program.value.account.counterAccount.all()
  return conuters
      .sort((a, b) => {
        console.log(typeof b.account.timestamp)
        return b.account.timestamp - a.account.timestamp
      })
      .map(({ publicKey, account }) => {
        console.log(account.timestamp.toString())
        return new Counter(publicKey, account)
      })
}