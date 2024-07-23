"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";

const MainLayout = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      <motion.div
        className="fixed left-0 top-0 h-full bg-black text-white hidden md:block"
        initial={{ width: "10vw" }}
        animate={{ width: isHovered ? "14vw" : "10vw" }}
        transition={{ type: "spring", stiffness: 160, damping: 30 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Sidebar isHovered={isHovered} />
      </motion.div>

      {/* Main content area with padding adjustment for desktop */}
      <motion.div
        className="h-full overflow-hidden w-full"
        style={{ paddingLeft: isHovered ? "14vw" : isMobile ? "0vw" : "10vw" }}
        animate={{
          paddingLeft: isHovered ? "14vw" : isMobile ? "0vw" : "10vw",
        }}
        transition={{ type: "spring", stiffness: 160, damping: 30 }}
      >
        {children}
      </motion.div>

      {/* Bottom navbar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around items-center md:hidden p-2 h-[10vh]">
        <Sidebar isMobile={true} />
      </div>
    </div>
  );
};

export default MainLayout;
