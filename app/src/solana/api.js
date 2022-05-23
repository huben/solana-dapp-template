import { useWorkspace } from './useWorkspace'
import { web3 } from '@project-serum/anchor'

export const init = () => {
  const { newAccount, wallet, program } = useWorkspace()
  console.log(program.value.programId.toString())
  return program.value.rpc.init({
    accounts: {
      counterAccount: newAccount.publicKey,
      signer: wallet.value.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [newAccount]
  })
}

export const fetchAccount = async () => {
  const { newAccount, program } = useWorkspace()
  return program.value.account.counterAccount.fetch(newAccount.publicKey)
}

export const increment = async () => {
  const { newAccount, program } = useWorkspace()
  return program.value.rpc.increment({
    accounts: {
      counterAccount: newAccount.publicKey
    }
  })
}

// export default class AnchorClient {
	
// 	airDrop = async (publicKey, lamports = 500000000) => {
// 		// CLI: solana airdrop --url devnet 1 <recipientaddress>
// 		const signature = await this.connection.requestAirdrop(
// 			new anchor.web3.PublicKey(publicKey),
// 			lamports
// 		);
// 		await this.connection.confirmTransaction(signature);
// 		return await this.getBalance(publicKey);
// 	};

// 	getBalance = async (publicKey) => {
// 		return await this.connection.getBalance(new anchor.web3.PublicKey(publicKey));
// 	};
// }