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

const convertToCSV = (phaseData: IPhaseDetails[], transactionData: any) => {
  // Headers for phase details
  let csv = "Phase Details\n";
  csv +=
    "Current Phase,Tokens Sold,Tokens Remaining,Price Per Token,Total Raised\n";

  // Phase details data
  phaseData.forEach((phase) => {
    csv += `${phase.currentPhase},${phase.tokensSold},${phase.tokensRemaining},${phase.pricePerToken},${phase.totalRaised}\n`;
  });

  // Add a blank line between sections
  csv += "\nTransaction Details\n";

  // Headers for transactions
  csv +=
    "Blockchain,Token,Amount,Promo Code,Bitcoin Address,Email,Telegram ID,Transaction Hash,Created At\n";

  // Transaction data
  transactionData.forEach((transaction: any) => {
    csv += `${transaction.blockchain},${transaction.token},${transaction.amount},${transaction.promoCode},${transaction.bitcoinAddress},${transaction.email},${transaction.telegramId},${transaction.txnHash},${transaction.createdAt}\n`;
  });

  return csv;
};

export async function GET() {
  try {
    await connectDB();

    const phaseDetails = await PhaseDetails.find({});
    const transactions = await Transaction.find({});

    const csvData = convertToCSV(phaseDetails, transactions);

    const headers = {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="export.csv"',
    };

    return new NextResponse(csvData, { headers });
  } catch (error) {
    console.error("Error generating CSV:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate CSV" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
