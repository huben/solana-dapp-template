import { web3, BN } from "@project-serum/anchor"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { TokenInstructions } from "@project-serum/serum"
// not esm
// import { 
//   NATIVE_MINT,
//   getAssociatedTokenAddress,
//   createSyncNativeInstruction,
// } from "@solana/spl-token";
import { 
  NATIVE_MINT,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  createCloseAccountInstruction,
} from "@/lib/spl-token";
import { getAccountInfo } from './token'
import { useAnchor } from "../useAnchor"

// sol start //
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

// wrapped sol start //
export async function wrappedSOL(amount) {
  const { wallet, provider } = useAnchor()

  const ataAccount = await getAtAAccountInfo()
  
  // Transfer SOL to associated token account and use SyncNative to update wrapped SOL balance
  const solTransferTransaction = new web3.Transaction()
    .add(
        web3.SystemProgram.transfer({
          fromPubkey: wallet.value.publicKey,
          toPubkey: ataAccount.publicKey,
          lamports: amount * LAMPORTS_PER_SOL
        }),
        createSyncNativeInstruction(
          ataAccount.publicKey,
          provider.value.programId
      )
    )
  
  await provider.value.sendAndConfirm(solTransferTransaction);
}

export async function unwrapSOL() {
  const { wallet, provider } = useAnchor()
  const ata = await getAtA()
  console.log(wallet.value.publicKey)
  // await closeAccount(
  //   connection, 
  //   wallet.value.publicKey,     // Signer
  //   ata,              // PublicKey
  //   wallet.value.publicKey, // PublicKey
  //   wallet.value.publicKey, // Signer | PublicKey
  //   [], 
  //   undefined, 
  //   provider.value.programId);

  const tx = new web3.Transaction();
  tx.add(
    createCloseAccountInstruction(
      ata, // to be closed token account
      wallet.value.publicKey, // rent's destination
      wallet.value.publicKey, // token account authority
      [], // multisig
      TokenInstructions.TOKEN_PROGRAM_ID, // fixed
    )
  );

  await provider.value.sendAndConfirm(tx);
}

export async function getAtA() {
  const { wallet } = useAnchor()
  return await getAssociatedTokenAddress(
    NATIVE_MINT,
    wallet.value.publicKey
  )
}
export async function getAtAAccountInfo() {
  const { wallet, provider } = useAnchor()

  const ata = await getAtA()
  try {
    return await getAccountInfo(ata)
  } catch (error) {
    const ataTransaction = new web3.Transaction()
      .add(
        createAssociatedTokenAccountInstruction(
          wallet.value.publicKey,
          ata,
          wallet.value.publicKey,
          NATIVE_MINT
        )
      );
    await provider.value.sendAndConfirm(ataTransaction);
    return await getAccountInfo(ata)
  }
}
