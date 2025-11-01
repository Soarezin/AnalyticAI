import React from "react";
import { Inbox } from "lucide-react";
import { Button } from "../ui/button.jsx";

export default function EmptyState({ onUpload }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-indigo-300 bg-white/80 p-16 text-center text-slate-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
        <Inbox size={28} />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-slate-900">Comece sua biblioteca</h3>
      <p className="mt-2 max-w-md text-sm">
        Faça upload de contratos e documentos jurídicos para detectar cláusulas abusivas, prazos críticos e inconsistências em instantes.
      </p>
      <Button className="mt-6" onClick={onUpload}>
        Fazer upload
      </Button>
    </div>
  );
}
