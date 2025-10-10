import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import store, { persistor } from "./store/store";
import { Provider as ReduxProvider } from "react-redux"; // Redux Provider
import "./index.css";
import App from "./App.tsx";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      </PersistGate>
    </ReduxProvider>
  </StrictMode>
);