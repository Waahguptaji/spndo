import React from "react";
import { SquareArrowOutUpRight, Wallet2 } from "lucide-react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import CategoryChip from "@/components/ui/CategoryChip";
import ListItem from "@/components/ui/ListItem";
import WidgetCard from "@/components/dashboard/WidgetCard";
import CircularPulseStat from "@/components/ui/CircularPulseStat";

type MobileViewProps = {
  active: "income" | "expense" | null;
  handleAdd: (type: "income" | "expense") => void;
  summary: {
    totalSpent: number;
    totalIncome: number;
    budgetUsed: number;
    safeToSpendPerDay: number;
    spentPercentage: number;
  };
  recentTransactions: Array<{
    id: string;
    title: string;
    amount: string;
    description?: string;
  }>;
};

const MobileView: React.FC<MobileViewProps> = ({
  active,
  handleAdd,
  summary,
  recentTransactions,
}) => {
  const router = useRouter();

  const formatCompact = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const pulseSize = summary.totalSpent >= 10000000 ? "lg" : "md";
  const pulseVariant = summary.spentPercentage > 100 ? "expense" : "savings";

  return (
    <div className="px-4 pt-4 pb-24 space-y-8">
      <CircularPulseStat
        amount={summary.totalSpent}
        percentage={summary.spentPercentage}
        label="You have spent total"
        variant={pulseVariant}
        size={pulseSize}
      />

      <div className="flex items-center justify-around gap-4 text-sm">
        <span className="flex items-center">
          <div className="flex flex-col">
            <div className="text-muted-foreground">Income</div>
            <div>{formatCompact(summary.totalIncome)}</div>
          </div>
        </span>

        <div
          role="separator"
          aria-orientation="vertical"
          className="h-7 w-px shrink-0 border-solid border border-black"
        />

        <span className="flex items-center">
          <div className="flex flex-col">
            <div className="text-muted-foreground">Budget</div>
            <div>{formatCompact(summary.budgetUsed)}</div>
          </div>
        </span>

        <div
          role="separator"
          aria-orientation="vertical"
          className="h-7 w-px shrink-0 border-solid border border-black"
        />

        <span className="flex items-center">
          <div className="flex flex-col">
            <div>Safe to Spend</div>
            <div>{formatCompact(summary.safeToSpendPerDay)}/day</div>
          </div>
        </span>
      </div>

      <div className="flex items-start gap-6 overflow-x-auto pb-1">
        <CategoryChip
          label="Add Income"
          icon={<ArrowUpRight className="h-6 w-6 text-green-500" />}
          selected={active === "income"}
          onClick={() => handleAdd("income")}
          className="h-24 w-40 rounded-3xl"
        />
        <CategoryChip
          label="Add Expense"
          icon={<ArrowDownLeft className="h-6 w-6 text-red-500" />}
          selected={active === "expense"}
          onClick={() => handleAdd("expense")}
          className="h-24 w-40 rounded-3xl"
        />
      </div>

      <WidgetCard title="Recent Transactions">
        {recentTransactions.length === 0 ? (
          <div className="text-sm text-muted-foreground p-2">
            No transactions yet.
          </div>
        ) : (
          recentTransactions.map((transaction) => (
            <ListItem
              key={transaction.id}
              variant="transaction"
              title={transaction.title}
              amount={transaction.amount}
              icon={<Wallet2 />}
              description={transaction.description}
              status=""
              icon1={null}
              icon2={null}
            />
          ))
        )}
        <div
          className="w-fit ml-auto flex items-center gap-2 text-sm text-muted-foreground mt-4 cursor-pointer hover:underline transition-transform duration-450 hover:scale-105"
          onClick={() => router.push("/transactions/entries")}
        >
          More <SquareArrowOutUpRight />
        </div>
      </WidgetCard>
    </div>
  );
};

export default MobileView;
