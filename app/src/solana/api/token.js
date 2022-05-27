import * as serumCmn from "@project-serum/common"
import { 
  web3, 
  BN 
} from "@project-serum/anchor"
import { TokenInstructions } from "@project-serum/serum"
// import * as bs58 from 'bs58';

import { Mint, AccountInfo, parseMintAccountData } from "../model/mint"
import { useAnchor } from "../useAnchor"

export async function getMints() {
  const { connection, wallet } = useAnchor()
  console.log(wallet.value.publicKey)
  const res = await connection.getProgramAccounts(TokenInstructions.TOKEN_PROGRAM_ID, {
    filters: [
      {
        memcmp: {
          bytes: wallet.value.publicKey.toBase58(),
          offset: 32,
        }
      },
      {
        dataSize: 165
      }
    ]
  });

  const mintPublicKeySet = new Set()
  res.map( ({ pubkey, account }) => {
      console.log(pubkey.toString(), account.owner.toString())
      let { mint, owner, amount } = parseMintAccountData(account.data)
      console.log(mint.toString(), owner.toString(), amount)
      return mint.toString()
  }).forEach(mint => {
    mintPublicKeySet.add(mint)
  })
  
  console.log(mintPublicKeySet)

  return Promise.all(
    [...mintPublicKeySet].map(mint => {
      return (async () => {
        return await getMintInfo(new web3.PublicKey(mint))
      })()
    })
  ) 
}

export async function getOwnedTokenAccounts(mintAccount) {
  const { connection, wallet } = useAnchor()
  console.log(mintAccount)
  const res = await connection.getTokenAccountsByOwner(wallet.value.publicKey, {
    mint: mintAccount
  });
  console.log(res.value)
  return res.value.map(({ pubkey, account: { data } }) => {
    return new AccountInfo(pubkey, serumCmn.parseTokenAccount(data))
  })
}

export async function createMint() {
  const { connection, wallet, commitment } = useAnchor()
  const provider = new serumCmn.Provider(connection, wallet.value, commitment)
  const publicKey = await serumCmn.createMint(provider, wallet.value.publicKey, 0)
  return await getMintInfo(publicKey)
} 

export async function getMintInfo(mintAccountPublicKey) {
  const { connection, wallet, commitment } = useAnchor()
  const provider = new serumCmn.Provider(connection, wallet.value, commitment)
  const  mintInfo = await serumCmn.getMintInfo(provider, mintAccountPublicKey)
  return new Mint(mintAccountPublicKey, mintInfo)
}

export async function createTokenAccount(mintAccountPublicKey) {
  const { connection, wallet, commitment } = useAnchor()
  const provider = new serumCmn.Provider(connection, wallet.value, commitment)
  const publicKey = await serumCmn.createTokenAccount(provider, mintAccountPublicKey, wallet.value.publicKey)
  return await getAccountInfo(publicKey)
}

export async function getAccountInfo(tokenAccountPublicKey) {
  const { connection, wallet, commitment } = useAnchor()
  const provider = new serumCmn.Provider(connection, wallet.value, commitment)
  const accountInfo =  await serumCmn.getTokenAccount(provider, tokenAccountPublicKey)
  return new AccountInfo(tokenAccountPublicKey, accountInfo)
}

export async function mintTo(mintAccountPublicKey, to, amount) {
  const { program, wallet } = useAnchor()

  await program.value.rpc.tokenMintTo(new BN(amount), {
    accounts: {
      authority: wallet.value.publicKey,
      mint: mintAccountPublicKey,
      to,
      tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID
    }
  })
  return await getAccountInfo(to)
}

export async function transfer(mintAccountPublicKey, from, to, amount) {
  const { program, wallet } = useAnchor()

  await program.value.rpc.tokenTransfer(new BN(amount), {
    accounts: {
      authority: wallet.value.publicKey,
      mint: mintAccountPublicKey,
      from,
      to,
      tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID
    }
  })
  return await Promise.all([from, to].map(publicKey=> {
    return getAccountInfo(publicKey)
  }))
}

export async function burn(mintAccountPublicKey, from, amount) {
  const { program, wallet } = useAnchor()

  await program.value.rpc.tokenBurn(new BN(amount), {
    accounts: {
      authority: wallet.value.publicKey,
      mint: mintAccountPublicKey,
      from,
      tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID
    }
  })
  return await getAccountInfo(from)
}
