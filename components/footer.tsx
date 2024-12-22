import { Facebook, Instagram, MessageCircle, Twitter } from 'lucide-react';
import Logo from "../app/assets/BTCBLogo.png"
import Image from 'next/image';
export const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-center">
        <div className="flex flex-col md:flex-row mx-auto items-center justify-between gap-6">
          {/* Logo and Name */}
          <div className="flex items-center gap-2">
            <Image src={Logo} alt="" height={30} width={30}/>
            <span className="text-white text-xl font-bold">BTC Bank</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center lg:relative lg:right-[5%] gap-6">
            <a
              href="https://t.me/BTCB_Official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#FC2900] transition-colors"
            >
              <MessageCircle size={24} />
            </a>
            <a
              href="https://www.facebook.com/share/19hwspwvtz/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#FC2900] transition-colors"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://x.com/btcb_official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#FC2900] transition-colors"
            >
              <Twitter size={24} />
            </a>
            <a
              href="https://www.instagram.com/official_btcb/profilecard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#FC2900] transition-colors"
            >
              <Instagram size={24} />
            </a>
          </div>

          {/* Website Link */}
          <a
            href="https://btcb.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#FC2900] transition-colors text-sm"
          >
            btcb.ai
          </a>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} BTC Bank. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
