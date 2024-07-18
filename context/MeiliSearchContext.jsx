// context/MeiliSearchContext.js
"use client";
import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const MeiliSearchContext = createContext();

export const useMeiliSearch = () => useContext(MeiliSearchContext);

export const MeiliSearchProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState(null);

  const search = async (query) => {
    setLoading(true);
    try {
      const start = performance.now();
      const response = await axios.get(
        "http://52.0.192.118:7700/indexes/livros/search",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY}`,
          },
          params: {
            q: query,
          },
        }
      );
      const end = performance.now();
      setResults(response.data.hits);
      setSearchTime(end - start);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MeiliSearchContext.Provider
      value={{ results, loading, search, searchTime }}
    >
      {children}
    </MeiliSearchContext.Provider>
  );
};
