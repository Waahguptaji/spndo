"use client";

import React, { useEffect, useState } from "react";
import Calendar from "../ui/calendar";
import FormInput from "../ui/FormInput";
import CategoryChip from "../ui/CategoryChip";
import Modal from "../ui/Modal";
import { Plus } from "lucide-react";
import Button from "../ui/Button";

type FormKind = "expense" | "income";

type Category = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

const expenseCategories: Category[] = [
  { id: "food", label: "Food" },
  { id: "shopping", label: "Shopping" },
  { id: "transport", label: "Transport" },
  { id: "rent", label: "Rent" },
];

const incomeCategories: Category[] = [
  { id: "salary", label: "Salary" },
  { id: "freelance", label: "Freelance" },
  { id: "interest", label: "Interest" },
  { id: "bonus", label: "Bonus" },
];

type TransactionFormProps = {
  kind: FormKind; // required: "expense" | "income"
};

function TransactionForm({ kind }: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [expenseCats, setExpenseCats] = useState<Category[]>(expenseCategories);
  const [incomeCats, setIncomeCats] = useState<Category[]>(incomeCategories);

  // NEW: add-category modal state
  const [openAddCat, setOpenAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  useEffect(() => setSelectedId(null), [kind]);

  const categories = kind === "expense" ? expenseCats : incomeCats;

  const openAddCategory = () => {
    setNewCatName("");
    setOpenAddCat(true);
  };

  function addCategory() {
    const label = newCatName.trim();
    if (!label) {
      return;
    }

    const slugify = (s: string) => {
      return s
        .toLowerCase()
        .trim()
        .replace(/[^\w]+/g, "-")
        .replace(/(^-|-$)/g, "");
    };

    const base = slugify(label) || `cat-${Date.now()}`;
    let id = base;
    let i = 2;
    const exists = (x: string) => categories.some((c) => c.id === x);
    while (exists(id)) {
      id = `${base}-${i++}`;
    }

    const newCat: Category = { id, label };
    if (kind === "expense") {
      setExpenseCats((prev) => [...prev, newCat]);
    } else {
      setIncomeCats((prev) => [...prev, newCat]);
    }

    setSelectedId(id);
    setOpenAddCat(false);
    setNewCatName("");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // submit { kind, title, amount, categoryId: selectedId, date: ... }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Calendar variant="week" />

      <FormInput
        label={kind === "expense" ? "Expense Title" : "Income Title"}
        placeholder={kind === "expense" ? "Dinner, Uber…" : "Salary, Gift…"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <FormInput
        label="Amount"
        inputMode="numeric"
        placeholder="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        suffixText="₹"
      />

      <div className="space-y-2">
        <div className="text-sm font-medium text-neutral-grey2 dark:text-neutral-grey3">
          {kind === "expense" ? "Expense Category" : "Income Category"}
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={openAddCategory}
            className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed
                       border-neutral-softGrey1 dark:border-neutral-grey1
                       text-neutral-grey2 dark:text-neutral-grey3
                       hover:border-neutral-grey2 hover:text-neutral-dark1
                       focus:outline-none focus:ring-2 focus:ring-primary-brand/60 focus:ring-offset-2
                       dark:focus:ring-offset-neutral-dark2"
            aria-label="Add category"
            title="Add category"
          >
            <Plus className="h-5 w-5" />
          </button>

          {categories.map((c) => (
            <CategoryChip
              key={c.id}
              label={c.label}
              selected={selectedId === c.id}
              onClick={() =>
                setSelectedId((prev) => (prev === c.id ? null : c.id))
              }
            />
          ))}
        </div>
      </div>

      <Modal
        className="p-4"
        open={openAddCat}
        onClose={() => setOpenAddCat(false)}
        title="Add Category"
      >
        <div className="space-y-4">
          <FormInput
            label="Category name"
            placeholder="e.g., Rewards"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenAddCat(false)}
              className="px-4 py-2 rounded-lg border border-neutral-softGrey1 dark:border-neutral-grey1 hover:bg-neutral-softGrey1 dark:hover:bg-neutral-dark1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addCategory}
              disabled={!newCatName.trim()}
              className="px-4 py-2 rounded-lg bg-primary-brand text-white disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>

      <div className="pt-2">
        <Button type="submit" variant="primary" fullWidth>
          {kind === "expense" ? "Add Expense" : "Add Income"}
        </Button>
      </div>
    </form>
  );
}

export default TransactionForm;
