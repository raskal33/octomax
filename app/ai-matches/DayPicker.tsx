"use client";

import { motion } from "motion/react";
import { useRouter, usePathname } from "next/navigation";

interface DayPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DayPicker({ value, onChange }: DayPickerProps) {
  const _router = useRouter();
  const _pathname = usePathname();

  const days = [
    { id: "-3", label: "3 Days Ago" },
    { id: "-2", label: "2 Days Ago" },
    { id: "-1", label: "Yesterday" },
    { id: "0", label: "Today" },
  ];

  const handleDayClick = (dayId: string) => {
    onChange(dayId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="pixel-border bg-[#121212] p-2 pixel-box mb-8"
    >
      <div className="grid grid-cols-4 gap-1">
        {days.map((day) => (
          <motion.button
            key={day.id}
            onClick={() => handleDayClick(day.id)}
            className={`
              py-2 px-1 text-center text-sm font-bold transition-all duration-200 pixel-heading
              ${value === day.id 
                ? "bg-[#9945FF] text-white" 
                : "text-gray-400 hover:bg-[#9945FF]/70 hover:text-white"}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {day.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
} 