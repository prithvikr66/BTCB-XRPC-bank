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
  PhaseDetailsResponse,
  TOKEN,
} from "@/lib/constants";
import { FormValues, formSchema } from "@/lib/validations/form";
import { ethers } from "ethers";
import { useSDK, useAddress, useChainId } from "@thirdweb-dev/react";
import EVMConnectWallet, { SolanaConnect } from "./wallet-connect";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchPhaseDetails, saveToDB, updatePhaseDetails } from "@/lib/utils";
import { handleSolTxns } from "@/lib/sol-txns";
import { handleBtcTxns } from "@/lib/btc-txns";
import { createHash } from "crypto";
import Dropdown from "./dropdown";
import axios from "axios";
import { Loader } from "lucide-react";
import Logo from "../app/assets/BTCBLogo.png";
import Image from "next/image";
import TokenPriceDisplay from "./token-sold";
const fixedWalletAddress = process.env.NEXT_PUBLIC_ETH_WALLET_ADDRESS;
const BTC_DEPOSIT_ADDRESS = process.env.NEXT_PUBLIC_BTC_DEPOSIT_ADDRESS;
const dummyPromoCodes = [
  "BTCB2025",
  "BTCB",
  "BITCOINBANK",
  "BTCB100X",
  "BTCBPUMP",
  "BTCBANK",
  "BTC1000X",
  "1000X",
  "PRESALE",
];
const hashedPromoCodes = dummyPromoCodes.map((code) =>
  createHash("sha256").update(code).digest("hex")
);
export function CryptoForm({ setChain }: { setChain: any }) {
  const [availableTokens, setAvailableTokens] = useState<TOKEN[]>([]);
  const [submittingTransaction, setSubmittingTransaction] = useState(false);
  const [btcbAmount, setBtcbAmount] = useState(0);
  const [phaseDetails, setPhaseDetails] = useState<PhaseDetailsResponse>();
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
      token: "",
      amount: 0,
      promoCode: "",
      bitcoinAddress: "",
      xrpAddress: "",
      email: "",
      telegramId: "",
      bitcoinHash: "",
    },
  });
  const getWalletType = (provider: any) => {
    if (provider?.isMetaMask) return "metamask";
    if (provider?.isTrust) return "trust";
    return "unknown";
  };
  const blockchain = useWatch({ control: form.control, name: "blockchain" });
  const token = useWatch({ control: form.control, name: "token" });
  const amount = useWatch({ control: form.control, name: "amount" });
  useEffect(() => {
    if (phaseDetails) {
      if (token === "USDT" || token === "USDC") {
        const totalPrice = 1 * amount;
        const tokens = Number(totalPrice / phaseDetails?.pricePerToken);
        setBtcbAmount(Number(tokens.toFixed(4)));
      } else {
        axios
          .get(
            `https://api.binance.com/api/v3/ticker/price?symbol=${token}USDT`
          )
          .then((response) => {
            const price = parseFloat(response.data.price);
            const totalPrice = price * amount;
            const tokens = Number(totalPrice / phaseDetails?.pricePerToken);
            setBtcbAmount(Number(tokens.toFixed(4)));
          })
          .catch((error) => console.error("Error fetching price:", error));
      }
    }
  }, [token, amount]);
  setChain(blockchain);

  useEffect(() => {
    const fetchDetails = async () => {
      const phaseDetails = await fetchPhaseDetails();
      setPhaseDetails(phaseDetails);
      console.log("phase details", phaseDetails);
    };

    fetchDetails();
  }, []);

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
        setSubmittingTransaction(true);
        await handleSolTxns(publicKey!, toast, data, sendTransaction, form);
        await updatePhaseDetails(btcbAmount);
        form.reset();
        setSubmittingTransaction(false);
        setBtcbAmount(0);

        return;
      }

      if (blockchain === "bitcoin") {
        setSubmittingTransaction(true);
        await handleBtcTxns(toast, data);
        await updatePhaseDetails(btcbAmount);
        form.reset();
        setSubmittingTransaction(false);
        setBtcbAmount(0);

        return;
      }
      setSubmittingTransaction(true);

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

      // const signer = sdk?.getSigner();
      // const parsedAmount = ethers.utils.parseEther(String(amount));
      const signer = sdk?.getSigner();
      const provider = await signer?.provider;
      const walletType = getWalletType(provider);
      const parsedAmount = ethers.utils.parseEther(String(amount));

      if (token === "USDT" || token === "USDC") {
        const tokenAddress = TOKEN_ADDRESSES[blockchain]?.[token];
        if (!tokenAddress) {
          throw new Error("Token contract address not found.");
        }

        const receipt = await sendTokenTransaction(
          tokenAddress,
          parsedAmount,
          signer!,
          walletType,
          fixedWalletAddress!
        );

        if (receipt) {
          await saveToDB(data, receipt.transactionHash);
          toast({
            title: "Success",
            description: `Token transaction successful! Hash: ${receipt.transactionHash}`,
          });
          await updatePhaseDetails(btcbAmount);
          form.reset();
          setSubmittingTransaction(false);
        } else {
          toast({
            title: "Error",
            description: `Token transfer failer!\nTry Again`,
            variant: "destructive",
          });
          setSubmittingTransaction(false);
        }
      } else {
        const transaction = {
          to: fixedWalletAddress,
          value: parsedAmount,
          data: "0x",
          // @ts-ignore
          chainId: provider?.network.chainId,
        };

        const tx = await signer!.sendTransaction(transaction);
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          await saveToDB(data, receipt.transactionHash);
          toast({
            title: "Success",
            description: `Transaction successful! Hash: ${receipt.transactionHash}`,
          });
          await updatePhaseDetails(btcbAmount);
          form.reset();
        } else {
          throw new Error("Transaction failed.");
        }
      }
    } catch (error: any) {
      console.error("Transaction Error:", error);
      setSubmittingTransaction(false);

      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSubmittingTransaction(false);
      setBtcbAmount(0);
    }
  }
  async function sendTokenTransaction(
    tokenAddress: string,
    amount: ethers.BigNumber,
    signer: ethers.Signer,
    walletType: string,
    recipientAddress: string
  ) {
    const abi = [
      "function transfer(address to, uint256 amount) returns (bool)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)",
    ];

    const tokenContract = new ethers.Contract(tokenAddress, abi, signer);

    // If using Trust Wallet, we need to explicitly format the transaction
    if (walletType === "trust") {
      const data = tokenContract.interface.encodeFunctionData("transfer", [
        recipientAddress,
        amount,
      ]);

      const tx = await signer.sendTransaction({
        to: tokenAddress,
        data: data,
        chainId: (await signer.provider?.getNetwork())?.chainId,
      });

      const receipt = await tx.wait();
      return receipt.status === 1 ? receipt : null;
    } else {
      // Regular handling for other wallets
      const tx = await tokenContract.transfer(recipientAddress, amount);
      const receipt = await tx.wait();
      return receipt.status === 1 ? receipt : null;
    }
  }

  return (
    <div className="container max-w-3xl mx-auto p-6 space-y-8 ">
      <div className=" ">
        <h1 className="text-4xl lg:text-5xl font-black  text-center text-glow">
          BTC Bank Presale
        </h1>
      </div>
      <div className=" my-[20px]">
        <h2 className=" text-3xl lg:text-4xl font-black  text-center text-glow">
          Phase {phaseDetails ? phaseDetails.currentPhase : 0}
        </h2>
        <TokenPriceDisplay
          pricePerToken={phaseDetails?.pricePerToken}
          totalRaised={phaseDetails?.totalRaised}
          tokensRemaining={phaseDetails?.tokensRemaining}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          <div className=" flex flex-col lg:flex-row justify-between mt-[-30px]">
            <div className="mt-[10px] lg:mt-[20px] w-full lg:w-[48%]">
              <Dropdown
                blockchain={true}
                label="Select Blockchain"
                selectedOption={BLOCKCHAIN_OPTIONS.find(
                  (e) => e.value === blockchain
                )}
                options={BLOCKCHAIN_OPTIONS}
                onChange={(value: any) => form.setValue("blockchain", value)}
              />
            </div>
            <div className="mt-[20px] lg:mt-[20px] w-full lg:w-[48%]">
              <Dropdown
                blockchain={false}
                label="Select Token"
                selectedOption={availableTokens.find((e) => e.symbol === token)}
                options={availableTokens}
                onChange={(value: any) => form.setValue("token", value)}
              />
            </div>
          </div>
          <div className=" flex flex-col lg:items-center lg:flex-row justify-between mt-[20px] lg:mt-[30px]">
            <div className=" lg:w-[48%]">
              <div
                className="flex flex-col rounded-[20px] bg-[#3d3d3d] gradient-input p-[2px] "
                tabIndex={0}
              >
                <input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  step="any"
                  className="w-full h-full px-4 py-2 rounded-[20px] text-white bg-black focus:outline-none transition-shadow"
                  {...form.register("amount", { valueAsNumber: true })}
                />
              </div>
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500 mt-[10px] ml-[10px}">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>
            <div className=" text-[30px] opacity-50 flex items-center justify-center mt-[3px] lg:mt-0">
              =
            </div>
            <div className=" lg:w-[48%] mt-[3px] lg:mt-0">
              <div
                className="flex flex-col rounded-[20px] bg-[#3d3d3d] gradient-input p-[2px] "
                tabIndex={0}
              >
                <div className="w-full h-full px-4 py-2 rounded-[20px] flex items-center gap-[10px] md:gap-[10px] text-white bg-black focus:outline-none transition-shadow">
                  <div className=" flex items-center justify-center rounded-full h-[25px] w-[25px]">
                    <Image src={Logo} alt="" className=" w-full h-full" />
                  </div>
                  {btcbAmount ? btcbAmount : 0} BTCB
                </div>
              </div>
            </div>
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

          {blockchain === "bitcoin" ? (
            <>
              <div className="mt-[20px] lg:mt-[30px]">
                <p className=" ml-[10px]">Bitcoin Deposit Address</p>
                <div
                  className="flex flex-col space-y-2 rounded-[20px] bg-[#3d3d3d] gradient-input p-[2px] mt-[10px] lg:mt-[20px] "
                  tabIndex={0}
                >
                  <input
                    disabled={true}
                    type="text"
                    placeholder={BTC_DEPOSIT_ADDRESS}
                    className="w-full h-full px-4 py-2 bg-black rounded-[20px] text-white focus:outline-none transition-shadow"
                  />
                </div>
              </div>
              <div className="mt-[20px] lg:mt-[30px]">
                <div
                  className="flex flex-col space-y-2 rounded-[20px] bg-[#3d3d3d] gradient-input p-[2px] mt-[10px] lg:mt-[20px]"
                  tabIndex={0}
                >
                  <input
                    id="bitcoinHash"
                    type="text"
                    placeholder="Enter Transaction Hash"
                    className="w-full h-full px-4 py-2 bg-black rounded-[20px] text-white focus:outline-none transition-shadow"
                    {...form.register("bitcoinHash")}
                  />
                </div>
                {form.formState.errors.bitcoinHash && (
                  <p className="text-sm text-red-500 mt-[10px] ml-[10px]">
                    {form.formState.errors.bitcoinHash.message}
                  </p>
                )}
              </div>
            </>
          ) : (
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
          )}
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
            {blockchain === "solana" ? (
              publicKey ? (
                <SubmitButton submittingTransaction={submittingTransaction} />
              ) : (
                <SolanaConnect size="large" />
              )
            ) : blockchain === "bitcoin" ? (
              <SubmitButton submittingTransaction={submittingTransaction} />
            ) : connectedWalletAddress ? (
              <SubmitButton submittingTransaction={submittingTransaction} />
            ) : (
              <EVMConnectWallet size="large" />
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

const SubmitButton = ({
  submittingTransaction,
}: {
  submittingTransaction: any;
}) => {
  return (
    <div className=" w-full bg-[#FC2900] p-[2px] rounded-full">
      <Button
        type="submit"
        className="w-full h-full py-3 rounded-full text-md lg:text-lg bf-[#FC2900] transition-all duration-300"
      >
        {submittingTransaction ? <Loader speed={1} /> : "Submit Transaction"}
      </Button>
    </div>
  );
};
