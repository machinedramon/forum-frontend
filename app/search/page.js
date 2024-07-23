"use client";
import React, { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import {
  Input,
  Spinner,
  Card,
  CardBody,
  Image,
  Accordion,
  AccordionItem,
  Chip,
  Button,
  ScrollShadow,
  Switch,
  Badge,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { Filter2, InfoCircle, Search } from "react-iconly";
import { FaBook, FaFileAlt } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import { Tooltip } from "@nextui-org/react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const getCoverImageUrl = (bookId) => {
  const [firstPart, secondPart] = bookId.split("-");
  return `https://bid1006-production-public.s3.sa-east-1.amazonaws.com/books/cover/${firstPart}/editions/${secondPart}.jpg`;
};

const getHighlightedText = (text, highlights) => {
  if (!highlights || !text) return text;
  let parts = [text];

  highlights.forEach((highlight) => {
    const regex = new RegExp(`(${highlight})`, "gi");
    parts = parts.flatMap((part, index) =>
      typeof part === "string"
        ? part.split(regex).map((subpart, subIndex) =>
            regex.test(subpart) ? (
              <span
                key={`highlight-${index}-${subIndex}`}
                className="highlight"
              >
                {subpart}
              </span>
            ) : (
              subpart
            )
          )
        : part
    );
  });

  return parts;
};

const limitText = (text, limit = 200) => {
  if (!text) return "";
  return text.length > limit ? text.substring(0, limit) + `...` : text;
};

const getHighlightedTruncatedText = (text, highlights, contextLength = 30) => {
  if (!highlights || !text) return text;

  const highlightChunks = highlights.flatMap((highlight, highlightIndex) => {
    const regex = new RegExp(`(${highlight})`, "gi");
    let match;
    const chunks = [];

    while ((match = regex.exec(text)) !== null) {
      const startIndex = match.index;
      const start = Math.max(0, startIndex - contextLength);
      const end = Math.min(
        text.length,
        startIndex + highlight.length + contextLength
      );

      const prefix = start > 0 ? `...` : "";
      const suffix = end < text.length ? `...` : "";

      chunks.push(
        <React.Fragment key={`highlight-${highlightIndex}-${startIndex}`}>
          <span key={`highlight-${highlightIndex}-${startIndex}`}>
            ❝{prefix}
            {text.substring(start, startIndex)}
            <span className="highlight">
              {text.substring(startIndex, startIndex + highlight.length)}
            </span>
            {text.substring(startIndex + highlight.length, end)}
            {suffix}❞
          </span>
          <br key={`br-${highlightIndex}-${startIndex}`} />
        </React.Fragment>
      );
    }

    return chunks;
  });

  return highlightChunks.length > 0 ? highlightChunks : text;
};

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerms, setSearchTerms] = useState([]);
  const [totalOccurrences, setTotalOccurrences] = useState(0);
  const [isSmartSearch, setIsSmartSearch] = useState(false);

  const cardRefs = useRef([]);

  const handleSearch = async () => {
    if (query.trim()) {
      setLoading(true);
      setResults([]);
      setError(null);
      const startTime = Date.now();

      try {
        const response = await axios.post("http://localhost:9900/smartsearch", {
          query,
        });
        const endTime = Date.now();
        setSearchTime(endTime - startTime);

        // Log the response for debugging
        console.log("Response data:", response.data);

        setSearchTerms(response.data.searchTerms);

        const hits = response.data.hits.hits;

        // Log hits for debugging
        console.log("Hits:", hits);

        setResults(hits);
        setTotalOccurrences(hits.length);
      } catch (error) {
        console.error("Erro durante a busca:", error);
        setError(
          error.response?.data?.error ||
            "Erro durante a busca. Tente novamente."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (searchTerms.length > 0) {
      console.log("Search terms for highlighting:", searchTerms);
    }
  }, [searchTerms]);

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

  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
    <MainLayout>
      <div className="p-4 h-screen overflow-y-auto">
        <div className="search-container mb-4 flex flex-col items-center gap-x-4 gap-y-4">
          <div className="w-full flex justify-between gap-x-4">
            <AnimatePresence mode="wait">
              {isSmartSearch ? (
                <motion.div
                  key="smartSearch"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5 }}
                  className="flex-grow"
                >
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyUp={handleKeyUp}
                    placeholder="Pesquisar com IA..."
                    fullWidth
                    variant="faded"
                    color="default"
                    className="neon-effect" // Adicione esta classe
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="standardSearch"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex-grow"
                >
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyUp={handleKeyUp}
                    placeholder="Pesquisar..."
                    fullWidth
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Button onClick={handleSearch} className="w-28">
              <Search />
              Buscar
            </Button>
          </div>
          <div className="w-full flex justify-between">
            <Tooltip
              className="bg-[#0A0707] mt-2 shadow-lg"
              showArrow={false}
              placement="bottom-start"
              content={
                <span className="bg-[#0A0707] max-w-64 p-2 flex flex-col">
                  <span className="text-xs mb-4 bg-[#ffffff21] w-fit px-1">
                    • Novo recurso disponível
                  </span>
                  <div className="w-64">
                    <span className="text-[#fff] bg-[#DA002B] flex w-fit items-center mb-2 p-2 rounded-lg">
                      <RiRobot2Fill className="mr-1" />
                      Pesquisa Inteligente
                    </span>{" "}
                    A busca inteligente transforma suas consultas em buscas
                    precisas, explorando títulos, descrições e conteúdos
                    completos. Aproveite o poder da IA para expandir, melhorar
                    ou refinar seus resultados.
                  </div>
                </span>
              }
            >
              <div className="flex">
                <Switch
                  checked={isSmartSearch}
                  onChange={(e) => setIsSmartSearch(e.target.checked)}
                  size="md"
                  color="default"
                  className="flex"
                >
                  <Badge
                    content="novo"
                    color="primary"
                    shape="rectangle"
                    size="sm"
                    className="top-[-4px]"
                  >
                    Pesquisa Inteligente
                  </Badge>
                </Switch>
              </div>
            </Tooltip>
            <Tooltip
              className="bg-[#0A0707] mt-2 shadow-lg"
              showArrow={false}
              placement="bottom-start"
              content={
                <span className="bg-[#0A0707] max-w-64 p-2 flex flex-col">
                  <span className="text-xs mb-4 bg-[#ffffff21] w-fit flex gap-x-1 px-1">
                    <InfoCircle size={16} /> Info
                  </span>
                  <div className="w-64">
                    <span className="text-[#fff] bg-[#DA002B] flex w-fit items-center mb-2">
                      Amplitude:
                    </span>
                    <span>
                      A amplitude &quot;Somente no título&quot; contempla
                      títulos de livros, capítulos, revistas, doutrinas,
                      jurisprudências e vídeos.
                    </span>
                  </div>
                </span>
              }
            >
              <div className="flex gap-x-2">
                <RadioGroup
                  orientation="horizontal"
                  defaultValue={"all-content"}
                >
                  <Radio color="primary" value="all-content">
                    Em todo conteúdo
                  </Radio>
                  <Radio color="primary" value="only-title">
                    Somente no título
                  </Radio>
                </RadioGroup>
                <InfoCircle />
              </div>
            </Tooltip>
            <Button onClick={handleSearch} className="w-28">
              <Filter2 />
              Filtrar
            </Button>
          </div>
        </div>
        <div className="flex justify-between">
          {searchTime > 0 && (
            <div className="mb-4">
              <p>Pesquisa concluída em {searchTime.toFixed(2)} ms</p>
            </div>
          )}
          {totalOccurrences > 0 && (
            <div className="mb-4">
              <p>Resultados encontrados: {totalOccurrences}</p>
            </div>
          )}
        </div>
        {loading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center">
            <Spinner
              label={
                <div className="flex items-center mt-2">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                  <p className="text-green-600 animate-pulse">
                    IA está processando a busca...
                  </p>
                </div>
              }
              color="primary"
            />
          </div>
        ) : error ? (
          <p>
            {typeof error === "string"
              ? error
              : "Ocorreu um erro. Tente novamente."}
          </p>
        ) : (
          <div className="results-container flex flex-col gap-6">
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
                      <CardBody className="flex flex-row">
                        <div className="w-1/3 flex justify-center relative">
                          <Image
                            src={getCoverImageUrl(result._id)}
                            alt={result._source.text_2 || "Imagem da capa"}
                            className="sticky-image object-cover h-[400px] rounded-md"
                          />
                        </div>
                        <div className="flex flex-col justify-center w-2/3 gap-y-4">
                          <Chip variant="shadow" color="secondary">
                            Livro
                          </Chip>
                          <h3 className="text-2xl font-bold">
                            <a href="#">
                              {getHighlightedText(
                                result._source.text_2,
                                searchTerms
                              )}
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
                                      <h4 className="text-xl font-semibold">
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
                                          <strong>Páginas:</strong>{" "}
                                          {edition.pages}
                                        </p>
                                      </div>
                                      {renderDescription(edition.description)}
                                      {edition.chapters && (
                                        <Accordion
                                          variant="shadow"
                                          className="mb-4"
                                        >
                                          <AccordionItem
                                            key={`chapters-${result._id}-${editionIndex}`}
                                            aria-label="Capítulos"
                                            startContent={
                                              <FaFileAlt size={26} />
                                            }
                                            title={`Capítulos (${
                                              edition.chapters.filter(
                                                (chapter) =>
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
                                                  <ScrollShadow className="flex flex-col gap-y-4 max-h-[300px] overflow-auto my-4 px-4">
                                                    <h4 className="text-xl font-semibold mt-6">
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
                                                    <div className="flex justify-between">
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
                <div className="h-[80vh] flex flex-col items-center justify-center">
                  <Image
                    alt=""
                    className="h-[40vh]"
                    src="/no-results.svg"
                  ></Image>
                  <h1 className="mt-4 font-semibold text-lg">
                    Nenhum resultado encontrado.
                  </h1>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
