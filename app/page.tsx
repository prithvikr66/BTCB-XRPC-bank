"use client";
import { CryptoForm } from "@/components/crypto-form";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SolanaWalletProvider } from "@/hooks/wallet-provider";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { mainnet } from "@xrpl-walletconnect/core";
// @ts-ignore
// import { ClientContextProvider } from "@xrpl-walletconnect/react  // <div className="w-full flex justify-center items-center">
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
    // </div>";
export default function Home() {
  const [queryClient] = useState(() => new QueryClient());
  const [chain, setChain] = useState("ethereum");
  return (
    <QueryClientProvider client={queryClient}>
      <SolanaWalletProvider>
        <ThirdwebProvider activeChain={ChainId.Mainnet} clientId="f6cd769c7e501df9c6f817c061795107f6cd769c7e501df9c6f817c061795107">
          {/* <ClientContextProvider defaultChains={[mainnet.id]}> */}
            <Suspense fallback={<div>Loading...</div>}>
              <div className=" bg-black">
                <iframe
                  src="https://my.spline.design/prismcoin-0656bc3077c7482cdc06669443305d2c/"
                  width="100%"
                  height="100%"
                ></iframe>
                <Navbar chain={chain} />
                <div className=" min-h-screen w-full bg-black   ">
                  <CryptoForm setChain={setChain} />
                </div>
                <Footer />
              </div>
            </Suspense>
          {/* </ClientContextProvider> */}
        </ThirdwebProvider>
      </SolanaWalletProvider>
    </QueryClientProvider>
  );
}
