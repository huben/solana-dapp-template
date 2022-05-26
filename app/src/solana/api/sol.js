import { web3, BN } from "@project-serum/anchor"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

import { useAnchor } from "../useAnchor"

export async function airdrop(amount) {
  const { connection, wallet } = useAnchor()
  let signature = await connection.requestAirdrop(wallet.value.publicKey, LAMPORTS_PER_SOL * amount)
  return await connection.confirmTransaction(signature)
}

export async function transfer(publicKeyString, amount) {
  console.log(publicKeyString)
  const { program, wallet } = useAnchor()
  await program.value.rpc.transferSol(new BN(amount), {
    accounts: {
      authority: wallet.value.publicKey,
      from: wallet.value.publicKey,
      to: new web3.PublicKey(publicKeyString),
      systemProgram: web3.SystemProgram.programId,
    }
  })
}