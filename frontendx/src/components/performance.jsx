import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getperformance } from "../api/analysis";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const toLocalDateKey = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const toKey = (value) => {
  if (value instanceof Date) return toLocalDateKey(value);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return toLocalDateKey(d);
};

const groupByDay = (data, valueKey) => {
  const map = {};
  data.forEach((item) => {
    const k = toKey(item.date);
    if (!k) return;
    const value = Number(item[valueKey]);
    if (!Number.isFinite(value)) return;
    if (!map[k]) map[k] = { total: 0, count: 0 };
    map[k].total += value;
    map[k].count++;
  });
  return Object.keys(map).map((k) => ({
    date: k,
    value: Number((map[k].total / map[k].count).toFixed(1)),
  }));
};

const groupByMonth = (data) => {
  const map = {};
  data.forEach((item) => {
    const d = new Date(`${item.date}T00:00:00`);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map[key]) map[key] = { total: 0, count: 0, d };
    map[key].total += item.value;
    map[key].count++;
  });
  return Object.values(map).map((v) => ({
    date: toKey(v.d),
    value: Number((v.total / v.count).toFixed(1)),
  }));
};

const fillLastNDays = (data, n) => {
  const map = {};
  data.forEach((d) => {
    map[toKey(d.date)] = d.value;
  });
  const res = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const k = toKey(d);
    res.push({ date: k, value: map[k] ?? null });
  }
  return res;
};

const sortByDate = (arr) => arr.sort((a, b) => new Date(a.date) - new Date(b.date));

const formatLabel = (dateStr, range) => {
  const d = new Date(`${dateStr}T00:00:00`);
  if (range === "weekly") return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
  if (range === "monthly") return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  if (range === "yearly") return d.toLocaleDateString("en-US", { month: "short" });
  return dateStr;
};

const buildSeries = (raw, range, valueKey) => {
  let data = groupByDay(raw || [], valueKey);
  if (range === "weekly") data = fillLastNDays(data, 7);
  else if (range === "monthly") data = fillLastNDays(data, 30);
  else if (range === "yearly") data = groupByMonth(data);
  data = sortByDate(data);
  return {
    dates: data.map((d) => d.date),
    labels: data.map((d) => formatLabel(d.date, range)),
    values: data.map((d) => d.value),
  };
};

const formatSeconds = (secondsValue) => {
  const sec = Number(secondsValue);
  if (!Number.isFinite(sec) || sec <= 0) return "0s";
  const totalSeconds = Math.floor(sec);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const chartOptions = (dates, range, yLabel = "") => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#ffffff" } },
    tooltip: {
      callbacks: {
        title: (ctx) => {
          const i = ctx[0]?.dataIndex ?? 0;
          const rawDate = dates[i];
          if (!rawDate) return "";
          return range === "yearly"
            ? new Date(`${rawDate}T00:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })
            : new Date(`${rawDate}T00:00:00`).toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              });
        },
      },
    },
  },
  scales: {
    x: { ticks: { color: "#d1d5db" }, grid: { color: "rgba(255,255,255,0.08)" } },
    y: {
      beginAtZero: true,
      ticks: { color: "#d1d5db" },
      grid: { color: "rgba(255,255,255,0.08)" },
      title: yLabel ? { display: true, text: yLabel, color: "#ffffff" } : undefined,
    },
  },
});

const Performance = () => {
  const [page] = useState("Performance");
  const [activeFilter, setActiveFilter] = useState("All Analysis");
  const [range, setRange] = useState("yearly");
  const [Pdata, setPdata] = useState({});
  const { user } = useSelector((state) => state.auth);
  const currentUser = user?.user ?? user;
  const userId = currentUser?._id;

  useEffect(() => {
    const fetchPerformance = async () => {
      if (!userId) {
        setPdata({});
        return;
      }

      try {
        const res = await getperformance(userId, range);
        setPdata(res || {});
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchPerformance();
  }, [userId, range]);

  const filters = [
    "All Analysis",
    "Score Trend Over Time",
    "Accuracy Trend",
    "Time Analysis",
    "Mode-Based Performance",
    "Performance Distribution",
    "Weakness Detection Logic",
    "Improvement Detection",
  ];

  const shouldShow = (cardName) => activeFilter === "All Analysis" || activeFilter === cardName;

  const scoreSeries = useMemo(() => buildSeries(Pdata.scoreTrend, range, "score"), [Pdata.scoreTrend, range]);
  const accuracySeries = useMemo(() => buildSeries(Pdata.accuracyTrend, range, "accuracy"), [Pdata.accuracyTrend, range]);

  const scoreData = {
    labels: scoreSeries.labels,
    datasets: [
      {
        label: "Score",
        data: scoreSeries.values,
        borderColor: "#60a5fa",
        backgroundColor: "rgba(96,165,250,0.15)",
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const accuracyData = {
    labels: accuracySeries.labels,
    datasets: [
      {
        label: "Accuracy %",
        data: accuracySeries.values,
        borderColor: "#34d399",
        backgroundColor: "rgba(52,211,153,0.15)",
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const distributionData = {
    labels: ["High (80%+)", "Medium (60-79%)", "Low (<60%)"],
    datasets: [
      {
        label: "Attempts",
        data: [
          Pdata?.distribution?.high ?? 0,
          Pdata?.distribution?.medium ?? 0,
          Pdata?.distribution?.low ?? 0,
        ],
        backgroundColor: ["rgba(52,211,153,0.7)", "rgba(250,204,21,0.7)", "rgba(248,113,113,0.7)"],
        borderColor: ["#34d399", "#facc15", "#f87171"],
        borderWidth: 1,
      },
    ],
  };

  const timeSeries = useMemo(() => {
    const raw = buildSeries(Pdata.timeTrend, range, "avgTimePerQuestion");
    return {
      ...raw,
      values: raw.values.map((v) => (v == null ? null : Number((v / 60).toFixed(2)))),
    };
  }, [Pdata.timeTrend, range]);
  const timeData = {
    labels: timeSeries.labels,
    datasets: [
      {
        label: "Avg Time / Question (min)",
        data: timeSeries.values,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.15)",
        pointRadius: 3,
        pointHoverRadius: 6,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const modeData = {
    labels: (Pdata?.modePerformance || []).map((m) => m.mode),
    datasets: [
      {
        label: "Accuracy %",
        data: (Pdata?.modePerformance || []).map((m) => m.accuracy),
        backgroundColor: "rgba(96,165,250,0.7)",
        borderColor: "#60a5fa",
        borderWidth: 1,
      },
      {
        label: "Attempts",
        data: (Pdata?.modePerformance || []).map((m) => m.attempts),
        backgroundColor: "rgba(52,211,153,0.6)",
        borderColor: "#34d399",
        borderWidth: 1,
      },
    ],
  };

  const weaknessData = {
    labels: (Pdata?.weaknessDetection || []).map((w) => w.area),
    datasets: [
      {
        label: "Weak Accuracy %",
        data: (Pdata?.weaknessDetection || []).map((w) => w.accuracy),
        backgroundColor: "rgba(248,113,113,0.75)",
        borderColor: "#f87171",
        borderWidth: 1,
      },
    ],
  };

  const improvementData = {
    labels: ["First Half Avg", "Second Half Avg", "Change"],
    datasets: [
      {
        label: "Improvement %",
        data: [
          Pdata?.improvement?.firstAvg ?? 0,
          Pdata?.improvement?.secondAvg ?? 0,
          Pdata?.improvement?.change ?? 0,
        ],
        backgroundColor: ["rgba(96,165,250,0.75)", "rgba(52,211,153,0.75)", "rgba(250,204,21,0.75)"],
        borderColor: ["#60a5fa", "#34d399", "#facc15"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full bg-black overflow-y-auto pt-5 pb-6 min-h-screen">
      <div className="mt-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-700 mb-10">
          <h1 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ECFEFF] to-gray-400 f3 tracking-tight drop-shadow-sm">{page}</h1>
        </div>
      </div>

      <div className="rounded-[40px] p-2 md:p-12">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="px-5 py-2 bg-black border border-white/10 text-white rounded-full transition-all focus:outline-none f3">
              {activeFilter} <i className="ri-arrow-drop-down-fill text-2xl align-middle"></i>
            </MenuButton>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute mt-2 w-72 origin-top-left bg-[#121212] border border-white/10 rounded-2xl shadow-2xl z-50 p-2 focus:outline-none">
                {filters.map((f) => (
                  <MenuItem key={f}>
                    {({ focus }) => (
                      <button
                        onClick={() => setActiveFilter(f)}
                        className={`${focus || activeFilter === f ? "bg-[#2fc007]/20 text-[#ECFEFF]" : "text-white/60"} group flex w-full items-center rounded-xl px-4 py-3 text-sm transition-colors font-bold`}
                      >
                        {f}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>

          <Menu as="div" className="relative inline-block">
            <MenuButton className="px-4 py-2 rounded-full capitalize bg-white/20 text-white border border-white/20">
              Range: {range}
            </MenuButton>
            <Transition as={Fragment} enter="transition duration-100 ease-out" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition duration-75 ease-in" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <MenuItems className="absolute right-0 mt-2 w-44 rounded bg-white shadow ring-1 ring-black/5 z-50">
                {["weekly", "monthly", "yearly"].map((r) => (
                  <MenuItem key={r}>
                    {({ active }) => (
                      <button
                        className={`block w-full px-4 py-2 text-left capitalize ${active ? "bg-gray-100" : ""}`}
                        onClick={() => setRange(r)}
                      >
                        {r}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-12">
          {shouldShow("Score Trend Over Time") && (
            <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h3 className="text-xl font-black text-[#ECFEFF] mb-4">Score Trend Over Time</h3>
              <div className="bg-white/5 p-6 rounded-3xl h-[360px] shadow-xl">
                <Line data={scoreData} options={chartOptions(scoreSeries.dates, range, "Score")} />
              </div>
            </div>
          )}

          {shouldShow("Accuracy Trend") && (
            <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h3 className="text-xl font-black text-[#ECFEFF] mb-4">Accuracy Trend</h3>
              <div className="bg-white/5 p-6 rounded-3xl h-[360px] shadow-xl">
                <Line data={accuracyData} options={chartOptions(accuracySeries.dates, range, "Accuracy %")} />
              </div>
            </div>
          )}

          {shouldShow("Time Analysis") && (
            <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h3 className="text-xl font-black text-[#ECFEFF] mb-4">Time Analysis</h3>
              <div className="bg-white/5 p-6 rounded-3xl h-[360px] shadow-xl">
                <Line data={timeData} options={chartOptions(timeSeries.dates, range, "Minutes")} />
              </div>
            </div>
          )}

          {shouldShow("Mode-Based Performance") && (
            <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h3 className="text-xl font-black text-[#ECFEFF] mb-4">Mode-Based Performance</h3>
              <div className="bg-white/5 p-6 rounded-3xl h-[360px] shadow-xl">
                <Bar data={modeData} options={chartOptions([], range, "Value")} />
              </div>
            </div>
          )}

          {shouldShow("Performance Distribution") && (
            <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h3 className="text-xl font-black text-[#ECFEFF] mb-4">Performance Distribution</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">High (80%+): {Pdata?.distribution?.high ?? 0}</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">Medium (60-79%): {Pdata?.distribution?.medium ?? 0}</div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">Low (&lt;60%): {Pdata?.distribution?.low ?? 0}</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-3xl h-[320px]">
                  <Bar data={distributionData} options={chartOptions([], range, "Attempts")} />
                </div>
                <div className="bg-white/5 p-6 rounded-3xl h-[320px] flex items-center justify-center">
                  <Doughnut
                    data={distributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { labels: { color: "#fff" } } },
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {shouldShow("Improvement Detection") && (
            <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h3 className="text-xl font-black text-[#ECFEFF] mb-4">Improvement Detection</h3>
              <div className="bg-white/5 p-6 rounded-3xl h-[320px] shadow-xl mb-6">
                <Bar data={improvementData} options={chartOptions([], range, "Accuracy %")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Status: <span className="font-bold">{Pdata?.improvement?.status ?? "No Data"}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Change: <span className="font-bold">{Pdata?.improvement?.change ?? 0}%</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Avg Time / Quiz: <span className="font-bold">{formatSeconds(Pdata?.summary?.avgTimePerQuiz)}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Avg Time / Question: <span className="font-bold">{formatSeconds(Pdata?.summary?.avgTimePerQuestion)}</span>
                </div>
              </div>
            </div>
          )}

          {shouldShow("Weakness Detection Logic") && (
            <div className="p-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <h3 className="text-xl font-black text-[#ECFEFF] mb-4">Weakness Detection Logic</h3>
              <div className="bg-white/5 p-6 rounded-3xl h-[320px] shadow-xl mb-6">
                <Bar data={weaknessData} options={chartOptions([], range, "Accuracy %")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(Pdata?.weaknessDetection || []).map((w) => (
                  <div key={w.area} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
                    <p className="font-bold capitalize">{w.area}</p>
                    <p className="text-sm text-white/70">Accuracy: {w.accuracy}%</p>
                    <p className="text-sm text-white/70">Attempts: {w.attempts}</p>
                    <p className="text-sm text-white/70">Severity: {w.severity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Performance;
