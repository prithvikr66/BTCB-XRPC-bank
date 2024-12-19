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
    <div className="w-full flex justify-center items-center gradient-button-bg p-[2px] rounded-full">
      <ConnectWallet
        theme="dark"
        btnTitle="Connect Wallet"
        className={`!h-full !w-full !text-white hover:!text-black !bg-black gradient-button  !font-semibold   !rounded-full !transition-all !duration-300  ${
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
        background: `conic-gradient(
      from 180deg at 50% 50%,
          #ff98e2,
          #ffc876 35.77deg,
          #79fff7 153.75deg,
          #9f53ff 258.75deg,
          #ff98e2 360deg
        )`,
        padding: "2px",
        borderRadius: "9999px",
      }}
    >
      <WalletModalButton
        style={{
          height: "100%",
          width: "100%",
          color: "white",
          backgroundColor: "black",
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

    // <div className="w-full flex justify-center items-center">
    //   <WalletMultiButton className="gradient-button-bg flex items-center justify-center p-[2px] rounded-full transition-all duration-300">
    //     {publicKey ? (
    //       <span className="text-white font-semibold">
    //         {`${publicKey.toString().slice(0, 5)}....${publicKey
    //           .toString()
    //           .slice(-5)}`}
    //       </span>
    //     ) : (
    //       <p className="text-white font-semibold">Connect Wallet</p>
    //     )}
    //   </WalletMultiButton>
    // </div>
  );
};
