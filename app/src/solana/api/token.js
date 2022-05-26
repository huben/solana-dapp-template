import * as serumCmn from "@project-serum/common"
import { web3, BN } from "@project-serum/anchor"
import { TokenInstructions } from "@project-serum/serum"

import { Mint, AccountInfo } from "../model/mint"
import { useAnchor } from "../useAnchor"

export async function getOwnedTokenAccounts() {
  const { connection, wallet } = useAnchor()
  console.log(wallet.value.publicKey)
  console.log(serumCmn)
  const accounts = await serumCmn.token.getOwnedTokenAccounts(connection, new web3.PublicKey(wallet.value.publicKey))
  console.log(accounts)
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
