import { connectDB } from "@/lib/utils";
import mongoose, { Schema, Document } from "mongoose";
import { NextResponse } from "next/server";

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

export async function GET(req: Request) {
  await connectDB();

  try {
    const phaseDetails = await PhaseDetails.findOne();
    if (!phaseDetails) {
      return NextResponse.json({
        currentPhase: 1,
        tokensSold: 0,
        tokensRemaining: 3750000,
        pricePerToken: 0.11,
        totalRaised: 0,
      });
    }

    const {
      currentPhase,
      pricePerToken,
      tokensSold,
      totalRaised,
      tokensRemaining,
    } = phaseDetails;

    return NextResponse.json(
      { currentPhase, pricePerToken, tokensSold, totalRaised, tokensRemaining },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching phase details:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
