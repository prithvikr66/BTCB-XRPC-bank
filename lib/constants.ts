export const BLOCKCHAIN_OPTIONS = [
  { value: "ethereum", label: "Ethereum" },
  { value: "solana", label: "Solana" },
  { value: "tron", label: "Tron" },
  { value: "bnb", label: "BNB" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "bitcoin", label: "Bitcoin" },
  { value: "base", label: "Base" },
  { value: "avalanche", label: "Avalanche" },
] as const;

export const TOKENS = {
  ethereum: ["ETH", "USDT", "USDC"],
  solana: ["SOL", "USDT", "USDC"],
  tron: ["TRX", "USDT", "USDC"],
  bnb: ["BNB", "USDC"],
  arbitrum: ["USDC"],
  bitcoin: ["BTC"],
  base: ["ETH", "USDC"],
  avalanche: ["USDT", "USDC"],
} as const;

export const CHAINS = {
  ethereum: 1,
  solana: 501,
  tron: 195,
  bnb: 56,
  arbitrum: 42161,
  bitcoin: 0,
  base: 8453,
  avalanche: 43114,
} as const;

type TokenAddressMap = {
  [key: string]: {
    [token: string]: string;
  };
};

export const TOKEN_ADDRESSES: TokenAddressMap = {
  ethereum: {
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  solana: {
    USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8JRy2Nie",
    USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
  tron: {
    USDT: "TR7NHqjeKQxGTCi8q8ZY4pL5zSzDF4BEFc",
    USDC: "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8",
  },
  bnb: {
    USDC: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  },
  arbitrum: {
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  },
  avalanche: {
    USDT: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    USDC: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  },
  base: {
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
};

export type Blockchain = keyof typeof TOKENS;
export type Token = (typeof TOKENS)[Blockchain][number];
