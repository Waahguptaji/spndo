"use client";

import React from "react";
import WidgetCard from "./WidgetCard";
import ListItem from "../ui/ListItem";
import { ShoppingCart, Film, Car, Utensils, SquareMenu } from "lucide-react";
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

const BudgetsWidget = () => {
  const [budgetData, setBudgetData] = useState<BudgetRow[]>([]);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
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
        console.error("Error while fetching budgets", error);
      }
    };

    fetchBudgetData();
  }, []);

  return (
    <WidgetCard title="Budgets">
      <div className="space-y-2">
        {budgetData.map((budget) => (
          <ListItem
            key={budget.id}
            variant="goal"
            title={budget.title}
            icon={iconMap[budget.title]}
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
