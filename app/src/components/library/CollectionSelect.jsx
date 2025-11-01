import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog.jsx";
import { Button } from "../ui/button.jsx";
import { Select } from "../ui/select.jsx";

export default function CollectionSelect({ open, onOpenChange, collections, value, onSubmit }) {
  const [selected, setSelected] = React.useState(value ?? "");

  React.useEffect(() => {
    setSelected(value ?? "");
  }, [value, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mover documento</DialogTitle>
          <DialogDescription>Escolha uma coleção para agrupar o documento.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Select value={selected} onChange={(event) => setSelected(event.target.value)}>
            <option value="">Sem coleção</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </Select>
          <Button onClick={() => onSubmit(selected || null)}>Mover</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
