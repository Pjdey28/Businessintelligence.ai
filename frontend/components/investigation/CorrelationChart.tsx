"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { OperationalDriver } from "@/lib/types";

interface CorrelationChartProps {
  data: OperationalDriver[];
}

export default function CorrelationChart({
  data,
}: CorrelationChartProps) {
  const chartData = data.map((item) => ({
    driver: item.driver,
    correlation: Number(item.correlation),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 10,
            right: 20,
            left: 30,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            type="number"
            domain={[-1, 1]}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            type="category"
            dataKey="driver"
            tick={{ fontSize: 12 }}
            width={100}
          />

          <Tooltip />

          <Bar
            dataKey="correlation"
            radius={[0, 4, 4, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.correlation >= 0
                    ? "currentColor"
                    : "currentColor"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
