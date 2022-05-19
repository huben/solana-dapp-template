const fs = require('fs')

const { 
  programKeypairFile,
} = require('./utils')
const { build } = require('./anchor')
const { programId } = require('./solana')

;(async function start() {
  if (!fs.existsSync(programKeypairFile)) {
    await build()
  }
  await programId()
})()

