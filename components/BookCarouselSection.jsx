"use client";
import React, { useContext, useState } from "react";
import { Image } from "@nextui-org/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BookContext } from "../context/BookContext";

const BookCarouselSection = ({ books }) => {
  const { setSelectedBook } = useContext(BookContext);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const getCoverImageUrl = (id) => {
    const [firstPart, secondPart] = id.split("-");
    return `https://bid1006-production-public.s3-sa-east-1.amazonaws.com/books/cover/${firstPart}/editions/${secondPart}.jpg`;
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSelectedBookId(book.id);
  };

  const settings = {
    slidesToShow: 7.5,
    arrows: false,
    dots: true,
    infinite: false,
    speed: 500,
    variableWidth: true,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div className="w-full h-full bg-black transition-all ease-in-out">
      <h2 className="text-3xl font-bold mb-4">Livros</h2>
      <Slider {...settings} className="">
        {books.map((book) => (
          <div
            key={book.id}
            className={`p-1 flex justify-center items-center h-[80%]`}
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
                className="object-cover h-[220px] w-[160px] rounded-md transition-all"
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BookCarouselSection;
