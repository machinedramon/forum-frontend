/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { LayoutContext } from "@/context/LayoutContext";
import { BookContext } from "@/context/BookContext";
import { ScrollShadow } from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import axios from "axios";
import BookCarouselSection from "@/components/BookCarouselSection";

const Home = () => {
  const { heroHeight, setHeroHeight, setIsHeroExpanded } =
    useContext(LayoutContext);
  const { selectedBook, setSelectedBook, books, setBooks } =
    useContext(BookContext);
  const scrollContainerRef = useRef(null);
  const heroRef = useRef(null); // Adiciona referência ao Hero
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  const HERO_EXPANDED_HEIGHT = 70;
  const HERO_COLLAPSED_HEIGHT = isDesktop ? 50 : 47;
  const SECTIONS_EXPANDED_HEIGHT = 30;
  const SECTIONS_COLLAPSED_HEIGHT = isDesktop ? 50 : 47;
  const animationDuration = 0.5;
  const sectionHeight = isMobile ? "30vh" : "40vh";

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.post(
        "https://api.forumconhecimento.com/books",
        null,
        {
          params: { size: 50, verbose: false },
        }
      );
      const booksData = response.data.hits.hits.map((hit) => hit._source);
      setBooks(booksData);
      setSelectedBook(booksData[0]);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!selectedBook) {
        setCurrentBookIndex((prevIndex) => (prevIndex + 1) % books.length);
        setSelectedBook(books[currentBookIndex]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [books, selectedBook, currentBookIndex]);

  useEffect(() => {
    if (isClient && scrollContainerRef.current) {
      const handleMouseEnter = () => {
        if (isDesktop) {
          setHeroHeight(HERO_COLLAPSED_HEIGHT);
          setIsHeroExpanded(false);
          scrollContainerRef.current.style.height = `${SECTIONS_COLLAPSED_HEIGHT}vh`;
        }
      };

      const handleMouseLeave = () => {
        if (isDesktop) {
          setHeroHeight(HERO_EXPANDED_HEIGHT);
          setIsHeroExpanded(true);
          scrollContainerRef.current.style.height = `${SECTIONS_EXPANDED_HEIGHT}vh`;
        }
      };

      const container = scrollContainerRef.current;
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        if (container) {
          container.removeEventListener("mouseenter", handleMouseEnter);
          container.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    }
  }, [setHeroHeight, setIsHeroExpanded, isDesktop, isClient]);

  useEffect(() => {
    if (isClient && heroRef.current && scrollContainerRef.current) {
      let scrollAmount = 0;
      const handleScroll = (event) => {
        event.preventDefault();
        scrollAmount += event.deltaY;
        requestAnimationFrame(() => {
          scrollContainerRef.current.scrollTop += scrollAmount;
          scrollAmount = 0;
        });
      };

      const heroElement = heroRef.current;
      heroElement.addEventListener("wheel", handleScroll);

      return () => {
        heroElement.removeEventListener("wheel", handleScroll);
      };
    }
  }, [isClient]);

  return (
    <MainLayout>
      {isClient && (
        <>
          <motion.section
            ref={heroRef} // Adiciona referência ao Hero
            className="flex items-center justify-center sticky top-0 z-10"
            initial={{
              height: isMobile ? "50vh" : `${HERO_EXPANDED_HEIGHT}vh`,
            }}
            animate={{ height: isMobile ? "50vh" : `${heroHeight}vh` }}
            transition={{ type: "spring", stiffness: 160, damping: 30 }}
            id="hero"
          >
            <AnimatePresence mode="wait">
              {selectedBook && (
                <motion.div
                  key={selectedBook.id}
                  className="w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: animationDuration }}
                >
                  <Hero
                    title={selectedBook.text_2}
                    summary={selectedBook.text_3}
                    bgImage={selectedBook.bgImage}
                    pdfLink="#"
                    publication_year={new Date(
                      selectedBook.publish_date
                    ).getFullYear()}
                    subjects={
                      selectedBook.filters?.map((filter) => filter.title) || []
                    }
                    id={selectedBook.id}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
          <ScrollShadow
            isEnabled={false}
            hideScrollBar
            className="w-full light overflow-y-auto snap-y snap-mandatory transition-all ease-linear"
            ref={scrollContainerRef}
            style={{
              height: isMobile ? "50vh" : `${SECTIONS_EXPANDED_HEIGHT}vh`,
            }}
          >
            <AnimatePresence className="transition-all ease">
              {books.length > 0 && (
                <div className="ml-4">
                  {books.slice(0, 4).map((book, index) => (
                    <motion.section
                      key={index}
                      className="snap-start flex items-center justify-center transition-all ease-in"
                      initial="hidden"
                      animate="visible"
                      variants={sectionVariants}
                      transition={{ duration: 0.5 }}
                      style={{ height: sectionHeight }}
                    >
                      <BookCarouselSection
                        books={books}
                        onBookClick={setSelectedBook}
                      />
                    </motion.section>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </ScrollShadow>
        </>
      )}
    </MainLayout>
  );
};

export default Home;
