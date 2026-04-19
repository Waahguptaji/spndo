import { Car, Film, ShoppingCart, Utensils } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import WidgetCard from "./WidgetCard";
import ListItem from "../ui/ListItem";
import { getTransactions, Transaction } from "@/lib/api/transactions";

const iconMap: { [key: string]: React.ReactNode } = {
  Groceries: (
    <ShoppingCart className="text-green-600 dark:text-green-400" size={28} />
  ),
  Entertainment: (
    <Film className="text-purple-600 dark:text-purple-400" size={28} />
  ),
  Transportation: (
    <Car className="text-blue-600 dark:text-blue-400" size={28} />
  ),
  Shopping: (
    <ShoppingCart className="text-pink-600 dark:text-pink-400" size={28} />
  ),
  "Dining Out": (
    <Utensils className="text-orange-600 dark:text-orange-400" size={28} />
  ),
};

const formatSignedInr = (amount: string, type: "INCOME" | "EXPENSE") => {
  const value = Number(amount || 0);
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${type === "INCOME" ? "+" : "-"}₹${formatted}`;
};

const TransactionWidget = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setError(null);
        const res = await getTransactions();
        setTransactions(res.transactions ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch transactions",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const latest = useMemo(
    () =>
      [...transactions]
        .sort(
          (a, b) =>
            new Date(b.occurred_at).getTime() -
            new Date(a.occurred_at).getTime(),
        )
        .slice(0, 5),
    [transactions],
  );

  return (
    <WidgetCard title="Transaction">
      <div className="space-y-2">
        {loading ? <p className="text-sm">Loading transactions...</p> : null}
        {error ? <p className="text-sm text-system-red">{error}</p> : null}
        {!loading && !error && latest.length === 0 ? (
          <p className="text-sm text-neutral-grey2 dark:text-neutral-grey3">
            No transactions yet.
          </p>
        ) : null}
        {latest.map((transaction) => (
          <ListItem
            key={transaction.id}
            variant="transaction"
            title={transaction.title}
            icon={iconMap[transaction.category?.name ?? ""]}
            amount={formatSignedInr(transaction.amount, transaction.type)}
            date={new Date(transaction.occurred_at).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
              },
            )}
            description={transaction.note ?? undefined}
            status=""
            icon1={null}
            icon2={null}
          />
        ))}
      </div>
    </WidgetCard>
  );
};

export default TransactionWidget;
