import React from "react";
import client from "../api/client.js";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { formatBytes } from "../lib/utils.js";

export default function Settings() {
  const [apiKey] = React.useState(localStorage.getItem("analyticsai_api_key"));
  const [baseUrl] = React.useState(import.meta.env.VITE_API_BASE ?? "http://localhost:5175/api");
  const [stats, setStats] = React.useState({ totalSize: 0, count: 0 });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await client.get("/documents", { params: { page: 1, pageSize: 50 } });
        const totalSize = data.items.reduce((acc, doc) => acc + (doc.size_bytes ?? 0), 0);
        setStats({ totalSize, count: data.total });
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Configurações</h2>
        <p className="text-sm text-slate-500">Ajuste integrações e credenciais para o seu workspace.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>API pública</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-500">Use a API para processar documentos de forma programática.</p>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Base URL</span>
            <p className="text-sm font-mono text-slate-700">{baseUrl}</p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Exemplo de cURL</span>
            <pre className="rounded-xl bg-slate-900/90 p-4 text-xs text-slate-100">
              curl -X POST {baseUrl}/analyze -H "x-api-key: {apiKey}" -d '{{...}}'
            </pre>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">API key</span>
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">
              {apiKey ?? "Nenhuma chave"}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(apiKey ?? "")}>Copiar chave</Button>
          <p className="text-xs text-slate-400">TODO: suporte a múltiplas chaves e rotação automática.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Armazenamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-500">PDFs são salvos no bucket Supabase Storage.</p>
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
            {stats.count} documentos · {formatBytes(stats.totalSize)}
          </div>
          <p className="text-xs text-slate-400">TODO: exibir progresso por bucket e permitir exclusão permanente.</p>
        </CardContent>
      </Card>
    </div>
  );
}
