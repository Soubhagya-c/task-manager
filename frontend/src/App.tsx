import { Toaster } from "react-hot-toast";
import AppRouter from "./routes/AppRouter";
import { GlobalLoadingProvider } from "./context/GlobalLoadingContext";
import SessionLoader from "./components/SessionLoader";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
      <GlobalLoadingProvider>
        <AppRouter />
        <SessionLoader />
      </GlobalLoadingProvider>
    </>
  );
}

export default App;
