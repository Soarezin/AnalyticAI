import React from "react";
import { NavLink } from "react-router-dom";
import { Library, Folder, Settings, CreditCard } from "lucide-react";
import { ROUTES } from "../../routes.jsx";

const items = [
  { to: ROUTES.library, label: "Library", icon: Library },
  { to: ROUTES.collections, label: "Collections", icon: Folder },
  { to: ROUTES.pricing, label: "Pricing", icon: CreditCard },
  { to: ROUTES.settings, label: "Settings", icon: Settings }
];

export default function AppSidebar() {
  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white/80 px-4 py-6 shadow-sm lg:block">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">AnalyticsAI</div>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">Painel</h1>
      </div>
      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-indigo-50 hover:text-indigo-700 ${
                isActive ? "bg-indigo-100 text-indigo-700" : "text-slate-600"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
