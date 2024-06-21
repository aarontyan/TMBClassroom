import React, { createContext, useState, useContext, ReactNode } from "react";

interface SubmitContextType {
  isSubmitted: boolean;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubmitContext = createContext<SubmitContextType | undefined>(undefined);

export const useSubmit = (): SubmitContextType => {
  const context = useContext(SubmitContext);
  if (context === undefined) {
    throw new Error("useSubmit must be used within a SubmitProvider");
  }
  return context;
};

interface SubmitProviderProps {
  children: ReactNode;
}

export const SubmitProvider: React.FC<SubmitProviderProps> = ({ children }) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  return (
    <SubmitContext.Provider value={{ isSubmitted, setIsSubmitted }}>
      {children}
    </SubmitContext.Provider>
  );
};
