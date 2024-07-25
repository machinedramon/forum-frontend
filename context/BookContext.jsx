import React, { createContext, useState } from "react";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <BookContext.Provider
      value={{
        selectedBook,
        setSelectedBook,
        books,
        setBooks,
        loading,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
