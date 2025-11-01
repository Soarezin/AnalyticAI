import React, { useEffect, useRef } from "react";
import { usePdf } from "./usePdf.js";

export default function PdfViewer({ src, highlights = [], activeIssueId }) {
  const containerRef = useRef(null);
  const { doc, loading, error } = usePdf({ url: src });

  useEffect(() => {
    if (!doc || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = "";

    const renderPages = async () => {
      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.className = "mb-6 rounded-lg border border-slate-200 shadow";
        container.appendChild(canvas);
        await page.render({ canvasContext: context, viewport }).promise;

        const pageHighlights = highlights.filter((highlight) => highlight.page === pageNumber);
        if (pageHighlights.length) {
          const overlay = document.createElement("div");
          overlay.className = "pointer-events-none absolute left-0 top-0";
          overlay.style.width = `${viewport.width}px`;
          overlay.style.height = `${viewport.height}px`;
          overlay.style.transform = canvas.style.transform;
          overlay.style.position = "absolute";
          overlay.style.top = `${canvas.offsetTop}px`;
          overlay.style.left = `${canvas.offsetLeft}px`;
          overlay.style.zIndex = "10";

          pageHighlights.forEach((highlight) => {
            const rect = document.createElement("div");
            const [x1, y1, x2, y2] = highlight.coordinates?.[0] ?? [];
            if ([x1, y1, x2, y2].some((value) => value == null)) {
              return;
            }
            rect.className = `absolute rounded bg-amber-300/40 border border-amber-400/70 transition ${
              activeIssueId === highlight.id ? "ring-2 ring-amber-500" : ""
            }`;
            rect.style.left = `${x1}px`;
            rect.style.top = `${viewport.height - y2}px`;
            rect.style.width = `${x2 - x1}px`;
            rect.style.height = `${y2 - y1}px`;
            overlay.appendChild(rect);
          });

          container.appendChild(overlay);
        }
      }
    };

    renderPages();
  }, [doc, highlights, activeIssueId]);

  if (loading) {
    return <div className="flex h-full items-center justify-center text-sm text-slate-500">Carregando PDF...</div>;
  }

  if (error) {
    return <div className="text-sm text-rose-600">Erro ao carregar PDF.</div>;
  }

  return <div ref={containerRef} className="relative" />;
}
