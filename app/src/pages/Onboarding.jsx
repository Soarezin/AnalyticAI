import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes.jsx";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { Input } from "../components/ui/input.jsx";
import UploadDialog from "../components/library/UploadDialog.jsx";
import CalendarConnectBanner from "../components/common/CalendarConnectBanner.jsx";

export default function Onboarding() {
  const [apiKey, setApiKey] = React.useState(localStorage.getItem("analyticsai_api_key") ?? "");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Cole sua API key",
      description: "Use a chave fornecida no painel de desenvolvedores para autenticar suas requisições.",
      action: (
        <div className="space-y-3">
          <Input value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="ex: pro_key_123" />
          <Button
            onClick={() => {
              localStorage.setItem("analyticsai_api_key", apiKey);
              navigate(ROUTES.library);
            }}
          >
            Salvar e continuar
          </Button>
        </div>
      )
    },
    {
      title: "Faça upload de um PDF",
      description: "Teste a análise automática enviando um contrato real ou um exemplo do seu time jurídico.",
      action: (
        <Button onClick={() => setUploadOpen(true)} className="w-full">
          Selecionar arquivo
        </Button>
      )
    },
    {
      title: "Crie um prazo",
      description: "Envie um prazo detectado para o calendário e mantenha todo o time alinhado.",
      action: (
        <CalendarConnectBanner onConnect={() => navigate(ROUTES.pricing)} />
      )
    }
  ];

  return (
    <div className="mx-auto grid max-w-4xl gap-6 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Boas-vindas ao AnalyticsAI</h1>
        <p className="mt-2 text-sm text-slate-500">
          Configure sua conta em três passos e explore insights automatizados para contratos e documentos jurídicos.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title} className="flex flex-col">
            <CardHeader>
              <CardTitle>
                {index + 1}. {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between">
              <p className="text-sm text-slate-500">{step.description}</p>
              <div className="mt-6">{step.action}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <p className="text-xs text-slate-400">TODO: validar API key no backend durante onboarding.</p>
    </div>
  );
}
