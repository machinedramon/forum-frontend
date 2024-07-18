"use client";

// components/BookSearch.jsx
import React, { useContext, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { BookContext } from "../context/BookContext";

const BookSearch = () => {
  const { searchBooks, loading } = useContext(BookContext);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    searchBooks(query);
  };

  return (
    <div className="search-container">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books..."
        fullWidth
      />
      <Button onPress={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

export default BookSearch;
