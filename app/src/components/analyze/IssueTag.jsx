import React from "react";
import { Badge } from "../ui/badge.jsx";

const severityVariant = {
  low: "success",
  medium: "warning",
  high: "danger"
};

export default function IssueTag({ issue }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={severityVariant[issue.severity] ?? "default"}>{issue.severity}</Badge>
      <Badge variant="outline">{issue.type.replace(/_/g, " ")}</Badge>
    </div>
  );
}
