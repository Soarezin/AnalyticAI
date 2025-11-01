import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog.jsx";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Select } from "../ui/select.jsx";
import { toast } from "sonner";
import client from "../../api/client.js";
import useLibraryStore from "../../store/useLibraryStore.js";

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function UploadDialog({ open, onOpenChange }) {
  const fileInputRef = React.useRef(null);
  const { collections, tags, fetchDocuments, fetchCollections, fetchTags } = useLibraryStore();
  const [loading, setLoading] = React.useState(false);
  const [collectionId, setCollectionId] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState(new Set());

  React.useEffect(() => {
    if (open) {
      fetchCollections();
      fetchTags();
    } else {
      setCollectionId("");
      setSelectedTags(new Set());
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open, fetchCollections, fetchTags]);

  const handleSelectTag = (tagId) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Selecione um arquivo PDF");
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("Apenas PDFs são aceitos");
      return;
    }

    setLoading(true);
    try {
      const base64 = await readFileAsBase64(file);
      const { data } = await client.post("/analyze", {
        fileBase64: base64,
        filename: file.name,
        collectionId: collectionId || null,
        tagIds: Array.from(selectedTags),
        options: {
          detectAbusiveClauses: true,
          detectDeadlines: true,
          validateData: true
        }
      });
      toast.success("Análise concluída");
      await fetchDocuments();
      onOpenChange(false);
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar documento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload de documento</DialogTitle>
          <DialogDescription>Envie um PDF para análise instantânea.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleUpload}>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" id="upload-input" />
            <label htmlFor="upload-input" className="cursor-pointer font-medium text-indigo-600">
              Clique para selecionar um PDF
            </label>
            <p className="text-xs text-slate-400">Tamanho máximo recomendado: 20MB.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Coleção</label>
            <Select value={collectionId} onChange={(event) => setCollectionId(event.target.value)}>
              <option value="">Sem coleção</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = selectedTags.has(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleSelectTag(tag.id)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      active ? "border-indigo-500 bg-indigo-100 text-indigo-700" : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
              {!tags.length && <p className="text-xs text-slate-500">Nenhuma tag cadastrada ainda.</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notas</label>
            <Input placeholder="Opcional: descreva o documento" disabled />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Processando..." : "Enviar e analisar"}
          </Button>
        </form>
        <p className="text-xs text-slate-400">TODO: Upload direto para Storage com credenciais temporárias.</p>
      </DialogContent>
    </Dialog>
  );
}
