import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import useAnalysisStore from "../../store/useAnalysisStore.js";

export default function SummaryCard() {
  const { document } = useAnalysisStore((state) => ({ document: state.document }));

  if (!document?.analysis) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da análise</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{document.analysis.summary ?? "Sem resumo disponível."}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Páginas:</span> {document.analysis.meta?.pages ?? document.pages}
          </div>
          <div>
            <span className="font-semibold text-slate-700">Plano:</span> {document.analysis.meta?.plan}
          </div>
          <div>
            <span className="font-semibold text-slate-700">Restantes hoje:</span> {document.analysis.meta?.remainingToday}
          </div>
          <div>
            <span className="font-semibold text-slate-700">Documento:</span> {document.analysis.meta?.documentId}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
