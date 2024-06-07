"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "../context/LayoutContext";
import { BookContext } from "../context/BookContext";
import { ScrollShadow } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "./Hero";
import axios from "axios";
import BookCarouselSection from "./BookCarouselSection";
import Sidebar from "./Sidebar";

const HERO_EXPANDED_HEIGHT = 70;
const HERO_COLLAPSED_HEIGHT = 50;
const SECTIONS_EXPANDED_HEIGHT = 30;
const SECTIONS_COLLAPSED_HEIGHT = 50;
const animationDuration = 0.5;
const imageMoveSpeed = 20;

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Layout = () => {
  const {
    sidebarWidth,
    heroHeight,
    setHeroHeight,
    isHeroExpanded,
    setIsHeroExpanded,
  } = useContext(LayoutContext);
  const { selectedBook } = useContext(BookContext);
  const scrollContainerRef = useRef(null);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [books, setBooks] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/livros?page=1&pageSize=10",
          {
            headers: {
              Authorization: `Bearer tmZuPXRr10AvXmQxJAfY4ENPDrGRWFDSS8fWGWuN9ng`,
            },
          }
        );
        setBooks(response.data.results);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => {
      setHeroHeight(HERO_COLLAPSED_HEIGHT);
      setIsHeroExpanded(false);
      scrollContainerRef.current.style.height = `${SECTIONS_COLLAPSED_HEIGHT}vh`;
    };

    const handleMouseLeave = () => {
      setHeroHeight(HERO_EXPANDED_HEIGHT);
      setIsHeroExpanded(true);
      scrollContainerRef.current.style.height = `${SECTIONS_EXPANDED_HEIGHT}vh`;
    };

    const container = scrollContainerRef.current;
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [setHeroHeight, setIsHeroExpanded]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBookIndex((prevIndex) => (prevIndex + 1) % books.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [books]);

  const bookToShow = selectedBook || books[currentBookIndex];

  return (
    <div className="flex h-screen bg-black transition-all">
      {/* Sidebar */}
      <motion.div
        className="fixed left-0 top-0 h-full bg-black text-white"
        initial={{ width: "10vw" }}
        animate={{ width: isHovered ? "14vw" : "10vw" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Sidebar isHovered={isHovered} />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="h-full overflow-hidden"
        animate={{
          marginLeft: isHovered ? "14vw" : "10vw",
          width: isHovered ? "86vw" : "90vw",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.section
          className="flex items-center justify-center sticky top-0 z-10"
          initial={{ height: `${HERO_EXPANDED_HEIGHT}vh` }}
          animate={{ height: `${heroHeight}vh` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          id="hero"
        >
          <AnimatePresence mode="wait">
            {bookToShow && (
              <motion.div
                key={bookToShow.title}
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: animationDuration }}
              >
                <Hero
                  title={bookToShow.title}
                  summary={bookToShow.summary}
                  bgImage={bookToShow.bg_image}
                  pdfLink={bookToShow.pdf_link}
                  publication_year={bookToShow.publication_year}
                  page_count={bookToShow.page_count}
                  subjects={bookToShow.subjects}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
        <ScrollShadow
          isEnabled={false}
          hideScrollBar
          className="w-full light overflow-y-auto snap-y snap-mandatory transition-all ease"
          ref={scrollContainerRef}
          style={{ height: `${SECTIONS_EXPANDED_HEIGHT}vh` }}
        >
          <AnimatePresence>
            {books.length > 0 && (
              <>
                {books.map((_, index) => (
                  <motion.section
                    key={index}
                    className="snap-start flex items-center justify-center bg-blue-500 transition-all ease-in"
                    style={{ height: "40vh" }}
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <BookCarouselSection />
                  </motion.section>
                ))}
              </>
            )}
          </AnimatePresence>
        </ScrollShadow>
      </motion.div>
    </div>
  );
};

export default Layout;
