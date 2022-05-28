import bs58 from 'bs58'

export class Question {
  constructor(publicKey, accountInfo) {
    this.publicKey = publicKey
    this.authority = accountInfo.authority
    this.timestamp = accountInfo.timestamp
    this.accountType = accountInfo.accountType
    this.authorityAta = accountInfo.authorityAta
    this.desc = accountInfo.desc
    this.option1 = accountInfo.option1
    this.option2 = accountInfo.option2
    this.status = accountInfo.status
  }
}

export const statusFilter = status => {
  const buf = Buffer.alloc(1)
  buf.writeInt8(status, 0)
  console.log(status, buf, bs58.encode(buf))
  return {
    memcmp: {
      offset: 8 + 32 + 8 + 4 + 32,
      bytes: bs58.encode(buf),
    }
  }
}