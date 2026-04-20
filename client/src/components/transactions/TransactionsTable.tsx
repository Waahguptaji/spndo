import React from "react";
import ListItem from "@/components/ui/ListItem";
import { Wallet2 } from "lucide-react";
import { Trash2 } from "lucide-react";
import WidgetCard from "@/components/dashboard/WidgetCard";

// We're not actually using TanStack Table rendering here, so we can simplify
type Entry = {
  id: string;
  title: string;
  description?: string;
  date: string;
  amount: string;
  category: string;
};

type TransactionsTableProps = {
  data: Entry[];
  onDeleteTransaction: (id: string) => Promise<void>;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
};

export default function TransactionsTable({
  data,
  onDeleteTransaction,
}: TransactionsTableProps) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this transaction? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await onDeleteTransaction(id);
    } finally {
      setDeletingId(null);
    }
  };

  // Group entries by date
  const groupedByDate = React.useMemo(() => {
    const map: Record<string, Entry[]> = {};
    data.forEach((entry) => {
      const dateKey = entry.date;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(entry);
    });
    return Object.entries(map)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, entries]) => ({ date, entries }));
  }, [data]);

  // Format date as "Wed, 27 Aug 2025"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (data.length === 0) {
    return (
      <WidgetCard title="">
        <div className="text-center p-8 text-muted-foreground">
          No transactions found matching your filters
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard title="Transaction History">
      {groupedByDate.map(({ date, entries }) => (
        // <section key={date} className="mb-4 last:mb-0">
        <React.Fragment key={date}>
          <h2 className="text-sm font-medium text-neutral-grey2 dark:text-neutral-grey3 tracking-wide p-4 pb-2">
            {formatDate(date)}
          </h2>

          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-2">
              <div className="flex-1">
                <ListItem
                  variant="transaction"
                  icon={<Wallet2 className="h-5 w-5" />}
                  title={entry.title}
                  description={entry.description}
                  amount={entry.amount}
                />
              </div>
              <button
                type="button"
                onClick={() => handleDelete(entry.id)}
                aria-label="Delete transaction"
                disabled={deletingId === entry.id}
                className="h-10 w-10 rounded-lg border border-neutral-softGrey2 dark:border-neutral-grey1 text-neutral-grey2 dark:text-neutral-grey3 hover:text-system-red hover:border-system-red disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Add subtle divider after each section except last */}
          {groupedByDate[groupedByDate.length - 1].date !== date && (
            <hr className="border-neutral-100 dark:border-neutral-800 my-2" />
          )}
          {/* </section> */}
        </React.Fragment>
      ))}

      {/* {isLoadingMore && <div className="text-center p-4">Loading more...</div>}
      <div ref={sentinelRef} className="h-10"></div> */}
    </WidgetCard>
  );
}
