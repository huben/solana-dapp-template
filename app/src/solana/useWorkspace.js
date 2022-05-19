import { computed } from 'vue'
import { useAnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider, web3 } from '@project-serum/anchor'

import idl from '../config/idl.json';
import cluster from '../config/cluster'

const programId = new PublicKey(idl.metadata.address);

console.log(programId.toString())
const preflightCommitment = 'processed'
// const commitment = 'confirmed'

let workspace = {}
export const useWorkspace = () => workspace

export const initWorkspace = () => {
  const newAccount = web3.Keypair.generate()
  const wallet = useAnchorWallet()
  const connection = new Connection(cluster.uri, preflightCommitment)
  const provider = computed(() => new AnchorProvider(connection, wallet.value, { preflightCommitment }))
  const program = computed(() => new Program(idl, programId, provider.value))
  
  workspace = {
    newAccount,
    wallet,
    connection,
    provider,
    program,
  }
}