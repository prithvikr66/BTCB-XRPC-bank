import { NextResponse } from "next/server";
import { Parser } from "json2csv";
import mongoose, { Schema } from "mongoose";
import { connectDB } from "@/lib/utils";

export interface IPhaseDetails extends Document {
  currentPhase: number;
  tokensSold: number;
  tokensRemaining: number;
  pricePerToken: number;
  totalRaised: number;
}

const phaseSchema = new Schema<IPhaseDetails>({
  currentPhase: { type: Number, required: true },
  tokensSold: { type: Number, required: true },
  tokensRemaining: { type: Number, required: true },
  pricePerToken: { type: Number, required: true },
  totalRaised: { type: Number, required: true },
});

const PhaseDetails =
  mongoose.models.PhaseDetails ||
  mongoose.model<IPhaseDetails>("PhaseDetails", phaseSchema);

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

export async function GET() {
  try {
    await connectDB();

    const phaseDetails = await PhaseDetails.find({});
    const transactions = await Transaction.find({});

    const combinedData = [
      ...phaseDetails.map((phase:any) => ({ type: "User", ...phase.toObject() })),
      ...transactions.map((transactions) => ({
        type: "Product",
        ...transactions.toObject(),
      })),
    ];

    // Convert data to CSV
    const fields = Object.keys(combinedData[0] || {});
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(combinedData);

    // Return the CSV file as a response
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=data.csv",
      },
    });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return NextResponse.json(
      { error: "Failed to export CSV" },
      { status: 500 }
    );
  }
}
