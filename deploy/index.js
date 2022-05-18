const fs = require('fs')

const { Keypair, Connection } = require("@solana/web3.js")

const { cluster } = require('./config')
const { 
  readKeypairFile,
  pkgName,
  developerKeypairFile,
  programKeypairFile,
  targetIdl,
  distIdl,
} = require('./utils')
const { build, deploy, upgrade } = require('./anchor')
const { airdrop } = require('./solana')

;(async function run() {
  
  await build()
  if (!fs.existsSync(developerKeypairFile)) {
    let developerKeypair = new Keypair()
    fs.writeFileSync(developerKeypairFile, `[${Buffer.from(developerKeypair.secretKey.toString())}]`)
    
    if (cluster.net !== cluster.MAIN_NET) {
      await airdrop(developerKeypair.publicKey, 5)
    }
  } 
  await upgrade()
  fs.copyFileSync(targetIdl, distIdl)
})()