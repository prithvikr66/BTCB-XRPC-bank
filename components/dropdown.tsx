"use client";
import { useEffect, useRef, useState } from "react";

const Dropdown = ({
  options,
  onChange,
  label,
  blockchain,
}: {
  options: any;
  onChange: any;
  label: string;
  blockchain: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: any) => {
    setSelected(value);
    onChange(value);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
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
          isOpen ? "gradient-button-bg" : "bg-[#333232]"
        } text-white rounded-full transition focus:outline-none`}
      >
        <div className="w-full text-lg text-[#8F8F8F] opacity text-center h-full rounded-full bg-black px-4 py-2 flex justify-between items-center">
          {selected || label}
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
        <div className="absolute gradient-button-bg p-[2px] mt-2 w-full rounded-[20px] z-10">
          <div className="bg-black h-full w-full rounded-[20px]">
            {options.map((option: any) => (
              <button
                type="button"
                key={blockchain ? option.value : option}
                className="block w-full text-left rounded-[20px] px-4 py-2 text-white hover:bg-[#121212]  transition"
                onClick={() => handleSelect(blockchain ? option.value : option)}
              >
                {blockchain ? option.value : option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
