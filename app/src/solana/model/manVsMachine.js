
export class ManVsMachine {
  constructor(publicKey, accountInfo) {
    this.publicKey = publicKey
    this.authority = accountInfo.authority
    this.timestamp = accountInfo.timestamp
    this.ata = accountInfo.ata
    this.count = accountInfo.count
    this.successCount = accountInfo.successCount
    this.errorCount = accountInfo.errorCount
    this.status = accountInfo.status
  }
}