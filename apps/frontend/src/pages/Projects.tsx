import { useState } from "react";
import users from "../mocks/users.json";
import projects from "../mocks/projects.json";

const Projects = () => {
  const [userFilter, setUserFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = projects.filter((project) => {
    const matchesUser = userFilter === "all" || project.user === userFilter;
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesUser && matchesStatus;
  });

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Projects Overview</h1>

      {/* User-based view from users.json */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Users & Their Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <div key={user.username} className="bg-white dark:bg-gray-900 rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {user.username}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Home Directory: {user.home}
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {user.projects.map((project) => (
                  <li key={project}>{project}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>


      {/* Project Grid from projects.json */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Project Details</h2>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          {/* User Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Filter by Owner:
            </label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-gray-500 dark:text-gray-400 italic">
              No projects match the selected filters.
            </div>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard key={project.name + project.user} {...project} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

function ProjectCard({
  name,
  user,
  domain,
  port,
  stack,
  status,
  updated_at,
}: {
  name: string;
  user: string;
  domain: string;
  port: number;
  stack: { frontend?: string; backend?: string };
  status: string;
  updated_at: string;
}) {
  const badgeColor =
    status === "running" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-5 space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{name}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">Owner: {user}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Domain: {domain}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Port: {port}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Stack:{" "}
        {stack.frontend && <span>Frontend ({stack.frontend})</span>}
        {stack.frontend && stack.backend && " + "}
        {stack.backend && <span>Backend ({stack.backend})</span>}
      </p>
      <div className="flex justify-between items-center pt-2">
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded ${badgeColor}`}
        >
          {status}
        </span>
        <span className="text-xs text-gray-400">
          Updated: {new Date(updated_at).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

export default Projects;
