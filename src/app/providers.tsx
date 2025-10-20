"use client";

import { ThemeProvider } from "next-themes";
import { UserContextProvider } from "@/context";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserContextProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </UserContextProvider>
  );
}
