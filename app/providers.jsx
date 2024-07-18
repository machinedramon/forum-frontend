// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { BookProvider } from "@/context/BookContext";
import { LayoutProvider } from "@/context/LayoutContext";
import { MeiliSearchProvider } from "@/context/MeiliSearchContext";
import { SearchProvider } from "@/context/SearchContext";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <LayoutProvider>
        <MeiliSearchProvider>
          <SearchProvider>
            <BookProvider>{children}</BookProvider>
          </SearchProvider>
        </MeiliSearchProvider>
      </LayoutProvider>
    </NextUIProvider>
  );
}
