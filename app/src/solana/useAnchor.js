import { computed } from 'vue'
import { useAnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { Program, AnchorProvider } from '@project-serum/anchor'

import idl from '../config/idl.json';
import cluster from '../config/cluster'

const programId = new PublicKey(idl.metadata.address);

// const preflightCommitment = 'processed'
const commitment = 'confirmed'

let anchor = {}

export const useAnchor = () => anchor

export const initAnchor = () => {

  const wallet = useAnchorWallet()
  const connection = new Connection(cluster.uri, commitment)
  const provider = computed(() => new AnchorProvider(connection, wallet.value, { commitment }))
  const program = computed(() => new Program(idl, programId, provider.value))
  
  anchor = {
    wallet,
    connection,
    provider,
    program,
  }
}