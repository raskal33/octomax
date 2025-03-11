"use client";

import Button from "@/components/button";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { usePreferences } from "@/store/usePreferences";

export default function OctoMaxPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [poolData, _setPoolData] = useState(null);
  const [selectedPicks, setSelectedPicks] = useState<string[]>([]);
  const { darkMode } = usePreferences();

  // ... rest of the code ...

  // Rename unused variables with underscore prefix
  const _pixelatedHeadingClass = "font-pixel text-2xl mb-4";
  const _pixelatedValueClass = "font-pixel text-xl";

  // ... rest of the code ...

  const handlePickSelection = (_entryAmount: number) => {
    // Implementation
  };

  // ... rest of the code ...
}
