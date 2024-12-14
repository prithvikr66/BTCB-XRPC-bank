export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

const uri =
  "mongodb+srv://pkunofficial66:8mSULcJbjsYgCLBC@cluster0.uqoxq.mongodb.net/crypto-transactions";

const transactionSchema = new mongoose.Schema({
  blockchain: { type: String, required: true },
  token: { type: String, required: true },
  amount: { type: Number, required: true },
  promoCode: { type: String, default: "" },
  bitcoinAddress: { type: String, default: "" },
  email: { type: String, required: true },
  telegramId: { type: String, default: "" },
  bitcoinHash: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("Connected to MongoDB via Mongoose");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed");
  }
}

export async function POST(req: any) {
  try {
    const body = await req.json();

    await connectDB();

    const newTransaction = new Transaction({
      blockchain: body.blockchain,
      token: body.token,
      amount: body.amount,
      promoCode: body.promoCode || "",
      bitcoinAddress: body.bitcoinAddress || "",
      email: body.email,
      telegramId: body.telegramId || "",
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
