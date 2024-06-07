import React, { useContext, useState, useEffect } from "react";
import { Image } from "@nextui-org/react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BookContext } from "../context/BookContext";

const BookCarouselSection = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { setSelectedBook } = useContext(BookContext);

  const fetchBooks = async (page) => {
    try {
      const response = await axios.get("http://localhost:3001/livros", {
        params: {
          page,
          pageSize: 10,
        },
      });
      setBooks((prevBooks) => [...prevBooks, ...response.data.results]);
      setHasMore(response.data.totalPages > page);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

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
    afterChange: (currentSlide) => {
      if (hasMore && currentSlide + 5 >= books.length) {
        setPage((prevPage) => prevPage + 1);
      }
    },
  };

  return (
    <div className="w-full h-full bg-black transition-all">
      <h2 className="text-3xl font-bold mb-4">Livros</h2>
      <Slider {...settings} className="">
        {books.map((book) => (
          <div
            key={book.id}
            className="p-1 flex justify-center items-center h-[80%]"
            onClick={() => setSelectedBook(book)}
          >
            <div className="overflow-hidden flex justify-center items-center py-[5.5px] hover:scale-105 transition-all">
              <Image
                loading="lazy"
                src={book.cover_image}
                alt={book.title}
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
