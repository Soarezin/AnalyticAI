import React from "react";
import { Button } from "../ui/button.jsx";
import useAnalysisStore from "../../store/useAnalysisStore.js";
import client from "../../api/client.js";
import { toast } from "sonner";

export default function DeadlinesPanel() {
  const { document } = useAnalysisStore((state) => ({ document: state.document }));
  const [loading, setLoading] = React.useState(false);

  const handleCreateEvent = async (deadline) => {
    setLoading(true);
    try {
      await client.post("/calendar/event", {
        title: `Prazo: ${document.filename}`,
        date: deadline.normalizedDate,
        description: deadline.raw
      });
      toast.success("Evento enviado ao stub do calendário");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível enviar ao calendário");
    } finally {
      setLoading(false);
    }
  };

  if (!document?.analysis?.deadlines?.length) {
    return <p className="text-sm text-slate-500">Nenhum prazo identificado.</p>;
  }

  return (
    <div className="space-y-3">
      {document.analysis.deadlines.map((deadline) => (
        <div key={`${deadline.page}-${deadline.raw}`} className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
          <div className="text-sm font-medium text-indigo-800">{deadline.raw}</div>
          <p className="text-xs text-indigo-600">Página {deadline.page}</p>
          <Button
            variant="outline"
            className="mt-2 border-indigo-200 text-indigo-700"
            onClick={() => handleCreateEvent(deadline)}
            disabled={loading}
          >
            Criar evento
          </Button>
        </div>
      ))}
    </div>
  );
}
