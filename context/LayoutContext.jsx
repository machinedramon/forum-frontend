"use client";

import { createContext, useState } from "react";

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [heroHeight, setHeroHeight] = useState(70);
  const [isHeroExpanded, setIsHeroExpanded] = useState(true);

  return (
    <LayoutContext.Provider
      value={{ heroHeight, setHeroHeight, isHeroExpanded, setIsHeroExpanded }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
