"use client";

import { ConnectWallet } from "@thirdweb-dev/react";

export default function ConnectWalletButton() {
  return (
    <div className=" w-full border-white">
      <ConnectWallet
        theme="dark" 
        btnTitle="Connect Wallet"
      />
    </div>
  );
}
