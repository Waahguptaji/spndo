"use client";

import React from "react";
import WidgetCard from "./WidgetCard";
import ListItem from "../ui/ListItem";
import { ShoppingCart, Film, Car, Utensils } from "lucide-react";

const iconMap: { [key: string]: React.ReactNode } = {
  Groceries: (
    <ShoppingCart className="text-green-600 dark:text-green-400" size={28} />
  ),
  Entertainment: (
    <Film className="text-purple-600 dark:text-purple-400" size={28} />
  ),
  Transportation: (
    <Car className="text-blue-600 dark:text-blue-400" size={28} />
  ),
  Shopping: (
    <ShoppingCart className="text-pink-600 dark:text-pink-400" size={28} />
  ),
  "Dining Out": (
    <Utensils className="text-orange-600 dark:text-orange-400" size={28} />
  ),
};

const budgetGoalsData = [
  {
    title: "Groceries",
    progress: { current: 450, total: 600 },
  },
  {
    title: "Entertainment",
    progress: { current: 320, total: 300 }, // Over budget
  },
  {
    title: "Transportation",
    progress: { current: 280, total: 400 },
  },
  {
    title: "Shopping",
    progress: { current: 150, total: 250 },
  },
  {
    title: "Dining Out",
    progress: { current: 180, total: 200 },
  },
];

const BudgetsWidget = () => {
  return (
    <WidgetCard title="Budgets">
      <div className="space-y-2">
        {budgetGoalsData.map((goal) => (
          <ListItem
            key={goal.title}
            variant="goal"
            title={goal.title}
            icon={iconMap[goal.title]}
            progress={goal.progress}
          />
        ))}
      </div>
    </WidgetCard>
  );
};

export default BudgetsWidget;
