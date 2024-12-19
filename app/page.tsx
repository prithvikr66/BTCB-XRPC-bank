"use client";
import { CryptoForm } from "@/components/crypto-form";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SolanaWalletProvider } from "@/hooks/wallet-provider";
import { Suspense } from "react";
export default function Home() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <SolanaWalletProvider>
        <ThirdwebProvider activeChain={ChainId.Mainnet}>
          <Suspense fallback={<div>Loading...</div>}>
           <div className=" bg-black">
           <iframe
              src="https://my.spline.design/prismcoin-0656bc3077c7482cdc06669443305d2c/"
              // frameborder="0"
              width="100%"
              height="100%"
            ></iframe>
            <div className=" min-h-screen w-full bg-black ">
              <CryptoForm />
            </div>
           </div>
          </Suspense>
        </ThirdwebProvider>
      </SolanaWalletProvider>
    </QueryClientProvider>
  );
}
