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
import tailwindConfig from "../../../tailwind.config"; // Adjust path if necessary
import { MoreHorizontal } from "lucide-react"; // Icon for the button

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
  // ACTION: Add state to manage the filter and the dropdown visibility
  const [filter, setFilter] = useState<ChartFilter>("both");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFilterChange = (newFilter: ChartFilter) => {
    setFilter(newFilter);
    setIsMenuOpen(false); // Close the menu after selection
  };

  return (
    <div className="bg-neutral-white dark:bg-neutral-dark2 p-4 rounded-xl shadow-md w-full max-w-2xl mx-auto">
      {/* ACTION: Header now uses flexbox to align title and new button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-neutral-dark1 dark:text-neutral-white">
          Last 7 Days
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-neutral-grey2 dark:text-neutral-grey3 hover:text-neutral-dark1 dark:hover:text-neutral-white"
          >
            <MoreHorizontal size={24} />
          </button>
          {/* ACTION: The dropdown menu itself */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-neutral-white dark:bg-neutral-dark1 border border-neutral-grey2 dark:border-neutral-grey1 rounded-lg shadow-lg z-10">
              <button
                onClick={() => handleFilterChange("both")}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-dark1 dark:text-neutral-white hover:bg-neutral-grey3 dark:hover:bg-neutral-grey1"
              >
                Both
              </button>
              <button
                onClick={() => handleFilterChange("income")}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-dark1 dark:text-neutral-white hover:bg-neutral-grey3 dark:hover:bg-neutral-grey1"
              >
                Income
              </button>
              <button
                onClick={() => handleFilterChange("expense")}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-dark1 dark:text-neutral-white hover:bg-neutral-grey3 dark:hover:bg-neutral-grey1"
              >
                Expense
              </button>
            </div>
          )}
        </div>
      </div>

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

            {/* ACTION: Conditionally render the Bar components based on the filter state */}
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
    </div>
  );
};

export default React.memo(WeeklyBarGraphWidget);
