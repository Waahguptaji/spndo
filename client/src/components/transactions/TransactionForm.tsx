"use client";

import React, { useEffect, useState } from "react";
import Calendar from "../ui/calendar";
import FormInput from "../ui/FormInput";
import CategoryChip from "../ui/CategoryChip";
import Modal from "../ui/Modal";
import { Plus } from "lucide-react";
import Button from "../ui/Button";
import { createTransaction } from "@/lib/api/transactions";
import { createCategory, getCategories } from "@/lib/api/categories";

type FormKind = "expense" | "income";

type Category = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

type TransactionFormProps = {
  kind: FormKind;
  initialExpenseCats?: Category[];
  initialIncomeCats?: Category[];
  onSuccess?: () => void | Promise<void>;
};

function TransactionForm({
  kind,
  initialExpenseCats = [],
  initialIncomeCats = [],
  onSuccess,
}: TransactionFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [expenseCats, setExpenseCats] =
    useState<Category[]>(initialExpenseCats);
  const [incomeCats, setIncomeCats] = useState<Category[]>(initialIncomeCats);

  // NEW: add-category modal state
  const [openAddCat, setOpenAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => setSelectedId(null), [kind]);

  useEffect(() => {
    if (initialExpenseCats.length > 0 || initialIncomeCats.length > 0) {
      return;
    }

    const loadCategories = async () => {
      try {
        const res = await getCategories();
        setExpenseCats(
          res.categories
            .filter((category) => category.type === "EXPENSE")
            .map((category) => ({ id: category.id, label: category.name })),
        );
        setIncomeCats(
          res.categories
            .filter((category) => category.type === "INCOME")
            .map((category) => ({ id: category.id, label: category.name })),
        );
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    loadCategories();
  }, [initialExpenseCats.length, initialIncomeCats.length]);

  const categories = kind === "expense" ? expenseCats : incomeCats;

  const openAddCategory = () => {
    setNewCatName("");
    setOpenAddCat(true);
  };

  async function addCategory() {
    const label = newCatName.trim();
    if (!label) {
      return;
    }

    try {
      setIsCreatingCategory(true);
      const res = await createCategory({
        name: label,
        type: kind === "expense" ? "EXPENSE" : "INCOME",
      });

      const newCat: Category = {
        id: res.category.id,
        label: res.category.name,
      };

      if (kind === "expense") {
        setExpenseCats((prev) => [...prev, newCat]);
      } else {
        setIncomeCats((prev) => [...prev, newCat]);
      }

      setSelectedId(newCat.id);
      setOpenAddCat(false);
      setNewCatName("");
    } catch (error) {
      console.error("Failed to create category", error);
    } finally {
      setIsCreatingCategory(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) {
      return;
    }

    if (!amount || Number.isNaN(parseFloat(amount))) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log({ kind, title, amount, categoryId: selectedId });
      await createTransaction({
        title,
        amount: parseFloat(amount),
        category_id: selectedId,
        occurred_at: new Date().toISOString(),
        type: kind === "expense" ? "EXPENSE" : "INCOME",
      });

      setTitle("");
      setAmount("");
      setSelectedId(null);
      await onSuccess?.();
    } catch (error) {
      console.error("Failed to create transaction", error);
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={!newCatName.trim() || isCreatingCategory}
              className="px-4 py-2 rounded-lg bg-primary-brand text-white disabled:opacity-50"
            >
              {isCreatingCategory ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </Modal>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isSubmitting || !selectedId}
        >
          {isSubmitting
            ? kind === "expense"
              ? "Adding Expense..."
              : "Adding Income..."
            : kind === "expense"
              ? "Add Expense"
              : "Add Income"}
        </Button>
      </div>
    </form>
  );
}

export default TransactionForm;
