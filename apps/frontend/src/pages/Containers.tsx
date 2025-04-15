import { useState, useMemo } from "react";
import containers from "../mocks/containers.json";
import projects from "../mocks/projects.json";
import users from "../mocks/users.json";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const Containers = () => {
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Match each container to its project and owner
  const enrichedContainers = useMemo(() => {
    return containers.map((container) => {
      const matchedProject = projects.find((p) => p.name === container.name);
      const owner =
        matchedProject?.user ||
        users.find((u) => u.projects.includes(container.name))?.username;

      return { ...container, owner, project: matchedProject };
    });
  }, []);

  const filtered = enrichedContainers.filter((c) => {
    const matchesOwner = ownerFilter === "all" || c.owner === ownerFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesOwner && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Containers</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SummaryCard label="Total Containers" value={containers.length} />
        <SummaryCard
          label="Running"
          value={containers.filter((c) => c.status === "running").length}
        />
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4 col-span-1 sm:col-span-2 md:col-span-3">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Uptime by Container (minutes)</h2>
          <Bar
            data={{
              labels: containers.map((c) => c.name),
              datasets: [
                {
                  label: "Uptime",
                  data: containers.map((c) => parseUptimeToHours(c.uptime)),
                  backgroundColor: "#3b82f6"
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const rawUptime = containers[context.dataIndex].uptime;
                      return `Uptime: ${rawUptime}`;
                    }
                  }
                },
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: "#666",
                    callback: (value) => `${value}h`
                  },
                  title: {
                    display: true,
                    text: "Uptime (in hours)",
                    color: "#666"
                  }
                },
                x: {
                  ticks: { color: "#666" }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Owner Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Filter by Owner:
          </label>
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All</option>
            {users.map((u) => (
              <option key={u.username} value={u.username}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Filter by Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="all">All</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
          </select>
        </div>
      </div>
      
      {/* Container Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-gray-500 dark:text-gray-400 italic">
            No containers match the selected filters.
          </div>
        ) : (
          filtered.map((c) => (
            <ContainerCard
              key={c.id}
              name={c.name}
              image={c.image}
              status={c.status}
              ports={c.ports}
              uptime={c.uptime}
              project={c.project}
              owner={c.owner}
            />
          ))
        )}
      </div>
    </div>
  );
};

function ContainerCard({
  name,
  image,
  status,
  ports,
  uptime,
  owner,
  project,
}: {
  name: string;
  image: string;
  status: string;
  ports: { host: number; container: number }[];
  uptime: string;
  owner?: string;
  project?: { domain?: string };
}) {
  const badgeColor =
    status === "running"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-5 space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{name}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">Image: {image}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Ports:{" "}
        {ports.map((p, i) => (
          <span key={i}>
            {p.host} → {p.container}
            {i < ports.length - 1 && ", "}
          </span>
        ))}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Uptime: {uptime}</p>
      {owner && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Owner: {owner}</p>
      )}
      {project?.domain && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Domain: {project.domain}
        </p>
      )}
      <div className="pt-2">
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded ${badgeColor}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}

function parseUptimeToDaysAndHours(uptime: string): { days: number; hours: number } {
  const match = uptime.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
  const rawHours = match?.[1] ? parseInt(match[1]) : 0;
  const rawMinutes = match?.[2] ? parseInt(match[2]) : 0;

  // Total hours (rounded if needed)
  const totalHours = rawHours + rawMinutes / 60;

  // Calculate days and remaining hours
  const days = Math.floor(totalHours / 24);
  const hours = Math.round(totalHours % 24);

  return { days, hours };
}

function parseUptimeToHours(uptime: string): number {
  const match = uptime.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
  const hours = match?.[1] ? parseInt(match[1]) : 0;
  const minutes = match?.[2] ? parseInt(match[2]) : 0;
  return hours + minutes / 60;
}


export default Containers;
