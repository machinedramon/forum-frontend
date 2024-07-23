// components/BookCarouselSection.jsx
"use client";
import React, { useContext, useState } from "react";
import { Image } from "@nextui-org/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BookContext } from "@/context/BookContext";
import { useMediaQuery } from "react-responsive";

const BookCarouselSection = ({ books }) => {
  const { setSelectedBook } = useContext(BookContext);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const getCoverImageUrl = (id) => {
    const [firstPart, secondPart] = id.split("-");
    return `https://bid1006-production-public.s3.sa-east-1.amazonaws.com/books/cover/${firstPart}/editions/${secondPart}.jpg`;
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSelectedBookId(book.id);
  };

  const settings = {
    slidesToShow: isMobile ? 2 : 7.5,
    arrows: false,
    dots: true,
    infinite: false,
    speed: 500,
    variableWidth: true,
    slidesToScroll: isMobile ? 2 : 5,
  };

  return (
    <div className="w-full h-full bg-black transition-all ease-in-out">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Livros</h2>
      <Slider {...settings} className="relative">
        {books.map((book) => (
          <div
            key={book.id}
            className={`p-1 flex justify-center items-center ${
              isMobile ? "h-[150px]" : "h-[80%]"
            }`}
            onClick={() => handleBookSelect(book)}
          >
            <div
              className={`overflow-hidden flex justify-center items-center py-[5.5px] transition-all ${
                book.id === selectedBookId ? "scale-105" : "hover:scale-105"
              }`}
            >
              <Image
                loading="lazy"
                src={getCoverImageUrl(book.id)}
                alt={book.text_2}
                className={`object-cover ${
                  isMobile ? "h-[140px]" : "h-[220px]"
                } ${
                  isMobile ? "w-[100px]" : "w-[160px]"
                } rounded-md transition-all`}
              />
            </div>
          </div>
        ))}
      </Slider>
      {isMobile && (
        <div className="absolute bottom-0 left-0 right-0 h-[50px] bg-gradient-to-t from-black via-transparent to-transparent"></div>
      )}
    </div>
  );
};

export default BookCarouselSection;
