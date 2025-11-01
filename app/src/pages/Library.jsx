import React from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Filters from "../components/library/Filters.jsx";
import DocumentCard from "../components/library/DocumentCard.jsx";
import DocumentRow from "../components/library/DocumentRow.jsx";
import EmptyState from "../components/library/EmptyState.jsx";
import CollectionSelect from "../components/library/CollectionSelect.jsx";
import TagSelector from "../components/library/TagSelector.jsx";
import useLibraryStore from "../store/useLibraryStore.js";
import { Button } from "../components/ui/button.jsx";
import UploadDialog from "../components/library/UploadDialog.jsx";
import client from "../api/client.js";

export default function Library() {
  const [view, setView] = React.useState("grid");
  const [searchParams] = useSearchParams();
  const {
    documents,
    total,
    page,
    pageSize,
    query,
    collectionId,
    tagIds,
    order,
    collections,
    tags,
    loading,
    fetchDocuments,
    fetchCollections,
    fetchTags,
    setFilters
  } = useLibraryStore();
  const [collectionModal, setCollectionModal] = React.useState({ open: false, document: null });
  const [tagsModal, setTagsModal] = React.useState({ open: false, document: null });
  const [uploadOpen, setUploadOpen] = React.useState(false);

  React.useEffect(() => {
    const initialQuery = searchParams.get("query");
    if (initialQuery) {
      setFilters({ query: initialQuery });
    }
    fetchCollections();
    fetchTags();
  }, [fetchCollections, fetchTags, searchParams, setFilters]);

  React.useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, query, collectionId, tagIds, order, page, pageSize]);

  const handleFiltersChange = (next) => {
    setFilters({ ...next, page: 1 });
    fetchDocuments({ page: 1 });
  };

  const handleClear = () => {
    setFilters({ query: "", collectionId: "", tagIds: [], order: "created_desc", page: 1 });
    fetchDocuments({ page: 1 });
  };

  const handleMove = async (documentId, nextCollectionId) => {
    try {
      await client.post(`/documents/${documentId}/move`, { collectionId: nextCollectionId });
      toast.success("Documento movido");
      await fetchDocuments();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível mover o documento");
    }
  };

  const handleTags = async (documentId, nextTags) => {
    try {
      await client.post(`/documents/${documentId}/tags`, { tagIds: nextTags });
      toast.success("Tags atualizadas");
      await fetchDocuments();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar as tags");
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await client.delete(`/documents/${documentId}`);
      toast.success("Documento removido");
      await fetchDocuments();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível remover");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Biblioteca</h2>
          <p className="text-sm text-slate-500">Gerencie seus contratos, coleções e tags.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "secondary" : "outline"}
            onClick={() => setView("grid")}
            className="text-xs"
          >
            Grid
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "outline"}
            onClick={() => setView("list")}
            className="text-xs"
          >
            Lista
          </Button>
          <Button onClick={() => setUploadOpen(true)}>Upload</Button>
        </div>
      </div>
      <Filters
        query={query}
        collectionId={collectionId}
        tagIds={tagIds}
        order={order}
        collections={collections}
        tags={tags}
        onChange={handleFiltersChange}
        onClear={handleClear}
      />
      {loading && <p className="text-sm text-slate-500">Carregando...</p>}
      {!loading && !documents.length && <EmptyState onUpload={() => setUploadOpen(true)} />}
      {!loading && documents.length && (
        <div className="grid gap-4">
          {view === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onMove={() => setCollectionModal({ open: true, document })}
                  onTag={() => setTagsModal({ open: true, document })}
                  onDelete={() => handleDelete(document.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <DocumentRow
                  key={document.id}
                  document={document}
                  onMove={() => setCollectionModal({ open: true, document })}
                  onTag={() => setTagsModal({ open: true, document })}
                  onDelete={() => handleDelete(document.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <CollectionSelect
        open={collectionModal.open}
        onOpenChange={(open) => setCollectionModal((prev) => ({ ...prev, open }))}
        collections={collections}
        value={collectionModal.document?.collection?.id ?? ""}
        onSubmit={(collectionIdValue) => {
          setCollectionModal({ open: false, document: null });
          handleMove(collectionModal.document?.id, collectionIdValue);
        }}
      />
      <TagSelector
        open={tagsModal.open}
        onOpenChange={(open) => setTagsModal((prev) => ({ ...prev, open }))}
        tags={tags}
        value={tagsModal.document?.tags?.map((tag) => tag.id) ?? []}
        onSubmit={(tagIdsValue) => {
          setTagsModal({ open: false, document: null });
          if (tagsModal.document?.id) {
            handleTags(tagsModal.document.id, tagIdsValue);
          }
        }}
      />
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
      <p className="text-xs text-slate-400">TODO: Paginação real e criação rápida de tags/coleções inline.</p>
    </div>
  );
}
