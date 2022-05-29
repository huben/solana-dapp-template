import { web3 } from '@project-serum/anchor'
import { TokenInstructions } from '@project-serum/serum'

import { 
  NATIVE_MINT,
} from "@/lib/spl-token";
import {
  getAtAAccountInfo
} from './sol'
import { useAnchor } from '../useAnchor'
import { pagination, totalNum, allPubkeys } from './pagination'
import { Anwser } from '../model/anwser'
import { statusFilter } from '../model/question'

export const fetchAnwserTotalNum = async (filters = []) => {
  const { program } = useAnchor()
  return await totalNum(program.value.account.anwserAccount, [ ...filters ])
}
export async function getAnwsers(page, filters = []) {
  const { program } = useAnchor()
  const anwserAccounts = await pagination(program.value.account.anwserAccount, page, 10, filters)
  return anwserAccounts
      .map(({ publicKey, account }) => {
        return new Anwser(publicKey, account)
      })
}

export const all = async (filter = []) => {
  const { program } = useAnchor()
  console.log(program.value.account.anwserAccount)
  const answers = await program.value.account.anwserAccount.all(filter)
  return answers
      .sort((a, b) => {
        return b.account.timestamp - a.account.timestamp
      })
      .map(({ publicKey, account }) => {
        return new Anwser(publicKey, account)
      })
}

export async function createAnwser(
    question, 
    anwser
  ) {
  const { program, wallet } = useAnchor()
  const ata = await getAtAAccountInfo()
  const newAnwserAccount = web3.Keypair.generate()
  await program.value.rpc.newAnwser(
    {
      accounts: {
        anwserAccount: newAnwserAccount.publicKey,
        questionAccount: question,
        ata: ata.publicKey,
        signer: wallet.value.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [ newAnwserAccount ]
    }
  );
  await enableAnwser(newAnwserAccount.publicKey, question, ata.publicKey, anwser)
}

export async function enableAnwser(
    anwserAccount,
    question, 
    ata,
    anwser
  ) {
  const { program, wallet } = useAnchor()
  const developer = new web3.PublicKey('Edw6vhTzBRJ9VMVjTm9rXPkDqaptC3XMMSGovYxuuR7T')
  await program.value.rpc.enableAnwser(
    anwser,
    {
      accounts: {
        anwserAccount: anwserAccount,
        questionAccount: question,
        authority: wallet.value.publicKey,
        mint: NATIVE_MINT,
        from: ata,
        to: developer,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID
      },
    }
  );
}

export async function fetchAnwser(publicKey) {
  const { program } = useAnchor()
  return new Anwser(publicKey, await program.value.account.anwserAccount.fetch(publicKey))
}

export async function approveAnwser(anwserAccount, anwserAta) {
  const { program, wallet } = useAnchor()
  const ata = await getAtAAccountInfo()

  await program.value.rpc.approveAnwser({
    accounts: {
      anwserAccount: anwserAccount,
      authority: wallet.value.publicKey,
      mint: NATIVE_MINT,
      from: ata.publicKey,
      to: anwserAta,
      tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID
    }
  })
  return await fetchAnwser(anwserAccount)
}

export async function randomQuestion() {
  const filters = [ statusFilter(1) ]
  const { program } = useAnchor()
  const questions = await allPubkeys(program.value.account.questionAccount, filters)
  return questions[randomNum(0, questions.length)].pubkey
}

// [min, max)
function randomNum(min, max){ 
  return parseInt(Math.random()*(max - min) + min, 10); 
}