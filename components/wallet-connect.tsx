"use client";

import { ConnectWallet } from "@thirdweb-dev/react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { FC, useMemo } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
// type Props = {
//   readonly children: React.ReactNode;
// };

export default function EVMConnectWallet() {
  return (
    <div className=" w-full border-white">
      <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
    </div>
  );
}
export const SolanaWalletProvider = ({ children }:{children:any}) => {
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

