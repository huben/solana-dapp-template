const { spawn } = require('node:child_process')
const fs = require('fs')

const { Keypair, Connection, LAMPORTS_PER_SOL } = require("@solana/web3.js")

const { programKeypairFile, distProgramId } = require('./utils')
const { cluster } = require('./config')

function programId() {
  return new Promise(() => {
    const solana = spawn('solana', [
      'address',
      '-k',
      programKeypairFile
    ])
    solana.on('spawn', () => {
      console.log(`${solana.spawnargs.join(' ')} \n`)
    })
    solana.stdout.on('data', data => {
      console.log(`${data.toString().trim()}`);
      fs.writeFileSync(distProgramId, `export default '${data.toString().trim()}'`)
    });
    solana.stderr.on('data', data => {
      console.error(`solana address:\n${data}`);
    })
  })
}

async function airdrop(publicKey, num) {
  const connection = new Connection(cluster.uri, "confirmed")
  console.log(`airdrop sol ${publicKey} ${num}`)
  console.log(`solana balance ${publicKey}`)
  let signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL * num)
  await connection.confirmTransaction(signature)
}

module.exports = {
  programId,
  airdrop,
}