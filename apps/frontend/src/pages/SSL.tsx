import { useState, useMemo } from "react";
import ssl from "../../mocks/ssl.json";
import projects from "../../mocks/projects.json";
import users from "../../mocks/users.json";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SSL = () => {
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");


  const enrichedCerts = useMemo(() => {
    return ssl.map((cert) => {
      const project = projects.find((p) => p.domain === cert.domain);
      const owner =
        project?.user ||
        users.find((u) => u.projects.includes(cert.domain.split(".")[0]))?.username;
      const days = cert.days_remaining;
      const status =
        days <= 0 ? "expired" : days <= 30 ? "expiring" : "valid";
      return { ...cert, owner, status, expires_at: cert.valid_to };
    });
  }, []);

  const filteredCerts = enrichedCerts.filter((c) => {
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesQuery = c.domain.includes(searchQuery.toLowerCase());
    const matchesOwner =
      ownerFilter === "all"
        ? true
        : (c.owner ?? "unknown") === ownerFilter;
    return matchesStatus && matchesQuery && matchesOwner;
  });


  const total = enrichedCerts.length;
  const expiring = enrichedCerts.filter((c) => c.status === "expiring").length;
  const expired = enrichedCerts.filter((c) => c.status === "expired").length;

  const certsByOwner = useMemo(() => {
    const counts: Record<string, number> = {};
    enrichedCerts.forEach((c) => {
      const key = c.owner || "unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [enrichedCerts]);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">SSL Certificates</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Total Certificates" value={total} />
        <SummaryCard label="Expiring Soon" value={expiring} />
        <SummaryCard label="Expired" value={expired} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
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
            {[...new Set(enrichedCerts.map((c) => c.owner ?? "unknown"))]
              .sort()
              .map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
          </select>
        </div>
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
            <option value="valid">Valid</option>
            <option value="expiring">Expiring</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Search Domain:
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. alice.com"
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Cert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCerts.map((cert) => (
          <CertCard key={cert.domain} {...cert} />
        ))}
      </div>

      {/* Chart: Certificates by Owner */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Certificates by Owner
        </h2>
        <Bar
          data={{
            labels: Object.keys(certsByOwner),
            datasets: [
              {
                label: "Certificates",
                data: Object.values(certsByOwner),
                backgroundColor: "#3b82f6"
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#666" }
              },
              x: {
                ticks: { color: "#666" }
              }
            }
          }}
        />
      </div>

      {/* Chart: Days Remaining Distribution */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-5">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Days Remaining Distribution
        </h2>
        <Bar
          data={{
            labels: enrichedCerts.map((c) => c.domain),
            datasets: [
              {
                label: "Days Remaining",
                data: enrichedCerts.map((c) => c.days_remaining),
                backgroundColor: enrichedCerts.map((c) =>
                  c.status === "expired"
                    ? "#ef4444"
                    : c.status === "expiring"
                      ? "#f97316"
                      : "#10b981"
                )
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    `${ctx.raw} day${ctx.raw === 1 ? "" : "s"} remaining`
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Days Remaining",
                  color: "#666"
                },
                ticks: { color: "#666" }
              },
              x: {
                ticks: { color: "#666" }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}

function CertCard({
  domain,
  days_remaining,
  status,
  issuer,
  expires_at,
  owner
}: {
  domain: string;
  days_remaining: number;
  status: string;
  issuer: string;
  expires_at?: string;
  owner?: string;
}) {
  const statusColors = {
    valid: "bg-green-100 text-green-800",
    expiring: "bg-orange-100 text-orange-800",
    expired: "bg-red-100 text-red-800"
  };

  const handleRenew = (domain: string) => {
    alert(`Renewal requested for ${domain}`);
    // TODO: Hook into backend API or renewal script
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-5 space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{domain}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Days Remaining: {days_remaining}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Expiry Date: {expires_at || "N/A"}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Issuer: {issuer}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Owner: {owner ?? "Unknown"}
      </p>

      <div className="w-full pt-2 flex justify-between">
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded ${statusColors[status as keyof typeof statusColors]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
        <button
          onClick={() => handleRenew(domain)}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded transition cursor-pointer∑"
        >
          Renew Certificate
        </button>
      </div>
    </div>
  );
}

export default SSL;
