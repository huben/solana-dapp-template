const cluster = {
  local: {
    net: 'localnet', 
    uri: 'http://localhost:8899'
  },
  dev: {
    net: 'Devnet', 
    uri: 'https://api.devnet.solana.com'
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

const nodeEnv = process.env.VUE_APP_CLUSTER

export default cluster[nodeEnv]