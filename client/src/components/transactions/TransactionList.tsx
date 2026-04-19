import React from "react";
import ListItem from "@/components/ui/ListItem";
import { Wallet2 } from "lucide-react";

// Missing Column type definition
export type Column = {
  id: string;
  label: string;
  visible: boolean;
};

type Entry = {
  id: string;
  title: string;
  description?: string;
  date: string;
  amount: string;
  category: string;
};

type GroupedEntries = {
  date: string;
  items: Entry[];
}[];

type TransactionListProps = {
  grouped: GroupedEntries;
  columns: Column[];
  isLoadingMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
};

const TransactionList: React.FC<TransactionListProps> = ({
  grouped,
  columns,
  isLoadingMore,
  sentinelRef,
}) => {
  if (grouped.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No transactions found matching your filters
      </div>
    );
  }

  return (
    <>
      {grouped.map((group) => (
        <section key={group.date} className="border-b last:border-none">
          <h2 className="text-sm font-medium text-neutral-grey2 dark:text-neutral-grey3 tracking-wide p-4">
            {new Date(group.date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
          <div>
            {group.items.map((e) => (
              <ListItem
                key={e.id}
                variant="transaction"
                icon={<Wallet2 className="h-5 w-5" />}
                title={e.title}
                description={
                  columns.find((c) => c.id === "description")?.visible
                    ? e.description
                    : undefined
                }
                amount={e.amount}
              />
            ))}
          </div>
        </section>
      ))}

      {isLoadingMore ? (
        <div className="space-y-2 p-2">
          <div className="h-20 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
          <div className="h-20 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        </div>
      ) : null}
      <div ref={sentinelRef} className="h-10"></div>
    </>
  );
};

export default TransactionList;
