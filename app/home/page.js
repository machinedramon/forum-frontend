/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useContext, useEffect, useRef, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { LayoutContext } from "@/context/LayoutContext";
import { BookContext } from "@/context/BookContext";
import { ScrollShadow } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "@/components/Hero";
import axios from "axios";
import BookCarouselSection from "@/components/BookCarouselSection";
import { useMediaQuery } from "react-responsive";

const HERO_EXPANDED_HEIGHT = 70;
const HERO_COLLAPSED_HEIGHT = 50;
const SECTIONS_EXPANDED_HEIGHT = 30;
const SECTIONS_COLLAPSED_HEIGHT = 50;
const animationDuration = 0.5;
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Home = () => {
  const { heroHeight, setHeroHeight, setIsHeroExpanded } =
    useContext(LayoutContext);
  const { setSelectedBook } = useContext(BookContext);
  const scrollContainerRef = useRef(null);
  const [books, setBooks] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const fetchBooks = async () => {
    try {
      const response = await axios.post(
        "http://52.0.192.118:9910/books",
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
  }, [setSelectedBook]);

  useEffect(() => {
    const handleMouseEnter = () => {
      if (!isMobile) {
        setHeroHeight(HERO_COLLAPSED_HEIGHT);
        setIsHeroExpanded(false);
        scrollContainerRef.current.style.height = `${SECTIONS_COLLAPSED_HEIGHT}vh`;
      }
    };

    const handleMouseLeave = () => {
      if (!isMobile) {
        setHeroHeight(HERO_EXPANDED_HEIGHT);
        setIsHeroExpanded(true);
        scrollContainerRef.current.style.height = `${SECTIONS_EXPANDED_HEIGHT}vh`;
      }
    };

    const container = scrollContainerRef.current;
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [setHeroHeight, setIsHeroExpanded, isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBookIndex((prevIndex) => (prevIndex + 1) % books.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [books]);

  const bookToShow = books[currentBookIndex];

  return (
    <MainLayout>
      <motion.section
        className="flex items-center justify-center sticky top-0 z-10"
        initial={{ height: `${HERO_EXPANDED_HEIGHT}vh` }}
        animate={{ height: `${heroHeight}vh` }}
        transition={{ type: "spring", stiffness: 160, damping: 30 }}
        id="hero"
      >
        <AnimatePresence mode="wait">
          {bookToShow && (
            <motion.div
              key={bookToShow.id}
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: animationDuration }}
            >
              <Hero
                title={bookToShow.text_2}
                summary={bookToShow.text_3}
                bgImage={bookToShow.bgImage}
                pdfLink="#"
                publication_year={new Date(
                  bookToShow.publish_date
                ).getFullYear()}
                subjects={
                  bookToShow.filters?.map((filter) => filter.title) || []
                }
                id={bookToShow.id}
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
          height: isMobile
            ? `${SECTIONS_EXPANDED_HEIGHT * 2}vh`
            : `${SECTIONS_EXPANDED_HEIGHT}vh`,
        }}
      >
        <AnimatePresence className="transition-all ease">
          {books.length > 0 && (
            <div className="ml-4">
              {books.slice(0, 4).map((_, index) => (
                <motion.section
                  key={index}
                  className="snap-start flex items-center justify-center bg-blue-500 transition-all ease-in"
                  style={{ height: isMobile ? "30vh" : "40vh" }}
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                  transition={{ duration: 0.5 }}
                >
                  <BookCarouselSection books={books} />
                </motion.section>
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollShadow>
    </MainLayout>
  );
};

export default Home;
