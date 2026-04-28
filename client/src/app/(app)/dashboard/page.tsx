"use client";

import BudgetsWidget from "@/components/dashboard/BudgetsWidget";
import GoalsWidget from "@/components/dashboard/GoalsWidget";
import MonthlyOverviewBudget from "@/components/dashboard/MonthlyOverviewBudget";
import SummaryWidget from "@/components/dashboard/SummaryWidget";
import TransactionWidget from "@/components/dashboard/TransactionWidget";
import WeeklyBarGraphWidget from "@/components/dashboard/WeeklyBarGraphWidget";
import { getMonthlySummary, MonthlySummary } from "@/lib/api/aggregate";
import { getBudgets } from "@/lib/api/budgets";
import { getCategories } from "@/lib/api/categories";
import { getgoal, GoalResponse } from "@/lib/api/goals";
import { getTransactions, Transaction } from "@/lib/api/transactions";
import React, { useEffect, useState } from "react";

type BudgetRow = {
  id: string;
  title: string;
  amount: number;
};

function Dashboard() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [overviewTransactions, setOverviewTransactions] = useState<
    Transaction[]
  >([]);
  const [dashboardGoals, setDashboardGoals] = useState<GoalResponse[]>([]);
  const [dashboardBudgets, setDashboardBudgets] = useState<BudgetRow[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setOverviewError(null);
        const [
          summaryData,
          transactionsData,
          goalsData,
          budgetsData,
          categoriesRes,
        ] = await Promise.all([
          getMonthlySummary(),
          getTransactions(),
          getgoal(),
          getBudgets(),
          getCategories(),
        ]);

        const categoryNameById = new Map(
          categoriesRes.categories.map((category) => [
            category.id,
            category.name,
          ]),
        );

        const mappedBudgets = budgetsData.map((budget) => ({
          id: budget.id,
          title: categoryNameById.get(budget.categoryId) ?? "Budget",
          amount: Number(budget.amount || 0),
        }));

        setSummary(summaryData);
        setOverviewTransactions(transactionsData.transactions ?? []);
        setDashboardGoals(goalsData ?? []);
        setDashboardBudgets(mappedBudgets);
      } catch (error) {
        setOverviewError(
          error instanceof Error ? error.message : "Failed to fetch dashboard",
        );
      } finally {
        setLoadingOverview(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="p-4 space-y-6 mb-12 md:mb-0">
      {overviewError ? (
        <p className="text-sm text-system-red">{overviewError}</p>
      ) : null}

      {loadingOverview ? (
        <div className="flex overflow-x-auto gap-4 pb-2 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[1, 2, 3].map((key) => (
            <div
              key={key}
              className="w-44 md:w-auto h-24 rounded-lg border border-neutral-softGrey1 dark:border-neutral-grey1 bg-neutral-white dark:bg-neutral-dark2 p-4 animate-pulse"
            >
              <div className="h-3 w-24 bg-neutral-softGrey2 dark:bg-neutral-grey1 rounded" />
              <div className="h-6 w-28 bg-neutral-softGrey2 dark:bg-neutral-grey1 rounded mt-3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-4 pb-2 md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SummaryWidget
            variant="savings"
            title="Total Balance"
            amount={summary?.net ?? 0}
          />
          <SummaryWidget
            variant="totalExpenses"
            title="Total Expenses"
            amount={summary?.expense ?? 0}
          />
          <SummaryWidget
            variant="monthlyExpenses"
            title="Total Investments"
            amount={summary?.income ?? 0}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="hidden md:block">
          {loadingOverview ? (
            <div className="h-[420px] rounded-xl border border-neutral-softGrey1 dark:border-neutral-grey1 bg-neutral-white dark:bg-neutral-dark2 animate-pulse" />
          ) : (
            <MonthlyOverviewBudget
              summary={summary}
              loading={false}
              error={overviewError}
            />
          )}
        </div>
        <div className="hidden md:block">
          {loadingOverview ? (
            <div className="h-[420px] rounded-xl border border-neutral-softGrey1 dark:border-neutral-grey1 bg-neutral-white dark:bg-neutral-dark2 animate-pulse" />
          ) : (
            <WeeklyBarGraphWidget
              transactionsData={overviewTransactions}
              loading={false}
              error={overviewError}
            />
          )}
        </div>
        <div className="hidden md:block">
          {loadingOverview ? (
            <div className="h-[420px] rounded-xl border border-neutral-softGrey1 dark:border-neutral-grey1 bg-neutral-white dark:bg-neutral-dark2 animate-pulse" />
          ) : (
            <BudgetsWidget
              budgetDataProp={dashboardBudgets}
              summaryProp={summary}
              loading={false}
              error={overviewError}
            />
          )}
        </div>
        <div>
          {loadingOverview ? (
            <div className="h-[420px] rounded-xl border border-neutral-softGrey1 dark:border-neutral-grey1 bg-neutral-white dark:bg-neutral-dark2 animate-pulse" />
          ) : (
            <TransactionWidget
              transactionsData={overviewTransactions}
              loading={false}
              error={overviewError}
            />
          )}
        </div>
        {loadingOverview ? (
          <div className="h-[420px] rounded-xl border border-neutral-softGrey1 dark:border-neutral-grey1 bg-neutral-white dark:bg-neutral-dark2 animate-pulse" />
        ) : (
          <GoalsWidget
            goalsDataProp={dashboardGoals}
            loading={false}
            error={overviewError}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
