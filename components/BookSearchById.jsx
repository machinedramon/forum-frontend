// components/BookSearchById.jsx
"use client";
import React, { useContext, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { BookContext } from "../context/BookContext";
import { useRouter } from "next/navigation";

const BookSearchById = () => {
  const { getBookById, loading } = useContext(BookContext);
  const [id, setId] = useState("");
  const router = useRouter();

  const handleSearch = async () => {
    const book = await getBookById(id);
    if (book) {
      router.push(`/book/${id}`);
    }
  };

  return (
    <div className="search-container">
      <Input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Enter book ID..."
        fullWidth
      />
      <Button onPress={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

export default BookSearchById;
