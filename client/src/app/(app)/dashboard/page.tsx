"use client";

import BudgetsWidget from "@/components/dashboard/BudgetsWidget";
import MonthlyOverviewBudget from "@/components/dashboard/MonthlyOverviewBudget";
import SummaryWidget from "@/components/dashboard/SummaryWidget";
import TransactionWidget from "@/components/dashboard/TransactionWidget";
import WeeklyBarGraphWidget from "@/components/dashboard/WeeklyBarGraphWidget";
import React from "react";

function Dashboard() {
  return (
    <div className="p-4 space-y-6 mb-12 md:mb-0">
      <div className="flex overflow-x-auto gap-4 pb-2 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <SummaryWidget variant="savings" title="Total Balance" amount={0} />
        <SummaryWidget
          variant="totalExpenses"
          title="Total Expenses"
          amount={0}
        />
        <SummaryWidget
          variant="monthlyExpenses"
          title="Total Investments"
          amount={0}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="hidden md:block">
          <MonthlyOverviewBudget />
        </div>
        <div className="hidden md:block">
          <WeeklyBarGraphWidget />
        </div>
        <div className="hidden md:block">
          <BudgetsWidget />
        </div>
        <div>
          <TransactionWidget />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
