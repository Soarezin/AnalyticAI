import React from "react";
import { useParams } from "react-router-dom";
import PdfViewer from "../lib/pdf/PdfViewer.jsx";
import SummaryCard from "../components/analyze/SummaryCard.jsx";
import IssuesList from "../components/analyze/IssuesList.jsx";
import DeadlinesPanel from "../components/analyze/DeadlinesPanel.jsx";
import Inspector from "../components/analyze/Inspector.jsx";
import useAnalysisStore from "../store/useAnalysisStore.js";
import { Button } from "../components/ui/button.jsx";

export default function Analyze() {
  const { id } = useParams();
  const { document, fetchDocument, loading, selectedIssueId } = useAnalysisStore((state) => ({
    document: state.document,
    fetchDocument: state.fetchDocument,
    loading: state.loading,
    selectedIssueId: state.selectedIssueId
  }));

  React.useEffect(() => {
    if (id) {
      fetchDocument(id);
    }
    return () => useAnalysisStore.getState().clear();
  }, [id, fetchDocument]);

  if (loading || !document) {
    return <div className="text-sm text-slate-500">Carregando análise...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{document.filename}</h2>
            <p className="text-sm text-slate-500">Visualize o PDF e explore os destaques da análise.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              if (document.storageUrl) {
                window.open(document.storageUrl, "_blank");
              }
            }}
            disabled={!document.storageUrl}
          >
            Abrir original
          </Button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <PdfViewer src={document.storageUrl} highlights={document.analysis?.issues ?? []} activeIssueId={selectedIssueId} />
        </div>
      </div>
      <div className="space-y-4">
        <SummaryCard />
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Issues detectadas</h3>
          <IssuesList />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Prazos sugeridos</h3>
          <DeadlinesPanel />
        </div>
        <Inspector />
      </div>
    </div>
  );
}
