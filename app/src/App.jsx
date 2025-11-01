import React from "react";
import { Toaster } from "sonner";
import AppRoutes from "./routes.jsx";
import AppSidebar from "./components/layout/AppSidebar.jsx";
import AppHeader from "./components/layout/AppHeader.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <AppRoutes />
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
