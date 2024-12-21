import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FormValues } from "./validations/form";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function saveToDB(data: FormValues, txnHash: string) {
  const response = await fetch("/api/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      transactionHash: txnHash,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit form data to the backend.");
  }
}

export const updatePhaseDetails = async (tokensSold: number) => {
  const response = await fetch("/api/updatePhaseDetails", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tokensPurchased: tokensSold }),
  });

  if (!response.ok) throw new Error("Failed to update tokens sold");
  return response.json();
};

export const fetchPhaseDetails = async () => {
  const response = await fetch("/api/phaseDetails");
  if (!response.ok) throw new Error("Failed to fetch phase details");
  return response.json();
};
