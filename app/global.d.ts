declare global {
    interface Window {
      tronWeb?: {
        defaultAddress: {
          base58: string;
        };
      };
    }
  }
  