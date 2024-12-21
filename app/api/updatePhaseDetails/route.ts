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

const PHASES = [
  { tokens: 3750000, price: 0.11 },
  { tokens: 3750000, price: 0.12 },
  { tokens: 3750000, price: 0.13 },
  { tokens: 3750000, price: 0.15 },
  { tokens: 3750000, price: 0.16 },
  { tokens: 3750000, price: 0.18 },
  { tokens: 3750000, price: 0.19 },
  { tokens: 3750000, price: 0.21 },
  { tokens: 3750000, price: 0.23 },
  { tokens: 3750000, price: 0.25 },
  { tokens: 3750000, price: 0.28 },
  { tokens: 3750000, price: 0.32 },
];



export async function POST(req: Request) {
  await connectDB();

  try {
    let { tokensPurchased } = await req.json();

    if (!tokensPurchased || typeof tokensPurchased !== "number") {
      return NextResponse.json(
        { message: "Invalid tokensPurchased value" },
        { status: 400 }
      );
    }

    let phaseDetails = await PhaseDetails.findOne();

    if (!phaseDetails) {
      phaseDetails = new PhaseDetails({
        currentPhase: 1,
        tokensSold: 0,
        tokensRemaining: PHASES[0].tokens,
        pricePerToken: PHASES[0].price,
        totalRaised: 0,
      });
      await phaseDetails.save();
    }

    let {
      currentPhase,
      tokensSold,
      tokensRemaining,
      pricePerToken,
      totalRaised,
    } = phaseDetails;

    while (tokensPurchased > 0) {
      if (tokensPurchased <= tokensRemaining) {
        tokensSold += tokensPurchased;
        totalRaised += tokensPurchased * pricePerToken;
        tokensRemaining -= tokensPurchased;
        tokensPurchased = 0;
      } else {
        tokensPurchased -= tokensRemaining;
        tokensSold += tokensRemaining;
        totalRaised += tokensRemaining * pricePerToken;
        currentPhase += 1;

        if (currentPhase > PHASES.length) {
          return NextResponse.json(
            { message: "All tokens sold out!" },
            { status: 400 }
          );
        }

        tokensRemaining = PHASES[currentPhase - 1].tokens;
        pricePerToken = PHASES[currentPhase - 1].price;
      }
    }

    phaseDetails.currentPhase = currentPhase;
    phaseDetails.tokensSold = tokensSold;
    phaseDetails.tokensRemaining = tokensRemaining;
    phaseDetails.pricePerToken = pricePerToken;
    phaseDetails.totalRaised = totalRaised;

    await phaseDetails.save();

    return NextResponse.json(
      { message: "Tokens sold updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating tokens sold:", error.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
