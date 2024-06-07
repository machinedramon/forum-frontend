// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { BookProvider } from "@/context/BookContext";
import { LayoutProvider } from "@/context/LayoutContext";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <LayoutProvider>
        <BookProvider>{children}</BookProvider>
      </LayoutProvider>
    </NextUIProvider>
  );
}
