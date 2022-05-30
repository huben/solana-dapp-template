

### 前置安装
node.js
rust https://kaisery.github.io/trpl-zh-cn/
solana https://docs.solana.com/cli/install-solana-cli-tools
@solana/web3 https://solana-labs.github.io/solana-web3.js/
anchor https://project-serum.github.io/anchor/getting-started/introduction.html

### 启动本地节点
```
solana-test-validator
```

安装依赖
```
yarn install
```

### 查看 programId
```
npm run address
anchor keys list
```
并将 programId 替换掉 /programs/src/lib.rs 中的
```
declare_id!("69NzrJ1PCVGK3PPAt6GWWJMx7qXQ7VVfNW3qoWPd58x");
```

### 发布 program 到本地链上
```
npm run deploy
```

### 启动 app
```
cd app
npm run serve
```