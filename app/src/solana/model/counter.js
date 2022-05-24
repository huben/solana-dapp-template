
export class CounterAccount {
  constructor(count) {
    this.count = count
  }
}

export class Counter {
  constructor(publicKey, counterAccount) {
    this.publicKey = publicKey
    this.count = counterAccount.count
  }
}