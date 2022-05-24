
import { BN } from '@project-serum/anchor'

export class CounterAccount {
  constructor(authority, timestamp, accountType, count) {
    this.authority = authority
    this.timestamp = timestamp
    this.accountType = accountType
    this.count = count
  }
}

export class Counter {
  constructor(publicKey, counterAccount) {
    this.publicKey = publicKey
    this.authority = counterAccount.authority
    this.timestamp = new BN(counterAccount.timestamp, 'le').toString()
    this.accountType = counterAccount.accountType
    this.count = new BN(counterAccount.count, 'le').toString()
  }
}