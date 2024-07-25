"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Image } from "@nextui-org/react";

const MainLayout = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for desktop */}
      {!isMobile && (
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
      )}

      {/* Top bar for mobile */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-black text-white flex justify-between items-center p-2 h-[6vh] z-50">
          <Image src="/logo.webp" alt="Logo" className="h-[50px]" />
          <Button
            size="sm"
            isIconOnly
            onClick={toggleSidebar}
            aria-label="Menu"
            className="text-white"
          >
            &#9776;
          </Button>
        </div>
      )}

      {/* Sidebar overlay for mobile */}
      {isMobile && (
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-40 bg-black bg-opacity-75"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={toggleSidebar} // Close sidebar on click outside
              />
              <motion.div
                className="fixed top-0 right-0 z-50 h-full bg-black text-white p-4"
                initial={{ x: "100%" }}
                animate={{
                  x: isSidebarOpen ? "calc(100vw - max-content)" : "100%",
                }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3 }}
                style={{ maxWidth: "max-content" }}
              >
                <Sidebar isMobile={true} toggleSidebar={toggleSidebar} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Main content area with padding adjustment for desktop */}
      <motion.div
        className={`h-full overflow-hidden w-full ${
          isMobile ? "pt-[6vh]" : ""
        }`}
        style={{ paddingLeft: !isMobile && (isHovered ? "14vw" : "10vw") }}
        animate={{
          paddingLeft: !isMobile && (isHovered ? "14vw" : "10vw"),
        }}
        transition={{ type: "spring", stiffness: 160, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default MainLayout;
