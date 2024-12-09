"use client";

import { ConnectWallet } from "@thirdweb-dev/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export default function EVMConnectWallet() {
  return (
    <div className=" w-full border-white">
      <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
    </div>
  );
}

export const SolanaConnect = () => {
  const { publicKey } = useWallet();

  return (
    <WalletMultiButton>
      {publicKey ? (
        `${publicKey.toString().slice(0, 5)}....${publicKey
          .toString()
          .slice(-5)}`
      ) : (
        <p>Conenct Wallet</p>
      )}
    </WalletMultiButton>
  );
};

export const TronConnectButton = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectTronWallet = async () => {
    try {
      // Ensure TronLink is installed
      if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
        alert("Please install TronLink wallet!");
        return;
      }

      // Request Tron wallet access
      const address = window.tronWeb.defaultAddress.base58;

      if (address) {
        setWalletAddress(address);
      } else {
        alert("Unable to connect to Tron wallet.");
      }
    } catch (error) {
      console.error("Error connecting to Tron wallet:", error);
      alert("An error occurred while connecting to Tron wallet.");
    }
  };

  return (
    <div>
      {walletAddress ? (
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Connected: {walletAddress.substring(0, 6)}...
          {walletAddress.substring(walletAddress.length - 4)}
        </button>
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={connectTronWallet}
        >
          Connect Tron Wallet
        </button>
      )}
    </div>
  );
};
