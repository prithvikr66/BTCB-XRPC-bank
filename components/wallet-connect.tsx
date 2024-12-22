"use client";

import { ConnectWallet } from "@thirdweb-dev/react";
import { WalletModalButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Client } from "xrpl";
import QRCode from "qrcode";
import { useState, useEffect } from "react";
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

// export const XRPWalletConnect = () => {
//   const [client, setClient] = useState(null);
//   const [walletAddress, setWalletAddress] = useState(null);
//   const [qrCode, setQrCode] = useState("");

//   useEffect(() => {
//     const f = () => {
//       const xrplClient = new Client("wss://s.altnet.rippletest.net:51233");
//       xrplClient.connect().then(() => setClient(xrplClient));
//       return () => xrplClient.disconnect();
//     };
//     f();
//   }, []);

//   const handleConnect = async () => {
//     if (client) {
//       try {
//         const payload = {
//           TransactionType: "SignIn",
//         };

//         if (/Mobi|Android/i.test(navigator.userAgent)) {
//           const deepLink = `https://xumm.app/sign/${payload.uuid}`;
//           window.location.href = deepLink;
//         } else {
//           const qrData = `https://xumm.app/sign/${payload.uuid}`;
//           const qrCodeImage = await QRCode.toDataURL(qrData);
//           setQrCode(qrCodeImage);
//         }
//       } catch (error) {
//         console.error("Error connecting to XUMM Wallet:", error);
//       }
//     }
//   };

//   return (
//     <div>
//       {!walletAddress ? (
//         <button type="button" onClick={handleConnect}>
//           Connect Wallet
//         </button>
//       ) : (
//         <p>Connected Wallet: {walletAddress}</p>
//       )}

//       {qrCode && (
//         <div>
//           <p>Scan this QR code with XUMM Wallet:</p>
//           <img src={qrCode} alt="XUMM Wallet QR Code" />
//         </div>
//       )}
//     </div>
//   );
// };
