import { useState } from "react";

import StatCard from "./StatsCard";
import Panel from "./Panel";

import overview from "../../mocks/overview.json";
import containers from "../../mocks/containers.json";
import users from "../../mocks/users.json";
import ssl from "../../mocks/ssl.json";
import metrics from "../../mocks/metrics.json";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Dashboard = () => {
  const chartData = {
    labels: metrics.timestamps.map((t) =>
      new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    ),
    datasets: [
      {
        label: "CPU (%)",
        data: metrics.cpu,
        borderColor: "#3b82f6",
        tension: 0.2,
      },
      {
        label: "Memory (%)",
        data: metrics.memory,
        borderColor: "#22c55e",
        tension: 0.2,
      },
      {
        label: "Disk (%)",
        data: metrics.disk,
        borderColor: "#f97316",
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" as const } },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: "#666" },
      },
      x: {
        ticks: { color: "#666" },
      },
    },
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>

      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="CPU Usage" value={overview.cpu} />
        <StatCard label="Memory Usage" value={overview.memory} />
        <StatCard label="Disk Usage" value={overview.disk} />
        <StatCard label="Uptime" value={overview.uptime} />
      </div>

      {/* Line Chart */}
      <Panel title="System Resource Usage Over Time">
        <Line data={chartData} options={chartOptions} />
      </Panel>

      {/* Project Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Panel title="Running Containers">
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {containers.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong> ({c.image}) - Port {c.ports[0].host} ➝{" "}
                {c.ports[0].container}, Uptime: {c.uptime}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Projects by User">
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {users.map((u) => (
              <li key={u.username}>
                <strong>{u.username}:</strong> {u.projects.length} project
                {u.projects.length > 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* SSL Certificate Warnings */}
      <Panel title="SSL Certificates Expiring Soon">
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          {ssl.map((cert) => (
            <li key={cert.domain}>
              {cert.days_remaining <= 30 ? "⚠️" : "🔒"}{" "}
              <strong>{cert.domain}</strong> – expires in{" "}
              <strong>{cert.days_remaining} days</strong> (Issuer: {cert.issuer})
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
};

export default Dashboard;
