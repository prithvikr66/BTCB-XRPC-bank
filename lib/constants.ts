export const BLOCKCHAIN_OPTIONS = [
  {
    value: "ethereum",
    label: "Ethereum",
    img: "https://cdn-icons-png.flaticon.com/128/14446/14446160.png",
  },
  {
    value: "solana",
    label: "Solana",
    img: "https://cdn-icons-png.flaticon.com/128/14446/14446237.png",
  },
  {
    value: "bnb",
    label: "BNB",
    img: "https://cdn-icons-png.flaticon.com/128/14446/14446125.png",
  },
  {
    value: "arbitrum",
    label: "Arbitrum",
    img: "https://cdn-icons-png.flaticon.com/128/15208/15208284.png",
  },
  {
    value: "bitcoin",
    label: "Bitcoin",
    img: "https://cdn-icons-png.flaticon.com/128/5968/5968260.png",
  },
  {
    value: "base",
    label: "Base",
    img: "https://cdn-icons-png.flaticon.com/128/14446/14446237.png",
  },
  {
    value: "avalanche",
    label: "Avalanche",
    img: "https://cdn-icons-png.flaticon.com/128/14446/14446121.png",
  },
] as const;

export const TOKENS = {
  ethereum: [
    {
      symbol: "ETH",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446160.png",
    },
    {
      symbol: "USDT",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446252.png",
    },
    {
      symbol: "USDC",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446284.png",
    },
  ],
  solana: [
    {
      symbol: "SOL",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446237.png",
    },
    {
      symbol: "USDT",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446252.png",
    },
    {
      symbol: "USDC",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446284.png",
    },
  ],
  bnb: [
    {
      symbol: "BNB",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446125.png",
    },
    {
      symbol: "USDC",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446284.png",
    },
  ],
  arbitrum: [
    {
      symbol: "ETH",
      img: "https://cdn-icons-png.flaticon.com/128/15208/15208284.png",
    },
    {
      symbol: "USDC",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446284.png",
    },
  ],
  bitcoin: [
    {
      symbol: "BTC",
      img: "https://cdn-icons-png.flaticon.com/128/5968/5968260.png",
    },
  ],
  base: [
    {
      symbol: "ETH",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446160.png",
    },
    {
      symbol: "USDC",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446284.png",
    },
  ],
  avalanche: [
    {
      symbol: "AVAX",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446121.png",
    },
    {
      symbol: "USDT",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446252.png",
    },
    {
      symbol: "USDC",
      img: "https://cdn-icons-png.flaticon.com/128/14446/14446284.png",
    },
  ],
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
    USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  solana: {
    USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
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

export type PhaseDetailsResponse = {
  currentPhase: number;
  pricePerToken: number;
  tokensSold: number;
  totalRaised: number;
  tokensRemaining: number;
};
