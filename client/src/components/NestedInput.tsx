import { motion } from "framer-motion";
import { useState } from "react";

function NestedInput({
  value,
  onChange,
  placeholder
}: {
  value: any;
  onChange: (val: any) => void;
  placeholder?: string;
}) {
  const isComplex = typeof value === "object"; // array or object

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let val: any = e.target.value;

    try {
      val = JSON.parse(val); // if JSON-like
    } catch {
      // keep as raw string or number
      if (!isNaN(Number(val))) {
        val = Number(val);
      }
    }

    onChange(val);
  };

  if (isComplex) {
    return (
      <textarea
        value={JSON.stringify(value)}
        onChange={handleInputChange}
        className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleInputChange}
      className="w-full px-4 py-3 bg-[#ffffff08] border border-[#ffffff20] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0075ff] transition-all duration-300"
      placeholder={placeholder}
    />
  );
}
