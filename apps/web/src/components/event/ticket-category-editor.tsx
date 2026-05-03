// [REFACTOR] Extracted from create-event.tsx and update-event.tsx
// Previously, identical ~40 lines of ticket category form logic were copy-pasted
// in both files. Now they share this single component.

import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
import { Plus, X } from "lucide-react";
import type { TicketCategoryForm } from "./types";

interface TicketCategoryEditorProps {
  categories: TicketCategoryForm[];
  onChange: (categories: TicketCategoryForm[]) => void;
  /** ID prefix for input elements — ensures unique IDs when multiple instances exist */
  idPrefix?: string;
}

export default function TicketCategoryEditor({
  categories,
  onChange,
  idPrefix = "cat",
}: TicketCategoryEditorProps) {
  const addCategory = () => {
    onChange([...categories, { name: "", price: "", quantity: "" }]);
  };

  const removeCategory = (index: number) => {
    onChange(categories.filter((_, i) => i !== index));
  };

  const updateCategory = (
    index: number,
    field: keyof TicketCategoryForm,
    value: string
  ) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div>
      <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Kategori Tiket (TICKET_CATEGORY)
      </Label>
      <div className="space-y-2 mt-1">
        {categories.map((cat, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Input
                id={`${idPrefix}-cat-name-${index}`}
                type="text"
                placeholder="Nama kategori"
                value={cat.name}
                onChange={(e) =>
                  updateCategory(index, "name", e.target.value)
                }
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeCategory(index)}
                className="shrink-0 p-1 rounded-full text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Remove category"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <Input
                id={`${idPrefix}-cat-price-${index}`}
                type="number"
                placeholder="Harga"
                value={cat.price}
                onChange={(e) =>
                  updateCategory(index, "price", e.target.value)
                }
              />
              <Input
                id={`${idPrefix}-cat-qty-${index}`}
                type="number"
                placeholder="Jumlah"
                value={cat.quantity}
                onChange={(e) =>
                  updateCategory(index, "quantity", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addCategory}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        Tambah Kategori
      </button>
    </div>
  );
}
