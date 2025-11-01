import React from "react";
import { FileText, ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";
import { formatBytes, formatDate } from "../../lib/utils.js";
import { ROUTES } from "../../routes.jsx";
import { useNavigate } from "react-router-dom";

export default function DocumentCard({ document, onDelete, onTag, onMove }) {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{document.filename}</h3>
            <p className="text-xs text-slate-500">
              {formatDate(document.created_at)} · {formatBytes(document.size_bytes)}
            </p>
          </div>
        </div>
        {document.collection ? (
          <Badge variant="outline" className="border-indigo-200 text-indigo-700">
            {document.collection.name}
          </Badge>
        ) : (
          <Badge variant="outline">Sem coleção</Badge>
        )}
        <div className="flex flex-wrap gap-2">
          {document.tags?.map((tag) => (
            <Badge key={tag.id} variant="outline" style={{ borderColor: tag.color ?? undefined }}>
              {tag.name}
            </Badge>
          ))}
          {!document.tags?.length && <span className="text-xs text-slate-400">Sem tags</span>}
        </div>
        <p className="line-clamp-3 text-sm text-slate-600">{document.lastAnalysisSummary ?? "Sem análise disponível."}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-400">Status: {document.status}</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-xs" onClick={() => onMove?.(document)}>
            Mover
          </Button>
          <Button variant="ghost" className="text-xs" onClick={() => onTag?.(document)}>
            Tags
          </Button>
          <Button variant="outline" className="text-xs" onClick={() => onDelete?.(document)}>
            Remover
          </Button>
          <Button className="gap-1 text-xs" onClick={() => navigate(ROUTES.analyze(document.id))}>
            Ver análise <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
