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
};

const MobileView: React.FC<MobileViewProps> = ({ active, handleAdd }) => {
  const router = useRouter();

  return (
    <div className="px-4 pt-4 pb-24 space-y-8">
      <CircularPulseStat
        amount={1600}
        percentage={60}
        label="You have spent total"
        variant="savings"
        size="md"
      />

      <div className="flex items-center justify-around gap-4 text-sm">
        <span className="flex items-center">
          <div className="flex flex-col">
            <div className="text-muted-foreground">Income</div>
            <div>23666</div>
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
            <div>5000</div>
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
            <div>196/day</div>
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
        <ListItem
          variant="transaction"
          title="Salary"
          amount="+$5000"
          icon={<Wallet2 />}
          description="Monthly Salary"
        />
        <ListItem
          variant="transaction"
          title="Cashback"
          amount="+$500"
          icon={<Wallet2 />}
          description="Cash"
        />
        <ListItem
          variant="transaction"
          title="Coffee"
          amount="-$500"
          icon={<Wallet2 />}
          description="Coffee"
        />
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
