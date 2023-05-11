import { ClientProvider } from "./clientProvider";
import { ClerkProvider } from "@clerk/nextjs/app-beta";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ClientProvider>
        <html lang="en">
          <body>{children}</body>

          <Toaster
            position="bottom-left"
            reverseOrder={false}
            containerStyle={{
              height: "92vh",
              marginLeft: "3vw",
            }}
          />
        </html>
      </ClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
