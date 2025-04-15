const StatCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
    </div>
  );
}

export default StatCard;