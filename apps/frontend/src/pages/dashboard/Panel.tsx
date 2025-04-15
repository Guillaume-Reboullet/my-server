const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{title}</h2>
      {children}
    </div>
  );
}

export default Panel;