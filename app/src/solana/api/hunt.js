import { web3, BN } from '@project-serum/anchor'
import { TokenInstructions } from '@project-serum/serum'

import { 
  NATIVE_MINT,
} from "@/lib/spl-token";

import {
  getAtAAccountInfo
} from './sol'
import { useAnchor } from '../useAnchor'
import { Hunt, Player } from '../model/hunt'
import { developerPublicKey } from './developer'

export const all = async (filter = []) => {
  const { program } = useAnchor()
  const hunts = await program.value.account.huntAccount.all(filter)
  return hunts
      .sort((a, b) => {
        return b.account.timestamp - a.account.timestamp
      })
      .map(({ publicKey, account }) => {
        return new Hunt(publicKey, account)
      })
}

export async function createHunt(
    qsAccouts, 
    amount,
  ) {
  const { program, wallet } = useAnchor()
  const ata = await getAtAAccountInfo()
  const newHuntAccount = web3.Keypair.generate()
  console.log(qsAccouts, new BN(amount))
  await program.value.rpc.createHunt(
    qsAccouts,
    new BN(amount),
    {
      accounts: {
        huntAccount: newHuntAccount.publicKey,
        signer: wallet.value.publicKey,
        systemProgram: web3.SystemProgram.programId,

        authority: wallet.value.publicKey,
        mint: NATIVE_MINT,
        from: ata.publicKey,
        to: developerPublicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID
      },
      signers: [ newHuntAccount ]
    }
  );
}

export async function joinHunt(huntAccount) {
  const { program, wallet } = useAnchor()
  const ata = await getAtAAccountInfo()
  const newPlayerAccount = web3.Keypair.generate()
  await program.value.rpc.joinHunt(
    {
      accounts: {
        playerAccount: newPlayerAccount.publicKey,
        huntAccount: huntAccount,
        signer: wallet.value.publicKey,
        systemProgram: web3.SystemProgram.programId,

        authority: wallet.value.publicKey,
        mint: NATIVE_MINT,
        from: ata.publicKey,
        to: developerPublicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID
      },
      signers: [ newPlayerAccount ]
    }
  );
  return await fetchPlayer(newPlayerAccount.publicKey)
}

export async function fetchHunt(publicKey) {
  const { program } = useAnchor()
  return new Hunt(publicKey, await program.value.account.huntAccount.fetch(publicKey))
}

export async function fetchPlayer(publicKey) {
  const { program } = useAnchor()
  return new Player(publicKey, await program.value.account.huntPlayerAccount.fetch(publicKey))
}

export async function approveHunt() {
}