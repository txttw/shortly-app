import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import "./main.css";
import { ThemeProvider } from "@mui/material/styles";
import { DefaultThem } from "./data/theme";
import LoginPage from "./pages/login";
import ImageBackgroundLayout from "./layouts/ImageBackgroundLayout";
import { CssBaseline } from "@mui/material";

import AuthenticatedRoutes from "./AuthenticatedRoutes";
import { store } from "./store";
import { Provider } from "react-redux";
import NotAuthenticatedRoutes from "./NotAuthenticatedRoutes";
import DashboardContainer from "./features/dashboard/components/DashboardContainer";
import UsersPage from "./pages/dashboard/users/list";
import UserEditPage from "./pages/dashboard/users/edit";
import UserCreatePage from "./pages/dashboard/users/create";
import LinksPage from "./pages/dashboard/links/list";
import LinkCreatePage from "./pages/dashboard/links/create";
import LinkEditPage from "./pages/dashboard/links/edit";
import AnalyticsPage from "./pages/dashboard/analytics/list";
import AnalyticsLivePage from "./pages/dashboard/analytics-live/list";
import Dashboard from "./pages/dashboard";
import AnalyticsLinkStatsPage from "./pages/dashboard/analytics/linkStats";
import Page404 from "./pages/404";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={DefaultThem}>
      <CssBaseline />
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Navigate to="/login" />} />
            <Route element={<AuthenticatedRoutes />}>
              <Route path="dashboard" element={<DashboardContainer />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="users/create" element={<UserCreatePage />} />
                <Route path="users/:id/edit" element={<UserEditPage />} />
                <Route path="links" element={<LinksPage />} />
                <Route path="links/create" element={<LinkCreatePage />} />
                <Route path="links/:id/edit" element={<LinkEditPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route
                  path="analytics/links/:id/statistics"
                  element={<AnalyticsLinkStatsPage />}
                />
                <Route path="analytics-live" element={<AnalyticsLivePage />} />
              </Route>
            </Route>
            <Route element={<NotAuthenticatedRoutes />}>
              <Route element={<ImageBackgroundLayout />}>
                <Route path="login" element={<LoginPage />} />
              </Route>
            </Route>
            <Route element={<ImageBackgroundLayout />}>
              <Route path="*" element={<Page404 />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
