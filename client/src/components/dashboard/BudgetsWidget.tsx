"use client";

import React from "react";
import WidgetCard from "./WidgetCard";
import ListItem from "../ui/ListItem";
import {
  ShoppingCart,
  Film,
  Car,
  Utensils,
  SquareMenu,
  Wallet,
} from "lucide-react";
import { Budget, getBudgets } from "@/lib/api/budgets";
import { getCategories } from "@/lib/api/categories";
import { useState, useEffect } from "react";

const iconMap: { [key: string]: React.ReactNode } = {
  "Emergency Funds": (
    <ShoppingCart className="text-green-600 dark:text-green-400" size={28} />
  ),
  Macbook: <Film className="text-purple-600 dark:text-purple-400" size={28} />,
  Marriage: (
    <SquareMenu className="text-purple-600 dark:text-purple-400" size={28} />
  ),

  "Parents-Future": (
    <Car className="text-blue-600 dark:text-blue-400" size={28} />
  ),
  CARRIER: (
    <ShoppingCart className="text-pink-600 dark:text-pink-400" size={28} />
  ),
  "Education Loan": (
    <Utensils className="text-orange-600 dark:text-orange-400" size={28} />
  ),
  "Bossie-Bee Marriage": (
    <SquareMenu className="text-purple-600 dark:text-purple-400" size={28} />
  ),
};

const getBudgetIcon = (title: string) => {
  const exact = iconMap[title];
  if (exact) return exact;

  const key = title.trim().toLowerCase();

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

  return <Wallet className="text-green-600 dark:text-green-400" size={28} />;
};

// const budgetGoalsData = [
//   {
//     title: "Groceries",
//     progress: { current: 450, total: 600 },
//   },
//   {
//     title: "Entertainment",
//     progress: { current: 320, total: 300 }, // Over budget
//   },
//   {
//     title: "Transportation",
//     progress: { current: 280, total: 400 },
//   },
//   {
//     title: "Shopping",
//     progress: { current: 150, total: 250 },
//   },
//   {
//     title: "Dining Out",
//     progress: { current: 180, total: 200 },
//   },
// ];

const currentMonthValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}`;
};

type BudgetRow = {
  id: string;
  title: string;
  amount: number;
};

type BudgetsWidgetProps = {
  budgetDataProp?: BudgetRow[];
  loading?: boolean;
  error?: string | null;
};

const BudgetsWidget = ({
  budgetDataProp,
  loading: externalLoading,
  error: externalError,
}: BudgetsWidgetProps) => {
  const [budgetData, setBudgetData] = useState<BudgetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const useExternalData = Array.isArray(budgetDataProp);

  useEffect(() => {
    if (useExternalData) return;

    const fetchBudgetData = async () => {
      try {
        setError(null);
        const [budgets, categoriesRes] = await Promise.all([
          getBudgets(currentMonthValue()),
          getCategories(),
        ]);

        const categoryNameById = new Map(
          categoriesRes.categories.map((category) => [
            category.id,
            category.name,
          ]),
        );

        const rows = (budgets as Budget[]).map((budget) => ({
          id: budget.id,
          title: categoryNameById.get(budget.categoryId) ?? "Budget",
          amount: Number(budget.amount || 0),
        }));

        setBudgetData(rows);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch budgets",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [useExternalData]);

  const widgetBudgets = useExternalData ? budgetDataProp : budgetData;
  const widgetLoading = useExternalData ? Boolean(externalLoading) : loading;
  const widgetError = useExternalData ? (externalError ?? null) : error;

  return (
    <WidgetCard title="Budgets" href="/budget">
      <div className="space-y-2">
        {widgetLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`budget-skeleton-${idx}`}
                className="h-20 rounded-xl border border-neutral-softGrey1 dark:border-neutral-grey1 bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse"
              />
            ))
          : null}
        {widgetError ? (
          <p className="text-sm text-system-red">{widgetError}</p>
        ) : null}
        {!widgetLoading && !widgetError && widgetBudgets.length === 0 ? (
          <p className="text-sm text-neutral-grey2 dark:text-neutral-grey3">
            No budgets yet.
          </p>
        ) : null}
        {widgetBudgets.map((budget) => (
          <ListItem
            key={budget.id}
            variant="goal"
            title={budget.title}
            icon={getBudgetIcon(budget.title)}
            progress={{ current: budget.amount, total: budget.amount || 1 }}
            status="active"
            icon1=""
            icon2=""
          />
        ))}
      </div>
    </WidgetCard>
  );
};

export default BudgetsWidget;
