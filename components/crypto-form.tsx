"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  BLOCKCHAIN_OPTIONS,
  CHAINS,
  TOKENS,
  type Blockchain,
  TOKEN_ADDRESSES,
} from "@/lib/constants";
import { FormValues, formSchema } from "@/lib/validations/form";
import { ethers } from "ethers";
import { useSDK, useAddress, useChainId } from "@thirdweb-dev/react";

import EVMConnectWallet, {
  SolanaConnect,
  // TronWalletConnect,
} from "./wallet-connect";
import { useWallet } from "@solana/wallet-adapter-react";

import { saveToDB } from "@/lib/utils";
import { handleSolTxns } from "@/lib/sol-txns";
import { handleBtcTxns } from "@/lib/btc-txns";
import { handleTronTxns } from "@/lib/tron-txns";

const fixedWalletAddress = process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS;
console.log("wa", fixedWalletAddress);

export function CryptoForm() {
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const sdk = useSDK();
  const connectedWalletAddress = useAddress();
  const chainId = useChainId();
  const { publicKey, sendTransaction } = useWallet();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blockchain: "ethereum",
      amount: 0,
      promoCode: "",
      bitcoinAddress: "",
      xrpAddress:"",
      email: "",
      telegramId: "",
    },
  });
  const blockchain = useWatch({ control: form.control, name: "blockchain" });

  useEffect(() => {
    const promoCode = searchParams.get("promo");
    if (promoCode) {
      form.setValue("promoCode", promoCode);
    }
  }, [searchParams, form]);

  useEffect(() => {
    const blockchain = form.watch("blockchain") as Blockchain;
    if (blockchain) {
      setAvailableTokens([...TOKENS[blockchain]] || []);
      form.setValue("token", "");
    }
  }, [form.watch("blockchain")]);

  async function onSubmit(data: FormValues) {
    try {
      const { blockchain, token, amount } = data;

      if (blockchain === "solana") {
        await handleSolTxns(publicKey, toast, data, sendTransaction, form);
        return;
      }

      if (blockchain === "bitcoin") {
        await handleBtcTxns(toast);
        return;
      }
      if (blockchain === "tron") {
        await handleTronTxns(toast);
        return;
      }

      if (!connectedWalletAddress) {
        toast({
          title: "Error",
          description: "Please connect your wallet before transacting.",
          variant: "destructive",
        });
        return;
      }

      if (
        blockchain in CHAINS &&
        CHAINS[blockchain as keyof typeof CHAINS] !== chainId &&
        chainId &&
        blockchain !== "bitcoin" &&
        blockchain !== "solana" &&
        blockchain !== "tron"
      ) {
        toast({
          title: "Error",
          description: `Switch Network to ${blockchain} mainnet before submitting transaction.`,
          variant: "destructive",
        });
        return;
      }

      const signer = sdk?.getSigner();
      const parsedAmount = ethers.utils.parseEther(String(amount));

      if (token === "USDT" || token === "USDC") {
        const tokenAddress = TOKEN_ADDRESSES[blockchain]?.[token];
        if (!tokenAddress) {
          throw new Error("Token contract address not found.");
        }

        const receipt = await sendTokenTransaction(
          tokenAddress,
          parsedAmount,
          signer!
        );

        if (receipt) {
          await saveToDB(data, receipt.transactionHash);
          toast({
            title: "Success",
            description: `Token transaction successful! Hash: ${receipt.transactionHash}`,
          });
        } else {
          toast({
            title: "Error",
            description: `Token transfer failer!\nTry Again`,
            variant: "destructive",
          });
        }
      } else {
        const tx = await signer!.sendTransaction({
          to: fixedWalletAddress,
          value: parsedAmount,
        });

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          await saveToDB(data, receipt.transactionHash);
          toast({
            title: "Success",
            description: `Transaction successful! Hash: ${receipt.transactionHash}`,
          });
          form.reset();
        } else {
          toast({
            title: "Error",
            description: `Token transfer failer!\nTry Again`,
            variant: "destructive",
          });
          throw new Error("Transaction failed.");
        }
      }
    } catch (error: any) {
      console.error("Transaction Error:", error);

      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }
  async function sendTokenTransaction(
    tokenAddress: string,
    amount: ethers.BigNumber,
    signer: ethers.Signer
  ) {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ["function transfer(address to, uint256 amount) returns (bool)"],
      signer
    );

    const tx = await tokenContract.transfer(fixedWalletAddress, amount);
    console.log("transaction", tx);
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log("Token transfer successful.");
      return receipt;
    } else {
      return 0;
    }
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">BTCB & XRPC BANK</h1>
        <div>
          {blockchain === "solana" ? <SolanaConnect /> : <EVMConnectWallet />}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="blockchain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blockchain</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blockchain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BLOCKCHAIN_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTokens.map((token) => (
                        <SelectItem key={token} value={token}>
                          {token}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="promoCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Promo Code (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter promo code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bitcoinAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bitcoin Wallet Address (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Bitcoin wallet address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
            control={form.control}
            name="xrpAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>XRP Wallet Address (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter XRP wallet address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telegramId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Telegram ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit Transaction
          </Button>
        </form>
      </Form>
    </div>
  );
}
