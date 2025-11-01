import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs.jsx";
import useAnalysisStore from "../../store/useAnalysisStore.js";
import IssueTag from "./IssueTag.jsx";

function categorizeIssues(issues = []) {
  return issues.reduce(
    (acc, issue) => {
      acc[issue.type] = acc[issue.type] ?? [];
      acc[issue.type].push(issue);
      return acc;
    },
    {}
  );
}

const severityOrder = { high: 0, medium: 1, low: 2 };

export default function IssuesList() {
  const { document, selectedIssueId, selectIssue } = useAnalysisStore((state) => ({
    document: state.document,
    selectedIssueId: state.selectedIssueId,
    selectIssue: state.selectIssue
  }));

  const issues = document?.analysis?.issues ?? [];
  const groups = categorizeIssues(issues);
  const firstTab = Object.keys(groups)[0] ?? "todas";

  return (
    <Tabs defaultValue={firstTab} className="w-full">
      <TabsList>
        {Object.keys(groups).map((key) => (
          <TabsTrigger key={key} value={key}>
            {key.replace(/_/g, " ")} ({groups[key].length})
          </TabsTrigger>
        ))}
        {!issues.length && <span className="px-3 text-xs text-slate-400">Nenhuma issue identificada.</span>}
      </TabsList>
      {Object.entries(groups).map(([type, group]) => (
        <TabsContent key={type} value={type} className="mt-4 space-y-3">
          {group
            .slice()
            .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
            .map((issue) => (
              <button
                key={issue.id}
                onClick={() => selectIssue(issue.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  issue.id === selectedIssueId
                    ? "border-amber-400 bg-amber-50"
                    : "border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800">Página {issue.page}</p>
                  <IssueTag issue={issue} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{issue.textSnippet}</p>
              </button>
            ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}
