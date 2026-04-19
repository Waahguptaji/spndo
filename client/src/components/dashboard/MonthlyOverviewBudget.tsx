/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector, Cell } from "recharts";
import WidgetCard from "./WidgetCard";
import { MonthlySummary } from "@/lib/api/aggregate";

const COLORS = ["#C2FF00", "#A6DB00", "#374151", "#9CA3AF"];

type Props = {
  summary: MonthlySummary | null;
  loading?: boolean;
  error?: string | null;
};

const formatInr = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;

  return (
    <g>
      {/* Center Text */}
      <text
        x={cx}
        y={cy}
        dy={-8}
        textAnchor="middle"
        className="fill-neutral-dark1 dark:fill-neutral-white font-bold text-lg"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={12}
        textAnchor="middle"
        className="fill-neutral-grey2 dark:fill-neutral-grey3 text-sm"
      >
        {formatInr(Number(value || 0))}
      </text>

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 8}
        fill={fill}
      />
    </g>
  );
};

export default function MonthlyOverviewBudget({
  summary,
  loading = false,
  error = null,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const chartData = summary?.byCategory?.length
    ? summary.byCategory.map((entry) => ({
        name: entry.category,
        value: Number(entry.amount || 0),
      }))
    : [
        { name: "Income", value: Number(summary?.income ?? 0) },
        { name: "Expenses", value: Number(summary?.expense ?? 0) },
        { name: "Balance", value: Math.max(0, Number(summary?.net ?? 0)) },
      ];

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <WidgetCard title="Monthly Overview">
      {loading ? (
        <div className="space-y-3">
          <div className="h-64 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
          <div className="h-4 w-3/4 mx-auto rounded bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        </div>
      ) : null}
      {error ? <p className="text-sm text-system-red">{error}</p> : null}

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              {...{
                activeIndex,
                activeShape: renderActiveShape,
                data: chartData,
                cx: "50%",
                cy: "50%",
                innerRadius: 60,
                outerRadius: 80,
                dataKey: "value",
                onMouseEnter: onPieEnter,
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center gap-4 text-xs">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-neutral-grey2 dark:text-neutral-grey3">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
