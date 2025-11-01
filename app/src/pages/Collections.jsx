import React from "react";
import { Plus, Folder, Pencil, Trash } from "lucide-react";
import useLibraryStore from "../store/useLibraryStore.js";
import client from "../api/client.js";
import { Button } from "../components/ui/button.jsx";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog.jsx";
import { Input } from "../components/ui/input.jsx";
import { toast } from "sonner";

function CollectionForm({ open, onOpenChange, collection }) {
  const [name, setName] = React.useState(collection?.name ?? "");
  const [color, setColor] = React.useState(collection?.color ?? "#4338ca");

  React.useEffect(() => {
    setName(collection?.name ?? "");
    setColor(collection?.color ?? "#4338ca");
  }, [collection, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (collection) {
        await client.patch(`/collections/${collection.id}`, { name, color });
        toast.success("Coleção atualizada");
      } else {
        await client.post("/collections", { name, color });
        toast.success("Coleção criada");
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{collection ? "Editar coleção" : "Nova coleção"}</DialogTitle>
          <DialogDescription>Organize seus documentos por área, cliente ou squad.</DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nome</label>
            <Input value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cor</label>
            <Input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
          </div>
          <Button type="submit" className="w-full">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Collections() {
  const { collections, fetchCollections } = useLibraryStore((state) => ({
    collections: state.collections,
    fetchCollections: state.fetchCollections
  }));
  const [formState, setFormState] = React.useState({ open: false, collection: null });

  React.useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleDelete = async (collectionId) => {
    try {
      await client.delete(`/collections/${collectionId}`);
      toast.success("Coleção removida");
      fetchCollections();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível remover");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Coleções</h2>
          <p className="text-sm text-slate-500">Agrupe documentos por contexto e mantenha seu time organizado.</p>
        </div>
        <Button onClick={() => setFormState({ open: true, collection: null })} className="gap-2">
          <Plus size={16} /> Nova coleção
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <div key={collection.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: collection.color ?? "#e0e7ff" }}>
                <Folder size={20} className="text-slate-700" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{collection.name}</h3>
                <p className="text-xs text-slate-500">{collection.documents_count ?? 0} documentos</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="ghost" className="gap-2 text-xs" onClick={() => setFormState({ open: true, collection })}>
                <Pencil size={14} /> Editar
              </Button>
              <Button variant="ghost" className="gap-2 text-xs text-rose-600" onClick={() => handleDelete(collection.id)}>
                <Trash size={14} /> Remover
              </Button>
            </div>
          </div>
        ))}
      </div>
      <CollectionForm
        open={formState.open}
        onOpenChange={(open) => {
          setFormState((prev) => ({ ...prev, open }));
          if (!open) {
            fetchCollections();
          }
        }}
        collection={formState.collection}
      />
      <p className="text-xs text-slate-400">TODO: Paginação e indicadores de uso por coleção.</p>
    </div>
  );
}
