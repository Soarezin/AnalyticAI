import React from "react";
import useAnalysisStore from "../../store/useAnalysisStore.js";
import { Button } from "../ui/button.jsx";
import IssueTag from "./IssueTag.jsx";

export default function Inspector() {
  const { document, selectedIssueId } = useAnalysisStore((state) => ({
    document: state.document,
    selectedIssueId: state.selectedIssueId
  }));

  const issue = document?.analysis?.issues?.find((item) => item.id === selectedIssueId);

  if (!issue) {
    return <p className="text-sm text-slate-500">Selecione uma issue para visualizar detalhes.</p>;
  }

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Detalhes</h3>
        <IssueTag issue={issue} />
      </div>
      <p className="text-sm text-slate-600">{issue.explanation}</p>
      <div className="rounded-xl bg-slate-100 p-3 text-xs text-slate-500">
        <p className="font-semibold text-slate-700">Trecho</p>
        <p className="mt-1 italic">“{issue.textSnippet}”</p>
      </div>
      <div className="rounded-xl bg-slate-100 p-3 text-xs text-slate-500">
        <p className="font-semibold text-slate-700">Regra</p>
        <p className="mt-1">{issue.rule}</p>
      </div>
      <Button variant="outline" className="w-full border-amber-200 text-amber-700">
        Ver no PDF
      </Button>
      <p className="text-xs text-slate-400">TODO: Scroll automático para coordenadas precisas no PDF.</p>
    </div>
  );
}
