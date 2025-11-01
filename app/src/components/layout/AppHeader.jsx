import React from "react";
import { Search, Upload } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../ui/input.jsx";
import { Button } from "../ui/button.jsx";
import UploadDialog from "../library/UploadDialog.jsx";
import PlanBadge from "../common/PlanBadge.jsx";
import { ROUTES } from "../../routes.jsx";

export default function AppHeader() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
      <div className="hidden flex-1 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 md:flex">
        <Search size={16} />
        <Input
          placeholder="Buscar documentos e análises"
          className="border-none px-0 shadow-none focus-visible:ring-0"
          onKeyDown={(event) => {
            if (event.key === "Enter" && location.pathname !== ROUTES.library) {
              navigate(ROUTES.library + `?query=${event.currentTarget.value}`);
            }
          }}
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <PlanBadge />
        <Button variant="outline" className="hidden sm:inline-flex" onClick={() => navigate(ROUTES.library)}>
          Biblioteca
        </Button>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Upload size={16} /> Upload
        </Button>
      </div>
      <UploadDialog open={open} onOpenChange={setOpen} />
    </header>
  );
}
