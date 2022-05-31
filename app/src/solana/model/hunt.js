
export class Hunt {
  constructor(publicKey, accountInfo) {
    this.publicKey = publicKey
    this.qsAccouts = accountInfo.qsAccouts
    this.timestamp = accountInfo.timestamp
    this.builder = accountInfo.builder
    this.parter = accountInfo.parter
    this.winer = accountInfo.winer
    this.amount = accountInfo.amount // < 128
    this.status = accountInfo.status // 0 已创建 1 匹配完成 2 已完成 3 已发奖
  }

  setPlayer(player) {
    if (player.authority == this.builder) {
      this.builderPlayer = player
    } else {
      this.parterPlayer = player
    }
  }
}

export class Player {
  constructor(publicKey, accountInfo) {
    this.publicKey = publicKey

    this.authority = accountInfo.authority
    this.timestamp = accountInfo.timestamp
    this.ata = accountInfo.ata
    this.start = accountInfo.start
    this.count = accountInfo.count
    this.success_count = accountInfo.success_count
    this.error_count = accountInfo.error_count
  }
}
