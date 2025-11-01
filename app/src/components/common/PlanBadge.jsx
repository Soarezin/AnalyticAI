import React from "react";
import { Badge } from "../ui/badge.jsx";
import useLibraryStore from "../../store/useLibraryStore.js";

export default function PlanBadge() {
  const { plan, remainingToday } = useLibraryStore((state) => ({
    plan: state.plan,
    remainingToday: state.remainingToday
  }));

  if (!plan) {
    return <Badge variant="outline">Sem plano</Badge>;
  }

  return (
    <Badge className="bg-indigo-600 text-white">
      {plan} · {remainingToday ?? "∞"} restantes hoje
    </Badge>
  );
}
