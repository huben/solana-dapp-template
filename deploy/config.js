const clusterConf = {
  local: {
    net: 'localnet',
    uri: 'http://127.0.0.1:8899',
  },
  dev: {
    net: 'Devnet', 
    // uri: 'https://api.devnet.solana.com',
    uri: 'http://127.0.0.1:8899'
  },
  test: {
    net: 'Testnet', 
    uri: 'https://api.testnet.solana.com'
  },
  main: {
    net: 'Mainnet', 
    uri: 'https://api.mainnet-beta.solana.com'
  }
}

const nodeEnv = process.env.NODE_ENV
const clusterConfEnv = clusterConf[nodeEnv]

module.exports = {
  cluster: { ...clusterConfEnv, MAIN_NET: clusterConf.main.net }
}

