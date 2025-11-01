import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog.jsx";
import { Button } from "../ui/button.jsx";

export default function TagSelector({ open, onOpenChange, tags, value = [], onSubmit }) {
  const [selected, setSelected] = React.useState(new Set(value));

  React.useEffect(() => {
    setSelected(new Set(value));
  }, [value, open]);

  const toggle = (tagId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerenciar tags</DialogTitle>
          <DialogDescription>Selecione as tags relacionadas a este documento.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = selected.has(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggle(tag.id)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  active ? "border-indigo-500 bg-indigo-100 text-indigo-700" : "border-slate-200 text-slate-600"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
          {!tags.length && <p className="text-sm text-slate-500">Nenhuma tag disponível.</p>}
        </div>
        <Button onClick={() => onSubmit(Array.from(selected))}>Salvar</Button>
      </DialogContent>
    </Dialog>
  );
}
