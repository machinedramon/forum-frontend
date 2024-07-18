// context/BookContext.jsx
"use client";
import React, { createContext, useState } from "react";
import meilisearchClient from "../utils/meilisearchClient";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async (query) => {
    setLoading(true);
    try {
      const index = meilisearchClient.index("livros");
      const searchResult = await index.search(query, {
        limit: 10,
      });
      setBooks(searchResult.hits);
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBookById = async (id) => {
    setLoading(true);
    try {
      const index = meilisearchClient.index("livros");
      const searchResult = await index.search("", {
        filter: `id = ${id}`,
      });
      if (searchResult.hits.length > 0) {
        setSelectedBook(searchResult.hits[0]);
      } else {
        setSelectedBook(null);
      }
    } catch (error) {
      console.error("Error fetching book by ID:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider
      value={{
        selectedBook,
        setSelectedBook,
        books,
        searchBooks,
        getBookById,
        loading,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
