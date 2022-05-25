import { web3 } from '@project-serum/anchor'
import { useAnchor } from '../useAnchor'
import { Post } from '../model/post'
import { pagination, totalNum } from './pagination'

export const createPost = async (topic, desc) => {
  const { wallet, program } = useAnchor()

  if (!wallet.value) {
    return Promise.reject(new Error('plz connect wallet first'))
  }

  const newPostAccount = web3.Keypair.generate()

  await program.value.rpc.createPost(topic, desc, {
    accounts: {
      postAccount: newPostAccount.publicKey,
      signer: wallet.value.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [ newPostAccount ]
  })
  const postAccount = await fetchAccount(newPostAccount.publicKey)
  console.log(postAccount)
  return new Post(newPostAccount.publicKey, postAccount)
}

export const updatePost = async (publicKey, topic, desc) => {
  const { wallet, program } = useAnchor()
  await program.value.rpc.updatePost(topic, desc, {
    accounts: {
      postAccount: publicKey,
      authority: wallet.value.publicKey,
    },
  })
  if (!wallet.value) {
    return Promise.reject(new Error('plz connect wallet first'))
  }

  const postAccount = await fetchAccount(publicKey)
  console.log(postAccount)
  return new Post(publicKey, postAccount)
}

export const deletePost = async (publicKey) => {
  const { wallet, program } = useAnchor()
  if (!wallet.value) {
    return Promise.reject(new Error('plz connect wallet first'))
  }
  await program.value.rpc.deletePost({
    accounts: {
      postAccount: publicKey,
      authority: wallet.value.publicKey,
    },
  })
}

export const fetchAccount = async (publicKey) => {
  const { program } = useAnchor()
  return await program.value.account.postAccount.fetch(publicKey)
}

export const fetchAccounts = async () => {
  const { program } = useAnchor()
  console.log(program.value.account.postAccount)
  const posts = await program.value.account.postAccount.all()
  return posts
      .sort((a, b) => {
        return b.account.timestamp - a.account.timestamp
      })
      .map(({ publicKey, account }) => {
        return new Post(publicKey, account)
      })
}

export const fetchTotalNum = async () => {
  const { program } = useAnchor()
  return await totalNum(program.value.account.postAccount)
}
 
export const fetchAccountsByPage = async (page) => {
  const { program } = useAnchor()
  const postAccounts = await pagination(program.value.account.postAccount, page)
  return postAccounts
      .map(({ publicKey, account }) => {
        return new Post(publicKey, account)
      })
}