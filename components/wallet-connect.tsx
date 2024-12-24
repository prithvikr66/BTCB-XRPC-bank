"use client";

import { ConnectWallet } from "@thirdweb-dev/react";
import { WalletModalButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";


export default function EVMConnectWallet({
  size,
}: {
  size: "small" | "large";
}) {
  return (
    <div className="w-full flex justify-center items-center bg-[#FC2900] p-[2px] rounded-full">
      <ConnectWallet
        theme="dark"
        btnTitle="Connect Wallet"
        className={`!h-full !w-full !text-white  !bg-[#FC2900]  !font-semibold  !rounded-full !transition-all !duration-300  ${
          size === "small" ? "!text-md !py-3 !px-6" : "text-md !py-3 !px-6"
        } `}
      />
    </div>
  );
}

export const SolanaConnect = ({ size }: { size: "small" | "large" }) => {
  const { publicKey } = useWallet();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#FC2900",
        padding: "2px",
        borderRadius: "9999px",
      }}
    >
      <WalletModalButton
        style={{
          height: "100%",
          width: "100%",
          color: "white",
          backgroundColor: "#FC2900",
          fontWeight: "600",
          borderRadius: "9999px",
          transition: "all 0.3s ease-in-out",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {publicKey
          ? `${publicKey.toString().slice(0, 5)}....${publicKey
              .toString()
              .slice(-5)}}`
          : "Connect Wallet"}
      </WalletModalButton>
    </div>
  );
};
