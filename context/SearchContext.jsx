import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState(null);

  const search = async (query) => {
    setLoading(true);
    setSearchTime(null);
    try {
      const startTime = performance.now();
      const response = await axios.post("http://52.0.192.118:9910/search", {
        query,
      });
      const endTime = performance.now();
      setSearchTime(endTime - startTime);
      setResults(response.data);
    } catch (error) {
      console.error("Error during search:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider value={{ results, loading, search, searchTime }}>
      {children}
    </SearchContext.Provider>
  );
};
