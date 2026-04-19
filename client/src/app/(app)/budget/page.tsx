"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import { getCategories } from "@/lib/api/categories";
import { getBudgets, updateBudgets } from "@/lib/api/budgets";

type BudgetDraft = {
  categoryId: string;
  categoryName: string;
  amount: number;
};

const currentMonthValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}`;
};

export default function BudgetPage() {
  const [month, setMonth] = useState(currentMonthValue());
  const [rows, setRows] = useState<BudgetDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoryRes, budgetRes] = await Promise.all([
          getCategories(),
          getBudgets(month),
        ]);

        const expenseCategories = categoryRes.categories.filter(
          (category) => category.type === "EXPENSE",
        );

        const budgetByCategory = new Map(
          budgetRes.map((budget) => [budget.categoryId, Number(budget.amount)]),
        );

        setRows(
          expenseCategories.map((category) => ({
            categoryId: category.id,
            categoryName: category.name,
            amount: budgetByCategory.get(category.id) ?? 0,
          })),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load budgets");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  const totalBudget = useMemo(
    () => rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
    [rows],
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      await updateBudgets(
        rows.map((row) => ({
          categoryId: row.categoryId,
          amount: Number(row.amount) || 0,
        })),
        month,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save budgets");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-10 w-52 rounded-md bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        <div className="h-14 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        <div className="h-14 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        <div className="h-14 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-md border px-3 py-2 bg-transparent"
        />
      </div>

      {error ? <p className="text-system-red text-sm">{error}</p> : null}

      <div className="rounded-xl border p-4 space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-neutral-grey2 dark:text-neutral-grey3">
            No expense categories found. Add categories first.
          </p>
        ) : (
          rows.map((row) => (
            <div
              key={row.categoryId}
              className="flex items-center justify-between gap-3"
            >
              <span className="font-medium">{row.categoryName}</span>
              <input
                type="number"
                min={0}
                value={row.amount}
                onChange={(e) => {
                  const value = Number(e.target.value || 0);
                  setRows((prev) =>
                    prev.map((item) =>
                      item.categoryId === row.categoryId
                        ? { ...item, amount: value }
                        : item,
                    ),
                  );
                }}
                className="w-40 rounded-md border px-3 py-2 bg-transparent"
              />
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm">
          Total Budget:{" "}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(totalBudget)}
        </p>
        <Button onClick={handleSave} disabled={saving || rows.length === 0}>
          {saving ? "Saving..." : "Save Budgets"}
        </Button>
      </div>
    </div>
  );
}
