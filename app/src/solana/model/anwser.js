import bs58 from 'bs58'

export class Anwser {
  constructor(publicKey, accountInfo) {
    this.publicKey = publicKey
    this.authority = accountInfo.authority
    this.timestamp = accountInfo.timestamp
    this.accountType = accountInfo.accountType
    this.question = accountInfo.question
    this.ata = accountInfo.ata
    this.status = accountInfo.status
    this.anwser = accountInfo.anwser
  }
}

export const statusFilter = status => {
  const buf = Buffer.alloc(1)
  buf.writeInt8(status, 0)
  return {
    memcmp: {
      offset: 8 + 32 + 8 + 4 + 32 + 32,
      bytes: bs58.encode(buf),
    }
  }
}