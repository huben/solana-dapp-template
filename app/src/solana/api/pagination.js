import { BN } from '@project-serum/anchor'

import { useAnchor } from '../useAnchor'

/**
 * 
 * @param {*} account program.value.account.postAccount
 * @param {*} page 
 */
export async function pagination(account, page, size = 10, filters = []) {
  const pubkeys = await getPubkeys(account, page, size, filters)
  const pageAccounts = await account.fetchMultiple(pubkeys)
  return pageAccounts.map((account, i) => {
    return {
      publicKey: pubkeys[i],
      account,
    }
  })
}

export async function totalNum(account, filters) {
  const { program, connection } = useAnchor()

  const discriminatorFilter = {
    memcmp: account.coder.accounts.memcmp(account._idlAccount.name)
  } 

  const allAccounts = await connection.getProgramAccounts(program.value.programId, {
    filters: [ discriminatorFilter, ...filters ],
    dataSlice: {
      offset: 0,
      length: 0,
    }
  })
  console.log(allAccounts.length)
  return allAccounts.length
}

async function getPubkeys(account, page, size, filters = []) {
  const { program, connection } = useAnchor()

  const discriminatorFilter = {
    memcmp: account.coder.accounts.memcmp(account._idlAccount.name)
  } 

  const allPubkeyWithTs = await connection.getProgramAccounts(program.value.programId, {
    filters: [ discriminatorFilter, ...filters ],
    dataSlice: {
      offset: 8 + 32, // LENGTH_DISCRIMINATOR + LENGTH_PUBLIC_KEY
      length: 8,  // LENGTH_TIMESTAMP
    }
  })

  // solana account
  const sortPubkeys = allPubkeyWithTs
    .map(({ pubkey, account }) => { 
      const timestamp = new BN(account.data, 'le').toString()
      return { pubkey: pubkey.toString(), timestamp }
    }).sort((a, b) => {
      return b.timestamp - a.timestamp
    }).map(({ pubkey }) => {
      return pubkey
    }) 
  let pageEnd = page * size
  const end = pageEnd > sortPubkeys.length ? sortPubkeys.length : pageEnd
  return sortPubkeys.slice((page - 1) * size, end)
}