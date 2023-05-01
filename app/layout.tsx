import { ClientProvider } from "./clientProvider";
import { ClerkProvider } from "@clerk/nextjs/app-beta";
import "@/styles/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ClientProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </ClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
