"use client";
import { onValue, ref, query, orderByKey } from "firebase/database";
import { useEffect, useState, useMemo } from "react";
import { db } from "../lib/firebaseConfig";
import { Card } from "./retroui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LogEntry {
  suhu: number;
  kelembapan: number;
  timestamp: number;
}

interface ChartDataPoint {
  time: string;
  fullTime: string;
  suhu: number;
  kelembapan: number;
  unixMs: number;
}

/**
 * Extract the timestamp embedded in a Firebase push key.
 * Firebase push keys encode a timestamp in the first 8 characters (base64-like).
 */
function getTimestampFromPushKey(pushKey: string): number {
  const PUSH_CHARS =
    "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
  let timestamp = 0;
  for (let i = 0; i < 8; i++) {
    timestamp = timestamp * 64 + PUSH_CHARS.indexOf(pushKey.charAt(i));
  }
  return timestamp;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFullTime(date: Date): string {
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Custom tooltip component with retro styling
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border-2 border-black shadow-md p-3 text-sm font-bold">
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name === "suhu"
            ? `Temp: ${entry.value}°C`
            : `Humidity: ${entry.value}%`}
        </p>
      ))}
    </div>
  );
}

type TimeRange = "1h" | "6h" | "12h" | "24h";

export const TempHumidChart = () => {
  const [rawData, setRawData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");

  useEffect(() => {
    const logRef = query(ref(db, "/log_ruangan"), orderByKey());

    const unsubscribe = onValue(logRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setRawData([]);
        setIsLoading(false);
        return;
      }

      const points: ChartDataPoint[] = [];

      for (const [key, value] of Object.entries(data)) {
        const entry = value as LogEntry;
        const realTimestamp = getTimestampFromPushKey(key);
        const date = new Date(realTimestamp);

        if (
          !isNaN(date.getTime()) &&
          typeof entry.suhu === "number" &&
          typeof entry.kelembapan === "number"
        ) {
          points.push({
            time: formatTime(date),
            fullTime: formatFullTime(date),
            suhu: Math.round(entry.suhu * 10) / 10,
            kelembapan: Math.round(entry.kelembapan * 10) / 10,
            unixMs: realTimestamp,
          });
        }
      }

      // Sort by timestamp
      points.sort((a, b) => a.unixMs - b.unixMs);
      setRawData(points);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter data based on selected time range
  const chartData = useMemo(() => {
    if (rawData.length === 0) return [];

    const rangeMs: Record<TimeRange, number> = {
      "1h": 1 * 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "12h": 12 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
    };

    const now = Date.now();
    const cutoff = now - rangeMs[timeRange];
    return rawData.filter((p) => p.unixMs >= cutoff);
  }, [rawData, timeRange]);

  // Compute statistics from filtered data
  const stats = useMemo(() => {
    if (chartData.length === 0) return null;

    const temps = chartData.map((d) => d.suhu);
    const humids = chartData.map((d) => d.kelembapan);

    return {
      maxTemp: Math.max(...temps),
      minTemp: Math.min(...temps),
      avgTemp:
        Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
      maxHumid: Math.max(...humids),
      minHumid: Math.min(...humids),
      avgHumid:
        Math.round((humids.reduce((a, b) => a + b, 0) / humids.length) * 10) /
        10,
      totalEntries: chartData.length,
    };
  }, [chartData]);

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "1h", label: "1 Hour" },
    { value: "6h", label: "6 Hour" },
    { value: "12h", label: "12 Hour" },
    { value: "24h", label: "24 Hour" },
  ];

  return (
    <Card className="flex flex-col gap-4 p-4 w-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1">
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTimeRange(opt.value)}
              className={`px-3 py-1 text-xs font-bold border-2 transition-all cursor-pointer ${
                timeRange === opt.value
                  ? "bg-black text-white shadow-none"
                  : "bg-white text-black shadow-sm hover:shadow-none"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-sm font-bold text-gray-500 animate-pulse">
            Load data...
          </p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed">
          <p className="text-sm font-bold text-gray-500">
            Belum ada data dalam{" "}
            {timeRangeOptions.find((o) => o.value === timeRange)?.label}{" "}
            terakhir
          </p>
        </div>
      ) : (
        <div className="w-full h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fontWeight: "bold" }}
                tickLine={{ stroke: "#000" }}
                axisLine={{ stroke: "#000", strokeWidth: 2 }}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="temp"
                orientation="left"
                tick={{ fontSize: 11, fontWeight: "bold" }}
                tickLine={{ stroke: "#000" }}
                axisLine={{ stroke: "#000", strokeWidth: 2 }}
                label={{
                  value: "°C",
                  position: "insideTopLeft",
                  offset: 10,
                  style: { fontWeight: "bold", fontSize: 12 },
                }}
                domain={["auto", "auto"]}
              />
              <YAxis
                yAxisId="humid"
                orientation="right"
                tick={{ fontSize: 11, fontWeight: "bold" }}
                tickLine={{ stroke: "#000" }}
                axisLine={{ stroke: "#000", strokeWidth: 2 }}
                label={{
                  value: "%",
                  position: "insideTopRight",
                  offset: 10,
                  style: { fontWeight: "bold", fontSize: 12 },
                }}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, fontWeight: "bold" }}
                formatter={(value: string) =>
                  value === "suhu" ? "Temp (°C)" : "Humidity (%)"
                }
              />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="suhu"
                stroke="#eab308"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: "#000",
                  strokeWidth: 2,
                  fill: "#eab308",
                }}
              />
              <Line
                yAxisId="humid"
                type="monotone"
                dataKey="kelembapan"
                stroke="#4ade80"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: "#000",
                  strokeWidth: 2,
                  fill: "#4ade80",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="flex flex-col gap-1 font-bold px-3 py-2 text-xs border-2 shadow-sm bg-red-400">
            <p>Highest Temp</p>
            <p className="text-white">{stats.maxTemp}°C</p>
          </div>
          <div className="flex flex-col gap-1 font-bold px-3 py-2 text-xs border-2 shadow-sm bg-cyan-400">
            <p>Lowest Temp</p>
            <p className="text-white">{stats.minTemp}°C</p>
          </div>
          <div className="flex flex-col gap-1 font-bold px-3 py-2 text-xs border-2 shadow-sm bg-amber-400">
            <p>Average Temp</p>
            <p className="text-white">{stats.avgTemp}°C</p>
          </div>
          <div className="flex flex-col gap-1 font-bold px-3 py-2 text-xs border-2 shadow-sm bg-green-400">
            <p>Highest Humid</p>
            <p className="text-white">{stats.maxHumid}%</p>
          </div>
          <div className="flex flex-col gap-1 font-bold px-3 py-2 text-xs border-2 shadow-sm bg-teal-400">
            <p>Lowest Humid</p>
            <p className="text-white">{stats.minHumid}%</p>
          </div>
          <div className="flex flex-col gap-1 font-bold px-3 py-2 text-xs border-2 shadow-sm bg-purple-400">
            <p>Total Data</p>
            <p className="text-white">{stats.totalEntries} entry</p>
          </div>
        </div>
      )}
    </Card>
  );
};
