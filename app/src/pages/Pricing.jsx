import React from "react";
import { Check } from "lucide-react";
import client from "../api/client.js";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Input } from "../components/ui/input.jsx";
import PlanBadge from "../components/common/PlanBadge.jsx";
import { toast } from "sonner";

const plans = [
  {
    id: "FREE",
    title: "Free",
    price: "R$0",
    description: "Para validar o fluxo de análise",
    features: ["10 análises/dia", "Upload de PDFs", "Resumo automático"],
    cta: "Falar com vendas"
  },
  {
    id: "PRO",
    title: "Pro",
    price: "R$199",
    description: "Para equipes jurídicas enxutas",
    features: ["30 análises/dia", "Tags e coleções", "Exportação CSV"],
    cta: "Assinar PRO"
  },
  {
    id: "ULTRA",
    title: "Ultra",
    price: "R$499",
    description: "Para operações jurídicas complexas",
    features: ["100 análises/dia", "Integrações personalizadas", "SLA dedicado"],
    cta: "Conversar"
  }
];

export default function Pricing() {
  const [apiKey, setApiKey] = React.useState(localStorage.getItem("analyticsai_api_key") ?? "");
  const [status, setStatus] = React.useState(null);

  const handleSave = async () => {
    localStorage.setItem("analyticsai_api_key", apiKey);
    try {
      const { data } = await client.get("/documents", { params: { page: 1, pageSize: 1 } });
      setStatus({ plan: data.meta?.plan, remainingToday: data.meta?.remainingToday });
      toast.success("API key validada");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível validar a API key");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-slate-900">Planos</h2>
        <p className="text-sm text-slate-500">Escolha o plano que acompanha o ritmo da sua operação jurídica.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={plan.id === "PRO" ? "border-brand shadow-lg" : undefined}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plan.title}</span>
                {plan.id === "PRO" && <span className="rounded-full bg-brand px-2 py-1 text-xs text-white">Mais popular</span>}
              </CardTitle>
              <p className="text-2xl font-bold text-slate-900">{plan.price}</p>
              <p className="text-sm text-slate-500">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full">{plan.cta}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configurar API key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-500">Salve a sua API key para usar o painel e a API pública.</p>
          <Input value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="ex: pro_key_123" />
          <div className="flex items-center gap-3">
            <Button onClick={handleSave}>Salvar e validar</Button>
            <PlanBadge />
            {status && <span className="text-xs text-slate-500">{status.plan} · {status.remainingToday} restantes hoje</span>}
          </div>
        </CardContent>
      </Card>
      <p className="text-xs text-slate-400">TODO: checkout real com Stripe e upgrade automático de plano.</p>
    </div>
  );
}
