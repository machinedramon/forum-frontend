"use client";

import React, { useState, useCallback } from "react";
import MainLayout from "@/components/MainLayout";
import SearchInput from "@/components/search/SearchInput";
import Results from "@/components/search/Results";
import axios from "axios";
import { Spinner } from "@nextui-org/react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [error, setError] = useState(null);
  const [searchTerms, setSearchTerms] = useState([]);
  const [totalOccurrences, setTotalOccurrences] = useState(0);
  const [isSmartSearch, setIsSmartSearch] = useState(false);

  const getHighlightedText = useCallback((text, highlights) => {
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
  }, []);

  const limitText = useCallback((text, limit = 200) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + `...` : text;
  }, []);

  const getHighlightedTruncatedText = useCallback(
    (text, highlights, contextLength = 30) => {
      if (!highlights || !text) return text;

      const highlightChunks = highlights.flatMap(
        (highlight, highlightIndex) => {
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
        }
      );

      return highlightChunks.length > 0 ? highlightChunks : text;
    },
    []
  );

  const handleSearch = async (inputValue) => {
    if (inputValue.trim()) {
      setQuery(inputValue);
      setLoading(true);
      setResults([]);
      setError(null);
      const startTime = Date.now();

      try {
        const response = await axios.post(
          "https://api.forumconhecimento.com/smartsearch",
          {
            query: inputValue,
          }
        );
        const endTime = Date.now();
        setSearchTime(endTime - startTime);

        setSearchTerms(response.data.searchTerms);

        const hits = response.data.hits.hits;

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

  return (
    <MainLayout>
      <div className="p-4 h-screen overflow-y-auto">
        <SearchInput
          onSearch={handleSearch}
          isSmartSearch={isSmartSearch}
          setIsSmartSearch={setIsSmartSearch}
        />
        <div className="flex flex-col sm:flex-row justify-between">
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
          <Results
            results={results}
            searchTerms={searchTerms}
            getHighlightedText={getHighlightedText}
            limitText={limitText}
            getHighlightedTruncatedText={getHighlightedTruncatedText}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
