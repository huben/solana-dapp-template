

### 前置安装
+ node.js

  检查安装 `node --version`

+ rust https://kaisery.github.io/trpl-zh-cn/

  检查安装 `rustc -V  `  和  `cargo -V`

+ solana-CLI https://docs.solana.com/cli/install-solana-cli-tools 

  检查安装 `solana --version`

+ anchor https://project-serum.github.io/anchor/getting-started/introduction.html 

  检查安装 `anchor --version`

### 启动本地节点

```sh
npm install --save @solana/web3.js

cargo build-bpf

solana-test-validator
```

### 查看 programId

```

# Windows and Linux 
npm run address

# Mac
cargo install --git https://github.com/project-serum/anchor --tag v0.24.2 anchor-cli --locked

anchor keys list
```
并将 programId 替换掉 /programs/src/lib.rs 中的
```rs
declare_id!("HesXTDtSzQpnBTJQeFGEBKcigNszXkLTGvqfW2EvPtbG");
```

### 发布 program 到本地链上

```sh
cd deploy
npm i -S

# 修改网络
solana config set --url localhost

# 空投货币
solana airdrop 10000 HesXTDtSzQpnBTJQeFGEBKcigNszXkLTGvqfW2EvPtbG

npm run deploy
```

### 启动 app

```sh
cd app
npm i -S
npm run serve
```

