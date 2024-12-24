import * as z from "zod";

const bitcoinAddressRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/; 
const bitcoinHashRegex = /^[A-Fa-f0-9]{64}$/; 

export const formSchema = z
  .object({
    blockchain: z.string({
      required_error: "Please select a blockchain",
    }),
    token: z.string({
      required_error: "Please select a token",
    }),
    amount: z
      .number({
        required_error: "Amount is required",
      })
      .positive("Amount must be positive"),
    promoCode: z.string().optional(),
    bitcoinAddress: z
      .string()
      .regex(bitcoinAddressRegex, "Invalid Bitcoin address")
      .optional(),
    xrpAddress: z.string().optional(),
    bitcoinHash: z
      .string({
        required_error: "Please enter the transaction hash",
      })
      .regex(bitcoinHashRegex, "Invalid Bitcoin transaction hash"),
    email: z.string().email("Invalid email address").optional(),
    telegramId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.bitcoinAddress && !data.email) {
        return false;
      }
      return true;
    },
    {
      message: "Either Bitcoin address or email is required",
      path: ["email"],
    }
  );

export type FormValues = z.infer<typeof formSchema>;
