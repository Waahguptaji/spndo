"use client";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";
import WidgetCard from "./WidgetCard";

// Helper to get actual hex values from Tailwind config
const fullConfig = resolveConfig(tailwindConfig);
const themeColors = fullConfig.theme.colors;

// Sample data for the last 7 days
const data = [
  { day: "Mon", income: 400, expense: 240 },
  { day: "Tue", income: 300, expense: 139 },
  { day: "Wed", income: 200, expense: 980 },
  { day: "Thu", income: 278, expense: 390 },
  { day: "Fri", income: 189, expense: 480 },
  { day: "Sat", income: 239, expense: 380 },
  { day: "Sun", income: 349, expense: 430 },
];

// Custom Tooltip for Theming
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-neutral-white dark:bg-neutral-dark1 border border-neutral-grey2 dark:border-neutral-grey1 rounded-lg shadow-md">
        <p className="font-bold text-neutral-dark1 dark:text-neutral-white">
          {label}
        </p>
        {payload.map((pld: any) => (
          <p key={pld.dataKey} style={{ color: pld.fill }}>
            {`${pld.name}: $${pld.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Define the type for our filter state
type ChartFilter = "both" | "income" | "expense";

const WeeklyBarGraphWidget = () => {
  const [filter, setFilter] = useState<ChartFilter>("both");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMoreOptions = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFilterChange = (newFilter: ChartFilter) => {
    setFilter(newFilter);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <WidgetCard title="Last 7 Days" onMoreOptions={handleMoreOptions}>
        {/* Filter Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-12 right-4 z-20 w-32 bg-neutral-white dark:bg-neutral-dark1 border border-neutral-grey2 dark:border-neutral-grey1 rounded-lg shadow-lg">
            <button
              onClick={() => handleFilterChange("both")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-neutral-grey3 dark:hover:bg-neutral-grey1 ${
                filter === "both"
                  ? "text-primary-brand font-semibold"
                  : "text-neutral-dark1 dark:text-neutral-white"
              }`}
            >
              Both
            </button>
            <button
              onClick={() => handleFilterChange("income")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-neutral-grey3 dark:hover:bg-neutral-grey1 ${
                filter === "income"
                  ? "text-primary-brand font-semibold"
                  : "text-neutral-dark1 dark:text-neutral-white"
              }`}
            >
              Income Only
            </button>
            <button
              onClick={() => handleFilterChange("expense")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-neutral-grey3 dark:hover:bg-neutral-grey1 ${
                filter === "expense"
                  ? "text-primary-brand font-semibold"
                  : "text-neutral-dark1 dark:text-neutral-white"
              }`}
            >
              Expense Only
            </button>
          </div>
        )}

        {/* Chart Content */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-neutral-grey2 dark:stroke-neutral-grey1"
              />
              <XAxis dataKey="day" tick={{ fill: themeColors.neutral.grey3 }} />
              <YAxis tick={{ fill: themeColors.neutral.grey3 }} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(156, 163, 175, 0.1)" }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "0.875rem",
                  color: themeColors.neutral.grey2,
                }}
              />

              {/* Conditionally render bars based on filter */}
              {(filter === "both" || filter === "income") && (
                <Bar
                  dataKey="income"
                  name="Income"
                  fill={themeColors.primary.brand}
                  radius={[4, 4, 0, 0]}
                />
              )}
              {(filter === "both" || filter === "expense") && (
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill={themeColors.system.red}
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </WidgetCard>
    </div>
  );
};

export default React.memo(WeeklyBarGraphWidget);
