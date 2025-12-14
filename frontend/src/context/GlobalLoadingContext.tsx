import { createContext, useContext, useEffect, useState } from "react";
import { registerLoadingSetter } from "../utils/loadingBridge";

type LoadingContextType = {
  refreshing: boolean;
  setRefreshing: (value: boolean) => void;
};

const GlobalLoadingContext = createContext<LoadingContextType | null>(null);

export const GlobalLoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    registerLoadingSetter(setRefreshing);
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ refreshing, setRefreshing }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};

export const useGlobalLoading = () => {
  const ctx = useContext(GlobalLoadingContext);
  if (!ctx) {
    throw new Error("useGlobalLoading must be used inside provider");
  }
  return ctx;
};
