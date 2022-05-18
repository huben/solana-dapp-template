const fs = require('fs')
const path = require('path')

const { Keypair } = require("@solana/web3.js")


const pkg = JSON.parse(fs.readFileSync('./package.json').toString())
const pkgName = pkg.name.replaceAll('-', '_')

const dir = process.cwd()

const developerKeypairFileName = `deploy/developer-keypair.json`
const developerKeypairFile = path.resolve(dir, developerKeypairFileName)

const programKeypairFileName = `target/deploy/${pkgName}-keypair.json`
const programKeypairFile = path.resolve(dir, programKeypairFileName)

const targetIdl = `target/idl/${pkgName}.json`
const distIdl =  `app/src/config/idl.json`
const distProgramId =  `app/src/config/programId.js`

function readKeypairFile(file) {
  let content = fs.readFileSync(file).toString()
  content = new Uint8Array(JSON.parse(content))
  return Keypair.fromSecretKey(content)
}

module.exports = {
  readKeypairFile,
  pkgName,
  developerKeypairFile,
  programKeypairFile,
  targetIdl,
  distIdl,
  distProgramId,
}