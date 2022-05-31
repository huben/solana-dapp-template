import { web3 } from '@project-serum/anchor'
import { TokenInstructions } from '@project-serum/serum'
// import bs58 from 'bs58'
import { 
  NATIVE_MINT,
} from "@/lib/spl-token";
import {
  getAtAAccountInfo
} from './sol'
import { useAnchor } from '../useAnchor'
import { pagination, totalNum, allPubkeys } from './pagination'
import { Question, statusFilter } from '../model/question'

export const fetchQuestionTotalNum = async (filters = []) => {
  const { program } = useAnchor()
  return await totalNum(program.value.account.questionAccount, [ ...filters ])
}
export async function getQuestions(page, filters = []) {
  const { program } = useAnchor()
  const questionAccounts = await pagination(program.value.account.questionAccount, page, 10, filters)
  return questionAccounts
      .map(({ publicKey, account }) => {
        return new Question(publicKey, account)
      })
}

export async function createQuestion(
    desc, 
    option1, 
    option2, 
    right
  ) {
  const { program, wallet } = useAnchor()
  
  // desc = bs58.encode(Buffer.from(desc))
  // option1 = bs58.encode(Buffer.from(option1))
  // option2 = bs58.encode(Buffer.from(option2))

  console.log(
    desc, 
    option1, 
    option2, 
    right)

  const newQuestionAccount = web3.Keypair.generate()
  const ata = await getAtAAccountInfo()
  await program.value.rpc.newQuestion(
    desc, 
    option1, 
    option2, 
    right, 
    {
      accounts: {
        questionAccount: newQuestionAccount.publicKey,
        authorityAtaAccount: ata.publicKey,
        signer: wallet.value.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [ newQuestionAccount ]
    }
  );
}

export async function fetchQuestion(publicKey) {
  const { program } = useAnchor()
  return new Question(publicKey, await program.value.account.questionAccount.fetch(publicKey))
}

export async function approveQuestion(questionAccount, authorityAtaAccount) {

  const { program, wallet } = useAnchor()
  const ata = await getAtAAccountInfo()

  await program.value.rpc.approveQuestion({
    accounts: {
      questionAccount: questionAccount,
      authority: wallet.value.publicKey,
      mint: NATIVE_MINT,
      from: ata.publicKey,
      to: authorityAtaAccount,
      tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID
    }
  })
  return await fetchQuestion(questionAccount)
}

export async function rejectQuestion(questionAccount) {
  const { program } = useAnchor()

  await program.value.rpc.rejectQuestion({
    accounts: {
      questionAccount: questionAccount,
    }
  })
  return await fetchQuestion(questionAccount)
}

export async function randomQuestion() {
  const filters = [ statusFilter(1) ]
  const { program } = useAnchor()
  const questions = await allPubkeys(program.value.account.questionAccount, filters)
  return questions[randomNum(0, questions.length)].pubkey
}

export async function randomQsAccounts(num) {
  const filters = [ statusFilter(1) ]
  const { program } = useAnchor()
  const questions = await allPubkeys(program.value.account.questionAccount, filters)
  const qsAccounts = [];
  for(let i = 0; i < num; i ++) {
    qsAccounts.push(questions[randomNum(0, questions.length)].pubkey)
  }
  return qsAccounts
}

// [min, max)
function randomNum(min, max){ 
  return parseInt(Math.random()*(max - min) + min, 10); 
}