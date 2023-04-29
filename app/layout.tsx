"use client";

import "@/styles/globals.css";
import { ClientProvider } from "./clientProvider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClientProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClientProvider>
  );
};

export default RootLayout;
