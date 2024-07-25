// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { BookProvider } from "@/context/BookContext";
import { LayoutProvider } from "@/context/LayoutContext";
import { SearchProvider } from "@/context/SearchContext";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <LayoutProvider>
        <SearchProvider>
          <BookProvider>{children}</BookProvider>
        </SearchProvider>
      </LayoutProvider>
    </NextUIProvider>
  );
}
