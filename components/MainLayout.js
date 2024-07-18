"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

const MainLayout = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <motion.div
        className="fixed left-0 top-0 h-full bg-black text-white"
        initial={{ width: "10vw" }}
        animate={{ width: isHovered ? "14vw" : "10vw" }}
        transition={{ type: "spring", stiffness: 160, damping: 30 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Sidebar isHovered={isHovered} />
      </motion.div>
      <motion.div
        className="h-full overflow-hidden"
        animate={{
          marginLeft: isHovered ? "14vw" : "10vw",
          width: isHovered ? "86vw" : "90vw",
        }}
        transition={{ type: "spring", stiffness: 160, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default MainLayout;
