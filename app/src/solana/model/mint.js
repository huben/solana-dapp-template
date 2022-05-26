import * as BufferLayout from 'buffer-layout';
import { 
  web3, 
} from "@project-serum/anchor"

export class Mint {
  constructor(publicKey, mintInfo) {
    this.publicKey = publicKey
    this.mintAuthority = mintInfo.mintAuthority 
    this.supply = mintInfo.supply
    this.decimals = mintInfo.decimals
    this.isInitialized = mintInfo.isInitialized
    this.freezeAuthority = mintInfo.freezeAuthority
  }
}

export class AccountInfo {
  constructor(publicKey, accountInfo) {
    this.publicKey = publicKey
    this.address = accountInfo.address
    this.mint = accountInfo.mint
    this.owner = accountInfo.owner
    this.amount = accountInfo.amount
    this.delegate = accountInfo.delegate
    this.delegatedAmount = accountInfo.delegatedAmount
    this.isInitialized = accountInfo.isInitialized
    this.isFrozen = accountInfo.isFrozen
    this.isNative = accountInfo.isNative
    this.rentExemptReserve = accountInfo.rentExemptReserve
    this.closeAuthority = accountInfo.closeAuthority
  }
}

export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
]);

export function parseMintAccountData(data) {
  let { mint, owner, amount } = ACCOUNT_LAYOUT.decode(data);
  return {
    mint: new web3.PublicKey(mint),
    owner: new web3.PublicKey(owner),
    amount,
  };
}