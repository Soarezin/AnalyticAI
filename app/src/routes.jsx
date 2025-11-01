import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Library from "./pages/Library.jsx";
import Analyze from "./pages/Analyze.jsx";
import Collections from "./pages/Collections.jsx";
import Settings from "./pages/Settings.jsx";
import Pricing from "./pages/Pricing.jsx";
import Onboarding from "./pages/Onboarding.jsx";

export const ROUTES = {
  onboarding: "/onboarding",
  library: "/library",
  analyze: (id = ":id") => `/analyze/${id}`,
  collections: "/collections",
  settings: "/settings",
  pricing: "/pricing"
};

function RequireApiKey({ children }) {
  const apiKey = localStorage.getItem("analyticsai_api_key");
  if (!apiKey) {
    return <Navigate to={ROUTES.onboarding} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return useRoutes([
    {
      path: ROUTES.onboarding,
      element: <Onboarding />
    },
    {
      path: ROUTES.library,
      element: (
        <RequireApiKey>
          <Library />
        </RequireApiKey>
      )
    },
    {
      path: ROUTES.analyze(),
      element: (
        <RequireApiKey>
          <Analyze />
        </RequireApiKey>
      )
    },
    {
      path: ROUTES.collections,
      element: (
        <RequireApiKey>
          <Collections />
        </RequireApiKey>
      )
    },
    {
      path: ROUTES.settings,
      element: (
        <RequireApiKey>
          <Settings />
        </RequireApiKey>
      )
    },
    {
      path: ROUTES.pricing,
      element: (
        <RequireApiKey>
          <Pricing />
        </RequireApiKey>
      )
    },
    {
      path: "*",
      element: <Navigate to={ROUTES.library} replace />
    }
  ]);
}
