import { Car, Film, ShoppingCart, Utensils, Wallet2 } from "lucide-react";
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

const getTransactionIcon = (categoryName?: string | null) => {
  if (!categoryName) {
    return (
      <Wallet2
        className="text-neutral-grey2 dark:text-neutral-grey3"
        size={28}
      />
    );
  }

  const exact = iconMap[categoryName];
  if (exact) return exact;

  const key = categoryName.trim().toLowerCase();

  if (
    key.includes("food") ||
    key.includes("grocery") ||
    key.includes("dining")
  ) {
    return (
      <Utensils className="text-orange-600 dark:text-orange-400" size={28} />
    );
  }
  if (
    key.includes("transport") ||
    key.includes("travel") ||
    key.includes("fuel")
  ) {
    return <Car className="text-blue-600 dark:text-blue-400" size={28} />;
  }
  if (
    key.includes("movie") ||
    key.includes("entertain") ||
    key.includes("ott")
  ) {
    return <Film className="text-purple-600 dark:text-purple-400" size={28} />;
  }
  if (key.includes("shop")) {
    return (
      <ShoppingCart className="text-pink-600 dark:text-pink-400" size={28} />
    );
  }

  return (
    <Wallet2 className="text-neutral-grey2 dark:text-neutral-grey3" size={28} />
  );
};

const formatSignedInr = (amount: string, type: "INCOME" | "EXPENSE") => {
  const value = Number(amount || 0);
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${type === "INCOME" ? "+" : "-"}₹${formatted}`;
};

type TransactionWidgetProps = {
  transactionsData?: Transaction[];
  loading?: boolean;
  error?: string | null;
};

const TransactionWidget = ({
  transactionsData,
  loading: externalLoading,
  error: externalError,
}: TransactionWidgetProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const useExternalData = Array.isArray(transactionsData);

  useEffect(() => {
    if (useExternalData) return;

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
  }, [useExternalData]);

  const widgetTransactions = useExternalData ? transactionsData : transactions;
  const widgetLoading = useExternalData ? Boolean(externalLoading) : loading;
  const widgetError = useExternalData ? (externalError ?? null) : error;

  const latest = useMemo(
    () =>
      [...widgetTransactions]
        .sort(
          (a, b) =>
            new Date(b.occurred_at).getTime() -
            new Date(a.occurred_at).getTime(),
        )
        .slice(0, 5),
    [widgetTransactions],
  );

  return (
    <WidgetCard title="Transaction" href="/transactions">
      <div className="space-y-2">
        {widgetLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`txn-skeleton-${idx}`}
                className="h-20 rounded-xl border border-neutral-softGrey1 dark:border-neutral-grey1 bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse"
              />
            ))
          : null}
        {widgetError ? (
          <p className="text-sm text-system-red">{widgetError}</p>
        ) : null}
        {!widgetLoading && !widgetError && latest.length === 0 ? (
          <p className="text-sm text-neutral-grey2 dark:text-neutral-grey3">
            No transactions yet.
          </p>
        ) : null}
        {latest.map((transaction) => (
          <ListItem
            key={transaction.id}
            variant="transaction"
            title={transaction.title}
            icon={getTransactionIcon(transaction.category?.name)}
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
