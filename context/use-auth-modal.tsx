"use client";
import { type ReactNode, createContext, useContext, useState } from "react";

type AuthModalContextProps = {
  authModalIsOpen: boolean;
  setAuthModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthModalContext = createContext<AuthModalContextProps>({
  authModalIsOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setAuthModalIsOpen: () => {},
});

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [authModalIsOpen, setAuthModalIsOpen] = useState(false);

  return (
    <AuthModalContext.Provider
      value={{
        authModalIsOpen,
        setAuthModalIsOpen,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModalContext = () => useContext(AuthModalContext);
