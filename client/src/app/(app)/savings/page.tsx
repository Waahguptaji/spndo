"use client";
import React from "react";
import GoalsWidget from "@/components/dashboard/GoalsWidget";
import CircularPulseStat from "@/components/ui/CircularPulseStat";

export default function SavingsPage() {
  return (
    <div className="p-4 space-y-8">
      <SavingCircle />
      <div></div>
      <GoalsWidget />
    </div>
  );
}

function SavingCircle() {
  const [amount, setAmount] = React.useState(0);
  const [percentage, setPercentage] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { getMonthlySummary } = await import("@/lib/api/aggregate");
        const { getBudgets } = await import("@/lib/api/budgets");

        const now = new Date();
        const month = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(
          2,
          "0",
        )}`;

        const [summary, budgetList] = await Promise.all([
          getMonthlySummary(month),
          getBudgets(month),
        ]);

        const totalBudget = budgetList.reduce(
          (sum, budget) => sum + Number(budget.amount),
          0,
        );

        setAmount(summary.expense);

        if (totalBudget > 0) {
          setPercentage((summary.expense / totalBudget) * 100);
        }
      } catch (err) {
        console.error("Error fetching savings data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <CircularPulseStat
      amount={amount}
      percentage={percentage}
      label="You have spent total"
      variant="savings"
      size="md"
    />
  );
}
