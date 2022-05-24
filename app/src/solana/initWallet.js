import SolanaWallets from 'solana-wallets-vue';
import 'solana-wallets-vue/styles.css';
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import { initAnchor } from './useAnchor'

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network: 'devnet' }),
    new TorusWalletAdapter(),
    new SolletWalletAdapter({ network: 'devnet' }),
    new SolletExtensionWalletAdapter({ network: 'devnet' }),
  ],
  autoConnect: false,
}

export default function(app) {
  app.use(SolanaWallets, walletOptions)
  initAnchor()
}