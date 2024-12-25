export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/utils";

const transactionSchema = new mongoose.Schema({
  blockchain: { type: String, required: true },
  token: { type: String, required: true },
  amount: { type: Number, required: true },
  promoCode: { type: String, default: "" },
  bitcoinAddress: { type: String, default: "" },
  email: { type: String, required: true },
  telegramId: { type: String, default: "" },
  txnHash: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export async function POST(req: any) {
  try {
    const body = await req.json();
    console.log("body", body);
    await connectDB();

    const newTransaction = new Transaction({
      blockchain: body.blockchain,
      token: body.token,
      amount: body.amount,
      promoCode: body.promoCode || "",
      bitcoinAddress: body.bitcoinAddress || "",
      email: body.email,
      telegramId: body.telegramId || "",
      txnHash: body.transactionHash || "",
    });

    const savedTransaction = await newTransaction.save();

    return NextResponse.json({ success: true, id: savedTransaction._id });
  } catch (error) {
    console.error("Failed to submit form:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
