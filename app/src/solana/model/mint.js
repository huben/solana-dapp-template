
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