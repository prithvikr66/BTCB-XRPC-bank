"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import EVMConnectWallet, { SolanaConnect } from "./wallet-connect";
import { useWallet } from "@solana/wallet-adapter-react";
import { saveToDB } from "@/lib/utils";
import { handleSolTxns } from "@/lib/sol-txns";
import { handleBtcTxns } from "@/lib/btc-txns";
import { createHash } from "crypto";
import Dropdown from "./dropdown";
import Image from "next/image";
import Logo from "../app/assets/BTCBLogo.png";
import Link from "next/link";
const fixedWalletAddress = process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS;
const dummyPromoCodes = [
  "PROMO10",
  "PROMO20",
  "PROMO30",
  "PROMO40",
  "PROMO50",
  "PROMO60",
  "PROMO70",
  "PROMO80",
  "PROMO90",
  "PROMO100",
];
const hashedPromoCodes = dummyPromoCodes.map((code) =>
  createHash("sha256").update(code).digest("hex")
);
export function CryptoForm({ setChain }: { setChain: any }) {
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
      xrpAddress: "",
      email: "",
      telegramId: "",
      bitcoinHash: "",
    },
  });
  const blockchain = useWatch({ control: form.control, name: "blockchain" });
  setChain(blockchain);
  useEffect(() => {
    const promoCode = searchParams.get("promo_code");
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
      const { promoCode } = data;

      if (promoCode) {
        const hashedInputPromo = createHash("sha256")
          .update(promoCode!)
          .digest("hex");
        if (!hashedPromoCodes.includes(hashedInputPromo)) {
          form.setError("promoCode", { message: "Invalid promo code!" });

          return;
        }
      }
      const { blockchain, token, amount } = data;

      if (blockchain === "solana") {
        await handleSolTxns(publicKey, toast, data, sendTransaction, form);
        form.reset();
        return;
      }

      if (blockchain === "bitcoin") {
        await handleBtcTxns(toast, data);
        form.reset();

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
      <div className=" ">
        <h1 className="text-4xl lg:text-5xl font-black gradient-text  text-center">
          BTC Bank Presale
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="mt-[10px] lg:mt-[20px]">
              <Dropdown
                blockchain={true}
                label="Select Blockchain"
                options={BLOCKCHAIN_OPTIONS}
                onChange={(value: any) => form.setValue("blockchain", value)}
              />
            </div>
            <div className="mt-[20px] lg:mt-[30px]">
              <Dropdown
                blockchain={false}
                label="Select Token"
                options={availableTokens}
                onChange={(value: any) => form.setValue("token", value)}
              />
            </div>
          </div>

          <div className="mt-[20px] lg:mt-[30px]">
            <div
              className="flex flex-col rounded-[20px] bg-[#3d3d3d] gradient-input p-[2px] mt-[10px] lg:mt-[20px]"
              tabIndex={0}
            >
              <input
                id="amount"
                type="number"
                placeholder="Enter amount"
                className="w-full h-full px-4 py-2 rounded-[20px] text-white bg-black focus:outline-none transition-shadow"
              />
            </div>
            {form.formState.errors.amount && (
              <p className="text-sm text-red-500 mt-[10px] ml-[10px}">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>
          <div className="mt-[20px] lg:mt-[30px]">
            <div
              className="flex flex-col space-y-2 rounded-[20px] bg-[#3d3d3d] gradient-input p-[2px] mt-[10px] lg:mt-[20px]"
              tabIndex={0}
            >
              <input
                id="promoCode"
                type="text"
                placeholder="Enter promo code (optional)"
                className="w-full h-full px-4 py-2 bg-black rounded-[20px] text-white focus:outline-none transition-shadow"
                {...form.register("promoCode")}
              />
            </div>
            {form.formState.errors.promoCode && (
              <p className="text-sm text-red-500 mt-[10px] ml-[10px}">
                {form.formState.errors.promoCode.message}
              </p>
            )}
          </div>

          <div className="mt-[20px] lg:mt-[30px]">
            <div
              className="flex flex-col space-y-2 rounded-[20px] bg-[#3d3d3d] gradient-input p-[2px] mt-[10px] lg:mt-[20px]"
              tabIndex={0}
            >
              <input
                id="bitcoinAddress"
                type="text"
                placeholder="Enter Bitcoin Address (optional)"
                className="w-full h-full px-4 py-2 bg-black rounded-[20px] text-white focus:outline-none transition-shadow"
                {...form.register("bitcoinAddress")}
              />
            </div>
            {form.formState.errors.bitcoinAddress && (
              <p className="text-sm text-red-500 mt-[10px] ml-[10px]">
                {form.formState.errors.bitcoinAddress.message}
              </p>
            )}
          </div>
          <div className="mt-[20px] lg:mt-[30px]">
            <div
              className="flex flex-col space-y-2 rounded-[20px] bg-[#3d3d3d] gradient-input p-[2px] mt-[10px] lg:mt-[20px]"
              tabIndex={0}
            >
              <input
                id="xrpAddress"
                type="text"
                placeholder="Enter XRP Address (optional)"
                className="w-full h-full px-4 py-2 bg-black rounded-[20px] text-white focus:outline-none transition-shadow"
                {...form.register("xrpAddress")}
              />
            </div>
            {form.formState.errors.xrpAddress && (
              <p className="text-sm text-red-500 mt-[10px] ml-[10px]">
                {form.formState.errors.xrpAddress.message}
              </p>
            )}
          </div>
          <div className="mt-[20px] lg:mt-[30px]">
            <div
              className="flex flex-col space-y-2 rounded-[20px] bg-[#3d3d3d] gradient-input p-[2px] mt-[10px] lg:mt-[20px]"
              tabIndex={0}
            >
              <input
                id="email"
                type="text"
                placeholder="Enter Email Address"
                className="w-full h-full px-4 py-2 bg-black rounded-[20px] text-white focus:outline-none transition-shadow"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 mt-[10px] ml-[10px]">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="mt-[20px] lg:mt-[30px]">
            <div
              className="flex flex-col space-y-2 rounded-[20px] bg-[#3d3d3d] gradient-input p-[2px] mt-[10px] lg:mt-[20px]"
              tabIndex={0}
            >
              <input
                id="telegramId"
                type="text"
                placeholder="Enter Telegram ID (optional)"
                className="w-full h-full px-4 py-2 bg-black rounded-[20px] text-white focus:outline-none transition-shadow"
                {...form.register("telegramId")}
              />
            </div>
            {form.formState.errors.telegramId && (
              <p className="text-sm text-red-500 mt-[10px] ml-[10px]">
                {form.formState.errors.telegramId.message}
              </p>
            )}
          </div>
          <div className="mt-[20px] lg:mt-[30px] w-[60%] lg:w-[50%] mx-auto">
            <SubmitButton />
            {/* <EVMConnectWallet size="large" /> */}
            {/* {blockchain === "solana" ? (
              publicKey ? null : (
                <SolanaConnect />
              )
            ) : blockchain ===
              "bitcoin" ? null : connectedWalletAddress ? null : (
              <EVMConnectWallet />
            )} */}
          </div>
          <div className=" mt-[20px] lg:mt-[30px] w-[60%] lg:w-[50%] mx-auto">
            <Link href={"/contact"} className=" ">
              <div className="    gradient-button-bg p-[2px] rounded-full">
                <Button
                  type="button"
                  className="w-full h-full py-3 rounded-full text-md md:text-md lg:text-lg gradient-button transition-all duration-300"
                >
                  Contact us
                </Button>
              </div>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}

const SubmitButton = () => {
  return (
    <div className=" w-full  gradient-button-bg p-[2px] rounded-full">
      <Button
        type="submit"
        className="w-full h-full py-3 rounded-full text-md lg:text-lg gradient-button transition-all duration-300"
      >
        Submit Transaction
      </Button>
    </div>
  );
};
