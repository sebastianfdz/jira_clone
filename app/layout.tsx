import { ClientProvider } from "./clientProvider";
import { ClerkProvider } from "@clerk/nextjs/app-beta";
import { Toaster } from "react-hot-toast";

import "@/styles/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ClientProvider>
        <html lang="en">
          <body>
            {children}
            <Toaster
              position="bottom-left"
              reverseOrder={false}
              containerStyle={{
                height: "92vh",
                marginLeft: "3vw",
              }}
            />
          </body>
        </html>
      </ClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
