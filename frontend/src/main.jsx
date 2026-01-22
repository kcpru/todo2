import { StrictMode } from "react";
import "@fontsource/montserrat/latin.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
import { ThemeProvider } from "@context/ThemeContext.jsx";
import { AuthProvider } from "@context/AuthContext.jsx";
import { DopamineProvider } from "@context/DopamineContext.jsx";
import { NotificationsProvider } from "@context/NotificationsContext.jsx";
import { TodoProvider } from "@context/TodoContext.jsx";
import App from "./App.jsx";
import { TourProviderWrapper } from "@components/Tour/TourSetup.jsx";
import { PageTransitionProvider } from "@context/PageTransitionContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <DopamineProvider>
          <NotificationsProvider>
            <TodoProvider>
              <PageTransitionProvider>
                <BrowserRouter>
                  <TourProviderWrapper>
                    <App />
                  </TourProviderWrapper>
                </BrowserRouter>
              </PageTransitionProvider>
            </TodoProvider>
          </NotificationsProvider>
        </DopamineProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
