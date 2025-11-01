import React from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Badge } from "../ui/badge.jsx";
import { formatBytes, formatDate } from "../../lib/utils.js";
import { ROUTES } from "../../routes.jsx";

export default function DocumentRow({ document, onMove, onTag, onDelete }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <div className="font-medium text-slate-900">{document.filename}</div>
        <p className="text-xs text-slate-500">{document.lastAnalysisSummary ?? "Sem análise."}</p>
      </div>
      <div className="text-sm text-slate-600">{document.collection?.name ?? "Sem coleção"}</div>
      <div className="flex flex-wrap gap-2">
        {document.tags?.map((tag) => (
          <Badge key={tag.id} variant="outline" style={{ borderColor: tag.color ?? undefined }}>
            {tag.name}
          </Badge>
        ))}
      </div>
      <div className="text-xs text-slate-500">
        {formatDate(document.created_at)} · {formatBytes(document.size_bytes)}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400">{document.status}</span>
        <Button variant="ghost" className="text-xs" onClick={() => onMove?.(document)}>
          Mover
        </Button>
        <Button variant="ghost" className="text-xs" onClick={() => onTag?.(document)}>
          Tags
        </Button>
        <Button variant="outline" className="text-xs" onClick={() => onDelete?.(document)}>
          Remover
        </Button>
        <Button variant="secondary" className="gap-1 text-xs" onClick={() => navigate(ROUTES.analyze(document.id))}>
          Abrir <MoreHorizontal size={14} />
        </Button>
      </div>
    </div>
  );
}
