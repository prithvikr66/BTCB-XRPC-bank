"use client";

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