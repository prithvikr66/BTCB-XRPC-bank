"use client";

import { ConnectWallet } from "@thirdweb-dev/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function EVMConnectWallet({
  size,
}: {
  size: "small" | "large";
}) {
  return (
    <div className="w-full flex justify-center items-center gradient-button-bg p-[2px] rounded-full">
      <ConnectWallet
        theme="dark"
        btnTitle="Connect Wallet"
        className={`!h-full !w-full !text-white hover:!text-black !bg-black gradient-button  !font-semibold   !rounded-full !transition-all !duration-300  ${
          size === "small" ? "!text-xs !py-2 !px-2" : "text-md !py-3 !px-6"
        } `}
      />
    </div>
  );
}

export const SolanaConnect = () => {
  const { publicKey } = useWallet();

  return (
    <div className="w-full flex justify-center items-center">
      <WalletMultiButton className="custom-wallet-button">
        {publicKey ? (
          `${publicKey.toString().slice(0, 5)}....${publicKey
            .toString()
            .slice(-5)}`
        ) : (
          <p>Connect Wallet</p>
        )}
      </WalletMultiButton>
    </div>
  );
};
