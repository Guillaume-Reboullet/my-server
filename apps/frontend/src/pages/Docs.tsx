import { useEffect } from "react";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "architecture", title: "Server Architecture" },
  { id: "deployment", title: "Deploying a Project" },
  { id: "ssl", title: "SSL & HTTPS" },
  { id: "monitoring", title: "Monitoring & Alerts" },
];

const Docs = () => {
  useEffect(() => {
    document.title = "Server Documentation";
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-64 p-6 border-r dark:border-gray-700 hidden md:block">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Docs</h2>
        <ul className="space-y-2 text-sm">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-gray-600 dark:text-gray-300 hover:underline"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 space-y-20 overflow-y-auto">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{section.title}</h2>
            {renderSection(section.id)}
          </section>
        ))}
      </main>
    </div>
  );
};

const renderSection = (id: string) => {
  switch (id) {
    case "overview":
      return (
        <p className="text-gray-700 dark:text-gray-300">
          This documentation provides an overview of the server’s architecture, how projects are deployed,
          SSL practices, and monitoring standards. It’s designed to help developers understand the system and contribute efficiently.
        </p>
      );
    case "architecture":
      return (
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            The server is hosted on OVH and runs <strong>Debian 12</strong>. It is accessed by two user accounts who can each deploy and manage their own apps.
          </p>

          <p>
            Every request from a user's browser follows a secured HTTPS workflow:
          </p>

          <ol className="list-decimal list-inside space-y-1">
            <li>
              A user makes an HTTPS request (e.g., <code>https://your-website.com</code>) in their browser.
            </li>
            <li>
              The domain is resolved via DNS, which points to your OVH server's IP address.
            </li>
            <li>
              The request reaches <strong>Nginx</strong> on port <code>443</code> (HTTPS).
            </li>
            <li>
              Nginx uses <code>proxy_pass</code> to route the request to a local port (e.g., <code>localhost:3001</code>).
            </li>
            <li>
              This local port is mapped to a running Docker container via the <code>ports</code> section in <code>docker-compose.yml</code> (e.g., <code>3001:3000</code>).
            </li>
            <li>
              Inside the container, the app (React, NestJS, etc.) handles the request and returns a response (usually HTML or JSON).
            </li>
            <li>
              The response is passed back through Nginx, where it’s encrypted with TLS (Let’s Encrypt certificate).
            </li>
            <li>
              The browser receives the encrypted response and renders the HTML.
            </li>
          </ol>

          <p>
            This layered architecture ensures isolation (via Docker), security (via Nginx and Certbot), and maintainability (one reverse proxy serving multiple containers).
          </p>
        </div>
      );
    case "deployment":
      return (
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
          <li>Create a folder in <code>/apps</code> for frontend and backend.</li>
          <li>Add services to <code>docker-compose.yml</code>.</li>
          <li>Use consistent ports (e.g. Alice → 300x, Bob → 400x).</li>
          <li>Mount your <code>.env</code> file and volumes.</li>
          <li>Run: <code>docker compose up -d --build</code></li>
        </ul>
      );
    case "ssl":
      return (
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
          <li>All domains are secured with Let's Encrypt via Certbot.</li>
          <li>Certificates are stored in <code>/etc/letsencrypt</code>.</li>
          <li>Mounted in the container using read-only volumes.</li>
          <li>Tracked on the SSL page with badge indicators.</li>
        </ul>
      );
    case "monitoring":
      return (
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
          <li>"My server" tracks container status, SSL expiry, and system resources.</li>
        </ul>
      );
    default:
      return null;
  }
};

export default Docs;
