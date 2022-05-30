import bs58 from 'bs58'

export class Question {
  constructor(publicKey, accountInfo) {
    this.publicKey = publicKey
    this.authority = accountInfo.authority
    this.timestamp = accountInfo.timestamp
    this.accountType = accountInfo.accountType
    this.authorityAta = accountInfo.authorityAta
    try {
      this.desc = bs58.decode(accountInfo.desc).toString()
    } catch (error) {
      console.log(error)
      this.desc = accountInfo.desc
    }
    try {
      this.option1 = bs58.decode(accountInfo.option1).toString()
    } catch (error) {
      console.log(error)
      this.option1 = accountInfo.option1
    }
    try {
      this.option2 = bs58.decode(accountInfo.option2).toString()
    } catch (error) {
      console.log(error)
      this.option2 = accountInfo.option2
    }
    this.status = accountInfo.status
  }
}

export const statusFilter = status => {
  const buf = Buffer.alloc(1)
  buf.writeInt8(status, 0)
  return {
    memcmp: {
      offset: 8 + 32 + 8 + 4 + 32,
      bytes: bs58.encode(buf),
    }
  }
}