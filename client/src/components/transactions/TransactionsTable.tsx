import React from "react";
import ListItem from "@/components/ui/ListItem";
import { Wallet2 } from "lucide-react";
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
  onLoadMore: () => void;
  isLoadingMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
};

export default function TransactionsTable({
  data,
  onLoadMore,
  isLoadingMore,
  sentinelRef,
}: TransactionsTableProps) {
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
      <WidgetCard>
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
        <>
          <h2 className="text-sm font-medium text-neutral-grey2 dark:text-neutral-grey3 tracking-wide p-4 pb-2">
            {formatDate(date)}
          </h2>

          {entries.map((entry) => (
            <ListItem
              key={entry.id}
              variant="transaction"
              icon={<Wallet2 className="h-5 w-5" />}
              title={entry.title}
              description={entry.description}
              amount={entry.amount}
            />
          ))}

          {/* Add subtle divider after each section except last */}
          {groupedByDate[groupedByDate.length - 1].date !== date && (
            <hr className="border-neutral-100 dark:border-neutral-800 my-2" />
          )}
          {/* </section> */}
        </>
      ))}

      {/* {isLoadingMore && <div className="text-center p-4">Loading more...</div>}
      <div ref={sentinelRef} className="h-10"></div> */}
    </WidgetCard>
  );
}
