import { StrictMode } from "react";
import "@fontsource/montserrat/latin.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.scss";
import { TourProviderWrapper } from "@components/Tour/TourSetup";
import { AuthProvider } from "@context/AuthContext";
import { DopamineProvider } from "@context/DopamineContext";
import { NotificationsProvider } from "@context/NotificationsContext";
import { PageTransitionProvider } from "@context/PageTransitionContext";
import { ThemeProvider } from "@context/ThemeContext";
import { TodoProvider } from "@context/TodoContext";

import App from "./App.jsx";

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
