import React from "react";
import { Input } from "../ui/input.jsx";
import { Select } from "../ui/select.jsx";
import { Button } from "../ui/button.jsx";

export default function Filters({
  query,
  collectionId,
  tagIds,
  order,
  collections,
  tags,
  onChange,
  onClear
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <div className="md:col-span-2">
        <Input
          placeholder="Buscar por nome ou resumo"
          value={query}
          onChange={(event) => onChange({ query: event.target.value })}
        />
      </div>
      <Select
        value={collectionId}
        onChange={(event) => onChange({ collectionId: event.target.value })}
      >
        <option value="">Todas coleções</option>
        {collections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.name}
          </option>
        ))}
      </Select>
      <Select
        multiple
        icon={false}
        value={tagIds}
        onChange={(event) => {
          const options = Array.from(event.target.selectedOptions)
            .map((option) => option.value)
            .filter(Boolean);
          onChange({ tagIds: options });
        }}
      >
        <option value="">Todas tags</option>
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </Select>
      <Select value={order} onChange={(event) => onChange({ order: event.target.value })}>
        <option value="created_desc">Mais recentes</option>
        <option value="created_asc">Mais antigos</option>
        <option value="alpha_asc">A-Z</option>
        <option value="alpha_desc">Z-A</option>
      </Select>
      <div className="md:col-span-4">
        <Button variant="ghost" onClick={onClear} className="text-sm text-slate-500">
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}
