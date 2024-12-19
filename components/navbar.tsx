import Image from "next/image";
import Logo from "../app/assets/BTCBLogo.png";
import EVMConnectWallet, { SolanaConnect } from "./wallet-connect";

export const Navbar = ({ chain }: { chain: string }) => {
  return (
    <div className="bg-[#000000] md:pl-[50px] md:pr-[50px] p-[10px] flex justify-between items-center h-[70px] md:h-[100px] w-full">
      <Image src={Logo} alt="" className=" h-full w-auto" />
      <div className=" flex items-center gap-[20px]">
        <div className=" ">
          {chain === "solana" ? (
            <SolanaConnect size="small"/>
          ) : chain === "bitcoin" ? null : (
            <EVMConnectWallet size="small" />
          )}
        </div>
      </div>
    </div>
  );
};
