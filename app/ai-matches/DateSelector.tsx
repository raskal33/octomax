"use client";

import { motion } from "framer-motion";
import { getDayLabel } from "./utils";

interface DateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DateSelector({ value, onChange }: DateSelectorProps) {
  const dates = [
    { value: "0", label: "Today" },
    { value: "-1", label: "Yesterday" },
    { value: "-2", label: "2 Days Ago" },
    { value: "-3", label: "3 Days Ago" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex justify-center space-x-4 mb-8"
    >
      {dates.map((date) => (
        <motion.button
          key={date.value}
          onClick={() => onChange(date.value)}
          className={`px-6 py-3 rounded-lg font-bold transition-colors ${
            value === date.value
              ? "bg-[#9945FF] text-white"
              : "bg-[#121212] text-gray-400 hover:bg-[#9945FF]/20 hover:text-white"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {date.label}
        </motion.button>
      ))}
    </motion.div>
  );
} 