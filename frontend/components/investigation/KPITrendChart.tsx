"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { TrendPoint } from "@/lib/types";

interface KPITrendChartProps {
  data: TrendPoint[];
}

export default function KPITrendChart({
  data,
}: KPITrendChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              formatCompact(value)
            }
          />

          <Tooltip
            formatter={(value) =>
              formatNumber(Number(value))
            }
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="currentColor"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }

  return String(value);
}
