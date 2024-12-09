import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { TOKEN_ADDRESSES } from "./constants";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { saveToDB } from "./utils";
import { FormValues } from "./validations/form";
import { UseFormReturn } from "react-hook-form";

const fixedSolWalletAddress = process.env.NEXT_PUBLIC_SOLANA_WALLET_ADDRESS;
export const handleSolTxns = async (
  publicKey: any,
  toast: any,
  data: any,
  sendTransaction: any,
  form: UseFormReturn<FormValues>
) => {
  try {
    const { blockchain, token, amount } = data;

    if (!publicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet before transacting.",
        variant: "destructive",
      });
      return;
    }
    const recipientPubkey = new PublicKey(fixedSolWalletAddress!);
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!);
    if (token === "USDT" || token === "USDC") {
      const lamports = Number(amount) * 10 ** 6;

      const tokenMint = new PublicKey(TOKEN_ADDRESSES[blockchain]?.[token]);
      const senderTokenAddress = await getAssociatedTokenAddress(
        tokenMint,
        publicKey
      );
      const recipientTokenAddress = await getAssociatedTokenAddress(
        tokenMint,
        recipientPubkey
      );
      const recipientAccountInfo = await connection.getAccountInfo(
        recipientTokenAddress
      );

      if (!recipientAccountInfo) {
        toast({
          title: "Error",
          description: "Recipient's token account does not exist.",
          variant: "destructive",
        });
        form.reset();
        return;
      }

      const transaction = new Transaction().add(
        createTransferInstruction(
          senderTokenAddress,
          recipientTokenAddress,
          publicKey,
          lamports
        )
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");
      await saveToDB(data, signature);
      toast({
        title: "Success",
        description: `Solana transaction successful! Signature: ${signature}`,
      });
      return;
    }
    const lamports = Number(amount) * 10 ** 9;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubkey,
        lamports,
      })
    );

    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, "confirmed");
    await saveToDB(data, signature);
    toast({
      title: "Success",
      description: `Solana transaction successful! Signature: ${signature}`,
    });
    form.reset();
  } catch (error: any) {
    console.error("Solana transaction error:", error);

    toast({
      title: "Error",
      description: `${error.message}`,
      variant: "destructive",
    });
  }
  return;
};
