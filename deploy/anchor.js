const { spawn } = require('node:child_process')

const { cluster } = require('./config')
const { 
  readKeypairFile,
  developerKeypairFile,
  programKeypairFile,
  pkgName
} = require('./utils')

function deploy() {
  const args = [
    'deploy',
    "--provider.cluster",
    cluster.net,
    "--provider.wallet",
    `${developerKeypairFile}`
  ]
  return anchor(args)
}

function upgrade () {
  const programKeypair = readKeypairFile(programKeypairFile)
  const programId = programKeypair.publicKey.toString()
  console.log(`upgrade program.\n`)
  const args = [
    "upgrade",
    `target/deploy/${pkgName}.so`,
    "--program-id",
    programId,
    "--provider.cluster",
    cluster.net,
    "--provider.wallet",
    `${developerKeypairFile}`
  ]
  return anchor(args)
}

function build() {
  return anchor([ 'build' ])
}

function anchor(args) {
  return new Promise((resolve) => {
    const anchor = spawn('anchor', args)
    anchor.on('spawn', () => {
      console.log(`${anchor.spawnargs.join(' ')}\n`)
    })
    anchor.stdout.on('data', data => {
      console.log(`${data}`);
    });
    anchor.stderr.on('data', data => {
      console.error(`${data}`);
    })
    anchor.on('close', () => {
      resolve()
    })
  })
}

module.exports = {
  build,
  deploy,
  upgrade,
}