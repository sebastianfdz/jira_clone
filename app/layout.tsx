import { ClerkProvider } from "@clerk/nextjs/app-beta";
import { type Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Jira Clone 🚀",
  description: "A clone of Jira built with Next.js",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>{children}</body>
      </ClerkProvider>
    </html>
  );
};

export default RootLayout;
