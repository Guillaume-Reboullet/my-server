import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { label: 'Dashboard', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Containers', to: '/containers' },
    { label: 'SSL Certs', to: '/ssl' },
    { label: 'Docs', to: '/docs' },
  ];

  return (
    <aside className="min-w-80 bg-gray-900 text-white p-4 space-y-4 h-screen fixed">
      <h1 className="text-xl font-bold mb-6">My Server</h1>
      {navItems.map(({ label, to }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `text-3xl block py-2 px-3 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          {label}
        </NavLink>
      ))}
    </aside>
  );
}

export default Sidebar;