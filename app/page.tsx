"use client";
import { CryptoForm } from "@/components/crypto-form";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());
  console.log("chain id",ChainId.Mainnet);
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider activeChain={ChainId.Mainnet}>
        <CryptoForm />
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}
