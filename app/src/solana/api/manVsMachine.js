import { web3 } from '@project-serum/anchor'
import { TokenInstructions } from '@project-serum/serum'

import { 
  NATIVE_MINT,
} from "@/lib/spl-token";
import {
  getAtAAccountInfo
} from './sol'
import { useAnchor } from '../useAnchor'
import { ManVsMachine } from '../model/manVsMachine'
import { developerPublicKey } from './developer'

export const all = async (filter = []) => {
  const { program } = useAnchor()
  const manVsMachines = await program.value.account.manVsMachineAccount.all(filter)
  return manVsMachines
      .sort((a, b) => {
        return b.account.timestamp - a.account.timestamp
      })
      .map(({ publicKey, account }) => {
        return new ManVsMachine(publicKey, account)
      })
}

export async function createManVsMachine(count) {
  const { program, wallet } = useAnchor()
  const ata = await getAtAAccountInfo()
  const newManVsMachineAccount = web3.Keypair.generate()

  await program.value.rpc.newManVsMachine(
    count,
    {
      accounts: {
        manVsMachineAccount: newManVsMachineAccount.publicKey,
        ata: ata.publicKey,
        signer: wallet.value.publicKey,
        systemProgram: web3.SystemProgram.programId,

        authority: wallet.value.publicKey,
        mint: NATIVE_MINT,
        from: ata.publicKey,
        to: developerPublicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID
      },
      signers: [ newManVsMachineAccount ]
    }
  );
  return await fetchManVsMachine(newManVsMachineAccount.publicKey)
}

export async function anwserManVsMachine(
    manVsMachineAccount,
    question, 
    anwser
  ) {
  const { program, wallet } = useAnchor()
  await program.value.rpc.anwserManVsMachine(
    anwser,
    {
      accounts: {
        manVsMachineAccount: manVsMachineAccount,
        questionAccount: question,
        authority: wallet.value.publicKey,
        signer: wallet.value.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
    }
  );
}

export async function fetchManVsMachine(publicKey) {
  const { program } = useAnchor()
  return new ManVsMachine(publicKey, await program.value.account.manVsMachineAccount.fetch(publicKey))
}

export async function approveManVsMachine(manVsMachineAccount, manVsMachineAta) {
  const { program, wallet } = useAnchor()
  const ata = await getAtAAccountInfo()

  await program.value.rpc.approveManVsMachine({
    accounts: {
      manVsMachineAccount: manVsMachineAccount,
      authority: wallet.value.publicKey,
      mint: NATIVE_MINT,
      from: ata.publicKey,
      to: manVsMachineAta,
      tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID
    }
  })
  return await fetchManVsMachine(manVsMachineAccount)
}