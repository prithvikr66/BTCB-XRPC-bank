"use client";
import { CryptoForm } from "@/components/crypto-form";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());
  const [selectedChain, setSelectedChain] = useState<string>();
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider activeChain={ChainId.Mainnet}>
        <div className=" h-screen w-full flex items-center justify-center">
          <CryptoForm />
        </div>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
