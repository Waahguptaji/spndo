"use client";
import {
  Car,
  Film,
  ShoppingCart,
  Utensils,
  SquareMenu,
  Target,
} from "lucide-react";

import React from "react";
import WidgetCard from "./WidgetCard";
import ListItem from "../ui/ListItem";
import { getgoal, GoalResponse } from "@/lib/api/goals";
import { useState, useEffect } from "react";

// const goalsData: Goal[] = [
//   {
//     title: "Emergency Fund",
//     amount: 5000,
//     current: 2750,
//     date: "2025-12-31",
//     description: "Build a safety net for unexpected expenses.",
//   },
//   {
//     title: "Vacation",
//     amount: 2500,
//     current: 1200,
//     date: "2025-07-15",
//     description: "Summer trip to Japan.",
//   },
//   {
//     title: "New Laptop",
//     amount: 1500,
//     current: 900,
//     date: "2025-03-01",
//     description: "Upgrade to a reliable work laptop.",
//   },
//   {
//     title: "Shopping",
//     amount: 400,
//     current: 180,
//     date: "2025-10-01",
//     description: "Budget for seasonal wardrobe updates.",
//   },
//   {
//     title: "Dining Out",
//     amount: 200,
//     current: 60,
//     date: "2025-05-01",
//     description: "Monthly budget for restaurants and cafes.",
//   },
// ];

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

const getGoalIcon = (title: string) => {
  const exact = iconMap[title];
  if (exact) return exact;

  const key = title.trim().toLowerCase();

  if (key.includes("marriage") || key.includes("wedding")) {
    return (
      <SquareMenu className="text-purple-600 dark:text-purple-400" size={28} />
    );
  }
  if (key.includes("loan") || key.includes("education")) {
    return (
      <Utensils className="text-orange-600 dark:text-orange-400" size={28} />
    );
  }
  if (key.includes("car") || key.includes("travel") || key.includes("parent")) {
    return <Car className="text-blue-600 dark:text-blue-400" size={28} />;
  }
  if (key.includes("mac") || key.includes("laptop") || key.includes("tech")) {
    return <Film className="text-purple-600 dark:text-purple-400" size={28} />;
  }
  if (key.includes("shop") || key.includes("fund") || key.includes("career")) {
    return (
      <ShoppingCart className="text-green-600 dark:text-green-400" size={28} />
    );
  }

  return (
    <Target className="text-neutral-grey2 dark:text-neutral-grey3" size={28} />
  );
};

type GoalsWidgetProps = {
  goalsDataProp?: GoalResponse[];
  loading?: boolean;
  error?: string | null;
};

const GoalsWidget = ({
  goalsDataProp,
  loading: externalLoading,
  error: externalError,
}: GoalsWidgetProps) => {
  const [goalsData, setGoalsData] = useState<GoalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const useExternalData = Array.isArray(goalsDataProp);

  useEffect(() => {
    if (useExternalData) return;

    const fetchGoals = async () => {
      try {
        setError(null);
        const data = await getgoal();
        setGoalsData(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch goals",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, [useExternalData]);

  const widgetGoals = useExternalData ? goalsDataProp : goalsData;
  const widgetLoading = useExternalData ? Boolean(externalLoading) : loading;
  const widgetError = useExternalData ? (externalError ?? null) : error;

  return (
    <WidgetCard title="Goals" href="/goals">
      <div className="space-y-2">
        {widgetLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`goal-skeleton-${idx}`}
                className="h-20 rounded-xl border border-neutral-softGrey1 dark:border-neutral-grey1 bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse"
              />
            ))
          : null}
        {widgetError ? (
          <p className="text-sm text-system-red">{widgetError}</p>
        ) : null}
        {!widgetLoading && !widgetError && widgetGoals.length === 0 ? (
          <p className="text-sm text-neutral-grey2 dark:text-neutral-grey3">
            No goals yet.
          </p>
        ) : null}
        {widgetGoals.map((goal) => (
          <ListItem
            key={goal.title}
            variant="goal"
            title={goal.title}
            icon={getGoalIcon(goal.title)}
            progress={{
              current: goal.progress_amount,
              total: goal.target_amount,
            }}
            status={goal.status}
            icon1=""
            icon2=""
          />
        ))}
      </div>
    </WidgetCard>
  );
};

export default GoalsWidget;
