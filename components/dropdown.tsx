"use client";
import { useEffect, useRef, useState } from "react";

const Dropdown = ({
  options,
  onChange,
  label,
  blockchain,
  selectedOption={},
}: {
  options: any;
  onChange: any;
  label: string;
  blockchain: boolean;
  selectedOption: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImg] = useState("");

  const handleSelect = (value: any, label?: any) => {
    blockchain ? setSelected(label) : setSelected(value);
    onChange(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-[2px] ${
          isOpen ? "bg-white" : "bg-[#333232]"
        } text-white rounded-full transition focus:outline-none`}
      >
        <div className="w-full text-lg text-[#8F8F8F] opacity text-center h-full rounded-full bg-black px-4 py-2 flex justify-between items-center">
          <div className=" flex items-center gap-[10px]">
            {selectedOption.img && (
              <img src={selectedOption.img} height={"30"} width="30" />
            )}
            {selectedOption.label || selectedOption.symbol || label}
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute bg-white p-[2px] mt-2 w-full rounded-[20px] z-10">
          <div className="bg-black h-full w-full rounded-[20px]">
            {options.map((option: any) => (
              <button
                type="button"
                key={blockchain ? option.label : option.symbol}
                className=" flex items-center gap-[20px] w-full text-left rounded-[20px] px-4 py-2 text-white hover:bg-[#121212]  transition"
                onClick={() => {
                  setSelectedImg(option.img);
                  handleSelect(
                    blockchain ? option.value : option.symbol,
                    blockchain ? option.label : ""
                  );
                }}
              >
                <img src={option.img} height={"30"} width="30" />

                {blockchain ? option.label : option.symbol}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
