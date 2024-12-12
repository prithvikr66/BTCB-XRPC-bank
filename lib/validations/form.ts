import * as z from "zod"

export const formSchema = z.object({
  blockchain: z.string({
    required_error: "Please select a blockchain",
  }),
  token: z.string({
    required_error: "Please select a token",
  }),
  amount: z.number({
    required_error: "Amount is required",
  }).positive("Amount must be positive"),
  promoCode: z.string().optional(),
  bitcoinAddress: z.string().optional(),
  xrpAddress: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  telegramId: z.string().optional(),
}).refine((data) => {
  if (!data.bitcoinAddress && !data.email) {
    return false
  }
  return true
}, {
  message: "Either Bitcoin address or email is required",
  path: ["email"],
})

export type FormValues = z.infer<typeof formSchema>