"use client";

import { useState, useMemo, useEffect } from "react";
import ListItem from "@/components/ui/ListItem";
import { Trash2, Wallet2 } from "lucide-react";
import { Transaction } from "@/lib/api/transactions";
import { deleteTransaction, getTransactions } from "@/lib/api/transactions";

const formatSignedInrAmount = (
  amount: string | number,
  type: "INCOME" | "EXPENSE",
) => {
  const value = Number(amount || 0);
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${type === "INCOME" ? "+" : "-"}₹${formatted}`;
};

type Entry = {
  id: string;
  title: string;
  description?: string;
  date: string;
  amount: string;
  category: string;
};

export default function EntriesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | string>("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        const data = res.transactions ?? [];
        setTransactions(data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const entries = useMemo(() => {
    return transactions.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.note ?? undefined,
      date: t.occurred_at,
      category: t.category?.name ?? "Other",
      amount: formatSignedInrAmount(t.amount, t.type),
    }));
  }, [transactions]);

  // Filter
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) &&
        (category === "all" || e.category === category),
    );
  }, [entries, query, category]);

  // Slice according to visibleCount
  const visible = filtered;

  const grouped = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    visible.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return Object.entries(map)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([d, items]) => ({
        date: d,
        items: items.sort((a, b) => a.title.localeCompare(b.title)),
      }));
  }, [visible]);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(entries.map((e) => e.category)))],
    [entries],
  );

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this transaction? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 py-4">
        <div className="h-10 rounded-md bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        <div className="h-10 rounded-md bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        <div className="h-20 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        <div className="h-20 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        <div className="h-20 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* <WidgetCard title=""> */}
      {grouped.map((group) => (
        <section key={group.date} className="space-y-3">
          <div className="space-y-3">
            {group.items.map((e) => (
              <div key={e.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <ListItem
                    variant="transaction"
                    icon={<Wallet2 className="h-5 w-5" />}
                    title={e.title}
                    description={e.description}
                    date={new Date(e.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    amount={e.amount}
                    status=""
                    icon1={null}
                    icon2={null}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(e.id)}
                  aria-label="Delete transaction"
                  disabled={deletingId === e.id}
                  className="h-10 w-10 rounded-lg border border-neutral-softGrey2 dark:border-neutral-grey1 text-neutral-grey2 dark:text-neutral-grey3 hover:text-system-red hover:border-system-red disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* </WidgetCard> */}
    </div>
  );
}
