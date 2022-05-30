const cluster = {
  local: {
    net: 'localnet', 
    uri: 'http://localhost:8899',
    idl: '9T1cysJ2PTFvVTcE9XCZdJ2cALrQg8yCckmkHXtpksU',
  },
  dev: {
    net: 'Devnet', 
    // uri: 'https://api.devnet.solana.com'，
    uri: 'http://172.17.1.34:8899/',
    idl: '6WKYm1iPHEUGotxhDbr9YwG9Byu94wtUupewjESV9KGk',
  },
  test: {
    net: 'Testnet', 
    uri: 'https://api.testnet.solana.com'
  },
  main: {
    net: 'Mainnet', 
    uri: 'https://api.mainnet-beta.solana.com',
  }
}

const nodeEnv = process.env.VUE_APP_CLUSTER

export default cluster[nodeEnv]