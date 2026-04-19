/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import resolveConfig from "tailwindcss/resolveConfig"; // 1. Import the helper
import tailwindConfig from "../../../tailwind.config"; // 2. Import your config
import WidgetCard from "./WidgetCard";
import { getTransactions, Transaction } from "@/lib/api/transactions";

// 3. Process the config and cast to 'any' to fix all TypeScript errors
const fullConfig = resolveConfig(tailwindConfig);
const customColors = fullConfig.theme.colors as any;

type ChartDatum = {
  day: string;
  dateKey: string;
  income: number;
  expense: number;
};

const formatInr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const getDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
            {`${pld.name}: ${formatInr(Number(pld.value || 0))}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Define the type for our filter state
type ChartFilter = "both" | "income" | "expense";

type WeeklyBarGraphWidgetProps = {
  transactionsData?: Transaction[];
  loading?: boolean;
  error?: string | null;
};

const WeeklyBarGraphWidget = ({
  transactionsData,
  loading: externalLoading,
  error: externalError,
}: WeeklyBarGraphWidgetProps) => {
  const [filter, setFilter] = useState<ChartFilter>("both");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const useExternalData = Array.isArray(transactionsData);

  useEffect(() => {
    if (useExternalData) return;

    const fetchTransactions = async () => {
      try {
        setError(null);
        const res = await getTransactions();
        setTransactions(res.transactions ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load weekly chart",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [useExternalData]);

  const chartTransactions = useExternalData ? transactionsData : transactions;
  const chartLoading = useExternalData ? Boolean(externalLoading) : loading;
  const chartError = useExternalData ? (externalError ?? null) : error;

  const data = useMemo<ChartDatum[]>(() => {
    const today = new Date();
    const days: ChartDatum[] = [];
    const indexByDateKey = new Map<string, number>();

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() - i);

      const dateKey = getDateKey(date);
      const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });

      indexByDateKey.set(dateKey, days.length);
      days.push({ day: dayLabel, dateKey, income: 0, expense: 0 });
    }

    chartTransactions.forEach((tx) => {
      if (tx.is_deleted) return;

      const txDate = new Date(tx.occurred_at);
      txDate.setHours(0, 0, 0, 0);
      const key = getDateKey(txDate);
      const idx = indexByDateKey.get(key);
      if (idx === undefined) return;

      const amount = Number(tx.amount || 0);
      if (tx.type === "INCOME") {
        days[idx].income += amount;
      } else {
        days[idx].expense += amount;
      }
    });

    return days;
  }, [chartTransactions]);

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
        {chartLoading ? (
          <div className="h-80 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        ) : null}
        {chartError ? (
          <p className="text-sm text-system-red">{chartError}</p>
        ) : null}

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
              <XAxis
                dataKey="day"
                tick={{ fill: customColors.neutral.grey3 }}
              />
              <YAxis tick={{ fill: customColors.neutral.grey3 }} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(156, 163, 175, 0.1)" }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "0.875rem",
                  color: customColors.neutral.grey2,
                }}
              />

              {/* Conditionally render bars based on filter */}
              {(filter === "both" || filter === "income") && (
                <Bar
                  dataKey="income"
                  name="Income"
                  fill={customColors.primary.brand}
                  radius={[4, 4, 0, 0]}
                />
              )}
              {(filter === "both" || filter === "expense") && (
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill={customColors.system.red}
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
