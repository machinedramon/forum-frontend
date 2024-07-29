"use client";

import React, { useRef, useEffect } from "react";
import {
  Card,
  CardBody,
  Image,
  Accordion,
  AccordionItem,
  Chip,
  ScrollShadow,
} from "@nextui-org/react";
import { FaBook, FaFileAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const getCoverImageUrl = (bookId) => {
  const [firstPart, secondPart] = bookId.split("-");
  return `https://bid1006-production-public.s3.sa-east-1.amazonaws.com/books/cover/${firstPart}/editions/${secondPart}.jpg`;
};

const Results = ({
  results,
  searchTerms,
  getHighlightedText,
  limitText,
  getHighlightedTruncatedText,
}) => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      cardRefs.current.forEach((card, index) => {
        const image = card.querySelector(".sticky-image");
        const rect = image.getBoundingClientRect();
        const nextCard = cardRefs.current[index + 1];
        if (nextCard) {
          const nextCardRect = nextCard.getBoundingClientRect();
          if (nextCardRect.top <= rect.bottom) {
            image.classList.remove("sticky");
          } else {
            image.classList.add("sticky");
          }
        } else {
          image.classList.add("sticky");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [results]);

  const renderAuthors = (authors) => {
    if (!authors || authors.length === 0) return null;
    const displayAuthors =
      authors.length > 3
        ? authors
            .slice(0, 3)
            .map((a) => a.title)
            .join(", ") + "..."
        : authors.map((a) => a.title).join(", ");
    return (
      <p>
        <strong>Autores:</strong> {displayAuthors}
      </p>
    );
  };

  const renderDescription = (description) => {
    return (
      <p>
        <strong>Descrição:</strong>{" "}
        {getHighlightedText(limitText(description), searchTerms)}
      </p>
    );
  };

  const renderChapterContent = (chapterContent) => {
    return (
      <div className="flex flex-col gap-y-2">
        <strong>
          <span className="text-[#DA002B]">•</span> Conteúdo:
        </strong>{" "}
        {getHighlightedTruncatedText(chapterContent, searchTerms)}
      </div>
    );
  };

  return (
    <div className="results-container h-[74%] flex flex-col gap-6">
      <AnimatePresence>
        {results.length > 0 ? (
          results.map((result, index) => (
            <motion.div
              key={result._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                key={result._id}
                className="card shadow-lg"
                ref={(el) => (cardRefs.current[index] = el)}
              >
                <CardBody className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 flex justify-center relative">
                    <Image
                      src={getCoverImageUrl(result._id)}
                      alt={result._source.text_2 || "Imagem da capa"}
                      className="sticky-image object-cover h-[200px] sm:h-[400px] rounded-md"
                    />
                  </div>
                  <div className="flex flex-col justify-center w-full sm:w-2/3 gap-y-4 mt-4 sm:mt-0">
                    <Chip variant="shadow" color="secondary">
                      Livro
                    </Chip>
                    <h3 className="text-xl sm:text-2xl font-bold">
                      <a href="#">
                        {getHighlightedText(result._source.text_2, searchTerms)}
                      </a>
                    </h3>
                    {renderAuthors(result._source.editions?.[0]?.authors)}
                    {renderDescription(result._source.text_3)}
                    {result._source.editions && (
                      <Accordion variant="shadow">
                        <AccordionItem
                          key={`editions-${result._id}`}
                          aria-label="Edições"
                          startContent={<FaBook size={26} />}
                          title={`Edições (${result._source.editions.length})`}
                          subtitle="Clique para expandir"
                        >
                          {result._source.editions.map(
                            (edition, editionIndex) => (
                              <div
                                key={`${result._id}-${editionIndex}`}
                                className="mt-2 flex flex-col gap-y-4"
                              >
                                <h4 className="text-lg sm:text-xl font-semibold">
                                  <a href="#">
                                    {getHighlightedText(
                                      edition.title,
                                      searchTerms
                                    )}
                                    :
                                    {getHighlightedText(
                                      edition.subtitle,
                                      searchTerms
                                    )}
                                  </a>
                                </h4>
                                <div className="flex justify-between">
                                  <p>
                                    <strong>ISBN:</strong> {edition.isbn}
                                  </p>
                                  <p>
                                    <strong>Páginas:</strong> {edition.pages}
                                  </p>
                                </div>
                                {renderDescription(edition.description)}
                                {edition.chapters && (
                                  <Accordion variant="shadow" className="mb-4">
                                    <AccordionItem
                                      key={`chapters-${result._id}-${editionIndex}`}
                                      aria-label="Capítulos"
                                      startContent={<FaFileAlt size={26} />}
                                      title={`Capítulos (${
                                        edition.chapters.filter((chapter) =>
                                          searchTerms.some(
                                            (term) =>
                                              chapter.ocr &&
                                              chapter.ocr
                                                .toLowerCase()
                                                .includes(term)
                                          )
                                        ).length
                                      })`}
                                      subtitle="Clique para expandir"
                                    >
                                      {edition.chapters
                                        .filter((chapter) =>
                                          searchTerms.some((term) =>
                                            chapter.ocr
                                              ? chapter.ocr
                                                  .toLowerCase()
                                                  .includes(term)
                                              : false
                                          )
                                        )
                                        .map((chapter, chapterIndex) => (
                                          <div
                                            key={`${result._id}-${editionIndex}-${chapterIndex}`}
                                          >
                                            <ScrollShadow className="flex flex-col gap-y-4 max-h-[200px] sm:max-h-[300px] overflow-auto my-4 px-4">
                                              <h4 className="text-lg sm:text-xl font-semibold mt-6">
                                                {`${chapterIndex + 1}. `}
                                                <a
                                                  href="#"
                                                  className="decoration-[#DA002B] underline underline-offset-4"
                                                >
                                                  {getHighlightedText(
                                                    chapter.title,
                                                    searchTerms
                                                  )}
                                                </a>
                                              </h4>
                                              <div className="flex flex-col sm:flex-row justify-between">
                                                <p>
                                                  <strong>
                                                    <span className="text-[#DA002B]">
                                                      •
                                                    </span>{" "}
                                                    Tipo:
                                                  </strong>{" "}
                                                  {chapter.chapter_type}
                                                </p>
                                                <p>
                                                  <strong>
                                                    <span className="text-[#DA002B]">
                                                      •
                                                    </span>{" "}
                                                    Idioma:
                                                  </strong>{" "}
                                                  {chapter.language}
                                                </p>
                                                <p>
                                                  <strong>
                                                    <span className="text-[#DA002B]">
                                                      •
                                                    </span>{" "}
                                                    Ordem:
                                                  </strong>{" "}
                                                  {chapter.order}
                                                </p>
                                              </div>
                                              {renderChapterContent(
                                                chapter.ocr
                                              )}
                                            </ScrollShadow>
                                          </div>
                                        ))}
                                    </AccordionItem>
                                  </Accordion>
                                )}
                              </div>
                            )
                          )}
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="h-[100%] flex flex-col items-center justify-center">
            <Image alt="" className="h-[24vh]" src="/no-results.svg"></Image>
            <h1 className="mt-4 font-semibold text-lg">
              Nenhum resultado encontrado.
            </h1>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Results;
