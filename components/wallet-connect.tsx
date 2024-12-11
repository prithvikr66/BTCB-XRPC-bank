"use client";

import { ConnectWallet } from "@thirdweb-dev/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import TronWeb from 'tronweb';

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

// export const TronConnectButton = () => {
//   const [walletAddress, setWalletAddress] = useState<string | null>(null);

//   const connectTronWallet = async () => {
//     try {
//       const address = window.tronWeb.defaultAddress.base58;
//       if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
//         alert("Please install TronLink wallet!");
//         return;
//       }

//       // Request Tron wallet access
//       // const address = window.tronWeb.defaultAddress.base58;

//       if (address) {
//         setWalletAddress(address);
//       } else {
//         alert("Unable to connect to Tron wallet.");
//       }
//     } catch (error) {
//       console.error("Error connecting to Tron wallet:", error);
//       alert("An error occurred while connecting to Tron wallet.");
//     }
//   };

//   return (
//     <div>
//       {walletAddress ? (
//         <button className="bg-green-500 text-white px-4 py-2 rounded">
//           Connected: {walletAddress.substring(0, 6)}...
//           {walletAddress.substring(walletAddress.length - 4)}
//         </button>
//       ) : (
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={connectTronWallet}
//         >
//           Connect Tron Wallet
//         </button>
//       )}
//     </div>
//   );
// };

// export const TronWalletConnect = () => {
//   const [connected, setConnected] = useState(false);
//   const [address, setAddress] = useState("");

//   const fullNode = "https://api.trongrid.io";
//   const solidityNode = "https://api.trongrid.io";
//   const eventServer = "https://api.trongrid.io";

//   const tronWeb = new TronWeb({
//     fullHost: fullNode,
//     headers: { "TRON-PRO-API-KEY": "YOUR_TRON_API_KEY" },
//   });

//   const connectWallet = async () => {
//     try {
//       // Check if TronLink or similar extension is available
//       if (window.tronWeb && window.tronWeb.ready) {
//         const address = window.tronWeb.defaultAddress.base58;
//         setAddress(address);
//         setConnected(true);
//       } else {
//         // Fallback for users without TronLink
//         if (window.tronLink) {
//           const response = await window.tronLink.request({
//             method: "tron_requestAccounts",
//           });

//           if (response.code === 200) {
//             const address = window.tronWeb.defaultAddress.base58;
//             setAddress(address);
//             setConnected(true);
//           } else {
//             alert("Failed to connect wallet");
//           }
//         } else {
//           alert("Please install TronLink extension");
//         }
//       }
//     } catch (error) {
//       console.error("Wallet connection error:", error);
//       alert("Failed to connect wallet");
//     }
//   };

//   const disconnectWallet = () => {
//     setConnected(false);
//     setAddress("");
//   };

//   return (
//     <div className="flex items-center space-x-4">
//       {!connected ? (
//         <button
//           onClick={connectWallet}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//         >
//           Connect Tron Wallet
//         </button>
//       ) : (
//         <div className="flex items-center space-x-2">
//           <span className="text-green-600">
//             Connected: {address.slice(0, 6)}...{address.slice(-4)}
//           </span>
//           <button
//             onClick={disconnectWallet}
//             className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
//           >
//             Disconnect
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };
