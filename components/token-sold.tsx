import React from "react";

import Image from "next/image";
import Logo from "../app/assets/BTCBLogo.png";
type DisplayType = {
  pricePerToken: number | undefined;
  totalRaised: number | undefined;
  tokensRemaining: number | undefined;
};
const TokenPriceDisplay: React.FC<DisplayType> = ({
  pricePerToken,
  totalRaised,
  tokensRemaining,
}) => {
  const tokensSold = 3750000 - tokensRemaining!;
  const tokensSoldPercentage = (tokensSold / 3750000) * 100;
  return (
    <div className="bg-black p-6 rounded-lg w-full">
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 text-white text-xl mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Image src={Logo} alt="" height={25} width={25} />
            <span>1 BTCB =</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-400">$ {pricePerToken}</span>
          </div>
        </div>
        <div className="text-gray-300">Total Raised: ${totalRaised}</div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-700 rounded-full mb-4">
        <div
          className="absolute left-0 top-0 h-full bg-red-500 rounded-full"
          style={{ width: `${tokensSoldPercentage}%` }}
        />
        <div
          className="absolute h-4 w-4 bg-white rounded-full top-1/2 -translate-y-1/2"
          style={{
            left: `${tokensSoldPercentage}%`,
            transform: `translate(-50%, -50%)`,
          }}
        />
      </div>

      {/* Tokens Sold Display */}
      <div className="text-center">
        <div className="text-white text-2xl font-bold">
          {tokensSold ? tokensSold.toLocaleString() : 0} BTCB
        </div>
        <div className="text-gray-400 text-sm uppercase tracking-wide">
          Tokens Sold
        </div>
      </div>
    </div>
  );
};

export default TokenPriceDisplay;
