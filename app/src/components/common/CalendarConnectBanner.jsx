import React from "react";
import { CalendarCheck2 } from "lucide-react";
import { Button } from "../ui/button.jsx";

export default function CalendarConnectBanner({ onConnect }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-dashed border-indigo-300 bg-indigo-50 px-6 py-4 text-sm text-indigo-800">
      <div className="flex items-center gap-3">
        <CalendarCheck2 size={20} />
        <div>
          <p className="font-semibold">Conecte seu calendário</p>
          <p className="text-xs text-indigo-700">
            Sincronize prazos e lembretes com seu Google Calendar (stub).
          </p>
        </div>
      </div>
      <Button variant="outline" onClick={onConnect} className="border-indigo-300 text-indigo-700">
        Conectar
      </Button>
    </div>
  );
}
