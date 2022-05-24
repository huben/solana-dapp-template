
export class Post {
  constructor(publicKey, postAccount) {
    this.publicKey = publicKey
    this.authority = postAccount.authority
    this.timestamp = postAccount.timestamp.toString()
    this.accountType = postAccount.accountType
    this.topic = postAccount.topic
    this.desc = postAccount.desc
  }
}